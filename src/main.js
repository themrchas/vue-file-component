import { createApp} from 'vue'
//import './style.css'
//removed for custom element import App from './App.vue'

/** Added for custom element **/
import { defineCustomElement } from 'vue';
import FileDemo from './components/FileDemo.ce.vue'
/******/


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




  //const element = defineCustomElement(FileDemo);
 
const element = defineCustomElement(FileDemo, {
  plugins: [vuetify], // Ensure Vuetify is available in the component
  styles: ['@import "vuetify/styles";'], // Manually inject Vuetify styles
});




// for component createApp(App).use(vuetify).mount('#app')
customElements.define('test-file-demo',element);
