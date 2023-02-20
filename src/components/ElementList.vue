<template lang="pug">

//- ---------------
//- Entities
table(width="100%").my-2
  tr(v-if="requests.length > 0")
    th.bottom-liner.text-end
      type-badge(type="request")
    th.bottom-liner
      span.material-icons-round.icon.align-middle compare_arrows
    th.bottom-liner
      type-badge(type="response")
  tr(
    v-for="(v, k) in requests"
    :key="k"
  )
    td(
      role="button"
      @click="select('entity', v.req)"
      :class="{'text-danger': isRouteEntity(v.req)}"
    ).text-end.link
      | {{v.req?.name}}
    td.px-0.py-1.text-center.text-primary
      span.material-icons-round.icon.align-middle compare_arrows
    td(
      role="button"
      @click="select('entity', v.res)"
      :class="{'text-danger': isRouteEntity(v.res)}"
    ).text-start.link.pe-2
      | {{v.res?.name}}

//- ---------------
//- Objects
table(width="100%").my-3
  tr(v-if="objects.length > 0")
    th.px-2.bottom-liner
      type-badge(type="object")
  tr(
    v-for="(v, k) in objects"
    :key="k"
  )
    td(
      role="button"
      @click="select('entity', toPath(v))"
      :class="{'text-danger': isRouteEntity(toPath(v))}"
    ).px-2.py-1.link
      | {{v}}

//- ---------------
//- Enumerations
table(width="100%").my-3
  tr
    th(v-if="enums.length > 0").px-2.bottom-liner
      type-badge(type="enum")
  tr(
    v-for="(v, k) in enums"
    :key="k"
  )
    td(
      role="button"
      @click="select('enum', toPath(v))"
      :class="{'text-danger': isRouteEnum(toPath(v))}"
    ).px-2.py-1.link
      | {{v}}

</template>

<style scoped lang="sass">
.icon
  font-size: 18px

</style>


<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { inject } from 'vue'
import { currentModuleKey, projectKey } from '@/keys'
import _ from 'lodash'
import { useRoute, useRouter } from 'vue-router';
import TypeBadge from '@/components/TypeBadge.vue'
import { $ElementPath, $EntityType } from '@wuapi/essential/esm';
import { getElementPath } from '@/utility_entity';

const project           = inject(projectKey)
const currentModule     = inject(currentModuleKey)

const router            = useRouter()
const route             = useRoute()

const path              = computed(() => getElementPath(route))

const module            = computed(() => project?.value?.modules[currentModule?.value ?? ""])
const enums             = computed(() => _.keys(module?.value?.enums))
const objects           = computed(() => _.keys(_.pickBy(module?.value?.entities, (v) => v?.type == $EntityType.OBJECT)))
const requests          = computed(() => _.map(_.toPairs(_.pickBy(module?.value?.entities, (v) => v?.type == $EntityType.REQUEST)), (pair) => {
  return {
    req: toPath(pair[0]),
    res: pair[1].response
  }
}))

function toPath(name: string | null | undefined): $ElementPath | null {
  return name ? new $ElementPath(currentModule?.value ?? null, name) : null
}

function isRouteEntity(_path: $ElementPath | null | undefined = null): boolean {
  return route.name == 'showEntity' && path.value.equals(_path)
}

function isRouteEnum(_path: $ElementPath | null | undefined = null): boolean {
  return route.name == 'showEnum' && path.value.equals(_path)
}

function select(type: 'enum' | 'entity', _path: $ElementPath | null | undefined){
  const version = route.params['version']
  if(_path) router.push(`/v/${version}/api/${type}/${_path.module}/${_path.name}`)
}
</script>
