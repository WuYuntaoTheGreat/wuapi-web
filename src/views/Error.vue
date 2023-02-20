<template lang="pug">
.center.h1.text-secondary.mt-5
  | ERROR

.center.mt-3
  | Please make sure 
  code
    | repository/list.json 
  | is provided,

.center(
  role="button"
  @click="goBack()"
)
  | &lt;&lt; Back
</template>

<style scoped lang="sass">
.center
  margin: 0 auto
  text-align: center
  
</style>

<script setup lang="ts">
import router from '@/router';

function goBack(){
  router.go(-1);
}
</script>
