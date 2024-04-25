<template>
  <q-dialog 
    :model-value="modelValue" 
    persistent 
    class="q-pa-md" 
    v-bind="$attrs"
  >
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="delete" color="red" text-color="white" />
        <span class="q-ml-sm">删除记录</span>
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle2">
          确定要删除该记录吗？该操作不能撤回与恢复。
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup flat label="取消" color="grey" />
        <q-btn
          flat
          label="删除"
          color="primary"
          @click="$emit('delete')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
})

const emit = defineEmits(['delete'])

</script>
