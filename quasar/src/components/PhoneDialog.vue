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
              label="电话"
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
            v-model.number="store.Data.Phone.号码"
            filled
            label="号码"
            hint="号码为8位数"
            lazy-rules="ondemand"
            hide-hint
            hide-bottom-space
            :error="store.formState.Phone.numberError"
          >
            <template #prepend>
              <q-icon name="phone" />
            </template>
            <template #error>
              {{ store.formState.Phone.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.Data.Phone.面板号"
            filled
            label="面板号"
            hide-bottom-space
            lazy-rules="ondemand"
            :error="store.formState.Phone.panelError"
          >
            <template #prepend>
              <q-icon name="g_mobiledata" />
            </template>
            <template #error>
              {{ store.formState.Phone.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.Data.Phone.楼层线路"
            filled
            label="楼层线路"
            lazy-rules="ondemand"
            hide-bottom-space
            hide-hint
            :error="store.formState.Phone.colorError"
          >
            <template #prepend>
              <q-icon name="cable" />
            </template>
          </q-input>

          <q-select
            v-model="store.Data.Phone.颜色对"
            filled
            label="颜色对"
            hide-bottom-space
            hide-hint
            :options="store.colorPairOptions"
            :error="store.formState.Phone.colorError"
          >
            <template #prepend>
              <q-icon name="palette" />
            </template>
            <template #error>
              {{ store.formState.Phone.errorMsg }}
            </template>
          </q-select>

          <q-input
            v-model="store.Data.Phone.办公室"
            filled
            label="办公室"
            hide-bottom-space
            lazy-rules="ondemand"
            :error="store.formState.Phone.officeError"
          >
            <template #prepend>
              <q-icon name="meeting_room" />
            </template>
            <template #error>
              {{ store.formState.Phone.errorMsg }}
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

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["cancelcreate", "cancelupdate", "create", "update"]);
</script>