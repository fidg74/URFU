import Vue from 'vue';

Vue.config.devtools = true;

// --------------------------------------------
// Plugins

import LoadScript from 'vue-plugin-load-script';
Vue.use(LoadScript);

import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
Vue.component('treeselect', Treeselect);

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
Vue.component('multiselect', Multiselect);

import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker';
import 'vue-airbnb-style-datepicker/dist/vue-airbnb-style-datepicker.min.css';
const datepickerOptions = {
    sundayFirst: false,
    dateLabelFormat: 'dddd, MMMM D, YYYY',
    days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
    daysShort: ['Пон', 'Вт', 'Ср', 'Чет', 'Пят', 'Суб', 'Вск'],
    monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
}
Vue.use(AirbnbStyleDatepicker, datepickerOptions);

import bootAxios from '@/boot/axios';
Vue.prototype.$axios = bootAxios;

Vue.prototype.$windowLocationOrigin = window.location.origin

// --------------------------------------------
// Directives

import pinAside from '@/directives/pin-aside';
Vue.directive('pin-aside', pinAside);

import pinBottom from '@/directives/pin-bottom';
Vue.directive('pin-bottom', pinBottom);

import clickOutside from '@/directives/click-outside';
Vue.directive('click-outside', clickOutside);

import collapseButtons from '@/directives/collapse-buttons';
Vue.directive('collapse-buttons', collapseButtons);

// --------------------------------------------
// Vue init

import App from './App.vue';
import '@/ui/ui.styl';
import '@/css/common.styl';

import router from '@/router';
import store from '@/store';

export const app = new Vue({
    router,
    store,
    render: createElement => createElement(App),
}).$mount('#app');
