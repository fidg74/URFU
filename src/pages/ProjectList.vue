<template>
    <b-container class="pb-sm-4">
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
                        <button class="filter-toggle d-sm-none" @click="filterMobileShow = true">
                          <svg class="filter-toggle__svg" width="25" height="23" viewBox="0 0 25 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 18.75C3.5 16.6789 5.17893 15 7.25 15C9.32107 15 11 16.6789 11 18.75C11 20.8211 9.32107 22.5 7.25 22.5C5.17893 22.5 3.5 20.8211 3.5 18.75ZM7.25 16.5C6.00736 16.5 5 17.5074 5 18.75C5 19.9926 6.00736 21 7.25 21C8.49264 21 9.5 19.9926 9.5 18.75C9.5 17.5074 8.49264 16.5 7.25 16.5Z" fill="#467BE3"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M14 11.25C14 9.17893 15.6789 7.5 17.75 7.5C19.8211 7.5 21.5 9.17893 21.5 11.25C21.5 13.3211 19.8211 15 17.75 15C15.6789 15 14 13.3211 14 11.25ZM17.75 9C16.5074 9 15.5 10.0074 15.5 11.25C15.5 12.4926 16.5074 13.5 17.75 13.5C18.9926 13.5 20 12.4926 20 11.25C20 10.0074 18.9926 9 17.75 9Z" fill="#467BE3"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 3.75C3.5 1.67893 5.17893 1.6891e-06 7.25 1.50804e-06C9.32107 1.32698e-06 11 1.67893 11 3.75C11 5.82107 9.32107 7.5 7.25 7.5C5.17893 7.5 3.5 5.82107 3.5 3.75ZM7.25 1.5C6.00736 1.5 5 2.50736 5 3.75C5 4.99264 6.00736 6 7.25 6C8.49264 6 9.5 4.99264 9.5 3.75C9.5 2.50736 8.49264 1.5 7.25 1.5Z" fill="#467BE3"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.25 18L24.5 18L24.5 19.5L10.25 19.5L10.25 18ZM0.5 18L4.25 18L4.25 19.5L0.5 19.5L0.5 18Z" fill="#467BE3"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.25 3L24.5 3L24.5 4.5L10.25 4.5L10.25 3ZM0.499998 3L4.25 3L4.25 4.5L0.499998 4.5L0.499998 3Z" fill="#467BE3"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.75 10.5L0.499999 10.5L0.499999 12L14.75 12L14.75 10.5ZM24.5 10.5L20.75 10.5L20.75 12L24.5 12L24.5 10.5Z" fill="#467BE3"/>
                          </svg>
                          <span class="filter-toggle__num" v-if="numActiveFilters">{{ numActiveFilters }}</span>
                        </button>
                        <button class="form__search-close" @click="search = null" />
                    </b-form-group>
          
                    <div v-if="((mode === 'request' && user.isRop && filterOwn === 'all') || user.isZP)" class="program d-none d-sm-block">
                        <ProgramSelect btn="Показать проекты" multiple v-model="filterItem.program"/>
                    </div>

                    <b-form-checkbox v-if="mode === 'request' && user.isRop && filterOwn === 'me' && !(['ACPT', 'DCLN', 'PDCL'].indexOf(filterState) > -1)" class="filter__hot" v-model="filterItem.hot" switch value="hot" :unchecked-value="null">
                        <div class="ml-1 text-oneline">Показать горящие заявки</div>
                    </b-form-checkbox>
                </b-card>

                <div class="filter__aside status-filter d-sm-none" v-if="mode !== 'implementation'">
                    <div class="status-filter__dropdown" @click="toggleFilterStatus">
                      <h4 class="pl-sm-4 mb-0 mb-sm-2 weight-bold">Статус</h4>
                      <div class="status-filter__arrow" :class="{'opened': showFilterStatus}">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <mask id="mask0_17260_1460" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="8" height="8">
                          <rect width="8" height="8" fill="#C4C4C4"/>
                          </mask>
                          <g mask="url(#mask0_17260_1460)">
                          <path d="M4.15787 7.29702L7.24894 3.32279C7.35112 3.19142 7.2575 3 7.09107 3L0.908928 3C0.742498 3 0.648879 3.19142 0.751057 3.32279L3.84213 7.29702C3.9222 7.39997 4.0778 7.39997 4.15787 7.29702Z" fill="#467BE3"/>
                          </g>
                        </svg>
                      </div>
                    </div>
                    <b-form-group v-if="mode === 'request'" :class="{'d-none': !showFilterStatus}">
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

            <b-col sm="3" class="mobile-filter" :class="{'show': filterMobileShow}">

                <div class="mobile-filter__header d-sm-none">
                    <h3 class="mobile-filter__title">Настройки фильтров</h3>
                    <button class="mobile-filter__close" @click="filterMobileShow = false">
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="1.29289" y1="15.2929" x2="15.435" y2="1.15076" stroke="#467BE3" stroke-width="2"/>
                        <path d="M2 1.29297L16.1421 15.4351" stroke="#467BE3" stroke-width="2"/>
                      </svg>
                    </button>
                </div>

                <div v-if="((mode === 'request' && user.isRop && filterOwn === 'all') || user.isZP)" class="program d-sm-none">
                    <ProgramSelect btn="Показать проекты" multiple v-model="filterItem.program"/>
                </div>

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

                    <div class="filter__aside d-none d-sm-block" v-if="mode !== 'implementation'">
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

          <div class="mobile-filter__buttons d-sm-none">
            <b-button class="btn_full p-2" variant="danger" @click="resetFilter" v-if="filterState !== null || (filterActive && filterActive.length) || (filterZP && filterZP.length) || (filterItem.program && filterItem.program.length) || filterItem.hot">
              Очистить фильтры
            </b-button>
          </div>

          <b-button class="btn_full p-2 mr-0 d-none d-sm-inline-block" variant="danger" @click="resetFilter" v-if="filterState !== null || (filterActive && filterActive.length) || (filterZP && filterZP.length) || (filterItem.program && filterItem.program.length) || filterItem.hot">
            Очистить фильтры
          </b-button>
        </div>
      </b-col>
    </b-row>

    <b-row class="d-sm-none">
      <b-col class="overflow-auto">
        <Paginator v-if="projects && projects.length" :pages="pagesData" @change-page="fetchList" class="paginator-projects" />
      </b-col>
    </b-row>
    
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
      showFilterStatus: false,
      projects: null,
      cancelToken: null,
      search: null,
      pagesData: {
        pages: 0,
        count: 0
      },

      throttleFetchList: null,
      zp_notif_text: '',

      filterMobileShow: false
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
        // console.log(data.data)
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
    toggleFilterStatus() {
      this.showFilterStatus = !this.showFilterStatus
    }
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
    numActiveFilters() {
      return this.filterActive.length
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
        padding: 20px 15px 25px !important;
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

    .status-filter {
      margin-top: 15px;
    }

    .filter__search .card-body {
      padding: 20px 15px 15px !important;
    }

    .filter__search legend {
      font-size: 16px;
      line-height: 16px;
      padding-bottom: 8px;
    }

    .form__search > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .form__search input {
      margin-right: 15px;
    }

    .filter-toggle {
      background: none;
      border: none;
      padding: 0;
    }

    .filter-toggle__num {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: rgba(57, 146, 255, 0.12);
      font-weight: 700;
      font-size: 10px;
      line-height: 10px;
      top: -16px;
      right: -7px;
    }

    .status-filter {
      padding: 15px 15px 0px;
      margin-bottom: 0;
    }

    .status-filter h4 {
      font-weight: 500;
    }

    .status-filter__dropdown {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 15px;
    }

    .status-filter__arrow {
      transition: .3s;
    }

    .status-filter__arrow.opened {
      transform: rotate(180deg);
    }

    .status-filter__arrow.opened path {
      fill: #9DA7B0;
    }

    .status-filter .filter__status .btn {
      height: 40px;
      display: flex;
      align-items: center;
    }

    .status-filter .filter__status:last-child .btn {
      margin-bottom: 7px;
    }

    .project-card .badge {
      position: unset;
    }

    .projects__list {
      margin-bottom: 0px;
    }

    .paginator-projects {
      margin-top: 30px;
    }

    /* Фильтр мобильной версии */

    .mobile-filter {
      position: fixed;
      top: -100%;
      left: 0;
      width: 100%;
      background: #FFFFFF;
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);
      z-index: 100;
      padding: 0;
      overflow: auto;
      height: 100vh;
      max-height: 100vh;
      transition: .5s;
    }

    .mobile-filter.show {
      top: 0;
    }

    .mobile-filter__header {
      padding: 20px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .mobile-filter__title {
      font-size: 18px;
      line-height: 23px;
      color: #000;
      font-weight: 500;
      margin: 0;
    }

    .mobile-filter__close {
      background: none;
      border: none;
      padding: 0;
      padding-right: 3px;
    }

    .mobile-filter .program {
      padding: 0 12px 16px;
    }

    .mobile-filter .program legend {
      font-size: 16px;
      line-height: 16px;
      padding-bottom: 8px;
    }

    .mobile-filter .pin-aside {
      max-height: initial;
      padding: 0 12px 15px;
      margin-bottom: 0 !important;
    }

    .mobile-filter .filter__aside {
      box-shadow: none;
      border-radius: 0;
    }

    .mobile-filter .filter__item {
      padding: 4px 0;
    }

    .mobile-filter .filter__item .btn {
      border-radius: 4px;
      background: rgba(57, 146, 255, 0.12);
      color: #467BE3;
      font-size: 13px;
      height: 40px;
      padding: 0 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .mobile-filter .filter__item_open .btn {
      color: #111112;  
    }

    .mobile-filter .filter__item .btn > i {
      display: none;
    }

    .mobile-filter__buttons {
      padding-top: 15px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .project-card__buttons .btn {
      background: #467BE3 !important;
      color: #fff !important;
      font-size: 14px !important; 
    }

    .project-card__buttons .btn-plus {
      display: none;
    }
}
</style>
