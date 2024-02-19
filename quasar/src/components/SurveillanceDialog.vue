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
          @click.stop="
            store.isCreate ? $emit('cancelcreate') : $emit('cancelupdate')
          "
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
              label="监控"
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

          <q-select
            v-model="store.Data.Surveillance.类型"
            filled
            label="类型"
            lazy-rules="ondemand"
            hide-bottom-space
            :options="store.surveillanceTypes"
            :error="store.formState.Surveillance.typeError"
          >
            <template #prepend>
              <q-icon name="turned_in" />
            </template>
            <template #error>
              {{ store.formState.Surveillance.errorMsg }}
            </template>
          </q-select>

          <q-input
            v-model="store.Data.Surveillance.IP"
            filled
            label="IP"
            hide-bottom-space
            :error="store.formState.Surveillance.IPError"
          >
            <template #prepend>
              <q-icon name="lan" />
            </template>
            <template #error>
              {{ store.formState.Surveillance.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.Data.Surveillance.用户名"
            filled
            label="用户名"
            lazy-rules="ondemand"
            hide-bottom-space
            :error="store.formState.Surveillance.userError"
          >
            <template #prepend>
              <q-icon name="account_circle" />
            </template>
            <template #error>
              {{ store.formState.Surveillance.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.Data.Surveillance.密码"
            filled
            label="密码"
            hide-bottom-space
            :error="store.formState.Surveillance.pwdError"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
            <template #error>
              {{ store.formState.Surveillance.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.Data.Surveillance.备注"
            type="textarea"
            autogrow
            filled
            label="备注"
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
              v-close-popup
              icon="block"
              color="grey"
              label="取 消"
              :class="store.isMobile ? 'col-12' : 'col-3'"
              @click.stop="
                store.isCreate ? $emit('cancelcreate') : $emit('cancelupdate')
              "
            />

            <q-btn
              color="primary"
              :icon="store.isCreate ? 'create' : 'update'"
              :class="store.isMobile ? 'col-12' : 'col-3'"
              :label="store.isCreate ? '增 加' : '编 辑'"
              :loading="store.btnLoading"
              @click="store.isCreate ? $emit('create') : $emit('update')"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useUserStore } from "../stores/store";
import UploadComponent from "./UploadComponent.vue";
import ImageComponent from "./ImageComponent.vue";
const store = useUserStore();

const emit = defineEmits(["cancelcreate", "cancelupdate", "create", "update"]);

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

/*
const filteredFunction = (val, update) => {
  if (val === '') {
    update(() => {
      store.filteredLists = store.checkLists
    })
  }

  update(() => {
    store.filteredLists = store.checkLists.filter(list => {
      return list.IP.includes(val);
    })
  })
}
*/
</script>
