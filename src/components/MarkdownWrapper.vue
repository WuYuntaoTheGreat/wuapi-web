<template lang="pug">
markdown(
  :source="source"
)
</template>

<script>
import Markdown from 'vue3-markdown-it';

export default {
  props: [
    'source',
  ],
  components: {
    Markdown,
  }, 
}
</script>