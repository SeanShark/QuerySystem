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
          @click.stop="$emit('cancel')"
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
              :label="mapTypeLable[store.searchData.type]"
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

          <div
            v-for="(name, index) in fieldName[store.searchData.type]"
            :key="index"
          >
            <q-input
              v-if="name !=='颜色' && name !== '颜色对' && name !== '类型' && name !== '数量'"
              v-model="store.Data[store.searchData.type][name]"
              filled
              hide-bottom-space
              lazy-rules="ondemand"
              :label="name"
              :error="store.formState[store.searchData.type][mapErrorType[name]]"
            >
              <template #prepend>
                <q-icon :name="mapIcon[name]" />
              </template>
              <template #error>
                {{ store.formState[store.searchData.type].errorMsg }}
              </template>
            </q-input>

            <q-input
              v-else-if="name === '数量'"
              v-model.number="store.Data[store.searchData.type][name]"
              type="number"
              filled
              hide-bottom-space
              lazy-rules="ondemand"
              :label="name"
              :error="store.formState[store.searchData.type][mapErrorType[name]]"
            >
              <template  #before>
                <q-btn icon="add" round color="green" @click="addOne" />
              </template>
              <template  #after>
                <q-btn icon="remove" round color="red" @click="subtractOne" />
              </template>
              <template #prepend>
                <q-icon :name="mapIcon[name]" />
              </template>
              <template #error>
                {{ store.formState[store.searchData.type].errorMsg }}
              </template>
            </q-input>

            <q-select 
              v-else
              v-model="store.Data[store.searchData.type][name]"
              filled
              hide-bottom-space
              lazy-rules="ondemand"
              :label="name"
              :options="store[name]"
              :error="store.formState[store.searchData.type][mapErrorType[name]]"
            >
              <template #prepend>
                <q-icon :name="mapIcon[name]" />
              </template>
              <template #error>
                {{ store.formState[store.searchData.type].errorMsg }}
              </template>
            </q-select>
          </div>
          <div v-if="store.uploadLimit !== 0">
            <UploadComponent />
          </div>
          <div class="row">
            <q-space />
            <q-toggle
              v-if="store.uploadLimit !== 0"
              v-model="store.compress"
              color="green"
              label="发送原图"
              left-label
              keep-color
            />
          </div>

          <div v-if="store.Data[store.searchData.type].picNames.length > 0">
            <ImageComponent :picnames="store.Data[store.searchData.type].picNames"/>
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
              icon="block"
              color="grey"
              label="取 消"
              :class="store.isMobile ? 'col-12' : 'col-3'"
              @click.stop="$emit('cancel')"
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
import UploadComponent from "../components/UploadComponent.vue";
import ImageComponent from "../components/ImageComponent.vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["create", "update","cancel"]);

const addOne = () => {
  store.Data.Printer.数量++;
};
const subtractOne = () => {
  if (store.Data.Printer.数量 > 0) {
    store.Data.Printer.数量--;
  }
};

const mapIcon = {
  IP: "lan",
  MAC: "drive_file_rename_outline",
  姓名: "person",
  办公室: "meeting_room",
  备注: "comment",
  号码: "phone",
  面板号: "g_mobiledata",
  楼层线路: "cable",
  颜色对: "palette",
  品牌: "turned_in",
  打印机型号: "print",
  硒鼓型号: "recycling",
  颜色: "palette",
  数量: "iso",
  名称: "turned_in",
  用户名: "account_circle",
  密码: "lock",
  类型: "turned_in",
}

const mapTypeLable = {
  IP: '终端',
  Phone: '电话',
  Printer: '打印机',
  Datacenter: '机房',
  Surveillance: '监控',
}

const fieldName = {
  IP: ['姓名','IP','MAC','办公室','备注'],
  Printer: ['品牌','打印机型号','硒鼓型号','颜色','数量','办公室'],
  Phone: ['号码','面板号','楼层线路','颜色对','办公室'],
  Datacenter: ['名称','IP','用户名','密码','备注',],
  Surveillance: ['类型','IP','用户名','密码','备注']
}

const mapErrorType = {
  姓名: 'nameError',
  IP: 'ipError',
  MAC: 'macError',
  号码: 'numberError',
  面板号: 'panelError',
  楼层线路: 'colorError',
  颜色对: 'colorError',
  办公室: 'officeError',
  品牌: 'brandError',
  打印机型号: 'typeError',
  硒鼓型号: 'cartridgeError',
  颜色: 'colorError',
  数量: 'amountError',
  名称: 'nameError',
  用户名: 'userError',
  类型: 'typeError',
  密码: 'pwdError',
}
</script>
