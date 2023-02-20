<template lang="pug">
.d-flex.flex-column.p-2
  //- Title
  element-title(type="enum")

  //- Name
  .d-flex.flex-row 
    h2 {{path.name}}

  //- Summary
  hr
  table.summary
    tr
      td.header
        | referred by:
      td
        entity-badge(
          v-for="(o, k) in referings"
          :key="k"
          :path="o.path"
        ).m-1

  //- Comments
  hr
  .d-flex.flex-row
    markdown-wrapper(:source="enumeration?.comment")

  //- Items
  hr
  .d-flex.flex-row
    h4 Items
  .d-flex.flex-row
    items-view(:path="path")
</template>

<script setup lang="ts">
import ElementTitle from '@/components/ElementTitle.vue'
import EntityBadge from '@/components/EntityBadge.vue'
import MarkdownWrapper from '@/components/MarkdownWrapper.vue'
import { getElementPath } from '@/utility_entity'
import { projectKey } from '@/keys'
import { $TEnum } from '@wuapi/essential/esm'
import { computed } from '@vue/reactivity'
import _ from 'lodash'
import { inject } from 'vue'
import { useRoute } from 'vue-router'
import ItemsView from '../components/ItemsView.vue'

const route         = useRoute()
const project       = inject(projectKey)
const path          = computed(() => getElementPath(route))
const enumeration   = computed(() => path.value.asEnumOf(project?.value))

const criteria      = computed(() => new $TEnum(path.value))

const referings     = computed(() => _.filter(project?.value?.flatEntities() ?? [], (o) => {
  return _.filter(_.values(o.entity.fieldsLocal), (f) => criteria.value.equalsEvenInList(f.type)).length > 0
}))


</script>