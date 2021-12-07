<template>
    <div v-collapse-buttons class="buttons-wrapper">
        <b-overlay :show="isPassportApproveLoading" spinner-small spinner-variant="primary" rounded="sm" opacity="0.6" class="d-inline-block">
            <b-button v-if="buttons.indexOf('accept') > -1" @click="sendReviewResult('accept')" variant="primary" >
                {{  {
                    'ACPT': 'Утвердить паспорт',
                    'ACUV': 'Принять в редакции Университета',
                    'ACPV': 'Принять в редакции Заказчика',
                    }[project.available_actions.accept]
                }}
            </b-button>
        </b-overlay>
        
        <b-button @click="openReviewResult" variant="primary" v-if="buttons.indexOf('review') > -1">
            {{ project.available_actions.review == "RVPA" ? "Отправить на согласование Заказчику" : "Отправить на согласование в Университет" }}
        </b-button>

        <b-button v-if="buttons.indexOf('approve') > -1" @click="openApproveModal(true)">
            {{ textFromAbbr(currentProgram.available_actions.approve) }}
        </b-button>

        <b-button v-if="buttons.indexOf('decline') > -1" @click="openApproveModal(false)">
            Отправить на доработку
        </b-button>

        <CuratorSelect
            v-if="buttons.indexOf('assign_curator') > -1"
            variant="secondary"
            title="Назначить куратора"
            @input="
                (curatorId) => {
                    $store.dispatch('project/assignCurator', {
                        id: project.id,
                        params: {
                            program: myProgram.program.id,
                            curator: curatorId,
                        },
                    }).then(data => {
                        this.$store.dispatch('project/FETCH_project', { id: project.id, project: data.project })
                        this.$store.dispatch('project/FETCH_messages', { id: project.id, messages: data.project.messages })
                    })
                }
            "
        />

        <CuratorSelect
            v-if="buttons.indexOf('change_curator') > -1"
            btnClass="btn_flat"
            variant="secondary"
            title="Сменить куратора"
            @input="
                (curator) => {
                    $store.dispatch('project/changeCurator', {
                        id: project.id,
                        params: {
                            program: myProgram.program.id,
                            curator: curator,
                        },
                    });
                }
            "
        />

        <b-button v-if="buttons.indexOf('edit') > -1" @click="editPassport()">Редактировать</b-button>
        <!-- Кнопка "Редактировать" партнера (устарела) -->
        <!--<b-button v-if="partnerCanEdit" @click="editPassport()">Редактировать</b-button>-->

        <b-button class="btn_flat" v-if="buttons.indexOf('add_program') > -1" v-b-modal="'assignProgramModal_' + uid">
            Пригласить РОПа
        </b-button>

        <b-button v-if="buttons.indexOf('export_its') > -1" @click="openExportITSModal()">
            Выгрузить в ИТС
        </b-button>

        <b-button class="btn_flat" v-if="buttons.indexOf('print_pdf') > -1" @click="makePDF(project, 'passport')">
            Сохранить в PDF
        </b-button>

        <!-- Модалки -->

        <b-modal size="lg" :id="'approveMessageModal_' + uid" centered hide-header>
            <h2>        
                {{ approve ? "Отправить на согласование" : "Отправить на доработку" }}
            </h2>
            <div class="h1__description">
                {{ approve ? "Напишите комментарий для университета." : "Напишите комментарий, если у вас есть замечания." }}        
            </div>
            <b-form-textarea class="mt-4" v-model.trim="approveMessage" placeholder="Поле можно оставить пустым" rows="5" />
            <template v-slot:modal-footer>
                <b-button variant="primary" @click="approveProgram">Отправить</b-button>
                <b-button @click="$bvModal.hide('approveMessageModal_' + uid)">Отменить</b-button>
            </template>
        </b-modal>

        <b-modal size="lg" :id="'sendToReviewMessageModal_' + uid" centered hide-header>
            <h2>Отправить на согласование</h2>
            <div class="h1__description">
                Напишите ключевые изменения, на которые необходимо обратить внимание
            </div>
            <b-form-textarea class="mt-4" v-model.trim="reviewMessage" placeholder="Поле можно оставить пустым" rows="5" />
            <template v-slot:modal-footer>
                <b-button variant="primary" @click="sendReviewResult('review')">Отправить</b-button>
                <b-button @click="$bvModal.hide('sendToReviewMessageModal_' + uid)">Отменить</b-button>
            </template>
        </b-modal>

        <b-modal :id="'assignProgramModal_' + uid" centered title="Добавить образовательную программу">
            <b-form-group>
                <ProgramSelect v-model="assignProgramId" 
                    :ignorePrograms="project.programs.filter(prog => prog.rop_participation_status !== null).map(prog => prog.program.id)" />
            </b-form-group>
            <b-form-group label="Комментарий">
                <b-form-textarea v-model="assignProgramComment" placeholder="Напишите дополнительному руководителю полезные детали проекта" />
            </b-form-group>
            <template v-slot:modal-footer>
                <b-button variant="primary" :disabled="!assignProgramId" @click="assignProgram">Добавить</b-button>
            </template>
        </b-modal>

        <b-modal :id="'passportBlocked_' + uid" centered title="Паспорт недоступен для редактирования" hide-footer>
            <p>
                Паспорт открыт для редактирования пользователем
                <span v-if="blockData && blockData.user">
                    <strong>{{ blockData.user.last_name }} {{ blockData.user.first_name }}
                        {{ blockData.user.middle_name }}</strong>
                    (<a :href="'mailto:' + blockData.user.email">{{ blockData.user.email }}</a>)
                </span>
            </p>
        </b-modal>

        <b-modal :id="'exportITSModal_' + uid" centered title="Выгрузка в ИТС" content-class="modal-export" size="lg">
            <p class="subtitle">Статус выгрузки образовательных программ паспорта</p>
            <b-overlay :show="isExportLoading" rounded="sm" spinner-variant="primary" style="min-height:80px">
                <p v-for="program of programsAfterExport" :key="program.id" class="program-status">
                    <span class="program"><span>{{ program.program.uid }}</span> {{ program.program.name }}</span>
                    <span v-if="export_programs[program.id] && !export_programs[program.id].error" class="result good">
                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <ellipse cx="8.00616" cy="8" rx="8.0064" ry="8" fill="#44A52C"/>
                            <path d="M4.92676 8.61536L7.39027 10.4615L11.0855 5.53844" stroke="white" stroke-width="1.5"
                                stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>
                            Выгружено {{ formatDateTime(program.published) }}
                        </span>
                    </span>
                    <span v-else-if="export_programs[program.id] && export_programs[program.id].error" class="result bad">
                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="8.39331" cy="8" r="8" fill="#F5222D"/>
                            <path d="M8.39331 3.64019V8.47049" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M8.39331 11.6305V7.27655" stroke="white" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" stroke-dasharray="0.01 4.5"/>
                        </svg>
                        <span v-if="export_programs[program.id].message &&
                            (export_programs[program.id].message == 'Не создана проектная группа' ||
                            export_programs[program.id].message == 'Проект с таким id уже существует')">
                            Ошибка выгрузки. {{ export_programs[program.id].message }}
                        </span>
                        <span v-else>
                            Ошибка выгрузки. Ответ ИТС: {{ export_programs[program.id].message }}<br>
                            Вы можете обратиться в&nbsp;техническую поддержку университета
                            по&nbsp;телефону (343)&nbsp;227-20-70
                        </span>
                    </span>
                </p>
                
            </b-overlay>
            <p v-if="someExportError" class="hint">
                Пожалуйста, устраните ошибки и выгрузите паспорт повторно.
            </p>
            <template v-slot:modal-footer>
                <b-button @click="$bvModal.hide('exportITSModal_' + uid)">Закрыть</b-button>
            </template>
        </b-modal>

        <!-- Конец модалок -->
    </div>  
</template>

<script>
import { mapState, mapGetters } from "vuex";
import CuratorSelect from "@/components/selectModal/Curator";
import ProgramSelect from "@/components/selectModal/Program";
import { makeUID } from '@/utils'

import makePDF from "@/utils/makePDF/Project";
import format from 'date-fns/format';
import { requiredHTML } from '@/utils/validators';

const mapAbbr = {
    ABTC: "Отправить на согласование РОПу",
    ABMC: "Отправить на согласование главному куратору",
    ABMT: "Отправить на согласование главному РОПу",
};

export default {
    name: 'ActButtons',
    components: {
        ProgramSelect,
        CuratorSelect,
    },
    props: {
        buttons: {
            type: Array
        },
        hidden: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            uid: '',
            approve: null,
            approveMessage: null,
            reviewMessage: null,
            assignProgramId: null,
            assignProgramComment: null,
            blockData: null,
            export_programs: null,
            isExportLoading: false,
            isPassportApproveLoading: false
        };
    },
    created() {
        this.uid = makeUID(3)
    },
    methods: {
        makePDF,
        formatDateTime: date => format(date, 'DD.MM.YYYY HH:mm'),
        textFromAbbr: abbr => mapAbbr[abbr],
        getUserByRole: (roles, roleName) => {
            const roleArr = Array.isArray(roleName) ? roleName : [roleName];
            return roles.find(role => roleArr.indexOf(role.role) > -1);
        },
        openExportITSModal() {
            this.$bvModal.show('exportITSModal_' + this.uid );
            this.isExportLoading = true;
            this.$axios.post(this.learning_src + "passport/" + this.project.id + "/export_its/")
                .then((res) => {
                    this.export_programs = {}
                    if (res.data.status == 'success') {
                        res.data.report.result.forEach((item) => {
                            this.export_programs[item.program] = {
                                message: item.message,
                                error: item.error,
                            }
                        });
                        const project = res.data.project;
                        this.$store.dispatch("project/FETCH_project", {
                            id: this.project.id,
                            project,
                        });
                    }
                })
                .then(() => {
                    this.isExportLoading = false;
                });
        },
        openApproveModal(approve) {      
            if (!approve || (approve && this.validatePassport())) {
                this.approve = approve;        
                this.approveMessage = null;
                this.$bvModal.show('approveMessageModal_' + this.uid );
            }
        },
        approveProgram() {
            this.$store.dispatch("project/approveProgram", {
                id: this.currentProgram.id,
                approve: this.approve,
                message: this.approveMessage,
            });
            this.$bvModal.hide("approveMessageModal_" + this.uid);
        },    
        assignProgram() {
            const formData = new FormData();
            formData.append("program", this.assignProgramId);
            if (this.assignProgramComment)
                formData.append("message", this.assignProgramComment);
            this.$axios.post(this.learning_src + "add_rop/" + this.project.id, formData).then(() => {
                this.$store.dispatch("project/FETCH_project", {
                    id: this.project.id,
                    force: true,
                });
                this.$bvModal.hide('assignProgramModal_' + this.uid);
            });
        },
        openReviewResult() {
            if (this.validatePassport()) {
                this.reviewMessage = null;
                this.$bvModal.show('sendToReviewMessageModal_' + this.uid);
            }
        },
        sendReviewResult(type) {
            if (this.validatePassport()) {
                if (type === 'accept')
                    this.isPassportApproveLoading = true;
                this.$store.dispatch("project/sendReviewResult", {
                    id: this.project.id,
                    type: type,
                    params: { message: this.reviewMessage },
                }).then(() => {
                    if (type === 'accept')
                        this.isPassportApproveLoading = false;
                });
                this.$bvModal.hide('sendToReviewMessageModal_' + this.uid);
            }
        },
        editPassport() {
            this.blockData = null;
            this.$store.dispatch("project/startProjectEdit", { id: this.$route.params.id }).then((data) => {
                if (data) {
                    this.blockData = data;
                    this.$bvModal.show('passportBlocked_' + this.uid);
                } else {
                    this.$router.push("/passport/" + this.project.id + "/edit");
                }
            });
        },
        validatePassport() {
            let validateSumErrors = 0;
            const validate = [];
            const validateProgram = [];
            if (this.meIsMROP || this.meIsMCUR || this.meIsPartner) {
                if (!this.project.name) validate.push("Укажите название проекта");
                if (!requiredHTML(this.project.goal)) validate.push("Укажите цель");
                if (!requiredHTML(this.project.result)) validate.push("Укажите результат");
                if (!requiredHTML(this.project.description)) validate.push("Укажите описание");
                if (!requiredHTML(this.project.criteria)) validate.push("Укажите критерии приемки результата / продукта");
                if (this.project.max_copies < 1) validate.push("Укажите количество команд");
            }
            const programsForCheck = this.project.available_actions['accept'] || this.project.available_actions['review']
                ? this.project.programs
                : [this.currentProgram];
            programsForCheck.forEach((program) => {
                if (program && program.roles.length) {
                    const errors = [];
                    const hasCUR = program.roles.find((role) => role.role === "RCUR" || role.role === "MCUR");
                    if (!hasCUR) errors.push("Не добавлен куратор");

                    if (!program.project_short_name.length) errors.push("Укажите краткое название проекта");
                    // if (!program.resources.length) errors.push('Укажите ресурсы')
                    if (isNaN(Number(program.students)) || program.students < 1) errors.push("Укажите количество студентов");
                    if (!requiredHTML(program.description)) errors.push("Укажите описание");
                    if (!requiredHTML(program.criteria)) errors.push("Укажите критерии приемки результата / продукта");
                    if (!requiredHTML(program.result)) errors.push("Укажите результат");
                    if (!requiredHTML(program.compet_roles)) errors.push("Укажите требования к компетентностным ролям")
                    else {  
                        if (program.compet_roles.reduce((prev, cur) => prev + cur.quantity, 0) != program.students) errors.push("Количество студентов в команде не совпадает с числом участников в разделе “Требования к ролям”")
                    }
                    if (this.meIsPartnerIsURFU || !this.meIsPartner) {
                        if (!program.course.length) errors.push("Выберите курсы");
                        if (!program.student_diploma_name.toString().length) errors.push("Введите название для диплома студента");
                        if (!program.work_type) errors.push("Выберите тип проекта");
                        if (!program.difficulty_type) errors.push("Укажите уровень сложности");
                        if (!requiredHTML(program.professional_competence_group_text)) errors.push("Введите описание компетенций");
                    }

                    validateProgram.push({
                        name: program.program.name,
                        error: errors,
                    });
                }
            });      
            let errorLength = validateProgram.reduce((prev, cur) => cur.error.length + prev, 0);
            validateSumErrors = validate.length + errorLength;
            this.$emit("errors", {
                validateSumErrors,
                validate,
                validateProgram,
            });
            return !validateSumErrors;
        },
    },
    computed: {
        ...mapState({
            project: (state) => state.project.project,
            currentProgram: (state) => state.project.currentProgram,
            learning_src: (state) => state.api.learning_src,
        }),
        ...mapGetters(
            "project", 
            [
                "MCUR",
                "meIsRCUR",
                "meIsMCUR",
                "meIsMROP",
                "meIsRROP",
                "meIsPartner",
                "meIsPartnerIsURFU",
                "myProgram",
                "currentProgramIsMain",
                "allProgramsApproved",
                "isMulti",
            ]
        ),
        someExportError() {
            return !this.isExportLoading && this.export_programs && Object.values(this.export_programs).some(program => program.error)
        },
        programsAfterExport() {
            if (!this.export_programs)
                return []
            return this.project.programs
                .filter(program => this.export_programs[program.id])
        }
    },
};
</script>
<style>
.modal-export .subtitle {
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.2px;
    color: #72808E;    
}
.modal-export .program-status {
    margin-top: 24px;
}
.modal-export .program-status span.program {
    font-size: 13px;
    color: #000;
    display: block;
    line-height: 16px;
}
.modal-export .program-status span.program span {
    color: #72808E;
}
.modal-export .program-status span.status.published {
    color: #6c6;
    display: block;
}
.modal-export .program-status span.status {
    color: #999;
    display: block;
}
.modal-export .program-status span.result {
    display: flex;
    padding: 16px 24px;
    box-sizing: border-box;
    border-radius: 6px;
    font-size: 16px;
    margin-top:  6px;
}
.modal-export .program-status span.result span {
    display: block;
    flex: 1 1 auto;
}
.modal-export .program-status span.result svg {
    flex: 0 0 auto;
    margin-top:  2px;
    margin-right: 16px;
}
.modal-export .program-status span.result.good {
    background: rgba(99, 199, 74, 0.15);
    border: 1px solid rgba(99, 199, 74, 0.15);
}
.modal-export .program-status span.result.bad {
    background: rgba(255, 61, 71, 0.08);
    border: 1px solid rgba(255, 61, 71, 0.08);
}
.modal-export .hint {
    margin-bottom: 0;
    margin-top: 30px;

    color: black;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.2px;
}
</style>