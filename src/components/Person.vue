<template>
    <div class="person">
        <UserAvatar class="person__image" :user="localUser" />
        <div class="person__info">
            <div class="weight-bold mb-1" v-if="!!localUser" key="user-name">{{ userFullName(localUser) }}</div>
            <div :class="{ 'weight-bold': true, 'mt-2': !$slots.caption }" v-else key="user-name">Не назначен</div>
            <div class="text-caption mb-1">
                <slot name="caption" />
            </div>
            <template v-if="!!localUser && (!!localUser.programs || !!localUser.program)">
                <div v-if="localUser.program" class="text-caption mb-1 mt-1">
                    <div class="weight-medium">{{ localUser.program.uid }} {{ localUser.program.name }}</div>
                    <div v-if="localUser.program.ugn">{{ localUser.program.ugn.name }}</div>
                </div>
                <div class="text-caption mb-1 mt-1" v-for="program of localUser.programs" :key="program.id">
                    <div class="weight-medium">{{ program.uid }} {{ program.name }}</div>
                    <div v-if="program.ugn">{{ program.ugn.name }}</div>
                </div>
            </template>
            <div class="mb-1" v-if="!!localUser && localUser.phone">{{ localUser.phone }}</div>
            <template v-if="!noemail">
                <div v-if="!!localUser && localUser.email" key="user-email">{{ localUser.email }}</div>
                <div v-else-if="!!localUser && localUser.username" key="user-email">{{ localUser.username }}</div>
            </template>
        </div>
        <div class="person__btns" v-if="$slots.default">
            <slot />
        </div>
        <div class="person-footer" v-if="$slots.footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<script>
import { userFullName } from '@/utils'
import UserAvatar from '@/components/UserAvatar'

export default {
  name: 'Person',
  components: {
    UserAvatar
  },
  props: {
    user: Object,
    noemail: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    userFullName
  },
  computed: {
    localUser () {
      return !!this.user && !!this.user.user ? this.user.user : (this.user ? this.user : null)
    }
  }
}
</script>

<style>
.person {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
}
.person__image {
    width: 36px;
    height: 36px;
    margin-top: 0.25rem;
    flex: 0 0 36px;
}
.person__info {
    flex: 1;
}
.person__image + .person__info {
    margin-left: 14px;
}
.person .person-footer {
    width: 100%;
    flex: 0 0 100%;
    padding-top: 12px;
}
.person .person-footer svg {
    display: inline-block;
    margin-left: 8px;
}
.person .person__btns .btn {
    margin-right: 0;
}
.person .person__btns .btn + .btn {
    margin-left: 7px;
}
</style>
