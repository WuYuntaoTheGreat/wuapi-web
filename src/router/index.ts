import { createRouter, createWebHashHistory } from 'vue-router'
import VersionBase from '@/views/VersionBase.vue'
import Main from '@/views/Main.vue'
import ShowEnum from '@/views/ShowEnum.vue'
import ShowEntity from '@/views/ShowEntity.vue'
import Tree from '@/views/Tree.vue'
import Pathes from '@/views/Pathes.vue'
import Search from '@/views/Search.vue'
import VersionList from '@/views/VersionList.vue'
import App from '@/App.vue'
import Help from '@/views/Help.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'home',
      path: '/',
      component: App,
    },
    {
      name: 'versionBase',
      path: '/v/:version',
      component: VersionBase,
      children: [
        {
          path: 'api',
          name: 'main',
          component: Main,
          children: [
            {
              name: "showEnum",
              path: "enum/:module/:name",
              component: ShowEnum,
            },
            {
              name: "showEntity",
              path: "entity/:module/:name",
              component: ShowEntity,
            },
            {
              name: "tree",
              path: "tree",
              component: Tree,
            },
            {
              name: "pathes",
              path: "pathes",
              component: Pathes,
            },
          ]
        },
        {
          name: "search",
          path: "search",
          component: Search,
        },
        {
          name: "versions",
          path: "versions",
          component: VersionList,
        },
        {
          name: "help",
          path: "help",
          component: Help,
        },
      ]
    }
  ]
})

export default router
