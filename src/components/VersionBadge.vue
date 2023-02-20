<template lang="pug">
.d-flex.flex-row.align-items-center.m-1.link.text-nowrap(
  role="button"
  @click="onClick"
)
  span version: { 
  span.material-icons-round.fs-4.m-0.p-0 list
  span.fw-bolder.text-danger {{version}}
  span  }
  span.material-icons-round(v-if="version == routeVersion").fs-5.ms-2 arrow_circle_left
</template>

<script setup lang="ts">
import { strOrArr } from '@/utility';
import { computed } from '@vue/reactivity';
import { useRoute, useRouter } from 'vue-router';


const props = defineProps<{
  version?: string | number,
  type: "toList" | "change" | "none",
}>()

const emits = defineEmits(['click'])

const router = useRouter()
const route = useRoute()
const routeVersion = computed(() => strOrArr(route.params['version']))

function onClick(){
  if(props.type == "toList"){
    router.push(`/v/${routeVersion.value}/versions`)
  } else if(props.type == "change") {
    router.push(`/v/${props.version}/versions`)
  } else {
    emits('click')
  }
}

</script>