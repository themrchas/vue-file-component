<template id="test">
    
    <v-app>
    <v-container>
      <v-file-input
        label="Upload your file"
        v-model="fileNameSelected"

      />
    </v-container>
  </v-app>

  <h2>{{ fileName }}</h2>
     
<!--
    <h2 v-if="fileName !== null">File selected is {{fileName}}</h2>
    <h2 v-else>No file currently selected.</h2>
-->

<!--
<h2 v-if="fileNameSelected?.value?.name">File selected is {{fileNameSelected.value.name}}</h2>
<h2 v-else>No file currently selected.</h2>
-->


</template>

<script>

import { ref, defineComponent, watch, computed } from 'vue';

export default defineComponent({
   
    name: 'FileDemo',
    
    setup(props) {
        
        let fileNameSelected = ref(null);
      //  let fileName = ref(null);

        const fileName = computed(() => {
          return fileNameSelected.value?.name ? fileNameSelected.value.name : "No file has been selected"
        })

        watch(fileNameSelected,() => {
          console.log('fileNameSelected changed - ',fileNameSelected);
     //     fileName.value = fileNameSelected.value.name;
        })

        return { fileNameSelected, fileName }


    }


})

</script>

<style scoped>

#test {
  width: 200px
}


</style>
