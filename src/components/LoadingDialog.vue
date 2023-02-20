<template lang="pug">
.modal(ref="modalEle" role="dialog")
  .modal-dialog.modal-sm
    .modal-content
      .modal-body.text-center
        .spinner-border.text-primary.m-4
        .loader-text
          p {{title ?? ""}}
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Modal } from 'bootstrap'

defineProps<{
    title?: string
}>()

let modalEle = ref<Element | null>(null)
let modalObj: Modal | null = null

onMounted(() => {
  modalObj = new Modal(modalEle.value!, {
    backdrop: 'static',
    keyboard: false,
  })
})

const show = () => {
  modalObj?.show()
}

const hide = () => {
  modalObj?.hide()
}

defineExpose({
  show,
  hide,
})


</script>