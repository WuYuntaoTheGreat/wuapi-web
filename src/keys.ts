/*
 *  The file provide keys of provide/inject.
 */
import type { InjectionKey, Ref } from "vue"
import type { $Project } from "@wuapi/essential/esm"

/**
 * The key for actionExpandCollapse
 */
export const actionExpandCollapseKey = Symbol() as InjectionKey<Ref<number>>

/**
 * The key for project.
 */
export const projectKey = Symbol() as InjectionKey<Ref<$Project | null>>

/**
 * The key for version list.
 */
export const versionListKey = Symbol() as InjectionKey<Ref<{[key: string]: string}>>

/**
 * The key for current module.
 */
export const currentModuleKey = Symbol() as InjectionKey<Ref<string | null>>
