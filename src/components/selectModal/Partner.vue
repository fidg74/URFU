<template>
  <div>
    <b-button v-if="button" class="btn_flat" v-b-modal="'PartnerSelect_' + uid">
      <span class="btn-plus d-sm-none">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.3">
                <path d="M6 1V11" stroke="#467BE3" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M11 6L1 6" stroke="#467BE3" stroke-width="1.5" stroke-linecap="round"/>
                </g>
            </svg>
        </span>
      <i class="fa fa-plus mr-2" />
      <span>Выбрать партнера</span>
    </b-button>
    <b-modal ref="partnerModal" :modal-class="myclass" centered size="lg" :id="'PartnerSelect_' + uid" @show="openModal">
      <template v-slot:modal-title>
        <h2>Выбрать партнера</h2>
        <div class="h1__description">Выберите одного или нескольких партнеров, чтобы посмотреть их заявки</div>
      </template>

      <div class="mobile-modal-header d-sm-none">
          <div class="choose-back" @click="hideModal">
              <svg width="18" height="9" viewBox="0 0 18 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.16424 1.33576L1.17145 4.32855M1.17145 4.32855L4.16424 7.32134M1.17145 4.32855H16.8285" stroke="#467BE3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
          </div>
          <h5 class="modal-title">Выбрать партнера</h5>
      </div>

      <div class="h1__description">Выберите одного или нескольких партнеров, чтобы посмотреть их заявки</div>

      <b-form-input
        class="mb-3 mb-sm-4 mt-sm-2"
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
        <b-button class="cancel" @click="$bvModal.hide('PartnerSelect_' + uid)">Отменить</b-button>
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
      partnerSelected: [],
      myclass: 'partner-modal'
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
    },
    hideModal() {
      this.$refs.partnerModal.hide()
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

<style scoped>
    @media (max-width:575px) {
        button {
            background: none !important;
            font-size: 16px !important;
            color: #467BE3 !important;
            height: unset !important;
        }

        .btn-plus {
            margin-right: 10px;
            padding-bottom: 2px;
        }

        /deep/ .partner-modal .modal-dialog {
            margin: 0;
        }

        /deep/ .partner-modal .modal-content {
            min-height: 100vh;
            border-radius: 0;
        }

        /deep/ .partner-modal .modal-header {
            display: none;
        }

        /deep/ .mobile-modal-header {
            display: flex;
            align-items: center;
            width: 100%;
            height: 55px;
        }

        /deep/ .partner-modal .modal-body {
            padding: 0 13px;
        }

        /deep/ .partner-modal .choose-back {
            margin-right: 25px;
        }

        /deep/ .partner-modal .modal-footer {
            padding: 0 13px 15px;
        }

        /deep/ .partner-modal button:not(.cancel) {
            height: 40px !important;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            color: #fff !important;
            background: #467BE3 !important;
            font-size: 13px !important;
            margin: 0;
        }

        /deep/ .partner-modal .cancel {
            display: none;
        }

        /deep/ .h1__description {
            font-size: 14px;
            line-height: 18px;
        }

        /deep/ .custom-control {
          padding: 0;
        }

        /deep/ .custom-control-label::before {
            top: 21px !important;
            transform: none !important;
        }

        /deep/ .custom-control-label::after {
            top: 21px !important;
            transform: none !important;
        }

        /deep/ .custom-control b {
            font-weight: 400;
        }

        /deep/ .input-list .custom-checkbox:hover {
          background: none;
        }

        /deep/ .partner-modal .cancel {
            display: none;
        }

        /deep/ .modal__input-list {
          max-height: 350px;
          margin-bottom: 20px;
        }
    }
</style>>
