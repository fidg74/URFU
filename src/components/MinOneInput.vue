<template>  
  <b-form-input
    v-model.number="localValue"
    :disabled="disabled"
    :placeholder="placeholder"
    @keypress="isNumber"
    type="number"
    min="1"
    autocomplete="off"    
  />  
</template>

<script>
export default {
  name: "MinOneInput",
  props: {
    disabled: Boolean,
    value: [Number, String],
    placeholder: String,
    onlyInteger: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localValue: null,
    };
  },
  created() {
    this.localValue = this.value
  },
  methods: {
    isNumber(evt) {
      evt = evt ? evt : window.event
      const charCode = evt.which ? evt.which : evt.keyCode      
      if (charCode === 46 && this.onlyInteger) {
        evt.preventDefault()        
      }
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault()
      } else {
        return true
      }
    },
  },
  computed: {
    localVal() {
      const val =
        this.localValue === 0
          ? 1 : typeof this.localValue === "number"
          ? this.localValue : null
      return val
    },
  },
  watch: {
    localValue(newVal) {
      if (newVal === 0) {
        this.$nextTick(() => {
          this.localValue = 1
        })
      } else {
        this.$emit("input", this.localVal)
        this.localValue = this.localVal
      }
    },
    value(newVal) {
      if (newVal !== this.localValue) {
        this.localValue = this.value
      }
    },
  },
};
</script>
