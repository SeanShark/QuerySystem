<template>
  <q-uploader
    ref="uploader"
    :url="getUrl"
    color="grey-5"
    label="上传图片"
    field-name="myImage"
    with-credentials
    flat
    bordered
    style="width: 100%"
    accept=".jpg, .jpeg, .png"
    hide-upload-btn
    max-file-size="9900000"
    :form-fields="() => [
      { name: 'type', value: store.searchData.type },
      { name: 'id', value: store.Data[store.searchData.type]._id },
    ]"
    @removed="removeEvent"
    @added="addEvent"
    @uploaded="onUploaded"
    @rejected="onRejected"
    @failed="onFailed"
    @uploading="uploadSpinner"
    @finish="onFinish"
  />
</template>

<script setup>
import { useUserStore } from "../stores/store";
import { inject } from 'vue';
const store = useUserStore();

const uploader = inject('uploader')

const getUrl = () => {
  return store.axios.defaults.baseURL + '/upload/imgs';
}

const mapErrors = {
  'accept': '只支持JPG,PNG类型的图片',
  'max-file-size': '照片超出10MB限制',
}

const onRejected = (rejectEntries) => {
  rejectEntries.forEach(entry => {
    store.failureTip(mapErrors[entry.failedPropValidation]);
  });
}

const removeEvent = () => {
  store.hasPic = false;
}
const addEvent = () => {
  store.hasPic = true;
}

const uploadSpinner = () => {
  store.$q.loading.show({
    message: '正在上传图片，请稍后...'
  });
}

const onUploaded = () => {
  store.Data[store.searchData.type].hasPic = true;
  if(store.isCreate) {
    store.tableRows.unshift(JSON.parse(JSON.stringify(store.Data[store.searchData.type])));
  } else {
    const targetIndex = store.tableRows.findIndex((item) => item._id === store.originalData._id);
    store.tableRows[targetIndex].hasPic = true;
    store.originalData.hasPic = true;
  }
}

const onFailed = (e) => {
  const responseString = e.xhr.response;
  if (responseString) {
    try {
      const responseObject = JSON.parse(responseString);
      store.failureTip(responseObject.message + ', 请在编辑模式上传图片');

    } catch (error) {
      console.error('解析JSON文件错误:', error);
    }
  }
}

const onFinish = () => {
  store.successTip('数据更新成功');
  store.showSticky2 = true;
  store.$q.loading.hide();
  store.hasPic = false;
  store.clearData();
  store.btnLoading = false;
  store.openDialog[store.searchData.type] = false;
}



</script>

<style>
</style>