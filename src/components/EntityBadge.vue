<template lang="pug">
span(
  role="button"
  :class="bgClass"
  @click="onClick()"
).badge.shadow-sm
  span.fw-light {{path?.module}}
  span /
  span.fw-bolder {{path?.name}}

  .badge(v-if="entity?.isAbstract").text-bg-danger.ms-1
    | abstract
</template>

<script setup lang="ts">
import { projectKey } from '@/keys';
import { $ElementPath, $EntityType } from '@wuapi/essential/esm';
import { computed } from '@vue/reactivity';
import { inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps<{
  path: $ElementPath | null | undefined,
  version?: string | null,
  type?: $EntityType, 
}>()

const project   = inject(projectKey)
const router    = useRouter()
const route     = useRoute()
const entity    = computed(() => props.path?.asEntityOf(project?.value))
const bgClass   = computed(() => {
  const type = props.type ?? entity.value?.type
  switch(type){
    case  $EntityType.REQUEST   : return ["text-bg-primary"]
    case  $EntityType.RESPONSE  : return ["text-bg-info"]
    // case  $EntityType.OBJECT    : return ["text-bg-success"]
    // default: return []
    default: return ["text-bg-success"] // Default to Object.
  }
})

function onClick(){
  const ver = props.version ?? route.params['version']
  if(props.path){
    router.push(`/v/${ver}/api/entity/${props.path.module}/${props.path.name}`)
  }
}

</script>
