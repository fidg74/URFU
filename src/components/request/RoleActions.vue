<template>
  <div class="d-inline-block">
    
    <AcceptProject v-if="meIsMROP && project.request_status === 'PUBL'"
      :project=project
      @update-project="(projectData) => updateProject(projectData)"
    />

    <b-button v-if="project.request_status === 'PUBL' && !isWaitingForParticipationResponse && (
                    project.isInvited ||
                    iHaveOfferTeacherChange ||
                    canBeRROP
                  )" variant="primary" @click="acceptRop">Участвовать</b-button>

    <!-- <CuratorSelect v-if="canAssignCurator"
      variant="secondary"
      title="Назначить куратора"
      @input="curatorId => {
        $store.dispatch('project/assignCurator', { 
          id: project.id, 
          params: {
          'program': myProgram.program.id,
          'curator': curatorId
          }
        }).then(data => {
            this.$store.dispatch('project/FETCH_project', { id: project.id, project: data.project })
            this.$store.dispatch('project/FETCH_messages', { id: project.id, messages: data.project.messages })
        })
      }"
    /> -->

    <b-button
      v-if="project.request_status === 'PUBL' && (
              project.isInvited ||
              iHaveOfferTeacherChange ||
              (meIsMROP || meIsRROP)
            )"
      v-b-modal.declineRopModal
      variant="danger"
    >Отказаться</b-button>

    <b-button
      v-if="project.request_status === 'PUBL' && project.isInvited && project.can_offer_program"
      v-b-modal.declineRopSelectProgramModal
    >Передать на другую программу</b-button>

    <!-- неактуально, так как сейчас кто первый участвует, тот и главный -->
    <!-- <b-modal id="acceptRopModal" centered size="lg" hide-header>
      <h2>Участие в&nbsp;проекте</h2>
      <div class="h1__description">Выберите тип участия</div>
      
      <b-form-group class="mt-4">
        <b-form-radio v-if="!MROP" v-model="mainRole" name="main-role" :value="true">Главный руководитель образовательной программы</b-form-radio>
        <b-form-radio v-if="!meIsRROP" class="mt-2" v-model="mainRole" name="main-role" :value="false">Дополнительный руководитель образовательной программы</b-form-radio>
      </b-form-group>
      <template v-slot:modal-footer>
        <b-button variant="primary" v-if="availablePrograms && availablePrograms.length > 1" :disabled="(typeof mainRole) === 'object'" v-b-modal.selectProgramModal @click="$bvModal.hide('acceptRopModal')">Далее</b-button>
        <b-button variant="primary" v-else @click="sendRole" :disabled="(typeof mainRole) === 'object'">Участвовать</b-button>
        <b-button @click="cancelDecline">Отмена</b-button>
      </template>
    </b-modal> -->

    <b-modal id="selectProgramModal" centered size="lg" hide-header>
      <h2>Участие в&nbsp;проекте</h2>
      <div class="h1__description">Вы руководите несколькими образовательными программами, выберите нужную:</div>

      <b-form-group class="mt-4">
        <b-form-radio class="mt-2" v-for="program in availablePrograms" v-model="selectProgram" name="program" :value="program.id" :key="program.id">
          {{ program.name }}
          <div>
            <span class="text-caption mr-2">{{ program.uid }}</span>
            <span class="text-caption">{{ model(program.level) }}</span>
          </div>
        </b-form-radio>
      </b-form-group>

      <template v-slot:modal-footer>
        <b-button variant="primary" @click="sendRole">Участвовать</b-button>
        <b-button @click="cancelDecline">Отмена</b-button>
      </template>
    </b-modal>


    <b-modal id="declineRopModal" centered size="lg" hide-header>
      <h2>Отказаться от участия</h2>
      <div class="h1__description">Укажите причину отказа.</div>
      <b-form-group class="mt-4">
        <b-form-radio class="mt-3" v-model="declineRopType" name="declineRopType" :value="1">Нет студентов</b-form-radio>
        <b-form-radio class="mt-3" v-model="declineRopType" name="declineRopType" :value="2">Нет компетенций</b-form-radio>
        <b-form-radio class="mt-3" v-model="declineRopType" name="declineRopType" :value="4">Не сможем реализовать в&nbsp;ближайшем семестре</b-form-radio>
        <b-form-radio class="mt-3" v-model="declineRopType" name="declineRopType" :value="9">Указать причину</b-form-radio>
      </b-form-group>
      <b-form-textarea v-if="declineRopType === 9"
        class="mt-4"
        v-model.trim="declineRopText"
        rows="5"
      />

      <template v-slot:modal-footer>
        <b-button variant="primary" @click="declineRop" :disabled="!declineRopType || (declineRopType === 9 && !declineRopText)">Отказаться</b-button>
        <b-button @click="cancelDecline">Отмена</b-button>
      </template>
    </b-modal>

    <b-modal id="declineRopSelectProgramModal" centered size="lg" hide-header>
      <h2>Передать заявку на другую программу</h2>
      <div class="h1__description">Выберите подходящую образовательную программу.</div>

      <ProgramSelect v-if="project.can_offer_program" class="mt-4" v-model="declineSelectedProgramId" :initial-programs="project.can_offer_program.available_programs" />

      <template v-slot:modal-footer>
        <b-button variant="primary" :disabled="!declineSelectedProgramId" @click="declineRopSelectProgram">Передать</b-button>
        <b-button @click="cancelDecline">Отмена</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

import { escapeHtml, model, userFullName, infoMessage, } from '@/utils';
import AcceptProject from '@/components/project/Accept';
import ProgramSelect from '@/components/selectModal/Program';
// import CuratorSelect from '@/components/selectModal/Curator';

export default {
  name: 'RoleActions',
  components: {
    AcceptProject,
    ProgramSelect,
    // CuratorSelect
  },
  data () {
    return {
      mainRole: null,
      selectProgram: null,
      declineSelectedProgramId: null,
      declineRopType: null,
      declineRopText: null,
      availablePrograms: null
    }
  },
  created () {
    this.availablePrograms = this.user.programs
    // this.availablePrograms = this.programs.filter(program => this.user.current.programs.some(userProgram => userProgram.id === program.id))
    if (this.project.programs && this.project.programs.length) {
      this.availablePrograms = this.availablePrograms.filter(aProg => !this.project.programs.some(prog => prog.roles && prog.roles.length && aProg.id === prog.program.id))
    }
    if (this.user.isRop) {
      this.selectProgram = this.availablePrograms && this.availablePrograms.length ? this.availablePrograms[0].id : this.user.programs[0].id
    }
  },
  methods: {
    model: name => model[name],
    userFullName,
    acceptRop () {
      this.availablePrograms = this.user.programs      
      if (this.project.programs && this.project.programs.length) {
        this.availablePrograms = this.availablePrograms.filter(aProg => !this.project.programs.some(prog => prog.roles && prog.roles.length && aProg.id === prog.program.id))
      }

      if (this.iHaveOfferTeacherChange || (!this.MROP && this.project.programs.length === 1)) {
        this.mainRole = true
      } else if (!!this.MROP && (this.project.isInvited || this.canBeRROP && !!this.MROP)) {
        this.mainRole = false
      } else {
        this.mainRole = !this.MROP
        // this.$bvModal.show('acceptRopModal')
      }
      
      if (this.availablePrograms && this.availablePrograms.length > 1) {
        this.$bvModal.show('selectProgramModal')
      } else {
        this.sendRole()
      }
    },
    sendRole () {
      const sendData = new FormData()
      sendData.set('program', this.selectProgram)
      if (this.iHaveOfferTeacherChange) {
        const messagesOSCH = this.messages.find(msg => msg.recipient && msg.recipient.id === this.user.id && msg.type === 'OSCH')        
        if (messagesOSCH && messagesOSCH.id) {
          sendData.set('message_id', messagesOSCH.id)
        }
      }

      // this.$bvModal.hide('acceptRopModal')
      this.$bvModal.hide('selectProgramModal')
      
      let modalAnswerText
      if (this.mainRole) {
        modalAnswerText = '<p>Вы станете главным руководителем образовательной программы.</p>'
      } else {
        if (this.iHaveActiveParticipationInvite) {
          modalAnswerText = `<p>Вы станете дополнительным руководителем образовательной программы</p>`
        } else {
          modalAnswerText = `<p>Вы отправите запрос на участие в проекте.</p><p>Главный руководитель образовательной программы ${ userFullName(this.MROP.user) } рассмотрит ваш запрос. Вы получите ответ в уведомлениях.</p>`
        }
      }
      const modalAnswerTextVNode = this.$createElement('div', { domProps: { innerHTML: modalAnswerText } })

      this.$bvModal.msgBoxConfirm([modalAnswerTextVNode], {
        title: 'Вы уверены?',
        okTitle: 'Согласен',
        okVariant: 'primary',
        cancelTitle: 'Отменить',
        hideHeaderClose: false,
        centered: true
      }).then(value => {
        if (!value) return

        this.$store.dispatch('project/answerInviteRop', { id: this.project.id, accept: true, params: sendData }).then((data) => {
          if (data.accept) {
            this.selectProgram = null

            if (data.is_main) {
              const text = '<p>Проект еще не запущен. Чтобы запустить проект сейчас, нажмите кнопку «Принять проект в&nbsp;работу», или сделайте это позже.</p><p>Вам необходимо будет назначить куратора и&nbsp;принять проект в&nbsp;работу.</p>'
              const messageVNode = this.$createElement('div', { domProps: { innerHTML: text } })
              this.$bvModal.msgBoxOk([messageVNode], {
                title: 'Вы стали главным руководителем образовательной программы',
                hideHeaderClose: false,
                size: 'lg',
                centered: true
              })
            } else {
              const text = '<p>Вам необходимо назначить куратора.</p>'
              const messageVNode = this.$createElement('div', { domProps: { innerHTML: text } })
              this.$bvModal.msgBoxOk([messageVNode], {
                title: 'Вы стали дополнительным руководителем образовательной программы',
                hideHeaderClose: false,
                size: 'lg',
                centered: true
              })
            }
          } else {
            infoMessage('Запрос на участие отправлен.');
          }
        })
      })
    },
    cancelDecline () {
      this.$bvModal.hide('selectProgramModal')
      // this.$bvModal.hide('acceptRopModal')

      this.$bvModal.hide('declineRopModal')
      this.$bvModal.hide('declineRopSelectProgramModal')
      this.declineRopText = null
      this.declineRopType = null
    },
    declineRop () {
      const sendData = new FormData()
      if (this.iHaveOfferTeacherChange) {
        const messagesOSCH = this.messages.find(msg => msg.recipient && msg.recipient.id === this.user.id && msg.type === 'OSCH')
        sendData.set('message_id', messagesOSCH.id)
      }
      
      if (this.declineRopType === 1) this.declineRopText = 'Нет студентов'
      if (this.declineRopType === 2) this.declineRopText = 'Нет компетенций'
      if (this.declineRopType === 4) this.declineRopText = 'Не сможем реализовать в ближайшем семестре'

      sendData.set('message', escapeHtml(this.declineRopText))

      this.$store.dispatch('project/answerInviteRop', { id: this.project.id, accept: false, params: sendData })
      this.cancelDecline()
    },
    declineRopSelectProgram () {
      const sendData = new FormData()
      const program = this.getProgram(this.declineSelectedProgramId)
      sendData.set('offer_prog_id', program.id)

      this.$store.dispatch('project/answerInviteRop', { id: this.project.id, accept: false, params: sendData })
      this.cancelDecline()
    },
    updateProject (projectData) {
      this.$store.dispatch('project/FETCH_project', { id: this.project.id, project: projectData })
      this.$store.dispatch('project/FETCH_messages', { id: this.project.id, messages: projectData.messages })
    }
  },
  computed: {
    canBeRROP () {
      return this.user.current.groups.indexOf('rop') > -1 && ['PUBL', 'ACPT', 'PSST'].indexOf(this.project.request_status) > -1 && !this.meIsRROP
    },
    ...mapState({
      user: state => state.user,
      programs: state => state.api.programs,
      project: state => state.project.project,
      messages: state => state.project.messages,
    }),
    ...mapGetters('api', [
      'getProgram',
    ]),
    ...mapGetters('project', [
      'MROP',
      'myProgram',
      'meIsRROP',
      'meIsMROP',
      'isWaitingForParticipationResponse',
      'iHaveOfferTeacherChange',
      'iHaveActiveParticipationInvite'
    ]),
    canAssignCurator() {
      if (this.myProgram) {
        return "assign_curator" in this.myProgram.available_actions;
      }
      return false
    },
  }
}
</script>
