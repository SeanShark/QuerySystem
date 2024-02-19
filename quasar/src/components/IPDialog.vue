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
              label="终端"
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
            v-model="store.Data.IP.姓名"
            filled
            label="姓名："
            lazy-rules="ondemand"
            hide-bottom-space
            :error="store.formState.IP.nameError"
          >
            <template #prepend>
              <q-icon name="person" />
            </template>
            <template #error>
              {{ store.formState.IP.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.Data.IP.IP"
            filled
            hide-bottom-space
            lazy-rules="ondemand"
            label="IP"
            :error="store.formState.IP.IPError"
          >
            <template #prepend>
              <q-icon name="lan" />
            </template>
            <template #error>
              {{ store.formState.IP.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.Data.IP.MAC"
            filled
            label="MAC"
            lazy-rules="ondemand"
            hide-bottom-space
            :error="store.formState.IP.MACError"
          >
            <template #prepend>
              <q-icon name="drive_file_rename_outline" />
            </template>
            <template #error>
              {{ store.formState.IP.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.Data.IP.办公室"
            filled
            label="办公室："
            hide-bottom-space
          >
            <template #prepend>
              <q-icon name="meeting_room" />
            </template>
          </q-input>
          <q-input
            v-model="store.Data.IP.备注"
            filled
            label="备注："
            hide-bottom-space
          >
            <template #prepend>
              <q-icon name="comment" />
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
