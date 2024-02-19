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
        :class="store.isCreate ? 'bg-light-green' : 'bg-light-blue'"
      >
        <q-icon :name="store.isCreate ? 'create' : 'update'" />
        <q-toolbar-title>{{
          store.isCreate ? "增加记录" : "编辑内容"
        }}</q-toolbar-title>
        <q-btn
          v-close-popup
          flat
          round
          dense
          icon="close"
          @click.stop="store.isCreate ? $emit('cancelcreate') : $emit('cancelupdate')"
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
              label="耗材"
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
              v-model="store.searchData.customer"
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
            v-model="store.Data.Printer.品牌"
            filled
            label="品牌"
            lazy-rules="ondemand"
            hide-bottom-space
            :error="store.formState.Printer.brandError"
          >
            <template #prepend>
              <q-icon name="turned_in" />
            </template>
            <template #error>
              {{ store.formState.Printer.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.Data.Printer.打印机"
            filled
            label="打印机型号"
            hide-bottom-space
            lazy-rules="ondemand"
            :error="store.formState.Printer.typeError"
          >
            <template #prepend>
              <q-icon name="print" />
            </template>
            <template #error>
              {{ store.formState.Printer.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.Data.Printer.硒鼓"
            filled
            label="硒鼓型号"
            lazy-rules="ondemand"
            hide-bottom-space
            :error="store.formState.Printer.cartridgeError"
          >
            <template #prepend>
              <q-icon name="recycling" />
            </template>
            <template #error>
              {{ store.formState.Printer.errorMsg }}
            </template>
          </q-input>

          <q-select
            v-model="store.Data.Printer.颜色"
            filled
            label="颜色"
            hide-bottom-space
            lazy-rules="ondemand"
            :options="store.colorOptions"
            :error="store.formState.Printer.colorError"
          >
            <template #prepend>
              <q-icon name="palette" />
            </template>
            <template #error>
              {{ store.formState.Printer.errorMsg }}
            </template>
          </q-select>

          <q-input
            v-model.number="store.Data.Printer.数量"
            type="number"
            filled
            label="数量"
            hide-bottom-space
            lazy-rules="ondemand"
            :error="store.formState.Printer.amountError"
          >
            <template v-if="!store.isCreate" #before>
              <q-btn icon="add" round color="green" @click="addOne" />
            </template>
            <template v-if="!store.isCreate" #after>
              <q-btn icon="remove" round color="red" @click="subtractOne" />
            </template>
            <template #prepend>
              <q-icon name="iso" />
            </template>
            <template #error>
              {{ store.formState.Printer.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.Data.Printer.办公室"
            filled
            label="办公室"
            hide-bottom-space
            lazy-rules="ondemand"
            :error="store.formState.Printer.officeError"
          >
            <template #prepend>
              <q-icon name="meeting_room" />
            </template>
            <template #error>
              {{ store.formState.Printer.errorMsg }}
            </template>
          </q-input>

          <div>
            <UploadComponent />
          </div>

          <div v-if="store.Data[store.searchData.type].hasPic">
            <ImageComponent />
          </div>

          <div class="row q-gutter-sm justify-end q-mt-lg">
            <q-btn
              color="primary"
              :icon="store.isCreate ? 'create' : 'update'"
              :class="store.isMobile ? 'col-12' : 'col-3'"
              :label="store.isCreate ? '增 加' : '编 辑'"
              :loading="store.btnLoading"
              @click="store.isCreate ? $emit('create') : $emit('update')"
            />
            <q-btn
              v-close-popup
              icon="block"
              color="grey"
              label="取 消"
              :class="store.isMobile ? 'col-12' : 'col-3'"
              @click.stop="
                store.isCreate ? $emit('cancelcreate') : $emit('cancelupdate')
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
import UploadComponent from "./UploadComponent.vue";
import ImageComponent from "./ImageComponent.vue";

const addOne = () => {
  store.Data.Printer.数量++;
};
const subtractOne = () => {
  if (store.Data.Printer.数量 > 0) {
    store.Data.Printer.数量--;
  }
};

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["cancelcreate", "cancelupdate", "create", "update"]);
</script>
