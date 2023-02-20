<template lang="pug">

table(v-show="versionToCompare").compare-table
  tr
    th(colspan="4").p-1
      version-badge(
        :version="version ?? undefined"
        type="none"
      )
    td.p-2.bg-white.text-center
    th(colspan="4").p-1
      version-badge(
        :version="versionToCompare"
        type="none"
      )
  tr(
    v-for="(row, k) in rowList"
    :key="k"
  )
    td(
      v-for="k in row.depth"
      :class="[`tree-${row.lineAs[k - 1]}`]"
    ).tree.p-0
    td( :colspan="4 - row.depth" ).py-1.pe-3
      compare-table-cell(
        v-if="row.comp != 'b'" 
        :type="row.type"
        :version="version"
        :path="row.path"
        :name="row.key"
        :element="row.a"
      )

    //- ========== 
    td.bg-white
    //- ==========

    td(
      v-for="k in row.depth"
      :class="[`tree-${row.lineBs[k - 1]}`]"
    ).tree.p-0
    td( :colspan="4 - row.depth" ).py-1.pe-3
      compare-table-cell(
        v-if="row.comp != 'a'" 
        :type="row.type"
        :version="versionToCompare"
        :path="row.path"
        :name="row.key"
        :element="row.b"
      )

loading-dialog(ref="ldRef" title="Loading Project Data ...")
</template>


<style scoped lang="sass">
.compare-table
  margin: 20px auto
  th
    // width: 50%

  tr:nth-child(even)
    background-color: #fafafa
  tr:nth-child(odd)
    background-color: #f0f0f0

  td.tree
    width: 24px
    position: relative

    &:before, &:after
      position: absolute
      content: ''

    &.tree-L:before, &.tree-F:before
      // half -
      top:  50%
      left: 50%
      width:  50%
      height: 2px
      border-top: 1px solid black

    &.tree-I:after, &.tree-F:after
      // full |
      top:  0px
      left: 50%
      width:  2px
      height: 100%
      border-left: 1px solid black

    &.tree-L:after
      // half |
      top:  0px
      left: 50%
      width:  2px
      height: 50%
      border-left: 1px solid black

</style>

<script setup lang="ts">
import LoadingDialog from '@/components/LoadingDialog.vue';
import VersionBadge from '@/components/VersionBadge.vue';
import CompareTableCell from './CompareTableCell.vue';
import { projectKey, versionListKey } from '@/keys';
import { strOrArr } from '@/utility';
import { 
  asCompare,
  compareProjects,
  type ComparationItem,
  type EntityDiffData,
  type EnumItemDiffData,
  type ModuleDiffData } from '@/utility_versions';
import {
  $ElementPath,
  $Entity,
  $Enum,
  $EnumItem,
  $Field,
  $Module,
  $Project } from '@wuapi/essential/esm';
import _ from 'lodash';
import { computed, inject, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';

const route              = useRoute()
const project            = inject(projectKey)
const version            = computed(() => strOrArr(route.params['version']))
const versionList        = inject(versionListKey)
const versionToCompare   = ref<string | undefined>(undefined)
const ldRef              = ref<InstanceType<typeof LoadingDialog>>()

const rowList: Ref<CompRow[]> = ref([])

/**
 * 
 * @param version The version to fetch
 */
function fetchProject (version: string | null) {
  if(!version) {
    versionToCompare.value = undefined
    return
  }
  versionToCompare.value = version
  const pth = versionList?.value[version]

  ldRef.value?.show()
  fetch(pth!)
    .then((res) => {
      return res.json()
    })
    .then((data)=>{
      ldRef.value?.hide()
      rowList.value = []
      flatProjectComparison(rowList.value, compareProjects(project!.value!, $Project.load(data)!))
    })
}

type LineItemp = "S" | "I" | "F" | "L" 

/**
 * The class of comparation row.
 */
class CompRow {

  // if no child
  bachlor  = false

  path?: $ElementPath
  a?: $Module | $Entity | $Field | $Enum | $EnumItem
  b?: $Module | $Entity | $Field | $Enum | $EnumItem

  /**
   * Constructor of CompRow.
   * @param type The type of this row, defined by the element 
   * @param comp The comparation type, "a" | "b" | "d"
   * @param key The name of the row
   * @param parent The parent of this row.
   * 
   */
  constructor(
    public type: "module" | "entity" | "field" | "generic" | "enum" | "item",
    public comp: "a" | "b" | "d",
    public key: string,
    public parent: CompRow | null,
  ){}
  fold      = ref<boolean>(false)
  shallFold = computed(() => {
    if(this.parent?.shallFold.value) return true
    return this.fold
  })

  depth = computed(() => {
    let result = 0
    switch(this.type){
      case "module":
        result = 1
        break
      case "entity": 
      case "enum":
        result = 2
        break
      default:
        result = 3
        break
    }
    return result
  })

  lineA   = "S"
  lineB   = "S"

  lineAs  = computed(() => {
    let lines: string = this.parent?.lineAs.value ?? ""
    lines = lines.replace(/L/g, "S")
    lines = lines.replace(/F/g, "I")
    lines += this.lineA
    return lines
  })

  lineBs  = computed(() => {
    let lines: string = this.parent?.lineBs.value ?? ""
    lines = lines.replace(/L/g, "S")
    lines = lines.replace(/F/g, "I")
    lines += this.lineB
    return lines
  })
}

function assembleLines(rows: CompRow[]){
  const lastA = _.findLastIndex(rows, (r) => r.comp != "b")
  const lastB = _.findLastIndex(rows, (r) => r.comp != "a")
  console.log(`rows.lastA=${lastA}; lastB=${lastB};`)
  rows.forEach((r, i) => {
    switch(r.comp){
      case "a": {
        r.lineA = (i == lastA) ? "L" : "F"
        r.lineB = (i <= lastB) ? "I" : "S"
        break
      }
      case "b": {
        r.lineA = (i <= lastA) ? "I" : "S"
        r.lineB = (i == lastB) ? "L" : "F"
        break
      }
      case "d": {
        r.lineA = (i == lastA) ? "L" : "F"
        r.lineB = (i == lastB) ? "L" : "F"
        break
      }
    }
  })
}

/**
 * 
 * @param projectComparison 
 */
function flatProjectComparison(rows: CompRow[], projectComparison: ComparationItem<$Module, ModuleDiffData>[] ){
  console.log(projectComparison)
  let level: CompRow[] = []
  for(let mComp of projectComparison) {
    let row = new CompRow("module", mComp.type, mComp.k, null)
    row.a = mComp.a
    row.b = mComp.b
    row.path = new $ElementPath(mComp.k, null)
    level.push(row)
    rows.push(row)
    const lastRowLength = rows.length
    switch (mComp.type){
      case "a": {
        let level1: CompRow[] = []
        flatEntityComparision(level1, rows, row, asCompare("a", mComp.a!.entities))
        flatEnumComparison(level1, rows, row, asCompare("a", mComp.b!.enums))
        assembleLines(level1)
        break
      }
      case "b": {
        let level1: CompRow[] = []
        flatEntityComparision(level1, rows, row, asCompare("b", mComp.b!.entities))
        flatEnumComparison(level1, rows, row, asCompare("b", mComp.b!.enums))
        assembleLines(level1)
        break
      }
      case "d": {
        let level1: CompRow[] = []
        flatEntityComparision(level1, rows, row, mComp.diffData!.entities)
        flatEnumComparison(level1, rows, row, mComp.diffData!.enums)
        assembleLines(level1)
        break
      }
    }
    row.bachlor = rows.length == lastRowLength
  }
  assembleLines(level)
  rows.forEach((r) => {
  })
}

function flatEnumComparison(level: CompRow[], rows: CompRow[], parent: CompRow, enumComparision: ComparationItem<$Enum, ComparationItem<$EnumItem, EnumItemDiffData>[]>[]){
  for(let eComp of enumComparision){
    let row = new CompRow("enum", eComp.type, eComp.k, parent)
    row.a = eComp.a
    row.b = eComp.b
    row.path = new $ElementPath(parent.path?.module ?? null, eComp.k)
    level.push(row)
    rows.push(row)
    const lastRowLength = rows.length
    switch(eComp.type){
      case "a": {
        flatItemComparision(rows, row, asCompare("a", eComp.a!.enumMap))
        break
      }
      case "b": {
        flatItemComparision(rows, row, asCompare("b", eComp.b!.enumMap))
        break
      }
      case "d": {
        flatItemComparision(rows, row, eComp.diffData!)
        break
      }
    } 
    row.bachlor = rows.length == lastRowLength
  }
}

function flatItemComparision(rows: CompRow[], parent: CompRow, itemComparision: ComparationItem<$EnumItem, EnumItemDiffData>[]){
  let level: CompRow[] = []
  for(let iComp of itemComparision){
    let row = new CompRow("item", iComp.type, iComp.k, parent)
    row.a = iComp.a
    row.b = iComp.b
    row.path = parent.path
    level.push(row)
    rows.push(row)
    row.bachlor = true
  }
  assembleLines(level)
}

function flatEntityComparision(level: CompRow[], rows: CompRow[], parent: CompRow, entityComparision: ComparationItem<$Entity, EntityDiffData>[]){
  for(let eComp of entityComparision){
    let row = new CompRow("entity", eComp.type, eComp.k, parent)
    row.a = eComp.a
    row.b = eComp.b
    row.path = new $ElementPath(parent.path?.module ?? null, eComp.k)
    level.push(row)
    rows.push(row)
    const lastRowLength = rows.length
    switch(eComp.type){
      case "a": {
        let level1: CompRow[] = []
        flatFieldsComparision(level1, "field",    rows, row, asCompare("a", eComp.a!.fieldsLocal))
        flatFieldsComparision(level1, "generic",  rows, row, asCompare("a", eComp.a!.genericMap))
        assembleLines(level1)
        break
      }
      case "b": {
        let level1: CompRow[] = []
        flatFieldsComparision(level1, "field",    rows, row, asCompare("b", eComp.b!.fieldsLocal))
        flatFieldsComparision(level1, "generic",  rows, row, asCompare("b", eComp.b!.genericMap))
        assembleLines(level1)
        break
      }
      case "d": {
        let level1: CompRow[] = []
        flatFieldsComparision(level1, "field",    rows, row, eComp.diffData!.fields)
        flatFieldsComparision(level1, "generic",  rows, row, eComp.diffData!.generics)
        // TODO: process [ eComp.diffData!.entity ]
        assembleLines(level1)
        break
      }
    }
    row.bachlor = rows.length == lastRowLength
  }
}

function flatFieldsComparision(level: CompRow[], type: "field" | "generic", rows: CompRow[], parent: CompRow, fieldComparision: ComparationItem<$Field, string[]>[]){
  for(let fComp of fieldComparision){
    let row = new CompRow(type, fComp.type, fComp.k, parent)
    row.a = fComp.a
    row.b = fComp.b
    row.path = parent.path
    rows.push(row)
    level.push(row)
    row.bachlor = true
  } 
}

defineExpose({
  fetchProject
})
</script>
