<template lang="pug">
.d-flex.flex-column(
  v-for="(pth, k) in ancestors"
  :key="k"
)
  .d-flex.flex-row.mt-3.align-items-center
    .badge( v-if="pth.equals(path)" ).text-bg-secondary
      | This entity:
    .badge( v-else ).text-bg-secondary
      | Inherited from:
    entity-badge(
      v-if="!pth.equals(path)"
      :path="pth"
    ).mx-2

  .d-flex.flex-row
    fields-view(
      :path="pth"
      :bloodline="myBloodLine"
    )
</template>

<script setup lang="ts">
import EntityBadge from '@/components/EntityBadge.vue';
import { projectKey } from '@/keys.js';
import type { $ElementPath } from '@wuapi/essential/esm';
import { computed } from '@vue/reactivity';
import _ from 'lodash';
import { inject } from 'vue';
import FieldsView from './FieldsView.vue';

const props = defineProps<{
  path: $ElementPath | null | undefined,
  bloodline?: $ElementPath[],
}>()

const project     = inject(projectKey)
const entity      = computed(() => props.path?.asEntityOf(project?.value))
const myBloodLine = computed(() => _.concat(props.bloodline ?? [], props.path ? [props.path] : []))
const ancestors   = computed(() => {
  const result: $ElementPath[] = []
  if(props.path){
    result.unshift(props.path)
    let ent = entity.value
    while(ent){
      if(ent.parent){
        result.unshift(ent.parent)
        ent = ent.parent.asEntityOf(project?.value)
      } else {
        break
      }
    }
  }
  return result
})


function doExpandAll(){
  console.log("FieldsVIewGroup#doExpandAll()")
}

function doCollapseAll(){
  console.log("FieldsVIewGroup#doCollapseAll()")
}

defineExpose({
  doExpandAll,
  doCollapseAll,
})


</script>
