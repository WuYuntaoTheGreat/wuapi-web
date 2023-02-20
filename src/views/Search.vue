<template lang="pug">
.d-flex.flex-row.justify-content-end.p-1
  search-wrapper(
    :items="items"
    @selected="onSelected"
  ).main-search
  .filler
  
</template>

<style scoped lang="sass">
.filler
  width: 100px
</style>

<style lang="sass">
.main-search
  border: 1px solid black
  padding: 2px 10px
  border-radius: 10px
.vue-autocomplete-input-tag-items
  padding-left: 10px
  cursor: pointer
</style>

<script setup lang="ts">
import SearchWrapper from '@/components/SearchWrapper.vue';
import { projectKey } from '@/keys.js';
import { computed } from '@vue/reactivity';
import _ from 'lodash';
import { inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const project = inject(projectKey)
const router  = useRouter()
const route   = useRoute()

const items   = computed(() => _.concat(
  _.map(project?.value?.flatEntities() ?? [], (o) => {
    return {
      type: 'entity',
      module: o.path.module,
      name: o.path.name,
      displayed: `${o.path.module}/${o.path.name}`
    }
  }),
  _.map(project?.value?.flatEnums() ?? [], (o) => {
    return {
      type: 'enum',
      module: o.path.module,
      name: o.path.name,
      displayed: `${o.path.module}/${o.path.name}`
    }
  }),
))

function onSelected(v: any){
  const version = route.params['version']
  router.push(`/v/${version}/api/${v.type}/${v.module}/${v.name}`)
}

</script>