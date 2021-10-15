<template>
  <div class="mb-4 paginator" v-if="paginator.pages && paginator.pages.length > 1">
    <b-button @click="clickPage(paginator.current - 1)" :disabled="paginator.current === 1" class="btn_flat">
      <i class="fas fa-chevron-left" />
    </b-button>
    <b-button
      v-for="page in paginator.pages"
      :key="page[1]"
      @click="clickPage(page[1])"
      :disabled="!page[1]"
      variant="primary"
      :class="paginator.current === page[1] ? 'btn-primary paginator__active' : 'btn_flat'"
    >
      {{ page[1] ? page[1] : '...' }}
    </b-button>
    <b-button @click="clickPage(paginator.current + 1)" :disabled="paginator.current === paginator.last" class="btn_flat">
      <i class="fas fa-chevron-right" />
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'Paginator',
  props: {
    pages: Array
  },
  methods: {
    clickPage (num) {
      this.$emit('change-page', num)
    }
  },
  computed: {
    paginator () {
      return {
        current: this.pages.find(item => item[2] === true)[1],
        pages: this.pages,
        last: this.pages[this.pages.length - 1][1]
      }
    }
  }
}
</script>

<style lang="stylus">
  .paginator {
    &__active {}
    & .btn {
      border-radius: 16 px;
      width: 32px;
      height: 32px;
      text-align: center;
      padding: 0;
      margin: 0;
      &.btn_flat {
        color: #007bff;
      }
    }
  }
</style>
