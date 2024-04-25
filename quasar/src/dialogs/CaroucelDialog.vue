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
        <q-btn v-close-popup flat icon="close" @click="store.carouselSlide = 0">
          <q-tooltip>关闭</q-tooltip>
        </q-btn>
      </q-bar>

      <q-carousel
        v-model="store.carouselSlide"
        animated
        arrows
        swipeable
        navigation
        infinite
        control-color="amber"
        :height="dialogHeight + 'px'"
        class="bg-grey-3 shadow-2 rounded-borders"
      >
        <q-carousel-slide 
          v-for="(name, index) in store.picNames"
          :key="index"
          :name="index"
          class="column no-wrap" 
        >
          <q-img 
            class="rounded-borders full-height" 
            :src="'/queryuploads/' + name" 
            fit="contain"
            @click="maximizedDialog = true"
          />


          
          <q-dialog
            v-model="maximizedDialog"
            backdrop-filter="blur(4px)"
            persistent
            maximized
            transition-show="slide-up"
            transition-hide="slide-down"
          >
            <q-card>
              <q-card-section class="q-ma-xs q-pa-xs">
                <q-img 
                  class="rounded-borders full-height" 
                  :src="'/queryuploads/' + name" 
                  fit="contain"
                > 
                <q-icon 
                  v-close-popup
                  class="absolute all-pointer-events" 
                  size="32px" 
                  name="close" 
                  color="white" 
                  style="top: 8px; right: 8px" 
                >
                  <q-tooltip>
                    关闭
                  </q-tooltip>
                </q-icon>
              </q-img>
              </q-card-section>
            </q-card>
          </q-dialog>
          
        </q-carousel-slide>
      </q-carousel>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useUserStore } from "../stores/store";
import { ref, computed } from "vue";

const store = useUserStore();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const dialogHeight = computed(() => {
  let height = store.$q.screen.height;
  if (height < 600) {
    return height = 600;
  }
  return height*0.8;

})

const maximizedDialog = ref(false)



</script>

<style></style>



