import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

const light = {
    backgroundPrimary: '#f8fafb',
    backgroundSecondary: '#f5f5f5'
};

export default new Vuetify({
    theme: {
        themes: { light }
    }
});
