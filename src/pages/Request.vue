<template>
    <b-container>
        <b-button variant="primary" class="btn_flat mb-3" to="/requests">
            <i class="fas fa-arrow-left" />
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left mb-1" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
</svg>
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
                <b-col cols="12">
                    <b-card v-if="myLastRequestIsDeclined" class="card_content mb-4">
                        <Message :message="myLastParticipationRequest" />
                    </b-card>
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
                    <b-card class="card_content mt-0">
                        <i class="bi bi-chevron-down"></i>
                        <b-badge class="fl-right ml-2" variant="primary" v-if="project.kernel && !user.isPartner">
                            Ядерный проект
                        </b-badge>
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
                        
                        <div>
                            <h4 class="mt-5 mb-2">Цель
                                <svg @click="showAim = !showAim" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </h4>
                            <transition name="fade">
                                <div v-if="showAim" v-html="project.req_goal" class="project__user-text" />
                            </transition>
                        </div>

                        <div>
                            <h4 class="mt-5 mb-2">Результат (продукт)
                                <svg @click="showRes = !showRes" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </h4>
                            <transition name="fade">
                                <div v-if="showRes" v-html="project.req_result" class="project__user-text" />
                            </transition>
                        </div>
                        
                        <div>
                            <h4 class="mt-5 mb-2">Критерии приемки
                                <svg @click="showCriteria = !showCriteria" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </h4>
                            <transition name="fade">
                                <div v-if="showCriteria" v-html="project.req_criteria" class="project__user-text" />
                            </transition>
                        </div>
                        
                        <div>
                            <h4 class="mt-5 mb-2">Описание проекта
                                <svg @click="showDescription = !showDescription" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </h4>
                            <transition name="fade">
                                <div v-if="showDescription" v-html="project.req_description" class="project__user-text" />
                            </transition>
                        </div>
                        
            
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

                    <b-card
                        no-body
                        class="card_content"
                        v-if="(meIsMROP && partReqsNeedResp.length > 0) ||
                            (rolesCount > 0) ||
                            (user.isStaff && resultOffers.length > 0)">
                        <b-card-body class="university-team">
                            <b-row>
                                <b-col>
                                    <h2>Участники проекта от университета</h2>
                                    <template v-if="meIsMROP && partReqsNeedResp.length > 0">
                                        <h3>Запросы на участие <b-badge>{{ partReqsNeedResp.length }}</b-badge></h3>
                                        <div class="frame">
                                            <Person
                                                :user="req.user"
                                                v-for="req of partReqsNeedResp.concat(partReqsAccept, partReqsDecline).slice(0, 3)"
                                                :key="req.user.id">
                                                <b-badge v-if="req.status" variant="success">Подтвержден</b-badge>
                                                <b-badge v-else-if="req.status === false" variant="danger">Отклонен</b-badge>
                                                <b-badge v-else-if="!meIsMROP && req.status === null" variant="warning">Не подтвержден</b-badge>
                                                <ParticipationResponse 
                                                    v-else-if="meIsMROP && req.status === null" 
                                                    :projectId="project.id"
                                                    :participant="req.user"
                                                    @update-project="(projectData) => updateProject(projectData)"
                                                />
                                            </Person>
                                            <div class="stacked-avatars" v-if="partReqsNeedResp.length > 3">
                                                <UserAvatar class="person__image" :user="partReqsNeedResp[3].user" v-if="partReqsNeedResp.length > 3" />
                                                <UserAvatar class="person__image" :user="partReqsNeedResp[4].user" v-if="partReqsNeedResp.length > 4" />
                                                <UserAvatar class="person__image" :user="partReqsNeedResp[5].user" v-if="partReqsNeedResp.length > 5" />
                                                <a class="more" @click="showReqsNeedResp">Еще {{ partReqsNeedResp.length - 1 }} участника</a>
                                            </div>
                                        </div>
                                        <b-modal id="modalReqsNeedResp" size="lg" centered title="Запросы на участие" hide-footer="true">
                                            <b-container>
                                                <Person
                                                    :user="req.user"
                                                    v-for="req of partReqsNeedResp.concat(partReqsAccept, partReqsDecline)"
                                                    :key="req.user.id">
                                                    <b-badge v-if="req.status" variant="success">Подтвержден</b-badge>
                                                    <b-badge v-else-if="req.status === false" variant="danger">Отклонен</b-badge>
                                                    <b-badge v-else-if="!meIsMROP && req.status === null" variant="warning">Не подтвержден</b-badge>
                                                    <ParticipationResponse 
                                                        v-else-if="meIsMROP && req.status === null" 
                                                        :projectId="project.id"
                                                        :participant="req.user"
                                                        @update-project="(projectData) => updateProject(projectData)"
                                                    />
                                                </Person>
                                            </b-container>
                                        </b-modal>
                                    </template>
                                </b-col>
                            </b-row>
                        </b-card-body>
                        <b-card-body class="active-members-header" :class="partReqsNeedResp.length == 0 ? 'first' : ''" v-if="rolesCount > 0">
                            <b-row>
                                <b-col>
                                    <h3>Активные участники</h3>
                                </b-col>
                            </b-row>
                        </b-card-body>
                        <b-card-body
                            class="active-members-program"
                            v-for="prg of projectProgramsOfParticipatingRops.concat(projectProgramsOfDeclinedRops, projectProgramsOfRestRops).filter(p => p.roles.length > 0)"
                            :key="prg.id">
                            <b-row>
                                <b-col>
                                    <div :key="prg.id" class="program-name">
                                        <svg v-if="prg.is_main" v-b-tooltip title="Главная программа проекта" class="mr-2 mb-1" width="11" height="9" viewBox="0 0 11 9" fill="none">
                                            <path opacity="0.3" d="M10.5417 9H0.458333L0 1.00001L3.20833 2.99997L5.5 0L7.79167 3.00002L11 1.00001L10.5417 9Z" fill="black"/>
                                        </svg>
                                        <span class="text-caption mr-2">{{ prg.program.uid }}</span> {{ prg.program.name }}
                                    </div>
                                    <template v-if="prg.is_main">
                                        <Person :user="MROP">
                                            <template #caption>
                                                Главный руководитель образовательной программы
                                            </template>
                                            <template #footer v-if="meIsMROP && project.request_status === 'PUBL'">
                                                <ChangeMropLink
                                                    :projectId="project.id"
                                                    :ropListActive="ropListActive"
                                                    :ignore="changeMropIgnoreList"
                                                    :offerRecipient="project.current_main_role_offer ? project.current_main_role_offer.recipient : null"
                                                />
                                            </template>
                                        </Person>
                                        <Person :user="MCUR">
                                            <template #caption>
                                                Главный куратор
                                            </template>
                                            <CuratorSelect v-if="'assign_curator' in prg.available_actions"
                                                variant="secondary"
                                                title="Назначить куратора"
                                                @input="setCurator"
                                            />
                                        </Person>
                                    </template>
                                    <template v-else>
                                        <Person :user="getProgramTeacher(prg)">
                                            <template #caption>
                                                Руководитель образовательной программы
                                            </template>
                                            <template v-if="getProgramTeacherOfferedChangeTeacher(prg)">
                                                <b-badge variant="info">Приглашен стать главным РОП</b-badge>
                                            </template>
                                        </Person>
                                        <Person :user="getProgramCurator(prg)">
                                            <template #caption>
                                                Куратор
                                            </template>
                                            <CuratorSelect v-if="'assign_curator' in prg.available_actions"
                                                variant="secondary"
                                                title="Назначить куратора"
                                                @input="setCurator"
                                            />
                                        </Person>
                                    </template>
                                </b-col>
                            </b-row>
                        </b-card-body>
                        <b-card-body
                            class="invites"
                            :class="rolesCount > 0 ? '' : 'first'"
                            v-if="user.isStaff && resultOffers.length > 0">
                            <b-row>
                                <b-col>
                                    <h3>Приглашения</h3>
                                    <Person :user="offer.user" v-for="offer of resultOffers.slice(0, 3)" :key="offer.id" >                                        
                                        <b-badge v-if="offer.status === 'declined'" variant="danger">Отказался</b-badge>
                                        <b-badge v-else variant="warning" style="margin-top:10px;">Не подтвержден</b-badge>
                                        <template #caption>
                                            Руководитель образовательной программы
                                        </template>
                                        <template #footer v-if="offer.user_text">
                                            <i>{{ offer.user_text }}</i>
                                        </template>
                                    </Person>
                                    <div class="stacked-avatars" v-if="resultOffers.length > 3">
                                        <UserAvatar class="person__image" :user="resultOffers[3].user" v-if="resultOffers.length > 3" />
                                        <UserAvatar class="person__image" :user="resultOffers[4].user" v-if="resultOffers.length > 4" />
                                        <UserAvatar class="person__image" :user="resultOffers[5].user" v-if="resultOffers.length > 5" />
                                        <a class="more" @click="showOffers">Еще {{ resultDeclinedOffers.length - 3 }} приглашений</a>
                                    </div>
                                    <b-modal id="modalOffers" size="lg" centered title="Приглашения" :hide-footer="true">
                                        <b-container>
                                            <Person
                                                :user="offer.user"
                                                v-for="offer of resultOffers"
                                                :key="offer.id">
                                                <b-badge v-if="offer.status === 'declined'" variant="danger">Отказался</b-badge>
                                                <b-badge v-else variant="warning">Не подтвержден</b-badge>
                                                <template #caption>
                                                    Руководитель образовательной программы
                                                </template>
                                                <template #footer v-if="offer.user_text">
                                                    <i>{{ offer.user_text }}</i>
                                                </template>
                                            </Person>
                                        </b-container>
                                    </b-modal>
                                </b-col>
                            </b-row>
                        </b-card-body>
                    </b-card>

                    <b-card class="card_content" v-if="user.isZP && participationDeclines && participationDeclines.length">
                        <h2 class="mb-2">Отказы руководителей</h2>
                        <div class="border_bottom mb-4 pb-4" v-for="decline in participationDeclines" :key="decline.id">
                            <Person :user="getRop(decline.user.id)" />
                            <div class="mt-4 project__user-text" v-if="decline.user_text">{{ decline.user_text }}</div>
                        </div>
                    </b-card>

                    <b-card class="card_content mb-4" v-if="project && project.programs && project.programs.length">
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
                    <InviteRop
                        :projectId="project.id"
                        :ignore="inviteIgnoreList"
                        v-if="
                            (user.isZP && project.request_status === 'PUBL') ||
                            (meIsMROP && project.request_status === 'PUBL')
                    " />
                    <ForceAssignRop
                        v-if="user.isZP && !MROP && project.request_status !== 'DCLN'"
                        :projectId="project.id"
                        :ropListDeclined="ropListDeclined"
                        :ropListActive="ropListActive"
                        :ropListInactive="ropListInactive"
                        :ignore="ignoreArray"
                        @update-project="(projectData) => updateProject(projectData)" />
                    <ZPDeclineMessages
                        v-if="project.request_status !== 'DCLN' && user.isZP && project.rop_status === 'PRSD'"
                        onlySend
                        showROPForceButton
                        :projectId="project.id"
                        :projectStatus="project.request_status" />
                    <RoleActions v-if="project && project.id == $route.params.id" />
                    
                    <!-- <div v-pin-bottom>
                        <b-container class="pin-bottom__container">
                            <b-row>
                                <b-col cols="9">
                                    <b-card class="card_content">
                                        <div v-collapse-buttons class="buttons-wrapper"> -->
                    <i class="bi bi-three-dots"></i>
                    <b-container class="pin-bottom__container">
                        <b-row>
                            <b-card class="card-body btn-mobile" style="margin-top: 10px; border: 1px solid #ddd; text-align: center;">
                                <div v-collapse-buttons class="buttons-wrapper">
                                    <b-button class="btn_flat" @click="makePDF(project, 'request')">Сохранить в  PDF
                                        <svg style="padding: 5px; background-color: #447de1; color: white; border-radius: 3px;" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                                        </svg>
                                    </b-button>
                                </div>
                            </b-card>
                        </b-row>    
                    </b-container>
                                            
                                        <!-- </div>
                                    </b-card>
                                </b-col>
                            </b-row>
                        </b-container>
                    </div> -->

                </b-col>
                <b-col>
                    <div v-pin-aside style="margin-top: 10px;">
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
                        <!-- <div v-if="project.request_status === 'PUBL' && meIsPartner && (!MROP || (MROP && project.manager && (project.manager.id !== MROP.user.id)))" class="mb-4">
                            <b-alert show variant="primary" class="alert_icon">
                                <b-icon-info-circle-fill />
                                <span v-if="project.is_expired">На обработку заявки потребовалось больше времени. В&nbsp;ближайшее время мы&nbsp;с&nbsp;вами свяжемся.</span>
                                <span v-else>Вы получите ответ по&nbsp;заявке<b class="nobr"> до&nbsp;{{ formatDate(project.exp_date) }}</b></span>
                            </b-alert>
                        </div> -->


                        <b-alert v-if="project.bef_status === 'PUBL' && iHaveOfferTeacherChange" show variant="primary" class="alert_icon">
                            <b-icon-info-circle-fill />
                            <template>
                                Руководитель образовательной программы {{ userShortName(project.current_main_role_offer.sender)  }} предлагает вам стать главным руководителем в&nbsp;проекте
                            </template>
                        </b-alert>

                        <b-alert v-if="project.bef_status === 'PUBL' && iHaveActiveParticipationInvite && project.exp_date && !(meIsMROP || meIsRROP)" show variant="primary" class="alert_ico">
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

import Person from '@/components/Person'
import UserAvatar from '@/components/UserAvatar'
import Message from '@/components/Message'
import InviteRop from '@/components/project/InviteRop'
import ChangeMropLink from '@/components/project/ChangeMropLink'
import RoleActions from '@/components/request/RoleActions'
import FileDownload from '@/components/FileDownload'
import ForceAssignRop from '@/components/request/ForceAssignRop'
import ZPDeclineMessages from '@/components/project/ZPDeclineMessages'
import ParticipationResponse from '@/components/request/ParticipationResponse'
import CuratorSelect from '@/components/selectModal/Curator'


import format from 'date-fns/format'
import { model, userFullName, userShortName, declOfNum, groupBy } from '@/utils'
import makePDF from '@/utils/makePDF/Project'

export default {
    name: 'Request',
    components: {
        Person,
        UserAvatar,
        Message,
        InviteRop,
        ChangeMropLink,
        FileDownload,
        RoleActions,
        ZPDeclineMessages,
        ForceAssignRop,
        ParticipationResponse,
        CuratorSelect,
    },
    data () {
        return {
            showAim: true,
            showRes: true,
            showCriteria: true,
            showDescription: true,
            allRolesTabItems: [
                { label: 'Активные', value: 'active' }, 
                { label: 'Приглашения', value: 'invite' }, 
            ],
            allRolesTab: 'active',
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
        },
        showReqsNeedResp() {
            this.$bvModal.show("modalReqsNeedResp");
        },
        showOffers() {
            this.$bvModal.show("modalOffers");
        },
        setCurator(curatorId) {
            this.$store.dispatch('project/assignCurator', { 
                id: this.project.id, 
                params: {
                    'program': this.myProgram.program.id,
                    'curator': curatorId,
                }
            }).then(data => {
                this.$store.dispatch('project/FETCH_project', { id: this.project.id, project: data.project });
                this.$store.dispatch('project/FETCH_messages', { id: this.project.id, messages: data.project.messages });
            })
        },
        getProgramTeacher(program) {
            let role = program.roles.filter(r => r.role === 'RROP' || r.role === 'MROP');
            return role.length ? role[0].user : null;
        },
        getProgramTeacherOfferedChangeTeacher(program) {
            let role = program.roles.filter(r => r.role === 'RROP');
            return role.length ? role[0].offered_change_teacher : false;
        },
        getProgramCurator(program) {
            let role = program.roles.filter(r => r.role === 'RCUR' || r.role === 'MCUR');
            return role.length ? role[0].user : null;
        },
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
            'iHaveActiveParticipationInvite',
        ]),
        projectLoaded () {
            return (this.project ? (this.$route.params.id === this.project.id) : false)
        },
        zpDecline () {
            if (this.project && this.project.decline_message) {
                return this.project.decline_message;
            }
            return null;
        },
        zpDeclineText () {
            let text = '';
            if (this.zpDecline && (this.zpDecline.text || this.zpDecline.user_text)) {
                text = this.zpDecline.text || this.zpDecline.user_text;
            }
            return text;
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
            return this.resultDeclinedOffers ? this.resultDeclinedOffers.map(offer => offer.user) : [];
        },
        ropListInactive () {      
            return this.resultNotApprovedOffers ? this.resultNotApprovedOffers.map(offer => offer.user) : [];
        },
        ignoreArray () {      
            return this.declinedOffers ?
                this.declinedOffers.filter(offer => offer.type === 'participation_invite').map(offer => offer.user.id) :
                [];
        },
        partReqsNeedResp() {
            return this.project.participation_requests ?
                this.project.participation_requests.filter(request => request.status === null) :
                [];
        },
        partReqsDecline() {
            return this.project.participation_requests ?
                this.project.participation_requests.filter(request => request.status === false) :
                [];
        },
        partReqsAccept() {
            return this.project.participation_requests ?
                this.project.participation_requests.filter(request => request.status === true) :
                [];
        },
        declinedOffers() {
            return this.project.offers ?
                this.project.offers.filter(offer => offer.status === 'declined') :
                [];
        },
        participationDeclines() {
            return this.project.offers ?
                this.project.offers.filter(offer => offer.type === 'participation_invite' && offer.status === 'declined') :
                [];
        },
        notApprovedOffers() {
            return this.project.offers ? 
                this.project.offers.filter(offer => offer.status === 'active') :
                [];
        },
        iDeclinedOffer() {
            return this.project.offers ?
                this.project.offers.find(
                    offer => offer.status === 'decline' &&
                        offer.type === 'participation_invite' &&
                        (offer.user && offer.user.id === this.user.id)) :
                false;
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
                        'status': offers.some(offer => offer.status === 'active') ? 'active': 'declined',
                        'type': offers[0].type
                    }
                });
        },
        resultDeclinedOffers() {
            return this.resultOffers.filter(offer => offer.status === 'declined');
        },
        resultNotApprovedOffers() {
            return this.resultOffers.filter(offer => offer.status === 'active');
        },
        projectProgramsOfParticipatingRops() {
            return this.project.programs.filter(program => program.rop_participation_status === true);
        },
        projectProgramsOfDeclinedRops() {
            return this.project.programs.filter(program => program.rop_participation_status === false);
        },
        projectProgramsOfRestRops() {
            let programs = this.project.programs.filter(program => program.rop_participation_status === null)
            
            // при каждом приглашении в заявку, на бэке создается ОП паспорта проекта, поэтому необходимо фильтровать лишние
            const uniquePrograms = []
            for (const program of programs) {
                if (!uniquePrograms.some(p => p.program.id === program.program.id))
                    uniquePrograms.push(program)
            }
            programs = uniquePrograms

            const notParticipating = programs
                .filter(program => !this.projectProgramsOfParticipatingRops
                    .some(p => p.program.id === program.program.id))
            programs = notParticipating
            
            return programs;
        },
        rolesCount() {
            let count = 0;
            this.project.programs.forEach(p => count += p.roles.length);
            return count;
        },
    }
}
</script>

<style>
    /* #app {
        background: #F1F4FA;
        padding-top: 100px;
    }
    .aside {
        display: none;
    } */

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }



    .all-roles__tabs {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .participations-count {
        outline: none;
    }
    .active-members-header.card-body {
        border-top: 2px solid #e7e7e7;
        padding-bottom: 8px;
    }
    .active-members-header.card-body.first {
        border-top: none;
        padding-top: 0;
    }
    .active-members-program {
        padding-top: 32px;
        padding-bottom: 44px;
    }
    .active-members-program + .active-members-program {
        border-top: 1px solid #e7e7e7;
    }
    /* .active-members-program .person + .program-name {
    } */
    .active-members-program .person {
        margin-top: 22px;
    }
    .university-team.card-body {
        padding-bottom: 32px;
        padding-top: 32px;
    }
    .university-team h3 {
        font-weight: 500;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: -0.2px;
        color: #111112;
    }
    .university-team h2 + h3 {
        margin-top: 24px;
    }
    .university-team h3 span.badge {
        background: #f5222d;
        width: 13px;
        height: 13px;
        border-radius: 100%;
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        color: #fff;
        font-size: 10px;
        line-height: 10px;
        letter-spacing: -.5px;
        padding: 0;
        justify-content: center;
        vertical-align: 2px;
        margin-left: 4px;
    }
    .university-team .frame {
        border: 2px solid rgba(255, 95, 103, 0.24);
        box-sizing: border-box;
        border-radius: 6px;    
        padding: 20px 16px 22px 16px;
        margin: 22px -18px 0 -18px;
    }
    .university-team .frame .person + .person,
    .university-team .frame .stacked-avatars {
        margin-top: 26px;
    }  
    .card-body.invites {
        border-top: 2px solid #e7e7e7;
        padding-bottom: 44px;
        padding-top:  32px;
    }
    .card-body.invites.first {
        border-top: none;
        padding-top:  0;
    }
    .invites .person {
        margin-top: 22px;
    }
    .stacked-avatars {
        display: flex;
        align-items: baseline;
    }
    .stacked-avatars .user-avatar {
        flex: 0 0 auto;
    }
    .stacked-avatars .user-avatar + .user-avatar {
        margin-left: -12px;
        box-shadow: 0 0 0 2px #fff;
    }
    .stacked-avatars > a {
        display: inline-block;
        margin-left: 16px;
        font-weight: 500;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: -0.2px;
        color: #467BE3;
    }
    .invites .stacked-avatars {
        margin-top: 32px;
    }
    #modalParticipants .modal-body .container {
        padding: 0;
    }
    #modalParticipants .modal-body .person + .person {
        margin-top: 24px;
    }

    @media (max-width: 576px) {
        .btn-mobile{
            max-height: 60px;
            padding: 0;
        }
        h1{
            font-size: 22px;
            line-height: 26px;
        }
    }
</style>
