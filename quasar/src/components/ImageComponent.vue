<template>
  <q-img :src="store.imageUrl" spinner-color="white" alt="Uploaded Picture">
    <q-icon
      v-if="!store.openImageDialog"
      class="absolute all-pointer-events"
      size="24px"
      name="delete"
      color="red"
      style="top: 8px; right: 8px"
      @dblclick="store.deleteImg"
    >
      <q-tooltip> 双击删除 </q-tooltip>
    </q-icon>
    <q-icon
      v-if="!store.openImageDialog"
      class="absolute all-pointer-events"
      size="24px"
      name="refresh"
      color="green"
      style="top: 8px; right: 40px"
      @click.stop="store.forceUpdateImg"
    >
      <q-tooltip> 强制刷新 </q-tooltip>
    </q-icon>
  </q-img>
</template>

<script setup>
import { useUserStore } from "../stores/store";
const store = useUserStore();
</script>

<style>
</style>