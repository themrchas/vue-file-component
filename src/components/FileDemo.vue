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
      <v-btn @click="getAttachmentNames">Attachments</v-btn>
    </v-container>
    
<v-container >
  <v-row justify="start">
    <v-col cols="3">
      <v-btn color="info"  @click="addFileToSharePoint">Add to Doc Lib</v-btn>
    </v-col>
    <v-col cols="3">
      <v-btn variant="tonal" type="button" @click="addFileToSharePointList">Add to List Item</v-btn>
    </v-col>
  </v-row>
  </v-container>

  <v-container>

    <h4>checkboxFileNamesSelected {{ checkboxFileNamesSelected }}</h4>

    <v-row v-for="(fileNamesRow,index) in attachedFileNamesArray" no-gutters :key="index">

      <v-col v-for="(fileName,i) in fileNamesRow" :key="fileName" cols="6" sm="2">
        <v-checkbox v-model="checkboxFileNamesSelected" :label="fileName" :value="fileName"></v-checkbox>
      </v-col>

    </v-row>

  </v-container>

  </v-app>

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
//import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/attachments";
import "@pnp/sp/items";
import {List } from "@pnp/sp/lists";





export default defineComponent({
   
    name: 'FileDemo', 
    
    setup(props) {

    //  let url = "https://command.nshq.nato.int/sites/CS/ikm/KnowledgePortal/sandbox/chaskm/";
   //let url = "/sites/CS/ikm/KnowledgePortal/sandbox/chaskm/";
             let url = "https://nshqdev.sharepoint.com/teams/classic/";

      let sharePointListName = "PNPTest"
      let itemId = 1;

      const ATTACHMENT_FILE_NAMES_PER_ROW = 3;

      

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
          
          console.log('computed: current value of attachmentFileNames',attachmentFileNames.value)

          return Array.from({length:Math.ceil(attachmentFileNames.value.length / ATTACHMENT_FILE_NAMES_PER_ROW)}, 
              (_, i) => attachmentFileNames.value.slice(i* ATTACHMENT_FILE_NAMES_PER_ROW, i * ATTACHMENT_FILE_NAMES_PER_ROW +3)  
          )
        })
       
       

        watch(fileNameSelected,() => {
          console.log('fileNameSelected changed - ',fileNameSelected.value);
     
        })

        watch(fileNameSelected,() => {
          console.log('fileNameSelected changed - ',fileNameSelected.value);
     
        })

        watch(attachedFileNamesArray,() => {
          console.log('attachedFileNamesArray changed - ',attachedFileNamesArray.value);
     
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

      //Add file to a SharePoint generic list item
      const addFileToSharePointList = async () => {

        //This is a Vue ref object, so need to access properties using '.value'
        let file = fileNameForList.value

        Logger.write(`Saving the file to a SharePoint list using Vuetify file having file size ${file.size}`);

        //Read file into array buffer
        let fileBuffer = await file.arrayBuffer();

        //Grab the web information using pnpjs
        const web = Web(url);

        //Adjust this number to control what size files are uploaded in chunks
        if (file.size <= 10485760) {

         
        //Add the file to the list item
        await web.lists.getByTitle(sharePointListName).items.getById(itemId).attachmentFiles.add(file.name, fileBuffer);
        Logger.log('check to see if the file was added to the list item');
    //   Worked for getting   let targetListItem = await web.lists.getByTitle(sharePointListName).items.getById(1)();
     
        
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

        Logger.write("addInputFileToSharePoint: Grabbing names of list item files attachments");

        //Grab the web information using pnpjs
        const web = Web(url);

       // const attachments = await web.lists.getByTitle(sharePointListName).items.getElementById("1").attachmentFiles();
       //const listItem = await web.lists.getByTitle(sharePointListName).items.getById(1)(); //worked
       const listItem = await web.lists.getByTitle(sharePointListName).items.getById(1)
       const listItemAttachments = await listItem.attachmentFiles();
       console.log("attachment data is ",listItemAttachments);

       attachmentFileNames.value = listItemAttachments.map((attachment) => attachment.FileName);
       console.log('file names are',attachmentFileNames.value);


        Logger.write("addInputFileToSharePoint: listItemAttachments", listItemAttachments);


      }



        return { fileNameSelected, fileName, fileNameForList,  attachmentFileNames, attachedFileNamesArray, checkboxFileNamesSelected, addFileToSharePoint , addInputFileToSharePoint, addFileToSharePointList, getAttachmentNames }


    } //setup


})

</script>

<style scoped>

#test {
  width: 200px
}




</style>
