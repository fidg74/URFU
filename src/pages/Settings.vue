<template>
  <b-container>
    <h1>Настройки Сервиса</h1>
    <Tabs
      v-model="tabValue"
      :items="[
        { label: 'Сроки подачи заявок', value: 'deadlines' },
        { label: 'Тексты уведомления в заявках', value: 'texts' },
      ]"
    />

    <b-row v-if="tabValue === 'deadlines'" class="mt-4">
      <b-col cols="9">
        <b-card class="card_content mt-0">
          <div class="tab-list">
            <div class="row mb-2 words-above">
              <div class="zp_caption row">
                <div class="col-12 mb-2">Сроки подачи заявок</div>
              </div>
              <div class="zp_description">
                Укажите дату окончания подачи заявок. Заявки, поданные после
                этой даты, будут перенесены на следующий семестр.
              </div>
            </div>
            <b-card
              no-body
              class="mb-1"
              v-for="(semesterby, title) in reversedSemesterGroupByYear"
              :key="title.replace('/', '-')"
            >
              <b-card-header
                v-b-toggle="'accordion-' + title.replace('/', '-')"
                class="accord-head"
              >
                <b-card-header block variant="" class="title_card">{{
                  title
                }}</b-card-header>
                <b-icon
                  icon="caret-down-fill"
                  style="color: #AAA;"
                  font-scale="0.7"
                />
                <b-icon
                  icon="caret-up-fill"
                  style="color: #AAA;"
                  font-scale="0.7"
                />
              </b-card-header>
              <b-collapse
                :id="'accordion-' + title.replace('/', '-')"
                :visible="
                  semesterby[0].is_actual ||
                    (semesterby[1] && semesterby[1].is_actual)
                "
                accordion="my-accordion"
                role="tabpanel"
              >
                <b-card-body>
                  <div class="row two_pickers">
                    <div
                      v-for="semester in semesterby"
                      :key="semester.id"
                      class="col-6 lkp-data-picker"
                    >
                      <div class="semester_period">
                        {{ semester.period }} семестр
                      </div>
                      <div class="datepicker-trigger">
                        <b-form-input
                          :id="'picker_prefix' + semester.id"
                          size="md"
                          placeholder="Выберите дату"
                          :value="formatDate(semester.deadline)"
                        />
                        <b-icon
                          icon="calendar4"
                          font-scale="1.2"
                          style="color: #467BE3;"
                          class="datepicker-icon"
                        />
                        <AirbnbStyleDatepicker
                          :trigger-element-id="'picker_prefix' + semester.id"
                          :mode="'single'"
                          :months-to-show="1"
                          :fullscreen-mobile="true"
                          :date-one="semester.deadline"
                          @date-one-selected="
                            (val) =>
                              onSelectDate(val, semester.id, semester.deadline)
                          "
                        />
                      </div>
                    </div>
                  </div>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <b-row v-else class="mt-4">
      <b-col cols="9">
        <b-card class="card_content mt-0">          
              <div class="zp_caption ">
                <div class="col-12 mb-2 ml-n3">Текст уведомления в&nbsp;заявках</div>
              </div>
              <div class="zp_description">
                Напишите текст уведомления. Максимальное количество символов — 200.
              </div>

                <b-form-textarea
                  id="textarea"
                  v-model="zp_notif_text"
                  placeholder="Пример: расскажите о задаче, это поможет преподавателям и студентам сделать выбор проекта."
                  rows="5"
                  max-rows="6"
                  size="md"
                  maxlength=200
                class="mt-5"></b-form-textarea>
              
              
                <div>
                  <b-button variant="primary zp_notif__button" @click="saveText"
                    >Сохранить</b-button
                  >
                </div>
                <hr class="hr_full"/>
                  <div
                  class="h1__description zp_under_button zp_preview">
                <h2 class="zp__h1__black">Предпросмотр:</h2>
                </div>

                <div
                  class="h1__description zp_under_button">
                <h1 class="zp__h1__black">Заявки</h1>
                </div>

                <div
                  class="h1__description zp_under_button"
                  v-if="this.semesterActual && this.semesterActual.period"
                >                
                  Подайте заявку на
                  {{ this.semesterActual.period.toLowerCase() }} семестр
                  {{ this.semesterActual.year }} до
                  {{ this.formatDate(this.semesterActual.deadline) }}.
                </div>


                <div class="h1__description zp_under_button">
                  {{ zp_notif_text }}                  
                </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { errorMessage, infoMessage } from "@/utils";
import format from "date-fns/format";
import Tabs from "@/components/Tabs";

export default {
  name: "settings",
  components: {
    Tabs,    
  },
  data() {
    return {
      tabValue: "deadlines",
      zp_notif_text: ''      
    };
  },
  created() {
    this.zp_notif_text = this.getVariable(1).text
  },  
  methods: {
    saveText() {
      // Сохранение нового текста
      this.$axios
        .patch(this.learning_src + "variable/1/", {
          text: this.zp_notif_text,
        })
        .then(() => {
          this.$store.dispatch("api/FETCH_variable");
          infoMessage("Текст успешно изменен");
        })
        .catch((error) => {
          errorMessage(error);
        });
    },
    formatDate: (date) => format(date, "DD.MM.YYYY"),
    onSelectDate(val, id, old_date) {
      if (val && val != old_date) {
        // Запрос
        this.$axios
          .patch(this.learning_src + "semester/" + id, {
            deadline: val,
          })
          .then(() => {
            this.$store.dispatch("api/FETCH_semester");
            infoMessage("Дата успешно установлена");
          })
          .catch((error) => {
            errorMessage(error);
          });
      }
    },
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
      semesters: (state) => state.api.semester,
      learning_src: (state) => state.api.learning_src,
    }),
    ...mapGetters("api", ["semesterGroupByYear", "semesterActual", "getVariable"]),
    reversedSemesterGroupByYear() {
      const ordered = {};
      const arr_ordered = [];
      for (let i in this.semesterGroupByYear) {
        arr_ordered.push(i);
      }
      arr_ordered.sort();
      arr_ordered.reverse();
      for (let i in arr_ordered) {
        ordered[arr_ordered[i]] = this.semesterGroupByYear[arr_ordered[i]];
      }
      return ordered;
      // return 0
    },

  }
  
};
</script>

<style scoped>
.zp_caption {
  font-size: 1.2em;
  font-weight: bold;
}
.zp_description {
  font-size: 1.1em;
  color: #777;
}
.semester_period {
  font-weight: bold;
  color: #777;
  margin-bottom: 5px;
}
.bi-caret-up-fill,
.bi-caret-down-fill {
  position: absolute;
  right: 1rem;
  top: 2rem;
}
.accord-head {
  position: relative;
  padding: 0.5rem;
  padding-left: 0px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.datepicker-trigger {
  position: relative;
}
.datepicker-icon {
  position: absolute;
  right: 0.7rem;
  top: 0.7rem;
}
.title_card {
  height: 1rem;
  border: 0px;
  padding-bottom: 2rem;
  padding-left: 0px;
}
.not-collapsed .bi-caret-down-fill {
  visibility: hidden;
}
.collapsed .bi-caret-up-fill {
  visibility: hidden;
}
.accord-head:focus {
  outline: none;
}

.two_pickers {
  margin-left: 0px;
  margin-right: -50px;
}
.two_pickers {
  margin-left: -50px;
}

.tab-list .card:nth-child(2) {
  border-top: none !important;
}

.tab-list .card {
  box-shadow: none;
  border-top: 1px solid rgba(0, 0, 0, 0.125);
}

.card-header {
  border-bottom: none;
}
.asd__month-table {
  margin-top: 45px;
}
.words-above {
  margin-left: 3px;
  margin-right: 10px;
}
.zp_notif_text_form {
  margin-top: 1.6rem;
  margin-left: -1rem;
}
.zp_notif__button {
  margin-top: 1.7rem;
  margin-bottom: 1rem;
}
.zp_under_input{
  margin-left: 15px;
}
.zp_under_button{
  margin-top: 1rem;  
}
.zp__h1__black{
  color:black;
}
.zp_preview{
  margin-top: 1.4rem;
}
</style>
