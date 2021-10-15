<template>
  <div class="person">
    <UserAvatar class="person__image" :user="localUser" />
    <div class="person__info">
      <div class="weight-bold mb-1" v-if="!!localUser" key="user-name">{{ localUser.fullname ? localUser.fullname : 'Нет имени' }}</div>
      <div :class="{ 'weight-bold': true, 'mt-2': !$slots.caption }" v-else key="user-name">Не назначен</div>
      <div class="text-caption mb-1" v-if="$slots.caption">
        <slot name="caption" />
      </div>
      <div class="mb-1" v-if="!!localUser && localUser.phone">{{ localUser.phone }}</div>
      <template v-if="!noemail">
        <div v-if="!!localUser && localUser.email" key="user-email">{{ localUser.email }}</div>
        <div v-else-if="!!localUser && localUser.username" key="user-email">{{ localUser.username }}</div>
      </template>
    </div>

    <div class="person__btns" v-if="$slots.default">
      <slot />
    </div>
  </div>
</template>

<script>
import UserAvatar from '@/components/UserAvatar'

export default {
  name: 'PersonCrutch',
  components: {
    UserAvatar
  },
  props: {
    user: Object,
    noemail: Boolean
  },
  computed: {
    localUser () {
      const newUser = !!this.user && !!this.user.user ? this.user.user : (this.user ? this.user : null)
      if (newUser.fullname) {
        const name = newUser.fullname.split(' ')
        newUser.first_name = name[0] ? name[0] : ''
        newUser.last_name = name[1] ? name[1] : ''
      }
      return newUser
    }
  }
}
</script>

<style lang="stylus">
  .person {
    display: flex;
    width: 100%;
    &__image {
      width: 36px;
      height: 36px;
      margin-top: 0.25rem;
      flex: 0 0 36px;
    }
    &__info {
      flex: 1;
    }
    &__image + &__info {
      margin-left: 14px;
    }
  }
</style>
