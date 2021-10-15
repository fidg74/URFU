<template>
    <b-container class="passport-history">
        <b-button variant="primary" class="btn_flat mb-3" :to="'/passport/' + project.id" v-if="project">
            <i class="fas fa-arrow-left" />
            <span>Назад к паспорту проекта</span>
        </b-button>

        <template v-if="project">
            <h1>{{ project.name }}</h1>
            <div class="h1__description">Паспорт №{{ project.uid }} от {{ formatDate(project.passport_date) }} <br>на основании заявки №{{ project.uid }} от {{ formatDate(project.date) }}</div>

            <b-row class="mt-4">
                <b-col cols="9">
                    <b-alert show variant="primary" class="alert_icon alert_horizontal" v-if="project.request_status === 'PSPT' && meIsPartner">
                        <b-icon-info-circle-fill />
                        Паспорт сформирован Университетом на&nbsp;основе заявки и&nbsp;некоторые поля могли быть дополнены и&nbsp;изменены
                    </b-alert>

                    <b-card class="mt-0 mb-4 version-selector">
                        <HistoryVersionSelector @update="onVersionSelect" ref="version_selector" />
                    </b-card>

                    <b-card class="card_content">
                        <b-badge :variant="project.request_status" class="fl-right">{{ model(project.request_status) }}</b-badge>
                        <h2>Описание проекта</h2>
            
                        <h4 class="mt-4">Полное название проекта</h4>
                        <div v-if="diff" v-html="diff.name" class="project__user-text"></div>
                        <div v-else class="project__user-text">{{ project.name }}</div>

                        <div class="project__visible mt-4 mb-4" v-if="canSeePartner">
                            <template v-for="program of project.programs">
                                <div v-if="isShowProgram(program)" :key="program.id">
                                    <div class="mb-4">
                                        <h4 class="mt-4 mb-1">
                                            Краткое название проекта
                                            <i class="form-eye ml-2" v-b-tooltip title="Не видно заказчику" />
                                        </h4>
                                        <div class="text-caption mb-1">{{ program.program.name }}</div>
                                        <div v-if="diff && diff.programs[program.program.uid]">
                                            <div v-if="diff.programs[program.program.uid].project_short_name" v-html="diff.programs[program.program.uid].project_short_name" class="project__user-text"></div>
                                            <div v-else>Не заполнено</div>
                                        </div>
                                        <div v-else>
                                            <div v-if="program.project_short_name" class="project__user-text">{{ program.project_short_name }}</div>
                                            <div v-else>Не заполнено</div>
                                        </div>
                                    </div>
                                    <div class="mb-2">
                                        <h4 class="mt-4 mb-1">
                                            Название для диплома студента
                                            <i class="form-eye ml-2" v-b-tooltip title="Не видно заказчику" />
                                        </h4>
                                        <div class="text-caption mb-1">{{ program.program.name }}</div>
                                        <div v-if="diff && diff.programs[program.program.uid]">
                                            <div v-if="diff.programs[program.program.uid].student_diploma_name" v-html="diff.programs[program.program.uid].student_diploma_name" class="project__user-text"></div>
                                            <div v-else>Не заполнено</div>
                                        </div>
                                        <div v-else>
                                            <div v-if="program.student_diploma_name" class="project__user-text">{{ program.student_diploma_name }}</div>
                                            <div v-else>Не заполнено</div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <h4 class="mt-4">Цель</h4>
                        <div v-if="diff">
                            <div v-if="diff.goal" v-html="diff.goal" class="project__user-text"></div>
                            <div v-else>Не заполнено</div>
                        </div>
                        <div v-else>
                            <div v-if="project.goal" class="project__user-text" v-html="project.goal"></div>
                            <div v-else>Не заполнено</div>
                        </div>

                        <h4 class="mt-4">Результат (продукт)</h4>
                        <div v-if="diff">
                            <div v-if="diff.result" v-html="diff.result" class="project__user-text"></div>
                            <div v-else>Не заполнено</div>
                        </div>
                        <div v-else>
                            <div v-if="project.result" class="project__user-text" v-html="project.result"></div>
                            <div v-else>Не заполнено</div>
                        </div>

                        <div class="project__visible mt-4 mb-4" v-if="isMulti">
                            <template v-for="program of project.programs">
                                <div class="mb-2" v-if="isShowProgram(program)" :key="program.id">
                                    <h4 class="mt-4 mb-1">Результат (продукт)</h4>
                                    <div class="text-caption mb-1">{{ program.program.name }}</div>
                                    <div v-if="diff && diff.programs[program.program.uid]">
                                        <div v-if="diff.programs[program.program.uid].result" v-html="diff.programs[program.program.uid].result" class="project__user-text"></div>
                                        <div v-else>Не заполнено</div>
                                    </div>
                                    <div v-else>
                                        <div v-if="program.result" class="project__user-text" v-html="program.result"></div>
                                        <div v-else>Не заполнено</div>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <h4 class="mt-4">Критерии приемки результата / продукта</h4>
                        <div v-if="diff">
                            <div v-if="diff.criteria" v-html="diff.criteria" class="project__user-text"></div>
                            <div v-else>Не заполнено</div>
                        </div>
                        <div v-else>
                            <div v-if="project.criteria" class="project__user-text" v-html="project.criteria"></div>
                            <div v-else>Не заполнено</div>
                        </div>

                        <div class="project__visible mt-4 mb-4" v-if="isMulti">
                            <template v-for="program of project.programs">
                                <div class="mb-2" v-if="isShowProgram(program)" :key="program.id">
                                    <h4 class="mt-4 mb-1">Критерии приемки результата / продукта</h4>
                                    <div class="text-caption mb-1">{{ program.program.name }}</div>
                                    <div v-if="diff && diff.programs[program.program.uid]">
                                        <div v-if="diff.programs[program.program.uid].criteria" v-html="diff.programs[program.program.uid].criteria" class="project__user-text"></div>
                                        <div v-else>Не заполнено</div>
                                    </div>
                                    <div v-else>
                                        <div v-if="program.criteria" class="project__user-text" v-html="program.criteria"></div>
                                        <div v-else>Не заполнено</div>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <h4 class="mt-4">Описание проекта</h4>
                        <div v-if="diff">
                            <div v-if="diff.description" v-html="diff.description"></div>
                            <div v-else>Не заполнено</div>
                        </div>
                        <div v-else>
                            <div v-if="project.description" v-html="project.description"></div>
                            <div v-else>Не заполнено</div>
                        </div>

                        <div class="project__visible mt-4 mb-4" v-if="isMulti">
                            <template v-for="program of project.programs">
                                <div class="mb-2" v-if="isShowProgram(program)" :key="program.id">
                                    <h4 class="mt-4 mb-1">Описание проекта</h4>
                                    <div class="text-caption mb-1">{{ program.program.name }}</div>
                                    <div v-if="diff && diff.programs[program.program.uid]">
                                        <div v-if="diff.programs[program.program.uid].description" v-html="diff.programs[program.program.uid].description"></div>
                                        <div v-else>Не заполнено</div>
                                    </div>
                                    <div v-else>
                                        <div v-if="program.description" v-html="program.description"></div>
                                        <div v-else>Не заполнено</div>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <h4 class="mt-4">Макс. количество экземпляров проекта</h4>
                        <div v-if="diff">
                            <div v-if="diff.max_copies" v-html="diff.max_copies"></div>
                            <div v-else>Не заполнено</div>
                        </div>
                        <div v-else>
                            <div v-if="project.max_copies">{{ project.max_copies }}</div>
                            <div v-else>Не заполнено</div>
                        </div>
                    </b-card>

                    <b-card class="card_content">
                        <h2>Эксперты</h2>
                        <template v-for="program of project.programs">
                            <div v-if="isShowProgram(program)" :key="program.id" class="mb-4">
                                <div class="text-caption mb-1">{{ program.program.name }}</div>
                                <div v-if="diff && diff.programs[program.program.uid]">
                                    <div v-if="diff.programs[program.program.uid].experts" v-html="diff.programs[program.program.uid].experts" class="project__user-text"></div>
                                    <div v-else>Не заполнено</div>
                                </div>
                                <div v-else>
                                    <div v-if="program.experts" class="project__user-text">{{ program.experts }}</div>
                                    <div v-else>Не заполнено</div>
                                </div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content">
                        <h2 class="mb-4">Образовательная программа</h2>

                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="isShowProgram(program)" :key="program.id">
                                <template v-if="program.program.area && program.program.area.name">
                                    <h4 class="mb-1">Направление подготовки</h4>
                                    <div><span class="text-caption mr-2">{{ program.program.area.uid }}</span> {{ program.program.area.name }}</div>
                                </template>

                                <h4 class="mt-4 mb-1">Образовательная программа</h4>
                                <div><span class="text-caption mr-2">{{ program.program.uid }}</span> {{ program.program.name }}</div>
                
                                <h4 class="mt-4 mb-1">Семестр</h4>
                                <div v-if="diff">
                                    <div v-html="diff.semester"></div>
                                </div>
                                <div v-else>
                                    <div v-if="project.semester">{{ getSemester(project.semester).period }}</div>
                                    <div v-else>Не заполнено</div>
                                </div>
                
                                <h4 class="mt-4 mb-1">Курс</h4>
                                <div v-if="diff && diff.programs[program.program.uid]">
                                    <div 
                                        :class="{
                                            'project__course': 1,
                                            'project__course_active': diff.programs[program.program.uid].courses[course] != 'N',
                                            'project__course_added': diff.programs[program.program.uid].courses[course] == 'A',
                                            'project__course_deleted': diff.programs[program.program.uid].courses[course] == 'D',
                                        }"
                                        v-for="(course, index) in course[program.program.level]"
                                        :key="index"
                                    >
                                        {{ index + 1 }}
                                    </div>
                                </div>
                                <div v-else>
                                    <div 
                                        :class="{ 'project__course': 1, 'project__course_active': program.course.indexOf(course) > -1 }"
                                        v-for="(course, index) in course[program.program.level]"
                                        :key="index">{{ index + 1 }}</div>
                                </div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content" v-if="canSeePartner">
                        <h2 class="mb-0">Тип и сложность проекта</h2>
                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="isShowProgram(program)" :key="program.id">
                                <div class="text-caption mb-1">{{ program.program.name }}</div>
                                <div v-if="diff && diff.programs[program.program.uid]">
                                    <div v-if="diff.programs[program.program.uid].difficulty" v-html="diff.programs[program.program.uid].difficulty"></div>
                                    <div v-else>Не заполнено</div>
                                </div>
                                <div v-else>
                                    <div>
                                        <div v-if="program.work_type">{{ model(program.work_type) }}</div>
                                        <div v-else>Не заполнено</div>
                                    </div>
                                    <div>
                                        <div v-if="program.difficulty_type">{{ model(program.difficulty_type) }}</div>
                                        <div v-else>Не заполнено</div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content">
                        <b-row>
                            <b-col>
                                <h2 class="mb-0">Количество команд и студентов</h2>
                            </b-col>
                            <b-col class="text-right">
                                <!-- <h2 class="mb-0">{{ studentsSum }}</h2> -->
                            </b-col>
                        </b-row>
                        <h4 class="mt-4">Количество команд</h4>
                        <div v-if="diff">
                            <div v-if="diff.max_copies" v-html="diff.max_copies"></div>
                            <div v-else>Не заполнено</div>
                        </div>
                        <div v-else>
                            <div v-if="project.max_copies">{{ project.max_copies }}</div>
                            <div v-else>Не заполнено</div>
                        </div>
                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="isShowProgram(program)" :key="program.id">
                                <h4 class="mt-4 mb-1">Количество студентов в команде</h4>
                                <div class="text-caption mb-1">{{ program.program.name }}</div>
                                <div v-if="diff && diff.programs[program.program.uid]">
                                    <div v-if="diff.programs[program.program.uid].students" v-html="diff.programs[program.program.uid].students"></div>
                                    <div v-else>Не заполнено</div>
                                </div>
                                <div v-else>
                                    <div v-if="program.students">{{ program.students }}</div>
                                    <div v-else>Не заполнено</div>
                                </div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content">
                        <h2 class="mb-4">Требования к ролям</h2>
                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="isShowProgram(program)" :key="program.id">
                                <h4>{{ program.program.name }}</h4>
                                <div v-if="diff && diff.programs[program.program.uid]">
                                    <div class="mb-2" v-for="(item, index) of diff.programs[program.program.uid].compet_roles" :key="index">
                                        <div v-html="item"></div>
                                    </div>
                                    <div v-if="!Object.keys(diff.programs[program.program.uid].compet_roles).length">Не заполнено</div>
                                </div>
                                <div v-else>
                                    <div class="mb-2" v-for="(item, index) of program.compet_roles" :key="index">
                                        <div class="mb-0">
                                            <span class="weight-medium">{{ item.role.name }}</span>
                                            <span class="ml-2 text-caption weight-medium">x {{ item.quantity }}</span>
                                        </div>
                                        <div>{{ item.description }}</div>
                                    </div>
                                    <div v-if="!program.compet_roles.length">Не заполнено</div>
                                </div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content" v-if="canSeePartner">
                        <h2 class="mb-0">Список формируемых компетенций</h2>
                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="isShowProgram(program)" :key="program.id">
                                <h4>{{ program.program.name }}</h4>
                                <div v-if="diff && diff.programs[program.program.uid]">
                                    <div v-if="diff.programs[program.program.uid].professional_competence_group_text" v-html="diff.programs[program.program.uid].professional_competence_group_text"></div>
                                    <div v-else>Не заполнено</div>
                                </div>
                                <div v-else>
                                    <div v-if="program.professional_competence_group_text" v-html="program.professional_competence_group_text"></div>
                                    <div v-else>Не заполнено</div>
                                </div>
                            </div>
                        </template>
                    </b-card>

                    <b-card class="card_content">
                        <h2 class="mb-4">Выделенные заказчиком ресурсы</h2>
                        <template v-for="program of project.programs">
                            <div class="project__block" v-if="isShowProgram(program)" :key="program.id">
                                <h4>{{ program.program.name }}</h4>
                                <div v-if="diff && diff.programs[program.program.uid]">
                                    <div class="mb-2" v-for="(item, index) of diff.programs[program.program.uid].resources" :key="index">
                                        <div v-html="item"></div>
                                    </div>
                                    <div v-if="!Object.keys(diff.programs[program.program.uid].resources).length">Не заполнено</div>
                                </div>
                                <div v-else>
                                    <b-table v-if="program.resources.length" borderless :items="program.resources" :fields="resourcesFields" class="mb-0" thead-class="table__header">
                                        <template v-slot:cell(resource)="data">
                                            {{ data.item.resource.name }}
                                        </template>
                                    </b-table>
                                    <div v-else>Ресурсов нет</div>
                                </div>
                            </div>
                        </template>
                    </b-card>

                </b-col>

                <b-col>
                    <div v-pin-aside>
                        <b-card class="program-choice__wrap mb-4">
                            <h4 class="mb-3">{{ isMulti ? 'Образовательные программы' : 'Образовательная программа' }}</h4>
                            <button v-for="program in project.programs" :key="program.id" v-show="program.roles.length" class="program-choice mb-2" :class="{ 'program-choice_active': program.id === currentProgramId }" @click="currentProgramId = program.id">
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
                            <b-button v-if="isMulti" :variant="currentProgramId === 0 ? 'primary' : 'secondary'" class="program-choice__all mt-2" @click="currentProgramId = 0">
                                Все программы
                            </b-button>
                        </b-card>
                    </div>
                </b-col>
            </b-row>
        </template>

        <div v-if="errorProject">
            <h2 class="mb-4">У вас нет доступа к паспорту этого проекта</h2>
        </div>
    </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import HistoryVersionSelector from '@/components/passport/history-version-select';

import format from 'date-fns/format';
import { declOfNum, model } from '@/utils';

export default {
    name: 'PassportHistory',
    components: {
        HistoryVersionSelector,
    },
    data () {
        return {
            resourcesFields: [
                { key: 'resource', label: '' },
                { key: 'description', label: '', class: 'text-right' },
            ],
            course: {
                LMAG: ['COUI', 'COII'], // "Магистратура"
                LSPE: ['COUI', 'COII', 'CIII', 'COIV', 'COUV'], // "Специалитет"
                LBAK: ['COUI', 'COII', 'CIII', 'COIV'], // "Бакалавриат"
            },

            errorProject: false,
            validate: null,
            validateProgram: null,
            validateSumErrors: null,
            diff: null,
        }
    },
    created () {
        this.updateProject();
    },
    beforeRouteUpdate (to, from, next) {
        next();
        this.updateProject();
    },
    methods: {
        model,
        formatDate: date => format(date, 'DD.MM.YYYY'),
        formatDateTime: date => format(date, 'DD.MM.YYYY HH:mm'),
        getUserByRole: (roles, roleName) => {
            const roleArr = Array.isArray(roleName) ? roleName : [roleName];
            return roles.find(role => roleArr.indexOf(role.role) > -1);
        },
        isShowProgram (program) {
            return (program.roles.length && (this.currentProgramId === 0 || program.id === this.currentProgramId));
        },
        updateProject () {
            this.$store.dispatch('project/FETCH_project', { id: this.$route.params.id }).then(data => {        
                if (data.status === 200) {
                    this.$store.dispatch('project/FETCH_messages', { id: this.$route.params.id });
                    this.$refs.version_selector.loadData();
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
        onVersionSelect (data) {
            this.diff = data;
        },
    },
    computed: {
        canSeePartner () {
            return this.meIsPartnerIsURFU || !this.meIsPartner;
        },
        ...mapState({
            user: state => state.user,
            project: state => state.project.project,
            messages: state => state.project.messages,
            history: state => state.project.history,
            learning_src: state => state.api.learning_src,
        }),
        ...mapGetters('api', [
            'getSemester',
        ]),
        ...mapGetters('project', [
            'meIsMROP',
            'meIsRROP',
            'meIsMCUR',
            'meIsRCUR',
            'meIsPartner',
            'meIsPartnerIsURFU',
            'myProgram',
            'ropListActive',
            'MCUR',
            'MROP',
            'isMulti',
        ]),
        currentProgramId: {
            get () {
                return (this.$store.state.project && this.$store.state.project.currentProgram) ? this.$store.state.project.currentProgram.id : 0;
            },
            set (newVal) {
                this.$store.commit('project/SET_currentProgram', newVal);
            }
        },
        studentsSum () {
            let sum = this.project.programs.reduce((res, program) => {
                return res + (program.roles.length ? (program.students * this.project.max_copies) : 0);
            }, 0)
            return 'Всего ' + sum + ' ' + declOfNum(sum, ['человек', 'человека', 'человек']);
        },
    },
}
</script>
<style>
.current-version {
    color: #44A52C;
    font-weight: bold;
}
.project__course_added {
    color: #44A52C !important;
    background: #e2f4de !important;
}
.project__course_deleted {
    color: #F5222D !important;
    text-decoration-line: line-through;
    background: none !important;
}
</style>
