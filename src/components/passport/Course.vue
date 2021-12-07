<template>
  <div>
    <b-form-group>
      <treeselect
        clearable
        :disabled="disabled"
        placeholder="Выберите курс"
        v-model="list"
        multiple
        :options="courses[level]">
        <div slot="value-label" slot-scope="{ node }">{{ model(node.raw.label) }}</div>
        <div slot="option-label" slot-scope="{ node }">
          <span class='pl-1'>{{ model(node.raw.label) }}</span>
        </div>
      </treeselect>
    </b-form-group>
  </div>
</template>

<script>
import model from '@/utils/models'

export default {
  name: 'Course',
  props: {
    id: Number,
    value: Array,
    level: String,
    disabled: Boolean
  },
  data () {
    return {
      list: this.value,
      courses: {
        LMAG: [{ id: 'COUI', label: 'COUI' }, { id: 'COII', label: 'COII' }], // "Магистратура"
        LSPE: [{ id: 'COUI', label: 'COUI' }, { id: 'COII', label: 'COII' }, { id: 'CIII', label: 'CIII' }, { id: 'COIV', label: 'COIV' }, { id: 'COUV', label: 'COUV' }], // "Специалитет"
        LBAK: [{ id: 'COUI', label: 'COUI' }, { id: 'COII', label: 'COII' }, { id: 'CIII', label: 'CIII' }, { id: 'COIV', label: 'COIV' }] // "Бакалавриат"
      }
    }
  },
  created () {
    if (this.list && this.list.length) {
      this.format(JSON.parse(JSON.stringify(this.list)))
    }
  },
  methods: {
    model: name => model[name],
    format (newArr) {
      this.$emit('input', newArr)
    }
  },
  watch: {
    list (newVal) {
      this.format(JSON.parse(JSON.stringify(newVal)))
    }
  }
}
</script>
