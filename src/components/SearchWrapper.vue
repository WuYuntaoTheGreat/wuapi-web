<template lang="pug">
autocomplete(
  v-model="model"
  :items="items"
  displayed="displayed"
  :returned="['type', 'module', 'name']" 
)

</template>

<script>
import autocomplete from 'vue-autocomplete-input-tag'
export default {
    name: "App",
    components: {
      autocomplete,
    },
    props: [
      "items",
    ],
    data() {
      return {
        model: "",
      };
    },
    watch: {
      model: function(v){
        if((v.type == 'entity' || v.type == 'enum') && v.module && v.name){
          this.$emit("selected", v)
        }
      },
    },
  };

</script>