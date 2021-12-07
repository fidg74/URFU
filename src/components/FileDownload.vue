<template>
  <div class="document">
    <div @click="downloadIfCan" :class="[{
          'document__downloadable': canDownload,
        }, `document__img document__img_${ getExt }`
      ]"
      :title="canDownload ? 'Скачать' : ''"
    >
      <template v-if="getExt !== 'url'">
        <svg width="30" height="40" viewBox="0 0 37 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="document__img-body" d="M4 48H33C35.2091 48 37 46.2091 37 44V10L27 0H4C1.79086 0 0 1.79086 0 4V44C0 46.2091 1.79086 48 4 48Z" />
          <g style="mix-blend-mode: multiply">
            <path class="document__img-corner" d="M29 10H37L27 0V8C27 9.10457 27.8954 10 29 10Z" />
          </g>
        </svg>
        <div class="document__file">{{ getExt }}</div>
      </template>
      <svg v-else class="mt-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.723 18.654L10.113 22.263C7.797 24.578 4.05 24.578 1.735 22.263C0.615 21.145 0 19.657 0 18.075C0 16.493 0.615 15.005 1.734 13.886L6.6 9.021C8.955 6.666 12.714 6.759 14.977 9.021C15.43 9.474 15.787 9.994 16.066 10.548L14.473 12.14C14.293 11.527 13.973 10.951 13.509 10.488C12.061 9.04 9.579 8.978 8.07 10.487L8.069 10.489L3.202 15.354C1.702 16.853 1.702 19.295 3.202 20.794C4.719 22.311 7.16 22.282 8.644 20.794L11.069 18.37C12.062 18.654 12.86 18.705 13.723 18.654ZM13.884 1.736L10.31 5.312C11.157 5.262 11.965 5.312 12.963 5.595L15.356 3.206C16.854 1.704 19.296 1.706 20.796 3.205C22.313 4.723 22.282 7.164 20.796 8.647L15.965 13.478L15.962 13.48C14.524 14.917 12.076 15.032 10.523 13.478C10.05 13.004 9.738 12.436 9.567 11.835L9.483 11.903L7.966 13.418C8.246 13.974 8.601 14.493 9.054 14.946C11.299 17.191 15.058 17.32 17.432 14.946L22.264 10.115C24.578 7.799 24.58 4.053 22.263 1.738C19.946 -0.582999 16.196 -0.574999 13.884 1.736Z" fill="#4CA7FF"/>
      </svg>
    </div>
    <div class="document__info">
      <div>
        <div @click="downloadIfCan"
          :class="{
            'document__downloadable': canDownload
          }"
          :title="canDownload ? 'Скачать' : ''"
        >
          {{ getName }}
        </div>
        <div class="text-caption" v-if="!hideAuthor">
          <span v-if="file.user && file.user.full_name">{{ file.user.full_name }}</span>
          <span v-if="file.date">{{ formatDateTime(file.date) }}</span>
        </div>
      </div>
      <div v-if="$slots.default" class="text-right" >
        <slot  />
      </div>
      <template v-else>
        <button v-if="remove && address" @click="removeFile" class="document__remove" :title="remove && address ? 'Удалить' : ''"></button>
      </template>
    </div>
  </div>
</template>


<script>
import format from 'date-fns/format'
import fileSave from '@/utils/fileSave'

export default {
  name: 'FileDownload',
  props: {
    file: Object,
    download: Boolean,
    remove: Boolean,
    teampro: Boolean,
    address: String,
    downloadAddress: {
      type: String,
      default: null,
    },
    // Признак того, что компонент в заявке
    request: {
      type: Boolean,
      default: false,
    },
    hideAuthor: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    formatDateTime: date => format(date, 'DD.MM.YYYY HH:mm'),
    downloadFile () {
      const url = this.downloadAddress != null ? this.downloadAddress : this.$store.state.api.learning_src + 'file/' + this.file.id
      this.$axios.get(url, {
        responseType: 'blob'
      }).then(res => {
        fileSave(res.data, this.file.human_name)
      })
    },
    removeFile () {
      this.$bvModal.msgBoxConfirm('Вы действительно хотите удалить файл?', {
        title: 'Удалить файл',
        okTitle: 'Удалить',
        okVariant: 'primary',
        cancelTitle: 'Отменить',
        hideHeaderClose: false,
        centered: true
      }).then(value => {
        if (value) {
          const formDataFiles = new FormData()
          formDataFiles.append('id', this.file.id)
          this.$axios.post(this.address, formDataFiles).then(data => {
            if (data.data.status === 'success') {
              this.$emit('remove', this.file.file_id)
            }
          })
        }
      })
    },
    downloadIfCan() {
      if (this.canDownload) {
        this.downloadFile()
      }
    },
  },
  computed: {
    getName () {
      if (this.file.title || this.file.human_name) {
        let fileName = this.file.title || this.file.human_name
        const maxLength = 60
        if (fileName.length > maxLength) {
          fileName = fileName.slice(0, maxLength) + '...'
        } 
        return fileName
      } else {
        return 'No name file'
      }
    },
    getExt () {
      if (this.file.link) return 'url'
      else if (this.file.format) {
        return this.file.format === 'image' ? 'img' : this.file.format
      } else {
        return ''
      }
    },
    canDownload () {
      return this.download && (this.file.file_id || this.request)
    },
  }
}
</script>

<style lang="stylus">
  
.document {
  display: flex;
  width: 100%;
  flex: 1;
  justify-content: space-between;
  margin-bottom: 1rem;
  &:last-child {
    margin-bottom: 0rem;
  }
  &__remove {
    position: relative
    right: 26px
    
    width: 10px;
    height: 10px;

    border: none
    background: none
    padding: 0
    &:before, &:after {
      position: absolute;
      top: 50%;
      left: 50%;
      content: '';
      height: 10px;
      width: 1.5px;
      background-color: rgba(157, 167, 176, 1);
      border-radius: 5px;
    }
    &:before {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    &:after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
    &:hover:before, &:hover&:after {
      background-color: black;
    }
    &:focus {
      outline: none
    }
  }
  &__downloadable:hover {
    cursor: pointer
  }
  &__img {
    position: relative;
    width: 30px;
    flex: 0 0 30px;
    &_ ,
    & {
      & .document__img-body { fill: #ffc107 }
      & .document__img-corner { fill: #997f30 }
    }
    &_ppt {
      & .document__img-body { fill: #E2574C }
      & .document__img-corner { fill: #9D0402 }
    }
    &_img,
    &_pdf {
      & .document__img-body { fill: #f44336 }
      & .document__img-corner { fill: #78231d }
    }
    &_word .document__file {
      font-size: 12px;
    }
    &_word,
    &_doc {
      & .document__img-body { fill: #1565C0 }
      & .document__img-corner { fill: #000652 }
    }
    &_txt {
      & .document__img-body { fill: #278ca3 }
      & .document__img-corner { fill: #125f70 }
    }
    &_xlsx {
      & .document__img-body { fill: #147246; }
      & .document__img-corner { fill: #054226 }
    }
  }
  &__file {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    top: 12px;
    color: #fff;
    font-size: 13px;
    text-transform: lowercase;
  }
  &__btn {
    background: none;
    border: none;
    padding: 0;
    display: inline-block;
    width: 100%;
    text-align: left;
    &:not(:disabled):not(.disabled):active,
    &:not(:disabled):not(.disabled).active,
    &:focus,
    &:active,
    &:hover {
      outline: none;
      background: #f0f0f0;
      border: none;
    }
    &-edit {
      margin-right: 50px;
    }
  }
  &__info {
    padding-top: 0.25rem;
    margin-left: 13px;
    color: #333;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
  }
  &_edit {
    & .document__info {
      margin-right: 50px;
    }
  }
}
</style>