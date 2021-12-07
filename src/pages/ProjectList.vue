<template>
    <b-container class="pb-4">
        <h1>{{ mode === 'project' ? 'Паспорта' : mode === 'request' ? 'Заявки' : 'Реализуемые проекты' }}</h1>
        <div class="h1__description mb-sm-4" v-if="mode === 'request' && user.canCreate && !!this.semesterActual && this.semesterActual.period && (user.isRop || user.isZP)">
            Подайте заявку на {{ this.semesterActual.period.toLowerCase() }} семестр {{ this.semesterActual.year }} до {{ this.formatDate(this.semesterActual.deadline) }}.
            <i class="far fa-question-circle" v-b-tooltip.hover title="Если вы оставите заявку после указанной даты, то ее реализация переносится на следующий семестр." />
            <div class="mt-2" v-if="variables && variables.length">
                {{ getVariable(1).text }}
            </div>
        </div>

        <b-row class="mt-sm-4 tabs-row" v-if="mode === 'request'">
            <b-col v-if="user.isZP || user.isRop" class="overflow-auto" sm="8">
                <Tabs v-if="tabItems && tabItems.length" v-model="filterOwn" :items="tabItems" />
                <b-spinner variant="secondary" class="ml-4 filter__loading" v-if="isLoading" />
            </b-col>
            <b-col v-else sm="8">
                <div class="h1__description" v-if="mode === 'request' && !!this.semesterActual && this.semesterActual.period">
                    Подайте заявку на {{ this.semesterActual.period.toLowerCase() }} семестр {{ this.semesterActual.year }} до {{ this.formatDate(this.semesterActual.deadline) }}.
                    <i class="far fa-question-circle" v-b-tooltip.hover title="Если вы оставите заявку после указанной даты, то ее реализация переносится на следующий семестр." />
                    <div class="mt-2" v-if="variables && variables.length">
                        {{ getVariable(1).text }}
                    </div>
                </div>
            </b-col>
            <b-col v-if="user.canCreate" class="text-right" sm="4">
                <b-button variant="primary" to="/new_request" class="mobile-w100 m-mb-2">
                    <i class="icon icon-plus" />
                    <span>Подать новую заявку</span>
                </b-button>
            </b-col>
        </b-row>

        <div v-else class="mt-4">
            <Tabs v-if="tabItems && tabItems.length" v-model="filterOwn" :items="tabItems" />
            <b-spinner variant="secondary" class="ml-4 filter__loading" v-if="isLoading" />
        </div>

        <b-row class="projects">
            <b-col sm="9">
                <b-card class="filter__search">
                    <b-form-group class="form__search" label="Поиск">
                        <b-form-input class="form__search-input" v-model="search" required autocomplete="off" type="text" :placeholder="mode === 'project' ? 'Поиск по паспортам' : mode === 'request' ? 'Поиск по заявкам' : 'Поиск по проектам'" />
                        <button class="form__search-close" @click="search = null" />
                    </b-form-group>
          
                    <div v-if="((mode === 'request' && user.isRop && filterOwn === 'all') || user.isZP)" class="program">
                        <ProgramSelect btn="Показать проекты" multiple v-model="filterItem.program"/>
                    </div>

                    <b-form-checkbox v-if="mode === 'request' && user.isRop && filterOwn === 'me' && !(['ACPT', 'DCLN', 'PDCL'].indexOf(filterState) > -1)" class="filter__hot" v-model="filterItem.hot" switch value="hot" :unchecked-value="null">
                        <div class="ml-1 text-oneline">Показать горящие заявки</div>
                    </b-form-checkbox>
                </b-card>

                <div class="projects__list" :class="{ 'avoid-events': isLoading }" v-if="projects && projects.length">
                    <ProjectListItem :mode="mode" @update-project="updateProjectsElement" :project="project" v-for="project in projects" :key="project.id" />
                </div>
                <div class="pb-4 pt-4 text-center" v-else-if="projects && !projects.length">
                    <b-card class="project p-2">
                        <h4 class="mb-0" v-if="search">Ничего не найдено, попробуйте изменить критерии поиска</h4>
                        <h4 class="mb-0" v-else>{{ mode === 'project' ? 'Паспортов нет' : mode === 'request' ? 'Заявок нет' : 'Проектов нет' }}</h4>
                    </b-card>
                </div>
            </b-col>
            <b-col sm="3">
                <div v-pin-aside="100" class="m-mb-4">
                    <b-card class="filter__search filter__search_aside">
                        <b-form-group class="form__search" label="Поиск">
                            <b-form-input class="form__search-input" v-model="search" required autocomplete="off" type="text" :placeholder="mode === 'project' ? 'Поиск по паспортам' : mode === 'request' ? 'Поиск по заявкам' : 'Поиск по проектам'" />
                            <button class="form__search-close" @click="search = null" />
                        </b-form-group>
            
                        <div class="mt-4" v-if="((mode === 'request' && user.isRop && filterOwn === 'all') || user.isZP)">
                            <ProgramSelect btn="Показать проекты" multiple v-model="filterItem.program"/>
                        </div>

                        <b-form-checkbox v-if="mode === 'request' && user.isRop && filterOwn === 'me' && !(['ACPT', 'DCLN', 'PDCL'].indexOf(filterState) > -1)" class="filter__hot mt-4" v-model="filterItem.hot" switch value="hot" :unchecked-value="null">
                            <div class="ml-1 text-oneline">Показать горящие заявки</div>
                        </b-form-checkbox>
                    </b-card>

                    <div class="filter__aside" v-if="mode !== 'implementation'">
                        <h4 class="pl-4 mb-2 weight-bold">Статус</h4>
                            <b-form-group v-if="mode === 'request'">
                                <b-form-radio class="filter__status filter__status_ALL" button v-model="filterState" :value="null">Все заявки</b-form-radio>
                                <b-form-radio :disabled="!(user.canCreate && (!filterOwn || filterOwn === 'mine'))" class="filter__status filter__status_DRFT" button v-model="filterState" value="DRFT">Черновик</b-form-radio>
                                <b-form-radio class="filter__status filter__status_PUBL" button v-model="filterState" value="PUBL">На рассмотрении</b-form-radio>
                                <b-form-radio class="filter__status filter__status_ACPT" button v-model="filterState" value="ACPT">Принятые</b-form-radio>
                                <b-form-radio v-if="user.mainRole !== 'curator'" class="filter__status filter__status_DCLN" button v-model="filterState" :value="user.isRop ? 'PDCL' : 'DCLN'">Непринятые</b-form-radio>
                            </b-form-group>
                            <b-form-group v-else>
                                <b-form-radio class="filter__status filter__status_ALL" button v-model="filterState" :value="null">Все паспорта</b-form-radio>
                                <b-form-radio class="filter__status filter__status_PUBL" button v-model="filterState" value="PSST">Формирование паспорта</b-form-radio>
                                <b-form-radio class="filter__status filter__status_PUBL" button v-model="filterState" value="PSPT">Паспорт на&nbsp;согласовании у&nbsp;партнера</b-form-radio>
                                <b-form-radio class="filter__status filter__status_PUBL" button v-model="filterState" value="PSUN">Паспорт на&nbsp;согласовании у&nbsp;университета</b-form-radio>
                                <b-form-radio class="filter__status filter__status_ACPT" button v-model="filterState" value="PSAP">Паспорт утвержден</b-form-radio>
                                <!-- <b-form-radio class="filter__status filter__status_ACPT" button v-model="filterState" value="CMPL">Завершенные</b-form-radio> -->
                            </b-form-group>
                    </div>

                <div class="filter__aside filter_items">
                  <div v-if="user.isPlAdmin" class="filter__item filter__item_oneline" :class="{ 'filter__item_open': filterActive.indexOf('manager') > -1 }">
                    <b-button @click="filterItemToggle('manager')">Заказчик <i class="icon-plus icon-plus_blue filter__item-x" /></b-button>
                    <div class="filter__content">
                      <b-form-checkbox-group v-if="managers && managers.length && filterItem.manager && filterItem.manager.length" v-model="filterItem.manager" name="filterItemPartner" stacked>
                        <b-form-checkbox v-for="managerId in filterItem.manager" :key="managerId" :value="managerId">
                          <div class="text-oneline ml-2 mb-2">{{ userFullName(getManager(managerId)) }}</div>
                        </b-form-checkbox>
                      </b-form-checkbox-group>
                      <ManagerSelect button multiple v-model="filterItem.manager" />
                    </div>
                  </div>

                <div v-if="user.mainRole !== 'partner' && (mode === 'project' || mode === 'implementation')" class="filter__item filter__item_oneline" :class="{ 'filter__item_open': filterActive.indexOf('multiprogram') > -1 }">
                  <b-button @click="filterItemToggle('multiprogram')">Программы <i class="icon-plus icon-plus_blue filter__item-x" /></b-button>
                  <div class="filter__content">
                    <b-form-radio class="mb-3" v-model="filterItem.multiprogram" value="yes">Межпрограммный</b-form-radio>
                    <b-form-radio v-model="filterItem.multiprogram" value="no">Монопрограммный</b-form-radio>
                  </div>
                </div>

                <div v-if="user.mainRole !== 'partner' && (mode === 'project' || mode === 'implementation')" class="filter__item filter__item_oneline" :class="{ 'filter__item_open': filterActive.indexOf('research') > -1 }">
                  <b-button @click="filterItemToggle('research')">Тип <i class="icon-plus icon-plus_blue filter__item-x" /></b-button>
                  <div class="filter__content">
                    <b-form-radio class="mb-3" v-model="filterItem.research" value="yes">Исследовательский</b-form-radio>
                    <b-form-radio v-model="filterItem.research" value="no">Прикладной</b-form-radio>
                  </div>
                </div>

            <div v-if="user.mainRole !== 'partner' && (mode === 'project' || mode === 'implementation')" class="filter__item filter__item_oneline" :class="{ 'filter__item_open': filterActive.indexOf('difficulty') > -1 }">
              <b-button @click="filterItemToggle('difficulty')">Сложность <i class="icon-plus icon-plus_blue filter__item-x" /></b-button>
              <div class="filter__content">
                <b-form-radio class="mb-3" v-model="filterItem.difficulty" value="a">A</b-form-radio>
                <b-form-radio class="mb-3" v-model="filterItem.difficulty" value="b">B</b-form-radio>
                <b-form-radio v-model="filterItem.difficulty" value="c">C</b-form-radio>
              </div>
            </div>

            <div v-if="user.mainRole !== 'partner' && user.mainRole !== 'curator' && filterOwn !== 'all'" class="filter__item filter__item_oneline" :class="{ 'filter__item_open': filterActive.indexOf('curator') > -1 }">
              <b-button @click="filterItemToggle('curator')">Куратор <i class="icon-plus icon-plus_blue filter__item-x" /></b-button>
              <div class="filter__content">
                <b-form-checkbox class="mb-3" v-model="filterItem.curator_unset">Не назначен</b-form-checkbox>
                <!-- <b-form-radio class="mb-3" v-model="filterItem.curator" :value="true">Назначен</b-form-radio> -->

                <b-form-checkbox-group v-if="filterItem.curator && filterItem.curator.length" v-model="filterItem.curator" name="filterItemCurator" stacked :disabled="filterItem.curator_unset">
                  <b-form-checkbox v-for="curatorId in filterItem.curator" :key="curatorId" :value="curatorId">
                    <div class="text-oneline ml-2 mb-2">{{ userFullName(getCurator(curatorId)) }}</div>
                  </b-form-checkbox>
                </b-form-checkbox-group>
                <CuratorSelect btnClass="btn_flat" submitText="Показать проекты" multiple :related="!user.isZP" v-model="filterItem.curator">                
                  <template #button>
                    <i class="fa fa-plus mr-2" />
                    <span>Выбрать куратора</span>
                  </template>
                </CuratorSelect>
              </div>
            </div>

            <div class="filter__item" v-if="user.isRop && filterOwn !== 'all' && user.programs && user.programs.length > 1" :class="{ 'filter__item_open': filterActive.indexOf('program') > -1 }">
              <b-button @click="filterItemToggle('program')">Образовательная программа <i class="icon-plus icon-plus_blue filter__item-x" /></b-button>
              <div class="filter__content">
                <b-form-checkbox-group v-model="filterItem.program" name="filterItemCurator" stacked>
                  <b-form-checkbox v-for="program in user.programs" :key="program.id" :value="program.id">
                    <div class="text-oneline ml-2 mb-2">
                      {{ program.uid }}
                      <i class="icon_grey ml-2 far fa-question-circle" v-b-tooltip.hover show :title="program.name" />
                    </div>
                  </b-form-checkbox>
                </b-form-checkbox-group>
              </div>
            </div>

            <div class="filter__item" :class="{ 'filter__item_open': filterActive.indexOf('semester') > -1 }">
              <b-button @click="filterItemToggle('semester')">Учебный год и семестр <i class="icon-plus icon-plus_blue filter__item-x" /></b-button>
              <div class="filter__content" v-if="Object.keys(semesterGroupByYear)">
                <treeselect
                  :options="Object.keys(semesterGroupByYear).map(item => Object({ id: item, label: item }))"
                  :clearable="false"
                  v-model="filterItemYear"
                />

                <div v-if="!semesterGroupByYear[filterItemYear]">
                  <b-form-radio class="mt-3" disabled>Осенний</b-form-radio>
                  <b-form-radio class="mt-3" disabled>Весенний</b-form-radio>
                </div>
                <b-form-radio
                  class="mt-3"
                  v-for="semestrType in semesterGroupByYear[filterItemYear]"
                  :key="semestrType.id"
                  name="filterItemSemestr"
                  v-model="filterItem.semester"
                  :value="semestrType.value"
                >
                  {{ semestrType.period }}
                </b-form-radio>
              </div>
            </div>


            <div v-if="(user.isRop && (filterOwn === 'all' || filterOwn === 'me')) || user.isZP" class="filter__item filter__item_oneline" :class="{ 'filter__item_open': filterActive.indexOf('partner') > -1 }">
              <b-button @click="filterItemToggle('partner')">Партнер <i class="icon-plus icon-plus_blue filter__item-x" /></b-button>
              <div class="filter__content">
                <b-form-checkbox-group v-if="filterItem.partner && filterItem.partner.length" v-model="filterItem.partner" name="filterItemPartner" stacked>
                  <b-form-checkbox v-for="partnerId in filterItem.partner" :key="partnerId" :value="partnerId">
                    <div class="text-oneline ml-2 mb-2">{{ getPartner(partnerId).name }}</div>
                  </b-form-checkbox>
                </b-form-checkbox-group>
                <PartnerSelect button multiple v-model="filterItem.partner" />
              </div>
            </div>

            <div v-if="user.mainRole !== 'partner' && mode === 'project'" class="filter__item filter__item_oneline" :class="{ 'filter__item_open': filterActive.indexOf('sent_its') > -1 }">
              <b-button @click="filterItemToggle('sent_its')">Выгрузка в ИТС <i class="icon-plus icon-plus_blue filter__item-x" /></b-button>
              <div class="filter__content">
                <b-form-radio class="mb-3" v-model="filterItem.sent_its" value="yes">Выгружен</b-form-radio>
                <b-form-radio v-model="filterItem.sent_its" value="no">Не выгружен</b-form-radio>
              </div>
            </div>

            <div v-if="user.mainRole !== 'partner' && mode === 'project'" class="filter__item filter__item_oneline" :class="{ 'filter__item_open': filterActive.indexOf('sent_tp') > -1 }">
              <b-button @click="filterItemToggle('sent_tp')">Выгрузка в TeamProject <i class="icon-plus icon-plus_blue filter__item-x" /></b-button>
              <div class="filter__content">
                <b-form-radio class="mb-3" v-model="filterItem.sent_tp" value="yes">Выгружен</b-form-radio>
                <b-form-radio v-model="filterItem.sent_tp" value="no">Не выгружен</b-form-radio>
              </div>
            </div>

          </div>

          <div class="filter__aside filter_items mt-4" v-if="user.isZP && mode === 'request'">
            <b-form-checkbox-group v-model="filterZP" name="filterItemCurator" stacked>
            </b-form-checkbox-group>
            <div class="filter__item filter__item_solo">
              <b-form-checkbox button value="RDCL" v-model="filterZP" name="filterItemCurator" >
                Отказы РОПов <i class="icon-plus icon-plus_blue filter__item-x" />
              </b-form-checkbox>
            </div>
            <div class="filter__item filter__item_solo">
              <b-form-checkbox button value="request" v-model="filterItem.deadline" name="filterItemCurator" >
                Истечение сроков отклика <i class="icon-plus icon-plus_blue filter__item-x" />
              </b-form-checkbox>
            </div>
            <!-- <div class="filter__item filter__item_solo">
              <b-form-checkbox button value="PCHR" v-model="filterZP" name="filterItemCurator" >
                Изменение ОП <i class="icon-plus icon-plus_blue filter__item-x" />
              </b-form-checkbox>
            </div> -->
          </div>

          <div class="filter__aside filter_items mt-4" v-if="user.isZP && mode === 'project'">
            <div class="filter__item filter__item_solo">
              <b-form-checkbox button value="passport" v-model="filterItem.deadline" name="filterItemCurator" >
                Истечение сроков формирования паспорта <i class="icon-plus icon-plus_blue filter__item-x" />
              </b-form-checkbox>
            </div>
            <div class="filter__item filter__item_solo">
              <b-form-checkbox button value="yes" v-model="filterItem.kernel" name="filterItemKernel" >
                Ядерный проект <i class="icon-plus icon-plus_blue filter__item-x" />
              </b-form-checkbox>
            </div>
          </div>

          <b-button class="btn_full p-2 mr-0" variant="danger" @click="resetFilter" v-if="filterState !== null || (filterActive && filterActive.length) || (filterZP && filterZP.length) || (filterItem.program && filterItem.program.length) || filterItem.hot">
            Очистить фильтры
          </b-button>
        </div>
      </b-col>
    </b-row>

    <Paginator v-if="projects && projects.length" :pages="pagesData" @change-page="fetchList" />
  </b-container>
</template>

<script>
// списко игноров для фильтров
const roleFilters = {
  rop: {
    request: {
        me: ['curator', 'semester', 'partner', 'hot'],
        mine: ['curator', 'semester'],
        all: ['semester', 'partner', 'program']
    },
    project: {
      me: ['multiprogram', 'research', 'difficulty', 'curator', 'semester', 'partner', 'sent_its', 'sent_tp', 'program'],
      mine: ['multiprogram', 'research', 'difficulty', 'curator', 'semester', 'sent_its', 'sent_tp', 'program']
    }
  },
  curator: {
    request: ['semester'],
    project: ['multiprogram', 'research', 'difficulty', 'semester', 'sent_its', 'sent_tp']
  },
  partner: {
    request: ['manager', 'semester'],
    project: {
      all: ['manager', 'semester'],
      mine: ['manager', 'semester'],
    }
  },
  zp: {
    request: {
      all: ['program', 'curator', 'semester', 'partner', 'deadline'],
      me: ['program', 'curator', 'semester', 'partner', 'deadline'],
      mine: ['program', 'curator', 'semester', 'partner', 'deadline']
    },
    project: {
      all: ['multiprogram', 'research', 'difficulty', 'curator', 'semester', 'partner', 'sent_its', 'sent_tp', 'program', 'deadline', 'kernel'],
      me: ['multiprogram', 'research', 'difficulty', 'curator', 'semester', 'partner', 'sent_its', 'sent_tp', 'program', 'deadline', 'kernel'],
      mine: ['multiprogram', 'research', 'difficulty', 'curator', 'semester', 'partner', 'sent_its', 'sent_tp', 'program', 'deadline', 'kernel']
    }
  }
}

import axios from 'axios'
const CancelToken = axios.CancelToken

import { mapState, mapGetters } from 'vuex'

import Tabs from '@/components/Tabs'
import ProjectListItem from '@/components/project/ListItem'
import Paginator from '@/components/Paginator'
import CuratorSelect from '@/components/selectModal/Curator'
import ProgramSelect from '@/components/selectModal/Program'
import PartnerSelect from '@/components/selectModal/Partner'
import ManagerSelect from '@/components/selectModal/Manager'

import { throttle, userFullName } from '@/utils'
import format from 'date-fns/format'
export default {
  name: 'ProjectList',
  components: {
    Tabs,
    ProjectListItem,
    Paginator,
    CuratorSelect,
    ProgramSelect,
    PartnerSelect,
    ManagerSelect
  },
  data () {
    return {
      freezeFilterOwn: false, // флаг временной отмены watch на фильтр Own
      freezeFilterState: false, // аналогично...
      filterReady: false,
      filterOwn: null,
      filterState: null,
      tabItemsRequests: [],
      tabItemsProjects: [],
      filterItem: {
        hot: null,
        curator: null,
        curator_unset: false,
        program: null,
        partner: null,
        manager: null,
        semester: null,
        multiprogram: null,
        research: null,
        difficulty: null,
        sent_its: null,
        sent_tp: null,
        deadline: null,
        kernel: null,
      },
      filterZP: [],
      filterActive: [],
      showHotRequest: false,
      filterItemYear: null,

      projects: null,
      cancelToken: null,
      search: null,
      pagesData: {
        pages: 0,
        count: 0
      },

      throttleFetchList: null,
      zp_notif_text: ''
    }
  },
  created () {
    this.$store.dispatch('api/FETCH_api', { key: 'variable' })

    if (this.$route.query.search) this.search = this.$route.query.search
    if (this.user.isRop) this.filterOwn = 'me'
    this.loadFilter()

    this.fetchList()
    this.throttleFetchList = throttle(this.fetchList, 1000)
  },
  beforeRouteUpdate (to, from, next) {
    next()
    if (this.user.isRop) this.filterOwn = 'me'
    this.loadFilter()
    // this.filterState = null
    // this.resetFilter()
    this.fetchList()
  },
  methods: {
    userFullName,
    formatDate: date => format(date, 'DD.MM.YYYY'),
    fetchList (page) {
      if (!this.filterReady) return false
      if (this.isLoading) this.cancelToken()
      
      if (page && page !== 1) this.params.set('page', page)
      else this.params.delete('page')

      this.$axios.get(this.learning_src + 'request/', {
        params: this.params,
        cancelToken: new CancelToken(c => {
          this.cancelToken = c
        })
      }).then(data => {
        this.cancelToken = null
        if (data.data) {
          this.projects = data.data.results
          this.pagesData = data.data.pages
          this.saveFilter()
          this.freezeFilterOwn = false
          this.freezeFilterState = false
        } 
      }).catch(() => {
        this.projects = []
        this.cancelToken = null
      })
    },
    filterItemToggle (name) {
      const index = this.filterActive.indexOf(name)
      if (index > -1) {
        this.filterActive.splice(index, 1)
        this.filterItem[name] = (name === 'program' || name === 'curator') ? [] : null
      } else {
        this.filterActive.push(name)
        if (name === 'semester') {
          this.filterItemYear = this.semesterActual.year
          this.filterItem.semester = this.semesterActual.value
        }
      }
    },
    async loadFilter () {
      [...this.filterActive].forEach(filter => this.filterItemToggle(filter))
      this.filterReady = false
      this.freezeFilterOwn = true
      this.freezeFilterState = true
      const prefix = this.mode + '-' + this.user.id
      let stored_value = localStorage.getItem(prefix + '-filter-own')
      if (stored_value !== null) { this.filterOwn = JSON.parse(stored_value) } else { this.filterOwn = this.user.isRop ? 'me' : null }
      stored_value = localStorage.getItem(prefix + '-filter-state')
      if (stored_value !== null) { this.filterState = JSON.parse(stored_value) } else { this.filterState = null }
      stored_value = localStorage.getItem(prefix + '-filter-item')
      const simple_filters = ['program', 'semester', 'multiprogram', 'research', 'difficulty', 'sent_its', 'sent_tp', 'deadline', 'kernel', ]
      if (stored_value !== null) { 
        stored_value = JSON.parse(stored_value) 
        this.filterItem.hot = stored_value.hot
        simple_filters.forEach(filter => {
          if (stored_value[filter] !== null) {
            if (filter == 'semester') {
              const year = parseInt(stored_value[filter].split('-')[0])
              this.filterItemYear = year + '/' + (year + 1)
            }
            this.filterItem[filter] = stored_value[filter]
            this.filterActive.push(filter)
          } else {
            this.filterItem[filter] = null
          }
        })
        if (stored_value.partner && stored_value.partner.length) {
          await this.$store.dispatch('api/FETCH_api', { key: 'partners' })
          this.filterItem.partner = stored_value.partner
          this.filterActive.push('partner')
        } else {
          this.filterItem.partner = []
        }
        if (stored_value.curator && stored_value.curator.length) {
          await this.$store.dispatch('api/FETCH_api', { key: 'curators' })
          this.filterItem.curator = stored_value.curator
          this.filterActive.push('curator')
        } else {
          this.filterItem.curator = []
        }
        if (stored_value.manager && stored_value.manager.length) {
          await this.$store.dispatch('api/FETCH_api', { key: 'managers' })
          this.filterItem.manager = stored_value.manager
          this.filterActive.push('manager')
        } else {
          this.filterItem.manager = []
        }
        if (stored_value.curator_unset) {
          this.filterItem.curator_unset = true
          this.filterActive.push('curator')
        } else {
          this.filterItem.curator_unset = false
        }
      } else { 
        this.filterItem.hot = false
        this.filterItem.curator = null
        this.filterItem.program = null
        this.filterItem.partner = null
        this.filterItem.manager = null
        this.filterItem.semester = null
        this.filterItem.multiprogram = null
        this.filterItem.research = null
        this.filterItem.difficulty = null
        this.filterItem.sent_its = null
        this.filterItem.sent_tp = null
        this.filterItem.curator_unset = false
      }
      stored_value = localStorage.getItem(prefix + '-filter-zp')
      if (stored_value !== null) { this.filterZP = JSON.parse(stored_value) } else { this.filterZP = [] }
      this.filterReady = true
    },
    saveFilter () {
      const prefix = this.mode + '-' + this.user.id
      localStorage.setItem(prefix + '-filter-zp', JSON.stringify(this.filterZP))
      localStorage.setItem(prefix + '-filter-item', JSON.stringify(this.filterItem))
      localStorage.setItem(prefix + '-filter-state', JSON.stringify(this.filterState))
      localStorage.setItem(prefix + '-filter-own', JSON.stringify(this.filterOwn))
    },
    resetFilter () {
      [...this.filterActive].forEach(filter => this.filterItemToggle(filter))
      this.filterZP = []
      this.filterState = null
      this.filterItem.program = null
      this.filterItem.hot = false
      this.filterItem.curator_unset = false
    },
    updateProjectsElement(projectData){
      const index = this.projects.findIndex(proj => proj.id === projectData.id)
      this.$set(this.projects, index, projectData)
    },
  },
  computed: {
    isLoading () { return typeof this.cancelToken === 'function' },
    mode () {
      
      // const pathToMode = {
      //   '/projects': 'project',
      //   '/requests': 'request',
      //   '/implementations': 'implementation'
      // }

      // по индексу вхождения, а не по полному совпадению, так как локально роут заявок /requests/
      // а на dev1 роут заявок /requests 
      return this.$route.path.indexOf('/projects') > -1 ? 'project' : this.$route.path.indexOf('/requests') > -1 ? 'request' : 'implementation'
    },
    tabItems () {
      let tmpTabs = []
      if (this.mode === 'request' && (this.user.isRop || this.user.isZP)) {
        tmpTabs = [
          { label: 'Заявки от меня', value: 'mine' },
        ]
        if (this.user.isRop) {
          tmpTabs.unshift({ label: 'Заявки для меня', value: 'me' })
          tmpTabs.push({ label: 'Заявки по другим программам', value: 'all' })
        }
        if (this.user.isZP) {
          tmpTabs.unshift({ label: 'Все заявки', value: null })
        }
      }
      if (this.mode === 'project' && (this.user.isRop || this.user.isZP || this.user.isPlAdmin)) {
        tmpTabs = [
          { label: 'Мои паспорта', value: 'mine' }
        ]
        if (this.user.isRop) {
          tmpTabs.unshift({ label: 'Паспорта для меня', value: 'me' })
        }
        if (this.user.isZP || this.user.isPlAdmin) {
          tmpTabs.unshift({ label: 'Все паспорта', value: null })
        }
      }
      if (this.mode === 'implementation' && (this.user.isRop || this.user.isZP || this.user.isPlAdmin)) {
        tmpTabs = [
          { label: 'Мои проекты', value: 'mine' }
        ]
        if (this.user.isRop) {
          tmpTabs.unshift({ label: 'Проекты для меня', value: 'me' })
        }
        if (this.user.isZP || this.user.isPlAdmin) {
          tmpTabs.unshift({ label: 'Все проекты', value: null })
        }
      }

      return tmpTabs
    },
    params () {
      const paramsRes = new URLSearchParams()
      const tempMode = this.mode === 'implementation' ? 'project' : this.mode
      paramsRes.set('mode', tempMode + 's')
      if (this.search && this.search.length > 0) paramsRes.set('search', this.search)
      else if (this.$route.query.search) paramsRes.set('search', this.$route.query.search)

      if (this.filterZP && this.filterZP.length) {
        this.filterZP.forEach(filterZPEl => paramsRes.append('state', filterZPEl))
      }
      for (const key in this.filterItem) {
        if (this.filterItem[key]) {
          let inputPerms = []
          this.user.current.groups.forEach(role => {
            let tmpInputPerms = []
            if (roleFilters[role]) {
              if (Array.isArray(roleFilters[role][tempMode])) {
                tmpInputPerms = roleFilters[role][tempMode]
              } else {
                tmpInputPerms = roleFilters[role][tempMode][this.filterOwn || 'all']
              }
              if (tmpInputPerms && tmpInputPerms.length) {
                inputPerms.push(tmpInputPerms)
              }
            }
          })
          const tmpListFilter = [...new Set([].concat(...inputPerms))]
          if (tmpListFilter && tmpListFilter.length && tmpListFilter.indexOf(key) > -1) {
            if (key == 'curator' && this.filterItem['curator_unset']) {
              paramsRes.append('curator', 'unset')
            } else if (Array.isArray(this.filterItem[key])) {
              this.filterItem[key].forEach(filterEl => paramsRes.append(key, filterEl))
            } else {
              paramsRes.append(key, this.filterItem[key])
            }
          }
        }
      }

      if (this.filterState) paramsRes.append('state', this.filterState)
      if (this.filterOwn) paramsRes.append('own', this.filterOwn)
      if (this.mode === 'implementation') paramsRes.append('state', 'PSAP')

      return paramsRes
    },
    ...mapState({
      user: state => state.user,
      semester: state => state.api.semester,
      managers: state => state.api.managers,
      variables: state => state.api.variables,
      learning_src: state => state.api.learning_src
    }),
    ...mapGetters('api', [
      'getCurator',
      'getManager',
      'getPartner',
      'semesterActual',
      'semesterGroupByYear',
      'getVariable'
    ])
  },
  watch: {
    filterState () {
      if (this.freezeFilterState) {
        this.freezeFilterState = false
      } else {
        this.filterItem.hot = null
      }
    },
    filterOwn (newVal) {
      if (this.freezeFilterOwn) {
        this.freezeFilterOwn = false
      } else {
        if (newVal !== 'mine' && this.filterState === 'DRFT') this.filterState = null
        // if (newVal === 'all') this.filterItem.curator = []
        // this.filterItem.program = null
        // this.filterItem.hot = null
      }
    },
    params () {
      if (this.throttleFetchList) this.throttleFetchList()
    }
  }
}
</script>

<style>
.row.projects {
    margin-top: 24px;
}
.projects__list {
    margin-top: 16px;
    margin-bottom: 16px;
}
.filter__search .card-body {
    padding: 14px 32px 26px;
    display: flex;
}
.filter__search .card-body .form__search {
    width: 100%;
    margin-bottom: 0;
}
.filter__search .program {
    flex: 35% 0 0;
    margin-left: 1.5rem;
}
.filter__search_aside {
    margin-bottom: 0px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s, margin-bottom 0.3s;
}
.filter__search_aside .card-body {
    display: block;
    padding: 14px 20px 20px;
}
.filter__hot {
    margin: 40px 0 0 28px;
    letter-spacing: -0.2px;
}
.filter__aside {
    background: #fff;
    color: #212529;
    border-radius: 6px;
    box-shadow: 0px 1px 2px rgba(0,0,0,0.12);
    padding: 16px 4px 4px;
    margin-bottom: 20px;
}
.filter__aside .btn:not(.btn_flat) {
    text-align: left;
    font-weight: 400;
    width: 100%;
    margin-right: 0;
    padding: 0.65rem 2.5rem 0.65rem 1.4rem;
    background: transparent;
    color: #111;
}
.filter__aside .btn:not(.btn_flat):hover {
    color: #111;
    box-shadow: none;
    background: rgba(57,146,255,0.12);
}
.filter__aside .btn:not(.btn_flat).active {
    color: #111 !important;
    box-shadow: none !important;
    background: rgba(57,146,255,0.16);
}
.filter__status {
    width: 100%;
    margin-bottom: 1px;
}
.filter__status .btn {
    padding-left: 36px !important;
    position: relative;
}
.filter__status .btn:before {
    content: '';
    position: absolute;
    left: 20px;
    top: 16px;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    display: inline-block;
    margin-bottom: 2px;
    margin-right: 8px;
    background: #111;
}
.filter__status_ALL .btn:before {
    background: #111;
}
.filter__status_DRFT .btn:before {
    background: #72808e;
}
.filter__status_PUBL .btn:before {
    background: #e39309;
}
.filter__status_ACPT .btn:before {
    background: #4eb135;
}
.filter__status_CMPL .btn:before {
    background: #467be3;
}
.filter__status_DCLN .btn:before {
    background: #f5222d;
}
.filter__status .disabled {
    background: transparent !important;
    color: #aaa !important;
}
.filter_items {
    padding: 0rem;
}
.filter__content {
    max-height: 0px;
    overflow: hidden;
    opacity: 0;
    padding: 0rem 1.5rem;
    transition: max-height 0.25s, opacity 0.25s;
}
.filter__content:after,
.filter__content:before {
    content: '';
    position: relative;
    height: 1rem;
    display: block;
}
.filter__item {
    padding: 4px;
    border-bottom: 1px solid rgba(114,128,142,0.15);
}
.filter__item:last-child {
    border-bottom: none;
}
.filter__item .btn:not(.btn_flat) {
    position: relative;
    color: #72808e;
    font-weight: 500;
}
.filter__item-x {
    position: absolute;
    right: 16px;
    top: 16px;
    transition: transform 0.3s;
}
.filter__item .fa-plus {
    color: rgba(70,123,227,0.3);
}
.filter__item_oneline .custom-control {
    overflow: hidden;
    padding-left: 25px;
    min-height: 23px;
}
.filter__item_oneline .custom-control-label {
    display: block;
}
.filter__item_solo .btn-group-toggle {
    width: 100%;
}
.filter__item_solo .btn.active .filter__item-x {
    transform-origin: center center;
    transform: rotate(45deg) scale(1.1);
}
.filter__item_solo .btn.active .filter__item-x:after,
.filter__item_solo .btn.active .filter__item-x:before {
    background: #72808e;
}
.filter__item_open .btn:not(.btn_flat) {
    color: #111 !important;
    box-shadow: none !important;
    background: rgba(57,146,255,0.16);
}
.filter__item_open .filter__item-x {
    transform-origin: center center;
    transform: rotate(45deg) scale(1.1);
}
.filter__item_open .filter__item-x:after,
.filter__item_open .filter__item-x:before {
    background: #72808e;
}
.filter__item_open .filter__content {
    max-height: 300px;
    opacity: 1;
    overflow: unset;
    transition: none;
}
.pin-aside_on .filter__hot {
    margin: 40px 0 0 0px;
}
.pin-aside_on .filter__search_aside {
    max-height: 300px;
    margin-bottom: 20px;
    transition: max-height 0.5s, margin-bottom 0.5s;
}
@media (max-width: 575px) {
    .row.projects {
        /* margin-top: 8px; */
        margin-top: 0;
    }
    .btn.mobile-w100 {
        display: block;
        margin-right: 0;
    }
    .m-mt-2 {
        margin-top: 8px;
    }
    .m-mb-2 {
        /* margin-bottom: 8px; */
        margin-bottom: 17px;
    }
    .m-mb-4 {
        margin-bottom: 16px;
    }
    .filter__search .card-body {
        flex-direction: column;
    }
    .filter__search .card-body .form__search {
    }
    .filter__hot {
        margin-left: 0;
    }
    .filter__hot.custom-control.custom-switch {
        margin: 8px 0 0 0;
    }
    .filter__search .program {
        margin-left: 0;
        margin-top: 8px;
    }
    .filter__search .card-body {
        padding: 15px;
    }
    .filter__aside {
        margin-bottom: 8px;
    }
    .filter__aside .btn:not(.btn_flat) {
        padding: 6px 15px;
    }
    .filter__aside.filter_items {
        margin-bottom: 0;
    }
    .project-card.card_content .card-body {
        padding: 15px;
    }

    h1 {
      font-size: 22px;
      line-height: 30px;
      margin-bottom: 10px;
    }

    h1 + .h1__description {
      margin-top: initial;
    }

    .h1__description {
      line-height: 20px;
      margin-bottom: 15px;
    }

    .tabs-row .ui-tabs {
      margin-bottom: 17px;
    }

    .tabs-row .btn {
      height: 36px;
    }

    .btn > i {
      margin-left: -20px;
      margin-top: 5px;
      position: absolute;
    } 

    .btn > i + span {
      margin-left: 0;
    }
}
</style>
