<template>
    <b-button variant="primary" @click="checkAcceptProject">Принять проект в&nbsp;работу

        <b-modal :id="'acceptProjectStopper_' + uid" centered size="lg" hide-header>
            <h2>Запуск проекта</h2>
            <div v-if="offers && offers.length > 0" class="mb-3">
                <div class="h1__description mb-3">Еще не все руководители ответили на приглашение</div>
                <div class="user-list__item" v-for="offer of offers" :key="offer.id">
                    <Person v-if="offer.type === 'participation_invite' || offer.type === 'teacher_change_offer'" :user="getRop(offer.user.id)">
                        <b-badge variant="warning">Не подтвержден</b-badge>
                    </Person>
                </div>
            </div>
            <div v-if="participationRequests && participationRequests.length > 0">
                <div class="h1__description mb-3">У вас есть запросы на&nbsp;участие</div>
                <div class="user-list__item" v-for="participationRequest of participationRequests" :key="participationRequest.user.id">
                    <Person :user="participationRequest.user">
                        <ParticipationResponse :projectId="project.id" :participant="participationRequest.user" @update-project="(projectData) => $emit('update-project', projectData)" />
                    </Person>
                </div>
            </div>
            <template v-slot:modal-footer>
                <b-button variant="primary" @click="acceptProject">Далее</b-button>
                <b-button @click="$bvModal.hide('acceptProjectStopper_' + uid)">Отмена</b-button>
            </template>
        </b-modal>
    </b-button>
</template>

<script>
import { mapGetters } from 'vuex';
import { makeUID } from '@/utils';

import Person from '@/components/Person';
import ParticipationResponse from '@/components/request/ParticipationResponse';

export default {
  name: 'InviteRop',
  components: {
    Person,
    ParticipationResponse
  },
  props: {
    project: Object
  },
  data() {
    return {
    }
  },
  created () {
    this.uid = makeUID(3)
  },
  methods: {
    checkAcceptProject () {
      const hasOffer = this.offers.length > 0
      const hasRequests = this.participationRequests && this.participationRequests.length > 0
      if (hasOffer || hasRequests) {
        this.$bvModal.show('acceptProjectStopper_' + this.uid)
      } else {
        this.acceptProject()
      }
    },
    acceptProject () {
      this.$bvModal.hide('acceptProjectStopper_' + this.uid)
      const messageVNode = this.$createElement('div', { domProps: { innerHTML: '<p>Заказчик получит подтверждение о&nbsp;принятии заявки. Вы&nbsp;сможете приступить к&nbsp;формированию паспорта.</p>' } })
      this.$bvModal.msgBoxConfirm([messageVNode], {
        title: 'Принять проект в работу',
        okTitle: 'Принять',
        okVariant: 'primary',
        size: 'md',
        cancelTitle: 'Отменить',
        hideHeaderClose: false,
        centered: true
      }).then(value => {
        if (value) {
          this.$store.dispatch('project/acceptProject', { 
            id: this.project.id 
          }).then(data => {
            this.$emit('update-project', data.project)
          })
        }
      })
    }
  },
  computed: {
    ...mapGetters('api', [
      'getRop'
    ]),
    participationRequests() {
      return this.project.participation_requests ? this.project.participation_requests.filter(request => request.status === null) : []
    },
    offers() {
      return this.project.offers ? this.project.offers.filter(offer => offer.status === 'active') : []
    },
  }
}
</script>
<style lang="stylus">
.user-list__item {
  padding: 1rem 0;
  border-bottom: 1px solid rgba(10, 10, 10, 0.1);
  &:last-child {
    border-bottom: none;
  }
}
</style>