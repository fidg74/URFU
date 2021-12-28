<template>
  <b-container class="newRequest">
    <b-button variant="primary" class="btn_flat mb-3 newRequest__top" to="/requests">
      <div class="iconBack">
      <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.16424 1.33576L1.17145 4.32855M1.17145 4.32855L4.16424 7.32134M1.17145 4.32855H10.8285" stroke="#467BE3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>

      </div>
      <span>Все заявки</span>
    </b-button>

    <h1>Заполните заявку на&nbsp;проект</h1>
    <div class="h1__description">
      Расскажите о&nbsp;задаче. Это поможет преподавателям и&nbsp;студентам сделать выбор проекта.
      <div v-if="this.semesterActual">Реализация проекта может быть начата с&nbsp;<b>{{ this.formatDate(this.semesterActual.start_date) }}&nbsp;г.</b></div>
    </div>

    <b-row class="mt-4">
    <b-col>
        <div v-pin-aside class="project-status__wrap">
          <div class="text-subtitle">Прогресс заявки</div>
          <div class="project-status project-status_active">
            <div class="project-status__num">1</div>
            <div class="project-status__title">Заполнение заявки</div>
          </div>
          <div class="project-status">
            <div class="project-status__num">2</div>
            <div class="project-status__title">Рассмотрение заявки университетом</div>
          </div>
          <div class="project-status">
            <div class="project-status__num">3</div>
            <div class="project-status__title">Ответ на&nbsp;заявку</div>
          </div>
        </div>
      </b-col>
      <b-col cols="12" >
        <b-card class="card_content mt-0">
          <b-badge variant="grey" class="fl-right">Черновик</b-badge>
          <h2>Описание проекта <span class="form_required-el" /></h2>
          <div class="text-subtitle">Заполните основную информацию о&nbsp;проекте.</div>

          <b-form-group label="Название проекта" class="mt-4">
            <div class="form-actions">
              <i :class="{ 'form-help_show': request.name }" class="form-help" v-b-tooltip.hover show title="Напишите название проекта" />
            </div>
            <b-form-input
              v-model="request.name"
              :class="{ 'form-control_error': $v.request.$dirty && $v.request.name.$invalid }"
              type="text"
              autocomplete="off"
              placeholder="Напишите название проекта"
            />
            <div v-if="$v.request.$dirty">
              <div class="form-error" v-if="!$v.request.name.required">Поле не заполнено</div>
            </div>
          </b-form-group>
          <b-form-group label="Цель">
            <div class="form-actions">
              <i :class="{ 'form-help_show': request.goal }" class="form-help" v-b-tooltip.hover.html title="Опишите, что должно быть достигнуто в&nbsp;результате выполнения проекта. Ставьте измеримые и&nbsp;выполнимые цели. Ответьте на&nbsp;вопрос, для чего создается результат проекта.<br /><br />Например, цель разработки веб-сайта: посетители сайта будут уверены, что существует угроза глобального потепления." />
            </div>
            <Editor
              v-model="request.goal"              
              :error="$v.request.$dirty && $v.request.goal.$invalid"
              placeholder="Опишите, что должно быть достигнуто в результате выполнения проекта. Ставьте измеримые и выполнимые цели. Ответьте на вопрос, для чего создается результат проекта. Например, цель разработки веб-сайта: посетители сайта будут уверены, что существует угроза глобального потепления."
              :key="editorKeys.goal"
            />
            <div v-if="$v.request.$dirty">
              <div class="form-error" v-if="!$v.request.goal.requiredHTML">Поле не заполнено</div>
            </div>
          </b-form-group>
          <b-form-group label="Результат (продукт)">
            <div class="form-actions">
              <i :class="{ 'form-help_show': request.result }" class="form-help" v-b-tooltip.hover show title="Опишите, что должна создать команда проекта." />
            </div>
            <Editor
              v-model="request.result"              
              :error="$v.request.$dirty && $v.request.result.$invalid"
              placeholder="Опишите, что должна создать команда проекта."
              :key="editorKeys.result"
            />            
            <div v-if="$v.request.$dirty">
              <div class="form-error" v-if="!$v.request.result.requiredHTML">Поле не заполнено</div>
            </div>
          </b-form-group>
          <b-form-group label="Критерии приемки результата / продукта">
            <div class="form-actions">
              <i :class="{ 'form-help_show': request.criteria }" class="form-help" v-b-tooltip.hover title="Указывайте измеримые критерии, которые должны быть достигнуты для того, чтобы проект мог считаться успешным." />
            </div>
            <Editor
              v-model="request.criteria"              
              :error="$v.request.$dirty && $v.request.criteria.$invalid"
              placeholder="Указывайте измеримые критерии, которые должны быть достигнуты для того, чтобы проект мог считаться успешным."
              :key="editorKeys.criteria"
            />            
            <div v-if="$v.request.$dirty">
              <div class="form-error" v-if="!$v.request.criteria.requiredHTML">Поле не заполнено</div>
            </div>
          </b-form-group>
          <b-form-group label="Описание проекта">
            <div class="form-actions">
              <i :class="{ 'form-help_show': request.description }" class="form-help" v-b-tooltip.hover title="Опишите особенности проекта, технологии и способы реализации. Рекомендуем указать компетенции, которые понадобятся участникам проекта." />
            </div>
            <Editor
              v-model="request.description"              
              :error="$v.request.$dirty && $v.request.description.$invalid"
              placeholder="Опишите особенности проекта, технологии и способы реализации. Рекомендуем указать компетенции, которые понадобятся участникам проекта."
              :key="editorKeys.description"
            />            
            <div v-if="$v.request.$dirty">
              <div class="form-error" v-if="!$v.request.description.requiredHTML">Поле не заполнено</div>
              <div class="form-error" v-if="!$v.request.description.minLength">Не менее 10 символов</div>
            </div>
          </b-form-group>
          <b-row>
            <b-col sm="12" md="6" lg="4">
              <b-form-group label="Максимальное количество экземпляров проекта">
                <div class="form-actions">
                  <i :class="{ 'form-help_show': request.max_copies }" class="form-help" v-b-tooltip.hover.html title="Укажите максимальное значение количества команд, независимо выполняющих проект, с&nbsp;которыми вы&nbsp;сможете взаимодействовать. <br></br> В&nbsp;случае согласия работать с&nbsp;несколькими командами вы&nbsp;сможете выбрать лучший результат. <br><br>Количество экземпляров будет уточняться, если нужное количество студентов не&nbsp;будет набрано." />
                </div>
                <MinOneInput                      
                      v-model.number="request.max_copies"
                      placeholder="Не менее одного"
                      onlyInteger
                />                
              </b-form-group>
            </b-col>
          </b-row>
        </b-card>

        <b-card class="card_content">
            <ProgramFilterSelect
                v-model="request.programs"            
                multiple
                :error="$v.request.$dirty && !request.programs.length"
                :value="request.programs"
            />          
        </b-card>        

        <b-card class="card_content">
          <h2>Заказчик <span class="form_required-el" /></h2>
          <b-form-group class="mt-2">
            <treeselect
              :disabled="!user.isPlAdmin || !managers.length"
              :clearable="false"
              placeholder="Выберите менеджера"
              v-model="request.manager"
              :options="managers">
            </treeselect>
          </b-form-group>
        </b-card>

        <b-card class="card_content">
          <h2>Приложения</h2>
          <div class="text-subtitle">Вы&nbsp;можете приложить файлы с&nbsp;дополнительной информацией о&nbsp;проекте.<br>Например, техническое задание или презентацию.</div>          

          <FileUpload
                :address="learning_src + 'request/' + $route.params.id + '/file_upload/'"
                @uploaded="file =>  request.req_files.push(file)"
                v-if="request.id"
              />

          <FileDraftUpload formslug="new-request" @uploaded="fileUploaded" v-else/>

          <div v-if="request.req_files && request.req_files.length" class="mt-4">
            <FileDownload remove
            @remove="request.req_files.splice(index, 1)"
            :file="file" v-for="(file, index) of request.req_files" :key="index" download
            :address="request.id ? learning_src + 'request/' + $route.params.id + '/file_delete/' : kernel_src + 'draft/delete/' + file.file_id"
            :downloadAddress="request.id ? null : kernel_src + 'draft/download/' + file.file_id" request hideAuthor
            />
          </div>
        </b-card>

        <div v-pin-bottom>
          <b-container class="pin-bottom__container">
            <b-row>
              <b-col cols="12">
                <b-card class="card_content">
                  <b-button variant="primary" @click="sendRequest">Отправить заявку</b-button>
                  <b-button @click="sendRequest('draft')">Сохранить</b-button>
                  <b-button v-if="$route.params && $route.params.id" variant="danger" @click="removeRequest">Удалить</b-button>
                  <b-button class="btn_flat" @click="savePDF">Сохранить в&nbsp;PDF</b-button>

                  <div v-if="draft.updated" class="draft__updated fl-right">
                    <i class="draft__icon fas fa-sync-alt" />
                    <span>Черновик сохранен в&nbsp;{{ formatTime(draft.updated) }}</span>
                  </div>
                </b-card>
              </b-col>
            </b-row>
          </b-container>
        </div>
      </b-col>
    </b-row>

  </b-container>
</template>

<style>
  .newRequest {

  }


  @media (max-width: 575px) {
    .newRequest__top {
      display: flex;
      align-items: center
    }

    .newRequest .iconBack {
      margin-right: 10px;
    }

    .newRequest h1 {
      font-size: 22px;
    }

    .newRequest .project-status__wrap {
      max-height: auto;
    }

    .newRequest .pin-bottom {
      padding-left: 0;
      max-width: 100%;
    }
  }

</style>

<script>
import { mapState, mapGetters } from 'vuex';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';
import { requiredHTML } from '@/utils/validators';

import format from 'date-fns/format';
import ProgramFilterSelect from '@/components/request/program-select';
import FileDraftUpload from '@/components/FileDraftUpload';
import FileDownload from '@/components/FileDownload';
import FileUpload from '@/components/FileUpload';
import Editor from '@/components/Editor';
import MinOneInput from '@/components/MinOneInput';

export default {
  name: 'NewRequest',
  components: {
    ProgramFilterSelect,
    FileDraftUpload,
    FileUpload,
    FileDownload,
    Editor,
    MinOneInput    
  },
  mixins: [ validationMixin ],
  data () {
    return {
      req_files: null,
      uploadAddress: null,
      managers: [],
      onlyOwnPrograms: false,
      formEdited: false,
      formSaved: false,
      draft: {
        timeoutTempory: null,
        updated: false,
        oldState: null,
      },

      request: {
        name: '',
        max_copies: 1,
        programs: [],
        req_files: [],        
        goal: '',
        result: '',
        criteria: '',
        description: ''
      },
      editorKeys: {
        goal: 0,
        description: 0,
        criteria: 0,
        result: 0
      }
    }
  },
  validations: {
    request: {
      name: { required },
      goal: { requiredHTML },
      result: { requiredHTML },
      criteria: { requiredHTML },
      max_copies: {
        required,
        isInteger: num => (num ^ 0) === num
      },
      manager: { required },
      programs: {
        required,
        minLength: minLength(1)
      },
      description: {
        requiredHTML,
        minLength: minLength(10)
      }
    }
  },
  mounted () {    
  },
  created () {
    if (this.user.isRop) {
      this.onlyOwnPrograms = true
    }

    this.managers = [{
      label: this.userFullName(this.user.current),
      id: this.user.id
    }]

    if (this.user.isPlAdmin) {
      this.$axios.get(this.learning_src + 'user/?filter=project-manager').then(data => {
        this.managers = data.data.map(manager => new Object({
          label: this.userFullName(manager),
          id: manager.id
        }))
        this.request.manager = this.user.id || (this.managers.length ? this.managers[0].id : this.user.id)
      })
    } else {
      this.request.manager = this.user.id
    }

    if (this.$route.params && this.$route.params.id) {
      this.onlyOwnPrograms = false
      this.$axios.get(this.learning_src + 'request/' + this.$route.params.id + '/short/').then(data => {        
        if (data.data.manager && data.data.manager.id) {
          data.data.manager = data.data.manager.id
        }        
        this.request = data.data
        this.$nextTick(() => {
          this.formEdited = false
        })
        // Запустим рендеринг редакторов после загрузки из АПИ
        this.editorKeys.goal += 1
        this.editorKeys.result += 1
        this.editorKeys.criteria += 1
        this.editorKeys.description += 1
      })
    } else {
      this.checkTemporyDraft()
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.formEdited && !this.formSaved) {
      this.$bvModal.msgBoxConfirm('Хотите сохранить черновик и продолжить заполнение позже?', {
        buttonSize: 'md',
        title: 'Выйти из редактирования',
        okVariant: 'primary',
        okTitle: 'Сохранить и выйти',
        cancelTitle: 'Выйти без сохранения',
        hideHeaderClose: false,
        centered: true
      }).then(value => {
        if (value) {
          this.formEdited = false
          this.sendRequest('draft', next)
        } else {
          next()
        }
      })
    } else next()
  },
  methods: {
    formatTime: date => format(date, 'HH:mm'),
    formatDate: date => format(date, 'DD.MM.YYYY'),
    formatDateTime: date => format(date, 'DD.MM.YYYY HH:mm'),
    userFullName: user => (user.last_name ? user.last_name : '') + ' ' + (user.first_name ? user.first_name : '') + ' ' + (user.middle_name ? user.middle_name : ''),
    isNumber (evt) {
      evt = (evt) ? evt : window.event
      const charCode = (evt.which) ? evt.which : evt.keyCode
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault()
      } else {
        return true
      }
    },
    checkMinCopy () {
      if (this.request.max_copies < 1) {
        this.request.max_copies = 1
      }
    },
    sendRequest (type, next) {
      if (type !== 'draft') {
        this.$v.request.$touch()
      }
      if (type === 'draft' || !this.$v.$invalid) {
        // Сохранение черновика
        this.formSaved = true
        const sendData = {
          name: this.request.name || '',
          goal: this.request.goal || '',
          result: this.request.result || '',
          criteria: this.request.criteria || '',
          max_copies: (this.request.max_copies ^ 0) || '',          
          manager: this.request.manager || '',
          description: this.request.description || '',
          file: [],
          programs: this.request.programs,
          form_edited: this.formEdited,
        }
        this.request.req_files.forEach(file => {
          sendData['file'].push(JSON.stringify(file))
        })
        if (type === 'draft') {
          sendData['draft']=true
        }

        if (type !== 'draft') {
          // Запись с отправкой 
          this.$bvModal.msgBoxConfirm('Перед отправкой проверьте, правильно ли заполнена заявка. Отменить действие будет нельзя.', {
            title: 'Отправка заявки',
            okTitle: 'Отправить заявку',
            okVariant: 'primary',
            cancelTitle: 'Проверить заявку',
            hideHeaderClose: false,
            centered: true
          }).then(value => {
            if (this.request.id){
              if (value) {
                this.$store.dispatch('project/sendRequest', {
                  id: this.$route.params ? this.$route.params.id : false,
                  params: sendData
                }).then(data => {
                  this.request = data
                  if (next) {
                    next()
                  } else {
                    this.$router.push({ path: '/requests/' + data.id })
                  }                  
                })
              }
            } else {
              if (value) {
                this.$store.dispatch('project/saveRequest', {
                  id: this.$route.params ? this.$route.params.id : false,
                  params: sendData
                }).then(data => {
                  this.request = data
                  if (next) {
                    next()
                  } else {
                    this.$router.push({ path: '/requests/' + data.id })
                  }
                  this.declineTemporyDraft()
                })
              }
            }
          })
        } else {
          // Запись черновика
          if (!this.request.id) {
            // Черновик ранее не сохранен явно
            this.$store.dispatch('project/saveRequest', {
              id: this.$route.params ? this.$route.params.id : false,
              draft: true,
              params: sendData
            }).then(data => {
              this.request = data
              this.declineTemporyDraft()
              if (next) {
                next()
              } else {              
                this.$router.push({ path: '/new_request/' + data.id })
              }
            })
          } else {
            // Существует заявка в статусе черновик
            this.$store.dispatch('project/patchRequest', {
              id: this.request.id,
              params: sendData
            })
            if (next) {
                next()
              }
          }
        }
      }
    },
    fileUploaded (files) {
      this.request.req_files.push(...files)
    },
    // removeMixed(index) {
    // },
    removeRequest () {
      this.$store.dispatch('project/removeRequest', { id: this.$route.params.id }).then(deleted => {
        if (deleted) this.$router.push({ path: '/requests/' })
      })
    },    
    checkTemporyDraft () {
      const params = new URLSearchParams();
      params.append('data_form_slug', 'new-request')
      this.onlyOwnPrograms = false
      this.$axios.post(this.kernel_src + 'draft/', params).then(data => {
        if (data.data && data.data.state) {
          const parseData = JSON.parse(data.data.state)
          this.$bvModal.msgBoxConfirm('Восстановить последние несохраненные данные?', {
            title: 'Несохраненные данные',
            okTitle: 'Восстановить',
            okVariant: 'primary',
            cancelTitle: 'Отменить',
            hideHeaderClose: false,
            centered: true
          }).then(value => {
            if (value) {
              this.request = parseData.fields
              this.draft.oldState = JSON.stringify(parseData.fields)
            } else {
              this.declineTemporyDraft()
            }
          })
        }
      })
    },
    declineTemporyDraft () {
      const declineData = new FormData()
      declineData.append('data_form_slug', 'new-request')
      this.$axios.post(this.kernel_src + 'draft/decline/', declineData)
    },
    saveTemporyDraft () {
      const sendDraftJson = {
        form: {
          name: 'new-request',
          data_form_slug: 'new-request'
        },
        fields: this.request
      }
      const sendDraft = new URLSearchParams()
      sendDraft.set('form_json', JSON.stringify(sendDraftJson))
      this.$axios.post(this.kernel_src + 'draft/save/', sendDraft).then(data => {
        this.draft.updated = data.data.date
      })
    },
    savePDF () {
      const managerName = this.managers.find(manager => manager.id === this.request.manager)

      const docDefinition = {
        info: {
          title: 'Заявка на проект ' + this.request.name ? this.request.name : '',
          author: this.userFullName(this.user.current),
          subject: 'Заявка на проект',
        },
        content: [
          { text: 'Заявка на проект', style: 'h1' },
          {
            text: [
              { text: [
                'Реализация проекта может быть начата с ',
                { text: this.formatDate(this.semesterActual.start_date) + ' г.', bold: true }
              ]},
            ],
            color: '#72808e',
            margin: [0, 0, 0, 15]
          },

          { text: 'Название проекта', style: 'h2' },
          { text: this.request.name },
          { text: 'Цель', style: 'h2' },
          htmlToPdfmake(this.request.goal),
          { text: 'Результат (продукт)', style: 'h2' },
          htmlToPdfmake(this.request.result),
          { text: 'Критерии приемки', style: 'h2' },
          htmlToPdfmake(this.request.criteria),
          { text: 'Описание проекта', style: 'h2' },
          htmlToPdfmake(this.request.description),
          { text: 'Максимальное количество экземпляров проекта', style: 'h2' },
          { text: (this.request.max_copies ^ 0) },

          { text: 'Образовательная программа', style: 'h2' },
          { ul: this.request.programs.map(program => Object({
            text: this.getProgram(program).uid + '  ' + this.getProgram(program).name, color: '#555555'
          })) },

          { text: 'Заказчик', style: 'h2' },
          { text: (managerName && managerName.label) ? managerName.label : '' },

          { text: 'Приложения', style: 'h2' },
          { ul: this.request.req_files.map(file => Object({
            text: file.human_name, color: '#555555'
          })) }
        ],

        styles: {
          h1: {
            fontSize: 24,
            bold: true,
            margin: [0, 0, 0, 5]
          },
          h2: {
            fontSize: 14,
            bold: true,
            margin: [0, 15, 0, 5]
          }
        },
        defaultStyle: {
          fontSize: 12,
          color: '#222222'
        }
      }
      pdfMake.createPdf(docDefinition).download('Проект. ' + (this.request.name ? this.request.name : '') + '.pdf')
    },
    
  },
  computed: {
    ...mapState({
      user: state => state.user,
      learning_src: state => state.api.learning_src,
      kernel_src: state => state.api.kernel_src,      
    }),
    ...mapGetters('api', [
      'semesterActual',      
    ]),
    computedForm () {
      return JSON.stringify(this.request)
    },    
  },
  watch: {
    computedForm (newVal, oldVal) {      
      clearTimeout(this.draft.timeoutTempory)
      if (oldVal !== 'null' && newVal !== oldVal && this.draft.oldState !== newVal && !this.formSaved) {
        this.draft.oldState = newVal
        this.formEdited = true
        if (!(this.$route.params && this.$route.params.id)) {
          this.draft.timeoutTempory = setTimeout(() => {
            this.saveTemporyDraft()
          }, 2000)
        }
      }    
    },    
  }    
}
</script>
