<template>
    <b-card class="project-card card_content" :class="{ 'project-card_deleted': projectDeleted }">
        <b-row class="header">
            <b-col cols="9">
                <h4 class="project-card__caption" v-if="mode === 'request'">Заявка №{{ project.uid }} от {{ formatDate(project.date) }}</h4>
                <h4 class="project-card__caption" v-else>Паспорт №{{ project.uid }} от {{ formatDate(project.passport_date) }} <br>на основании заявки №{{ project.uid }} от {{ formatDate(project.date) }}</h4>
                <h2 class="project-card__title">
                    <router-link :to="projectLink ? projectLink : ''">{{ (mode === 'request' && project.request_status != "DRFT") ? (project.req_name ? project.req_name : 'Без названия') : (project.name ? project.name : 'Без названия') }}</router-link>
                </h2>
            </b-col>
            <b-col cols="3" class="text-right">
                <template v-if="user.isZP && mode === 'request'">
                    <!-- <b-badge :class="'badge-' + project.request_status" v-if="project.rop_status !== 'PRSN'" :variant="project.rop_status === 'PRSD' ? 'danger' : 'primary'">{{ model(project.request_status !== 'PUBL' ? project.request_status : project.rop_status) }}</b-badge> -->
                    <b-badge :class="'badge-' + project.request_status" v-if="project.request_status === 'DCLN'" :variant="project.rop_status === 'PRSD' ? 'danger' : 'primary'">Отказ отправлен</b-badge>
                </template>

                <b-badge v-if="mode === 'project' || mode === 'request'"
                    :variant="mode === 'project' 
                        ? project.request_status
                        : project.participation_status 
                            ? {
                            'has_offer': project.bef_status,
                            'request_sent': 'secondary',
                            'participates': 'success',
                            'request_declined': 'danger',
                            'declined': 'danger',
                            }[project.participation_status]
                            : project.bef_status">
                    {{ mode === 'project'
                        ? model(project.request_status)
                        : project.participation_status
                            ? {
                            'has_offer': model(project.bef_status),
                            'request_sent': 'Запрос на участие отправлен',
                            'participates': 'Вы участвуете',
                            'request_declined': 'Запрос на участие отклонен',
                            'declined': 'Вы отказались',
                            }[project.participation_status]
                            : model(project.bef_status)
                    }}
                </b-badge>
                <b-badge v-if="project.published_its && mode === 'project' && (!!myProgram || user.isZP)" variant="success">Выгружен в&nbsp;ИТС</b-badge>
            </b-col>
        </b-row>

        <div class="draft-actions" v-if="project.request_status === 'DRFT'">
            <b-button variant="primary" :to="projectLink ? projectLink : ''">Продолжить заполнение</b-button>
            <b-button variant="danger" :disabled="projectDeleted" @click="removeRequest">Удалить</b-button>
        </div>

        <template v-else>
            <div :class="'project-card__message project-card__message_' + (project.is_expired ? 'danger' : 'info')"
                        v-if="!user.isZP && project.bef_status === 'PUBL' &&
                                    myActiveOffers && myActiveOffers.length > 0"
            >
                <b-icon-info-circle-fill class="mr-2" /> {{ project.is_expired ? 'Срок ответа на&nbsp;заявку закончился' : 'Срок ответа на&nbsp;заявку заканчивается' }} 
                <b>{{ formatDate(project.exp_date) }}</b>
            </div>

            <div :class="'project-card__message project-card__message_' + (project.is_expired ? 'danger' : 'info')"
                     v-if="user.isZP && mode === 'request' && project.bef_status === 'PUBL' && (project.rop_status === 'PRSW' || project.rop_status === 'PRSE')">
                <b-icon-info-circle-fill class="mr-2" /> Срок ответа на&nbsp;заявку до&nbsp;{{ formatDate(project.exp_date) }}
            </div>

            <div v-if="project.request_status === 'PUBL' && meIsPartner && (!MROP || (MROP && project.manager && (project.manager.id !== MROP.user.id)))" class="project-card__message project-card__message_info">
                <b-icon-info-circle-fill class="mr-2" />
                <span v-if="project.is_expired">На&nbsp;обработку заявки потребовалось больше времени. В&nbsp;ближайшее время мы&nbsp;с&nbsp;вами свяжемся.</span>
                <span v-else>Вы получите ответ по&nbsp;заявке<b class="nobr"> до&nbsp;{{ formatDate(project.exp_date) }}</b></span>
            </div>

            <div v-if="project.request_status === 'PUBL' && meIsMROP && participationRequests.length > 0" class="project-card__message project-card__message_info">
                <b-icon-info-circle-fill class="mr-2" /> У вас есть запросы на&nbsp;участие
            </div>

            <div v-if="project.request_status === 'PSST' && mode === 'project'" class="project-card__message project-card__message_info">
                <b-icon-info-circle-fill class="mr-2" />  {{ meIsPartner ? 'Мы&nbsp;формируем паспорт и&nbsp;отправим его на&nbsp;согласование&nbsp;до' : 'Заполните и&nbsp;отправьте паспорт на&nbsp;согласование заказчику&nbsp;до' }}&nbsp;{{ formatDate(project.passport_deadline) }}
            </div>

            <div v-if="project.rop_status === 'PRSD' && user.isStaff" class="project-card__message project-card__message_info">
                <b-icon-info-circle-fill class="mr-2" /> Все РОПы отказались от&nbsp;заявки
            </div>

            <div v-if="(user.isPlAdmin || !meIsPartner) && CHPR">
                <h4>Заказчик</h4>
                {{ userFullName(CHPR.user) }}
            </div>
            <hr class="hr_full" v-if="CHPR && (MROP || MCUR)">

            <div v-if="MROP" class="mt-4">
                <h4>Главный руководитель образовательной программы</h4>
                {{ userFullName(MROP.user) }}
            </div>

            <div v-if="MCUR" class="mt-4">
                <h4>Главный куратор</h4>
                {{ userFullName((MCUR.user ? MCUR.user : MCUR)) }}
            </div>

            <div v-if="(user.isPartner || user.isZP) && project.request_status === 'DCLN' && project.decline_message && project.decline_message.user_text">
                <div v-if="!textFull && project.decline_message.user_text.length > 80">
                    <div>
                        <i class="mt-2" style="white-space: pre-wrap;">{{ project.decline_message.user_text.slice(0, 70) + '...' }}</i>
                    </div>
                    <b-button variant="primary" class="btn_flat mt-2" @click="textFull = true">Читать полностью</b-button>
                </div>
                <i v-else class="mt-2" style="white-space: pre-wrap;">{{ project.decline_message.user_text }}</i>
            </div>


            <template v-if="(!!myProgram || user.isZP) && (mode === 'project' || mode === 'implementation') && project.filled_progs">
                <hr class="hr_full mt-4 mb-4" />
                <h4>Образовательные программы</h4>
                <div v-for="program in project.filled_progs" :key="program.program" :class="'project-card__program ' + (program.published ? 'success project-card__program_success' : '')">
                    {{ program.program }}
                    <span class="text-caption ml-2" v-if="program.published">Дата выгрузки в&nbsp;ИТС {{ formatDate(program.published) }}</span>
                </div>
            </template>

            <div class="project-card__buttons">
                <AcceptProject v-if="meIsMROP && project.request_status === 'PUBL'"
                    :project=project
                    @update-project="(projectData) => $emit('update-project', projectData)"
                />

                <template v-if="canAssignCurator && project.request_status !== 'DRFT'">
                    <CuratorSelect
                        title="Назначить куратора"
                        @input="(curatorId) => {
                            $store.dispatch('project/assignCurator', { 
                                id: project.id, 
                                params: {
                                    'program': myProgram.program.id,
                                    'curator': curatorId
                                }
                            }).then(data => {
                                $emit('update-project', data.project)
                            })
                        }"
                    />
                </template>

                <!-- isZP -->
                <ForceAssignRop
                    v-if="user.isZP && !MROP && project.request_status !== 'DCLN'" 
                    :projectId="project.id"
                    :ropListDeclined="ropListDeclined"
                    :ropListActive="ropListActive"
                    :ropListInactive="ropListInactive"
                    @update-project="(data) => $emit('update-project', data)"
                />
                <ZPDeclineMessages
                    v-if="user.isZP && declinedOffers && declinedOffers.length"
                    :messages="declinedMessages"
                    :hasSend="project.request_status !== 'DCLN' && project.rop_status === 'PRSD'"
                    :projectId="project.id"
                    @update="ZPDecline"
                    :projectStatus="project.request_status"
                />
                <ZPDeclineMessages
                    v-if="user.isZP && project.request_status !== 'DCLN' && project.rop_status === 'PRSD'"
                    onlySend
                    :projectId="project.id"
                    @update="ZPDecline"
                    :projectStatus="project.request_status"
                />
                <ZPKernelProject
                    v-if="user.isZP && project.request_status === 'PSST'"
                    :projectId="project.id"
                    :kernel="project.kernel"
                    @update="ZPKernel"
                />
            </div>
        </template>
    </b-card>
</template>

<script>
import { mapState } from 'vuex';

import { model, userFullName, groupBy } from '@/utils';
import format from 'date-fns/format';
import AcceptProject from '@/components/project/Accept';
import CuratorSelect from '@/components/selectModal/Curator';
import ForceAssignRop from '@/components/request/ForceAssignRop';
import ZPDeclineMessages from '@/components/project/ZPDeclineMessages';
import ZPKernelProject from '@/components/project/zp-kernel-project';

export default {
    name: 'ProjectListItem',
    props: {
        mode: String,
        project: Object
    },
    components: {
        AcceptProject,
        CuratorSelect,
        ForceAssignRop,
        ZPDeclineMessages,
        ZPKernelProject,
    },
    data () {
        return {
            CHPR: null,
            projectLink: null,
            textFull: false,

            projectDeleted: false,
        }
    },
    created () {
        this.CHPR = this.project.roles.find(item => item.role === 'CHPR')
        this.projectLink = (this.mode === 'request' ? (this.project.request_status === 'DRFT' ? '/new_request/' : '/requests/') : '/passport/') + this.project.id + (this.mode === 'implementation' ? '/implementation' : '')

        this.meIsPartner = this.project.roles.some(role => role.role === 'CHPR' && role.user.id === this.user.id)
        this.meIsRROP = this.project.programs ? this.project.programs.some(program => program.roles.some(role => role.role === 'RROP' && role.user.id === this.user.id)) : null
        this.meIsMROP = !!this.MROP && (this.MROP.user.id === this.user.id)
    },
    methods: {
        model,
        userFullName,
        formatDate: date => format(date, 'DD.MM.YYYY'),
        formatDateTime: date => format(date, 'DD.MM.YYYY HH:mm'),
        removeRequest () {
            this.$store.dispatch('project/removeRequest', { id: this.project.id }).then(deleted => {
                this.projectDeleted = deleted
            })
        },
        ZPDecline (res) {
            if (res) {
                this.project.request_status = 'DCLN';
                this.project.bef_status = 'DCLN';
            }
        },
        ZPKernel (kernel) {
            this.project.kernel = kernel;
        },
    },
    computed: {
        ...mapState({
            user: state => state.user,
        }),
        mainProgram() {
            return this.project.programs ? this.project.programs.find(program => program.is_main) : null
        },
        myProgram() {
            return this.project.programs ? this.project.programs.find(program => program.roles.some(role => role.user.id === this.user.id)) : null
        },
        MCUR() {
            return this.mainProgram ? this.mainProgram.roles.find(role => role.role === 'MCUR') : null
        },
        MROP() {
            return this.mainProgram ? this.mainProgram.roles.find(role => role.role === 'RROP') : null
        },
        participationRequests() {
            return this.project.participation_requests.filter(request => request.status === null)
        },
        canAssignCurator() {
            if (this.myProgram) {
                return "assign_curator" in this.myProgram.available_actions;
            }
            return false
        },
        myActiveOffers() {
            return this.project.offers ? this.project.offers.filter(offer => offer.status === 'active' && (offer.user && offer.user.id === this.user.id)) : []
        },
        declinedOffers() {
            return this.project.offers
                .filter(offer => offer.status === 'declined' && offer.type == 'participation_invite')
        },
        declinedMessages() {     
            return this.declinedOffers
                .map(offer => {
                    return {
                        'id': offer.id,
                        'sender': offer.user,
                        'user_text': offer.user_text,
                    }
                })
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
        ropListDeclined () {      
            return this.resultDeclinedOffers ? this.resultDeclinedOffers.map(offer => offer.user) : [];
        },
        ropListInactive () {      
            return this.resultNotApprovedOffers ? this.resultNotApprovedOffers.map(offer => offer.user) : [];
        },
        ropListActive () {
            return this.project.programs.reduce((res, program) => {
                const rop = program.roles.find(role => role.role === 'RROP')
                if (rop && rop.id) res.push(rop.user)
                return res
            }, [])
        },
    }
}
</script>

<style>
.project-card {
    text-decoration: none;
    color: #212529;
    max-height: 900px;
    overflow: hidden;
    opacity: 1;
    box-shadow: 0px 1px 2px rgba(0,0,0,0.12);
    transition: box-shadow 0.3s, max-height 0.6s, margin 0.3s 0.3s, opacity 0.3s 0.3s;
}
.project-card:first-child {
    margin-top: 0;
}
.project-card:hover {
    color: #212529;
    text-decoration: none;
    box-shadow: 0 4px 7px rgba(0,0,0,0.1), 0 5px 16px rgba(0,0,0,0.13);
}
.project-card_deleted {
    max-height: 0;
    opacity: 0;
    margin: -0.6rem 0 0 0 !important;
}
.project-card_deleted:first-child {
    margin: -2.5rem 0 0 0 !important;
}
.project-card__caption {
    font-weight: 700;
    font-size: 13px;
    line-height: 1rem;
    margin-bottom: 14px;
}
.project-card__title a {
    color: #212529;
}
.project-card__title a:hover {
    text-decoration: underline;
    color: #007bff;
}
.project-card__program_success {
    color: #02ad1e;
}
.project-card__message {
    margin-bottom: 16px;
}
.project-card__message:last-child {
    margin-bottom: 0 !important;
}
.project-card__message_info {
    color: #467be3;
}
.project-card__message_danger {
    color: #f5222d;
}
.project-card__message_success {
    color: #02ad1e;
}
.project-card__buttons {
    margin-top: 12px;
}
.project-card .badge {
    clear: both;
    float: right;
    margin-bottom: 4px;
}
.project-card .draft-actions {
    margin-top: 16px;
}
@media only screen and (max-width: 767px) {
    .project-card__field {
        display: block;
    }
    .project-card .badge {
        float: none;
        margin: 0 0.5rem 0.5rem 0;
    }
}
.project-card .alert-info {
    background-color: #f4fdff;
    border-color: #e4e4e4;
}
.project-card .alert-danger {
    background-color: #fff5f6;
}
.project-card__filled-program {
    background-color: #fafafa;
}
.project-card__filled-program.alert-success {
    background-color: #effff3;
}
@media (max-width: 575px) {
    .project-card.card_content {
        margin-top: 16px;
    }
    .project-card__buttons .btn {
        display: block;
        margin: 0;
        width: 100%;
    }
    .project-card__buttons .btn + .btn {
        margin-top: 8px;
    }
    .project-card .draft-actions .btn {
        display: block;
        margin: 0;
        width: 100%;
    }
    .project-card .draft-actions .btn + .btn {
        margin-top: 8px;
    }
    .project-card .badge {
        margin: 0;
        font-size: 10px;
        line-height: 10px;
        padding: 2px 4px 4px 4px;
        border-radius: 0 0 6px 6px;
        top: -15px;
        right: 13px;
        position: absolute;
        height: auto;
    }
    .project-card .row.header {
        flex-direction: column-reverse;
        align-item: stretch;
    }
    .project-card .row.header .col-3 {
        height: 0;
        flex: 1 1 100%;
        position: relative;
        width: 100%;
        display: block;
        max-width: 100%;
    }
    .project-card .row.header .col-9 {
        flex: 1 1 100%;
        width: 100%;
        display: block;
        max-width: 100%;
        padding-top: 5px;
    }
    .project-card__caption {
        font-size: 12px;
        line-height: 14px;
        margin-bottom: 8px;
    }
    h2.project-card__title {
        font-size: 18px;
        line-height: 18px;
        margin-bottom: 8px;
    }
}
</style>
