import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'

import { createVuetify } from 'vuetify';
import { VApp, VContainer, VFileInput, VBtn, VRow, VCol, VCheckbox } from 'vuetify/components'

import * as directives from 'vuetify/directives'
import 'vuetify/styles'

const vuetify = createVuetify({
    components : {
        VApp, VContainer, VFileInput, 
        VBtn, VRow, VCol,
        VCheckbox
     },
    directives,
  })

createApp(App).use(vuetify).mount('#app')
