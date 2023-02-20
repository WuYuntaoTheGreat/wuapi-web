<template lang="pug">
RouterView

//- loading-dialog(ref="ldRef" title="Loading Version Data ...")
</template>

<script setup lang="ts">
// import LoadingDialog from '@/components/LoadingDialog.vue';
import { RouterView, useRouter } from 'vue-router';
import { onMounted, provide, ref, watch } from 'vue';
import { versionListKey } from '@/keys';

const router = useRouter()
// const ldRef = ref<InstanceType<typeof LoadingDialog>>()
const versionList = ref<{[key: string]: string}>({})

provide(versionListKey, versionList)

onMounted(() => {
  fetchVersion()
})

function fetchVersion () {
  // ldRef.value?.show()
  fetch("repository/list.json")
    .then((res) => {
      return res.json()
    })
    .then((data)=>{
      // ldRef.value?.hide()
      versionList.value = data.versions
      console.log(`App.fetchVersion/${data.current}`)
      router.push(`/v/${data.current}/api`)
    })
    .catch((error)=>{
      console.log(`Error fetching list.json, ${error}`) 
      router.push(`/error`)
    })
}

</script>