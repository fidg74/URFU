<template>
    <b-button variant="primary" size="md" v-b-modal="'inviteRop_' + uid" >
        <b-icon icon="plus" />
        <span>{{ btnText }}</span>

        <b-modal :id="'inviteRop_' + uid" class="all-roles__modal" size="lg" centered title="Пригласить руководителя образовательной программы">
            <b-form-group class="form__search">
                <b-form-input class="form__search-input" v-model="search" required autocomplete="off" type="text" placeholder="Поиск по направлению, программе или ФИО" />
                <button class="form__search-close" @click="search = null" />
            </b-form-group>
            <b-form-group>
                <b-form-radio-group class="user-list modal__input-list" v-model="ropSelected" stacked>
                    <b-form-radio v-for="rop in ropsFilter(search, ignore)" :key="rop.id" :value="rop" variant="primary">
                        <Person :user="rop" />
                    </b-form-radio>
                </b-form-radio-group>
            </b-form-group>
            <template v-slot:modal-footer>
                <b-button variant="primary" :disabled="!ropSelected" v-b-modal="'inviteRopComment_' + uid" @click="$bvModal.hide('inviteRop_' + uid)">Далее</b-button>
                <b-button @click="$bvModal.hide('inviteRop_' + uid)">Отменить</b-button>
            </template>
        </b-modal>
        
        <b-modal :id="'inviteRopComment_' + uid" v-if="ropSelected" class="all-roles__modal" size="lg" centered title="Пригласить руководителя образовательной программы">
            <b-button variant="primary" class="btn_flat mb-3" v-b-modal="'inviteRop_' + uid" @click="$bvModal.hide('inviteRopComment_' + uid)">Выбрать другого сотрудника</b-button>
            <Person :user="ropSelected" />
            <b-form-textarea
                class="mt-4"
                v-model.trim="comment"
                placeholder="Напишите руководителю полезные детали проекта"
                rows="5"
            />
            <template v-slot:modal-footer>
                <b-button variant="primary" :disabled="!ropSelected || !(comment && comment.length)" @click="inviteRop">Отправить приглашение</b-button>
                <b-button @click="$bvModal.hide('inviteRopComment_' + uid)">Отменить</b-button>
            </template>
        </b-modal>
    </b-button>
</template>


<script>
import { mapGetters } from 'vuex'
import { makeUID } from '@/utils'

import Person from '@/components/Person'

export default {
  name: 'InviteRop',
  components: {
    Person
  },
  props: {
    projectId: Number,
    // ignore - Array - массив id пользователей которых не должно быть в списке приглашений
    ignore: Array,
    btnText: {
      type: String,
      default: 'Пригласить РОПа'
    },
  },
  data() {
    return {
      search: null,
      ropSelected: null,
      comment: null
    }
  },
  created () {
    this.uid = makeUID(3)
  },
  methods: {
    resetData () {
      this.search = null
      this.ropSelected = null
      this.comment = null
      this.$bvModal.hide('inviteRop_' + this.uid)
      this.$bvModal.hide('inviteRopComment_' + this.uid)
    },
    inviteRop () {
      this.$store.dispatch('project/inviteRop', { id: this.projectId, params: {
        'teacher': this.ropSelected.id,
        'message': this.comment
      }}).then(() => {
        this.$emit('update')
        this.resetData()
      })
    }
  },
  computed: {
    ...mapGetters('api', [
      'ropsFilter'
    ])
  }
}
</script>
