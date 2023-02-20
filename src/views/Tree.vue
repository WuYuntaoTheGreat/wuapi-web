<template lang="pug">
ul.entity-tree
  li(
    v-for="(entity, k) in node.children"
  )
    entity-badge(:path="entity.entity")

    tree(:root="entity")

</template>

<style scoped lang="sass">
$tree-line-color: #6c8794
$tree-space-left: 24px
$tree-last-line-y: 13px

ul.entity-tree 
  position: relative
  list-style: none
  padding-left: calc( $tree-space-left * 2 )

  li
    position: relative
    padding-bottom: 5px

    &:before, &:after
      position: absolute
      content: ''
      left: -$tree-space-left

    &:before
      border-top: 1px solid $tree-line-color
      top: 14px
      width: $tree-space-left
      height: 0

    &:after
      border-left: 1px solid $tree-line-color
      height: 100%
      width: 0px
      top: 2px

  li:last-child:after
      height: $tree-last-line-y
</style>

<script setup lang="ts">
import EntityBadge from '@/components/EntityBadge.vue';
import { projectKey } from '@/keys';
import { compNumber, compStr } from '@/utility';
import type { $ElementPath, $Entity } from '@wuapi/essential/esm';
import { computed } from '@vue/reactivity';
import _ from 'lodash';
import { inject } from 'vue';

class Node {
  constructor(
    public entity: $ElementPath | null,
    all: {path: $ElementPath, entity: $Entity}[]){

    this.children = _.map(
      _.filter<{path: $ElementPath, entity: $Entity}>(all, (o) => {
        return (this.entity == null && o.entity.parent == null) || this.entity?.equals(o.entity.parent) == true
      }).sort( (o1, o2) => 
        compNumber(o1.entity.type, o2.entity.type) ??
        compStr(o1.path.module, o2.path.module) ??
        compStr(o1.path.name, o2.path.name) ??
        0
      ),
      
      (o) =>  new Node(o.path, all) )
  }

  children: Node[]
}

const props = defineProps<{
  root?: Node,
}>()

const project = inject(projectKey)

const node = computed(() => {
  if(props.root) return props.root
  const all = project?.value?.flatEntities() ?? []
  return  new Node(null, all)
})


</script>
