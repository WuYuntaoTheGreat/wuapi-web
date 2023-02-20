<template lang="pug">

splitpanes.default-theme.content.flex-grow-1
  pane(min-size="20" size="20").full-height
    splitpanes(horizontal).default-theme
      pane(min-size="20" size="25").overflow-y-auto
        module-list
      pane.overflow-y-auto
        element-list
  pane.overflow-y-auto.full-height.p-2
    RouterView


</template>

<style lang="sass">
.splitpanes
  .splitpanes__pane
    background-color: var(--vt-c-white) !important
    padding: 0px

    &.full-height
      height: 100%

  .splitpanes__splitter
    background-color: var( --vt-c-divider-light-2) !important

</style>


<script setup lang="ts">
import { RouterView } from 'vue-router';
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import ModuleList from '@/components/ModuleList.vue'
import ElementList from '@/components/ElementList.vue'
import { currentModuleKey } from '@/keys';
import { ref, provide } from 'vue';

const currentModule = ref<string | null>(null)
provide(currentModuleKey, currentModule)

</script>
