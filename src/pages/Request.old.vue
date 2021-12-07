<template>
  <b-container>
    <b-button variant="primary" class="btn_flat mb-3" to="/requests">
      <i class="fas fa-arrow-left" />
      <span>Все заявки</span>
    </b-button>

    <template v-if="project">
      <h1>{{ project.req_name }}</h1>
      <div class="h1__description">{{ project.uid }} от {{ formatDate(project.date) }}</div>

      <div class="mt-4" v-if="project.bef_status === 'ACPT' && (myProgram || meIsPartner || user.isZP)">
        <div class="ui-tabs">
          <label class="ui-tabs__item active">
            <div class="ui-tabs__label">Заявка на проект</div>
          </label>
          <label class="ui-tabs__item">
            <div class="ui-tabs__label" @click="$router.push(`/passport/${ $route.params.id }`)">Паспорт проекта</div>
          </label>
          <!-- <label class="ui-tabs__item">
            <div class="ui-tabs__label" @click="$router.push(`/passport/${ $route.params.id }/history/`)">История правок</div>
          </label> -->
          <label v-if="project.request_status === 'PSAP'" class="ui-tabs__item">
            <div class="ui-tabs__label" @click="$router.push(`/passport/${ $route.params.id }/implementation/`)">Реализация проекта</div>
          </label>
        </div>
      </div>

      <b-row class="mt-4">
        <b-col cols="9">
          <b-card v-if="myLastRequestIsDeclined" class="card_content mb-4">
            <Message :message="myLastParticipationRequest" />
          </b-card>

          <b-card class="card_content mt-0">
            <b-badge class="fl-right"
              :variant="project.participation_status
                ? {
                'has_offer': 'warning',
                'request_sent': 'secondary',
                'participates': 'success',
                'request_declined': 'danger',
                'declined': 'danger',
                }[project.participation_status]
                : project.bef_status">
              {{ project.participation_status
                  ? {
                  'has_offer': 'На рассмотрении',
                  'request_sent': 'Запрос на участие отправлен',
                  'participates': 'Вы участвуете',
                  'request_declined': 'Запрос на участие отклонен',
                  'declined': 'Вы отказались',
                  }[project.participation_status]
                  : model(project.bef_status)
              }}
            </b-badge>
            <h2>Описание проекта</h2>
            
            <h4 class="mt-5 mb-2">Цель</h4>
            <div v-html="project.req_goal" class="project__user-text" />

            <h4 class="mt-5 mb-2">Результат (продукт)</h4>
            <div v-html="project.req_result" class="project__user-text" />

            <h4 class="mt-5 mb-2">Критерии приемки</h4>
            <div v-html="project.req_criteria" class="project__user-text" />
            
            <h4 class="mt-5 mb-2">Описание проекта</h4>
            <div v-html="project.req_description" class="project__user-text" />
            
            <h4 class="mt-5 mb-2">Максимальное количество экземпляров проекта</h4>
            <div v-html="project.max_copies" class="project__user-text" />
          </b-card>

          <b-card class="card_content" v-if="!(!user.isPlAdmin && meIsPartner)">
            <h2 class="mb-4">Партнер</h2>
            <template v-if="!user.isPlAdmin">
              <h4>Название организации</h4>
              <div class="person">
                <div class="person__info">
                  <b>{{ project.partner.short_name }}</b>
                  <div class="text-caption">{{ project.partner.name }}</div>
                  <div v-if="project.partner.phone">{{ project.partner.phone }}</div>
                </div>
              </div>
            </template>

            <h4>Заказчик</h4>
            <Person :user="project.manager" />
          </b-card>

          <b-card class="card_content">
            <b-row>
              <b-col>
                <h2>Участники проекта от университета</h2>
              </b-col>
              <b-col class="text-right">
                <b-button class="btn_flat btn_inline" v-b-modal.allRolesModal>Показать всех участников</b-button>
              </b-col>
            </b-row>

            <h4 class="mt-2">Главный руководитель образовательной программы</h4>
            <Person :user="MROP">
              <ChangeMrop v-if="meIsMROP && project.request_status === 'PUBL'" :projectId="project.id" :ropListActive="ropListActive" :ignore="changeMropIgnoreList" :offerRecipient="project.current_main_role_offer ? project.current_main_role_offer.recipient : null" />
            </Person>

            <h4 class="mt-4">Главный куратор</h4>
            <Person :user="MCUR">
              <template #caption v-if="!MCUR && !meIsPartner">
                Назначить куратора можно до&nbsp;и&nbsp;после запуска проекта.
              </template>
            </Person>

            <template v-if="meIsMROP && project.request_status === 'PUBL'">
              <hr class="hr_full mb-4">
              <InviteRop :projectId="project.id" :ignore="inviteIgnoreList" />
              <span v-if="participationRequests.length > 0" v-b-modal.allRolesModal @click="allRolesTab = 'request'" class="participations-count">
                <b-icon-info-circle-fill variant="primary" />
                <span class="primary" >{{ `${participationRequests.length} ${declOfNum(participationRequests.length, ['запрос', 'запроса', 'запросов'])} на участие` }}</span>
              </span>
            </template>

            <b-modal v-if="project.programs && project.programs.length" hide-footer id="allRolesModal" class="all-roles__modal" size="lg" centered title="Участники проекта от университета">
              <div class="mb-4 all-roles__tabs" v-if="user.isRop || user.isZP">
                <Tabs v-model="allRolesTab" 
                  :items="meIsMROP ? 
                  allRolesTabItems.concat({ label: 'Запросы на участие', value: 'request', count: (allRolesTab !== 'request' && participationRequests.length > 0) ? participationRequests.length : null }) :
                  allRolesTabItems" />
              </div>
              <div class="modal__user-list" v-if="allRolesTab === 'active'">
                <template v-for="program of project.programs">
                  <div class="user-list__item" :key="program.program.id" v-if="program.roles && program.roles.length">
                    <h4>
                      <svg v-if="program.is_main" class="mr-2 mb-1" width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.3" d="M10.5417 9H0.458333L0 1.00001L3.20833 2.99997L5.5 0L7.79167 3.00002L11 1.00001L10.5417 9Z" fill="black" />
                      </svg>
                      {{ program.program.name }}
                    </h4>
                    <Person v-for="programPerson of program.roles" :key="programPerson.id" :user="programPerson" class="mt-3">
                      <template #caption>
                        {{ model(programPerson.role) }}
                      </template>
                    </Person>
                  </div>
                </template>
              </div>
              <div class="modal__user-list" v-else-if="allRolesTab === 'invite'">
                <div class="user-list__item" v-for="offer of resultDeclinedOffers.concat(resultNotApprovedOffers)" :key="offer.id">
                  <Person :user="offer.user">
                    <b-badge v-if="offer.status === 'declined'" variant="danger">Отказался</b-badge>
                    <b-badge v-else variant="warning">Не подтвержден</b-badge>
                    <template #caption>
                      Руководитель образовательной программы
                    </template>
                  </Person>
                  <div v-if="offer.user_text" class="mt-4">
                    <i>{{ offer.user_text }}</i>
                  </div>
                </div>
              </div>
              <div class="modal__user-list" v-if="allRolesTab === 'request'">
                <div class="user-list__item" v-for="participationRequest of participationRequestsNeedResponse.concat(participationRequestsAccept, participationRequestsDecline)" :key="participationRequest.user.id">
                  <Person :user="participationRequest.user">
                    <b-badge v-if="participationRequest.status" variant="success">Подтвержден</b-badge>
                    <b-badge v-else-if="participationRequest.status === false" variant="danger">Отклонен</b-badge>
                    <b-badge v-else-if="!meIsMROP && participationRequest.status === null" variant="warning">Не подтвержден</b-badge>
                    <ParticipationResponse v-else-if="meIsMROP && participationRequest.status === null" 
                      :projectId="project.id" :participant="participationRequest.user"
                      @update-project="(projectData) => updateProject(projectData)"
                    />
                  </Person>
                </div>
              </div>
            </b-modal>
          </b-card>

          <b-card class="card_content" v-if="user.isZP && participationDeclines && participationDeclines.length">
            <h2 class="mb-2">Отказы руководителей</h2>
            <div class="border_bottom mb-4 pb-4" v-for="decline in participationDeclines" :key="decline.id">
              <Person :user="getRop(decline.user.id)" />
              <div class="mt-4 project__user-text" v-if="decline.user_text">{{ decline.user_text }}</div>
            </div>
          </b-card>

          <b-card class="card_content" v-if="project && project.programs && project.programs.length">
            <b-row class="mb-2">
              <b-col>
                <h2>Образовательная программа</h2>
              </b-col>
            </b-row>

            <template v-for="program of projectProgramsOfParticipatingRops.concat(projectProgramsOfDeclinedRops, projectProgramsOfRestRops)">
              <div :key="program.id" class="mb-2">
                <svg v-if="project.request_status === 'DCLN'" class="mr-2" width="13" height="13" viewBox="0 0 13 13" fill="none" v-b-tooltip title="Отказ">
                  <circle cx="6.5" cy="6.5" r="6.5" fill="#F5222D"/>
                  <path d="M8.5 4.5L4.5 8.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4.5 4.5L8.5 8.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else-if="program.rop_participation_status" class="mr-2" width="13" height="13" viewBox="0 0 13 13" fill="none" v-b-tooltip title="Участвует">
                  <circle cx="6.5" cy="6.5" r="6.5" fill="#44A52C" />
                  <path d="M4 7L6 8.5L9 4.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg v-else-if="program.rop_participation_status === false" class="mr-2" width="13" height="13" viewBox="0 0 13 13" fill="none" v-b-tooltip title="Отказ">
                  <circle cx="6.5" cy="6.5" r="6.5" fill="#F5222D"/>
                  <path d="M8.5 4.5L4.5 8.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4.5 4.5L8.5 8.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else-if="program.rop_participation_status === null" class="mr-2" width="13" height="13" viewBox="0 0 13 13" fill="none" v-b-tooltip title="На рассмотрении">
                    <circle cx="6.5" cy="6.5" r="6.5" fill="#FBA40F" />
                    <path d="M6 3V7H9" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg v-if="program.is_main" v-b-tooltip title="Главная программа проекта" class="mr-2 mb-1" width="11" height="9" viewBox="0 0 11 9" fill="none">
                  <path opacity="0.3" d="M10.5417 9H0.458333L0 1.00001L3.20833 2.99997L5.5 0L7.79167 3.00002L11 1.00001L10.5417 9Z" fill="black"/>
                </svg>

                <span class="text-caption mr-2">{{ program.program.uid }}</span> {{ program.program.name }}
              </div>
            </template>
          </b-card>


          <b-card class="card_content" v-if="project.req_files && project.req_files.length">
            <h2>Приложения</h2>
            <FileDownload download :file="file" v-for="file in project.req_files" :key="file.file_id" class="mt-4" />
          </b-card>


          <div v-pin-bottom>
            <b-container class="pin-bottom__container">
              <b-row>
                <b-col cols="9">
                  <b-card class="card_content">
                    <div>                      
                      <ForceAssignRop v-if="project.request_status !== 'DCLN' && user.isZP && project.rop_status === 'PRSD'" 
                      :projectId="project.id" :ropListDeclined="ropListDeclined" :ignore="ignoreArray" @update-project="(projectData) => updateProject(projectData)" />
                      <!-- :ropListActive="declineList" -->
                      <ZPDeclineMessages v-if="project.request_status !== 'DCLN' && user.isZP && project.rop_status === 'PRSD'" onlySend showROPForceButton :projectId="project.id" :projectStatus="project.request_status" />
                      <RoleActions v-if="project && project.id == $route.params.id" />
                      <b-button class="btn_flat" @click="makePDF(project, 'request')">Сохранить в PDF</b-button>
                    </div>
                  </b-card>
                </b-col>
              </b-row>
            </b-container>
          </div>

        </b-col>
        <b-col>
          <div v-pin-aside>
            <b-alert show v-if="project.request_status === 'PUBL' && !meIsMROP && meIsRROP" variant="primary" class="mb-4 alert_icon">
              <b-icon-info-circle-fill /> Вы участвуете. Ожидайте решения о запуске проекта
            </b-alert>
            
            <b-alert show v-if="project.request_status === 'PUBL' && meIsMROP && participationRequests.length > 0" variant="primary" class="mb-4 alert_icon">
              <b-icon-info-circle-fill />
              <span>У вас есть запросы на участие</span>
            </b-alert>

            <b-alert v-if="project.request_status === 'PUBL' && isWaitingForParticipationResponse" show variant="primary" class="mb-4 alert_icon">
              <b-icon-info-circle-fill />
              <span>Запрос на участие отправлен. Ожидайте ответа</span>
            </b-alert>

            <b-alert v-if="project.request_status === 'PUBL' && myLastRequestIsDeclined" show variant="primary" class="mb-4 alert_icon">
              <b-icon-info-circle-fill />
              <span>Главный Руководитель образовательной программы отклонил ваш запрос на участие</span>
            </b-alert>

            <b-card class="card_content mb-4" v-if="zpDecline && zpDeclineText && project.request_status === 'DCLN'">
              <h4>Причина отказа от заявки</h4>
              <div v-if="zpDeclineText.length > 120">
                <div class="mt-2" v-html="zpDeclineText.slice(0, 110) + '...'" />
                <b-button variant="primary" class="btn_full mt-4" v-b-modal.zpDeclineTextModal>Читать полностью</b-button>

                <b-modal id="zpDeclineTextModal" centered hide-header>
                  <h2>Причина отказа от заявки</h2>
                  <h3 class="text-caption">{{ project.uid }} от {{ formatDate(project.date) }}</h3>

                  <div class="mt-2" v-html="zpDeclineText" />

                  <template v-slot:modal-footer>
                    <b-button variant="primary" @click="$bvModal.hide('zpDeclineTextModal')">Закрыть</b-button>
                  </template>
                </b-modal>
              </div>
              <div v-else>
                <div class="mt-2">{{ zpDeclineText }}</div>
                <div class="text-caption  mt-2">{{ formatDateTime(zpDecline.date) }}</div>
              </div>
            </b-card>
            <b-alert show v-if="iDeclinedOffer && !(meIsMROP || meIsRROP)" variant="primary" class="mb-4 alert_icon">
              <b-icon-info-circle-fill /> Вы&nbsp;отказывались от&nbsp;участия в&nbsp;этом проекте, но&nbsp;можете присоединиться снова
            </b-alert>
            <div v-if="project.request_status === 'PUBL' && meIsPartner && (!MROP || (MROP && project.manager && (project.manager.id !== MROP.user.id)))" class="mb-4">
              <b-alert show variant="primary" class="alert_icon">
                <b-icon-info-circle-fill />
                <span v-if="project.is_expired">На обработку заявки потребовалось больше времени. В&nbsp;ближайшее время мы&nbsp;с&nbsp;вами свяжемся.</span>
                <span v-else>Вы получите ответ по&nbsp;заявке<b class="nobr"> до&nbsp;{{ formatDate(project.exp_date) }}</b></span>
              </b-alert>
            </div>
            <div class="project-status__wrap">
              <div class="text-subtitle">Прогресс заявки</div>
              <div :class="{ 'project-status': 1, 'project-status_active': project.bef_status === 'DRFT' }">
                <div class="project-status__num">1</div>
                <div class="project-status__title">Заполнение заявки</div>
              </div>
              <div :class="{ 'project-status': 1, 'project-status_active': project.bef_status === 'PUBL' }">
                <div class="project-status__num">2</div>
                <div class="project-status__title">Рассмотрение заявки университетом</div>
              </div>
              <div :class="{ 'project-status': 1, 'project-status_active': ['ACPT', 'DCLN'].indexOf(project.bef_status) > -1 }">
                <div class="project-status__num">3</div>
                <div class="project-status__title">Ответ на&nbsp;заявку</div>
              </div>
            </div>

            <b-alert v-if="project.bef_status === 'PUBL' && iHaveOfferTeacherChange" show variant="primary" class="alert_icon">
              <b-icon-info-circle-fill />
              <template>
                Руководитель образовательной программы {{ userShortName(project.current_main_role_offer.sender)  }} предлагает вам стать главным руководителем в&nbsp;проекте
              </template>
            </b-alert>

            <b-alert v-if="project.bef_status === 'PUBL' && iHaveActiveParticipationInvite && project.exp_date && !(meIsMROP || meIsRROP)" show variant="primary" class="alert_icon">
              <b-icon-info-circle-fill />
              <template>
                {{ project.is_expired ? 'Срок ответа на заявку закончился' : 'Срок ответа на заявку заканчивается' }}
                <b class="nobr"> {{ formatDate(project.exp_date) }}</b>
              </template>
            </b-alert>
          </div>
        </b-col>
      </b-row>
    </template>

  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import Tabs from '@/components/Tabs'
import Person from '@/components/Person'
import Message from '@/components/Message'
import InviteRop from '@/components/project/InviteRop'
import ChangeMrop from '@/components/project/ChangeMrop'
import RoleActions from '@/components/request/RoleActions'
import FileDownload from '@/components/FileDownload'
import ForceAssignRop from '@/components/request/ForceAssignRop'
import ZPDeclineMessages from '@/components/project/ZPDeclineMessages'
import ParticipationResponse from '@/components/request/ParticipationResponse'


import format from 'date-fns/format'
import { model, userFullName, userShortName, declOfNum, groupBy } from '@/utils'
import makePDF from '@/utils/makePDF/Project'

export default {
  name: 'Request',
  components: {
    Tabs,
    Person,
    Message,
    InviteRop,
    ChangeMrop,
    FileDownload,
    RoleActions,
    ZPDeclineMessages,
    ForceAssignRop,
    ParticipationResponse,
  },
  data () {
    return {
      allRolesTabItems: [
        { label: 'Активные', value: 'active' }, 
        { label: 'Приглашения', value: 'invite' }, 
      ],
      allRolesTab: 'active',
      zpDecline: null
    }
  },
  created () {
    this.$store.dispatch('project/FETCH_project', { id: this.$route.params.id }).then(() => {
      if (!(this.meIsPartner || this.user.mainRole === 'partner')){
        this.$store.dispatch('project/FETCH_messages', { id: this.$route.params.id })
      }
    })
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.$store.dispatch('project/FETCH_project', { id: this.$route.params.id }).then(() => {
      if (!(this.meIsPartner || this.user.mainRole === 'partner')){
        this.$store.dispatch('project/FETCH_messages', { id: this.$route.params.id })
      }
    })

  },
  methods: {
    model,
    makePDF,
    userFullName,
    userShortName,
    formatTime: date => format(date, 'HH:mm'),
    formatDate: date => format(date, 'DD.MM.YYYY'),
    formatDateTime: date => format(date, 'DD.MM.YYYY HH:mm'),
    declOfNum: (num, word) => declOfNum(num, word),
    getProjectProgramByRopId (id) {
      const rop = this.getRop(id)
      if (rop && rop.programs) {
        const programsIntersection = rop.programs.filter(ropProgram => this.project.programs.some(projectProgram => projectProgram.program.id === ropProgram.id));
        return programsIntersection && programsIntersection.length ? programsIntersection[0] : rop.programs[0]
      } else {
        return { name: 'Not Found', uid: '' }
      }
    },
    updateProject(projectData) {
      this.$store.dispatch('project/FETCH_project', { id: this.project.id, project: projectData })
      this.$store.dispatch('project/FETCH_messages', { id: this.project.id, messages: projectData.messages })
    }
  },
  watch: {
    messages () {
      this.zpDecline = this.messages.find(message => message.type === 'ZPDC')
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      messages: state => state.project.messages,
      project: state => state.project.project
    }),
    ...mapGetters('api', [
      'getRop',
      'getProgram',
    ]),
    ...mapGetters('project', [
      'meIsMROP',
      'meIsRROP',
      'meIsPartner',
      'myProgram',
      'ropListActive',
      'MCUR',
      'MROP',
      'myLastParticipationRequest',
      'myLastRequestIsDeclined',
      'isWaitingForParticipationResponse',
      'participationRequests',
      'iHaveOfferTeacherChange',
    ]),
    projectLoaded () {
      return (this.project ? (this.$route.params.id === this.project.id) : false)
    },
    zpDeclineText () {
      let text = ''
      const zpDeclineObj = this.messages.find(message => message.type === 'ZPDC')
      if (zpDeclineObj && (zpDeclineObj.text || zpDeclineObj.user_text)) {
        text = zpDeclineObj.text || zpDeclineObj.user_text
      }
      return text
    },
    changeMropIgnoreList () {
      const changeInviteRop = this.notApprovedOffers.filter(offer => offer.type === 'teacher_change_offer').map(offer => offer.user.id)
      if (this.MROP) changeInviteRop.push(this.MROP.user.id)
      return changeInviteRop
    },
    inviteIgnoreList () {
      const activeRop = this.ropListActive.map(rop => rop.id)
      const inviteRop = this.notApprovedOffers.filter(offer => offer.type === 'participation_invite').map(offer => offer.user.id)
      return activeRop.concat(inviteRop)
    },
    ropListDeclined () {      
      return this.declinedOffers.map(offer => offer.user)      
    },
    ignoreArray () {      
      return this.declinedOffers.filter(offer => offer.type === 'participation_invite').map(offer => offer.user.id)      
    },
    participationRequestsNeedResponse() {
      return this.project.participation_requests.filter(request => request.status === null)
    },
    participationRequestsDecline() {
      return this.project.participation_requests.filter(request => request.status === false)
    },
    participationRequestsAccept() {
      return this.project.participation_requests.filter(request => request.status === true)
    },
    declinedOffers() {
      return this.project.offers.filter(offer => offer.status === 'declined')
    },
    participationDeclines() {
      return this.project.offers.filter(offer => offer.type === 'participation_invite' && offer.status === 'declined')
    },
    notApprovedOffers() {
      return this.project.offers.filter(offer => offer.status === 'active')
    },
    iDeclinedOffer() {
      return this.project.offers ? this.project.offers.find(offer => offer.status === 'decline' && offer.type === 'participation_invite' && (offer.user && offer.user.id === this.user.id)) : false
    },
    myActiveOffers() {
      return this.project.offers ? this.project.offers.filter(offer => offer.status === 'active' && (offer.user && offer.user.id === this.user.id)) : []
    },
    iHaveActiveParticipationInvite() {
      return this.myActiveOffers && this.myActiveOffers.some(offer => offer.type === 'participation_invite')
    },
    // Возвращает массив offer'ов, неповторяющихся относительно юзера (distinct).
    // Для каждого юзера вычисляется итоговый статус по отношению к заявке
    resultOffers() {
      if (!this.project.offers)
        return []

      // Группируем по юзеру
      return Array.from(groupBy(this.project.offers, offer => offer.user.id).values())
        .map(offers => {
          return {
            'user': offers[0].user,
            'status': offers.some(offer => offer.status === 'active') ? 'active': 'declined'
          }
        })
    },
    resultDeclinedOffers() {
      return this.resultOffers.filter(offer => offer.status === 'declined' )
    },
    resultNotApprovedOffers() {
      return this.resultOffers.filter(offer => offer.status === 'active')
    },
    projectProgramsOfParticipatingRops() {
      return this.project.programs.filter(program => program.rop_participation_status === true)
    },
    projectProgramsOfDeclinedRops() {
      return this.project.programs.filter(program => program.rop_participation_status === false)
    },
    projectProgramsOfRestRops() {
      return this.project.programs.filter(program => program.rop_participation_status === null)
    },
  }
}
</script>

<style lang="stylus">
  .all-roles__tabs {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .participations-count {
    outline: none;
  }
</style>
