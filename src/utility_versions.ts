import {
  $ElementPath,
  $Entity,
  $Enum,
  $EnumItem,
  $Field,
  $FieldType,
  $Module,
  $Project,
  $TEnum,
  $TList,
  $TObject,
  $TUnknown
} from "@wuapi/essential/esm"

import _ from "lodash"

export type ComparationItem<T, D> = {
  type: ("a" | "b" | "d"),
  k: string,
  a?: T,
  b?: T,
  diffData?: D,
}
export function compareObjects<T, D>(
  a: {[key: string]: T},
  b: {[key: string]: T},
  comparator: (a: T, b: T) => D | undefined): ComparationItem<T, D>[] {

  let result: ComparationItem<T, D>[] = []

  const aKeys = _.keys(a)
  const bKeys = _.keys(b)

  _.difference(aKeys, bKeys).forEach((k) => { result.push({
    type: "a",
    k,
    a: a[k],
  })})

  _.difference(bKeys, aKeys).forEach((k) => { result.push({
    type: "b",
    k,
    b: b[k],
  })})

  _.intersection(aKeys, bKeys).forEach((k) => { 
    const diffData = comparator(a[k], b[k]) 
    if(diffData){
      result.push({
        type: "d",
        k,
        a: a[k],
        b: b[k],
        diffData
      })
    }
  })

  return _.sortBy(result, ['k'])
}

export function asCompare<T, D>(which: "a" | "b", map: {[key: string]: T}): ComparationItem<T, D>[] {
  let result: ComparationItem<T, D>[] = []
  _.forIn(map, (value, k) => {
    result.push({
      type: which,
      k,
      a: which == "a" ? value : undefined,
      b: which == "b" ? value : undefined,
      diffData: undefined
    })
  })
  return result
}
  

/**
 * Compare 2 projects.
 * @param a 
 * @param b 
 * @returns 
 */
export function compareProjects(a: $Project, b: $Project): ComparationItem<$Module, ModuleDiffData>[] {
  return compareObjects(a.modules, b.modules, compareModules)
}

export type ModuleDiffData = {
  entities: ComparationItem<$Entity, EntityDiffData>[],
  enums: ComparationItem<$Enum, ComparationItem<$EnumItem, EnumItemDiffData>[]>[],
}
function compareModules(a: $Module, b: $Module): ModuleDiffData | undefined{
  const entities  = compareObjects(a.entities, b.entities, compareEntities)
  const enums     = compareObjects(a.enums, b.enums, compareEnums)
  if(entities.length == 0 && enums.length == 0){
    return undefined
  } else {
    return {
      entities,
      enums,
    }
  }
}

export type EntityDiffData = {
  entity    : string[],
  fields    : ComparationItem<$Field, string[]>[],
  generics  : ComparationItem<$Field, string[]>[],
}
function compareEntities(a: $Entity, b: $Entity): EntityDiffData | undefined {
  const fields    = compareObjects(a.fieldsLocal, b.fieldsLocal, compareFields)
  const generics  = compareObjects(a.genericMap, b.genericMap, compareFields)
  let entity: string[] = []

  if(a.isAbstract   != b.isAbstract)                  entity.push("isAbstract")
  if(a.path         != b.path)                        entity.push("path")
  if(a.method       != b.method)                      entity.push("method")
  if(!compareElementPathes(a.parent, b.parent))       entity.push("parent")
  if(!compareElementPathes(a.response, b.response))   entity.push("response")

  if(fields.length > 0 || generics.length > 0 || entity.length > 0){
    return {
      entity,
      fields,
      generics,
    }
  } else {
    return undefined
  }
}

function compareElementPathes(a: $ElementPath | null | undefined, b: $ElementPath | null | undefined): boolean {
  const aV = !!a
  const bV = !!b
  if(aV != bV) return false
  if(!aV) return true
  return a.equals(b)
}

function compareFields(a: $Field, b: $Field): string[] | undefined {
  let result: string[] = []
  if(a.realname   != b.realname)          result.push("realname")
  if(a.isOptional != b.isOptional)        result.push("isOptional")
  if(a.fixedValue != b.fixedValue)        result.push("fixedValue")
  if(!compareFieldType(a.type, b.type))   result.push("type")
  return result.length > 0 ? result : undefined
}

/**
 * @param a 
 * @param b 
 * @returns true if 2 types equal, false otherwise.
 */
function compareFieldType(a: $FieldType, b: $FieldType): boolean {
  if(a.type != b.type) return false
  switch(a.type){
    case "TObject"   : return (a as $TObject).entity.equals((b as $TObject).entity)
    case "TEnum"     : return (a as $TEnum).enu.equals((b as $TEnum).enu)
    case "TUnknown"  : return (a as $TUnknown).unknown == (b as $TUnknown).unknown
    case "TList"     : return compareFieldType((a as $TList).member, (b as $TList).member)
    default: return true
  }
}

function compareEnums(a: $Enum, b: $Enum): ComparationItem<$EnumItem, EnumItemDiffData>[] | undefined{
  const result = compareObjects(a.enumMap, b.enumMap, compareItems) 
  if(result.length > 0){
    return result
  } else {
    return undefined
  }
}

export type EnumItemDiffData = {a: number, b: number}
function compareItems(a: $EnumItem, b: $EnumItem): EnumItemDiffData | undefined {
  return (a.value == b.value) ? undefined : { a: a.value, b: b.value }
}

