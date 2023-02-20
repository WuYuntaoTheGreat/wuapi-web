<template lang="pug">
tr
  td(:class="{'complex-field-bottom': (includedObject || includedEnum) && opened}").text-end
    .d-flex(v-if="isKnown").flex-row.flex-nowrap
      | &lt;
      .text-pink.fw-bolder.text-nowrap
        | {{name}}
      | &gt;
    span(v-else).text-nowrap
      sup(v-if="field.realname").text-success.fw-bolder
        | "{{field.realname}}"=
      | {{name}}
    
  td(:class="{'complex-field-bottom': (includedObject || includedEnum) && opened}")
    .badge.bg-yellow(v-if="field.isOptional")
      | optional
    | &nbsp;
  td(:class="{'complex-field-middle': (includedObject || includedEnum) && opened}").ps-0
    field-type-badge(
      :type="field.type"
      :opened="opened"
      @toggle="opened = !opened"
      ref="fieldTypeBadge"
    )
  td
    markdown-wrapper(:source="field.comment")

tr(
  v-if="(includedObject || includedEnum) && opened && !inBloodline(includedObject)"
).bg-white
  td(colspan="4").complex-field-left.py-1.ps-4.pe-0
    fields-view-group(
      v-if="includedObject"
      :path="includedObject"
    )
    items-view(
      v-if="includedEnum"
      :path="includedEnum"
    )
</template>

<style lang="sass">
.complex-field-bottom
  border-bottom: 2px solid var(--bs-pink)

.complex-field-middle
  &::before
    position: absolute
    content: ''
    top: 15px
    left: 0
    height: calc(100% + 15px)
    border-left: 2px solid var(--bs-pink)

.complex-field-left
  border-left: 2px solid var(--bs-pink)

</style>

<script setup lang="ts">
import MarkdownWrapper from '@/components/MarkdownWrapper.vue';
import { actionExpandCollapseKey } from '@/keys';
import type { $ElementPath, $Field, $FieldType, $TEnum, $TList, $TObject } from '@wuapi/essential/esm';
import { computed, ref } from '@vue/reactivity';
import _ from 'lodash';
import { inject, watch } from 'vue';
import FieldsViewGroup from './FieldsViewGroup.vue';
import FieldTypeBadge from './FieldTypeBadge.vue';
import ItemsView from './ItemsView.vue';

const props = defineProps<{
  isKnown?: boolean,
  field: $Field,
  name: string,
  bloodline?: $ElementPath[],
}>()

const opened = ref<boolean>(true)
const fieldTypeBadge = ref<InstanceType<typeof FieldTypeBadge>>()

const includedObject = computed(() => findIncludedObject(props.field.type))
function findIncludedObject(type: $FieldType | null | undefined): $ElementPath | null {
  switch(type?.type){
    case 'TObject'  : return (type as $TObject).entity
    case 'TList'    : return findIncludedObject((type as $TList).member)
    default: return null
  }
}

const includedEnum = computed(() => findIncludedEnum(props.field.type))
function findIncludedEnum(type: $FieldType | null | undefined): $ElementPath | null {
  switch(type?.type){
    case 'TEnum'    : return (type as $TEnum).enu
    case 'TList'    : return findIncludedEnum((type as $TList).member)
    default: return null
  }
}

const actionExpandCollapse = inject(actionExpandCollapseKey)
const refAEC = computed(() => actionExpandCollapse?.value )
watch(refAEC, (newValue, oldValue) => {
  if(newValue != undefined && oldValue != undefined){
    opened.value = newValue > oldValue
  }
})

function inBloodline(one: $ElementPath| null | undefined): boolean {
  if(!one) return false
  if(!props.bloodline) return false
  console.log(props.bloodline)
  return _.find(props.bloodline, (o) => o.equals(one)) != undefined
}
</script>
