<template>
  <b-button-group size="sm" v-if="editor" class="editor__btns">
    <b-button
      @click="editor.chain().focus().toggleBold().run()"
      :variant="isActive('bold')"
      v-b-tooltip.hover title="Полужирный"
    >
      <b-icon icon="type-bold" />
    </b-button>
    <b-button
      @click="editor.chain().focus().toggleItalic().run()"
      :variant="isActive('italic')"
      v-b-tooltip.hover title="Курсив"
    >
      <b-icon icon="type-italic" />
    </b-button>
    <b-button
      @click="editor.chain().focus().toggleStrike().run()"
      :variant="isActive('strike')"
      v-b-tooltip.hover title="Перечеркнутый"
    >
      <b-icon icon="type-strikethrough" />
    </b-button>
    <b-button
      @click="editor.chain().focus().toggleUnderline().run()"
      :variant="isActive('underline')"
      v-b-tooltip.hover title="Подчеркнутый"
    >
      <b-icon icon="type-underline" />
    </b-button>
    
    <b-button
      @click="editor.chain().focus().toggleBulletList().run()"
      :variant="isActive('bulletList')"
      v-b-tooltip.hover title="Маркированный список"
    >
      <i class="fas fa-list-ul" />
    </b-button>
    <b-button
      @click="editor.chain().focus().toggleOrderedList().run()"
      :variant="isActive('orderedList')"
      v-b-tooltip.hover title="Нумерованный список"
    >
      <i class="fas fa-list-ol" />
    </b-button>

    <b-button
      v-b-modal="'modalEditorAddUrl_' + uid"
      v-b-tooltip.hover title="Вставить ссылку"
    >
      <b-icon icon="link" />
    </b-button>
    <b-modal :id="'modalEditorAddUrl_' + uid" size="md" centered title="Добавление ссылки">
      <b-form-group label="Адрес ссылки" class="mt-4">
        <b-form-input
          v-model="linkHref"
          type="url"
          placeholder="Введите адрес ссылки http://..."
        />
      </b-form-group>
      <b-form-group label="Текст ссылки">
        <b-form-input
          v-model="linkTitle"
          type="text"
          placeholder="Введите текст для ссылки"
        />
      </b-form-group>
      <template v-slot:modal-footer>
        <b-button variant="primary" :disabled="!testLink" @click="setlLink">Добавить</b-button>
        <b-button @click="closeModalLink">Отменить</b-button>
      </template>
    </b-modal>

    <b-button
      @click="editor.chain().focus().clearNodes().unsetAllMarks().run()"
      v-b-tooltip.hover title="Очистка форматирования"
    >
      <i class="fas fa-remove-format" style="font-size: 11px;" />
    </b-button>
    <b-button
      @click="editor.chain().focus().undo().run()"
      v-b-tooltip.hover title="Отменить"
    >
      <b-icon icon="reply" flip-h />
    </b-button>
    <b-button
      @click="editor.chain().focus().redo().run()"
      v-b-tooltip.hover title="Повторить"
    >
      <b-icon icon="reply" />
    </b-button>
  </b-button-group>
</template>

<script>
import { makeUID } from '@/utils'
export default {
  name: 'EditorBar',
  props: [ 'editor' ],
  data(){
    return {
      uid: '',
      linkTitle: null,
      linkHref: null,
    }
  },
  created () {
    this.uid = makeUID(3)

    this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
      if (modalId === 'modalEditorAddUrl_' + this.uid) {
        this.linkTitle = window.getSelection().toString()
      }
    })
  },
  methods: {
    isActive (name) {
      return this.editor.isActive(name) ? 'primary' : 'secondary'
    },
    closeModalLink () {
      this.linkTitle = null
      this.linkHref = null
      this.$bvModal.hide('modalEditorAddUrl_' + this.uid)
    },
    setlLink () {
      let linkHTML;
      if (this.testLink.indexOf('@') > -1) {
        linkHTML = `<a href="mailto:${ this.testLink }">${ this.linkTitle ? this.linkTitle : this.testLink }</a>`
      } else if (this.testLink.indexOf('//') === -1) {
        linkHTML = `<a href="http://${ this.testLink }">${ this.linkTitle ? this.linkTitle : this.testLink }</a>`
      } else {
        linkHTML = `<a href="${ this.linkHref }">${ this.linkTitle ? this.linkTitle : this.linkHref }</a>`
      }

      this.editor.chain().focus().insertContent(linkHTML).run()
      this.closeModalLink()
    }
  },
  computed: {
    testLink () {
      // eslint-disable-next-line no-useless-escape
      const regexp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
      const result = regexp.exec(this.linkHref)
      return result ? result[0] : 0
    }
  }
}
</script>
<style lang="stylus">
  .editor .ProseMirror {}
  .editor__btns {
    margin-bottom: 3px;
    & .btn {
      margin: 0;
      & > i {
        margin: 0;
      }
    }
    &_disabled {
      pointer-events: none;
      & .btn-secondary,
      & .btn-primary {
        background: rgba(114,128,142,0.1);
        color: rgba(114,128,142,0.8)
      }
    }
  }
</style>