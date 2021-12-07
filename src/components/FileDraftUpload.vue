<template>
  <div class="upload">
    <b-form-file
      size="lg"
      ref="files-upload"
      multiple
      v-model="files"
      @input="fileChange"
      :placeholder="placeholder"
      browse-text=""
      drop-placeholder=""
    >
      <template v-slot:file-name>
        Загрузка файлов...
      </template>
    </b-form-file>

    <div class="upload__icon">
      <svg v-if="!filesLoading" width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 14V20H22.5V14" stroke="#5386EB" stroke-opacity="0.35" stroke-width="1.5"/>
        <path d="M6.34315 9.34315L12 15M17.6569 9.34315L12 15M12 15V1" stroke="#467BE3" stroke-width="1.5"/>
      </svg>
      <b-spinner v-else style="width: 1.9rem; height: 1.9rem;" variant="primary" />
    </div>
  </div>
</template>

<script>
import { errorMessage, } from '@/utils';

export default {
  name: 'FileUpload',
  props: {
    formslug: String
  },
  data () {
    return {
      files: [],
      filesLoading: false,
      placeholder: 'Перетащите сюда файлы или нажмите, чтобы выбрать'
    }
  },
  created () {
    if (!this.formslug) this.placeholder = 'Укажите :formslug для сохранения'
  },
  methods: {
    fileChange () {
      if (this.files.length) {
        this.filesLoading = true
        this.getUID()
      }
    },
    getUID () {
      const requestsArr = []
      for (let i = 0; i < this.files.length; i++) {
        const fileData = new URLSearchParams()
        fileData.set('human_name', this.files[i].name)
        fileData.set('upload_elementname', 'documents')
        fileData.set('formslug', this.formslug)
        fileData.set('formname', this.formslug)
        const req = this.$axios.post(window.lkp.kernel_src + 'draft/getuid/', fileData)
        requestsArr.push(req)
      }
      Promise.all(requestsArr).then(res => {
        this.uploadFiles(res)
      }).catch(() => {
        this.filesLoading = false
      })
    },
    uploadFiles (filesData) {
      const requestsArr = []
      for (let i = 0; i < this.files.length; i++) {
        const formDataFiles = new FormData()
        formDataFiles.set('file_id', filesData[i].data.file_id)
        formDataFiles.set('file', this.files[i])
        const req = this.$axios.post(window.lkp.kernel_src + 'draft/upload/', formDataFiles)
        requestsArr.push(req)
      }
      Promise.all(requestsArr).then(res => {
        const result = []
        for (let i = 0; i < this.files.length; i++) {
          if (res[i].data.status === 'success') {
            result.push({
              human_name: this.files[i].name,
              file_id: filesData[i].data.file_id
            })
          } else if (res[i].data.status === 'failed') {
            errorMessage(res[i].data.error);
          }
        }
        this.$emit('uploaded', result)
        this.$refs['files-upload'].reset()
        this.filesLoading = false
      }).catch(() => {
        this.filesLoading = false
      })
    }
  }
}
</script>