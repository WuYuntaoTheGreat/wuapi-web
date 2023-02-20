currentModuleKey<template lang="pug">
.d-flex.flex-row.align-items-center
  .link(
    role="button"
    @click="onClick()"
  ).d-flex.flex-row.align-items-center
    span.me-2.material-icons-round.icon rule_folder
    span.me-2 {{path.module}}
  span.me-2 |
  type-badge(
    :type="elementType"
    :is-abstract="isAbstract"
  )
  

</template>

<script setup lang="ts">import TypeBadge from '@/components/TypeBadge.vue';
import { getElementPath } from '@/utility_entity';
import { currentModuleKey, projectKey } from '@/keys';
import { $EntityType } from '@wuapi/essential/esm';
import { computed } from '@vue/reactivity';
import { inject } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  type: "entity" | "enum"
}>()

const project       = inject(projectKey)
const currentModule = inject(currentModuleKey)

const route         = useRoute()
const path          = computed(() => getElementPath(route))
const isAbstract    = computed(() => path.value.asEntityOf(project?.value)?.isAbstract)
const elementType   = computed(() => {
  switch(path.value.asEntityOf(project?.value)?.type){
    case $EntityType.REQUEST  : return "request"
    case $EntityType.RESPONSE : return "response"
    case $EntityType.OBJECT   : return "object"
    default: return "enum"
  }
})

function onClick(){
  if(currentModule) {
    currentModule!.value = path.value.module
  }
}

</script>
