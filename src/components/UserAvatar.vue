<template>
  <div class="user-avatar" :class="{'user-avatar_nouser': !user}" :style="avatarStyleObject">
    <div v-if="user && !user.avatar && short" class="user-avatar__name">
      {{ short }}
    </div>
  </div>
</template>

<script>
const bgPalette = ['057DCD', '43B0F1', '059ECB', '1246AD', '21B6A8', '18A558', '4B7BF5', '2255DC', 'F8CF40', 'F99B45', 'D95980', 'DB1F48']

export default {
  name: 'UserAvatar',
  props: {
    user: Object,
    size: {
      type: Number,
      default: 36
    }
  },
  computed: {
    avatarStyleObject() {
      const styleObject = {
        'width': `${this.size}px`,
        'height': `${this.size}px`,
      }
      if (this.user) {
        if (this.user.avatar) {
          styleObject.backgroundImage = `url(${ this.user.avatar })`
        } else {
          styleObject.backgroundColor = '#' + bgPalette[this.user.id % (bgPalette.length - 1)]
        }
      }
      return styleObject
    },
    short () {
      return (this.user.last_name ? this.user.last_name[0] : '') + (this.user.first_name ? this.user.first_name[0] : '')
    }
  }
}
</script>
<style lang="stylus">
  .user-avatar {
    display: inline-block;
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    text-align: center;
    &:before {
      content: '';
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
    &_nouser {
      background: url('../assets/img/user_null.svg') no-repeat 0 0;
    }
    &__name {
      display: inline-block;
      vertical-align: middle;
      font-size: 16px;
      line-height: 37px;
      font-weight: 500;
      color: #fff;
      padding-left: 1px;
      text-transform: uppercase;
      text-shadow: 0 0 5px rgba(50, 50, 50, 0.2);
    }
  }
</style>
