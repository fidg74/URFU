<template>
    <b-container fluid="sm">
        <b-card class="mb-4 std-card">
            <h1>Проектное обучение</h1>
            <p v-if="serviceStatus !== SERVICE_ACTIVATED">Вы находитесь в разделе Проектное обучение.
                <span v-if="serviceStatus === SERVICE_NOT_ACTIVATED">Чтобы начать работу, необходимо <a href="#" @click="showReg">подключить</a> данный сервис.</span>
                <span v-else>Вами отправлен запрос на подключение сервиса.</span>
            </p>
            <b-alert show variant="primary" v-if="semesterActual">
                <svg class="alert-icon" width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8.79102" r="8" fill="#467BE3"/>
                    <path d="M8 4.43121V9.26151" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M8 12.4213V8.06738" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.01 4.5"/>
                </svg>
                Идет подача заявок на {{ semesterActual.period.toLowerCase() }} семестр {{ semesterActual.year }} учебного года. Срок подачи до {{ formatDate(semesterActual.deadline) }}.
            </b-alert>
            <p v-if="isRop || isCurator" class="mt-5"><a href="https://drive.google.com/drive/folders/1suhEJPtDhDUxVOffuQE_UdQ_VD2oDvyy" target="_blank">Полезная информация</a> по организационным вопросам и работе с системой</p>
        </b-card>
        <b-card v-if="serviceStatus === SERVICE_ACTIVATED" class="std-card mb-4 dashboard">
            <b-row>
                <b-col cols="12" sm="12" md="4" class="title">
                    <h3>Текущий период</h3>
                    <p>{{ semesterActual.period.toLowerCase() }} семестр</p>
                </b-col>
                <b-col cols="6" lg="4" md="4" class="mini-card requests">
                    <div>
                        <template v-if="stats && stats.role === 'curator'">
                            <h3>Паспорта</h3>
                            <p>текущие на формировании</p>
                        </template>
                        <template v-else>
                            <h3>Заявки</h3>
                            <p>текущие на рассмотрении</p>
                        </template>

                        <strong v-if="stats">{{ stats.requests }}</strong>
                        <strong v-else><b-spinner></b-spinner></strong>
                    </div>
                </b-col>
                <b-col cols="6" lg="4" md="4" class="mini-card projects">
                    <div>
                        <h3>Проекты</h3>
                        <p>реализуемые сейчас</p>
                        <strong v-if="stats">{{ stats.projects }}</strong>
                        <strong v-else><b-spinner></b-spinner></strong>
                    </div>
                </b-col>
            </b-row>
        </b-card>
        <b-row>
            <b-col v-if="serviceStatus === SERVICE_ACTIVATED" sm>
                <b-card class="std-card mb-4" no-body>
                    <h2 style="padding:28px 30px 0 30px;" class="start-title">Лента основных событий</h2>
                    <b-overlay :show="!(notifications)" rounded="sm">
                        <ul v-if="notifications && notifications.length > 0" class="notification-list">
                            <li v-for="(notification, index) in notifications" :key="index">
                                <a :href="$windowLocationOrigin + notification.href" class="link-to-project">
                                <div class="border-bottom pb-3">
                                    <div class="notification-text-secondary weight-medium mb-2">{{ timeToText(notification.date) }}</div>
                                    <div class="notification-content">
                                        <div class="notification-title mb-2">{{ notification.title.text }}</div>
                                        <div class="project-uid notification-text-secondary mb-2">{{ notification['project-uid'].text }}</div>
                                        <div class="notification-text-secondary">{{ notification['project-name'].text }}</div>
                                    </div>
                                </div>
                                </a>
                            </li>
                        </ul>
                        <div v-else class="text-secondary no-notifications">Пока новых событий нет...</div>
                    </b-overlay>
                </b-card>
            </b-col>
            <b-col sm class="mb-4">
                <b-card v-if="serviceStatus === SERVICE_ACTIVATED" class="std-card mb-4">
                    <div class="mini-body">
                        <a href="#" @click="showInstruction">
                            <i>
                                <svg width="17" height="27" viewBox="0 0 17 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.73193 19.1989L11.7181 18.5371L13.3725 23.5026L12.0481 26.1505L9.73193 19.1989ZM16.0218 14.8966L4.10473 18.8671C3.06975 15.7607 2.62543 14.1257 3.55833 11.0213C3.84645 10.0614 4.03687 9.4275 3.68184 8.36192C2.89701 6.00631 1.34437 7.27056 0.134691 3.63983L10.0656 0.331077C11.262 3.92209 9.28323 3.90725 10.0591 6.23604C10.4142 7.30163 10.9467 7.69462 11.7533 8.29089C14.3647 10.2178 14.9888 11.7961 16.0218 14.8966ZM5.46094 16.2085L13.3421 13.5827C11.5982 9.33555 9.23466 10.3812 8.07428 6.89846C7.54223 5.30488 7.81379 4.39132 8.22773 3.15007L3.29605 4.7932C4.37174 5.53813 5.13664 6.10526 5.66769 7.69917C6.82145 11.1621 4.31327 11.7804 5.46094 16.2085Z" fill="#111112"/>
                                </svg>
                            </i>
                            Инструкция по работе в сервисе
                        </a>
                    </div>
                </b-card>
                <VideoCard 
                    thumbnail-src="/learning/static/img/video-thumbnail.jpg" 
                    video-src="https://www.youtube.com/embed/Fio_N3-G9zc"
                    :video-cookie-name="VIDEO_COOKIE_NAME" 
                    modal-title="Добро пожаловать!"
                    :showHideButton="serviceStatus === SERVICE_ACTIVATED"
                >
                    <template v-slot:header>
                        <h2 class="video-title">Добро пожаловать в сервис Проектное обучение!</h2>
                    </template>
                </VideoCard>
            </b-col>
            <b-col v-if="serviceStatus !== SERVICE_ACTIVATED">
                <b-card class="std-card mb-4" no-body>
                    <b-card-body>
                        <h2 class="what-title">Что мы предлагаем?</h2>
                        <p>Реализацию практических задач вашей организации в рамках образовательной деятельности наших студентов. Вы сможете не только решать задачи силами студентов, но и осуществлять последующий рекрутинг лучших из них. А также, применить реальные результаты студенческих проектов в своей деятельности. Для того, чтобы принять участие в проектном обучении и начать работу со студентами вам необходимо:</p>
                        <ul>
                            <li>заполнить форму заявки на проект и отправить ее на рассмотрение в УрФУ;</li>
                            <li>согласовать уточненный паспорт проекта.</li>
                        </ul>
                        <p style="font-weight:500">Далее у вас будет возможность:</p>
                        <ul>
                            <li>отслеживать промежуточные результаты работы команды проекта;</li>
                            <li>взаимодействовать с командой проекта;</li>
                            <li>оценивать итоговые результаты по проекту.</li>
                        </ul>                        
                    </b-card-body>
                    <b-card-footer v-if="serviceStatus === SERVICE_NOT_ACTIVATED" class="clear-footer">
                        <b-button variant="primary" @click="showReg">Подключить сервис</b-button>
                    </b-card-footer>
                </b-card>
            </b-col>

        </b-row>
        <b-modal id="modalReg" title="Подключить сервис" centered>
            <p class="text-secondary">Ваш запрос на подключение сервиса Проектное обучение будет отправлен специалистам.</p>
            <p class="text-secondary">Права на работу в сервисе будут предоставлены <span class="text-dark">в течение 3 (трех) рабочих дней.</span></p>
            <template #modal-footer>
                <b-overlay :show="isLoading" spinner-small rounded="sm" spinner-variant="primary" opacity="0.6">
                    <b-button variant="primary" @click="sendServiceActivationRequest">Отправить</b-button>
                </b-overlay>
                <b-button variant="secondary" @click="hideReg">Отменить</b-button>
            </template>
        </b-modal>
        <b-modal id="modalInstructionForPartner" size="xl" hide-footer>
            <iframe src="https://www.youtube.com/embed/-jloHBJN2Gs" class="modal-video" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
        </b-modal>
        <b-modal id="modalInstructionForUniversity" size="xl" hide-footer>
            <iframe src="https://www.youtube.com/embed/YsWM9d1T7ts" class="modal-video" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
        </b-modal>
        <SupportHint />
    </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { timeToText } from '@/utils';
import format from 'date-fns/format';

import VideoCard from '@/components/VideoCard'
import SupportHint from '@/components/SupportHint'


const VIDEO_COOKIE_NAME = 'learningVideoHidden'


export default {
    name: 'LearningMain',
    components: {
        VideoCard, SupportHint
    },
    data () {
        return {
            notifications: null,
            stats: null,
            VIDEO_COOKIE_NAME,
            isLoading: false
        }
    },
    created () {
        this.$axios.get(this.notifications_src + 'api/notifications/?important=true&max_count=5').then(data => {
            this.notifications = data.data.map(notification => {
                return {
                    ...notification,
                    'title': notification.text_json.main.find(notificationPart => notificationPart.content === 'title'),
                    'project-uid': notification.text_json.main.find(notificationPart => notificationPart.content === 'project-uid'),
                    'project-name': notification.text_json.main.find(notificationPart => notificationPart.content === 'project-name'),
                }
            });
        })
        .catch((error) => {
            console.log(error);
            this.notifications = [];
        });
        this.$axios.get(this.learning_src + 'main_stats/').then(data => {
            this.stats = data.data.stats;
            this.stats.role = data.data.role;
        })
        .catch((error) => {
            console.log(error);
            this.stats = null;
        });
    },
    methods: {
        formatDate: date => format(date, 'DD.MM.YYYY'),
        showReg () {
            this.$bvModal.show('modalReg');
        },
        hideReg () {
            this.$bvModal.hide('modalReg');
        },
        showInstruction () {
            if (this.user.isPartner) {
                this.$bvModal.show('modalInstructionForPartner');
            } else {
                this.$bvModal.show('modalInstructionForUniversity');
            }
        },
        timeToText: date => timeToText(date),
        async sendServiceActivationRequest () {
            this.isLoading = true
            await this.$axios.patch(this.learning_src + 'service_activation/')
            await this.$store.dispatch('user/FETCH_user')
            this.isLoading = false

            this.hideReg()
            this.$bvToast.toast('Запрос отправлен', {
                title: '',
                variant: 'success',
                toaster: 'b-toaster-top-center',
                autoHideDelay: this.toastHideDelay,
                appendToast: false
            })
            
        }
    },
    computed: {
        ...mapState({
            notifications_src: state => state.api.notifications_src,
            learning_src: state => state.api.learning_src,
            semester: state => state.api.semester,
            user: state => state.user,
        }),
        ...mapGetters('api', [
            'semesterActual',
            'semesterGroupByYear',
            'isLocalhost'
        ]),
        ...mapState('app', [
            'toastHideDelay',
            'SERVICE_ACTIVATED',
            'SERVICE_NOT_ACTIVATED',
            'SERVICE_ACTIVATION_IN_PROGRESS',
        ]),
        ...mapState('user', [
            'isRop',
            'isCurator',
        ]),
        serviceStatus () {
            return this.user.serviceStatus
        }
    },
}
</script>

<style>
#app {
    background: #F1F4FA;
    padding-top: 100px;
    padding-bottom: 0;
}
.aside {
    display: none;
}

.std-card .card-body {
    padding: 2.4rem;
}
.std-card .card-footer {
    padding: 0 32px 32px 32px;
}
.std-card .card-body + .card-footer {
    padding-top: 0;
}
.std-card.dashboard .title {
    padding-top: 25px;
}
.std-card.dashboard .title > h3 {
    color: #72808E;
    font-weight: 500;
    font-size: 22px;
    line-height: 18px;
    letter-spacing: -0.2px;
    margin-bottom: 8px;
}
.std-card.dashboard .title > p {
    color: #72808E;
    font-size: 16px;
    line-height: 26px;
    letter-spacing: -0.2px;
}
.std-card.dashboard .mini-card > div {
    background: #F0F3FF;
    border-radius: 6px;
    padding: 25px 0 25px 25px;
    height: 100%;
    position: relative;
}
.std-card.dashboard .mini-card > div::before {
    content: "";
    display: block;
    position: absolute;
    left: 25px;
    bottom: 18px;
    width: 64px;
    height: 64px;
    background: left bottom no-repeat;
}
.std-card.dashboard .mini-card > div > h3 {
    font-weight: 500;
    font-size: 22px;
    line-height: 18px;
    letter-spacing: -0.2px;
    margin-bottom: 8px;
}
.std-card.dashboard .mini-card > div > p {
    font-size: 16px;
    line-height: 26px;
    letter-spacing: -0.2px;
    margin-bottom: 28px;
    height: 52px;
}
.std-card.dashboard .mini-card > div > strong {
    font-weight: bold;
    font-size: 36px;
    line-height: 20px;
    letter-spacing: -0.2px;
    display: block;
    padding-left: 65px;
}
.std-card.dashboard .mini-card.requests > div {
    background: linear-gradient(86.51deg, #F0F3FF -43.31%, #F3F1FD 45.2%, #F7EEEF 97.13%);
}
.std-card.dashboard .mini-card.requests > div::before {
    left: 14px;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDYiIHZpZXdCb3g9IjAgMCA0MSA0NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeT0iNCIgd2lkdGg9IjM0LjQ2MTUiIGhlaWdodD0iNDIiIHJ4PSIyIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTEgMTMuMjIyMkMxMSAxMi43OTI3IDExLjM1MjkgMTIuNDQ0NSAxMS43ODgzIDEyLjQ0NDVIMjIuODI0M0MyMy4yNTk3IDEyLjQ0NDUgMjMuNjEyNiAxMi43OTI3IDIzLjYxMjYgMTMuMjIyMkMyMy42MTI2IDEzLjY1MTggMjMuMjU5NyAxNCAyMi44MjQzIDE0SDExLjc4ODNDMTEuMzUyOSAxNCAxMSAxMy42NTE4IDExIDEzLjIyMjJaIiBmaWxsPSIjMTExMTEyIi8+CjxwYXRoIGQ9Ik0xMSAxOS40NDQ0QzExIDE5LjAxNDggMTEuMzUyOSAxOC42NjY2IDExLjc4ODMgMTguNjY2NkgzMS40OTU1QzMxLjkzMDkgMTguNjY2NiAzMi4yODM4IDE5LjAxNDggMzIuMjgzOCAxOS40NDQ0QzMyLjI4MzggMTkuODc0IDMxLjkzMDkgMjAuMjIyMiAzMS40OTU1IDIwLjIyMjJIMTEuNzg4M0MxMS4zNTI5IDIwLjIyMjIgMTEgMTkuODc0IDExIDE5LjQ0NDRaIiBmaWxsPSIjMTExMTEyIi8+CjxwYXRoIGQ9Ik0xMSAyNS42NjY3QzExIDI1LjIzNzEgMTEuMzUyOSAyNC44ODg5IDExLjc4ODMgMjQuODg4OUgzMS40OTU1QzMxLjkzMDkgMjQuODg4OSAzMi4yODM4IDI1LjIzNzEgMzIuMjgzOCAyNS42NjY3QzMyLjI4MzggMjYuMDk2MiAzMS45MzA5IDI2LjQ0NDUgMzEuNDk1NSAyNi40NDQ1SDExLjc4ODNDMTEuMzUyOSAyNi40NDQ1IDExIDI2LjA5NjIgMTEgMjUuNjY2N1oiIGZpbGw9IiMxMTExMTIiLz4KPHBhdGggZD0iTTExIDMxLjg4ODlDMTEgMzEuNDU5MyAxMS4zNTI5IDMxLjExMTEgMTEuNzg4MyAzMS4xMTExSDIzLjYxMjZDMjQuMDQ4IDMxLjExMTEgMjQuNDAwOSAzMS40NTkzIDI0LjQwMDkgMzEuODg4OUMyNC40MDA5IDMyLjMxODQgMjQuMDQ4IDMyLjY2NjYgMjMuNjEyNiAzMi42NjY2SDExLjc4ODNDMTEuMzUyOSAzMi42NjY2IDExIDMyLjMxODQgMTEgMzEuODg4OVoiIGZpbGw9IiMxMTExMTIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMSA0MS4yMjIyQzExIDQxLjY1MTcgMTEuMzUyOSA0MiAxMS43ODgzIDQySDM3LjAxMzVDMzguNzU1IDQyIDQwLjE2NjcgNDAuNjA3MSA0MC4xNjY3IDM4Ljg4ODlWNi4yMjIyQzQwLjE2NjcgNC41MDM5OCAzOC43NTUgMy4xMTEwOCAzNy4wMTM1IDMuMTExMDhIMTEuNzg4M0MxMS4zNTI5IDMuMTExMDggMTEgMy40NTkzMSAxMSAzLjg4ODg2QzExIDQuMzE4NDIgMTEuMzUyOSA0LjY2NjY0IDExLjc4ODMgNC42NjY2NEgzNy4wMTM1QzM3Ljg4NDIgNC42NjY2NCAzOC41OTAxIDUuMzYzMDkgMzguNTkwMSA2LjIyMjJWMzguODg4OUMzOC41OTAxIDM5Ljc0OCAzNy44ODQyIDQwLjQ0NDQgMzcuMDEzNSA0MC40NDQ0SDExLjc4ODNDMTEuMzUyOSA0MC40NDQ0IDExIDQwLjc5MjYgMTEgNDEuMjIyMloiIGZpbGw9IiMxMTExMTIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMSAzLjg4ODg5QzExIDQuMzE4NDQgMTEuMzkyNiA0LjY2NjY3IDExLjg3NjkgNC42NjY2N0gzMS4xNjkzQzMyLjYyMjIgNC42NjY2NyAzMy44MDAxIDMuNjIyIDMzLjgwMDEgMi4zMzMzM0MzMy44MDAxIDEuMDQ0NjcgMzIuNjIyMiAwIDMxLjE2OTMgMEgxMS44NzY5QzExLjM5MjYgMCAxMSAwLjM0ODIyMyAxMSAwLjc3Nzc3OEMxMSAxLjIwNzMzIDExLjM5MjYgMS41NTU1NiAxMS44NzY5IDEuNTU1NTZIMzEuMTY5M0MzMS42NTM2IDEuNTU1NTYgMzIuMDQ2MiAxLjkwMzc4IDMyLjA0NjIgMi4zMzMzM0MzMi4wNDYyIDIuNzYyODkgMzEuNjUzNiAzLjExMTExIDMxLjE2OTMgMy4xMTExMUgxMS44NzY5QzExLjM5MjYgMy4xMTExMSAxMSAzLjQ1OTMzIDExIDMuODg4ODlaIiBmaWxsPSIjMTExMTEyIi8+Cjwvc3ZnPgo=");
}
.std-card.dashboard .mini-card.students > div {
    background: linear-gradient(86.51deg, #F0F3FF -43.31%, #F3F1FD 45.2%, #F7EEEF 97.13%);
}
.std-card.dashboard .mini-card.students > div::before {
    left: 13px;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDkiIGhlaWdodD0iNDciIHZpZXdCb3g9IjAgMCA0OSA0NyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOC41IiBjeT0iOS41IiByPSI4LjUiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMyA0MEMxMyAzMS4xNjM0IDIwLjE2MzQgMjQgMjkgMjRDMzcuODM2NiAyNCA0NSAzMS4xNjM0IDQ1IDQwVjQ3SDEzVjQwWiIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iMjkiIGN5PSIxMCIgcj0iOCIgZmlsbD0id2hpdGUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zNC4xMzU0IDIwLjE0N0MzMi41ODY1IDIwLjE0NyAzMS4xMDMzIDIwLjQyODEgMjkuNzMzOSAyMC45NDJDMjkuMzM4NyAyMS4wOTAzIDI4Ljg5NTggMjAuOTcyNSAyOC42MTc5IDIwLjY1NDhDMjguMTkwNiAyMC4xNjYzIDI4LjI3MTYgMTkuMzYzIDI4Ljg3NjUgMTkuMTI4QzMwLjUwNzMgMTguNDk0NSAzMi4yODA4IDE4LjE0NyAzNC4xMzU0IDE4LjE0N0M0Mi4xNTkyIDE4LjE0NyA0OC42NjM3IDI0LjY1MTUgNDguNjYzNyAzMi42NzUyVjM2LjkxMjZDNDguNjYzNyAzNy4zMjMgNDguMzIzMiAzNy42NDUgNDcuOTEyOCAzNy42NDVINDcuMzc1NUM0Ni45Nzc3IDM3LjY0NSA0Ni42NjM3IDM3LjMxMDMgNDYuNjYzNyAzNi45MTI2VjMyLjY3NTJDNDYuNjYzNyAyNS43NTYxIDQxLjA1NDYgMjAuMTQ3IDM0LjEzNTQgMjAuMTQ3WiIgZmlsbD0iIzExMTExMiIvPgo8Y2lyY2xlIGN4PSIzMy43NTI0IiBjeT0iOS43MzY3NyIgcj0iNS40OTk0NyIgc3Ryb2tlPSIjMTExMTEyIiBzdHJva2Utd2lkdGg9IjIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS45NiAxNC40NzIyQzExLjk2IDE1LjAyNDUgMTIuNDEwMSAxNS40NzkxIDEyLjk1NzcgMTUuNDA3N0MxNi43MDkyIDE0LjkxODcgMTkuNjA2MyAxMS43MTA2IDE5LjYwNjMgNy44MjU3N0MxOS42MDYzIDMuOTQwOTYgMTYuNzA5MiAwLjczMjc5NSAxMi45NTc3IDAuMjQzODU1QzEyLjQxMDEgMC4xNzI0NzcgMTEuOTYgMC42MjcwNTcgMTEuOTYgMS4xNzkzNUMxMS45NiAxLjczMTYzIDEyLjQxMTUgMi4xNzAwOCAxMi45NTUyIDIuMjY2NzhDMTUuNTk4OSAyLjczNjk3IDE3LjYwNjMgNS4wNDY5NSAxNy42MDYzIDcuODI1NzdDMTcuNjA2MyAxMC42MDQ2IDE1LjU5ODkgMTIuOTE0NiAxMi45NTUyIDEzLjM4NDhDMTIuNDExNSAxMy40ODE1IDExLjk2IDEzLjkxOTkgMTEuOTYgMTQuNDcyMloiIGZpbGw9IiMxMTExMTIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS45NjA5IDE4Ljc0NTZDMTEuOTYwOSAxOS4zMzE0IDEyLjQ2NDcgMTkuNzg3OCAxMy4wNTAzIDE5Ljc3MjRDMTMuMTk2MiAxOS43Njg1IDEzLjM0MjYgMTkuNzY2NiAxMy40ODk0IDE5Ljc2NjZDMjIuNTIgMTkuNzY2NiAyOS44NDA4IDI3LjA4NzQgMjkuODQwOCAzNi4xMThWNDEuNDcwNkMyOS44NDA4IDQxLjg4NzEgMzAuMTcxNSA0Mi4yMzUgMzAuNTg4IDQyLjIzNUgzMS4wNjA2QzMxLjQ4NzggNDIuMjM1IDMxLjg0MDggNDEuODk3OCAzMS44NDA4IDQxLjQ3MDZWMzYuMTE4QzMxLjg0MDggMjUuOTgyOCAyMy42MjQ2IDE3Ljc2NjYgMTMuNDg5NCAxNy43NjY2QzEzLjI4NCAxNy43NjY2IDEzLjA3OTQgMTcuNzcgMTIuODc1NiAxNy43NzY3QzEyLjM1ODEgMTcuNzkzNyAxMS45NjA5IDE4LjIyNzggMTEuOTYwOSAxOC43NDU2WiIgZmlsbD0iIzExMTExMiIvPgo8L3N2Zz4K");
}
.std-card.dashboard .mini-card.projects > div {
    background: linear-gradient(86.51deg, #F0F3FF -43.31%, #F3F1FD -7.47%, #E1EBFE 86.16%);
}
.std-card.dashboard .mini-card.projects > div::before {
    left: 19px;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzciIGhlaWdodD0iNDciIHZpZXdCb3g9IjAgMCAzNyA0NyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeT0iNSIgd2lkdGg9IjMzIiBoZWlnaHQ9IjI3IiByeD0iMiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTYgMzZDNiAzNS40NDc3IDYuNjcxNTcgMzUgNy41IDM1QzguMzI4NDMgMzUgOSAzNS40NDc3IDkgMzZWNDZDOSA0Ni41NTIzIDguMzI4NDMgNDcgNy41IDQ3QzYuNjcxNTcgNDcgNiA0Ni41NTIzIDYgNDZWMzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNOC4yMzUzNSAzMy42QzguMjM1MzUgMzMuMTc4MyA4LjU2ODkgMzIuODM2NCA4Ljk4MDM2IDMyLjgzNjRDOS4zOTE4MiAzMi44MzY0IDkuNzI1MzcgMzMuMTc4MyA5LjcyNTM3IDMzLjZWNDEuMjM2NEM5LjcyNTM3IDQxLjY1ODEgOS4zOTE4MiA0MiA4Ljk4MDM2IDQyQzguNTY4OSA0MiA4LjIzNTM1IDQxLjY1ODEgOC4yMzUzNSA0MS4yMzY0VjMzLjZaIiBmaWxsPSIjMTExMTEyIi8+CjxwYXRoIGQ9Ik0yMi4zOTAxIDkuMTYzNjZDMjIuMzkwMSA4Ljc0MTkyIDIyLjcyMzcgOC40MDAwMiAyMy4xMzUxIDguNDAwMDJIMjkuMDk1MkMyOS41MDY3IDguNDAwMDIgMjkuODQwMyA4Ljc0MTkyIDI5Ljg0MDMgOS4xNjM2NkMyOS44NDAzIDkuNTg1NDEgMjkuNTA2NyA5LjkyNzMgMjkuMDk1MiA5LjkyNzNIMjMuMTM1MUMyMi43MjM3IDkuOTI3MyAyMi4zOTAxIDkuNTg1NDEgMjIuMzkwMSA5LjE2MzY2WiIgZmlsbD0iIzExMTExMiIvPgo8cGF0aCBkPSJNMjkuMDY2MyA4LjYxMTM1QzI5LjQ2MTcgOC40OTQ2NCAyOS44NzQ1IDguNzI4NTYgMjkuOTg4NCA5LjEzMzg0TDMxLjYzNzggMTUuMDA0M0MzMS43NTE3IDE1LjQwOTYgMzEuNTIzNCAxNS44MzI4IDMxLjEyOCAxNS45NDk1QzMwLjczMjcgMTYuMDY2MiAzMC4zMTk4IDE1LjgzMjMgMzAuMjA2IDE1LjQyN0wyOC41NTY2IDkuNTU2NDlDMjguNDQyNyA5LjE1MTIyIDI4LjY3MDkgOC43MjgwNyAyOS4wNjYzIDguNjExMzVaIiBmaWxsPSIjMTExMTEyIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNiAyOS43ODE4QzYgMzAuMjAzNiA2LjMzMzU1IDMwLjU0NTUgNi43NDUwMSAzMC41NDU1SDMzLjU2NTRDMzUuMjExMiAzMC41NDU1IDM2LjU0NTUgMjkuMTc3OSAzNi41NDU1IDI3LjQ5MDlWMy4wNTQ1NUMzNi41NDU1IDEuMzY3NTcgMzUuMjExMiAwIDMzLjU2NTQgMEg2Ljc0NTAxQzYuMzMzNTUgMCA2IDAuMzQxODkyIDYgMC43NjM2MzZDNiAxLjE4NTM4IDYuMzMzNTUgMS41MjcyNyA2Ljc0NTAxIDEuNTI3MjdIMzMuNTY1NEMzNC4zODgzIDEuNTI3MjcgMzUuMDU1NCAyLjIxMTA2IDM1LjA1NTQgMy4wNTQ1NVYyNy40OTA5QzM1LjA1NTQgMjguMzM0NCAzNC4zODgzIDI5LjAxODIgMzMuNTY1NCAyOS4wMTgySDYuNzQ1MDFDNi4zMzM1NSAyOS4wMTgyIDYgMjkuMzYwMSA2IDI5Ljc4MThaIiBmaWxsPSIjMTExMTEyIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOC41MDYzNyAyMC4zOTY3QzguMTk3MTMgMjAuMjY5NSA3LjgzNjgxIDIwLjM3NTIgNy42Mjc4MiAyMC42NDEyQzcuMzI2ODcgMjEuMDI0MyA3LjQzMjE0IDIxLjYwNTYgNy44NzY2OSAyMS43OTA3QzkuNjE1NjggMjIuNTE1IDExLjQ4NzQgMjIuOTA5MSAxMy40Mzc0IDIyLjkwOTFDMjAuNjAwMyAyMi45MDkxIDI2LjcwNyAxNy41OTA5IDI5LjA1ODYgMTAuMTI4N0MyOS4yMTA2IDkuNjQ2MzIgMjguODUxNCA5LjE2MzcgMjguMzU2OSA5LjE2MzdDMjguMDIzOSA5LjE2MzcgMjcuNzMyIDkuMzg5NjEgMjcuNjI5IDkuNzE0MTlDMjUuNDM3MiAxNi42MTc3IDE5LjgwNDIgMjEuMzgxOSAxMy40Mzc0IDIxLjM4MTlDMTEuNzIyOSAyMS4zODE5IDEwLjA2MTYgMjEuMDM2NCA4LjUwNjM3IDIwLjM5NjdaIiBmaWxsPSIjMTExMTEyIi8+Cjwvc3ZnPgo=");
}
.std-card p, .std-card b, .std-card ul {
    font-size: 16px;
    line-height: 24px;
}
.std-card ul {
    padding-left: 26px;
}
.clear-footer {
    border: none;
    background: none;
}
.mini-body > a {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #000;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.4px;
    text-decoration: none;
}
.mini-body > a > i {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 45px;
    background: linear-gradient(213.96deg, #E5ECFE 20.12%, #F6EFF3 169.92%);
    border-radius: 6px;
    margin-right: 15px;
}
a.minify-btn {
    cursor: pointer;
    display: inline-block;
    padding-left: 24px;
    font-size: 12px;
    line-height: 30px;
    letter-spacing: -0.2px;
    color: #9DA7B0;    
    background: left center no-repeat;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05Ljg0NTg1IDAuNjU5MTIzQzEwLjE4NTcgMC42NTkxMjMgMTAuNDYxMiAwLjkzNDY0IDEwLjQ2MTIgMS4yNzQ1MVY1LjU4MjJIMTQuNzY4OUMxNS4xMDg4IDUuNTgyMiAxNS4zODQzIDUuODU3NzIgMTUuMzg0MyA2LjE5NzU5QzE1LjM4NDMgNi41Mzc0NSAxNS4xMDg4IDYuODEyOTcgMTQuNzY4OSA2LjgxMjk3SDkuODQ1ODVDOS41MDU5OSA2LjgxMjk3IDkuMjMwNDcgNi41Mzc0NSA5LjIzMDQ3IDYuMTk3NTlWMS4yNzQ1MUM5LjIzMDQ3IDAuOTM0NjQgOS41MDU5OSAwLjY1OTEyMyA5Ljg0NTg1IDAuNjU5MTIzWiIgZmlsbD0iIzExMTExMiIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE1LjgxOTUgMC4xODAyNDJDMTYuMDU5OCAwLjQyMDU2NSAxNi4wNTk4IDAuODEwMjA1IDE1LjgxOTUgMS4wNTA1M0wxMC4yODEgNi41ODg5OUMxMC4wNDA3IDYuODI5MzEgOS42NTEwMyA2LjgyOTMxIDkuNDEwNzEgNi41ODg5OUM5LjE3MDM5IDYuMzQ4NjcgOS4xNzAzOSA1Ljk1OTAzIDkuNDEwNzEgNS43MTg3TDE0Ljk0OTIgMC4xODAyNDJDMTUuMTg5NSAtMC4wNjAwODA3IDE1LjU3OTEgLTAuMDYwMDgwNyAxNS44MTk1IDAuMTgwMjQyWiIgZmlsbD0iIzExMTExMiIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTYuNTg4OTkgOS40MTEwMkM2LjgyOTMxIDkuNjUxMzQgNi44MjkzMSAxMC4wNDEgNi41ODg5OSAxMC4yODEzTDEuMDUwNTMgMTUuODE5OEMwLjgxMDIwNSAxNi4wNjAxIDAuNDIwNTY1IDE2LjA2MDEgMC4xODAyNDIgMTUuODE5OEMtMC4wNjAwODA3IDE1LjU3OTQgLTAuMDYwMDgwNyAxNS4xODk4IDAuMTgwMjQyIDE0Ljk0OTVMNS43MTg3IDkuNDExMDJDNS45NTkwMyA5LjE3MDY5IDYuMzQ4NjcgOS4xNzA2OSA2LjU4ODk5IDkuNDExMDJaIiBmaWxsPSIjMTExMTEyIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMC42NTkxMjMgOS44NDYxNkMwLjY1OTEyMyA5LjUwNjI5IDAuOTM0NjQgOS4yMzA3NyAxLjI3NDUxIDkuMjMwNzdINi4xOTc1OUM2LjUzNzQ1IDkuMjMwNzcgNi44MTI5NyA5LjUwNjI5IDYuODEyOTcgOS44NDYxNlYxNC43NjkyQzYuODEyOTcgMTUuMTA5MSA2LjUzNzQ1IDE1LjM4NDYgNi4xOTc1OSAxNS4zODQ2QzUuODU3NzIgMTUuMzg0NiA1LjU4MjIgMTUuMTA5MSA1LjU4MjIgMTQuNzY5MlYxMC40NjE1SDEuMjc0NTFDMC45MzQ2NCAxMC40NjE1IDAuNjU5MTIzIDEwLjE4NiAwLjY1OTEyMyA5Ljg0NjE2WiIgZmlsbD0iIzExMTExMiIvPgo8L3N2Zz4K");
}
.no-notifications {
    padding-left: 30px;
    margin-bottom: 30px;
}
.std-card ul.notification-list {
    list-style: none;
    min-height: 48px;
    padding: 0 15px;
}
.notification-list li {
    border-radius: 6px;
}
.notification-list li:hover {
    background-color: rgba(70, 123, 227, 0.08);
    cursor: pointer;
}
.notification-list li .link-to-project {
    display: block;
    padding-top: 12px;
    padding-right: 12px;
    padding-left: 15px;
    color: inherit;
}
.notification-list li .link-to-project:hover {
    text-decoration: none;
    color: inherit;
}
.notification-list li:last-child .link-to-project > div {
    border-bottom: none !important;
}
.notification-list li .notification-content {
    display: flex;
    flex-direction: column;
}
iframe.modal-video {
    width: 100%;
    height: 620px;
}
@media (max-width: 575px) {
    iframe.modal-video {
        height: 60vh;
    }
}
.alert {
    font-size: 16px;
    line-height: 24px;
    position: relative;
}

@media (max-width: 575px) {
    .card-body {
        padding: 14px 13px 17px 13px !important;
    }

    h1 {
        font-weight: 500;
        font-size: 22px;
        line-height: 30px;
        letter-spacing: -0.4px;
        margin-bottom: 12px;
    }
    h2.start-title {
        font-weight: 500;
        font-size: 20px;
        padding: 23px 35px 6px 16px !important;
        margin: 0x;
    }

    .video-card .video-thumbnail {
        height: 143px;
        border: 1px solid #828282;
        border-radius: 6px;
        margin-bottom: 13px;
    }

    .video-card {
        padding: 14px 13px 14px 13px !important;
    }

    .video-card .card-body {
        padding: 0 !important;
    }

    h2.video-title {
        padding: 0 !important;
        font-weight: 500;
        font-size: 20px;
        line-height: 26px;
        letter-spacing: -0.2px;
        margin-right: 50px;
        margin-bottom: 15px;
    }

    h2.video-title + p {
        font-size: 16px;
        line-height: 20px;
        letter-spacing: -0.2px;
    }

    .no-notifications {
        padding-left: 16px;
        margin-bottom: 18px;
        line-height: 22px;
    }

    .mini-body > a > i {
        min-width: 50px;
        margin-right: 13px;
    }
    .mini-body > a {
        font-weight: 500;
        margin-right: 41px;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: -0.4px;
    }

     .alert {
        padding: 10px 11px 10px 43px;
        font-size: 13px;
        line-height: 112%;
        letter-spacing: -0.2px;
        margin-bottom: 0;
    }
    .alert-icon {
        position: absolute;
        top: 17px;
        left: 12px;
    }

    .std-card.dashboard .title {
        padding: 20px 17px 0px 17px;
        margin-bottom: 30px;
    }
    .std-card.dashboard .title h3 {
        font-size: 18px;
        line-height: 18px;
        letter-spacing: -0.2px;
    }
    .std-card.dashboard .title p {
        font-size: 14px;
        line-height: 18px;
        letter-spacing: -0.2px;
        margin: 0;
    }

    .std-card.dashboard .mini-card {
        
    }
    .std-card.dashboard .title {
        padding-left: 17px;
        padding-top: 5px;
        margin-bottom: 20px;
    }
    .std-card.dashboard .mini-card > div {
        padding: 18px 9px 15px 12px;
    }
    .std-card.dashboard .mini-card.requests {
        padding-right: 5px;
    }
    .std-card.dashboard .mini-card.projects {
        padding-left: 5px;
    }
    .std-card.dashboard .mini-card.requests > div::before,
    .std-card.dashboard .mini-card.projects > div::before {
        left: 12px;
    }
    .std-card.dashboard .mini-card > div > h3 {
        font-size: 18px;
    }
    .std-card.dashboard .mini-card > div > p {
        height: 32px;
        font-size: 14px;
        line-height: 18px;
        margin-bottom: 45px;
    }
    .std-card.dashboard .mini-card > div > strong {
        padding-left: 50px;
        font-size: 32px;
        position: relative;
        top: -7px;
    }
}

</style>
