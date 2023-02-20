<template lang="pug">
.header
  project-header

.content
  RouterView

loading-dialog(ref="ldRef" title="Loading Project Data ...")
</template>

<style scoped lang="sass">
$header-height: 64px
.header
  height: $header-height
  border-bottom: 1px solid var(--vt-c-divider-light-2)

.content
  height: calc(100vh - $header-height)

</style>

<script setup lang="ts">
import LoadingDialog from '@/components/LoadingDialog.vue';
import ProjectHeader from '@/components/ProjectHeader.vue'
import { projectKey, versionListKey } from '@/keys';
import { strOrArr } from '@/utility';
import { $Project } from '@wuapi/essential/esm';
import { computed } from '@vue/reactivity';
import { inject, onMounted, provide, ref, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';

const ldRef = ref<InstanceType<typeof LoadingDialog>>()
const project = ref<$Project | null>(null)

const versionList = inject(versionListKey)

provide(projectKey, project)

const route = useRoute()
const versionListComp = computed(() => versionList?.value)
const versionComp = computed(() => strOrArr(route.params['version']))

watch(versionListComp, (newValue) => {
  if(newValue){
    fetchProject()
  }
})

watch(versionComp, (newValue) =>{
  if(newValue){
    fetchProject() 
  }
})

onMounted(() => {
  console.log("VersionBase.onMounted")
  fetchProject()
})

function fetchProject () {
  const pth = versionList?.value?.[versionComp.value ?? -1] 
  console.log(`VersionBase.fetchProject(): pth=${pth}`)
  if(!pth) return

  ldRef.value?.show()
  fetch(pth)
    .then((res) => {
      return res.json()
    })
    .then((data)=>{
      ldRef.value?.hide()
      const prj = $Project.load(data)
      console.log(data)
      console.log(prj)

      project.value = prj
    })
}
</script>
