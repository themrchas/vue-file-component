# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

### This branch creates a vue custom component (element) with vuetify and pnpjs.
- The pnpjs rotuines are yet to be debugged, but wwere working in the 'main' branch using vuejs in component mode (non custom element)
- Used this repo as a startring point for using vuetify in a vue custom component: https://github.com/OnlyLoveOleg/vue3-vuetify-webcomponent


### stackoverflow has discussions on how to debug vue. Created a launch.json file per the link below with entry 'it should be quite simple'. done in chrome.
launch.json: Run -> Add Configuration ->  "url": "http://localhost:5173",   Port is whatver shows when invoking vite as 'npm run dev'
stackoverflow.com/questions/66147328/is-there-a-way-to-debug-cod-in-vscode-initiated-with-vite

Used node version 18.20.8

https://github.com/SharePoint/PnP-JS-Core/wiki/Basic--Operations   
more pnpjs mentioned in stackoverflow https://sharepoint.stackexchange.com/questions/312737/how-do-you-initialize-pnpjs-when-its-running-in-the-context-of-a-sharepoint-sit

### Solution for the target document library name in getFolderByServerRelativeUrl
https://stackoverflow.com/questions/26182858/http-400-bad-request-when-using-getfilebyserverrelativeurl-or-getfolderbyserverr

### The v-checkbox does not display the box icon by default. Needed to add the @mdi/js package and use the following to have checkbox displays...
Used answer by 'theking' to modify main.js
https://stackoverflow.com/questions/67636717/v-checkbox-icon-missing-with-vuetify-mdi-js-whats-the-best-way-to-import-it



