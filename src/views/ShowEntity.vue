<template lang="pug">
.d-flex.flex-column
  //- Title
  element-title(type="entity")

  //- Name
  .d-flex.flex-row.align-items-center
    h2 {{path.name}}
    h3(v-if="entityGeneric.length > 0")
      | &lt;
      span.fw-bolder.text-danger
        | {{entityGeneric.join(', ')}}
      | &gt;
    h3(v-if="entity?.parent").mx-2
      | :
    entity-badge(
      v-if="entity?.parent"
      :path="entity.parent"
    ).m-2
    .d-flex.flex-row.flex-nowrap(v-if="parentGeneric.length > 0")
      | &lt;
      template(v-for="(g, k) in parentGeneric")
        span.fw-bolder.text-danger {{g.name}}
        span(v-if="g.field") =
        field-type-badge(
          v-if="g.field"
          :type="g.field"
          :no-openner="true"
          :opened="true"
        )
      | &gt;

  //- Summary
  hr
  table.summary
    tr(v-if="entity?.path")
      td.header
        | Path
      td
        .d-flex.flex-row.align-items-center
          span(v-if="entityMethod").mx-2.badge.text-bg-secondary 
            | {{entityMethod}}
          span.material-icons-round map
          span.mx-2.text-primary.fw-bold
            | {{entity?.path}}
    tr(v-if="entity?.response")
      td.header
        | Response
      td
        span.mx-2.material-icons-round.align-middle compare_arrows
        entity-badge(:path="entity?.response")
    tr
      td.header
        | Children
      td
        entity-badge(
          v-for="(v, k) in children"
          :key="k"
          :path="v.path"
        ).m-1
    tr
      td.header
        | Refered by
      td
        entity-badge(
          v-for="(v, k) in referings"
          :key="k"
          :path="v.path"
        ).m-1

  //- Comments
  hr
  .d-flex.flex-row
    markdown-wrapper(:source="entity?.comment")

  //- Fields
  hr
  .d-flex.flex-row
    h4 Fields
    .flex-grow-1
    span(
      role="button"
      @click="doExpandAll"
    ).link.me-2.material-icons-round.icon open_in_full

    span(
      role="button"
      @click="doCollapseAll"
    ).link.me-2.material-icons-round.icon close_fullscreen

  fields-view-group(
    ref="fieldsViewGroup"
    :path="path"
  )

</template>

<script setup lang="ts">
import ElementTitle from '@/components/ElementTitle.vue'
import EntityBadge from '@/components/EntityBadge.vue'
import FieldsViewGroup from '@/components/FieldsViewGroup.vue'
import FieldTypeBadge from '@/components/FieldTypeBadge.vue'
import MarkdownWrapper from '@/components/MarkdownWrapper.vue'
import { getElementPath } from '@/utility_entity'
import { actionExpandCollapseKey, projectKey } from '@/keys'
import { $ReqMethod, $TObject } from '@wuapi/essential/esm'
import { computed, ref } from '@vue/reactivity'
import _ from 'lodash'
import { inject, provide } from 'vue'
import { useRoute } from 'vue-router'

const fieldsViewGroup = ref<InstanceType<typeof FieldsViewGroup>>()

const route           = useRoute()
const project         = inject(projectKey)
const path            = computed(() => getElementPath(route))
const entity          = computed(() => path.value.asEntityOf(project?.value))
const entityMethod    = computed(() => entity.value?.method ? $ReqMethod[entity.value?.method]: null)
const entityGeneric   = computed(() => entity.value?.getGenericUnsolved(project?.value) ?? [])
const parent          = computed(() => entity.value?.parent?.asEntityOf(project?.value))
const parentGeneric   = computed(() => _.map(parent.value?.getGenericUnsolved(project?.value) ?? [], (o) => {
  return {
    name: o,
    field: entity.value?.genericMap[o]?.type,
  }
}))

const criteria        = computed(() => new $TObject(path.value))

const children        = computed(() => _.filter(project?.value?.flatEntities() ?? [], (o) => path.value.equals(o.entity.parent)))
const referings       = computed(() => _.filter(project?.value?.flatEntities() ?? [], (o) => { 
  return path.value.equals(o.entity.response) 
    || _.filter(_.values(o.entity.genericMap), (f) => criteria.value.equalsEvenInList(f.type)).length > 0
    || _.filter(_.values(o.entity.fieldsLocal), (f) => criteria.value.equalsEvenInList(f.type)).length > 0 
}))


function doExpandAll(){
  fieldsViewGroup.value?.doExpandAll()
  actionExpandCollapse.value++
}

function doCollapseAll(){
  fieldsViewGroup.value?.doCollapseAll()
  actionExpandCollapse.value--
}

const actionExpandCollapse = ref<number>(0)

provide(actionExpandCollapseKey, actionExpandCollapse)

</script>
