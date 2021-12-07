<template>
  <b-form-group label="Программа">
    <b-form-group class="form-input_select-modal form-input_icon">
      <b-button v-if="inputVal" @click="resetSelect(false)" class="btn_flat form-input__clear" variant="danger">Очистить</b-button>
      <b-form-input type="text" readonly placeholder="Выберите программу" v-b-modal="'programSelect_' + uid" :value="inputVal" />
      <b-icon-pencil v-if="inputVal" class="icon" />
      <i v-else class="icon icon-plus" />
    </b-form-group>

    <b-modal centered size="lg" :id="'programSelect_' + uid" title="Выбрать программу" @show="openModal">
      <div class="mt-2 mb-4 ml-2" v-if="user.isRop && showOnlyOwnProgSwither">
        <b-form-checkbox v-model="onlyOwnPrograms"> только свои программы</b-form-checkbox>
      </div>
      <b-form-input
        class="mb-4"
        autocomplete="off"
        v-model="search"
        placeholder="Поиск по образовательной программе"
      />
      <div class="input-list modal__input-list">
        <label :class="'custom-control custom-' + (multiple ? 'checkbox' : 'radio')" v-for="program in programsOptions" :key="program.id">
          <input :type="multiple ? 'checkbox' : 'radio'" :name="'programSelect_' + uid + '[]'" autocomplete="off" class="custom-control-input" v-model="programSelected" :value="program.id" :id="'programSelect_' + uid + '_' + program.id">
          <div class="custom-control-label">
            <span class="text-caption">{{ program.uid }}</span> {{ program.name }}
            <div class='text-caption' v-if="program.ugn">{{ program.ugn.name }}</div>
          </div>
        </label>
      </div>
      <template v-slot:modal-footer>
        <b-button variant="primary" @click="saveProgram">{{ btn ? btn : 'Выбрать программ' + (multiple ? 'ы' : 'у') }}</b-button>
        <b-button @click="$bvModal.hide('programSelect_' + uid)">Отменить</b-button>
      </template>
    </b-modal>
  </b-form-group>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { makeUID, declOfNum } from '@/utils'

export default {
  name: 'ProgramSelect',
  props: {
    value: [Array, Number],
    btn: String,
    multiple: {
      type: Boolean,
      default: false
    },
    initialPrograms: {
      type: Array,
      default: null
    },
    ignorePrograms: {
      type: Array,
      default: null
    },
    onlyOwnPrograms: {
      type: Boolean,
      default: false
    },
    showOnlyOwnProgSwither: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      uid: '',
      search: null,
      programSelected: null
    }
  },
  created () {
    this.uid = makeUID(3)
    this.programSelected = this.multiple ? [] : null
  },
  methods: {    
    openModal () {
      this.search = null
      this.programSelected = this.value || (this.multiple ? [] : null)
    },
    saveProgram () {      
      this.$emit('input', this.programSelected)
      this.$bvModal.hide('programSelect_' + this.uid)
      this.$emit('listCallBack')
    },
    resetSelect (onlyOwn) {
      if (onlyOwn && this.userPrograms && this.userPrograms.length === 1) {
        this.programSelected = this.multiple ? [this.userPrograms[0].id] : this.userPrograms[0].id
      } else {
        this.programSelected = this.multiple ? [] : null
      }
      this.$emit('input', this.programSelected)
    },
    showModal () {
      this.$bvModal.show('programSelect_' + this.uid)
    },
    
  },
  computed: {
    ...mapState({
      userPrograms: state => state.user.programs,
      user: state => state.user
    }),
    ...mapGetters('api', [
      'programsFilter',
      'getProgram'
    ]),
    programsOptions () {
      let programsRes = this.initialPrograms
        ? this.programsFilter(this.search, this.initialPrograms)
        : this.onlyOwnPrograms
          ? this.userPrograms 
          : this.programsFilter(this.search)
      if (this.ignorePrograms && this.ignorePrograms.length) {
        programsRes = programsRes.filter(program => !this.ignorePrograms.some(ignore => program.id === ignore))
      }
      return programsRes
    },
    inputVal () {
      if (Array.isArray(this.value)) {
        if (this.value.length > 1) {
          return declOfNum(this.value.length, ['Выбрана ', 'Выбраны ', 'Выбрано ']) + this.value.length + ' ' + declOfNum(this.value.length, ['программа', 'программы', 'программ'])
        } else {
          return this.value[0] ? this.getProgram(this.value[0]).name : null
        }
      } else {
        return this.value ? this.getProgram(this.value).name : null
      }
    }
  },
  watch: {
    value (newVal) {
      this.programSelected = newVal || (this.multiple ? [] : null)
    }
  }
}
</script>
