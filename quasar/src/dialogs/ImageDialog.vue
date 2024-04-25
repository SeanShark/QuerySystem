<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    :maximized="store.isMobile"
    v-bind="$attrs"
    :full-width="store.fullscreen"
  >
    <q-card :style="store.isMobile ? '' : 'width: 1100px; max-width: 80vw;'">
      <q-bar>
        <q-space />
        <q-btn
          v-if="!store.isMobile"
          flat
          :icon="store.fullscreen? 'fullscreen_exit' : 'fullscreen'"
          @click="store.fullscreen = !store.fullscreen"
        >
          <q-tooltip>最大化</q-tooltip>
        </q-btn>
        <q-btn v-close-popup flat icon="close"  @click="$emit('close')">
          <q-tooltip>关闭</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pa-none q-ma-none">
        <ImageComponent/>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useUserStore } from "../stores/store";
import ImageComponent from "../components/ImageComponent.vue";
const store = useUserStore();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);
</script>

<style></style>
