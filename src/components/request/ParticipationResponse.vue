<template>
  <div class="like-btn">
    <b-button class="mr-2" variant="primary" @click="participationResponse(true)">Подтвердить</b-button>
    <b-button class="mr-0" variant="danger"  v-b-modal="modalId">Отклонить</b-button>

    <b-modal :id="modalId" size="lg" centered title="Отказать в участии">
      <Person :user="participant" />
      <b-form-textarea
        class="mt-4"
        v-model.trim="comment"
        placeholder="Напишите причину отказа"
        rows="5"
      />
      <template v-slot:modal-footer>
        <b-button variant="primary" :disabled="!(comment && comment.length)" @click="participationResponse(false)">Отправить</b-button>
        <b-button @click="$bvModal.hide(modalId)">Отмена</b-button>
      </template>
    </b-modal>
  </div>
</template>


<script>
// import { mapGetters } from 'vuex'
import { makeUID } from '@/utils'

import Person from '@/components/Person'

export default {
  name: 'ParticipationResponse',
  components: {
    Person
  },
  props: {
    projectId: Number,
    participant: Object,
  },
  data() {
    return {
      modalId: null,
      comment: null,
    }
  },
  created () {
    const uid = makeUID(3)
    this.modalId = 'participationResponseComment_' + uid
  },
  methods: {
    resetData () {
      this.comment = null
      this.$bvModal.hide(this.modalId)
    },
    participationResponse(is_accept) {
      const formData = new FormData()
      formData.set('participant', this.participant.id.toString())
      formData.set('action', is_accept ? 'accept' : 'decline')
      if (!is_accept)
        formData.set('user_text', this.comment)
      
      this.$store.dispatch('project/participationResponse', {
        id: this.projectId,
        accept: is_accept,
        participant: this.participant,
        params: formData,
      }).then((data) => {
        this.resetData();
        this.$emit('update-project', data.project)
      });
    },
  },
}
</script>
