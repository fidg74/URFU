<template>
    <b-button :variant="variant" :class="btnClass" v-b-modal="'CuratorSelect_' + uid">
        <slot v-if="$slots.button" name="button" />
        <span v-else>{{ title }}</span>
        <b-modal centered size="lg" :id="'CuratorSelect_' + uid" :title="title" @show="openModal">
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
                <b-button @click="$bvModal.hide('CuratorSelect_' + uid)">
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
