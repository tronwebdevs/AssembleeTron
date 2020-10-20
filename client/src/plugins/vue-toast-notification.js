import Vue from 'vue';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
import '@/scss/_toast-custom.scss';

Vue.use(VueToast, {
    position: 'top'
});
