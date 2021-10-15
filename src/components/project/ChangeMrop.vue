<template>
  <div class="like-btn">
    <b-button @click="offerRecipient ? $bvModal.show('changeMropCancel_' + uid) : $bvModal.show('changeMrop_' + uid)" >Сменить</b-button>
    
    <b-modal :id="'changeMrop_' + uid" class="all-roles__modal" size="lg" centered hide-header>
      <h2>Сменить роль главного руководителя образовательной программы</h2>
      <div class="text-subtitle">Выберите руководителя образовательной программы из проекта или предложите другого сотрудника.</div>

      <b-form-checkbox v-model="inviteNewRopFlag" name="inviteNewRopFlag" switch class="mt-4 mb-4">
        Пригласить нового руководителя
      </b-form-checkbox>

      <template v-if="inviteNewRopFlag">
        <b-form-group class="form__search">
          <b-form-input class="form__search-input" v-model="search" required autocomplete="off" type="text" placeholder="Поиск по направлению, программе или ФИО" />
          <button class="form__search-close" @click="search = null" />
        </b-form-group>
        <b-form-group>
          <b-form-radio-group class="user-list modal__input-list" v-model="ropSelected" stacked v-if="ropsFilter(search, ignore).length">
            <b-form-radio v-for="rop in ropsFilter(search, ignore)" :key="rop.id" :value="rop" variant="primary">
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
          <b-form-radio-group class="user-list modal__input-list modal__input-list_no-height" v-model="ropSelected" stacked v-if="ropListActive && ropListActive.length">
            <b-form-radio v-for="rop in ropListActive" :key="rop.id" :value="rop" variant="primary" v-show="ignore.indexOf(rop.id) === -1">
              <Person :user="rop" />
            </b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </template>

      <template v-slot:modal-footer>
        <b-button variant="primary" :disabled="!ropSelected" v-b-modal="'changeMropComment_' + uid" @click="$bvModal.hide('changeMrop_' + uid)">Далее</b-button>
        <b-button @click="$bvModal.hide('changeMrop_' + uid)">Отменить</b-button>
      </template>
    </b-modal>

    <b-modal :id="'changeMropComment_' + uid" class="all-roles__modal" size="lg" centered title="Сменить руководителя образовательной программы">
      <b-button variant="primary" class="btn_flat mb-3" v-b-modal="'changeMrop_' + uid" @click="$bvModal.hide('changeMropComment_' + uid)">Выбрать другого сотрудника</b-button>
      <Person :user="ropSelected" />
      <b-form-textarea
        class="mt-4"
        v-model.trim="comment"
        placeholder="Напишите руководителю полезные детали проекта"
        rows="5"
      />
      <template v-slot:modal-footer>
        <b-button variant="primary" :disabled="!ropSelected || !(comment && comment.length)" @click="sendOffer">Отправить приглашение</b-button>
        <b-button @click="$bvModal.hide('changeMropComment_' + uid)">Отменить</b-button>
      </template>
    </b-modal>

    <b-modal v-if="offerRecipient" :id="'changeMropCancel_' + uid" class="all-roles__modal" size="lg" hide-footer centered title="Сменить руководителя образовательной программы">
      <div class="mb-3">Вы уже отправили предложение смены руководителю</div>
      <Person :user="offerRecipient" class="mb-3">
        <b-button variant="danger" @click="cancelOffer">Отменить предложение</b-button>
      </Person>
    </b-modal>
  </div>
</template>


<script>
import { mapGetters, mapState } from 'vuex'
import { makeUID, userShortName } from '@/utils'

import Person from '@/components/Person'

export default {
  name: 'InviteRop',
  components: {
    Person
  },
  props: {
    projectId: Number,
    // ignore - Array - массив id пользователей которых не должно быть в списке ропов
    ignore: Array,
    // ropListActive - список текущих ропов
    ropListActive: Array,
    offerRecipient: Object
  },
  data() {
    return {
      search: null,
      inviteNewRopFlag: false,
      ropSelected: null,
      comment: null
    }
  },
  created () {
    this.uid = makeUID(3)
  },
  methods: {
    userShortName,
    resetData () {
      this.search = null
      this.ropSelected = null
      this.comment = null
      this.$bvModal.hide('changeMrop_' + this.uid)
      this.$bvModal.hide('changeMropComment_' + this.uid)
      this.$bvModal.hide('changeMropCancel_' + this.uid)
    },
    sendOffer() {
      this.$store.dispatch('project/changeMrop', {
        projectId: this.projectId,
        params: {
          'action': 'offer',
          'teacher': this.ropSelected.id,
          'message': this.comment
        }
      }).then(() => {
        this.$bvToast.toast('Предложение отправлено', {
          title: '',
          variant: 'success',
          toaster: 'b-toaster-top-center',
          autoHideDelay: this.toastHideDelay,
          appendToast: false
        })
        this.resetData()
      })
    },
    cancelOffer() {
      this.$bvModal.msgBoxConfirm('Руководитель получит уведомление об отмене', {
        title: 'Вы уверены?',
        okTitle: 'Да',
        okVariant: 'primary',
        cancelTitle: 'Нет',
        hideHeaderClose: false,
        centered: true
      }).then(value => {
        if (!value)
          return

        this.$store.dispatch('project/changeMrop', {
          projectId: this.projectId,
          params: {
            'action': 'cancel'
          }
        }).then(() => {
          this.$bvToast.toast('Приглашение отменено', {
            title: '',
            variant: 'success',
            toaster: 'b-toaster-top-center',
            autoHideDelay: this.toastHideDelay,
            appendToast: false
          })
          this.resetData()
        })
      })
    },
  },
  computed: {
    ...mapGetters('api', [
      'ropsFilter'
    ]),
    ...mapState('app', [
      'toastHideDelay'
    ]),
  }
}
</script>
