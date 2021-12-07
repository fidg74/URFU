<template>
  <div v-if="editor">
    <EditorBar
      :class="{ 'editor__btns_disabled': disabled }"
      :editor="editor"
      :disabled="disabled"
    />
    <EditorContent      
      :data-placeholder="placeholder"
      :class="{
        'editor': 1,
        'editor_error': error,
        'editor_disabled': disabled,
        'editor_empty': editor.isEmpty
      }"
      :editor="editor"
    />
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import EditorBar from './EditorBar'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'


const extensionsArr = [
  Link,
  Underline,
  StarterKit,
]

export default {
  components: {
    EditorContent,
    EditorBar
  },
  props: {
    value: String,
    error: Boolean,
    disabled: Boolean,
    placeholder: String,
  },
  data() {
    return {
      PlaceholderExt: {},
      editor: null,
      iter: 0
    }
  },
  mounted() {    
    const vm = this
    this.editor = new Editor({
      content: this.value,
      extensions: extensionsArr,
      editable: !this.disabled,
      parseOptions: { 'preserveWhitespace': true,},
      onUpdate() {
        const outputHTML = this.getHTML()        
        vm.$emit('input', outputHTML)
      }
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  watch: {
    disabled (newVal) {
      this.editor.setOptions({ editable: newVal })
    },
    value (newVal) {
      if (this.editor && !this.editor.isFocused) {
        this.editor.commands.setContent(newVal, false)        
      }
    }
  }
}
</script>
<style>
  .editor .ProseMirror {
    display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5rem;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    border-radius: 6px;
    min-height: 100px;
    border: 1px solid rgba(114,128,142,0.3);    
  }
  .editor .ProseMirror:focus {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  .editor .ProseMirror p {
    margin-bottom: 0.3rem;    
  }
  .editor {    
  }
  .editor_error .ProseMirror {
    border-color: #f5222d;
  }
  .editor_disabled .ProseMirror,
  .editor_disabled .ProseMirror:focus {
    color: #72808e;
    background: rgba(114,128,142,0.05);
    border: 1px solid rgba(114,128,142,0.3);
    box-shadow: none;
  }
  .editor:focus {
    background: rgba(114,128,142,0.05);
    border: 1px solid rgba(114,128,142,0.3);
    box-shadow: none;
  }
  .editor_empty::before {
    content: attr(data-placeholder);
    padding: 0.375rem 0.75rem;
    z-index: 10;
    position: absolute;
    float: left;
    color: #72808E;
    pointer-events: none;
    height: 0;
    z-index: 11;
  }
  @media (max-width: 1280px) {
    .editor .ProseMirror {
      min-height: 160px;
    }
  }
  @media (max-width: 960px) {
    .editor .ProseMirror {
      min-height: 220px;
    }
  }
</style>
