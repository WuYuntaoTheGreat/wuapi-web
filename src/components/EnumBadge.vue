<template lang="pug">
span(
  role="button"
  @click="onClick()"
).badge.text-bg-warning.shadow-sm
  span.fw-light {{path?.module}}
  span /
  span.fw-bolder {{path?.name}}
</template>

<script setup lang="ts">
import type { $ElementPath } from '@wuapi/essential/esm';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps<{
  path: $ElementPath | null | undefined,
  version?: string | null,
}>()


const router      = useRouter()
const route       = useRoute()

function onClick(){
  const ver = props.version ?? route.params['version']
  if(props.path){
    router.push(`/v/${ver}/api/enum/${props.path.module}/${props.path.name}`)
  }
}

</script>
