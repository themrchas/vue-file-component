<template id="test">

  <v-app>
    <v-container>
      <v-file-input label="Upload your file" v-model="fileNameSelected" />
      <v-file-input label="Upload your file to a SharePoint list" v-model="fileNameForList" />
      <v-btn @click="getAttachmentNames">Attachments</v-btn>
    </v-container>

    <v-container>
      <v-row justify="start">
        <v-col cols="3">
                         
         <v-btn color="info" @click="testMessage">Test Button</v-btn>
     <!--    <v-btn class="bg-red" @click="testMessage">Test Button 2</v-btn> -->
        
          
        </v-col>
        <v-col cols="3">
          <v-btn variant="tonal" type="button" @click="addFileToSharePointList">Add to List Item</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="testContainer border">

      <v-row v-for="(fileNamesRow, index) in attachedFileNamesArray" no-gutters :key="index" justify="start" class="border chkBoxRow h-auto">

        <v-col v-for="(fileName, i) in fileNamesRow" :key="fileName" cols="2" sm="2" class="border">
          <v-checkbox v-model="checkboxFileNamesSelected" :label="fileName" :value="fileName" class="chkBoxContainer"></v-checkbox>
        </v-col>

      </v-row>

      <v-btn @click="deleteAttachments">Delete Files</v-btn>

    </v-container>

  </v-app>


  <h4>checkboxFileNamesSelected {{ checkboxFileNamesSelected }}</h4>
  <h2>{{ fileName }}</h2>

  <br />
  <br />

  <button type="button" @click="testUpdateArray">Update Array</button>

  <input type="file" id="fileInput"></input>
  <button type="button" @click="addInputFileToSharePoint">Add file</button>




</template>

<script>



import { ref, defineComponent, watch, computed, onBeforeMount, onMounted } from 'vue';


/*import { createVuetify } from 'vuetify';

const vuetify = createVuetify();

import {  VApp, VContainer, VFileInput, VBtn, VRow, VCol, VCheckbox } from 'vuetify/components';
*/

import { ConsoleListener, Logger, LogLevel } from "@pnp/logging";
import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/webs";
//import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/attachments";
import "@pnp/sp/items";
import { List } from "@pnp/sp/lists";





 export default defineComponent({

  name: 'FileDemo',
 // components: { VApp, VContainer, VFileInput, VBtn, VRow, VCol, VCheckbox},

  setup(props) {

   

    //  let url = "https://command.nshq.nato.int/sites/CS/ikm/KnowledgePortal/sandbox/chaskm/";
    //let url = "/sites/CS/ikm/KnowledgePortal/sandbox/chaskm/";
    let url = "https://nshqdev.sharepoint.com/teams/classic/";

    const SHAREPOINT_LIST_NAME = "PNPTest"
    let itemId = 1;

    const ATTACHMENT_FILE_NAMES_PER_ROW = 6;


    console.log('starting setup routine');



    //Vue name for file chosen to be saved to a Document Library 
    let fileNameSelected = ref(null);

    //Vue name for file chosen to be saved to a SharePoint list item
    let fileNameForList = ref(null);

    //Item File attachment names
    let attachmentFileNames = ref([]);

    //Array of those items that have been selected in the checkboxs
    let checkboxFileNamesSelected = ref([]);

    //Name of file to be uploaded using HTMLElement to a Document Library
    const fileName = computed(() => {
      return fileNameSelected.value?.name ? fileNameSelected.value.name : "No file has been selected"
    })

    //Returns a multidimensional array of the fetched attachment file names with each array row containing ATTACHMENT_FILE_NAMES_PER_ROW file names
    const attachedFileNamesArray = computed(() => {

      console.log('computed: current value of attachmentFileNames', attachmentFileNames.value)

      let toReturn = Array.from({ length: Math.ceil(attachmentFileNames.value.length / ATTACHMENT_FILE_NAMES_PER_ROW) },
        (_, i) => attachmentFileNames.value.slice(i * ATTACHMENT_FILE_NAMES_PER_ROW, i * ATTACHMENT_FILE_NAMES_PER_ROW + ATTACHMENT_FILE_NAMES_PER_ROW)
      )

      return toReturn
    })


    let web = null // = Web(url);



    watch(fileNameSelected, () => {
      console.log('fileNameSelected changed - ', fileNameSelected.value);

    })

    watch(fileNameSelected, () => {
      console.log('fileNameSelected changed - ', fileNameSelected.value);

    })

    watch(attachedFileNamesArray, () => {
      console.log('attachedFileNamesArray changed - ', attachedFileNamesArray.value);

    })



    sp.setup({

      pageContext: {
        web: {
          baseUrl: url,
          absoluteUrl: url

        }
      }
    }); //sp.setup

    onBeforeMount(() => {
      console.log('onBeforeMount')
      web = Web(url);
    });

    /*
    onMounted(() => {

      let test = document.getElementById('#shadow-root');
      console.log('shadow-root is',shadowHost);

    })
      */

    const testMessage = _ => {
      console.log('this is a test message')
    }


    /* Add file to SharePoint Document Library using Vuetify File */
    const addFileToSharePoint = async () => {

      Logger.write(`Saving the file using Vuetify file having file size ${fileNameSelected.value.size}`);

      //This is a Vue ref object , so need to access propertied using '.value'
      let file = fileNameSelected

      //Grab the web information using pnpjs
      // const web = Web(url);

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
      //  const web = Web(url);

      await web.getFolderByServerRelativeUrl("Shared Documents/").files.add(file.name, file, true);

      Logger.write("File upload complete.");

    } //addInputFileToSharePoint

    //Add file to a SharePoint generic list item
    const addFileToSharePointList = async () => {

      //This is a Vue ref object, so need to access properties using '.value'
      let file = fileNameForList.value

      Logger.write(`Saving the file to a SharePoint list using Vuetify file having file size ${file.size}`);

      //Read file into array buffer
      let fileBuffer = await file.arrayBuffer();

      //Grab the web information using pnpjs
      //    const web = Web(url);

      //Adjust this number to control what size files are uploaded in chunks
      if (file.size <= 10485760) {


        //Add the file to the list item
        await web.lists.getByTitle(SHAREPOINT_LIST_NAME).items.getById(itemId).attachmentFiles.add(file.name, fileBuffer);
        Logger.log('check to see if the file was added to the list item');
        //   Worked for getting   let targetListItem = await web.lists.getByTitle(SHAREPOINT_LIST_NAME).items.getById(1)();


      }

      // large upload
      else {

        await web.getFolderByServerRelativeUrl("Shared Documents/").files.addChunked(file.name, file.value, data => {

          Logger.log({ data: data, level: LogLevel.Verbose, message: "progress" });

        }, true);

      }

      Logger.write("File upload to SharePoint list is complete.");

    } //addFileToSharePointList


    const getAttachmentNames = async () => {

      console.log('yes money');

      Logger.write("addInputFileToSharePoint: Grabbing names of list item files attachments");

      //Grab the web information using pnpjs
      //    const web = Web(url);

      // const attachments = await web.lists.getByTitle(SHAREPOINT_LIST_NAME).items.getElementById("1").attachmentFiles();
      //const listItem = await web.lists.getByTitle(SHAREPOINT_LIST_NAME).items.getById(1)(); //worked
      const listItem = await web.lists.getByTitle(SHAREPOINT_LIST_NAME).items.getById(1)
      const listItemAttachments = await listItem.attachmentFiles();
      console.log("attachment data is ", listItemAttachments);

      attachmentFileNames.value = listItemAttachments.map((attachment) => attachment.FileName);
      console.log('file names are', attachmentFileNames.value);


      Logger.write("addInputFileToSharePoint: listItemAttachments", listItemAttachments);


    }

    const testUpdateArray = () => {
      attachmentFileNames.value = ["file1 wiil this overfloe.txt", "file2.txt", "file3.txt", "file4.txt", "file5.txt", "file6.txt", "file7.txt"];
    }

    
    const deleteAttachments = async () => {

      //Delete all files from the list item
      let retVal = await web.lists.getByTitle(SHAREPOINT_LIST_NAME).items.getById(itemId).attachmentFiles.deleteMultiple(checkboxFileNamesSelected.value.join());

      if (retVal) {
        console.log("deleteAttachments returned", retVal);

      }
      //Remove the deleted file 
      else {

        await getAttachmentNames();

      }
    } //deleteAttachments



      return { testMessage, testUpdateArray, fileNameSelected, fileName, fileNameForList, attachmentFileNames, attachedFileNamesArray, checkboxFileNamesSelected, addFileToSharePoint, addInputFileToSharePoint, addFileToSharePointList, getAttachmentNames, deleteAttachments }



  }, //setup
  

  })

</script>

<!--
<style>
@import url("/styles/vuetify.min.css")



.testContainer {
  width: 50%
}

/*
.testContainer {
  width:300px
}
  */
/* .chkBoxRow { 
    height:auto
   

  } */

.v-container {
  margin-left: 50px;

}


/* .chkBoxContainer {
  font-size: 6px;
}
*/


:deep(.v-checkbox .v-label) {
  font-size: 12px;

}
</style>
-->


<style>
  /* @import url("https://cdn.jsdelivr.net/npm/vuetify@3/dist/vuetify.min.css") */
 /*   @import url("/node_modules/vuetify/dist/vuetify.min.css")  */
   @import url("/styles/vuetify.min.css"); 
    
</style>