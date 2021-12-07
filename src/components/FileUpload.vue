<template>
  <div class="upload">
    <b-form-file
      size="lg"
      id="files-upload"
      multiple
      :disabled="!address"
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
      <b-icon v-if="!address" icon="x-circle" scale="1.5" variant="danger" />
      <svg v-else-if="!filesLoading" width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 14V20H22.5V14" stroke="#5386EB" stroke-opacity="0.35" stroke-width="1.5"/>
        <path d="M6.34315 9.34315L12 15M17.6569 9.34315L12 15M12 15V1" stroke="#467BE3" stroke-width="1.5"/>
      </svg>
      <b-spinner v-else style="width: 1.9rem; height: 1.9rem;" variant="primary" />
    </div>
  </div>
</template>

<script>
import { userShortName } from '@/utils'

export default {
  name: 'FileUpload',
  props: {
    address: String
  },
  data () {
    return {
      // draft/getuid/
      files: [],
      filesLoading: false,
      placeholder: 'Перетащите сюда файлы или нажмите, чтобы выбрать'
    }
  },
  created () {
    if (!this.address) this.placeholder = 'Укажите адрес для сохранения'
  },
  methods: {
    // formatNames (files) {
    //   if (files.length === 1) return files[0].name
    //   else return `Выбрано ${ files.length } файлов`
    // },
    fileChange () {
      const requestsArr = []
      this.filesLoading = true

      for (let i = 0; i < this.files.length; i++) {
        const formDataFiles = new FormData()
        formDataFiles.append('document', this.files[i])
        const req = this.$axios.post(this.address, formDataFiles)
        requestsArr.push(req)
      }
      Promise.all(requestsArr).then(res => {
        res.forEach(item => {
          if (item.data.status === 'success') {
            this.$emit('uploaded', {
              id: item.data.id,
              human_name: item.data.name,
              file_id: item.data.file_id,
              user: {
                full_name: userShortName(this.$store.state.user.current)
              },
              date: new Date()
            })
          }
        })
        this.filesLoading = false
        this.files = null
      }).catch(() => {
        this.filesLoading = false
      })
    }
  }
}
</script>