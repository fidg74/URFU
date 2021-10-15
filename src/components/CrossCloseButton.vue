<template>
  <button @click="$emit('click')" type="close" aria-label="Close" class="close-btn">
    <span aria-hidden="true">x</span>
  </button>
</template>

<script>
export default {

}
</script>

<style lang="stylus">
.close-btn {
  background: none;
  box-shadow: 0px 0px 0px transparent;
  border: 0px solid transparent;
  text-shadow: 0px 0px 0px transparent;
  text-align: center;
  user-select: none;
  & span {
    width: 15px;
    height: 15px;
    position: relative;
    color: #fff;
    &:before,
    &:after {
      content: '';
      height: 15px;
      border-left: 2px solid #9DA7B0;
      position: absolute;
      left: 6.5px;
    }
    &:before {
      transform: rotate(45deg);
    }
    &:after {
      transform: rotate(-45deg);
    }
  }
  &:hover > span {
    &:before, &:after {
      border-left: 2px solid #000;
    }
  }
  &:focus {
    outline: none
  }
}
</style>