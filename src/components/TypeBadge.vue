<template lang="pug">
.badge(:class="typeMap[type].cls") {{typeMap[type].label}}
  .badge(v-if="isAbstract").text-bg-danger.ms-1 abstract
</template>

<script setup lang="ts">
defineProps<{
  type: 'enum' | 'object' | 'request' | 'response',
  isAbstract?: boolean,
}>()

const typeMap = {
  'enum'        :{ cls: ["text-bg-warning"], label: "Enumeration"},
  'object'      :{ cls: ["text-bg-success"], label: "Object"},
  'request'     :{ cls: ["text-bg-primary"], label: "Request"},
  'response'    :{ cls: ["text-bg-info"   ], label: "Response"},
}


</script>
