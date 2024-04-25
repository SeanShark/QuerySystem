<template>
  <div>
    <q-img 
      v-for="(name, index) in picnames"
      :key="index"
      :src="'/queryuploads/' + name"
      spinner-color="white" 
      alt="Uploaded Picture"
      fit="contain"
    >
      <q-icon
        v-if="!store.openImageDialog"
        class="absolute all-pointer-events"
        size="24px"
        name="delete"
        color="red"
        style="top: 8px; right: 8px"
        @click="deleteImgConfirm(name)"
        >
        <q-tooltip> 删除 </q-tooltip>
      </q-icon>
    </q-img>
  </div>
</template>

<script setup>
import { useUserStore } from "../stores/store";
const store = useUserStore();

const props = defineProps({
  picnames: {
    type: Array,
    required: true
  },
})

const deleteImgConfirm = (picname) => {
  store.$q.dialog({
    title: '确认删除',
    message: '确认要删除图片信息吗？',
    cancel: true,
    persistent: true,
    ok: {
      push: true,
      label: "确定",
      color: "green",
    },
    cancel: {
      push: true,
      color: "grey",
      label: "取消",
    },
  }).onOk(async () => {
    await store.deleteImg(picname)
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}
</script>

<style>
</style>