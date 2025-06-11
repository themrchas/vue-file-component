
import { defineCustomElement } from './defineCustomElementWithStyles'
//import { createApp} from 'vue'
//import './style.css'
//removed for custom element import App from './App.vue'

/** Added for custom element **/
//import { defineCustomElement } from 'vue';
//import FileDemo from './components/FileDemo.ce.vue'
/******/

import FileDemo from './components/FileDemo.ce.vue'


import { createVuetify } from 'vuetify';
import { VApp, VContainer, VFileInput, VBtn, VRow, VCol, VCheckbox } from 'vuetify/components'

import * as directives from 'vuetify/directives'
import 'vuetify/styles'

//Icon issue for checkboxes
import { aliases, mdi} from  'vuetify/iconsets/mdi-svg'
import {  mdiCheckBold, mdiCancel, mdiTrashCanOutline, mdiFileDownloadOutline } from '@mdi/js';



  //shadowNode name the name of the custom element
  const VUE_CUSTOM_COMPONENT_NAME = "test-file-demo";

  const vuetify = createVuetify({
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases: { 
          ...aliases,
         checkBold:mdiCheckBold,
        cancel:  mdiCancel,
        trashCan: mdiTrashCanOutline,
        fileDownloadOutline: mdiFileDownloadOutline
        },
        sets: {
          mdi,
        },
    },
    theme: {
      defaultTheme: 'light', //This controls Vuetify theme light; dark
  },

})


customElements.define(
    VUE_CUSTOM_COMPONENT_NAME,
    defineCustomElement(FileDemo, {
        plugins: [vuetify],
    })
)



/* This copies the stylesheet in <head> with id='vuetify-theme-stylesheet' to the shadowRoot.
This stylesheet is dynamically generated and vuetify puts it by defualt into the <head> tag.
*/
const vuetifyStyle = document.querySelector('#vuetify-theme-stylesheet');
console.log('stylesheet is',vuetifyStyle);

const shadowHost = document.querySelector(VUE_CUSTOM_COMPONENT_NAME);
console.log("shadowHost is",shadowHost);

const shadowRoot = shadowHost.shadowRoot;
console.log('shadowRoot is',shadowRoot);

if (vuetifyStyle) {
  const clonedStyle = vuetifyStyle.cloneNode(true);
  shadowRoot.appendChild(clonedStyle);
} 
else {
  console.warn('Vuetify theme style not found.');
}