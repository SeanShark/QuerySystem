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
            v-model.number="store.phoneData.号码"
            filled
            label="号码"
            hint="号码为8位数"
            lazy-rules="ondemand"
            hide-hint
            hide-bottom-space
            :error="store.phoneFormState.numberError"
          >
            <template #prepend>
              <q-icon name="phone" />
            </template>
            <template #error>
              {{ store.phoneFormState.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.phoneData.面板号"
            filled
            label="面板号"
            hide-bottom-space
            lazy-rules="ondemand"
            :error="store.phoneFormState.panelError"
          >
            <template #prepend>
              <q-icon name="g_mobiledata" />
            </template>
            <template #error>
              {{ store.phoneFormState.errorMsg }}
            </template>
          </q-input>

          <q-input
            v-model="store.phoneData.楼层线路"
            filled
            label="楼层线路"
            lazy-rules="ondemand"
            hide-bottom-space
            hide-hint
            :error="store.phoneFormState.colorError"
          >
            <template #prepend>
              <q-icon name="cable" />
            </template>
          </q-input>

          <q-select
            v-model="store.phoneData.颜色对"
            filled
            label="颜色对"
            hide-bottom-space
            hide-hint
            :options="store.colorPairOptions"
            :error="store.phoneFormState.colorError"
          >
            <template #prepend>
              <q-icon name="palette" />
            </template>
            <template #error>
              {{ store.phoneFormState.errorMsg }}
            </template>
          </q-select>

          <q-input
            v-model="store.phoneData.办公室"
            filled
            label="办公室"
            hide-bottom-space
            lazy-rules="ondemand"
            :error="store.phoneFormState.officeError"
          >
            <template #prepend>
              <q-icon name="meeting_room" />
            </template>
            <template #error>
              {{ store.phoneFormState.errorMsg }}
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
</script>