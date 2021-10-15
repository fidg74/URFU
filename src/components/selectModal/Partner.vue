<template>
  <div>
    <b-button v-if="button" class="btn_flat" v-b-modal="'PartnerSelect_' + uid">
      <i class="fa fa-plus mr-2" />
      <span>Выбрать партнера</span>
    </b-button>
    <b-modal centered size="lg" :id="'PartnerSelect_' + uid" @show="openModal">
      <template v-slot:modal-title>
        <h2>Выбрать партнера</h2>
        <div class="h1__description">Выберите одного или нескольких партнеров, чтобы посмотреть их заявки</div>
      </template>

      <b-form-input
        class="mb-4 mt-2"
        autocomplete="off"
        v-model="search"
        placeholder="Поиск по партнерам"
      />
      <div v-if="partners && partners.length" class="input-list modal__input-list">
        <label class="custom-control custom-checkbox" v-for="partner in partnersFilter(search)" :key="partner.id">
          <input type="checkbox" :name="'PartnerSelected_' + uid + '[]'" autocomplete="off" class="custom-control-input" v-model="partnerSelected" :value="partner.id" :id="'PartnerSelect_' + uid + '_' + partner.id">
          <div class="custom-control-label">
            <b>{{ partner.name }}</b>
            <!-- <div class="text-caption">{{ partner.requests_count }} {{ declOfNum(partner.requests_count, ['заявка', 'заявки', 'заявок']) }}</div> -->
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
        <b-button variant="primary" @click="saveCurator" :disabled="partnerSelected.length === 0">Показать проекты</b-button>
        <b-button @click="$bvModal.hide('PartnerSelect_' + uid)">Отменить</b-button>
      </template>
    </b-modal>
  </div>
</template>


<script>
import { mapState, mapGetters } from 'vuex'
import { declOfNum, makeUID } from '@/utils'
export default {
  name: 'PartnerSelect',
  components: {},
  props: {
    // multiple - возможность множественного выбора
    multiple: {
      type: Boolean,
      default: false
    },
    button:  {
      type: Boolean,
      default: false
    },
    value: [Array, Number]
  },
  data() {
    return {
      uid: '',
      search: null,
      partnerSelected: []
    }
  },
  created () {
    this.uid = makeUID(3)
  },
  methods: {
    declOfNum,
    openModal () {
      this.$store.dispatch('api/FETCH_api', { key: 'partners' })
      this.search = null
      this.partnerSelected = this.value || []
    },
    saveCurator () {
      this.$emit('input', this.partnerSelected)
      this.$bvModal.hide('PartnerSelect_' + this.uid)
    }
  },
  computed: {
    ...mapState({
      partners: state => state.api.partners,
    }),
    ...mapGetters('api', [
      'partnersFilter'
    ])
  }
}
</script>
