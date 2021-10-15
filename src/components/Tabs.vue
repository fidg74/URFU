<template>
    <div class="ui-tabs">
        <label class="ui-tabs__item" v-for="item in items" :key="item.value">
            <input class="ui-tabs__radio" type="radio" :value="item.value" v-model="current" :name="uid">
            <div class="ui-tabs__label">
                <span>{{ item.label }}</span>
                <span v-if="item.count" class="ui-tabs__label__count primary-bg">{{ item.count }}</span>
            </div>
        </label>
    </div>
</template>

<script>
import { makeUID } from '@/utils';
export default {
    name: 'Tabs',
    props: {
        items: Array,
        value: String,
    },
    data () {
        return {
            uid: '',
            current: null,
        }
    },
    created () {
        this.uid = 'tab_' + makeUID(4);
        this.current = this.items.find(item => item.value === this.value).value;
    },
    watch: {
        current (newVal) {
            if (newVal) {
                this.$emit('input', newVal);
            } else {
                this.$emit('input', this.items[0].value);
            }
        },
    }
}
</script>

<style>
.ui-tabs {
    display: inline-block;
    background: rgba(57, 146, 255, 0.12);
    padding: 4px;
    border-radius: 6px;
    user-select: none;
}
.ui-tabs__item {
    display: inline-block;
    margin: 0;
}
.ui-tabs__radio {
      display: none;
}
.ui-tabs__item.active .ui-tabs__label,
.ui-tabs__radio:checked + .ui-tabs__label {
    background: #fff;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.12);
}
.ui-tabs__label {
    border-radius: 4px;
    font-weight: 500;
    padding: 6px 10px;
    transition: background 0.3s, box-shadow 0.5s;
    cursor: pointer;
}
.ui-tabs__label__count {
    display: inline-block;

    width: 14px;
    height: 14px;

    font-size: 10px;
    line-height: 14px;
    font-weight: 700;

    text-align: center;
    vertical-align: middle;

    border-radius: 50%;
    color: white;
}
@media (max-width: 575px) {
    .ui-tabs {
        display: block;
    }
    .ui-tabs__item {
        display: block;
    }
}
</style>