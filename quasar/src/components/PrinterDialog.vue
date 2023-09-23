<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    :maximized="store.isMobile"
    v-bind="$attrs"
  >
    <q-card>
      <q-toolbar
        class="text-white"
        :class="store.isAdd ? 'bg-light-green' : 'bg-light-blue'"
      >
        <q-icon :name="store.isAdd ? 'add' : 'edit'" />
        <q-toolbar-title>{{
          store.isAdd ? "增加记录" : "编辑内容"
        }}</q-toolbar-title>
        <q-btn
          v-close-popup
          flat
          round
          dense
          icon="close"
          @click.stop="store.isAdd ? $emit('canceladd') : $emit('canceledit')"
        />
      </q-toolbar>
      <q-separator />

      <q-card-section>
        <div
          :class="store.isMobile ? 'q-gutter-sm' : 'q-gutter-md'"
          :style="store.isMobile ? 'width: 100%' : 'min-width: 500px;'"
        >
          <div class="row">
            <q-input
              v-model="store.searchData.type"
              class="col-6"
              flat
              lazy-rules="ondemand"
              hide-bottom-space
              readonly
            >
              <template #prepend>
                <q-icon name="title" />
              </template>
            </q-input>
            <q-input
              v-model="store.searchData.place"
              class="col-6"
              lazy-rules="ondemand"
              readonly
            >
              <template #prepend>
                <q-icon name="location_on" />
              </template>
            </q-input>
          </div>

          <q-input
            v-model="store.printerData.品牌"
            filled
            label="品牌"
            lazy-rules="ondemand"
            hide-bottom-space
            :error="store.printerFormState.brandError"
          >
            <template #prepend>
              <q-icon name="turned_in" />
            </template>
            <template #error>
              {{ store.printerFormState.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.printerData.打印机"
            filled
            label="打印机型号"
            hide-bottom-space
            lazy-rules="ondemand"
            :error="store.printerFormState.typeError"
          >
            <template #prepend>
              <q-icon name="print" />
            </template>
            <template #error>
              {{ store.printerFormState.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.printerData.硒鼓"
            filled
            label="硒鼓型号"
            lazy-rules="ondemand"
            hide-bottom-space
            :error="store.printerFormState.cartridgeError"
          >
            <template #prepend>
              <q-icon name="recycling" />
            </template>
            <template #error>
              {{ store.printerFormState.errorMsg }}
            </template>
          </q-input>

          <q-select
            v-model="store.printerData.颜色"
            filled
            label="颜色"
            hide-bottom-space
            lazy-rules="ondemand"
            :options="store.colorOptions"
            :error="store.printerFormState.colorError"
          >
            <template #prepend>
              <q-icon name="palette" />
            </template>
            <template #error>
              {{ store.printerFormState.errorMsg }}
            </template>
          </q-select>

          <q-input
            v-model.number="store.printerData.数量"
            type="number"
            filled
            label="数量"
            hide-bottom-space
            lazy-rules="ondemand"
            :error="store.printerFormState.amountError"
          >
            <template v-if="!store.isAdd" #before>
              <q-btn icon="add" round color="green" @click="addOne" />
            </template>
            <template v-if="!store.isAdd" #after>
              <q-btn icon="remove" round color="red" @click="subtractOne" />
            </template>
            <template #prepend>
              <q-icon name="iso" />
            </template>
            <template #error>
              {{ store.printerFormState.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.printerData.办公室"
            filled
            label="办公室"
            hide-bottom-space
            lazy-rules="ondemand"
            :error="store.printerFormState.officeError"
          >
            <template #prepend>
              <q-icon name="meeting_room" />
            </template>
            <template #error>
              {{ store.printerFormState.errorMsg }}
            </template>
          </q-input>

          <div class="row q-gutter-sm justify-end q-mt-lg">
            <q-btn
              color="primary"
              :icon="store.isAdd ? 'add' : 'edit'"
              :class="store.isMobile ? 'col-12' : 'col-3'"
              :label="store.isAdd ? '增 加' : '编 辑'"
              :loading="store.addBtnLoading"
              @click="store.isAdd ? $emit('add') : $emit('edit')"
            />
            <q-btn
              v-close-popup
              icon="block"
              color="grey"
              label="取 消"
              :class="store.isMobile ? 'col-12' : 'col-3'"
              @click.stop="
                store.isAdd ? $emit('canceladd') : $emit('canceledit')
              "
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useUserStore } from "../stores/store";
const store = useUserStore();

const addOne = () => {
  store.printerData.数量++;
};
const subtractOne = () => {
  if (store.printerData.数量 > 0) {
    store.printerData.数量--;
  }
};

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["canceladd", "canceledit", "add", "edit"]);
</script>
