<template lang="pug">
.comp-cell(v-if="type=='module'")
  span.material-icons-round.icon rule_folder
  span.fw-bolder {{name}}

.comp-cell(v-else-if="type=='entity'")
  entity-badge(
    :path="path"
    :version="version"
  )

.comp-cell(v-else-if="type=='enum'")
  enum-badge(
    :path="path"
    :version="version"
  )

.comp-cell(v-else-if="type=='field'")
  span.me-1 {{name}}
  .badge.bg-yellow(v-if="field.isOptional")
    | optional
  field-type-badge(
    :type="field.type"
    :opened="true"
    :no-openner="true"
  )
.comp-cell(v-else-if="type=='item'")
  span.me-1 {{name}}
  span.badge.text-bg-warning
    | {{item.value}}

.comp-cell(v-else)
  span {{name}} [{{type}}]

</template>

<style scoped lang="sass">
.comp-cell
  display: flex
  flex-direction: row
  align-items: center
</style>

<script setup lang="ts">
import EntityBadge from './EntityBadge.vue';
import { $ElementPath, $Entity, $Enum, $EnumItem, $Field, $Module } from '@wuapi/essential/esm';
import EnumBadge from './EnumBadge.vue';
import FieldTypeBadge from './FieldTypeBadge.vue';
import { computed, version } from 'vue';

const props = defineProps<{
  name?: string,
  type?: "module" | "entity" | "field" | "generic" | "enum" | "item",
  path?: $ElementPath,
  element?: $Module | $Entity | $Field | $Enum | $EnumItem,
  version?: string | null,
}>()

const field = computed(() => props.element as $Field)
const item = computed(() => props.element as $EnumItem)


</script>