<template>
    <b-container class="passport-page" style="background: #F1F4FA;">
        <b-button variant="primary" class="btn_flat mb-3" to="/projects">
            <i class="fas fa-arrow-left" />
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left mb-1" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
</svg>
            <span>Все паспорта</span>
        </b-button>

        <template v-if="project">
            <h1>{{ project.name }}</h1>
            <div class="h1__description">Паспорт №{{ project.uid }} от {{ formatDate(project.passport_date) }} <br>
                на основании заявки №{{ project.uid }} от {{ formatDate(project.date) }}</div>

            <div class="mt-4">
                <div class="ui-tabs">
                    <label class="ui-tabs__item">
                        <div class="ui-tabs__label" @click="$router.push(`/requests/${ $route.params.id }`)">Заявка на проект</div>
                    </label>
                    <label class="ui-tabs__item active">
                        <div class="ui-tabs__label">Паспорт проекта</div>
                    </label>
                    <label v-if="project.request_status === 'PSAP'" class="ui-tabs__item">
                        <div class="ui-tabs__label" @click="$router.push(`/passport/${ $route.params.id }/implementation/`)">Реализация проекта</div>
                    </label>
                </div>
            </div>

            <div style="margin-top: 26px" class="project-status__wrap project-status__progress" v-bind:scrWidth="scrWidth" v-if="scrWidth <= 576">
                
                <div class="text-subtitle">Прогресс паспорта
                    <svg @click="showStatus = !showStatus" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                    </svg>
                    <div v-if="project.request_status === 'PSST' && !showStatus" :class="{ 'project-status': 1, 'project-status_active': project.request_status === 'PSST' }">
                            <div class="project-status__num">1</div>
                            <div class="project-status__title">Формирование паспорта</div>
                        </div>
                        <div v-if="project.request_status === 'PSPT' && !showStatus" :class="{ 'project-status': 1, 'project-status_active': project.request_status === 'PSPT' }">
                            <div class="project-status__num">2</div>
                            <div class="project-status__title">Паспорт на&nbsp;согласовании у&nbsp;партнера</div>
                        </div>
                        <div v-if="project.request_status === 'PSUN' && !showStatus" :class="{ 'project-status': 1, 'project-status_active': project.request_status === 'PSUN' }">
                            <div class="project-status__num">3</div>
                            <div class="project-status__title">Паспорт на&nbsp;согласовании у&nbsp;университета</div>
                        </div>
                        <div v-if="(project.request_status === 'CMPL' || project.request_status === 'PSAP') && !showStatus" :class="{ 'project-status': 1, 'project-status_active': (project.request_status === 'CMPL' || project.request_status === 'PSAP') }">
                            <div class="project-status__num">4</div>
                            <div class="project-status__title">Паспорт утвержден</div>
                        </div>
                    <transition>
                        
                        <div v-if="showStatus">
                            <div :class="{ 'project-status': 1, 'project-status_active': project.request_status === 'PSST' }">
                                <div class="project-status__num">1</div>
                                <div class="project-status__title">Формирование паспорта</div>
                            </div>
                            <div :class="{ 'project-status': 1, 'project-status_active': project.request_status === 'PSPT' }">
                                <div class="project-status__num">2</div>
                                <div class="project-status__title">Паспорт на&nbsp;согласовании у&nbsp;партнера</div>
                            </div>
                            <div :class="{ 'project-status': 1, 'project-status_active': project.request_status === 'PSUN' }">
                                <div class="project-status__num">3</div>
                                <div class="project-status__title">Паспорт на&nbsp;согласовании у&nbsp;университета</div>
                            </div>
                            <div :class="{ 'project-status': 1, 'project-status_active': (project.request_status === 'CMPL' || project.request_status === 'PSAP') }">
                                <div class="project-status__num">4</div>
                                <div class="project-status__title">Паспорт утвержден</div>
                            </div>
                        </div>
                    </transition>
                    
                </div>

                <div v-if="project.request_status === 'PSST'" class="mb-3 mt-3">
                    <b-alert show variant="primary" class="alert_icon">
                        <b-icon-info-circle-fill />
                        {{ meIsPartner ? 'Мы&nbsp;формируем паспорт и&nbsp;отправим его на&nbsp;согласование' : 'Заполните и&nbsp;отправьте паспорт на&nbsp;согласование заказчику' }}
                        <b class="nobr">до {{ formatDate(project.passport_deadline) }}</b>
                    </b-alert>
                </div>
                
            </div>

            <div class="alert alert-dismissible alert-danger mt-4" v-show="validateSumErrors">
                <div v-for="(message, index) of validate" :key="index + '_message'">
                    {{ message }}
                </div>
                <div v-show="program.error.length" v-for="(program, index) of validateProgram" :key="index + '_message-program'" class="pt-3 pb-3">
                    <div class="mb-2"><b>{{ program.name }}</b></div>
                    <ul class="pl-3 mb-0">
                        <li class="ml-2" v-for="(message, pindex) of program.error" :key="pindex">{{ message }}</li>
                    </ul>
                </div>
                <button type="button" @click="validateSumErrors = 0" class="close">×</button>
            </div>

            <b-row class="mt-4">
                <b-col cols="12" v-bind:scrWidth="scrWidth" v-if="scrWidth <= 576">
                    <b-alert show variant="primary" class="alert_icon alert_horizontal" v-if="project.request_status === 'PSPT' && meIsPartner">
                        <b-icon-info-circle-fill />
                        Паспорт сформирован Университетом на&nbsp;основе заявки и&nbsp;некоторые поля могли быть дополнены и&nbsp;изменены
                    </b-alert>

                    <b-card v-if="approveMessages && approveMessages.length" class="card_content mt-0 mb-4">
                        <!-- <Message v-for="message in approveMessages" :message="message" :key="message.id" v-show="!message.program || isShowProgram(message.program)" /> -->
                        <Message v-for="message in approveMessages" :message="message" :key="message.id" />
                    </b-card>
            
                    <b-card class="card_content mt-0">
                        <b-badge class="fl-right ml-2" variant="primary" v-if="project.kernel && !user.isPartner">Ядерный проект</b-badge>
                        <div>
                            <b-badge style="" :variant="project.request_status" class="">{{ model(project.request_status) }}</b-badge>
                        </div>
                        <h2 class="mt-4" style="margin:0;">Описание проекта<span class="fl-right" @click="showDescrFull = !showDescrFull" style="font-size: 16px; color: #9DA7B0;">Все
                            <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                            </svg></span>
                            </h2>
                        
                        
                        <transition name="fade"><div v-if="showDescrFull">
                        <h4 class="mt-5 mb-2">Полное название проекта
                            
                        </h4>
                        <div class="project__user-text">{{ project.name }}</div>

                        <div class="project__visible mt-4 mb-4" v-if="canSeePartner">
                            <template v-for="program of project.programs">
                                <div v-if="isShowProgram(program)" :key="program.id">
                                    <div class="mb-4">
                                        <h4 class="mt-5 mb-2">
                                            Краткое название проекта
                                            <div>
                                                <i class="form-eye ml-5 mt-3" v-b-tooltip title="Не видно заказчику" />
                                                <Comment style="left:-93%;" :field="program.id + '_project_short_name'" class="fl-right mt-3" :project="project.id" hidden />  
                                            </div>
                                            
                                        </h4>
                                        <div class="text-caption mb-1">{{ program.program.name }}</div>
                                        <div v-if="program.project_short_name" class="project__user-text">{{ program.project_short_name }}</div>
                                        <div v-else>Не заполнено</div>
                                    </div>
                                    <div class="mb-2">
                                        <h4 class="mt-5 mb-2">
                                            Название для диплома студента
                                            <div>
                                                <i class="form-eye ml-5 mt-3" v-b-tooltip title="Не видно заказчику" />
                                                <Comment style="left: -93%;" :field="program.id + '_student_diploma_name'" class="fl-right mt-3" :project="project.id" hidden />
                                            </div>
                                            
                                            
                                        </h4>
                                        <div class="text-caption mb-1">{{ program.program.name }}</div>
                                        <div v-if="program.student_diploma_name" class="project__user-text">{{ program.student_diploma_name }}</div>
                                        <div v-else>Не заполнено</div>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <h4 class="mt-5 mb-2">Цель
                            
                        </h4>
                        <div style="height: 20px;"><Comment style="left: -93%;" field="goal" class="fl-right" :project="project.id" /></div>
                        <div v-if="project.goal" v-html="project.goal" class="project__user-text" />
                        <div v-else>Не заполнено</div>

                        <h4 class="mt-5 mb-2">Результат (продукт)
                            
                        </h4>
                        <div style="height: 20px;"><Comment style="left: -93%;" field="result" class="fl-right" :project="project.id" /></div>
                        <div v-if="project.result" v-html="project.result" class="project__user-text" />
                        <div v-else>Не заполнено</div>

                        <div class="project__visible mt-4 mb-4" v-if="isMulti">
                            <template v-for="program of project.programs">
                                <div class="mb-2" v-if="isShowProgram(program)" :key="program.id">
                                    <h4 class="mt-5 mb-2">Результат (продукт)
                                        
                                    </h4>
                                    <div style="height: 20px;"><Comment style="left: -93%;" :field="program.id + '_result'" class="fl-right" :project="project.id" /></div>
                                    <div class="text-caption mb-1">{{ program.program.name }}</div>
                                    <div v-if="program.result" v-html="program.result" class="project__user-text" />
                                    <div v-else>Не заполнено</div>
                                </div>
                            </template>
                        </div>

                        <h4 class="mt-5 mb-2">Критерии приемки результата / продукта
                           
                        </h4>
                        <div style="height: 20px;"><Comment style="left: -93%;" field="criteria" class="fl-right" :project="project.id" /></div>
                        <div v-if="project.criteria" v-html="project.criteria" class="project__user-text" />
                        <div v-else>Не заполнено</div>

                        <div class="project__visible mt-4 mb-4" v-if="isMulti">
                            <template v-for="program of project.programs">
                                <div class="mb-2" v-if="isShowProgram(program)" :key="program.id">
                                    <h4 class="mt-5 mb-2">Критерии приемки результата / продукта
                                        
                                    </h4>
                                    <div style="height: 20px;"><Comment style="left: -93%;" :field="program.id + '_criteria'" class="fl-right" :project="project.id" /></div>
                                    <div class="text-caption mb-1">{{ program.program.name }}</div>
                                    <div v-if="program.criteria" v-html="program.criteria" class="project__user-text" />
                                    <div v-else>Не заполнено</div>
                                </div>
                            </template>
                        </div>

                        <h4 class="mt-5 mb-2">Описание проекта
                            
                        </h4>
                        <div style="height: 20px;"><Comment style="left: -93%;" field="description" class="fl-right" :project="project.id" /></div>
                        <div v-if="project.description" v-html="project.description" class="project__user-text" />
                        <div v-else>Не заполнено</div>

                        <div class="project__visible mt-4 mb-4" v-if="isMulti">
                            <template v-for="program of project.programs">
                                <div class="mb-2" v-if="isShowProgram(program)" :key="program.id">
                                    <h4 class="mt-4 mb-1">Описание проекта
                                        
                                    </h4>
                                    <div style="height: 20px;"><Comment style="left: -93%;" :field="program.id + '_description'" class="fl-right" :project="project.id" /></div>
                                    <div class="text-caption mb-1">{{ program.program.name }}</div>
                                    <div v-if="program.description" v-html="program.description" class="project__user-text" />
                                    <div v-else>Не заполнено</div>
                                </div>
                            </template>
                        </div>

                        <h4 class="mt-5 mb-2">Макс. количество экземпляров проекта
                            
                        </h4>
                        <div style="height: 20px;"><Comment style="left: -93%;" field="max_copies" class="fl-right" :project="project.id" /></div>
                        <div v-if="project.max_copies" class="project__user-text">{{ project.max_copies }}</div>
                        <div v-else>Не заполнено</div>
                        </div></transition>
                    </b-card>


                    <b-card class="card_content" v-if="!(!user.isPlAdmin && meIsPartner)">
                        <h2 class="mb-4">Партнер</h2>
                        <template v-if="!user.isPlAdmin">
                            <h4>Название организации</h4>
                            <div class="person">
                                <div class="person__info" v-if="project.partner">
                                    <b class="mb-1">{{ project.partner.short_name }}</b>
                                    <div class="text-caption mb-1">{{ project.partner.name }}</div>
                                    <div v-if="project.partner.phone">{{ project.partner.phone }}</div>
                                </div>
                            </div>
                        </template>

                        <h4>Заказчик</h4>
                        <Person :user="project.manager" />
                    </b-card>


                    <b-card class="card_content">
                        <h2 class="mb-4">Участники проекта от университета</h2>

                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="program.roles.length && ((project.request_status === 'PSST' && meIsPartner) || isShowProgram(program))" :key="program.id">
                                <h4>
                                    <svg v-if="program.is_main" v-b-tooltip title="Главная программа проекта" class="mr-2 mb-1" width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.3" d="M10.5417 9H0.458333L0 1.00001L3.20833 2.99997L5.5 0L7.79167 3.00002L11 1.00001L10.5417 9Z" fill="black" />
                                    </svg>
                                    {{ program.program.name }}
                                </h4>
                                <Person :user="getUserByRole(program.roles, 'RROP')" class="mt-3">
                                    <template #caption>
                                        {{ program.is_main ? model('MROP') : model('RROP') }}
                                    </template>
                                </Person>
                                <Person v-if="getUserByRole(program.roles, ['MCUR', 'RCUR'])" :user="getUserByRole(program.roles, ['MCUR', 'RCUR'])" class="mt-3">
                                    <template #caption>
                                        {{ model(getUserByRole(program.roles, ['MCUR', 'RCUR']).role) }}
                                    </template>
                                </Person>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content" v-if="canSeePartnerPSST">
                        <h2 class="mb-1">Эксперты
                            
                        </h2>
                        <div style="height: 20px;"><Comment style="left: -93%;" field="experts" class="fl-right" :project="project.id" /></div>
                        <template v-for="program of project.programs">
                            <div v-if="isShowProgram(program)" :key="program.id" class="mb-4">
                                <div style="width: 250px;" class="text-caption mb-1">
                                    <!-- <FieldChanges :field="program.id + '_experts'" :editable="canEditProgram(program)" title="Эксперты" class="fl-right" /> -->
                                    {{ program.program.name }}
                                </div>
                                <div v-if="program.experts" class="project__user-text">{{ program.experts }}</div>
                                <div v-else>Не заполнено</div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content" v-if="canSeePartnerPSST">
                        <h2 class="mb-5">Образовательная программа
                            <Comment style="left:-93%; margin-top:25px;" field="semester_course" class="fl-right" hidden :project="project.id" />
                        </h2>

                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="isShowProgram(program)" :key="program.id">
                                <template v-if="program.program.area && program.program.area.name">
                                    <h4 class="mb-2">Направление подготовки</h4>
                                    <div><span class="text-caption mr-2">{{ program.program.area.uid }}</span> {{ program.program.area.name }}</div>
                                </template>

                                <h4 class="mt-5 mb-2">Образовательная программа</h4>
                                <div><span class="text-caption mr-2">{{ program.program.uid }}</span> {{ program.program.name }}</div>
                    
                                <h4 class="mt-5 mb-2">Семестр</h4>
                                <div v-if="project.semester">{{ getSemester(project.semester).period }}</div>
                                <div v-else>Не заполнено</div>
                    
                                <h4 class="mt-5 mb-2">Курс</h4>
                                <div 
                                    :class="{ 'project__course': 1, 'project__course_active': program.course.indexOf(course) > -1 }"
                                    v-for="(course, index) in course[program.program.level]"
                                    :key="index">
                                    {{ index + 1 }}
                                </div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content" v-if="canSeePartner && canSeePartnerPSST">
                        <header class="row">
                            <b-col>
                                <h2>
                                    Тип и сложность проекта
                                </h2>
                            </b-col>
                            
                        </header>
                        <header class="mb-2">
                                <i class="form-eye ml-5" v-b-tooltip title="Не видно заказчику" />
                                <Comment class="fl-right" style="left:-93%; top: 3px" field="work_type_difficulty_type" :project="project.id" hidden />
                        </header>

                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="isShowProgram(program)" :key="program.id">
                                <h4 class="mb-2">Тип проекта</h4>
                                <div class="text-caption mb-1">{{ program.program.name }}</div>
                                <div v-if="program.work_type">{{ model(program.work_type) }}</div>
                                <div v-else>Не заполнено</div>

                                <h4 class="mt-5 mb-2">Уровень сложности</h4>
                                <div class="text-caption mb-1">{{ program.program.name }}</div>
                                <div v-if="program.difficulty_type">{{ model(program.difficulty_type) }}</div>
                                <div v-else>Не заполнено</div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content" v-if="canSeePartnerPSST">
                        <b-row>
                            <b-col>
                                <h2 class="mb-0">
                                    Количество команд и студентов
                                </h2>
                            </b-col>
                        </b-row>
                        <b-row class="mt-2">
                            <b-col>
                                <h3 class="mb-0">{{ studentsSum }}</h3>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <Comment style="left:-93%;" field="max_copies_students" class="fl-right mt-2" :project="project.id" />
                            </b-col>
                        </b-row>
                        <h4 class="mt-3 mb-2">Количество команд</h4>
                        <div v-if="project.max_copies" class="project__user-text">{{ project.max_copies }}</div>
                        <div v-else>Не заполнено</div>

                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="isShowProgram(program)" :key="program.id">
                                <h4 class="mt-5 mb-2">
                                    <FieldChanges :field="program.id + '_students'" :editable="canEditProgram(program)" title="Кол-во студентов в команде" class="fl-right" />
                                    Количество студентов в&nbsp;команде
                                </h4>
                                <div class="text-caption mb-1">{{ program.program.name }}</div>
                                <div v-if="program.students" class="project__user-text">{{ program.students }}</div>
                                <div v-else>Не заполнено</div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content" v-if="canSeePartnerPSST">
                        <h2 class="mb-4">
                            Требования к ролям
                        </h2>
                        <h2 class="mb-4"><Comment style="left:-93%;" field="compet_roles" class="fl-right" :project="project.id" /></h2>

                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="isShowProgram(program)" :key="program.id">
                                <h4 style="margin-top:50px;">{{ program.program.name }}</h4>

                                <div class="mb-2" v-for="(item, index) of program.compet_roles" :key="index">
                                    <div class="mb-0">
                                        <span class="weight-medium project__user-text">{{ item.role.name }}</span>
                                        <span class="ml-2 text-caption weight-medium">x {{ item.quantity }}</span>
                                    </div>
                                    <div v-html="item.description" class="project__user-text" />
                                </div>
                                <div v-if="!program.compet_roles.length">Не заполнено</div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content" v-if="canSeePartner && canSeePartnerPSST">
                        <header class="row mb-0">
                            <b-col>
                                <h2 class="mb-0">Список формируемых компетенций</h2>
                            </b-col>
                            
                        </header>
                        <header>
                            <b-col class="mt-1 mb-3">
                                <i class="form-eye" style="margin-left: 35px;" v-b-tooltip title="Не видно заказчику" />
                                <Comment class="fl-right" style="left:-97%; top: 3px;" field="professional_competence" :project="project.id" hidden />
                            </b-col>
                        </header>

                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="isShowProgram(program)" :key="program.id">
                                <h4>
                                    <FieldChanges :field="program.id + '_professional_competence_group_text'" :editable="canEditProgram(program)" title="Список формируемых компетенций" class="fl-right" />
                                    {{ program.program.name }}
                                </h4>
                                <div v-if="program.professional_competence_group_text" class="project__user-text" v-html="program.professional_competence_group_text"></div>
                                <!--{{ program.professional_competence_group_text }}-->
                                <div v-else>Не заполнено</div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content" v-if="project.semester && getSemester(project.semester) && canSeePartnerPSST">
                        <b-row>
                            <b-col>
                                <h2 class="mb-0">Сроки реализации</h2>
                            </b-col>
                            <b-col>
                                <h3 class="mb-0">{{ formatDate(getSemester(project.semester).start_date) }} – {{ formatDate(getSemester(project.semester).finish_date) }}</h3>
                            </b-col>
                        </b-row>
                    </b-card>

                    <b-card class="card_content" v-if="canSeePartnerPSST">
                        <h2 class="mb-3">
                            Выделенные заказчиком ресурсы
                        </h2>
                        <h2><Comment style="left:-93%;" field="resources" class="fl-right mt-1" :project="project.id" /></h2>

                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="isShowProgram(program)" :key="program.id">
                                <h4 style="margin-top:50px;">{{ program.program.name }}</h4>
                                <b-table
                                    v-if="program.resources.length"
                                    borderless
                                    :items="program.resources"
                                    :fields="resourcesFields"
                                    class="mb-0"
                                    thead-class="table__header">
                                    <template v-slot:cell(resource)="data">
                                        <div class="project__user-text">{{ data.item.resource.name }}</div>
                                    </template>
                                </b-table>
                                <div v-else>Ресурсов нет</div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content" v-if="project.proj_files && project.proj_files.length">
                        <h2>Приложения</h2>
                        <FileDownload download :file="file" v-for="file in project.proj_files" :key="file.file_id" class="mt-4" />
                    </b-card>

                    <b-card class="mt-4">
                        <div>
                            
                            
                            <b-card class="program-choice__wrap mb-3" v-if="canSeePartnerPSST">
                                <h4 class="mb-3">{{ isMulti ? 'Образовательные программы' : 'Образовательная программа' }}</h4>
                                <button
                                    v-for="program in project.programs"
                                    :key="program.id"
                                    v-show="program.roles.length"
                                    class="program-choice mb-2"
                                    :class="{ 'program-choice_active': program.id === currentProgramId }"
                                    @click="currentProgramId = program.id">
                                    <svg v-if="program.is_main" v-b-tooltip title="Главная программа проекта" class="mr-2 mb-1" width="11" height="9" viewBox="0 0 11 9" fill="none">
                                        <path opacity="0.3" d="M10.5417 9H0.458333L0 1.00001L3.20833 2.99997L5.5 0L7.79167 3.00002L11 1.00001L10.5417 9Z" fill="black"/>
                                    </svg>
                                    <span class="text-caption mr-2">{{ program.program.uid }}</span>

                                    <svg v-if="canSeePartner && (project.request_status !== 'PSPT' && project.request_status !== 'PSAP')" class="program-choice__icon" width="13" height="13" viewBox="0 0 13 13" fill="none" v-b-tooltip :title="((program.status === 'PPS3' && !MCUR) || !getUserByRole(program.roles, ['RCUR', 'MCUR'])) ? 'Формирование паспорта' : model(program.status)">
                                        <circle cx="6.5" cy="6.5" r="6.5" :fill="program.status === 'PPS4' ? '#44A52C' : '#FBA40F'" />
                                        <path :d="program.status === 'PPS4' ? 'M4 7L6 8.5L9 4.5' : 'M6 3V7H9'" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                    <div>{{ program.program.name }}</div>
                                </button>
                                <b-button
                                    v-if="isMulti"
                                    :variant="currentProgramId === 0 ? 'primary' : 'secondary'"
                                    class="program-choice__all mt-2"
                                    @click="currentProgramId = 0">
                                    Все программы
                                </b-button>
                            </b-card>

                            

                            <div class="mb-3" v-if="!meIsPartner">
                                <b-button varian="primary" class="btn_full m-0" @click="likePartner = !likePartner; currentProgramId = 0">
                                    {{ likePartner ? 'Обычный просмотр' : 'Паспорт для Заказчика' }}
                                </b-button>
                            </div>

                            <b-button variant="success" class="show-changes btn_full mb-4" @click="showHistory" style="color:#558D61; background: #31A34326; border-color: #31A34326;">История правок паспорта</b-button>

                            <div class="project-status__wrap project-status__export" v-if="iHaveUniRole && (project.request_status === 'CMPL' || project.request_status === 'PSAP')">
                                <div class="text-subtitle export-status">Статус выгрузки в&nbsp;ИТС</div>
                                <div v-for="program of activePrograms" :key="program.id" class="programs">
                                    <div class="program-name"><span>{{ program.program.uid }}</span><br>{{ program.program.name }}</div>
                                    <div class="program-status published" v-if="program.published">Выгружено {{ formatDateTime(program.published) }}</div>
                                    <div class="program-status unpublished" v-else>
                                        <span v-if="program.its_result" class="error">Ошибка выгрузки в&nbsp;ИТС</span>
                                        <span v-else>Не опубликовано</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </b-card>

                    <Actions @errors="setErrors" />
                </b-col>
                <b-col cols="9" v-bind:scrWidth="scrWidth" v-if="scrWidth > 576">
                    <b-alert show variant="primary" class="alert_icon alert_horizontal" v-if="project.request_status === 'PSPT' && meIsPartner">
                        <b-icon-info-circle-fill />
                        Паспорт сформирован Университетом на&nbsp;основе заявки и&nbsp;некоторые поля могли быть дополнены и&nbsp;изменены
                    </b-alert>

                    <b-card v-if="approveMessages && approveMessages.length" class="card_content mt-0 mb-4">
                        <!-- <Message v-for="message in approveMessages" :message="message" :key="message.id" v-show="!message.program || isShowProgram(message.program)" /> -->
                        <Message v-for="message in approveMessages" :message="message" :key="message.id" />
                    </b-card>
            
                    <b-card class="card_content mt-0">
                        <b-badge class="fl-right ml-2" variant="primary" v-if="project.kernel && !user.isPartner">Ядерный проект</b-badge>
                        <b-badge :variant="project.request_status" class="fl-right">{{ model(project.request_status) }}</b-badge>
                        <h2>Описание проекта</h2>
                
                        <h4 class="mt-5 mb-2">Полное название проекта
                            <Comment field="name" :project="project.id" class="fl-right" />
                            <FieldChanges field="name" :editable="canEditCommon" title="Полное название проекта" class="fl-right" />
                        </h4>
                        <div class="project__user-text">{{ project.name }}</div>

                        <div class="project__visible mt-4 mb-4" v-if="canSeePartner">
                            <template v-for="program of project.programs">
                                <div v-if="isShowProgram(program)" :key="program.id">
                                    <div class="mb-4">
                                        <h4 class="mt-5 mb-2">
                                            Краткое название проекта
                                            <i class="form-eye ml-2" v-b-tooltip title="Не видно заказчику" />
                                            <Comment :field="program.id + '_project_short_name'" class="fl-right" :project="project.id" hidden />
                                            <FieldChanges :field="program.id + '_project_short_name'" 
                                                :editable="canEditProgram(program)"
                                                title="Краткое название проекта" class="fl-right" />
                                        </h4>
                                        <div class="text-caption mb-1">{{ program.program.name }}</div>
                                        <div v-if="program.project_short_name" class="project__user-text">{{ program.project_short_name }}</div>
                                        <div v-else>Не заполнено</div>
                                    </div>
                                    <div class="mb-2">
                                        <h4 class="mt-5 mb-2">
                                            Название для диплома студента
                                            <i class="form-eye ml-2" v-b-tooltip title="Не видно заказчику" />
                                            <Comment :field="program.id + '_student_diploma_name'" class="fl-right" :project="project.id" hidden />
                                            <FieldChanges :field="program.id + '_student_diploma_name'" 
                                                :editable="canEditProgram(program)"
                                                title="Название для диплома студента" class="fl-right" />
                                        </h4>
                                        <div class="text-caption mb-1">{{ program.program.name }}</div>
                                        <div v-if="program.student_diploma_name" class="project__user-text">{{ program.student_diploma_name }}</div>
                                        <div v-else>Не заполнено</div>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <h4 class="mt-5 mb-2">Цель
                            <Comment field="goal" class="fl-right" :project="project.id" />
                            <FieldChanges field="goal" :editable="canEditCommon" title="Цель" class="fl-right" />
                        </h4>
                        <div v-if="project.goal" v-html="project.goal" class="project__user-text" />
                        <div v-else>Не заполнено</div>

                        <h4 class="mt-5 mb-2">Результат (продукт)
                            <Comment field="result" class="fl-right" :project="project.id" />
                            <FieldChanges field="result" :editable="canEditCommon" title="Результат (продукт)" class="fl-right" />
                        </h4>
                        <div v-if="project.result" v-html="project.result" class="project__user-text" />
                        <div v-else>Не заполнено</div>

                        <div class="project__visible mt-4 mb-4" v-if="isMulti">
                            <template v-for="program of project.programs">
                                <div class="mb-2" v-if="isShowProgram(program)" :key="program.id">
                                    <h4 class="mt-5 mb-2">Результат (продукт)
                                        <Comment :field="program.id + '_result'" class="fl-right" :project="project.id" />
                                        <FieldChanges :field="program.id + '_result'" :editable="canEditProgram(program)" title="Результат (продукт)" class="fl-right" />
                                    </h4>
                                    <div class="text-caption mb-1">{{ program.program.name }}</div>
                                    <div v-if="program.result" v-html="program.result" class="project__user-text" />
                                    <div v-else>Не заполнено</div>
                                </div>
                            </template>
                        </div>

                        <h4 class="mt-5 mb-2">Критерии приемки результата / продукта
                            <Comment field="criteria" class="fl-right" :project="project.id" />
                            <FieldChanges field="criteria" :editable="canEditCommon" title="Критерии приемки результата / продукта" class="fl-right" />
                        </h4>
                        <div v-if="project.criteria" v-html="project.criteria" class="project__user-text" />
                        <div v-else>Не заполнено</div>

                        <div class="project__visible mt-4 mb-4" v-if="isMulti">
                            <template v-for="program of project.programs">
                                <div class="mb-2" v-if="isShowProgram(program)" :key="program.id">
                                    <h4 class="mt-5 mb-2">Критерии приемки результата / продукта
                                        <Comment :field="program.id + '_criteria'" class="fl-right" :project="project.id" />
                                        <FieldChanges :field="program.id + '_criteria'" :editable="canEditProgram(program)" title="Критерии приемки результата / продукта" class="fl-right" />
                                    </h4>
                                    <div class="text-caption mb-1">{{ program.program.name }}</div>
                                    <div v-if="program.criteria" v-html="program.criteria" class="project__user-text" />
                                    <div v-else>Не заполнено</div>
                                </div>
                            </template>
                        </div>

                        <h4 class="mt-5 mb-2">Описание проекта
                            <Comment field="description" class="fl-right" :project="project.id" />
                            <FieldChanges field="description" :editable="canEditCommon" title="Описание проекта" class="fl-right" />
                        </h4>
                        <div v-if="project.description" v-html="project.description" class="project__user-text" />
                        <div v-else>Не заполнено</div>

                        <div class="project__visible mt-4 mb-4" v-if="isMulti">
                            <template v-for="program of project.programs">
                                <div class="mb-2" v-if="isShowProgram(program)" :key="program.id">
                                    <h4 class="mt-4 mb-1">Описание проекта
                                        <Comment :field="program.id + '_description'" class="fl-right" :project="project.id" />
                                        <FieldChanges :field="program.id + '_description'" :editable="canEditProgram(program)" title="Описание проекта" class="fl-right" />
                                    </h4>
                                    <div class="text-caption mb-1">{{ program.program.name }}</div>
                                    <div v-if="program.description" v-html="program.description" class="project__user-text" />
                                    <div v-else>Не заполнено</div>
                                </div>
                            </template>
                        </div>

                        <h4 class="mt-5 mb-2">Макс. количество экземпляров проекта
                            <Comment field="max_copies" class="fl-right" :project="project.id" />
                            <FieldChanges field="max_copies" :editable="canEditCommon" title="Макс. количество экземпляров проекта" class="fl-right" />
                        </h4>
                        <div v-if="project.max_copies" class="project__user-text">{{ project.max_copies }}</div>
                        <div v-else>Не заполнено</div>
                    </b-card>


                    <b-card class="card_content" v-if="!(!user.isPlAdmin && meIsPartner)">
                        <h2 class="mb-4">Партнер</h2>
                        <template v-if="!user.isPlAdmin">
                            <h4>Название организации</h4>
                            <div class="person">
                                <div class="person__info" v-if="project.partner">
                                    <b class="mb-1">{{ project.partner.short_name }}</b>
                                    <div class="text-caption mb-1">{{ project.partner.name }}</div>
                                    <div v-if="project.partner.phone">{{ project.partner.phone }}</div>
                                </div>
                            </div>
                        </template>

                        <h4>Заказчик</h4>
                        <Person :user="project.manager" />
                    </b-card>


                    <b-card class="card_content">
                        <h2 class="mb-4">Участники проекта от университета</h2>

                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="program.roles.length && ((project.request_status === 'PSST' && meIsPartner) || isShowProgram(program))" :key="program.id">
                                <h4>
                                    <svg v-if="program.is_main" v-b-tooltip title="Главная программа проекта" class="mr-2 mb-1" width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.3" d="M10.5417 9H0.458333L0 1.00001L3.20833 2.99997L5.5 0L7.79167 3.00002L11 1.00001L10.5417 9Z" fill="black" />
                                    </svg>
                                    {{ program.program.name }}
                                </h4>
                                <Person :user="getUserByRole(program.roles, 'RROP')" class="mt-3">
                                    <template #caption>
                                        {{ program.is_main ? model('MROP') : model('RROP') }}
                                    </template>
                                </Person>
                                <Person v-if="getUserByRole(program.roles, ['MCUR', 'RCUR'])" :user="getUserByRole(program.roles, ['MCUR', 'RCUR'])" class="mt-3">
                                    <template #caption>
                                        {{ model(getUserByRole(program.roles, ['MCUR', 'RCUR']).role) }}
                                    </template>
                                </Person>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content" v-if="canSeePartnerPSST">
                        <h2>Эксперты
                            <Comment field="experts" class="fl-right" :project="project.id" />
                        </h2>
                        <template v-for="program of project.programs">
                            <div v-if="isShowProgram(program)" :key="program.id" class="mb-4">
                                <div class="text-caption mb-1">
                                    <FieldChanges :field="program.id + '_experts'" :editable="canEditProgram(program)" title="Эксперты" class="fl-right" />
                                    {{ program.program.name }}
                                </div>
                                <div v-if="program.experts" class="project__user-text">{{ program.experts }}</div>
                                <div v-else>Не заполнено</div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content" v-if="canSeePartnerPSST">
                        <h2 class="mb-4">Образовательная программа
                            <Comment field="semester_course" class="fl-right" hidden :project="project.id" />
                        </h2>

                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="isShowProgram(program)" :key="program.id">
                                <template v-if="program.program.area && program.program.area.name">
                                    <h4 class="mb-2">Направление подготовки</h4>
                                    <div><span class="text-caption mr-2">{{ program.program.area.uid }}</span> {{ program.program.area.name }}</div>
                                </template>

                                <h4 class="mt-5 mb-2">Образовательная программа</h4>
                                <div><span class="text-caption mr-2">{{ program.program.uid }}</span> {{ program.program.name }}</div>
                    
                                <h4 class="mt-5 mb-2">Семестр</h4>
                                <div v-if="project.semester">{{ getSemester(project.semester).period }}</div>
                                <div v-else>Не заполнено</div>
                    
                                <h4 class="mt-5 mb-2">Курс</h4>
                                <div 
                                    :class="{ 'project__course': 1, 'project__course_active': program.course.indexOf(course) > -1 }"
                                    v-for="(course, index) in course[program.program.level]"
                                    :key="index">
                                    {{ index + 1 }}
                                </div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content" v-if="canSeePartner && canSeePartnerPSST">
                        <header class="row mb-4">
                            <b-col>
                                <h2 class="mb-0">
                                    Тип и сложность проекта
                                </h2>
                            </b-col>
                            <b-col class="text-right">
                                <i class="form-eye ml-2" v-b-tooltip title="Не видно заказчику" />
                                <Comment field="work_type_difficulty_type" :project="project.id" hidden />
                            </b-col>
                        </header>

                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="isShowProgram(program)" :key="program.id">
                                <h4 class="mb-2">Тип проекта</h4>
                                <div class="text-caption mb-1">{{ program.program.name }}</div>
                                <div v-if="program.work_type">{{ model(program.work_type) }}</div>
                                <div v-else>Не заполнено</div>

                                <h4 class="mt-5 mb-2">Уровень сложности</h4>
                                <div class="text-caption mb-1">{{ program.program.name }}</div>
                                <div v-if="program.difficulty_type">{{ model(program.difficulty_type) }}</div>
                                <div v-else>Не заполнено</div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content" v-if="canSeePartnerPSST">
                        <b-row>
                            <b-col>
                                <h2 class="mb-0">
                                    Количество команд и студентов
                                </h2>
                            </b-col>
                            <b-col class="text-right">
                                <Comment field="max_copies_students" class="fl-right" :project="project.id" />
                                <h3 class="mb-0">{{ studentsSum }}</h3>
                            </b-col>
                        </b-row>
                        <h4 class="mt-5 mb-2">Количество команд</h4>
                        <div v-if="project.max_copies" class="project__user-text">{{ project.max_copies }}</div>
                        <div v-else>Не заполнено</div>

                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="isShowProgram(program)" :key="program.id">
                                <h4 class="mt-5 mb-2">
                                    <FieldChanges :field="program.id + '_students'" :editable="canEditProgram(program)" title="Кол-во студентов в команде" class="fl-right" />
                                    Количество студентов в&nbsp;команде
                                </h4>
                                <div class="text-caption mb-1">{{ program.program.name }}</div>
                                <div v-if="program.students" class="project__user-text">{{ program.students }}</div>
                                <div v-else>Не заполнено</div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content" v-if="canSeePartnerPSST">
                        <h2 class="mb-4">
                            Требования к ролям
                            <Comment field="compet_roles" class="fl-right" :project="project.id" />
                        </h2>

                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="isShowProgram(program)" :key="program.id">
                                <h4>{{ program.program.name }}</h4>

                                <div class="mb-2" v-for="(item, index) of program.compet_roles" :key="index">
                                    <div class="mb-0">
                                        <span class="weight-medium project__user-text">{{ item.role.name }}</span>
                                        <span class="ml-2 text-caption weight-medium">x {{ item.quantity }}</span>
                                    </div>
                                    <div v-html="item.description" class="project__user-text" />
                                </div>
                                <div v-if="!program.compet_roles.length">Не заполнено</div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content" v-if="canSeePartner && canSeePartnerPSST">
                        <header class="row mb-4">
                            <b-col>
                                <h2 class="mb-0">Список формируемых компетенций</h2>
                            </b-col>
                            <b-col class="text-right">
                                <i class="form-eye ml-2" v-b-tooltip title="Не видно заказчику" />
                                <Comment field="professional_competence"  :project="project.id" hidden />
                            </b-col>
                        </header>

                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="isShowProgram(program)" :key="program.id">
                                <h4>
                                    <FieldChanges :field="program.id + '_professional_competence_group_text'" :editable="canEditProgram(program)" title="Список формируемых компетенций" class="fl-right" />
                                    {{ program.program.name }}
                                </h4>
                                <div v-if="program.professional_competence_group_text" class="project__user-text" v-html="program.professional_competence_group_text"></div>
                                <!--{{ program.professional_competence_group_text }}-->
                                <div v-else>Не заполнено</div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content" v-if="project.semester && getSemester(project.semester) && canSeePartnerPSST">
                        <b-row>
                            <b-col>
                                <h2 class="mb-0">Сроки реализации</h2>
                            </b-col>
                            <b-col class="text-right">
                                <h3 class="mb-0">{{ formatDate(getSemester(project.semester).start_date) }} – {{ formatDate(getSemester(project.semester).finish_date) }}</h3>
                            </b-col>
                        </b-row>
                    </b-card>

                    <b-card class="card_content" v-if="canSeePartnerPSST">
                        <h2 class="mb-4">
                            Выделенные заказчиком ресурсы
                            <Comment field="resources" class="fl-right" :project="project.id" />
                        </h2>

                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="isShowProgram(program)" :key="program.id">
                                <h4>{{ program.program.name }}</h4>
                                <b-table
                                    v-if="program.resources.length"
                                    borderless
                                    :items="program.resources"
                                    :fields="resourcesFields"
                                    class="mb-0"
                                    thead-class="table__header">
                                    <template v-slot:cell(resource)="data">
                                        <div class="project__user-text">{{ data.item.resource.name }}</div>
                                    </template>
                                </b-table>
                                <div v-else>Ресурсов нет</div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content" v-if="project.proj_files && project.proj_files.length">
                        <h2>Приложения</h2>
                        <FileDownload download :file="file" v-for="file in project.proj_files" :key="file.file_id" class="mt-4" />
                    </b-card>

                    <Actions @errors="setErrors" />
                </b-col>

                
            </b-row>

            <b-toast
                v-bind:scrWidth="scrWidth"
                v-if="canComment && scrWidth > 576"
                id="informer-make-comments"
                solid
                :no-auto-hide="true"
                toaster="b-toaster-bottom-left"
                toast-class="passport-help"
                title="test"
                >
                <div class="icon blue">
                    <svg width="30" height="28" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M24.8173 20.3951C24.4407 20.7728 24.2521 21.2988 24.3029 21.8298C24.4169 23.0198 24.6793 24.2582 25.0163 25.4086C22.5191 24.8315 20.994 24.162 20.3008 23.8107C19.9073 23.6112 19.454 23.5642 19.0279 23.6784C17.8502 23.9942 16.5951 24.1653 15.2896 24.1653C8.13666 24.1653 2.75814 19.1392 2.75814 13.4241C2.75814 7.70889 8.13666 2.68279 15.2896 2.68279C22.4426 2.68279 27.8211 7.70889 27.8211 13.4241C27.8211 16.0523 26.716 18.4911 24.8173 20.3951ZM25.6999 27.3858C25.712 27.3882 25.724 27.3906 25.7361 27.393C25.9005 27.4254 26.0681 27.4573 26.2389 27.4885C26.4785 27.5324 26.7244 27.5751 26.9766 27.6164C27.3329 27.6747 27.6056 27.302 27.4649 26.9696C27.373 26.7524 27.2823 26.5247 27.194 26.2887C27.1379 26.1387 27.0827 25.9854 27.0288 25.8292C27.0265 25.8224 27.0241 25.8157 27.0218 25.809C26.5783 24.5205 26.2171 23.0395 26.085 21.6592C28.2811 19.4569 29.6113 16.5764 29.6113 13.4241C29.6113 6.50312 23.1993 0.892578 15.2896 0.892578C7.37997 0.892578 0.96793 6.50312 0.96793 13.4241C0.96793 20.345 7.37997 25.9556 15.2896 25.9556C16.7518 25.9556 18.1628 25.7638 19.4915 25.4075C20.4215 25.8788 22.4248 26.7366 25.6999 27.3858Z" fill="white"/>
                        <path d="M10.9629 12.5371C11.3171 12.5371 11.5905 12.6387 11.7832 12.8418C11.9759 13.0397 12.0723 13.2897 12.0723 13.5918C12.0723 13.8887 11.9759 14.1361 11.7832 14.334C11.5905 14.5267 11.3171 14.623 10.9629 14.623C10.6243 14.623 10.3561 14.5267 10.1582 14.334C9.96029 14.1413 9.86133 13.8939 9.86133 13.5918C9.86133 13.2897 9.95768 13.0397 10.1504 12.8418C10.3431 12.6387 10.6139 12.5371 10.9629 12.5371Z" fill="white"/>
                        <path d="M15.2316 12.5371C15.5858 12.5371 15.8592 12.6387 16.052 12.8418C16.2447 13.0397 16.341 13.2897 16.341 13.5918C16.341 13.8887 16.2447 14.1361 16.052 14.334C15.8592 14.5267 15.5858 14.623 15.2316 14.623C14.8931 14.623 14.6249 14.5267 14.427 14.334C14.229 14.1413 14.1301 13.8939 14.1301 13.5918C14.1301 13.2897 14.2264 13.0397 14.4191 12.8418C14.6118 12.6387 14.8827 12.5371 15.2316 12.5371Z" fill="white"/>
                        <path d="M19.5004 12.5371C19.8546 12.5371 20.128 12.6387 20.3207 12.8418C20.5134 13.0397 20.6098 13.2897 20.6098 13.5918C20.6098 13.8887 20.5134 14.1361 20.3207 14.334C20.128 14.5267 19.8546 14.623 19.5004 14.623C19.1618 14.623 18.8936 14.5267 18.6957 14.334C18.4978 14.1413 18.3988 13.8939 18.3988 13.5918C18.3988 13.2897 18.4952 13.0397 18.6879 12.8418C18.8806 12.6387 19.1514 12.5371 19.5004 12.5371Z" fill="white"/>
                    </svg>
                </div>
                <div class="content">
                    <div class="header">Начните писать комментарии</div>
                    <div class="message">
                        <p>Вы можете оставлять сообщения для других участников по каждому разделу паспорта.</p>
                        <p><a href="#" @click="disableCommentsInformer">Больше не показывать</a></p>
                    </div>
                </div>
            </b-toast>
            <b-toast
                v-bind:scrWidth="scrWidth"
                v-if="informerNewComments && scrWidth > 576"
                id="informer-new-comments"
                solid
                :no-auto-hide="true"
                toaster="b-toaster-bottom-left"
                toast-class="passport-help"
                title="test">
                <div class="icon red">
                    <svg width="30" height="28" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M24.8173 20.3951C24.4407 20.7728 24.2521 21.2988 24.3029 21.8298C24.4169 23.0198 24.6793 24.2582 25.0163 25.4086C22.5191 24.8315 20.994 24.162 20.3008 23.8107C19.9073 23.6112 19.454 23.5642 19.0279 23.6784C17.8502 23.9942 16.5951 24.1653 15.2896 24.1653C8.13666 24.1653 2.75814 19.1392 2.75814 13.4241C2.75814 7.70889 8.13666 2.68279 15.2896 2.68279C22.4426 2.68279 27.8211 7.70889 27.8211 13.4241C27.8211 16.0523 26.716 18.4911 24.8173 20.3951ZM25.6999 27.3858C25.712 27.3882 25.724 27.3906 25.7361 27.393C25.9005 27.4254 26.0681 27.4573 26.2389 27.4885C26.4785 27.5324 26.7244 27.5751 26.9766 27.6164C27.3329 27.6747 27.6056 27.302 27.4649 26.9696C27.373 26.7524 27.2823 26.5247 27.194 26.2887C27.1379 26.1387 27.0827 25.9854 27.0288 25.8292C27.0265 25.8224 27.0241 25.8157 27.0218 25.809C26.5783 24.5205 26.2171 23.0395 26.085 21.6592C28.2811 19.4569 29.6113 16.5764 29.6113 13.4241C29.6113 6.50312 23.1993 0.892578 15.2896 0.892578C7.37997 0.892578 0.96793 6.50312 0.96793 13.4241C0.96793 20.345 7.37997 25.9556 15.2896 25.9556C16.7518 25.9556 18.1628 25.7638 19.4915 25.4075C20.4215 25.8788 22.4248 26.7366 25.6999 27.3858Z" fill="white"/>
                        <path d="M10.9629 12.5371C11.3171 12.5371 11.5905 12.6387 11.7832 12.8418C11.9759 13.0397 12.0723 13.2897 12.0723 13.5918C12.0723 13.8887 11.9759 14.1361 11.7832 14.334C11.5905 14.5267 11.3171 14.623 10.9629 14.623C10.6243 14.623 10.3561 14.5267 10.1582 14.334C9.96029 14.1413 9.86133 13.8939 9.86133 13.5918C9.86133 13.2897 9.95768 13.0397 10.1504 12.8418C10.3431 12.6387 10.6139 12.5371 10.9629 12.5371Z" fill="white"/>
                        <path d="M15.2316 12.5371C15.5858 12.5371 15.8592 12.6387 16.052 12.8418C16.2447 13.0397 16.341 13.2897 16.341 13.5918C16.341 13.8887 16.2447 14.1361 16.052 14.334C15.8592 14.5267 15.5858 14.623 15.2316 14.623C14.8931 14.623 14.6249 14.5267 14.427 14.334C14.229 14.1413 14.1301 13.8939 14.1301 13.5918C14.1301 13.2897 14.2264 13.0397 14.4191 12.8418C14.6118 12.6387 14.8827 12.5371 15.2316 12.5371Z" fill="white"/>
                        <path d="M19.5004 12.5371C19.8546 12.5371 20.128 12.6387 20.3207 12.8418C20.5134 13.0397 20.6098 13.2897 20.6098 13.5918C20.6098 13.8887 20.5134 14.1361 20.3207 14.334C20.128 14.5267 19.8546 14.623 19.5004 14.623C19.1618 14.623 18.8936 14.5267 18.6957 14.334C18.4978 14.1413 18.3988 13.8939 18.3988 13.5918C18.3988 13.2897 18.4952 13.0397 18.6879 12.8418C18.8806 12.6387 19.1514 12.5371 19.5004 12.5371Z" fill="white"/>
                    </svg>
                </div>
                <div class="content">
                    <div class="header">У вас новые комментарии</div>
                    <div class="message">
                        <p>Посмотрите в разделах паспорта.</p>
                    </div>
                </div>
            </b-toast>
        </template>

        <div v-if="errorProject">
            <h2 class="mb-4">У вас нет доступа к паспорту этого проекта</h2>
        </div>
        
    </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import Person from '@/components/Person';
import Comment from '@/components/comment';
import FieldChanges from '@/components/passport/field-changes';
import Message from '@/components/Message';
import Actions from '@/components/passport/Actions';
import FileDownload from '@/components/FileDownload';

import format from 'date-fns/format';
import { dateToWord, declOfNum, model } from '@/utils';

export default {
    name: 'Passport',
    components: {
        Person,
        Comment,
        FieldChanges,
        Message,
        Actions,
        FileDownload
    },
    data () {
        return {
            showStatus: false,
            showDescrFull: true,
            scrWidth: 0,
            resourcesFields: [
                { key: 'resource', label: '' },
                { key: 'quantity', label: '', class: 'text-right' }
            ],
            course: {
                LMAG: ['COUI', 'COII'], // "Магистратура"
                LSPE: ['COUI', 'COII', 'CIII', 'COIV', 'COUV'], // "Специалитет"
                LBAK: ['COUI', 'COII', 'CIII', 'COIV'] // "Бакалавриат"
            },
            likePartner: false,
            errorProject: false,
            validate: null,
            validateProgram: null,
            validateSumErrors: null,
        }
    },
    created () {
        this.updateProject();
        window.addEventListener('resize', this.updScrWidth);
        this.updScrWidth();
    },
    beforeRouteUpdate (to, from, next) {
        next();
        this.updateProject();
    },
    methods: {
        updScrWidth(){
            this.scrWidth = window.innerWidth;
        },
        model,
        formatDate: date => format(date, 'DD.MM.YYYY'),
        formatDateTime: date => format(date, 'DD.MM.YYYY HH:mm'),
        dateToWord: date => dateToWord(date),
        getUserByRole: (roles, roleName) => {
            const roleArr = Array.isArray(roleName) ? roleName : [roleName];
            return roles.find(role => roleArr.indexOf(role.role) > -1);
        },
        isShowProgram (program) {
            return (program.roles.length && (this.currentProgramId === 0 || program.id === this.currentProgramId));
        },
        updateProject () {
            this.$store.dispatch('project/FETCH_project', { id: this.$route.params.id, comments: true, }).then(data => {                
                if (data.status === 200) {
                    if (this.project.informers) {
                        this.project.informers.forEach((inf, i) => {
                            setTimeout(() => {
                                this.$bvToast.show('informer-' + inf);
                            }, 1000 * (i + 1));
                        });
                    }
                    this.$store.dispatch('project/FETCH_messages', { id: this.$route.params.id });
                } else {
                    this.errorProject = true;
                }
            });
        },
        setErrors ({ validateSumErrors, validate, validateProgram }) {
            this.validateSumErrors = validateSumErrors;
            this.validate = validate;
            this.validateProgram = validateProgram;
            if (validateSumErrors) {
                const scrollElem = (location.hostname === 'localhost') ? window : document.querySelector('.shell-main');
                scrollElem.scrollTo(0, 0);
            }
        },
        disableCommentsInformer () {
            this.$axios.post(this.learning_src + 'passport/' + this.$route.params.id + '/disable_informer/', {
                informer: 'IMCM',
            }).then(() => {
                this.$bvToast.hide('informer-make-comments');
            })
        },
        showHistory () {
            this.$router.push({
                path: `/passport/${this.project.id}/history`,
            });
        },
        // TODO исключить дублирование. взято из passport-edit. Не понятно, куда поместить этот метод, чтобы не дублировалось. Почему не используется 'edit' из program.available_actions?
        canEditProgram (program) {
            const isMyProgram = program.roles.find(role => role.user.id === this.user.id) ? program : false;
            return (
                (this.meIsPartner && this.project.request_status === 'PSPT') ||
                (this.meIsMROP && (
                    (this.project.request_status === 'PSUN') ||
                    (this.project.request_status === 'PSST' && ['PPS3', 'PPS4'].indexOf(program.status) > -1)
                )) ||
                (this.meIsMCUR && (
                    (this.project.request_status === 'PSST' && program.is_main && program.status !== 'PPS4') ||
                    (this.project.request_status === 'PSST' && !program.is_main && program.status === 'PPS3') ||
                    (this.project.request_status === 'PSUN' && program.status !== 'PPS4')
                )) ||
                (this.meIsRROP && !this.meIsMROP && isMyProgram && ['PPS1', 'PPS2'].indexOf(isMyProgram.status) > -1) ||
                (this.meIsRCUR && isMyProgram && isMyProgram.status === 'PPS1')
            );
        },
    },
    computed: {
        canSeePartner () {
            return this.meIsPartnerIsURFU || !(this.meIsPartner || this.likePartner)
        },
        canSeePartnerPSST () {
            return !(((this.meIsPartner && !this.meIsRROP) || this.likePartner) && this.project.request_status === 'PSST')
        },
        ...mapState({
            user: state => state.user,
            project: state => state.project.project,
            // comments: state => state.project.comments,
            messages: state => state.project.messages,
            learning_src: state => state.api.learning_src
        }),
        ...mapGetters('api', [
            'getSemester'
        ]),
        ...mapGetters('project', [
            'meIsMROP',
            'meIsRROP',
            'meIsMCUR',
            'meIsRCUR',
            'iHaveUniRole',
            'meIsPartner',
            'meIsPartnerIsURFU',
            'myProgram',
            'ropListActive',
            'MCUR',
            'MROP',
            'isMulti',
            'approveMessages',
            'canComment',
            'canEditCommon',
        ]),
        currentProgramId: {
            get () {
                return (this.$store.state.project && this.$store.state.project.currentProgram) ? this.$store.state.project.currentProgram.id : 0
            },
            set (newVal) {
                this.$store.commit('project/SET_currentProgram', newVal)
            }
        },
        studentsSum () {
            let sum = this.project.programs.reduce((res, program) => {
                return res + (program.roles.length ? (program.students * this.project.max_copies) : 0)
            }, 0);
            return 'Всего ' + sum + ' ' + declOfNum(sum, ['человек', 'человека', 'человек']);
        },
        activePrograms () {
            return this.project.programs.filter(prog => prog.rop_participation_status);
        },
        informerNewComments () {
            return this.project.informers.indexOf('new-comments') > -1;
        },
    },
}
</script>

<style>
.project-status__wrap.project-status__progress,
.project-status__wrap.project-status__export {
    padding-left: 17.5px;
}
.text-subtitle.export-status {
    line-height: 20px;
    letter-spacing: -0.2px;
    color: #72808E;
}
.programs {
    padding-top: 16px;
}
.programs .program-name {
    font-size: 13px;
    line-height: 16px;
}
.programs .program-name span {
    font-size: 13px;
    color: #999;
}
.programs .program-status {
    opacity: 0.75;
    font-size: 16px;
    line-height: 20px;
}
.programs .program-status.published {
    color: #090;
}
.programs .program-status.unpublished {
    color: #666;
}
.b-toaster.b-toaster-bottom-left {
    bottom: 8px;
    left: 90px;
}
body.pin-bottom-on .b-toaster.b-toaster-bottom-left {
    bottom: 88px;
}
.b-toast .toast.passport-help {
    background: #fff;
    border: none;
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.12);
    border-radius: 6px;
    color: #111111;
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
    padding: 20px 16px;
}
.b-toast .toast.passport-help .toast-body {
    display: flex;
}
.b-toast .toast.passport-help .toast-body > .icon {
    flex: 0 0 64px;
    background: #ccc;
    border-radius: 6px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.b-toast .toast.passport-help .toast-body > .icon.red {
    background: #F5222D;
}
.b-toast .toast.passport-help .toast-body > .icon.blue {
    background: #467BE3;
}
.b-toast .toast.passport-help .toast-body > .content {
    flex: 1 1 auto;
    display: block;
    padding-left: 16px;
}
.b-toast .toast.passport-help .toast-body > .content > .header {
    font-size: 16px;
    font-weight: 500;
    padding-bottom: 8px;
}
.b-toast .toast.passport-help .toast-header .close {
    right: 16px;
    top: 20px;
    border: none;
    outline: none !important;
}
.b-toast .toast.passport-help .toast-header .close:hover {
    background: rgba(0, 0, 0, .1);
}
.b-toast .toast.passport-help .toast-body > .content > .message {
    display: block;
    font-weight: normal;
}
.b-toast .toast.passport-help .toast-body > .content > .message a {
    color: #9DA7B0;
    text-decoration: underline;
}
.b-toast .toast.passport-help .toast-body > .content > .message a:hover {
    color: #467be3;
}
.programs .program-status.unpublished .error {
    color: #F5222D;
}
.passport-page .right-sidebar .btn.show-changes {
    outline: none;
    background: rgba(49, 163, 67, 0.15);
    color: #558D61;
    display: block;
    border: none;
    width: 100%;
    font-size: 14px;
    padding: 9px 0;
    line-height: 18px;
}
.passport-page .right-sidebar .btn.show-changes:hover {
    background: rgba(49, 163, 67, 0.3);
}
.passport-page .right-sidebar .btn.show-changes:active,
.passport-page .right-sidebar .btn.show-changes:focus {
    outline: none;
    box-shadow: none;
}
</style>
