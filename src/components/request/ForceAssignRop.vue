<template>
    <b-button v-b-modal="'changeMrop_' + uid" variant="primary">
        Назначить РОПа
        <b-modal
            :id="'changeMrop_' + uid"
            class="all-roles__modal"
            size="lg"
            centered
            hide-header>
            <h2>Назначить главного руководителя образовательной программы</h2>
            <div class="h1__description">
                <p>Выберите руководителя образовательной программы из заявки или предложите другого сотрудника.</p>
                <p>Выбранный сотрудник станет главным руководителем в заявке без его подтверждения. Проект будет запущен, партнер получит уведомление о запуске проекта.</p>
            </div>

            <b-form-checkbox
                v-model="inviteNewRopFlag"
                name="inviteNewRopFlag"
                switch
                class="mt-4 mb-4">
                Назначить другого сотрудника
            </b-form-checkbox>

            <template v-if="inviteNewRopFlag">
                <b-form-group class="form__search">
                    <b-form-input
                        v-model="search"
                        class="form__search-input"
                        autocomplete="off"
                        type="text"
                        required
                        placeholder="Поиск по направлению, программе или ФИО"
                    />
                    <button class="form__search-close" @click="search = null" />
                </b-form-group>
                <b-form-group>
                    <b-form-radio-group
                        class="user-list modal__input-list"
                        v-model="ropSelected"
                        stacked
                        v-if="ropsFilter(search, ignore).length">
                        <b-form-radio
                            v-for="rop in ropsFilter(search, ignore)"
                            :key="rop.id"
                            :value="rop"
                            variant="primary">
                            <Person :user="rop" />
                        </b-form-radio>
                    </b-form-radio-group>
                    <div v-else class="modal__user-no">
                        <h4>Нет результатов</h4>
                    </div>
                </b-form-group>
            </template>
            <template v-else>
                <b-form-group>
                    <b-form-radio-group v-if="ropListActive && ropListActive.length"
                        class="user-list modal__input-list modal__input-list_no-height mb-4"
                        v-model="ropSelected"
                        stacked
                    >
						<h3 class="mb-2">Участвующие</h3>  
						<b-form-radio v-for="rop in ropListActive" :key="rop.id"
							:value="rop"
							variant="primary"
						>
							<Person :user="rop" />
						</b-form-radio>
                    </b-form-radio-group>

                    <b-form-radio-group v-if="ropListDeclined && ropListDeclined.length"
                        class="user-list modal__input-list modal__input-list_no-height mb-4"
                        v-model="ropSelected"
                        stacked
                    >
                        <h3 class="mb-2">Отказавшиеся</h3>  
                        <b-form-radio v-for="rop in ropListDeclined" :key="rop.id"
                            :value="rop"
                            variant="primary"
						>
                            <Person :user="rop" />
                        </b-form-radio>
                    </b-form-radio-group>

                    <b-form-radio-group v-if="ropListInactive && ropListInactive.length"
                        class="user-list modal__input-list modal__input-list_no-height mb-4"
                        v-model="ropSelected"
                        stacked
                    >
                        <h3 class="mb-2">Не ответившие</h3>  
                        <b-form-radio v-for="rop in ropListInactive" :key="rop.id"
                            :value="rop"
                            variant="primary"
						>
                            <Person :user="rop" />
                        </b-form-radio>
                    </b-form-radio-group>
                </b-form-group>
            </template>

            <template v-slot:modal-footer>
                <b-button
                    variant="primary"
                    :disabled="!ropSelected"
                    v-b-modal="'changeMropComment_' + uid"
                    @click="$bvModal.hide('changeMrop_' + uid)">
                    Далее
                </b-button>
                <b-button @click="$bvModal.hide('changeMrop_' + uid)">Отменить</b-button>
            </template>
        </b-modal>

        <b-modal
            :id="'changeMropComment_' + uid"
            class="all-roles__modal"
            size="lg"
            centered
            title="Назначить главного руководителя образовательной программы">
            <div class="h1__description">
                <p>Выбранный сотрудник станет главным руководителем в заявке. Проект будет запущен, партнер получит уведомление о запуске проекта.</p>
            </div>
            <b-button
                variant="primary"
                class="btn_flat mb-3"
                v-b-modal="'changeMrop_' + uid"
                @click="$bvModal.hide('changeMropComment_' + uid)">
                Выбрать другого сотрудника
            </b-button>
            <Person :user="ropSelected" />
            <b-form-textarea
                class="mt-4"
                v-model.trim="comment"
                placeholder="Напишите руководителю полезные детали проекта"
                rows="5"
            />
            <template v-slot:modal-footer>
                <b-button
                    variant="primary"
                    :disabled="!ropSelected || !(comment && comment.length)"
                    @click="changeMrop">
                    Назначить
                </b-button>
                <b-button @click="$bvModal.hide('changeMropComment_' + uid)">Отменить</b-button>
            </template>
        </b-modal>
    </b-button>
</template>

<script>
import { mapGetters } from "vuex";
import { makeUID, infoMessage, } from "@/utils";

import Person from "@/components/Person";

export default {
  name: 'AssignInviteRop',
  components: {
    Person,
  },
  props: {
    projectId: Number,
    // ignore - Array - массив id пользователей которых не должно быть в списке ропов
    ignore: Array,
    // ropListDeclined - список отказавшихся ропов
    ropListDeclined: Array,
    ropListActive: Array,
    ropListInactive: Array,
  },
  data() {
    return {
      search: null,
      inviteNewRopFlag: false,
      ropSelected: null,
      comment: null,
    };
  },
  created() {
    this.uid = makeUID(3);
  },
  methods: {
    resetData() {
      this.search = null;
      this.ropSelected = null;
      this.comment = null;
      this.$bvModal.hide("changeMrop_" + this.uid);
      this.$bvModal.hide("changeMropComment_" + this.uid);
    },
    changeMrop() {
      this.$store
        .dispatch("project/forceROPAssign", {
          id: this.projectId,
          params: {
            teacher: this.ropSelected.id,
            message: this.comment,
          },
        }).then(data => {
          // вызов из корневого компонента, так как текущий компонент уничтожается при обновлении project в родительском компоненте
          infoMessage('Руководитель назначен, проект принят в работу');
          this.resetData();
          this.$emit('update-project', data.project)
        });
    },
  },
  computed: {
    ...mapGetters("api", ["ropsFilter"]),
  },
};
</script>
