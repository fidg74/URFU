<template>
  <div class="mb-sm-4 paginator" v-if="paginator.pages && paginator.pages.length > 1">
    <b-button v-if="paginator.current > 1" @click="clickPage(paginator.current - 1)" :disabled="paginator.current === 1" class="btn_flat btn--prev">
      <!-- <i class="fas fa-chevron-left" /> -->
      <div class="btn__arrow">
        <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.28711 1.28711L6.23686 6.23686L1.28711 11.1866" stroke="#467BE3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <span>Назад</span>
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
    <b-button @click="clickPage(paginator.current + 1)" :disabled="paginator.current === paginator.last" class="btn_flat btn--next">
      <!-- <i class="fas fa-chevron-right" /> -->
      <span>Далее</span>
      <div class="btn__arrow">
        <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.28711 1.28711L6.23686 6.23686L1.28711 11.1866" stroke="#467BE3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
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
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    &__active {}
    .btn {
      border-radius: 16 px;
      width: 30px;
      height: 30px;
      text-align: center;
      padding: 0;
      margin: 0;
      &.btn_flat {
        color: #007bff;
      }

      &--next {
        display: flex;
        align-items: center;
        margin-left: 12px;
        font-size: 14px;
        line-height: 20px;
        gap: 5px;
        font-weight: 400;
        width: fit-content;

        &:hover {
          background-color: none;
        }
      }

      &--prev {
        display: flex;
        align-items: center;
        margin-left: 12px;
        font-size: 14px;
        line-height: 20px;
        gap: 5px;
        font-weight: 400;
        width: fit-content;

        &:hover {
          background-color: none;
        }

        .btn {
          &__arrow {
            transform: rotate(180deg);
          }
        }
      }
    }
  }

  @media (max-width: 575px) {
    
  }
</style>
