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

          <q-select
            v-model="store.surveillanceData.类型"
            filled
            label="类型"
            lazy-rules="ondemand"
            hide-bottom-space
            :options="store.surveillanceTypes"
            :error="store.surveillanceFormState.typeError"
          >
            <template #prepend>
              <q-icon name="turned_in" />
            </template>
            <template #error>
              {{ store.surveillanceFormState.errorMsg }}
            </template>
          </q-select>

          <q-input
            v-model="store.surveillanceData.IP"
            filled
            label="IP"
            hide-bottom-space
            :error="store.surveillanceFormState.IPError"
          >
            <template #prepend>
              <q-icon name="lan" />
            </template>
            <template #error>
              {{ store.surveillanceFormState.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.surveillanceData.用户名"
            filled
            label="用户名"
            lazy-rules="ondemand"
            hide-bottom-space
            :error="store.surveillanceFormState.userError"
          >
            <template #prepend>
              <q-icon name="account_circle" />
            </template>
            <template #error>
              {{ store.surveillanceFormState.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.surveillanceData.密码"
            filled
            label="密码"
            hide-bottom-space
            :error="store.surveillanceFormState.pwdError"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
            <template #error>
              {{ store.surveillanceFormState.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.surveillanceData.备注"
            type="textarea"
            autogrow
            filled
            label="备注"
          >
            <template #prepend>
              <q-icon name="comment" />
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

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["canceladd", "canceledit", "add", "edit"]);

// const filteredFunction = (val, update) => {
//   if (val === '') {
//     update(() => {
//       store.filteredLists = store.checkLists
//     })
//   }

//   update(() => {
//     store.filteredLists = store.checkLists.filter(list => {
//       return list.IP.includes(val);
//     })
//   })
// }
</script>
