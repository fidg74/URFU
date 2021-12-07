<template>
    <b-container fluid="sm">
        <b-card class="mb-4 std-card">
            <h1>Практика</h1>
            <b-alert show variant="primary">
                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8.79102" r="8" fill="#467BE3"/>
                    <path d="M8 4.43121V9.26151" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M8 12.4213V8.06738" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.01 4.5"/>
                </svg>
                Идет подача заявок на осенний семестр 2021/22 учебного года. Срок подачи до 21 августа 2021 г.
            </b-alert>
            <div class="agreement-document">
                <div class="title">
                    Договор № 243-ЛКП-2021
                    <b-badge variant="success">Активный</b-badge>
                </div>
                <div class="timeline">
                    Срок действия
                    <span class="dates">С 14.05.2021 по 13.05.2022</span>
                </div>
            </div>
        </b-card>
        <b-card class="std-card mb-4 dashboard">
            <b-row>
                <b-col sm class="title">
                    <h3>Текущий период</h3>
                    <p>весенний семестр</p>
                </b-col>
                <b-col sm class="mini-card members">
                    <div>
                        <h3>Места</h3>
                        <p>количество в заявке</p>
                        <strong>235</strong>
                    </div>
                </b-col>
                <b-col sm class="mini-card students">
                    <div>
                        <h3>Студенты</h3>
                        <p>в реализуемых проектах</p>
                        <strong>78</strong>
                    </div>
                </b-col>
                <b-col sm class="mini-card members-free">
                    <div>
                        <h3>Места</h3>
                        <p>количество вакантных</p>
                        <strong>157</strong>
                    </div>
                </b-col>
            </b-row>
        </b-card>
        <b-row>
            <b-col sm>
                <b-card class="std-card mb-4 contacts">
                    <h3>Контакты</h3>
                    <div class="person">
                        <span class="name">Нечепуренко Елена Михайловна</span>
                        <span class="title">заведующий практикой</span>
                    </div>
                    <div class="contacts">
                        <span class="phone">+7 (343) 375-48-32</span>
                        <span class="email"><a href="mailto:e.m.nechepurenko@urfu.ru">e.m.nechepurenko@urfu.ru</a></span>
                    </div>
                </b-card>
            </b-col>
            <b-col sm class="mb-4">
                <b-card class="std-card mb-4">
                    <div class="mini-body">
                        <a href="#" @click.prevent>
                            <i>
                                <svg width="17" height="27" viewBox="0 0 17 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.73193 19.1989L11.7181 18.5371L13.3725 23.5026L12.0481 26.1505L9.73193 19.1989ZM16.0218 14.8966L4.10473 18.8671C3.06975 15.7607 2.62543 14.1257 3.55833 11.0213C3.84645 10.0614 4.03687 9.4275 3.68184 8.36192C2.89701 6.00631 1.34437 7.27056 0.134691 3.63983L10.0656 0.331077C11.262 3.92209 9.28323 3.90725 10.0591 6.23604C10.4142 7.30163 10.9467 7.69462 11.7533 8.29089C14.3647 10.2178 14.9888 11.7961 16.0218 14.8966ZM5.46094 16.2085L13.3421 13.5827C11.5982 9.33555 9.23466 10.3812 8.07428 6.89846C7.54223 5.30488 7.81379 4.39132 8.22773 3.15007L3.29605 4.7932C4.37174 5.53813 5.13664 6.10526 5.66769 7.69917C6.82145 11.1621 4.31327 11.7804 5.46094 16.2085Z" fill="#111112"/>
                                </svg>
                            </i>
                            Инструкция по работе в сервисе
                        </a>
                    </div>
                </b-card>
                <b-card
                    class="video-card std-card"
                    no-body
                    :class="{'minified': videoCardMinified}"
                >
                    <div class="video-thumbnail" @click="showVideo">
                        <b-card-img src="/learning/static/img/video-thumbnail-2.jpg" top></b-card-img>
                    </div>
                    <b-card-body class="maxi-body">
                        <h2>Добро пожаловать в сервис Проектное обучение!</h2>
                        <p>В этом коротком <a href="#" @click.prevent="showVideo">2-минутном видео</a> мы рассказываем об особенностях и задачах данного сервиса</p>
                        <a class="minify-btn" @click.prevent="toggleVideoCard">Свернуть</a>
                    </b-card-body>
                    <b-card-body class="mini-body">
                        <a href="#" @click.prevent="toggleVideoCard">
                            <i>
                                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.92622 16.7378C1.43776 16.7378 1.85244 17.1525 1.85244 17.6641V24.1476H8.33598C8.84752 24.1476 9.2622 24.5623 9.2622 25.0738C9.2622 25.5854 8.84752 26 8.33598 26H0.92622C0.414683 26 1.38018e-08 25.5854 1.38018e-08 25.0738V17.6641C1.38018e-08 17.1525 0.414683 16.7378 0.92622 16.7378Z" fill="#111112"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.91714 16.0171C10.2789 16.3788 10.2789 16.9652 9.91714 17.3269L1.58116 25.6629C1.21945 26.0246 0.632995 26.0246 0.271284 25.6629C-0.0904279 25.3012 -0.0904279 24.7148 0.271284 24.3531L8.60727 16.0171C8.96898 15.6554 9.55543 15.6554 9.91714 16.0171Z" fill="#111112"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M25.6627 0.271284C26.0245 0.632995 26.0245 1.21945 25.6627 1.58116L17.3268 9.91714C16.9651 10.2789 16.3786 10.2789 16.0169 9.91714C15.6552 9.55543 15.6552 8.96898 16.0169 8.60727L24.3529 0.271284C24.7146 -0.0904279 25.301 -0.0904279 25.6627 0.271284Z" fill="#111112"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.7377 0.92622C16.7377 0.414683 17.1523 1.38018e-08 17.6639 1.38018e-08H25.0736C25.5852 1.38018e-08 25.9999 0.414683 25.9999 0.92622V8.33598C25.9999 8.84752 25.5852 9.2622 25.0736 9.2622C24.5621 9.2622 24.1474 8.84752 24.1474 8.33598V1.85244H17.6639C17.1523 1.85244 16.7377 1.43776 16.7377 0.92622Z" fill="#111112"/>
                                </svg>
                            </i>
                            Видео-приветствие
                        </a>
                    </b-card-body>
                </b-card>
            </b-col>
        </b-row>
        <b-modal id="modalReg" title="Подключить сервис">
            <p class="text-secondary">Ваш запрос на подключение сервиса Проектное обучение будет отправлен специалистам.</p>
            <p class="text-secondary">Права на работу в сервисе будут предоставлены <span class="text-dark">в течение 3 (трех) рабочих дней.</span></p>
            <template #modal-footer>
                <b-button variant="primary">Отправить</b-button>
                <b-button variant="secondary" @click="hideReg">Отменить</b-button>
            </template>
        </b-modal>
        <b-modal id="modalVideo" size="xl" hide-footer title="Добро пожаловать!">
            <!-- <vue-core-video-player src="/learning/media/learning-presentation.mp4"></vue-core-video-player> -->
        </b-modal>
    </b-container>
</template>

<script>
export default {
    name: 'PracticeMain',
    data () {
        return {
            videoCardMinified: false,
        }
    },
    methods: {
        showReg () {
            this.$bvModal.show('modalReg');
        },
        hideReg () {
            this.$bvModal.hide('modalReg');
        },
        showVideo () {
            this.$bvModal.show('modalVideo');
        },
        toggleVideoCard () {
            this.videoCardMinified = !this.videoCardMinified;
        },
    },
}
</script>

<style scoped>
.std-card.dashboard .mini-card.members > div::before,
.std-card.dashboard .mini-card.requests > div::before {
    left: 14px;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDYiIHZpZXdCb3g9IjAgMCA0MSA0NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeT0iNCIgd2lkdGg9IjM0LjQ2MTUiIGhlaWdodD0iNDIiIHJ4PSIyIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTEgMTMuMjIyMkMxMSAxMi43OTI3IDExLjM1MjkgMTIuNDQ0NSAxMS43ODgzIDEyLjQ0NDVIMjIuODI0M0MyMy4yNTk3IDEyLjQ0NDUgMjMuNjEyNiAxMi43OTI3IDIzLjYxMjYgMTMuMjIyMkMyMy42MTI2IDEzLjY1MTggMjMuMjU5NyAxNCAyMi44MjQzIDE0SDExLjc4ODNDMTEuMzUyOSAxNCAxMSAxMy42NTE4IDExIDEzLjIyMjJaIiBmaWxsPSIjMTExMTEyIi8+CjxwYXRoIGQ9Ik0xMSAxOS40NDQ0QzExIDE5LjAxNDggMTEuMzUyOSAxOC42NjY2IDExLjc4ODMgMTguNjY2NkgzMS40OTU1QzMxLjkzMDkgMTguNjY2NiAzMi4yODM4IDE5LjAxNDggMzIuMjgzOCAxOS40NDQ0QzMyLjI4MzggMTkuODc0IDMxLjkzMDkgMjAuMjIyMiAzMS40OTU1IDIwLjIyMjJIMTEuNzg4M0MxMS4zNTI5IDIwLjIyMjIgMTEgMTkuODc0IDExIDE5LjQ0NDRaIiBmaWxsPSIjMTExMTEyIi8+CjxwYXRoIGQ9Ik0xMSAyNS42NjY3QzExIDI1LjIzNzEgMTEuMzUyOSAyNC44ODg5IDExLjc4ODMgMjQuODg4OUgzMS40OTU1QzMxLjkzMDkgMjQuODg4OSAzMi4yODM4IDI1LjIzNzEgMzIuMjgzOCAyNS42NjY3QzMyLjI4MzggMjYuMDk2MiAzMS45MzA5IDI2LjQ0NDUgMzEuNDk1NSAyNi40NDQ1SDExLjc4ODNDMTEuMzUyOSAyNi40NDQ1IDExIDI2LjA5NjIgMTEgMjUuNjY2N1oiIGZpbGw9IiMxMTExMTIiLz4KPHBhdGggZD0iTTExIDMxLjg4ODlDMTEgMzEuNDU5MyAxMS4zNTI5IDMxLjExMTEgMTEuNzg4MyAzMS4xMTExSDIzLjYxMjZDMjQuMDQ4IDMxLjExMTEgMjQuNDAwOSAzMS40NTkzIDI0LjQwMDkgMzEuODg4OUMyNC40MDA5IDMyLjMxODQgMjQuMDQ4IDMyLjY2NjYgMjMuNjEyNiAzMi42NjY2SDExLjc4ODNDMTEuMzUyOSAzMi42NjY2IDExIDMyLjMxODQgMTEgMzEuODg4OVoiIGZpbGw9IiMxMTExMTIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMSA0MS4yMjIyQzExIDQxLjY1MTcgMTEuMzUyOSA0MiAxMS43ODgzIDQySDM3LjAxMzVDMzguNzU1IDQyIDQwLjE2NjcgNDAuNjA3MSA0MC4xNjY3IDM4Ljg4ODlWNi4yMjIyQzQwLjE2NjcgNC41MDM5OCAzOC43NTUgMy4xMTEwOCAzNy4wMTM1IDMuMTExMDhIMTEuNzg4M0MxMS4zNTI5IDMuMTExMDggMTEgMy40NTkzMSAxMSAzLjg4ODg2QzExIDQuMzE4NDIgMTEuMzUyOSA0LjY2NjY0IDExLjc4ODMgNC42NjY2NEgzNy4wMTM1QzM3Ljg4NDIgNC42NjY2NCAzOC41OTAxIDUuMzYzMDkgMzguNTkwMSA2LjIyMjJWMzguODg4OUMzOC41OTAxIDM5Ljc0OCAzNy44ODQyIDQwLjQ0NDQgMzcuMDEzNSA0MC40NDQ0SDExLjc4ODNDMTEuMzUyOSA0MC40NDQ0IDExIDQwLjc5MjYgMTEgNDEuMjIyMloiIGZpbGw9IiMxMTExMTIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMSAzLjg4ODg5QzExIDQuMzE4NDQgMTEuMzkyNiA0LjY2NjY3IDExLjg3NjkgNC42NjY2N0gzMS4xNjkzQzMyLjYyMjIgNC42NjY2NyAzMy44MDAxIDMuNjIyIDMzLjgwMDEgMi4zMzMzM0MzMy44MDAxIDEuMDQ0NjcgMzIuNjIyMiAwIDMxLjE2OTMgMEgxMS44NzY5QzExLjM5MjYgMCAxMSAwLjM0ODIyMyAxMSAwLjc3Nzc3OEMxMSAxLjIwNzMzIDExLjM5MjYgMS41NTU1NiAxMS44NzY5IDEuNTU1NTZIMzEuMTY5M0MzMS42NTM2IDEuNTU1NTYgMzIuMDQ2MiAxLjkwMzc4IDMyLjA0NjIgMi4zMzMzM0MzMi4wNDYyIDIuNzYyODkgMzEuNjUzNiAzLjExMTExIDMxLjE2OTMgMy4xMTExMUgxMS44NzY5QzExLjM5MjYgMy4xMTExMSAxMSAzLjQ1OTMzIDExIDMuODg4ODlaIiBmaWxsPSIjMTExMTEyIi8+Cjwvc3ZnPgo=");
}
.std-card.dashboard .mini-card.members-free > div {
    background: linear-gradient(86.51deg, #F0F3FF -43.31%, #F3F1FD 45.2%, #F7EEEF 97.13%);
}
.std-card.dashboard .mini-card.members-free > div::before {
    left: 14px;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDQiIGhlaWdodD0iNDYiIHZpZXdCb3g9IjAgMCA0NCA0NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeT0iNCIgd2lkdGg9IjM0LjQ2MTUiIGhlaWdodD0iNDIiIHJ4PSIyIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTEgMTEuNjY2NUMxMSAxMS4yMzY5IDExLjM1MyAxMC44ODg3IDExLjc4ODQgMTAuODg4N0gyMi44MjU1QzIzLjI2MDkgMTAuODg4NyAyMy42MTM4IDExLjIzNjkgMjMuNjEzOCAxMS42NjY1QzIzLjYxMzggMTIuMDk2IDIzLjI2MDkgMTIuNDQ0MiAyMi44MjU1IDEyLjQ0NDJIMTEuNzg4NEMxMS4zNTMgMTIuNDQ0MiAxMSAxMi4wOTYgMTEgMTEuNjY2NVoiIGZpbGw9IiMxMTExMTIiLz4KPHBhdGggZD0iTTExIDE2LjMzMzRDMTEgMTUuOTAzOSAxMS4zNTMgMTUuNTU1NyAxMS43ODg0IDE1LjU1NTdIMzEuNDk3NUMzMS45MzI5IDE1LjU1NTcgMzIuMjg1OCAxNS45MDM5IDMyLjI4NTggMTYuMzMzNEMzMi4yODU4IDE2Ljc2MyAzMS45MzI5IDE3LjExMTIgMzEuNDk3NSAxNy4xMTEySDExLjc4ODRDMTEuMzUzIDE3LjExMTIgMTEgMTYuNzYzIDExIDE2LjMzMzRaIiBmaWxsPSIjMTExMTEyIi8+CjxwYXRoIGQ9Ik0xMSAyMS4wMDA0QzExIDIwLjU3MDkgMTEuMzUzIDIwLjIyMjcgMTEuNzg4NCAyMC4yMjI3SDI1Ljk3ODlDMjYuNDE0MyAyMC4yMjI3IDI2Ljc2NzMgMjAuNTcwOSAyNi43NjczIDIxLjAwMDRDMjYuNzY3MyAyMS40MyAyNi40MTQzIDIxLjc3ODIgMjUuOTc4OSAyMS43NzgySDExLjc4ODRDMTEuMzUzIDIxLjc3ODIgMTEgMjEuNDMgMTEgMjEuMDAwNFoiIGZpbGw9IiMxMTExMTIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS43ODg0IDQyQzExLjM1MyA0MiAxMSA0MS42NTE4IDExIDQxLjIyMjJDMTEgNDAuNzkyNyAxMS4zNTMgNDAuNDQ0NCAxMS43ODg0IDQwLjQ0NDRIMzcuMDE2QzM3Ljg4NjggNDAuNDQ0NCAzOC41OTI4IDM5Ljc0OCAzOC41OTI4IDM4Ljg4ODlWMzYuODk3OEMzOC41OTI4IDM2LjQ2ODIgMzguOTQ1NyAzNi4xMiAzOS4zODExIDM2LjEyQzM5LjgxNjUgMzYuMTIgNDAuMTY5NSAzNi40NjgyIDQwLjE2OTUgMzYuODk3OFYzOC44ODg5QzQwLjE2OTUgNDAuNjA3MSAzOC43NTc2IDQyIDM3LjAxNiA0MkgxMS43ODg0Wk0zOS4zODExIDIwLjE2QzM5LjgxNjUgMjAuMTYgNDAuMTY5NSAxOS44MTE4IDQwLjE2OTUgMTkuMzgyMlYzLjExMTExQzQwLjE2OTUgMS4zOTI4OSAzOC43NTc2IDAgMzcuMDE2IDBIMTEuNzg4NEMxMS4zNTMgMCAxMSAwLjM0ODIyMyAxMSAwLjc3Nzc3OEMxMSAxLjIwNzMzIDExLjM1MyAxLjU1NTU2IDExLjc4ODQgMS41NTU1NkgzNy4wMTZDMzcuODg2OCAxLjU1NTU2IDM4LjU5MjggMi4yNTIgMzguNTkyOCAzLjExMTExVjE5LjM4MjJDMzguNTkyOCAxOS44MTE4IDM4Ljk0NTcgMjAuMTYgMzkuMzgxMSAyMC4xNloiIGZpbGw9IiMxMTExMTIiLz4KPHBhdGggZD0iTTM1LjA4NzIgMjkuNzE5N0MzNC42NDk4IDI5LjcxOTcgMzQuMjgzMSAyOS4zNjI3IDM0LjM0ODIgMjguOTMwMkMzNC4zODYyIDI4LjY3NzIgMzQuNDQ0OCAyOC40NTczIDM0LjUyMzkgMjguMjcwNUMzNC42NzYzIDI3LjkxMDUgMzQuOTc2NiAyNy41MTYzIDM1LjQyNDcgMjcuMDg3OUMzNS44Nzc0IDI2LjY1NDkgMzYuMTYzOCAyNi4zNDczIDM2LjI4MzkgMjYuMTY1QzM2LjQ2ODYgMjUuODg3IDM2LjU2MSAyNS41ODYzIDM2LjU2MSAyNS4yNjI3QzM2LjU2MSAyNC44MzQzIDM2LjQ1MjUgMjQuNTA4NSAzNi4yMzU0IDI0LjI4NTJDMzYuMDIyOSAyNC4wNTczIDM1LjcwODcgMjMuOTQzNCAzNS4yOTMgMjMuOTQzNEMzNC44OTU3IDIzLjk0MzQgMzQuNTc0NyAyNC4wNTUgMzQuMzI5OSAyNC4yNzgzQzM0LjI5MDMgMjQuMzE0NCAzNC4yNTM5IDI0LjM1MjcgMzQuMjIwOCAyNC4zOTMxQzMzLjkyOCAyNC43NTA4IDMzLjU5NDggMjUuMTczOCAzMy4xMzI1IDI1LjE3MzhDMzIuNjY2NSAyNS4xNzM4IDMyLjI3MTUgMjQuNzg0NCAzMi40MDg4IDI0LjMzOUMzMi41NCAyMy45MTMzIDMyLjc3NjIgMjMuNTUzNSAzMy4xMTczIDIzLjI1OThDMzMuNjY3IDIyLjc5MDQgMzQuMzkyMiAyMi41NTU3IDM1LjI5MyAyMi41NTU3QzM2LjIyMTUgMjIuNTU1NyAzNi45NDQ0IDIyLjc4ODEgMzcuNDYxOCAyMy4yNTI5QzM3Ljk4MzggMjMuNzE3OCAzOC4yNDQ4IDI0LjM2NzIgMzguMjQ0OCAyNS4yMDEyQzM4LjI0NDggMjUuOTQ0IDM3Ljg5MzcgMjYuNjc1NSAzNy4xOTE2IDI3LjM5NTVMMzYuMzM5MyAyOC4yMjI3QzM2LjE2ODEgMjguNDE0NSAzNi4wNDM2IDI4LjY1NTkgMzUuOTY1NiAyOC45NDY5QzM1Ljg1MzUgMjkuMzY1MiAzNS41MjAzIDI5LjcxOTcgMzUuMDg3MiAyOS43MTk3Wk0zNC4xNzc0IDMxLjg0NTdDMzQuMTc3NCAzMS41NzY4IDM0LjI2MjkgMzEuMzYwMyAzNC40MzM4IDMxLjE5NjNDMzQuNjA0NyAzMS4wMjc3IDM0LjgzNTcgMzAuOTQzNCAzNS4xMjY3IDMwLjk0MzRDMzUuNDIyMyAzMC45NDM0IDM1LjY1NTYgMzEuMDI5OSAzNS44MjY1IDMxLjIwMzFDMzUuOTk3NSAzMS4zNzE3IDM2LjA4MjkgMzEuNTg1OSAzNi4wODI5IDMxLjg0NTdDMzYuMDgyOSAzMi4wOTY0IDM1Ljk5OTggMzIuMzA2IDM1LjgzMzUgMzIuNDc0NkMzNS42NjcyIDMyLjY0MzIgMzUuNDMxNiAzMi43Mjc1IDM1LjEyNjcgMzIuNzI3NUMzNC44MjE4IDMyLjcyNzUgMzQuNTg2MyAzMi42NDMyIDM0LjQyIDMyLjQ3NDZDMzQuMjU4MyAzMi4zMDYgMzQuMTc3NCAzMi4wOTY0IDM0LjE3NzQgMzEuODQ1N1oiIGZpbGw9IiMxMTExMTIiLz4KPC9zdmc+Cg==");
}
a.minify-btn {
    font-size: 14px;
}
.agreement-document {
    border: 1px solid rgba(114, 128, 142, 0.3);
    box-sizing: border-box;
    border-radius: 6px;
    padding: 25px 25px;
}
.agreement-document > .title {
    font-weight: 500;
    font-size: 22px;
    line-height: 22px;
    letter-spacing: -0.2px;
    color: #111;
    margin-bottom: 14px;
}
.agreement-document > .title > .badge {
    float: right;
}
.agreement-document > .timeline {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.2px;
    color: #72808E;
}
.agreement-document > .timeline > .dates {
    margin-top: 6px;
    display: block;
    font-weight: normal;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.2px;
    color: #111;
}
.std-card.contacts > .card-body > h3 {
    margin-bottom: 22px;
    font-style: normal;
    font-weight: 500;
    font-size: 22px;
    line-height: 18px;
    letter-spacing: -0.2px;
    color: #111;
}
.std-card.contacts > .card-body > .person {
    margin-bottom: 16px;
    display: block;
}
.std-card.contacts > .card-body > .person > .name {
    display: block;
}
.std-card.contacts > .card-body > .person > .title {
    display: block;
    color: #72808E;
}
.std-card.contacts > .card-body > .contacts {
}
.std-card.contacts > .card-body > .contacts > .phone {
    display: block;
}
.std-card.contacts > .card-body > .contacts > .email {
    display: block;
}
@media (max-width: 575px) {
}
</style>
