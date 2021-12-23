<template>
    <div
        class="comment"
        :class="{comment_open: isOpen}"
        v-click-outside="hide"
    >
        <div v-if="canComment || commentsByField(field).length > 0"
            :class="{
                comment__icon: true,
                comment__icon_empty: (project.comments && commentsByField(field).length === 0),
                comment__unread: !commentsReadByField(field) &&  commentsByField(field).length > 0}"
            @click="isOpen = !isOpen"
            v-b-tooltip.hover
            :title="(project.comments && commentsByField(field).length === 0) ?
                'Добавить комментарий' :
                'Смотреть комментарии'"
        >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.9059 15.1619C14.6109 14.7284 14.4117 14.2906 14.3257 13.8073C14.1859 13.0221 14.3596 12.199 14.7312 11.1975C14.7359 11.1848 14.7412 11.1723 14.7469 11.16L15.1443 10.3085C15.496 9.50174 15.5 8.85489 15.5 8C15.5 3.87614 12.1239 0.5 8 0.5C3.87614 0.5 0.5 3.87614 0.5 8C0.5 12.1239 3.87614 15.5 8 15.5C9.20924 15.5 10.3836 15.1816 11.4289 14.6943L11.9695 14.4134C12.1258 14.3322 12.3134 14.3393 12.4632 14.432L14.9059 15.1619ZM14.9059 15.1619C14.334 15.1146 13.8305 14.9903 13.4286 14.8556C13.118 14.7515 12.8711 14.6423 12.7041 14.5604C12.6207 14.5195 12.5575 14.4856 12.5166 14.4628C12.4962 14.4514 12.4814 14.4428 12.4724 14.4375L12.4634 14.4322L14.9059 15.1619Z" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="comment__sum" v-if="commentsByField(field).length > 0">{{ commentsByField(field).length }}</span>
            <span class="comment__sum" v-else>...</span>
        </div>
        <div
            class="popup"
            v-if="field && isOpen">
            <div class="comment__header">
                <h2>Комментарии</h2>
            </div>
            <div ref="comment__body" class="comment__body" v-if="project.comments && commentsByField(field).length">
                <div
                    class="comment__msg"
                    v-for="msg of commentsByField(field)"
                    :key="msg.id"
                >
                    <Person v-if="msg.user" noemail :user="msg.user">
                        <template #caption>
                            {{ formatDateTime(msg.date) }}
                            <i
                                class="form-eye ml-2"
                                v-b-tooltip
                                title="Не видно заказчику"
                                v-if="!hidden && msg.hidden"
                            />
                        </template>
                    </Person>
                    <div class="comment__text" v-html="msg.text" :class="{'hidden': msg.hidden}" />
                </div>
            </div>
            <div class="comment__footer" v-if="canComment">
                <div class="comment-wrapper">
                    <textarea
                        class="comment__textarea"
                        v-model="newMsg"
                        :placeholder="(project.comments && commentsByField(field).length === 0) ? 'Напишите первый комментарий' : 'Напишите комментарий'"
                    />
                    <b-form-checkbox 
                        switch
                        v-model="showMsg"
                        class="show-to-partner"
                        v-if="showHideButton"
                    >Показывать заказчику</b-form-checkbox>
                </div>
                <div class="buttons">
                    <b-button variant="primary" :disabled="!(newMsg && newMsg.length)" @click="saveComment">Добавить</b-button>
                    <b-button @click="hide">Закрыть</b-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { userFullName, escapeHtml } from '@/utils';
import { mapState, mapGetters } from 'vuex';
import format from 'date-fns/format';
import Person from '@/components/Person';

export default {
    name: 'Comment',
    components: {
        Person,
    },
    props: {
        field: String, // field_name
        hidden: Boolean, // для комментариев скрытых от заказчика полей
    },
    data () {
        return {
            newMsg: null,
            isOpen: false,
            showMsg: false,
        }
    },
    methods: {
        userFullName,
        formatDateTime: date => format(date, 'DD.MM.YYYY HH:mm'),
        saveComment () {
            if (this.newMsg && this.newMsg.length) {
                this.$store.dispatch('project/SAVE_comment', { 
                    text: escapeHtml(this.newMsg),
                    project: this.project.id,
                    field_name: this.field,
                    hidden: !this.showMsg && this.user.isStaff,
                }).then(data => {
                    if (data.status == 200) {
                        this.newMsg = null;
                        this.showMsg = false;
                        this.toBottom();
                        this.$store.dispatch('project/FETCH_project', { 
                            id: this.$route.params.id,
                            project: data.data.project,
                        });
                    }
                });
            }
        },
        hide () {
            this.isOpen = false;
        },
        toBottom () {
            if (this.$refs['comment__body']) {
                this.$refs['comment__body'].scrollTop =
                    this.$refs['comment__body'] && this.$refs['comment__body'].scrollHeight ?
                    this.$refs['comment__body'].scrollHeight : 0;
            }
        },
        commentsByField (field) {
            return this.project.comments.filter(comment => comment.field_name === field);
        },
        commentsReadByField (field) {
            return this.project.read_marks.indexOf(field) > -1;
        },
    },
    computed: {
        ...mapState({
            user: state => state.user,
            project: state => state.project.project,
            learning_src: state => state.api.learning_src,
        }),
        ...mapGetters('project', [
            'meIsPartner',
            'canComment',
        ]),
        showHideButton () {
            return !this.hidden && this.user.isStaff;
        },
    },
    watch: {
        isOpen (newVal) {
            if (newVal) {
                this.toBottom();
                this.$axios.post(this.learning_src + 'comment/mark_read/', {
                    project: this.project.id,
                    field_name: this.field,
                }).then(data => {
                    if (data.status == 200) {
                        this.$store.dispatch('project/FETCH_project', {
                            id: this.$route.params.id,
                            project: data.data.project,
                        });
                    }
                });
            }
            this.newMsg = null;
        }
    }
}
</script>
<style>
.comment {
    position: relative;
    display: inline-block;
    line-height: 18px;
    vertical-align: middle;
}
.comment > .popup {
    width: 360px;
    position: absolute;
    right: 0;
    top: 1.5rem;
    text-align: left;
    box-shadow: 0px 8px 24px rgba(0,0,0,0.18);
    background: #fff;
    z-index: 100;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    color: #212529;
    line-height: 20px;
    font-size: 1rem;
    max-height: 0;
    min-height: 0;
    opacity: 0;
    overflow: hidden;
    transform: translateX(10px);
    transition: transform 0.2s, opacity 0.25s, max-height 0.15s;
}
.comment > .comment__icon > .comment__sum {
    position: absolute;
    left: 1px;
    right: 0;
    top: 0px;
    text-align: center;
    color: #fff;
    font-size: 10px;
    line-height: 15px;
}
.comment > .comment__icon {
    margin-left: 20px;
    position: relative;
    cursor: pointer;
    line-height: 0;
    height: 16px;
}
.comment > .comment__icon > svg {
    fill: #467be3;
    stroke: #467be3;
}
.comment > .comment__icon.comment__unread svg {
    fill: #F5222D;
    stroke: #F5222D;
}
.comment > .comment__icon.comment__icon_empty > svg {
    fill: none;
    stroke: #9da7b0;
}
.comment > .comment__icon.comment__icon_empty:hover > svg {
    stroke: #467be3;
}
.comment > .comment__icon.comment__icon_empty .comment__sum {
    color: #9da7b0;
}
.comment.comment_open > .comment__icon > svg {
    fill: none;
}
.comment.comment_open > .comment__icon > .comment__sum {
    color: #467be3;
}
.comment.comment_open > .popup {
    opacity: 1;
    max-height: 653px;
    transform: translateX(0px);
    border-radius: 6px 0 6px 6px;
}
.comment.comment_open > .popup > .comment__header {
    padding: 20px 20px 10px 20px;
    border-bottom: 1px solid rgba(0,0,0,0.1);
}
.comment.comment_open > .popup > .comment__body {
    padding: 20px;
    max-height: 380px;
    overflow-y: auto;
}
.comment.comment_open > .popup > .comment__footer {
    border-top: 1px solid rgba(0,0,0,0.1);
    padding: 20px;
}
.comment.comment_open > .popup > .comment__body > .comment__msg + .comment__msg {
    margin-top: 32px;
}
.comment > .popup > .comment__body > .comment__msg > .comment__text {
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.2px;
    color: #111;
    white-space: break-spaces;
    word-break: break-word;
    margin-top: 8px;
    background: rgba(70, 123, 227, 0.08);
    border-radius: 6px;
    padding: 10px 20px;
}
.comment.comment_open > .popup > .comment__footer > .comment-wrapper {
    background: #F8F9F9;
    border-radius: 6px;
    padding: 10px 0 6px 20px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    box-sizing: border-box;
    height: 128px;
}
.comment.comment_open > .popup > .comment__footer > .comment-wrapper > .comment__textarea {
    border: none;
    outline: none;
    width: auto;
    resize: none;
    padding: 0;
    background: #F8F9F9;
    flex: 1 1 auto;
}
.comment.comment_open > .popup > .comment__footer > .comment-wrapper > .custom-control {
    flex: 0 0 auto;
}
.comment.comment_open > .popup > .comment__footer > .comment-wrapper > .custom-control > .custom-control-label {
    color: #9DA7B0;
}
.comment.comment_open > .popup > .comment__footer > .buttons {
    margin-top: 12px;
}

@media(max-width: 576px){
    .comment > .popup {
    width: 320px;
    position: absolute;
    right: -710%;
    top: 1.5rem;
    text-align: left;
    box-shadow: 0px 8px 24px rgba(0,0,0,0.18);
    background: #fff;
    z-index: 100;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    color: #212529;
    line-height: 20px;
    font-size: 1rem;
    max-height: 0;
    min-height: 0;
    opacity: 0;
    overflow: hidden;
    transform: translateX(10px);
    transition: transform 0.2s, opacity 0.25s, max-height 0.15s;
    }
}
</style>