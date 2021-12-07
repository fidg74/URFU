<template>
  <div>
    <b-button v-if="button" class="btn_flat" v-b-modal="'ManagerSelect_' + uid">
      <i class="fa fa-plus mr-2" />
      <span>Выбрать заказчика</span>
    </b-button>
    <b-modal centered size="lg" :id="'ManagerSelect_' + uid" title="Выбрать заказчика" @show="openModal">
      <b-form-input
        class="mb-4"
        autocomplete="off"
        v-model="search"
        placeholder="Введите ФИО или почту"
      />
      <div v-if="managers && managers.length" class="user-list modal__input-list">
        <label class="custom-control custom-checkbox" v-for="manager in managersFilter(search, related)" :key="manager.id">
          <input type="checkbox" :name="'managerSelected_' + uid + '[]'" autocomplete="off" class="custom-control-input" v-model="managerSelected" :value="manager.id" :id="'managerSelected_' + uid + '_' + manager.id">
          <div class="custom-control-label">
            <Person :user="manager" />
          </div>
        </label>
      </div>
      <div v-else>
        <div class="skeleton mt-1" style="height: 69px" />
        <div class="skeleton mt-1" style="height: 69px" />
        <div class="skeleton mt-1" style="height: 69px" />
        <div class="skeleton mt-1" style="height: 69px" />
      </div>
      <template v-slot:modal-footer>
        <b-button variant="primary" @click="saveManager">{{ btnText }}</b-button>
        <b-button @click="$bvModal.hide('ManagerSelect_' + uid)">Отменить</b-button>
      </template>
    </b-modal>
  </div>
</template>


<script>
import { mapState, mapGetters } from 'vuex'
import { makeUID } from '@/utils'

import Person from '@/components/Person'

export default {
  name: 'ManagerSelect',
  components: {
    Person
  },
  props: {
    // multiple - возможность множественного выбора
    multiple: {
      type: Boolean,
      default: false
    },
    // related - выбор куратора только среди тех кто относится к проектам текущего ропа
    related: {
      type: Boolean,
      default: false
    },
    button: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: 'Показать проекты'
    },
    value: [Array, Number]
  },
  data () {
    return {
      uid: '',
      search: null,
      managerSelected: []
    }
  },
  created () {
    this.uid = makeUID(3)
  },
  methods: {
    openModal () {
      this.$store.dispatch('api/FETCH_api', { key: 'managers' })
      this.search = null
      this.managerSelected = this.value || []
    },
    saveManager () {
      this.$emit('input', this.managerSelected)
      this.$bvModal.hide('ManagerSelect_' + this.uid)
    }
  },
  computed: {
    ...mapState({
      managers: state => state.api.managers,
    }),
    ...mapGetters('api', [
      'managersFilter'
    ])
  }
}
</script>
