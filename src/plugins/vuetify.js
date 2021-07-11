import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
          light: {
            primary: '#ffffff',
            secondary: '#46a2fd',
            accent: '#1EAE98',
            error: '#FFE194',
          },
        },
      },
});
