<template lang="pug">
.d-flex.flex-row.text-nowrap
  //- Normal
  .badge( v-if="typeData.asNormal" ).bg-pink.m-1
    | {{typeData.asNormal}}

  //- List
  .d-flex( v-if="typeData.asList" ).flex-row.align-items-center
    field-type-badge(
      :type="typeData.asList.member"
      :opened="opened"
      @toggle="$emit('toggle')"
    )
    span.ms-1.fw-bolder [ ]

  //- Object
  .d-flex( v-if="typeData.asObject" ).flex-row.align-items-center.badge-plain.bg-pink.p-1.text-white
    .link(
      role="button"
      @click="$emit('toggle')"
      v-if="!noOpenner"
    ).user-select-none.fs-6.me-2.material-icons-round.icon 
      | {{ opened ? "close_fullscreen" : "open_in_full"}}
    entity-badge(:path="typeData.asObject.entity")

  //- Enumeration  
  .d-flex( v-if="typeData.asEnum" ).flex-row.align-items-center.badge-plain.bg-pink.p-1.text-white
    .link(
      role="button"
      @click="$emit('toggle')"
      v-if="!noOpenner"
    ).user-select-none.fs-6.me-2.material-icons-round.icon 
      | {{ opened ? "close_fullscreen" : "open_in_full"}}
    enum-badge(:path="typeData.asEnum.enu")

  //- Unknown
  .d-flex( v-if="typeData.asUnknown" ).flex-row.m-1
    span &lt;
    .text-pink.fw-bolder
      | {{typeData.asUnknown.unknown}}
    span &gt;

</template>

<style scoped lang="sass">
.badge-plain
  $badge-plain-radius: 20px
  display: inline-blockg
  text-align: centerg
  white-space: nowrapg
  vertical-align: baselineg
  border-top-left-radius: $badge-plain-radius
  border-top-right-radius: $badge-plain-radius
  border-bottom-right-radius: $badge-plain-radius
</style>

<script setup lang="ts">
import type { $ElementPath, $FieldType, $TEnum, $TList, $TObject, $TUnknown } from '@wuapi/essential/esm';
import { computed, ref, toRefs, watch, type Ref } from 'vue';
import EntityBadge from './EntityBadge.vue';
import EnumBadge from './EnumBadge.vue';

const props = defineProps<{
  type: $FieldType,
  opened: boolean,
  noOpenner?: boolean,
}>()

const { opened } = toRefs(props)

const typeData  = computed(() => {
  return {
      asNormal  : fieldTypeToString(props.type),
      asObject  : props.type?.type == "TObject"  ? (props.type as $TObject   ): null,
      asEnum    : props.type?.type == "TEnum"    ? (props.type as $TEnum     ): null,
      asList    : props.type?.type == "TList"    ? (props.type as $TList     ): null,
      asUnknown : props.type?.type == "TUnknown" ? (props.type as $TUnknown  ): null,
  }
})

// watch(() => props.opened, (newValue) => {
//   console.log("FieldTypeBadge.watch(props.opened):", newValue)
// })

function fieldTypeToString(type: $FieldType | null | undefined): string | null {
  switch(type?.type){
    case 'TInteger'  : return 'Integer'
    case 'TLong'     : return 'Long'
    case 'TDouble'   : return 'Double'
    case 'TID'       : return 'ID'
    case 'TURL'      : return 'URL'
    case 'TDateTime' : return 'DateTime'
    case 'TBoolean'  : return 'Boolean'
    case 'TString'   : return 'String'
    case 'TSSMap'    : return 'SSMap'
    default: return null
  }
}


</script>
