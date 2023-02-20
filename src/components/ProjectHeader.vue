<template lang="pug">
.d-flex.flex-row.align-items-center.flex-nowrap.m-2
  h3.m-1
    span.text-secondary
      | Project 
    i.fw-bolder
        | {{prjName}}
  
  version-badge.align-self-stretch(
    v-if="isUnderMain"
    :version="prjVersion"
    type="toList"
  )

  .my-1.mx-3(
    v-if="!isUnderMain"
    role="button"
    @click="goto('home')"
  ).align-self-stretch.d-flex.flex-row.align-items-center.link.text-danger
    .material-icons-round home

  .flex-grow-1.d-flex.flex-row.justify-content-end.mx-2
    //- search-wrapper

  .d-flex.flex-row.align-self-stretch.align-items-end
    .m-1.text-secondary.fw-lighter
      | WU-API: {{version}}
    .left-liner

  .my-1.mx-3(
    role="button"
    :class="{'text-danger': route.name == 'search'}"
    @click="goto('search')"
  ).link
    .material-icons-round search

  .my-1.mx-3(
    role="button"
    :class="{'text-danger': route.name == 'pathes'}"
    @click="goto('pathes')"
  ).link
    .material-icons-round map

  .my-1.mx-3(
    role="button"
    :class="{'text-danger': route.name == 'tree'}"
    @click="goto('tree')"
  ).link
    .material-icons-round account_tree

  .my-1.mx-3(
    role="button"
    :class="{'text-danger': route.name == 'help'}"
    @click="goto('help')"
  ).link
    .material-icons-round live_help
  
</template>

<style scoped lang="sass">
.left-liner
  height: 40px
  border-left: 1px solid rgba(0,0,0, .15)
</style>

<script setup lang="ts">
import { computed, ref } from '@vue/reactivity';
import { inject, watch } from 'vue'
import { projectKey } from '@/keys'
import version from '@/version'
import { useRoute, useRouter } from 'vue-router';
import VersionBadge from './VersionBadge.vue';
import _ from 'lodash';

const project = inject(projectKey)

const prjName    = computed(() => project?.value?.name)
const prjVersion = computed(() => project?.value?.version)

const router = useRouter()
const route = useRoute()

const isUnderMain = ref<boolean>(true)

watch(route, (newValue) => {
  isUnderMain.value = _.findIndex(newValue.matched, (o) => o.name == 'main') > -1
})

function goto(where: "home" | "search" | "pathes" | "tree" | "help"){
  const version = route.params['version']
  switch(where) {
    case "home"    : router.push(`/v/${version}/api`);        break
    case "search"  : router.push(`/v/${version}/search`);     break
    case "pathes"  : router.push(`/v/${version}/api/pathes`); break
    case "tree"    : router.push(`/v/${version}/api/tree`);   break
    case "help"    : router.push(`/v/${version}/help`);       break
  }
}
</script>