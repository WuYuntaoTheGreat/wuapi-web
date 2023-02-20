import { $ElementPath } from "@wuapi/essential/esm"
import type { RouteLocationNormalizedLoaded } from "vue-router"
import { strOrArr } from './utility'

/**
 * Create a element path object from route.
 * @param route The route object, normally from `useRoute()`
 * @returns The element path object from the route.
 */
export function getElementPath(route: RouteLocationNormalizedLoaded): $ElementPath {
  const module = strOrArr(route.params.module) 
  const name = strOrArr(route.params.name)
    return new $ElementPath(module, name)
}