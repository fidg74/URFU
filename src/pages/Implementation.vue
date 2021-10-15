<template>
    <b-container>
        <b-button variant="primary" class="btn_flat mb-3" to="/implementations">
            <i class="fas fa-arrow-left" />
            <span>Все проекты</span>
        </b-button>

        <template v-if="project">
            <h1>{{ project.name }}</h1>
            <div class="h1__description">
                Паспорт №{{ project.uid }} от {{ formatDate(project.passport_date) }} <br>
                на основании заявки №{{ project.uid }} от {{ formatDate(project.date) }}
            </div>
            <div class="mt-4">
                <div class="ui-tabs">
                    <label class="ui-tabs__item">
                        <div class="ui-tabs__label" @click="$router.push(`/requests/${ $route.params.id }`)">Заявка на проект</div>
                    </label>
                    <label class="ui-tabs__item">
                        <div class="ui-tabs__label" @click="$router.push(`/passport/${ $route.params.id }`)">Паспорт проекта</div>
                    </label>
                    <label class="ui-tabs__item active">
                        <div class="ui-tabs__label">Реализация проекта</div>
                    </label>
                </div>
            </div>

            <b-row class="mt-4" v-if="copies">
                <b-col cols="9">
                    <div v-for="copy in copies" :key="copy.instance_number" v-show="copy.instance_number === currentCopy">
                        <b-card class="card_content mt-0">
                            <h2 class="mb-0">Команда {{copy.instance_number}}</h2>
                            <div>
                                <PersonCrutch :user="copy.team_head" class="copy__role" v-if="copy.team_head">
                                    <template #caption>Руководитель команды</template>
                                </PersonCrutch>
                                <PersonCrutch :user="copy.curator" class="copy__role" v-if="copy.curator">
                                    <template #caption>Куратор</template>
                                </PersonCrutch>
            
                                <template v-for="role in copy.members">
                                    <PersonCrutch :user="role" :key="role.id" class="copy__role" v-if="teamsVisible">
                                        <b-badge variant="primary">Группа: {{ role.group_name }}</b-badge>
                                        <template #caption>{{ role.competency_role }}</template>
                                    </PersonCrutch>
                                </template>
                            </div>
                            <template v-if="copy.members && copy.members.length">
                                <hr class="hr_full mt-0">
                                <b-button class="btn_flat mt-2" style="margin-bottom: -0.5rem" @click="teamsVisible = !teamsVisible">{{ teamsVisible ? 'Свернуть список участников' : `Еще ${ copy.members.length } ${ declOfNum(copy.members.length, ['участник', 'участника', 'участников']) }` }}</b-button>
                            </template>
                        </b-card>

                        <b-card
                            class="card_content mt-4"
                            v-for="(iteration, index) in copy.iterations"
                            :key="iteration.id"
                            :class="{ 'iteration_show': iteration.visible, 'iteration_end': iteration.finished }">
                            <div>
                                <b-button v-if="((iteration.tasks && iteration.tasks.length) || (iteration.documents && iteration.documents.length)) && iteration.finished" class="btn_flat iteration__btn" @click="openIteration(iteration)">
                                    <h2 class="p-0 m-0">
                                        Итерация №{{ index + 1 }} &nbsp;&nbsp;{{ formatDate(iteration.date_begin) }} - {{ formatDate(iteration.date_end) }}
                                    </h2>
                                </b-button>
                                <h2 v-else style="display: inline-block;" class="p-0 m-0">
                                    Итерация №{{ index + 1 }} &nbsp;&nbsp;{{ formatDate(iteration.date_begin) }} - {{ formatDate(iteration.date_end) }}
                                </h2>
                                <b-badge v-if="!iteration.finished && iteration.started" class="fl-right" variant="success">В работе</b-badge>
                                <div class="iteration__status iteration__status_end" v-if="iteration.finished">
                                    Завершена {{ formatDate(iteration.date_end) }}
                                </div>
                            </div>

                            <div class="iteration__content iteration__content_common">
                                <h3 class="mb-2">{{ iteration.title }}</h3>
                                <div>{{ iteration.description }}</div>
                            </div>
                            <b-button v-if="!iteration.finished && ((iteration.tasks && iteration.tasks.length) || (iteration.documents && iteration.documents.length))" class="btn_flat iteration__btn mt-2" @click="openIteration(iteration)">
                                {{ iteration.visible ? 'Скрыть подробности' : 'Подробнее об итерации' }}
                            </b-button>
              
                            <div class="iteration__content">                
                                <!-- <h4 class="mt-4 mb-2">Планируемый результат</h4>
                                <div>{{ iteration.result }}</div> -->

                                <h4 class="mt-4">Задачи</h4>
                                <b-row v-for="task in iteration.tasks" :key="task.id" class="mb-2 iteration__task">
                                    <b-col cols="9">{{ task.title }}</b-col>
                                    <b-col class="text-right">
                                        <b>{{ task.end_date ? formatDate(task.end_date) : 'дата завершения не указана' }}</b>
                                    </b-col>
                                </b-row>

                                <div class="iteration__files" v-if="iteration.documents && iteration.documents.length">
                                    <h3>Результаты итерации</h3>
                                    <div v-if="iteration.filesLvl !== 'iteration_' + iteration.id">
                                        <b-button class="btn_flat iteration__folder-back" @click="backToFolder(iteration)">
                                            <svg viewBox="0 0 448 512">
                                                <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
                                            </svg>
                                            <span>{{ folderName(iteration) }}</span>
                                        </b-button>
                                    </div>
                                    <template v-for="file in iterationCurrentfiles(copy, iteration)">
                                        <FileDownload v-if="!file.is_dir" :file="file" :key="file.id" class="mt-4 iteration__file">
                                            <a v-if="file.link" class="btn btn-secondary" :href="file.link" target="_blank">Открыть</a>
                                            <b-button v-else @click="downloadFile(copy, file)">Скачать</b-button>
                                        </FileDownload>
                                        <div v-else :key="file.id" class="iteration__folder" @click="iteration.filesLvl = file.id">
                                            <svg viewBox="0 0 512 512" class="iteration__folder-icon">
                                                <path fill="currentColor" d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z" />
                                            </svg>
                                            <div class="iteration__folder-name">
                                                {{ file.title }}
                                            </div>
                                        </div>
                                    </template>
                                </div>
                
                                <template v-if="iteration.team_comment && iteration.team_comment.length">
                                    <h3 class="mt-4 mb-4">Комментарии команды</h3>                  
                                    <Message :message="{text: `${iteration.published_by ? iteration.published_by.fullname : ''} (${iteration.published_by_role}): ${iteration.team_comment}`, date: iteration.published }" />
                                </template>                

                                <template v-if="iteration.comments && iteration.comments.length">
                                    <h3 class="mt-4 mb-4">Комментарии</h3>
                                    <Message v-for="comment in iteration.comments" :message="comment" :key="comment.id" />
                                </template>

                                <template v-if="project.impl_avail_actions && project.impl_avail_actions.length">
                                    <div v-if="!iteration.newComment.add" class="iteration__comment-add">
                                        <b-button variant="primary" @click="iteration.newComment.add = true">
                                            <i class="icon-plus" />
                                            <span>Добавить комментарий</span>
                                        </b-button>
                                    </div>
                                    <div v-else class="iteration__comment-add">
                                        <b-form-group label="Комментарий">
                                            <b-form-textarea
                                                v-model="iteration.newComment.text"
                                                type="text"
                                                autocomplete="off"
                                                placeholder="Оставьте отзыв для команды по результатам итерации"
                                                rows="4" />
                                        </b-form-group>
                                        <b-button variant="primary" @click="saveComment(iteration)">
                                            Сохранить
                                        </b-button>
                                        <b-button variant="secondary" @click="iteration.newComment.add = false; iteration.newComment.text = null">
                                            Отменить
                                        </b-button>
                                    </div>
                                </template>
                            </div>
                        </b-card>

                        <b-card class="card_content mt-4 iteration_show" v-if="copy.summary_documents && copy.summary_documents.length">
                            <h2 class="p-0 m-0">Итоговые результаты проекта</h2>
                 
                            <div class="iteration__content">                
                                <div class="iteration__files">
                                    <div v-if="copy.filesLvl !== 'DLSM'">
                                        <b-button class="btn_flat iteration__folder-back" @click="backToSummaryFolder(copy)">
                                            <svg viewBox="0 0 448 512">
                                                <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
                                            </svg>
                                            <span>{{ summaryFolderName(copy) }}</span>
                                        </b-button>
                                    </div>
                                    <template v-for="file in summaryCurrentfiles(copy)"> <!--copy.summary_documents">-->
                                        <FileDownload v-if="!file.is_dir" :file="file" :key="file.id" class="mt-4 iteration__file">
                                            <a v-if="file.link" class="btn btn-secondary" :href="file.link" target="_blank">Открыть</a>
                                            <b-button v-else @click="downloadFile(copy, file)">Скачать</b-button>
                                        </FileDownload>
                                        <div v-else :key="file.id" class="iteration__folder" @click="copy.filesLvl = file.id">
                                            <svg viewBox="0 0 512 512" class="iteration__folder-icon">
                                                <path fill="currentColor" d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z" />
                                            </svg>
                                            <div class="iteration__folder-name">
                                                {{ file.title }}
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>

                            <div class="mt-4" v-if="copy.team_comment && copy.team_comment.length">
                                <h3>Комментарии команды</h3>
                                <div class="team-message mt-2">
                                    ({{ copy.published_by_role }}) <span v-if="copy.published_by">{{copy.published_by.fullname}}</span> :  {{ copy.team_comment }}
                                </div>
                            </div>
                        </b-card>

                    </div>
                </b-col>

                <b-col>
                    <div v-pin-aside>
                        <b-card class="program-choice__wrap mb-4">
                            <h4 class="mb-3">Экземпляры проекта</h4>
                            <button v-for="copy in copies" :key="copy.instance_number" class="program-choice mb-2" :class="{ 'program-choice_active': copy.instance_number === currentCopy }" @click="currentCopy = copy.instance_number">
                                <b>{{ copy.team }}</b>
                                <div class="mt-2" v-if="copy.team_head">
                                    {{ copy.team_head.fullname }}
                                    <div class="text-caption">Руководитель команды</div>
                                </div>
                                <div class="mt-2" v-if="copy.curator">
                                    {{ copy.curator.fullname }}
                                    <div class="text-caption">Куратор</div>
                                </div>
                            </button>
                        </b-card>
                    </div>
                </b-col>
            </b-row>
            <b-row v-else>
                <b-col>
                    <b-card class="mt-4">
                        <h4>Производится формирование команды проекта...</h4>
                    </b-card>
                </b-col>
            </b-row>

        </template>

    </b-container>
</template>

<script>
import { mapState } from 'vuex'

import PersonCrutch from '@/components/PersonCrutch'
import Message from '@/components/Message'
import FileDownload from '@/components/FileDownload'
import format from 'date-fns/format'
import fileSave from '@/utils/fileSave'
import { dateToWord, declOfNum, model } from '@/utils'


export default {
  name: 'Implementation',
  components: {
    PersonCrutch,
    Message,
    FileDownload
  },
  data () {
    return {
      len: 0,
      currentCopy: null,
      teamsVisible: false,
      copies: null,
    }
  },
  created () {
    this.loadProject()
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.loadProject()
  },
  methods: {
    model,
    formatDate: date => format(date, 'DD.MM.YYYY'),
    formatDateTime: date => format(date, 'DD.MM.YYYY HH:mm'),
    dateToWord: date => dateToWord(date),
    declOfNum: (num, word) => declOfNum(num, word),
    loadProject () {
      this.$store.dispatch('project/FETCH_project', { id: this.$route.params.id })
      this.$store.dispatch('project/FETCH_teamproject', { id: this.$route.params.id }).then((data) => {
        if (!data || !data.length) return
        data.forEach((copy) => {
          copy.filesLvl = 'DLSM'
          copy.team = 'Команда ' + copy.instance_number
          if (copy.iterations === null) copy.iterations = []
          copy.iterations = copy.iterations.map(iteration => {
            iteration.visible = false
            iteration.filesLvl = 'iteration_' + iteration.id
            iteration.newComment = {
              add: false,
              text: null
            }
            return iteration
          })
        })
        this.currentCopy = data[0].instance_number
        this.copies = data
      })
    },
    iterationCurrentfiles (copy, iteration) {
      return iteration.documents.filter(file => file.parent === iteration.filesLvl)
    },
    summaryCurrentfiles (copy) {
      return copy.summary_documents.filter(file => file.parent === copy.filesLvl)
    },    
    backToFolder (iteration) {
      const folder = iteration.documents.find(file => file.id === iteration.filesLvl)
      iteration.filesLvl = folder.parent
    },
    backToSummaryFolder (copy) {
      const folder = copy.summary_documents.find(file => file.id === copy.filesLvl)
      copy.filesLvl = folder.parent
    },
    folderName (iteration) {
      const folder = iteration.documents.find(file => file.id === iteration.filesLvl)
      return folder ? folder.title : 'Нет заголовка'
    },
    summaryFolderName (copy) {
      const folder = copy.summary_documents.find(file => file.id === copy.filesLvl)
      return folder ? folder.title : 'Нет заголовка'
    },
    downloadFile (copy, file) {
      this.$axios.get(this.learning_src + 'passport/' + this.$route.params.id + '/imp_file/', {
        responseType: 'blob',
        params: {
          file: file.id,
          team: copy.instance_number
        }
      }).then(res => {
        //let filenameArr = (file.filename) ? file.filename.split('.') : []
        //let fileExt = (filenameArr && filenameArr.length > 1) ? filenameArr.pop() : ''
        fileSave(res.data, file.title)
        //(file.title || file.human_name) + '.' + fileExt)
      })
    },
    openIteration (iteration) {
      if ((iteration.tasks && iteration.tasks.length) || (iteration.documents && iteration.documents.length)) {
        iteration.visible = !iteration.visible
      }
    },
    saveComment (iteration) {
      const comment = {
        id: Math.round(Math.random() * 100),
        text: iteration.newComment.text,
        date: new Date(),
      }
      this.$axios.post(this.learning_src + 'passport/' + this.$route.params.id + '/imp_comment/', {
        text: comment.text,
        iteration: iteration.id
      }).then(data => {
        iteration.comments.push(data.data)
      })
      iteration.newComment = {
        add: false,
        text: null
      }
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      project: state => state.project.project,
      learning_src: state => state.api.learning_src
    })
  }
}
</script>

<style lang="stylus" scope>
  .team-message {
    background: rgba(70, 123, 227, 0.08);
    border-radius: 6px;
    padding: 1rem;    
  }
  .copy {
    &__role {
      border-bottom: 1px solid rgba(114, 128, 142, 0.15);
      padding: 24px 0;
      &:last-child {
        border: none;
      }
    }
  }
  .iteration {
    &__content {
      margin-top: 1rem;
      display: none;
      &_common {
        display: block;
      }
    }
    &__btn.btn_flat {
      margin-left: -14px;
    }
    &__btn h2 {
      color: #111112;
      border-bottom: 1px dashed #9DA7B0;
    }
    &_end .iteration__content_common {
      display: none;
    }
    &_show .iteration__content {
      display: block;
    }
    &__status {
      float: right;
      &_end {
        color: #9DA7B0;
        font-size: 14px;
        font-weight: 500;
        margin-top: 6px;
      }
    }
    &__task {
      margin-left: 10px;
      position: relative;
      &:before {
        content: '';
        position: absolute;
        left: -8px;
        top: 8px;
        width: 6px;
        height: 6px;
        border-radius: 3px;
        display: inline-block;
        margin-bottom: 2px;
        margin-right: 8px;
        background: #111;
      }
    }
    &__files {
      margin-top: 20px;
      border: 1px solid rgba(114, 128, 142, 0.3);
      border-radius: 6px;
      padding: 20px 48px;
    }
    &__folder {
      cursor: pointer;
      height: 50px;
      color: #333;
      display: flex;
      flex: 1;
      align-items: center;
      &-icon {
        color: #facb23;
        width: 30px;
      }
      &-back {
        white-space: nowrap;
        margin-left: -12px !important;
        margin-top: 20px;
        & span {
          color: #333;
        }
        & svg {
          width: 20px;
          margin-right: 8px;
          margin-top: -2px;
        }
      }
      &-name {
        margin-left: 13px;
      }
    }
    &__comment {
      margin-top: 24px;
      background: rgba(70, 123, 227, 0.08);
      padding: 32px 48px;
      &-add {
        margin-top: 24px;
      }
    }
  }
</style>
