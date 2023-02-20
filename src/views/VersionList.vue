<template lang="pug">

.d-flex.flex-column.justify-content-center.align-items-center.mt-3
  h4 Versions

  span(
    v-if="!versionToCompare"
    role="button"
    @click="showComp = !showComp"
  ).material-icons.m-2
    | compare_arrows
  span(
    v-else
    role="button"
    @click="onCompare(null)"
  ).material-icons.m-2
    | keyboard_return

//- The Version Table
table(
  v-show="!versionToCompare"
).version-table
  tr
    th.p-0
    td(rowspan="100%").p-2.bg-white.text-center
    th(v-if="showComp").p-0
      
  tr(
    v-for="(o, k) of versionList"
    :key="k"
  )
    td.align-middle
      version-badge(
        :version="k"
        type="change"
      )
    td.align-middle(v-if="showComp")
      version-badge(
        v-if="version != k"
        :version="k"
        type="none"
        @click="onCompare(k)"
      )

//- The Compare Table
compare-table(
  ref="compareTable"
)

</template>

<style scoped lang="sass">
.version-table
  margin: 20px auto
  th
    width: 250px !important

  tr:nth-child(even)
    background-color: #fafafa
  tr:nth-child(odd)
    background-color: #f0f0f0
  tr:hover
    background-color: #FED

</style>

<script setup lang="ts">
import CompareTable from '@/components/CompareTable.vue';
import VersionBadge from '@/components/VersionBadge.vue';
import { versionListKey } from '@/keys.js';
import { strOrArr } from '@/utility';
import { computed, inject, ref } from 'vue';
import { useRoute } from 'vue-router';

const route              = useRoute()
const versionList        = inject(versionListKey)
const version            = computed(() => strOrArr(route.params['version']))
const versionToCompare   = ref<string | null>(null)
const showComp           = ref<boolean>(false)

const compareTable       = ref<InstanceType<typeof CompareTable>>()

function onCompare(another: string | number | null){
  if(!another) {
    versionToCompare.value = null
    compareTable.value?.fetchProject(null)
  } else if(typeof another === 'string') {
    versionToCompare.value = another
    compareTable.value?.fetchProject(another)
  }
}



</script>
