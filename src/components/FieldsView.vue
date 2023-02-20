<template lang="pug">
table.fields.mb-3
  thead
    tr
      th.text-end Name
      th
      th Type
      th Comments
  tbody
    field-row(
      v-for="(f, k) in knowns"
      :key="k"
      :name="f.name" 
      :field="f.field"
      :is-known="true"
      :bloodline="bloodline"
    )
    field-row(
      v-for="(f, k) in fields"
      :key="k"
      :name="f.name" 
      :field="f.field"
      :bloodline="bloodline"
    )

</template>

<script setup lang="ts">import { projectKey } from '@/keys.js';
import type { $ElementPath, $Field } from '@wuapi/essential/esm/index.js';
import { computed, ref, type Ref } from '@vue/reactivity';
import _ from 'lodash';
import { inject } from 'vue';
import FieldRow from './FieldRow.vue';

type FieldObject = {
  name    : string,
  field   : $Field,
}

const props = defineProps<{
  path: $ElementPath | null | undefined,
  bloodline?: $ElementPath[],
}>()

const project          = inject(projectKey)
const entity           = computed(() => props.path?.asEntityOf(project?.value))

const knowns           = computed(() => {
  const result: FieldObject[] = []
  _.forIn(entity.value?.genericMap, (f: $Field, k) => {
    result.push({ 
      name    : k,
      field   : f,
    })
  })
  return result
})

const fields           = computed(() => {
  const result: FieldObject[] = []
  _.forIn(entity.value?.fieldsLocal, (f: $Field, k) => {
    result.push({ 
      name    : k,
      field   : f,
    })
  })
  return result
})


</script>
