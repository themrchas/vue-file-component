import { createApp} from 'vue'
//import './style.css'
import App from './App.vue'

import { createVuetify } from 'vuetify';
import { VApp, VContainer, VFileInput, VBtn, VRow, VCol, VCheckbox } from 'vuetify/components'

import * as directives from 'vuetify/directives'
import 'vuetify/styles'

//Icon issue for checkboxes
import { aliases, mdi} from  'vuetify/iconsets/mdi-svg'
import { mdiAccount } from '@mdi/js';

/* pre @mdi/js
const vuetify = createVuetify({
    components : {
        VApp, VContainer, VFileInput, 
        VBtn, VRow, VCol,
        VCheckbox
     },
    directives,
    icons: {
      defaultSet: 'mdi'
    }
  })
    */

  const vuetify = createVuetify({
    components : {
        VApp, VContainer, VFileInput, 
        VBtn, VRow, VCol,
        VCheckbox
     },
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
          sets: { mdi },

      
    },
  })


createApp(App).use(vuetify).mount('#app')
