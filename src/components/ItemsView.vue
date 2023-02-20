<template lang="pug">
table.fields.my-3
  thead
    tr
      th.text-end Name
      th.text-center Value
      th Comments

  tbody
    tr(
      v-for="(v, k) in items"
      :key="k"
    )
      td.text-end
        sup(v-if="v.item.realname").text-success.fw-bolder
          | "{{v.item.realname}}"=
        | {{v.name}}
      td.text-center
        span.badge.text-bg-warning
          | {{v.item.value}}
      td
        markdown-wrapper(:source="v.item.comment")

</template>

<script setup lang="ts">
import { projectKey } from '@/keys.js';
import type { $ElementPath } from '@wuapi/essential/esm/index.js';
import { computed, inject } from 'vue';
import MarkdownWrapper from './MarkdownWrapper.vue';

const props = defineProps<{
  path: $ElementPath | null
}>()
const project      = inject(projectKey)
const enumeration  = computed(() => props.path?.asEnumOf(project?.value))

const items = computed(() => enumeration.value?.flat() ?? [] )
</script>