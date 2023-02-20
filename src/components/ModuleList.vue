<template lang="pug">

table(width="100%").my-2
  tr(
    v-for="(v, k) in modules"
    :key="v"
  )
    td(
      role="button"
      :class="{'text-danger': currentModule == v}"
      @click="select(v)"
    ).px-2.py-1.link.d-flex.flex-row.align-items-center
      span.material-icons-round.icon rule_folder
      | {{v}}
</template>

<style scoped lang="sass">
.icon
  font-size: 18px

</style>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { inject, watch } from 'vue'
import { currentModuleKey, projectKey } from '@/keys'
import _ from 'lodash'

const project         = inject(projectKey)
const currentModule   = inject(currentModuleKey)
const modules         = computed(() =>  _.keys(project?.value?.modules))

function select(k: string | null){
  if(currentModule) 
    currentModule.value = k
}

watch(modules, (newValue, oldValue) => {
  if(newValue.length > 0 && currentModule && !currentModule?.value){
    currentModule.value = newValue[0]
  }
})

</script>
