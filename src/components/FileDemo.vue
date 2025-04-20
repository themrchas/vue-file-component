<template id="test">
    
    <v-app>
    <v-container>
      <v-file-input
        label="Upload your file"
        v-model="fileNameSelected"
      />
      <v-file-input
        label="Upload your file to a SharePoint list"
        v-model="fileNameForList"
      />
    </v-container>
  </v-app>

  <div display="flex" flex-flow="space-around" style="width:600px">
    <button type="button" @click="addFileToSharePoint">Add to Doc Lib</button>
    <button type="button" @click="addFileToSharePointList">Add to List Item</button>
  </div>
 

  <h2>{{ fileName }}</h2>

  <br/>
  <br/>

  <input type="file" id="fileInput" ></input>
  <button type="button" @click="addInputFileToSharePoint">Add file</button>
     



</template>

<script>

import { ref, defineComponent, watch, computed } from 'vue';

import { ConsoleListener, Logger, LogLevel } from "@pnp/logging";
import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/attachments";
import "@pnp/sp/items";
import {List } from "@pnp/sp/lists";





export default defineComponent({
   
    name: 'FileDemo', 
    
    setup(props) {

      let url = "http://sp-dev-sp/sites/dev";
     // let url = "https://command.nshq.nato.int/sites/CS/ikm/KnowledgePortal/sandbox/chaskm/";
   //let url = "/sites/CS/ikm/KnowledgePortal/sandbox/chaskm/";
      

      let sharePointListName = "PNPTest"
      let itemId = 1;

      

      console.log('starting setup routine');
        
        //Vue name for file chosen to be saved to a Document Library 
        let fileNameSelected = ref(null);

        //Vue name for file chosen to be saved to a SharePoint list item
        let fileNameForList = ref(null);
       
        //Name of file to be uploaded using HTMLElement to a Document Library
        const fileName = computed(() => {
          return fileNameSelected.value?.name ? fileNameSelected.value.name : "No file has been selected"
        })

        watch(fileNameSelected,() => {
          console.log('fileNameSelected changed - ',fileNameSelected.value);
     
        })



      sp.setup({

        pageContext: {
          web: {
            baseUrl: url,
            absoluteUrl: url

          }
        }
      }); //sp.setup




      /* Add file to SharePoint Document Library using Vuetify File */
      const addFileToSharePoint = async () => {

        Logger.write(`Saving the file using Vuetify file having file size ${fileNameSelected.value.size}`);

        //This is a Vue ref object , so need to access propertied using '.value'
        let file = fileNameSelected

        //Grab the web information using pnpjs
        const web = Web(url);

        //Adjust this number to control what size files are uploaded in chunks
        if (file.value.size <= 10485760) {

          await web.getFolderByServerRelativeUrl("Shared Documents/").files.add(file.value.name, file.value, true);

        } 

        // large upload
        else {
          
          await web.getFolderByServerRelativeUrl("Shared Documents/").files.addChunked(file.name, file.value, data => {

          Logger.log({ data: data, level: LogLevel.Verbose, message: "progress" });

          }, true);

        }

        Logger.write("File upload complete.");


      } //addFileToSharePoint


      /* Add file to SharePoint Document Library using HTMLElement <input>*/  
        const addInputFileToSharePoint = async () => {

          
          var files = document.getElementById("fileInput").files;
          var file = files[0];

          Logger.write(`Saving the file using Vuetify file having file size ${file.size}`);

           //Grab the web information using pnpjs
          const web = Web(url);
          
          await web.getFolderByServerRelativeUrl("Shared Documents/").files.add(file.name, file, true);

          Logger.write("File upload complete.");
         
        } //addInputFileToSharePoint

      const addFileToSharePointList = async () => {

        //This is a Vue ref object, so need to access properties using '.value'
        let file = fileNameForList.value

        Logger.write(`Saving the file to a SharePoint list using Vuetify file having file size ${file.size}`);

        let fileBuffer = await file.arrayBuffer();

        Logger.write(`Target url is ${url}`);

        //Grab the web information using pnpjs
        const web = Web(url);

        //Adjust this number to control what size files are uploaded in chunks
        if (file.size <= 10485760) {

         
        await web.lists.getByTitle(sharePointListName).items.getById(itemId).attachmentFiles.add(file.name, fileBuffer);
        Logger.log('check to see if the file was added to the list item');
    //   Worked for getting   let targetListItem = await web.lists.getByTitle(sharePointListName).items.getById(1)();
     //    Logger.log(`web.lists.getByTitle returned ${targetListItem}`);
    //     await targetListItem.attachmentFiles.add(file.name, fileBuffer);
        
        }

        // large upload
        else {

          await web.getFolderByServerRelativeUrl("Shared Documents/").files.addChunked(file.name, file.value, data => {

            Logger.log({ data: data, level: LogLevel.Verbose, message: "progress" });

          }, true);

        }

        Logger.write("File upload to SharePoint list is complete.");

      } //addFileToSharePointList


        return { fileNameSelected, fileName, fileNameForList,  addFileToSharePoint , addInputFileToSharePoint, addFileToSharePointList }


    } //setup


})

</script>

<style scoped>

#test {
  width: 200px
}


</style>
