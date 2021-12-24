<template>
    <b-button :variant="variant" :class="btnClass" v-b-modal="'CuratorSelect_' + uid">
        <span class="btn-plus d-sm-none">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.3">
                <path d="M6 1V11" stroke="#467BE3" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M11 6L1 6" stroke="#467BE3" stroke-width="1.5" stroke-linecap="round"/>
                </g>
            </svg>
        </span>
        <slot v-if="$slots.button" name="button" />
        <span v-else>{{ title }}</span>
        <b-modal ref="chooseModal" :modal-class="myclass" centered size="lg" :id="'CuratorSelect_' + uid" :title="title" @show="openModal">
            <div class="mobile-modal-header d-sm-none">
                <div class="choose-back" @click="hideModal">
                    <svg width="18" height="9" viewBox="0 0 18 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.16424 1.33576L1.17145 4.32855M1.17145 4.32855L4.16424 7.32134M1.17145 4.32855H16.8285" stroke="#467BE3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h5 class="modal-title">{{ title }}</h5>
            </div>
            <b-form-input
                class="mb-4"
                autocomplete="off"
                v-model="search"
                placeholder="Введите ФИО или почту"
            />
            <div v-if="curators && curators.length" class="user-list modal__input-list">
                <label v-for="curator in curatorsFilter(search, related)" :key="curator.id"
                    :class="{ 'custom-control': 1, 'custom-checkbox': multiple, 'custom-radio': !multiple }"
                >
                    <input
                        :type="multiple ? 'checkbox' : 'radio'"
                        :name="'curatorSelected_' + uid + '[]'"
                        autocomplete="off"
                        class="custom-control-input"
                        v-model="curatorSelected"
                        :value="curator.id"
                        :id="'curatorSelect_' + uid + '_' + curator.id">
                    <div class="custom-control-label">
                        <Person :user="curator" />
                    </div>
                </label>
            </div>
            <div v-else>
                <div class="skeleton mt-1" style="height: 69px" />
                <div class="skeleton mt-1" style="height: 69px" />
                <div class="skeleton mt-1" style="height: 69px" />
                <div class="skeleton mt-1" style="height: 69px" />
                <div class="skeleton mt-1" style="height: 69px" />
                <div class="skeleton mt-1" style="height: 69px" />
            </div>
            <template v-slot:modal-footer>
                <b-button
                    :disabled="curatorSelectedDisabled"
                    variant="primary"
                    @click="saveCurator">
                    {{ submitText }}
                </b-button>        
                <b-button class="cancel" @click="$bvModal.hide('CuratorSelect_' + uid)">
                    Отменить
                </b-button>
            </template>
        </b-modal>
    </b-button>
</template>


<script>
import { mapState, mapGetters } from 'vuex';
import { makeUID } from '@/utils';

import Person from '@/components/Person';

export default {
    name: 'CuratorSelect',
    components: {
        Person,
    },
    props: {
        // multiple - возможность множественного выбора
        multiple: {
            type: Boolean,
            default: false,
        },
        // related - выбор куратора только среди тех кто относится к проектам текущего ропа
        related: {
            type: Boolean,
            default: false,
        },
        btnClass: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: 'Выбрать куратора',
        },
        submitText: {
            type: String,
            default: 'Выбрать куратора',
        },
        variant: {
            type: String,
            default: 'primary',
        },
        value: [Array, Number],
    },
    data () {
        return {
            uid: '',
            search: null,
            curatorSelected: this.multiple ? [] : null,
            myclass: 'choose-modal'
        }
    },
    created () {
        this.uid = makeUID(3);
    },
    methods: {
        openModal () {
            this.$store.dispatch('api/FETCH_api', { key: 'curators' });
            this.search = null;
            this.curatorSelected = this.value || this.multiple ? [] : null;
        },
        saveCurator () {
            this.$emit('input', this.curatorSelected);
            this.$bvModal.hide('CuratorSelect_' + this.uid);
        },
        hideModal() {
            this.$refs.chooseModal.hide()
        }
    },
    computed: {
        curatorSelectedDisabled () {
            if (this.multiple) {
                return Array.isArray(this.curatorSelected) && (this.curatorSelected.length === 0)
            } else {
                return this.curatorSelected === null
            }
        },
        ...mapState({
            curators: state => state.api.curators,
        }),
        ...mapGetters('api', [
            'curatorsFilter',
        ]),
    }
}
</script>

<style scoped>
    @media (max-width: 575px) {
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

        /deep/ .choose-modal .modal-dialog {
            margin: 0;
        }

        /deep/ .choose-modal .modal-content {
            min-height: 100vh;
            border-radius: 0;
        }

        /deep/ .choose-modal .modal-header {
            display: none;
        }

        /deep/ .mobile-modal-header {
            display: flex;
            align-items: center;
            width: 100%;
            height: 55px;
        }

        /deep/ .choose-modal .modal-body {
            padding: 0 13px;
            flex: none;
        }

        /deep/ .choose-modal .choose-back {
            margin-right: 25px;
        }

        /deep/ .choose-modal .modal-footer {
            padding: 0 13px 15px;
        }

        /deep/ .choose-modal button:not(.cancel) {
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

        /deep/ .choose-modal .cancel {
            display: none;
        }
    }
</style>