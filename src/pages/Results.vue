<template>
  <b-container>
    <b-button variant="primary" class="btn_flat mb-3" to="/implementations">
      <i class="fas fa-arrow-left" />
      <span>Все проекты</span>
    </b-button>

    <template v-if="project">
      <h1>{{ project.name }}</h1>
      <div class="h1__description">
        Паспорт №{{ project.uid }} от {{ formatDate(project.passport_date) }} <br>
        на основании заявки №{{ project.uid }} от {{ formatDate(project.date) }}
      </div>
      <div class="mt-4">
        <div class="ui-tabs">
          <label class="ui-tabs__item">
            <div class="ui-tabs__label" @click="$router.push(`/requests/${ $route.params.id }`)">Заявка на проект</div>
          </label>
          <label class="ui-tabs__item">
            <div class="ui-tabs__label" @click="$router.push(`/passport/${ $route.params.id }`)">Паспорт проекта</div>
          </label>
          <label class="ui-tabs__item">
            <div class="ui-tabs__label" @click="$router.push(`/passport/${ $route.params.id }/implementation/`)">Реализация проекта</div>
          </label>
          <label class="ui-tabs__item active">
            <div class="ui-tabs__label">Итоги и защита проекта</div>
          </label>
        </div>
      </div>

      <b-card class="card_content">
        <h2>Дата защиты проекта</h2>
        
        <b-table-simple borderless class="table-defence">
          <b-thead class="table-defence__head">
            <b-tr>
              <b-td>Дата защиты</b-td>
              <b-td>Время</b-td>
              <b-td>Место</b-td>
              <b-td>Формат проведения</b-td>
            </b-tr>
          </b-thead>
          <b-tr>
            <b-td>{{ formatDate(new Date()) }}</b-td>
            <b-td>{{ formatTime(new Date()) }}</b-td>
            <b-td>ул. Софьи Ковалевской, 5, Т-124</b-td>
            <b-td>Очно</b-td>
          </b-tr>
        </b-table-simple>

        <div class="iteration__files">
          <h3>Приложенные документы</h3>
          <template v-for="file in summary_documents">
            <FileDownload v-if="!file.is_dir" :file="file" :key="file.id" class="mt-4 iteration__file">
              <a v-if="file.link" class="btn btn-secondary" :href="file.link" target="_blank">Открыть</a>
              <b-button v-else @click="downloadFile(copy, file)">Скачать</b-button>
            </FileDownload>
            <div v-else :key="file.id" class="iteration__folder" @click="copy.filesLvl = file.id">
              <svg viewBox="0 0 512 512" class="iteration__folder-icon">
                <path fill="currentColor" d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z" />
              </svg>
              <div class="iteration__folder-name">
                {{ file.title }}
              </div>
            </div>
          </template>
        </div>

        <div class="defence__btns">
          <b-btn>Согласовать</b-btn>
          <b-btn variant="danger">Отказаться</b-btn>
        </div>
      </b-card>

      <b-card class="card_content">
        <h2>Сводная оценка экспертной комиссии</h2>
        <div class="text-subtitle">Формула расчета СОЭК: 0,5 оценка заказчика + 0,5 средняя оценка экспертной комиссии.</div>
        <div class="message-res message-res_info">
          <b-icon-info-circle-fill class="mr-4" /> После защиты проекта вы можете проставить оценки
        </div>

        <b-row v-if="copies && copies.length">
          <b-col cols="4" v-for="copy in copies" :key="copy.id">
            <b-form-group :label="copy.team" class="mt-4">
              <b-form-input
                :disabled = "copy.experts_score_ext !== null"
                v-model.number="copy.experts_score_ext_new"
                type="number"
                @keypress="isRating"
                min="0"
                max="100"                
                autocomplete="off"
                placeholder="Введите от 0 до 100 баллов"
              />              
            </b-form-group>
          </b-col>
          <b-button @click="sendRating(copies)"> Сохранить </b-button>
        </b-row>
      </b-card>

    </template>

  </b-container>
</template>

<script>
import { mapState } from 'vuex'

import format from 'date-fns/format'
import { dateToWord, declOfNum, model } from '@/utils'
import FileDownload from '@/components/FileDownload'
import fileSave from '@/utils/fileSave'


export default {
  name: 'ResultsProject',
  components: {
    FileDownload
  },
  data () {
    return {
      copies: null,      
    }
  },
  created () {
    this.loadProject()
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.loadProject()
  },
  methods: {
    model,
    formatDate: date => format(date, 'DD.MM.YYYY'),
    formatTime: date => format(date, 'HH:mm'),
    dateToWord: date => dateToWord(date),
    declOfNum: (num, word) => declOfNum(num, word),
    loadProject () {
      this.$store.dispatch('project/FETCH_project', { id: this.$route.params.id })
      this.$store.dispatch('project/FETCH_instances', { id: this.$route.params.id }).then((data) => {
        if (!data || !data.length) return
        const copies = data.map((copy) => ({          
          ...copy,          
          team: 'Команда №' + copy.instance_number,
          experts_score_ext_new : copy.experts_score_ext ?? null
        }))
        this.copies = copies
      })
    },

    // Метод downloadFile нужно будет актуализировать при привязке
    downloadFile (copy, file) {
      this.$axios.get(this.learning_src + 'passport/' + this.$route.params.id + '/imp_file/', {
        responseType: 'blob',
        params: {
          file: file.id,
          team: copy.id
        }
      }).then(res => {
        let fn = res.headers['content-disposition'].split("''")
        fileSave(res.data, (fn[1] || file.title || file.human_name))
      })
    },
    isRating (evt) {
      evt = (evt) ? evt : window.event
      const charCode = (evt.which) ? evt.which : evt.keyCode
      if (evt.target.value > 100) {
        evt.preventDefault()
      }
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault()
      } else {
        return true
      }
    },
    sendRating(data) {
      // TODO: Отправка оценки
      this.$axios.post(`${this.learning_src}passport/${this.$route.params.id}/result_estimation/`, data)
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      project: state => state.project.project,
      learning_src: state => state.api.learning_src
    })
  }
}
</script>

<style lang="stylus" scope>
.message-res {
  margin: 38px 0 32px;
  border-radius: 6px;
  padding: 15px 28px;
  & .b-icon {
    top: -2px;
    position: relative;
  }
  &_info {
    background: rgba(70, 123, 227, 0.08);
    border: 1px solid rgba(57, 146, 255, 0.24);
    color: #467BE3;
  }
}

.table-defence {
  padding: 0;
  margin-top: 24px;
  margin-left: -34px;
  margin-right: -34px;
  width: calc(100% + 68px);
  &__head {
    background: rgba(240, 244, 253, 0.4);
    color: #72808E;
    font-weight: 500;
  }
  & tr {
    & td {
      padding: 14px;
      &:first-child {
        padding-left: 34px;
      }
      &:last-child {
        padding-right: 34px;
      }
    }
  }
}
.defence__btns {
  margin-top: 44px;
}
</style>
