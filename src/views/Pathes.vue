compNullable<template lang="pug">
table.m-2
  thead
    tr
      th.text-end.px-2
        h3 Request
      th.px-2
        h3 Path

  tbody
    tr(
      v-for="(req, k) in list"
      :key="k"
    )
      td.text-end.px-2
        entity-badge(:path="req.path")
      td.px-2
        span.text-primary {{req.entity.path}}



</template>

<script setup lang="ts">

import EntityBadge from '@/components/EntityBadge.vue';
import { projectKey } from '@/keys';
import { compNullable } from '@/utility';
import { $EntityType } from '@wuapi/essential/esm';
import { computed } from '@vue/reactivity';
import { inject } from 'vue';

const project = inject(projectKey)

const list = computed(() => (project?.value?.flatEntities() ?? [])
  .filter((o) => o.entity.type == $EntityType.REQUEST )
  .sort((a, b) => compNullable(a.entity.path, b.path) ?? 0 ))

</script>