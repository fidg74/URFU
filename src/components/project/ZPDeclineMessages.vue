<template>
  <div class="like-btn">    
    <b-button v-if="onlySend" :variant="'danger'" v-b-modal="'sendDeclinePartner_' + uid">Написать отказ партнеру</b-button>        
    <b-button v-else v-b-modal="'DeclineMessages_' + uid">Прочитать отказы</b-button>
    <b-modal centered size="lg" :id="'DeclineMessages_' + uid" @show="resetData" hide-header>
      <h2>Отказ от проекта</h2>
      <div class="h1__description mb-4">Прочитайте причины отказов РОПов.</div>

      <div class="decline-messages mb-4">
        <div class="border_bottom mb-4 pb-4" v-for="msg in messages" :key="msg.id">
          <Person :user="getRop(msg.sender.id)" />
          <div class="mt-4" v-if="msg.user_text">{{ msg.user_text }}</div>
          <div class="mt-4 bad-html" v-else v-html="msg.text" />
        </div>
      </div>

      <template v-if="hasSend" v-slot:modal-footer>
        <b-button variant="danger" v-b-modal="'sendDeclinePartner_' + uid" @click="$bvModal.hide('DeclineMessages_' + uid)">Написать отказ партнеру</b-button>
        <b-button @click="resetData">Отменить</b-button>
      </template>
      <template v-else v-slot:modal-footer>
        <b-button @click="resetData">Закрыть</b-button>
      </template>
    </b-modal>


    <b-modal :id="'sendDeclinePartner_' + uid" centered size="lg" hide-header>
      <h2>Отказ от проекта</h2>
      <b-button v-if="!onlySend" class="btn_flat mb-3" v-b-modal="'DeclineMessages_' + uid" @click="$bvModal.hide('sendDeclinePartner_' + uid)">Прочитать причины отказов РОПов</b-button>
      <div class="h1__description">Выберите причину отказа. Заказчик проекта получит уведомление об отказе.</div>

      <b-form-group class="mt-4 mb-4">
        <b-form-radio class="pt-2 pb-2" v-model="declineZPType" :name="'declineZPType_' + uid" :value="1">Нет студентов</b-form-radio>
        <b-form-radio class="pt-2 pb-2" v-model="declineZPType" :name="'declineZPType_' + uid" :value="2">Нет компетенций</b-form-radio>
        <b-form-radio class="pt-2 pb-2" v-model="declineZPType" :name="'declineZPType_' + uid" :value="4">Не сможем реализовать в ближайшем семестре</b-form-radio>
        <b-form-radio class="pt-2 pb-2" v-model="declineZPType" :name="'declineZPType_' + uid" :value="9">Указать причину</b-form-radio>
      </b-form-group>
      <template v-if="declineZPType">
        <h3 v-if="declineZPType !== 9" class="mb-3">Прочитайте текст отказа и отредактируйте, если требуется</h3>
        <b-form-textarea
          v-model.trim="declineZPText"
          rows="5"
          style="color: rgba(17, 17, 18, 1);"
        />
      </template>
      
      <template v-slot:modal-footer>
        <b-button variant="primary" @click="declineZP" :disabled="!declineZPType || !declineZPText">Отправить</b-button>
        <b-button @click="resetData">Отменить</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { makeUID } from '@/utils'

import Person from '@/components/Person'

export default {
  name: 'ZPDeclineMessages',
  components: {
    Person
  },
  props: {
    projectId: Number,
    projectStatus: String,
    messages: Array,
    hasSend: {
      type: Boolean,
      default: false
    },
    onlySend: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      uid: '',
      declineZPType: null,
      declineZPText: '',
      manuallyTypedText: ''
    }
  },
  created () {
    this.uid = makeUID(3)
  },
  methods: {
    resetData () {
      this.search = null
      this.declineZPType = null
      this.declineZPText = ''
      this.$bvModal.hide('DeclineMessages_' + this.uid)
      this.$bvModal.hide('sendDeclinePartner_' + this.uid)
    },
    declineZP () {
      
      this.$store.dispatch('project/sendRequestZPdecline', { id: this.projectId, text: this.declineZPText }).then(() => {
        this.$emit('update', true)
        this.resetData()
      }).catch(() => {
        this.$emit('update', false)
        this.resetData()
      })
    }
  },
  computed: {
    ...mapGetters('api', [
      'curatorsFilter',
      'getRop'
    ]),
  },
  watch: {
    declineZPType(newValue, oldValue) {
      if (!newValue) {
        return
      }
      if (newValue === 9) {
        this.declineZPText = this.manuallyTypedText
        return
      }
      if (oldValue === 9) {
        this.manuallyTypedText = this.declineZPText
      }
      const declineTypeToText = {
        1: 'сейчас у нас нет свободных студентов для реализации проекта. Вы можете подать заявку на новый проект, в котором могут быть задействованы студенты другого направления.',
        2: 'у нас нет студентов с компетенциями, необходимыми для реализации проекта. Вы можете подать заявку на новый проект, в котором понадобятся другие компетенции.',
        4: 'мы не сможем реализовать заявку в текущем семестре. Вы можете подать заявку в следующем учебном периоде.',
      }
      this.declineZPText = `Добрый день!\n` +
        `Спасибо за вашу заявку. К сожалению, ${ declineTypeToText[this.declineZPType] }\n` + 
        `Будем рады видеть вас с новыми заявками!`
    }
  }
}
</script>
