<template>
  <q-uploader
    v-if="store.uploadLimit !== 0"
    ref="uploader"
    :factory="factoryFn"
    color="grey-5"
    label="上传图片"
    field-name="myImage"
    multiple
    with-credentials
    flat
    bordered
    batch
    style="width: 100%"
    accept=".jpg, .jpeg, .png"
    hide-upload-btn
    max-file-size="9900000"
    max-total-size="19900000"
    :max-files="store.uploadLimit"
    @removed="removeEvent"
    @added="addEvent"
    @rejected="onRejected"
    @finish="onFinish"
  />

</template>

<script setup>
import { useUserStore } from "../stores/store";
import { inject } from 'vue';
import { compressAccurately } from 'image-conversion';
const store = useUserStore();

const uploader = inject('uploader');

const getImageData = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);

      try {
        const imageData = context.getImageData(0, 0, img.width, img.height);
        resolve(imageData);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = URL.createObjectURL(file);
  });
};

const compressAndCheckImage = async (file) => {
  let compressedFile = await compressAccurately(file, {
    size: 1000,
    accuracy: 0.9,
    type: "image/*",
    scale: 0.5,
  });

  let compressedImageData = await getImageData(compressedFile);
  let retries = 3; // Set the number of retries

  while (await isImageBlack(compressedImageData) && retries > 0) {
    // Retry compression
    // console.log("Retrying compression...");
    compressedFile = await compressAccurately(file, {
      size: 1000,
      accuracy: 0.9,
      type: "image/*",
      scale: 0.5,
    });
    compressedImageData = await getImageData(compressedFile);
    retries--;
  }

  if (await isImageBlack(compressedImageData)) {
    // Compression failed after retries
    store.failureTip('图片压缩失败，请刷新页面并重新上传');
    return null; // Return null or handle failure as needed
  }

  return new File([compressedFile], file.name, { type: compressedFile.type });
};


const compressFile = async (file) => {
  // store.$q.loading.show();
  const result = await compressAndCheckImage(file);
  store.$q.loading.hide();
  return result;
};

//Verify if the image turns black

const isImageBlack = async (imageData, threshold = 10) => {
  for (let i = 0; i < imageData.data.length; i += 4) {
    const brightness = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
    if (brightness > threshold) {
      return false; // Image is not black
    }
  }
  return true; // Image is mostly black
};


/*
About Factory mode:
In factory mode, these events are disabled: failed, uploading, uploaded;
and props: 'url' and 'form-field' will be ignored.
*/
const factoryFn = (files) => {
  return new Promise(async (resolve, reject) => {
    //Define a formData manually.
    const formData = new FormData();
    if (!store.compress) {
      compressingSpinner();
    }
    for (let i = 0; i < files.length; i++) {
      if (!store.compress) {
        const compressedFile = await compressFile(files[i]);
        formData.append('myImage', compressedFile, compressedFile.name);
      } else {
        formData.append('myImage', files[i]);
      }
    }

    uploadSpinner()
    //Set form-field here
    const additionalFields = [
      { name: 'type', value: store.searchData.type },
      { name: 'id', value: store.Data[store.searchData.type]._id },
    ];
    
    additionalFields.forEach((field) => {
      formData.append(field.name, field.value);
    });
    //Submit the formData by axios
    try {
      const res = await store.axios.post('/upload/imgsarray', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      onUploaded(res);
      resolve();
    } catch (error) {
      if (store.isCreate) {
        store.tableRows.unshift(
            JSON.parse(JSON.stringify(store.Data[store.searchData.type]))
          );
      }
      store.failureTip('图片上传失败，请重新尝试');
      reject();
    }
  })
}

const mapErrors = {
  'accept': '只支持JPG,PNG类型的图片',
  'max-file-size': '单张图片超出10MB的限制',
  'max-total-size': '总数超出30MB的限制',
  'max-files': '图片最多显示五张'
}

const onRejected = (rejectEntries) => {
  // console.log(rejectEntries);
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

const compressingSpinner = () => {
  store.$q.loading.show({
    spinner: store.QSpinnerGears,
    spinnerColor: 'red',
    messageColor: 'black',
    message: '正在压缩图片，请稍后'
  })
}
  
const onUploaded = (res) => {
  const responseString = res.request.response;
  if (responseString) {
    try {
      const responseObject = JSON.parse(responseString);
      store.Data[store.searchData.type].picNames = responseObject.picNames;
      // console.log(store.Data[store.searchData.type].picNames);
      if(store.isCreate) {
        store.tableRows.unshift(JSON.parse(JSON.stringify(store.Data[store.searchData.type])));
      } else {
        const targetIndex = store.tableRows.findIndex((item) => item._id === store.originalData._id);
        store.tableRows[targetIndex].picNames = store.Data[store.searchData.type].picNames;
        store.originalData.picNames = store.Data[store.searchData.type].picNames;
      }
    } catch (error) {
      console.error('解析JSON文件错误:', error);
    }
  }
  
  store.successTip('数据更新成功');
}
/*
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
  store.failureTip('上传图片失败.');
}
*/
const onFinish = () => {
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