<template>
    <b-container>
        <b-button variant="primary" class="btn_flat mb-3" to="/projects">
            <i class="fas fa-arrow-left" />
            <span>Все проекты</span>
        </b-button>

        <template v-if="project && (myProgram || meIsPartner || user.isZP || user.isPlAdmin)">
            <h1>{{ project.name }}</h1>
            <div class="h1__description">Паспорт №{{ project.uid }} от {{ formatDate(project.passport_date) }} <br>на основании заявки №{{ project.uid }} от {{ formatDate(project.date) }}</div>

            <b-row class="mt-4">
                <b-col cols="9">

                    <b-alert show variant="danger" v-if="project.read_only">
                        <span v-if="blockStatus && blockStatus.user">{{ blockStatus.user.last_name }} {{ blockStatus.user.first_name }} (<a :href="'mailto:' + blockStatus.user.email">{{ blockStatus.user.email }}</a>)</span>
                        <span v-else>Другой пользователь</span>
                        заблокировал правку паспорта...</b-alert>

                    <div v-if="!project.read_only">
                        <b-card class="card_content mt-0">
                            <b-badge class="fl-right ml-2" variant="primary" v-if="project.kernel && !user.isPartner">Ядерный проект</b-badge>
                            <b-badge :variant="project.request_status" class="fl-right">{{ model(project.request_status) }}</b-badge>
                            <h2>Описание проекта</h2>
                            <h4 class="mb-4">Заполните основную информацию о проекте.</h4>

                            <b-form-group label="Полное название проекта" class="mt-4 form_required-group">
                                <div class="form-actions">
                                    <i :class="{ 'form-help_show': edit.name }" class="form-help" v-b-tooltip.hover title="Полное название проекта" />
                                    <FieldChanges field="name" title="Полное название проекта" class="passport-edit" />
                                    <Comment field="name" :project="project.id" />
                                </div>
                                <b-form-input
                                    :disabled="!canEditCommon"
                                    v-model="edit.name"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="Полное название проекта"
                                />
                            </b-form-group>

                            <div class="project__visible mt-4 mb-4" v-if="canSeePartner">
                                <template v-for="program of edit.programs">
                                    <div v-if="isShowProgram(program)" :key="program.id">
                                        <div class="mb-4">
                                            <h4 class="mt-4 mb-1">
                                                Краткое название проекта <span class="form_required-el" />
                                                <b-icon icon="eye-slash" class="ml-2" variant="secondary" v-b-tooltip title="Не видно заказчику" />
                                            </h4>
                                            <div class="text-caption mb-1">{{ program.program.name }}</div>
                                            <b-form-group>
                                                <div class="form-actions">
                                                    <i :class="{ 'form-help_show': program.project_short_name }" class="form-help" v-b-tooltip.hover title="Краткое название проекта" />
                                                    <FieldChanges :field="program.id + '_project_short_name'" title="Краткое название проекта" class="passport-edit" />
                                                     <Comment :field="program.id + '_project_short_name'" :project="project.id" hidden />
                                                </div>
                                                <b-form-input
                                                    :disabled="!canEditProgram(program)"
                                                    v-model="program.project_short_name"
                                                    type="text"
                                                    autocomplete="off"
                                                    placeholder="Краткое название проекта"
                                                />
                                            </b-form-group>
                                        </div>
                                        <div class="mb-2 pb-2">
                                            <h4 class="mt-4 mb-1">
                                                Название для диплома студента <span class="form_required-el" />
                                                <b-icon icon="eye-slash" class="ml-2" variant="secondary" v-b-tooltip title="Не видно заказчику" />
                                            </h4>
                                            <div class="text-caption mb-1">{{ program.program.name }}</div>
                                            <b-form-group>
                                                <div class="form-actions">
                                                    <i :class="{ 'form-help_show': program.student_diploma_name }" class="form-help" v-b-tooltip.hover title="Название для диплома студента" />
                                                    <FieldChanges :field="program.id + '_student_diploma_name'" title="Название для диплома студента" class="passport-edit" />
                                                    <Comment :field="program.id + '_student_diploma_name'" :project="project.id" hidden />
                                                </div>
                                                <b-form-input
                                                    :disabled="!canEditProgram(program)"
                                                    v-model="program.student_diploma_name"
                                                    type="text"
                                                    autocomplete="off"
                                                    placeholder="Название для диплома студента"
                                                />
                                            </b-form-group>
                                        </div>
                                    </div>
                                </template>
                            </div>

                            <h4 class="mt-4">Цель <span class="form_required-el" /></h4>
                            <b-form-group>
                                <div class="form-actions">
                                    <i :class="{ 'form-help_show': edit.goal }" class="form-help" v-b-tooltip.hover.html title="Опишите, что должно быть достигнуто в&nbsp;результате выполнения проекта. Ставьте измеримые и&nbsp;выполнимые цели. Ответьте на&nbsp;вопрос, для чего создается результат проекта.<br /><br />Например, цель разработки веб-сайта: посетители сайта будут уверены, что существует угроза глобального потепления." />
                                    <FieldChanges field="goal" title="Цель" class="passport-edit" />
                                    <Comment field="goal" :project="project.id" />
                                </div>
                                <Editor
                                    v-model="edit.goal"
                                    :disabled="!canEditCommon"
                                    placeholder="Опишите, что должно быть достигнуто в результате выполнения проекта. Ставьте измеримые и выполнимые цели. Ответьте на вопрос, для чего создается результат проекта. Например, цель разработки веб-сайта: посетители сайта будут уверены, что существует угроза глобального потепления."
                                />
                                <!-- <b-form-textarea
                                    :disabled="!canEditCommon"
                                    v-model="edit.goal"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="Опишите, что должно быть достигнуто в результате выполнения проекта. Ставьте измеримые и выполнимые цели. Ответьте на вопрос, для чего создается результат проекта. Например, цель разработки веб-сайта: посетители сайта будут уверены, что существует угроза глобального потепления."
                                    rows="4"
                                /> -->
                            </b-form-group>

                            <h4 class="mt-4">Результат (продукт) <span class="form_required-el" /></h4>
                            <b-form-group>
                                <div class="form-actions">
                                    <i :class="{ 'form-help_show': edit.result }" class="form-help" v-b-tooltip.hover title="Опишите, что должна создать команда проекта." />
                                    <FieldChanges field="result" title="Результат (продукт)" class="passport-edit" />
                                    <Comment field="result" :project="project.id" />
                                </div>
                                <Editor
                                    v-model="edit.result"
                                    :disabled="!canEditCommon"
                                    placeholder="Опишите, что должна создать команда проекта."
                                />
                                <!-- <b-form-textarea
                                    :disabled="!canEditCommon"
                                    v-model="edit.result"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="Опишите, что должна создать команда проекта."
                                    rows="4"
                                /> -->
                            </b-form-group>

                            <div class="project__visible mt-4 mb-4" v-if="isMulti">
                                <template v-for="program of edit.programs">
                                    <div v-if="isShowProgram(program)" :key="program.id" class="pb-2">
                                        <h4 class="mt-4 mb-1">Результат (продукт) <span class="form_required-el" /></h4>
                                        <div class="text-caption mb-1">{{ program.program.name }}</div>
                                        <b-form-group>
                                            <div class="form-actions">
                                                <i :class="{ 'form-help_show': program.result }" class="form-help" v-b-tooltip.hover title="Опишите, что должна создать команда проекта." />
                                                <FieldChanges :field="program.id + '_result'" title="Результат (продукт)" class="passport-edit" />
                                                <Comment :field="program.id + '_result'" :project="project.id" />
                                            </div>
                                            <Editor
                                                v-model="program.result"
                                                :disabled="!canEditProgram(program)"
                                                placeholder="Опишите, что должна создать команда проекта."
                                            />
                                            <!-- <b-form-textarea
                                                :disabled="!canEditProgram(program)"
                                                v-model="program.result"
                                                type="text"
                                                autocomplete="off"
                                                placeholder="Опишите, что должна создать команда проекта."
                                                rows="4"
                                            /> -->
                                        </b-form-group>
                                    </div>
                                </template>
                            </div>

                            <h4 class="mt-4">Критерии приемки результата / продукта <span class="form_required-el" /></h4>
                            <b-form-group>
                                <div class="form-actions">
                                    <i :class="{ 'form-help_show': edit.criteria }" class="form-help" v-b-tooltip.hover.html title="Указывайте измеримые критерии, которые должны быть достигнуты для того, чтобы проект мог считаться успешным." />
                                    <FieldChanges field="criteria" title="Критерии приемки результата / продукта" class="passport-edit" />
                                    <Comment field="criteria" :project="project.id" />
                                </div>
                                <Editor
                                    v-model="edit.criteria"
                                    :disabled="!canEditCommon"
                                    placeholder="Указывайте измеримые критерии, которые должны быть достигнуты для того, чтобы проект мог считаться успешным."
                                />
                                <!-- <b-form-textarea
                                    :disabled="!canEditCommon"
                                    v-model="edit.criteria"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="Указывайте измеримые критерии, которые должны быть достигнуты для того, чтобы проект мог считаться успешным."
                                    rows="4"
                                /> -->
                            </b-form-group>

                            <div class="project__visible mt-4 mb-4" v-if="isMulti">
                                <template v-for="program of edit.programs">
                                    <div v-if="isShowProgram(program)" :key="program.id" class="pb-2">
                                        <h4 class="mt-4 mb-1">Критерии приемки результата / продукта <span class="form_required-el" /></h4>
                                        <div class="text-caption mb-1">{{ program.program.name }}</div>
                                        <b-form-group>
                                            <div class="form-actions">
                                                <i :class="{ 'form-help_show': program.criteria }" class="form-help" v-b-tooltip.hover title="Указывайте измеримые критерии, которые должны быть достигнуты для того, чтобы проект мог считаться успешным." />
                                                <FieldChanges :field="program.id + '_criteria'" title="Критерии приемки результата / продукта" class="passport-edit" />
                                                <Comment :field="program.id + '_criteria'" :project="project.id" />
                                            </div>
                                            <Editor
                                                v-model="program.criteria"
                                                :disabled="!canEditProgram(program)"
                                                placeholder="Указывайте измеримые критерии, которые должны быть достигнуты для того, чтобы проект мог считаться успешным."
                                            />
                                            <!-- <b-form-textarea
                                                :disabled="!canEditProgram(program)"
                                                v-model="program.criteria"
                                                type="text"
                                                autocomplete="off"
                                                placeholder="Указывайте измеримые критерии, которые должны быть достигнуты для того, чтобы проект мог считаться успешным."
                                                rows="4"
                                            /> -->
                                        </b-form-group>
                                    </div>
                                </template>
                            </div>

                            <h4 class="mt-4">Описание проекта <span class="form_required-el" /></h4>
                            <b-form-group>
                                <div class="form-actions">
                                    <i :class="{ 'form-help_show': edit.description }" class="form-help" v-b-tooltip.hover.html title="Опишите особенности проекта, технологии и&nbsp;способы реализации. Рекомендуем указать компетенции, которые понадобятся участникам проекта." />
                                    <FieldChanges field="description" title="Описание проекта" class="passport-edit" />
                                    <Comment field="description" :project="project.id" />
                                </div>
                                <Editor
                                    v-model="edit.description"
                                    :disabled="!canEditCommon"
                                    placeholder="Опишите особенности проекта, технологии и способы реализации. Рекомендуем указать компетенции, которые понадобятся участникам проекта."
                                />
                                <!-- <b-form-textarea
                                    :disabled="!canEditCommon"
                                    v-model="edit.description"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="Опишите особенности проекта, технологии и способы реализации. Рекомендуем указать компетенции, которые понадобятся участникам проекта."
                                    rows="4"
                                /> -->
                            </b-form-group>

                            <div class="project__visible mt-4 mb-4" v-if="isMulti">
                                <template v-for="program of edit.programs">
                                    <div v-if="isShowProgram(program)" :key="program.id" class="pb-2">
                                        <h4 class="mt-4 mb-1">Описание проекта <span class="form_required-el" /></h4>
                                        <div class="text-caption mb-1">{{ program.program.name }}</div>
                                        <b-form-group>
                                            <div class="form-actions">
                                                <i :class="{ 'form-help_show': program.description }" class="form-help" v-b-tooltip.hover title="Опишите особенности проекта, технологии и способы реализации. Рекомендуем указать компетенции, которые понадобятся участникам проекта." />
                                                <FieldChanges :field="program.id + '_description'" title="Описание проекта" class="passport-edit" />
                                                <Comment :field="program.id + '_description'" :project="project.id" />
                                            </div>
                                            <Editor
                                                v-model="program.description"
                                                :disabled="!canEditProgram(program)"
                                                placeholder="Опишите особенности проекта, технологии и способы реализации. Рекомендуем указать компетенции, которые понадобятся участникам проекта."
                                            />
                                            <!-- <b-form-textarea
                                                :disabled="!canEditProgram(program)"
                                                v-model="program.description"
                                                type="text"
                                                autocomplete="off"
                                                placeholder="Опишите особенности проекта, технологии и способы реализации. Рекомендуем указать компетенции, которые понадобятся участникам проекта."
                                                rows="4"
                                            /> -->
                                        </b-form-group>
                                    </div>
                                </template>
                            </div>

                            <div>
                                <h4>Макс. количество экземпляров проекта <span class="form_required-el" /></h4>
                                <b-form-group>
                                    <div class="form-actions">
                                        <i :class="{ 'form-help_show': edit.max_copies }" class="form-help" v-b-tooltip.hover.html title="Укажите максимальное значение количества команд, независимо выполняющих проект, с&nbsp;которыми вы&nbsp;сможете взаимодействовать. <br></br> В&nbsp;случае согласия работать с&nbsp;несколькими командами вы&nbsp;сможете выбрать лучший результат. <br><br>Количество экземпляров будет уточняться, если нужное количество студентов не&nbsp;будет набрано." />
                                        <FieldChanges field="max_copies" title="Макс. количество экземпляров проекта" class="passport-edit" />
                                        <Comment field="max_copies" :project="project.id" />
                                    </div>
                                    <b-row>
                                        <b-col lg="6" md="8" sm="12">
                                            <MinOneInput
                                                :disabled="!canEditCommon"
                                                v-model.number="edit.max_copies"
                                                placeholder="Укажите максимальное значение количества команд"
                                                onlyInteger
                                            />
                                        </b-col>
                                    </b-row>
                                </b-form-group>
                            </div>
                        </b-card>

                        <b-card class="card_content" v-if="!meIsPartner">
                            <template v-if="!user.isPlAdmin">
                                <h2>Партнер</h2>

                                <h4 class="mt-4">Название организации</h4>
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
                            <h2 class="mb-4">Участники проекта от университета</h2>

                            <template v-for="program of project.programs">
                                <div class="project__block" v-if="program.roles.length && isShowProgram(program)" :key="program.id">
                                    <h4>
                                        <svg v-if="program.is_main" v-b-tooltip title="Главная программа проекта" class="mr-2 mb-1" width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.3" d="M10.5417 9H0.458333L0 1.00001L3.20833 2.99997L5.5 0L7.79167 3.00002L11 1.00001L10.5417 9Z" fill="black"/>
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


                        <b-card class="card_content">
                            <h2>Эксперты</h2>
                            <template v-for="program of edit.programs">
                                <div v-if="isShowProgram(program)" :key="program.id" class="mb-4">
                                    <div class="text-caption mb-1">{{ program.program.name }}</div>
                                    <b-form-group>
                                        <div class="form-actions">
                                            <i :class="{ 'form-help_show': program.experts }" class="form-help" v-b-tooltip.hover title="Укажите эксперта" />
                                            <Comment field="experts" :project="project.id" />
                                        </div>
                                        <b-form-textarea
                                            :disabled="!canEditProgram(program)"
                                            v-model="program.experts"
                                            type="text"
                                            autocomplete="off"
                                            placeholder="Укажите эксперта"
                                            rows="4"
                                        />
                                    </b-form-group>
                                </div>
                            </template>
                        </b-card>

                        <b-card class="card_content">
                            <header class="row">
                                <b-col>
                                    <h2 class="mb-0">Образовательная программа</h2>
                                </b-col>
                                <b-col class="text-right">
                                    <Comment field="semester_course" :project="project.id" />
                                </b-col>
                            </header>
                            
                            <template v-if="currentProgramId === 0">
                                <h4 class="mt-4">Семестр <span class="form_required-el" /></h4>
                                <b-form-group>
                                    <treeselect
                                        :disabled="!canEditCommon || (meIsPartner && !meIsPartnerIsURFU)"
                                        :clearable="false"
                                        placeholder="Выберите семестр"
                                        v-model="edit.semester"
                                        :options="notOutdatedSemester"
                                    >
                                        <div slot="value-label" slot-scope="{ node }">
                                            <span>{{ getSemester(node.raw.id).year }} {{ getSemester(node.raw.id).period }}</span>
                                        </div>
                                        <div slot="option-label" slot-scope="{ node }" class="treeselect-item_flex">
                                            <span>{{ node.raw.year }} {{ node.raw.period }}</span>
                                            <span v-if="node.raw.is_actual" class="treeselect-item__right text-subtitle">Текущий</span>
                                        </div>
                                    </treeselect>
                                </b-form-group>
                                <template v-for="program of edit.programs">
                                    <div v-if="isShowProgram(program)" :key="program.id" class="pb-0">
                                        <h4 class="mt-4 mb-2">Курс <span class="form_required-el" /></h4>
                                        <div class="text-caption mb-1">{{ program.program.name }}</div>
                                        <Course
                                            :disabled="!canEditProgram(program) || (meIsPartner && !meIsPartnerIsURFU)"
                                            v-model="program.course"
                                            :level="program.program.level"
                                        />
                                    </div>
                                </template>
                            </template>

                            <template v-else v-for="program of edit.programs">
                                <div v-if="isShowProgram(program)" :key="program.id" class="pb-2">
                                    <div class="text-caption mb-1">{{ program.program.name }}</div>
                                    <b-row>
                                        <b-col>
                                            <h4 class="mt-4">Семестр <span class="form_required-el" /></h4>
                                            <b-form-group>
                                                <treeselect
                                                    :disabled="!canEditCommon || (meIsPartner && !meIsPartnerIsURFU)"
                                                    :clearable="false"
                                                    placeholder="Выберите семестр"
                                                    v-model="edit.semester"
                                                    :options="notOutdatedSemester"
                                                >
                                                    <div slot="value-label" slot-scope="{ node }">
                                                        <span>{{ getSemester(node.raw.id).year }} {{ getSemester(node.raw.id).period }}</span>
                                                    </div>
                                                    <div slot="option-label" slot-scope="{ node }" class="treeselect-item_flex">
                                                        <div>{{ node.raw.year }} {{ node.raw.period }}</div>
                                                        <span v-if="node.raw.is_actual" class="treeselect-item__right text-subtitle">Текущий</span>
                                                    </div>
                                                </treeselect>
                                            </b-form-group>
                                        </b-col>
                                        <b-col>
                                            <h4 class="mt-4 mb-2">Курс <span class="form_required-el" /></h4>
                                            <Course
                                                :disabled="!canEditProgram(program) || (meIsPartner && !meIsPartnerIsURFU)"
                                                v-model="program.course"
                                                :level="program.program.level"
                                            />
                                        </b-col>
                                    </b-row>
                                </div>
                            </template>
                        </b-card>


                        <b-card class="card_content" v-if="edit.semester && getSemester(edit.semester)">
                            <b-row>
                                <b-col>
                                    <h2 class="mb-0">Сроки реализации</h2>
                                </b-col>
                                <b-col class="text-right">
                                    <h3 class="mb-0">{{ formatDate(getSemester(edit.semester).start_date) }} – {{ formatDate(getSemester(edit.semester).finish_date) }}</h3>
                                </b-col>
                            </b-row>
                        </b-card>



                        <b-card class="card_content" v-if="canSeePartner">
                            <header class="row">
                                <b-col>
                                    <h2 class="mb-0">Тип и сложность проекта <span class="form_required-el" /></h2>
                                </b-col>
                                <b-col class="text-right">
                                    <i class="form-eye ml-2" v-b-tooltip title="Не видно заказчику" />
                                    <Comment field="work_type_difficulty_type" :project="project.id" hidden />
                                </b-col>
                            </header>

                            <template v-for="program of edit.programs">
                                <div v-if="isShowProgram(program)" :key="program.id" class="mb-4">
                                    <div class="text-caption mb-1">{{ program.program.name }}</div>
                                    <b-row class="mt-4">
                                        <b-col>
                                            <h4>Тип проекта <span class="form_required-el" /></h4>
                                            <treeselect
                                                :disabled="!canEditProgram(program)"
                                                :clearable="false"
                                                placeholder="Укажите тип проекта"
                                                v-model="program.work_type"
                                                :options="[{
                                                        label: model('DSCV'),
                                                        id: 'DSCV'
                                                    }, {
                                                        label: model('APPL'),
                                                        id: 'APPL'
                                                }]"
                                            />
                                        </b-col>
                                        <b-col>
                                            <h4>Уровень сложности <span class="form_required-el" /></h4>
                                            <treeselect
                                                :disabled="!canEditProgram(program)"
                                                :clearable="false"
                                                placeholder="Укажите уровень сложности"
                                                v-model="program.difficulty_type"
                                                :options="[{
                                                        label: model('TYPA'),
                                                        type: 'Тип А.',
                                                        id: 'TYPA'
                                                    },{
                                                        label: model('TYPB'),
                                                        id: 'TYPB',
                                                        type: 'Тип B.'
                                                    }, {
                                                        label: model('TYPC'),
                                                        id: 'TYPC',
                                                        type: 'Тип C.'
                                                }]">
                                                <label slot="option-label" slot-scope="{ node }">
                                                    <div style="line-height: 1.2rem; padding: 0.5rem 0 0">
                                                        <b>{{ node.raw.type }}</b>
                                                        {{ node.raw.label }}
                                                    </div>
                                                </label>
                                            </treeselect>
                                        </b-col>
                                    </b-row>
                                </div>
                            </template>
                            <b-alert show variant="primary" class="alert_icon mt-4">
                                <b-icon-info-circle-fill />
                                Выбирайте уровень сложности в&nbsp;соответствии с&nbsp;рабочими планами.<br>Если в&nbsp;проекте несколько курсов, их&nbsp;уровень сложности в&nbsp;рабочих планах должен быть одинаковым.
                            </b-alert>
                        </b-card>


                        <b-card class="card_content">
                            <header class="row">
                                <b-col>
                                    <h2 class="mb-0">Количество команд и студентов <span class="form_required-el" /></h2>
                                </b-col>
                                <b-col class="text-right">
                                    <Comment field="max_copies_students" :project="project.id" />
                                </b-col>
                            </header>

                            <template v-for="(program, index) of edit.programs">
                                <div v-if="isShowProgram(program)" :key="program.id" class="pb-2">
                                    <div class="text-caption mb-1">{{ program.program.name }}</div>
                                    <b-row>
                                        <b-col>
                                            <h4 class="mt-4">Количество команд <span class="form_required-el" /></h4>
                                            <b-form-group>
                                                <MinOneInput
                                                    :disabled="true"
                                                    v-model.number="program.max_copies"
                                                    placeholder="Укажите количество команд"
                                                    onlyInteger
                                                />
                                            </b-form-group>
                                        </b-col>
                                        <b-col>
                                            <h4 class="mt-4">
                                                Количество студентов в команде <span class="form_required-el" />
                                                <FieldChanges :field="program.id + '_students'" title="Кол-во студентов в команде" class="fl-right" />
                                            </h4>
                                            <b-form-group>
                                                <MinOneInput
                                                    :disabled="!canEditProgram(program)"
                                                    v-model.number="program.students"
                                                    placeholder="Выберите количество студентов"
                                                    onlyInteger
                                                    :class="{ 'form-control_error': isProgramInvalid(index) }"
                                                />
                                                <div class="form-error" v-if="isProgramInvalid(index)">Не более {{ studentsMaxCount }} человек</div>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                </div>
                            </template>
                        </b-card>


                        <b-card class="card_content">

                            <header class="row">
                                <b-col>
                                    <h2 class="mb-0">Требования к ролям <span class="form_required-el" /></h2>
                                </b-col>
                                <b-col class="text-right">
                                    <i class="form-help form-help_show" v-b-tooltip.hover.html title="Опишите роль студента с&nbsp;точки зрения функциональности в&nbsp;проекте, например программист, аналитик, дизайнер и&nbsp;краткое описание выполняемого этой ролью функционала в&nbsp;проекте" />
                                    <Comment field="compet_roles" :project="project.id" />
                                </b-col>
                            </header>

                            <template v-for="(program, programIndex) of edit.programs">
                                <div v-if="isShowProgram(program)" :key="program.id" class="mb-4">
                                    <div class="text-caption mb-1">{{ program.program.name }}</div>

                                    <div class="project__remove" v-for="(role, index) of program.compet_roles" :key="index">
                                        <b-button :disabled="!canEditProgram(program)" class="btn_flat btn-close btn-close_top" variant="danger" @click="program.compet_roles.splice(index, 1)" />
                                        <b-row class="mt-4">
                                            <b-col>
                                                <h4>Роль</h4>
                                                <b-form-group>
                                                    <b-form-input
                                                        :disabled="!canEditProgram(program)"
                                                        v-model="role.role.name"
                                                        type="text"
                                                        autocomplete="off"
                                                        placeholder="Укажите название роли"
                                                    />
                                                </b-form-group>
                                            </b-col>
                                            <b-col>
                                                <h4>Количество</h4>
                                                <b-form-group>
                                                    <MinOneInput
                                                        :disabled="!canEditProgram(program)"
                                                        v-model.number="role.quantity"
                                                        placeholder="Укажите количество"
                                                        onlyInteger
                                                        :class="{ 'form-control_error': isRolesInvalid(programIndex) }"
                                                    />
                                                    <div class="form-error" v-if="isRolesInvalid(programIndex)">Не более {{ studentsMaxCount }} в сумме по всем ролям </div>
                                                </b-form-group>
                                            </b-col>
                                            <b-col cols="12" class="mt-4">
                                                <h4>Описание роли</h4>
                                                <b-form-group>
                                                    <Editor
                                                        v-model="role.description"
                                                        :disabled="!canEditProgram(program)"
                                                        placeholder="Укажите описание"
                                                    />
                                                </b-form-group>
                                            </b-col>
                                        </b-row>
                                    </div>

                                    <b-button class="mt-4" :disabled="!canEditProgram(program)" @click="program.compet_roles.push({ role: { name: '' }, description: '', quantity: '' })">
                                        <i class="fas fa-plus mr-2" style="color: rgba(70, 123, 227, 0.5)" />
                                        Добавить роль
                                    </b-button>
                                </div>
                            </template>
                        </b-card>


                        <b-card class="card_content" v-if="canSeePartner">
                            <header class="row">
                                <b-col>
                                    <h2 class="mb-0">Список формируемых компетенций <span class="form_required-el" /></h2>
                                </b-col>
                                <b-col class="text-right">
                                    <i class="form-eye ml-2" v-b-tooltip title="Не видно заказчику" />
                                    <Comment field="professional_competence" :project="project.id" hidden />
                                </b-col>
                            </header>

                            <template v-for="program of edit.programs">
                                <div v-if="isShowProgram(program)" :key="program.id" class="mb-4">
                                    <div class="text-caption mb-1">
                                        {{ program.program.name }}
                                        <FieldChanges :field="program.id + '_professional_competence_group_text'" title="Список формируемых компетенций" class="fl-right" />
                                    </div>
                                    <Editor
                                        v-model="program.professional_competence_group_text"
                                        :disabled="!canEditProgram(program)"
                                        placeholder="Введите описание компетенций"
                                    />
                                </div>
                            </template>
                        </b-card>


                        <b-card class="card_content">
                            <header class="row">
                                <b-col>
                                    <h2 class="mb-0">Выделенные заказчиком ресурсы</h2>
                                </b-col>
                                <b-col class="text-right">
                                    <Comment field="resources" :project="project.id" />
                                </b-col>
                            </header>

                            <template v-for="program of edit.programs">
                                <div v-if="isShowProgram(program)" :key="program.id" class="mb-4">
                                    <div class="text-caption mb-1">{{ program.program.name }}</div>

                                    <div class="project__remove" v-if="program.resources.length">
                                        <b-row class="mt-4 mb-2">
                                            <b-col>
                                                <h4>Ресурс</h4>
                                            </b-col>
                                            <b-col>
                                                <h4>Количество</h4>
                                            </b-col>
                                        </b-row>
                                    </div>
                                    <div class="project__remove mb-2" v-for="(resource, index) of program.resources" :key="index">
                                        <b-button :disabled="!canEditProgram(program)" class="btn_flat btn-close" variant="danger" @click="program.resources.splice(index, 1)" />
                                        <b-row>
                                            <b-col>
                                                <b-form-group>
                                                    <b-form-input
                                                        :disabled="!canEditProgram(program)"
                                                        v-model="resource.resource.name"
                                                        type="text"
                                                        autocomplete="off"
                                                        placeholder="Название"
                                                    />
                                                </b-form-group>
                                            </b-col>
                                            <b-col>
                                                <b-form-group>
                                                    <MinOneInput
                                                        :disabled="!canEditProgram(program)"
                                                        v-model.number="resource.quantity"
                                                        placeholder="Заполните количество"
                                                    />
                                                </b-form-group>                        
                                            </b-col>
                                        </b-row>
                                    </div>

                                    <b-button class="mt-4" :disabled="!canEditProgram(program)" @click="program.resources.push({ resource: { name: '' }, description: '' })">
                                        <i class="fas fa-plus mr-2" style="color: rgba(70, 123, 227, 0.5)" />
                                        Добавить ресурс
                                    </b-button>
                                </div>
                            </template>
                        </b-card>


                        <b-card class="card_content">
                            <h2>Приложения</h2>
                            <h4>Вы&nbsp;можете приложить файлы с&nbsp;дополнительной информацией о&nbsp;проекте.<br> Например, техническое задание или презентацию.</h4>

                            <FileUpload
                                :address="learning_src + 'passport/' + $route.params.id + '/file_upload'"
                                @uploaded="file => { edit.proj_files.push(file); project.proj_files.push(file) }"
                            />
                            <div v-if="edit.proj_files && edit.proj_files.length" class="mt-4">
                                <FileDownload
                                    v-for="(file, index) of edit.proj_files"
                                    :file="file"
                                    :key="index"
                                    download
                                    remove
                                    :address="learning_src + 'passport/' + $route.params.id + '/file_delete'"
                                    @remove="edit.proj_files.splice(index, 1); project.proj_files.splice(index, 1)"
                                />
                            </div>
                        </b-card>
                    </div>

                    <!-- Footer -->

                    <div v-pin-bottom class="pin-bottom_btns">
                        <b-container class="pin-bottom__container">
                            <b-row>
                                <b-col cols="9">
                                    <b-card class="card_content">
                                        <b-button variant="primary" @click="saveEdit" v-if="!project.read_only">Сохранить изменения</b-button>
                                        <b-button @click="backToPassport" v-if="!project.read_only">Выйти без сохранения</b-button>
                                        <b-button @click="backToPassport" v-if="project.read_only">Вернуться к паспорту</b-button>
                                    </b-card>
                                </b-col>
                            </b-row>
                        </b-container>
                    </div>

                </b-col>
                <b-col>
                    <div v-pin-aside>
                        <div v-if="!project.read_only">
                            <div v-if="project.request_status === 'PSST'" class="mb-4">
                                <b-alert show variant="primary" class="alert_icon">
                                    <b-icon-info-circle-fill />
                                    Заполните и&nbsp;отправьте паспорт на&nbsp;согласование заказчику <b class="nobr">до&nbsp;{{ formatDate(project.passport_deadline) }}</b>
                                </b-alert>
                            </div>

                            <b-card class="program-choice__wrap mb-4">
                                <h4 class="mb-3">{{ isMulti ? 'Образовательные программы' : 'Образовательная программа' }}</h4>
                                <template v-for="program in project.programs">
                                    <button :key="program.id" v-if="program.roles.length" class="program-choice mb-2" :class="{ 'program-choice_active': program.id === currentProgramId }" @click="currentProgramId = program.id">
                                        <svg v-if="program.is_main" v-b-tooltip title="Главная программа проекта" class="mr-2 mb-1" width="11" height="9" viewBox="0 0 11 9" fill="none">
                                            <path opacity="0.3" d="M10.5417 9H0.458333L0 1.00001L3.20833 2.99997L5.5 0L7.79167 3.00002L11 1.00001L10.5417 9Z" fill="black"/>
                                        </svg>
                                        <span class="text-caption mr-2">{{ program.program.uid }}</span>

                                        <svg v-if="project.request_status !== 'PSPT'" class="program-choice__icon" width="13" height="13" viewBox="0 0 13 13" fill="none" v-b-tooltip.hover :title="model(program.status)">
                                            <circle cx="6.5" cy="6.5" r="6.5" :fill="program.status === 'PPS4' ? '#44A52C' : '#FBA40F'" />
                                            <path :d="program.status === 'PPS4' ? 'M4 7L6 8.5L9 4.5' : 'M6 3V7H9'" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>

                                        <div>{{ program.program.name }}</div>
                                    </button>
                                </template>
                                <b-button v-if="isMulti" :variant="currentProgramId === 0 ? 'primary' : 'secondary'" class="program-choice__all mt-2" @click="currentProgramId = 0">
                                    Все программы
                                </b-button>
                            </b-card>
                        </div>

                        <div class="project-status__wrap">
                            <div class="text-subtitle">Прогресс паспорта</div>
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
                    </div>
                </b-col>
            </b-row>
        </template>

    </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import format from 'date-fns/format';
import model from '@/utils/models';

import { validationMixin } from 'vuelidate';
import { maxValue } from 'vuelidate/lib/validators';

import Person from '@/components/Person';
import Comment from '@/components/comment';
import Course from '@/components/passport/Course.vue';
import FieldChanges from '@/components/passport/field-changes';

import FileUpload from '@/components/FileUpload';
import FileDownload from '@/components/FileDownload';
import Editor from '@/components/Editor';
import MinOneInput from '@/components/MinOneInput';

const studentsMaxCount = 7

export default {
    name: 'PassportEdit',
    components: {
        Person,
        Comment,
        Course,
        FileUpload,
        FileDownload,
        Editor,
        MinOneInput,
        FieldChanges,
    },
    mixins: [ validationMixin ],
    data () {
        return {
            edit: {},
            blockStatus: null,
            blockTimer: null,

            formEdited: false,
            formSaved: false,
            studentsMaxCount: studentsMaxCount,
            selectedProgramBeforeEdit: null,
        }
    },
    validations() {
        const rolesLessThanOrEqualsToStudents = (program) => {
            const studentsCountByRoles = program.compet_roles.map(role => role.quantity).reduce((a, b) => a + b, 0);
            return studentsCountByRoles <= this.studentsMaxCount;
        }
        return {
            edit: {
                programs: {
                    $each: {
                        students: {
                            maxValue: maxValue(studentsMaxCount)
                        },
                        rolesCount: rolesLessThanOrEqualsToStudents
                    }
                }
            }
        }
    },
    created () {
        this.removeEventListener();
    },
    mounted () {
        this.loadProject();
        this.outerLinks();
    },
    beforeRouteUpdate (to, from, next) {
        next();
        this.loadProject();
        this.outerLinks();
    },
    beforeDestroy () {
        this.removeEventListener();
    },
    beforeRouteLeave (to, from, next) {
        this.leavePage(to, from, next);
    },
    methods: {
        model: name => model[name],
        formatDate: date => format(date, 'DD.MM.YYYY'),
        formatDateTime: date => format(date, 'DD.MM.YYYY HH:mm'),
        isNumber (evt) {
            evt = (evt) ? evt : window.event;
            const charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        clickToOuterLink (e) {
            e.preventDefault();
            e.target.removeEventListener('click', this.clickToOuterLink);
            const clickFn = function () {
                let href;
                e.path.some(node => {
                    if (node.nodeName === 'A' && node.href) {
                        href = node.href;
                        return true;
                    }
                });
                if (href && href.length) {
                    window.location = href;
                } else {
                    e.target.click();
                }
            }
            this.leavePage(null, null, clickFn);
        },
        removeEventListener () {
            const links = document.getElementsByTagName('a');
            const location = window.location.href.replace(window.location.hash, '');
            const outerLinks = [];
            links.forEach(link => {
                const href = link.href.split('#')[0];
                if (href !== location) outerLinks.push(link);
                if (link.href === location) outerLinks.push(link);
            })
            outerLinks.forEach(link => {
                link.removeEventListener('click', this.clickToOuterLink);
            })
        },
        outerLinks () {
            const links = document.getElementsByTagName('a');
            const location = window.location.href.replace(window.location.hash, '');
            const outerLinks = [];
            links.forEach(link => {
                const href = link.href.split('#')[0];
                if (href !== location) outerLinks.push(link);
                if (link.href === location) outerLinks.push(link);
            })
            outerLinks.forEach(link => {
                link.addEventListener('click', this.clickToOuterLink);
            });
        },
        backToPassport () {
            this.formSaved = true;
            if (!this.project.read_only) {
                this.cancelEditing(() => {
                    this.$router.push({ path: '/passport/' + this.project.id });
                })
            } else {
                this.$router.push({ path: '/passport/' + this.project.id });
            }
            this.selectProgramBeforeEdit();
        },
        leavePage (to, from, next) {
            if (this.formEdited && !this.formSaved) {
                this.$bvModal.msgBoxConfirm(' ', {
                    size: 'md',
                    buttonSize: 'md',
                    title: 'Сохранить изменения?',
                    okVariant: 'primary',
                    okTitle: 'Сохранить',
                    cancelTitle: 'Нет',
                    hideHeaderClose: false,
                    centered: true,
                }).then(value => {
                    if (value) {
                        const isSaveSuccess = this.saveEdit()
                        if (isSaveSuccess) {
                            this.formEdited = false;
                        }
                    } else {
                        this.formSaved = true;
                        this.selectProgramBeforeEdit();
                        this.cancelEditing(() => next());
                    }
                })
            } else {
                this.cancelEditing(() => next());
            }
        },
        loadProject () {
            this.$store.dispatch('project/FETCH_comments', { id: this.$route.params.id });
            this.$store.dispatch('project/FETCH_messages', { id: this.$route.params.id });
            this.$store.dispatch('project/FETCH_project', { id: this.$route.params.id, comments: true, }).then(() => {
                const tempProject = JSON.parse(JSON.stringify(this.project));
                tempProject.programs.forEach(program => {
                    if (!program.work_type || program.work_type.length == 0) program.work_type = null;
                    if (!program.difficulty_type || program.difficulty_type.length == 0) program.difficulty_type = null;
                })
                this.startData = JSON.stringify(this.tempProject);
                this.edit = tempProject;
                this.$store.dispatch('project/startProjectEdit', { id: this.$route.params.id }).then((data) => {
                    this.blockStatus = data;
                    // Настройим форму редактирования паспорта
                    this.formCustomizing();
                })
                if (!this.edit.read_only) {
                    this.blockTimer = setInterval(() => {
                        this.$store.dispatch('project/startProjectEdit', { id: this.$route.params.id })
                    }, 60 * 1000)
                }
            })      
        },
        isShowProgram (program) {
            return (program.roles.length && (this.currentProgramId === 0 || program.id === this.currentProgramId));
        },
        getUserByRole: (roles, roleName) => {
            const roleArr = Array.isArray(roleName) ? roleName : [roleName];
            return roles.find(role => roleArr.indexOf(role.role) > -1);
        },
        saveEdit () {
            if (this.$v.edit.$invalid) {
                return false;
            }
            
            const tmpSaveProject = this.edit;
            if (!tmpSaveProject.max_copies) tmpSaveProject.max_copies = null;
            if (!tmpSaveProject.difficulty_type) tmpSaveProject.difficulty_type = '';

            tmpSaveProject.programs.forEach(program => {
                if (program.compet_roles === null) program.compet_roles = [];
                program.compet_roles = program.compet_roles.filter(role => role.role.name && role.role.name.length && role.quantity);
                program.resources = program.resources.filter(resource => resource.resource.name && resource.quantity);
                program.max_copies = tmpSaveProject.max_copies;
                if (!program.students) program.students = null;
                if (!program.work_type) program.work_type = '';
                if (!program.difficulty_type) program.difficulty_type = '';
            })
            this.formSaved = true;
            clearInterval(this.blockTimer);
            this.$store.dispatch('project/SAVE_project', { id: this.$route.params.id, data: tmpSaveProject });
            this.selectProgramBeforeEdit();
            return true;
        },
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
        cancelEditing (callback) {
            if (this.project && !this.project.read_only) {
                if (this.blockTimer) {
                    clearInterval(this.blockTimer);
                }
                this.$store.dispatch('project/stopProjectEdit', { id: this.$route.params.id }).then(() => {
                    if (callback) { callback(); }
                })
            } else {
                if (callback) { callback(); }
            }
        },
        isProgramInvalid(index) {
            return !this.$v.edit.programs.$each[index].students.maxValue;
        },
        isRolesInvalid(programIndex) {
            return !this.$v.edit.programs.$each[programIndex].rolesCount;
        },
        formCustomizing() {      
            this.selectedProgramBeforeEdit = this.currentProgramId;
            // Если пользователь - главный РОП - откроем ему все программы
            if (this.meIsMROP && this.project.programs.length > 1) {
                this.currentProgramId = 0;
            }
        },
        selectProgramBeforeEdit() {
            this.currentProgramId = this.selectedProgramBeforeEdit;
        }
    },
    computed: {
        canSeePartner () {
            return this.meIsPartnerIsURFU || !this.meIsPartner;
        },
        currentProgramId: {
            get () {
                return this.currentProgram ? this.currentProgram.id : 0;
            },
            set (newVal) {
                this.$store.commit('project/SET_currentProgram', newVal);
            }
        },
        ...mapState({
            user: state => state.user,
            project: state => state.project.project,
            messages: state => state.project.messages,
            currentProgram:  state => state.project.currentProgram,
            learning_src: state => state.api.learning_src,
        }),
        ...mapGetters('api', [
            'getSemester',
            'notOutdatedSemester',
            'semesterActual',
        ]),
        ...mapGetters('project', [
            'meIsRCUR',
            'meIsMCUR',
            'meIsRROP',
            'meIsMROP',
            'meIsPartner',
            'meIsPartnerIsURFU',
            'myProgram',
            'ropListActive',
            'currentProgramIsMain',
            'MCUR',
            'MROP',
            'isMulti',
            'canEditCommon',
        ]),
        computedPasport () {
            return JSON.stringify(this.edit);
        }
    },
    watch: {
        computedPasport (newVal, oldVal) {
            if (newVal && oldVal && newVal !== oldVal && newVal.length > 10 && oldVal.length > 10 && !this.formSaved) {
                this.formEdited = true;
            }
        }
    }
}
</script>
<style>
.short-input input {
    max-width: 50%;
}
</style>
