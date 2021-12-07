<template>
  <div class="message">
    <UserAvatar  v-if="message.sender" class="message__user-avatar" :user="message.sender" />
    <div class="message__content">
      <div class="message__date text-caption">{{ dateToWord(message.date || message.created_at) }}</div>
      <b v-if="message.sender" class="message__user-name">{{ userFullName(message.sender) }}</b>
      <div style="white-space: pre-wrap;" >{{ message.user_text || message.text }}</div>
    </div>
  </div>
</template>

<script>
import { userFullName, dateToWord } from '@/utils'
import UserAvatar from '@/components/UserAvatar'

export default {
  name: 'Message',
  components: {
    UserAvatar
  },
  props: {
    message: Object
  },
  methods: {
    userFullName,
    dateToWord
  }
}
</script>
<style lang="stylus">
  .message {
    margin-bottom: 8px;
    display: flex;
    align-items: flex-end;
    &__user {
      &-name {
        font-weight: 500;
        margin-bottom: 4px;
      }
      &-avatar {
        flex: 36px 0 0;
        z-index: 12;
      }
    }
    &__date {
      float: right;
    }
    &__content {
      position: relative;
      flex: 1 0 0;
      margin-left: 8px;
      padding: 16px 24px;
      background: #F1F5FD;
      border-radius: 6px;
      border-bottom-left-radius: 0;
      &:after {
        content: "";
        position: absolute;
        right: 100%;
        bottom: 0;
        width: 0px;
        height: 0px;
        border-right: 10px solid #F1F5FD;
        border-bottom: 16px solid #F1F5FD;
        background: #F1F5FD;
        z-index: 10;
      }
      &:before {
        content: "";
        position: absolute;
        right: 100%;
        bottom: -1px;
        width: 12px;
        height: 20px;
        border-bottom-right-radius: 12px;
        background: #ffffff;
        z-index: 11;
      }
    }
  }
</style>
