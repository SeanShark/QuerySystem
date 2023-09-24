<template>
  <q-dialog :model-value="modelValue" persistent :maximized="store.isMobile">
      <q-card class="q-pb-lg" >
        <q-card-section>
          <div class="row justify-bejtween">
            <div class="text-h6 text-center">使用技巧：</div>
            <q-space/>
            <q-btn icon="close" flat round dense @click="exitHelp"/>
          </div>
        </q-card-section>
        <q-separator />
        <q-scroll-area ref="scrollAreaRef" style="height: 600px; max-width: 100%;" @scroll="lisentingScroll">
          <q-card-section class="q-pa-md">
            <div class="text-subtitle2">
              <q-chip clickable @click="setPosition(0)">增加</q-chip>
              <q-chip clickable @click="setPosition(570)">编辑与删除</q-chip>
              <q-chip clickable @click="setPosition(1160)">导出</q-chip>
              <q-chip clickable @click="setPosition(1730)">全记录</q-chip>
              <q-chip clickable @click="setPosition(2300)">空记录</q-chip>
              <q-chip clickable @click="setPosition(3000)">过滤</q-chip>
            </div>
          </q-card-section>
          <q-card-section class="q-pa-md">
            
            <p><q-icon v-for="n in 3" :key="n" name="double_arrow" color="green"/>选择了类型与地点之后，右下角可弹出增加记录的按钮（小球可拖拽）。</p>
            <q-img spinner-color="white" src="/pics/add.png"/>
          </q-card-section>
  
          <q-card-section class="q-pa-md">
            <p><q-icon v-for="n in 3" :key="n" name="double_arrow" color="green"/>搜索出结果后，选择相关记录，右下角可以进行编辑与删除。</p>
            <q-img spinner-color="white" src="/pics/editanddel.png" />
          </q-card-section>
          <q-card-section class="q-pa-md">
            <p><q-icon v-for="n in 3" :key="n" name="double_arrow" color="green"/>搜索出结果后，右下角可以下载搜索出来的数据。</p>
            <q-img spinner-color="white" src="/pics/download.png" />
          </q-card-section>
          <q-card-section class="q-pa-md">
            <p><q-icon v-for="n in 3" :key="n" name="double_arrow" color="green"/>搜索关键字为“全部”，可搜索所有记录。</p>
            <q-img spinner-color="white" src="/pics/all.png" />
          </q-card-section>
          <q-card-section class="q-pa-md">
            <p><q-icon v-for="n in 3" :key="n" name="double_arrow" color="green"/>搜索关键字为“空的”，可搜索所有字段为空的记录。</p>
            <q-img spinner-color="white" src="/pics/empty.png" />
          </q-card-section>
          <q-card-section class="q-pa-md">
            <p><q-icon v-for="n in 3" :key="n" name="double_arrow" color="green"/>"过滤"功能，输入关键字可以对结果进行进一步过滤。</p>
            <q-img spinner-color="white" src="/pics/filter.png" />
          </q-card-section>

          <q-page-sticky position="bottom" :offset="[18, 18]" >
            <q-btn 
              v-if="showToTop"
              flat 
              icon="keyboard_double_arrow_up" 
              color="teal" 
              padding="sm"
              size="lg"
              @click="setPosition(0)"
            />
          </q-page-sticky>
  
        </q-scroll-area>
        <q-card-actions align="right" >
          <q-btn v-close-popup label="确定" color="primary" @click="exitHelp"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from "../stores/store";
const store = useUserStore();
const emit = defineEmits(['update:modelValue']);

const scrollAreaRef = ref(null);
const showToTop = ref(false);
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
});
const exitHelp = () => {
  emit('update:modelValue', false)
};

const setPosition = async (position) => {
  await scrollAreaRef.value?.setScrollPosition('vertical', position, 300)
}

const lisentingScroll = async (e) => {
  const verticalPosition = e.verticalPosition;
  if (verticalPosition > 100 ) {
    showToTop.value = true;
  } else {
    showToTop.value = false;
  }
}
</script>
