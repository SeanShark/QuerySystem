<template>
  <q-page class="column q-pa-sm">
    <div class="text-center row justify-center q-pa-md">
      <div class="text-center text-h5">信息查询</div>
      <q-icon
        name="info"
        size="sm"
        color="orange-10"
        @click="openHelpDialog = true"
      >
        <q-tooltip> 点击获得帮助 </q-tooltip>
      </q-icon>
    </div>
    <div class="row justify-end">
      <q-toggle v-model="visible" label="显示搜索框" class="q-mb-md" />
    </div>

    <q-slide-transition>
      <div v-show="visible">
        <div class="row">
          <div class="col-12 col-sm-6 col-md-3 q-pa-xs">
            <q-select
              ref="typeRef"
              v-model="store.searchData.type"
              label="类型"
              transition-show="jump-up"
              transition-hide="jump-up"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              outlined
              bottom-slots
              hide-bottom-space
              lazy-rules="ondemand"
              :error="searchItems.typeError"
              :options="store.types"
            >
              <template #prepend>
                <q-icon name="title" color="primary" @click.stop.prevent />
              </template>
              <template #error>
                {{ searchItems.errorMsg }}
              </template>
            </q-select>
          </div>

          <div class="col-12 col-sm-6 col-md-3 q-pa-xs">
            <q-select
              ref="customerRef"
              v-model="store.searchData.customer"
              label="地点"
              transition-show="jump-up"
              transition-hide="jump-up"
              outlined
              bottom-slots
              hide-bottom-space
              lazy-rules="ondemand"
              :error="searchItems.customerError"
              :options="customers"
            >
              <template #prepend>
                <q-icon name="place" color="accent" @click.stop.prevent />
              </template>
              <template #error>
                {{ searchItems.errorMsg }}
              </template>
            </q-select>
          </div>

          <div class="col-12 col-sm-6 col-md-3 q-pa-xs">
            <q-select
              ref="fieldRef"
              v-model="store.searchData.field"
              label="字段"
              transition-show="jump-up"
              transition-hide="jump-up"
              outlined
              bottom-slots
              hide-bottom-space
              lazy-rules="ondemand"
              :options="field"
              :disable="fieldState"
            >
              <template #prepend>
                <q-icon name="add_card" color="primary" @click.stop.prevent />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-sm-6 col-md-3 q-pa-xs">
            <q-input
              ref="keywordRef"
              v-model="store.searchData.keyword"
              outlined
              bottom-slots
              hide-bottom-space
              label="关键字"
              lazy-rules="ondemand"
              :error="keywordState.isEmpty"
              @keyup.enter="handleSearch"
            >
              <template #prepend>
                <q-icon name="key" @click.stop.prevent />
              </template>
              <template #error>
                {{ keywordState.errorMsg }}
              </template>
            </q-input>
          </div>
        </div>
        <div class="row justify-end q-pa-xs">
          <q-btn
            color="primary"
            label="提 交"
            class="glossy col-12 col-sm-3 q-mt-xs on-right"
            icon-right="send"
            :loading="searchLoading"
            @click="handleSearch"
          />
        </div>
      </div>
    </q-slide-transition>

    <div class="q-pa-xs">
      <q-page-sticky
        v-if="showSticky1 && store.showSticky2"
        position="bottom-right"
        :offset="fabPosition"
        class="z-top"
      >
        <q-tooltip anchor="center left" self="center right">
          按住可拖拽
        </q-tooltip>
        <q-fab
          v-touch-pan.prevent.mouse="moveFab"
          icon="keyboard_arrow_up"
          direction="up"
          color="accent"
          label="操作"
          glossy
          :hide-label="store.isMobile"
          :disable="draggingFab"
        >
          <q-fab-action
            label="增加"
            color="green"
            icon="add"
            :hide-label="store.isMobile"
            :disable="
              store.searchData.customer === '-请选择-' ||
              store.searchData.type === '-请选择-'
            "
            @click="openCreateDialog"
          />
          <q-fab-action
            label="编辑"
            :color="btnGroup ? 'grey' : 'primary'"
            icon="edit"
            :disable="btnGroup"
            :hide-label="store.isMobile"
            @click="openUpdateDialog"
          />
          <q-fab-action
            label="删除"
            :color="btnGroup ? 'grey' : 'red'"
            icon="delete"
            :disable="btnGroup"
            :hide-label="store.isMobile"
            @click="openDeleteDialog = true"
          />
          <q-fab-action
            label="导出"
            :color="downloadable ? 'secondary' : 'grey'"
            icon="download"
            :disable="!downloadable"
            :hide-label="store.isMobile"
            @click="exportTable"
          />
        </q-fab>
      </q-page-sticky>
      <q-scroll-area visible :style="{ height: scrollAreaHeight + 'px' }">
        <!-- Table -->
        <q-table
          v-if="showTable"
          ref="tableRef"
          v-model:selected="store.selected"
          :grid="store.isMobile"
          flat
          bordered
          :rows="store.tableRows"
          :columns="columns"
          :filter="searchFilter"
          row-key="_id"
          selection="single"
        >
          <template #top-left>
            搜索结果：共 {{ store.tableRows.length }} 条
          </template>

          <template #top-right>
            <q-input
              v-model="searchFilter"
              filled
              dense
              debounce="300"
              placeholder="过滤..."
            >
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template #body="props">
            <q-tr :props="props">
              <q-td>
                <q-checkbox v-model="props.selected" color="primary" />
              </q-td>
              <q-td v-for="col in props.cols.filter((col) => col.name !== 'desc')" :key="col.name" :props="props">
                <q-btn
                  v-if="col.name === '图像' && col.value === true"
                  round
                  flat
                  color="secondary"
                  icon="image"
                  @click="showImageDialog(store.searchData.type, props.key)"
                />
                <div v-if="col.name !== '图像'">
                  {{ col.value }}
                </div>
              </q-td>
            </q-tr>
          </template>

          <template #item="props">
            <div
              class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
              :style="props.selected ? 'transform: scale(0.98);' : ''"
            >
              <q-card
                bordered
                :flat="props.selected ? false : true"
                :class="
                  props.selected
                    ? store.$q.dark.isActive
                      ? 'bg-grey-9'
                      : 'bg-grey-2'
                    : ''
                "
              >
                <q-card-section>
                  <div class="row justify-between">
                    <q-checkbox v-model="props.selected" dense />
                  </div>
                </q-card-section>
                <q-separator />
                <q-list dense>
                  <q-item
                    v-for="col in props.cols.filter((col) => col.name !== 'desc')"
                    :key="col.name"
                    class="row"
                  >
                    <q-item-section>
                      <q-item-label>{{ col.label }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        v-if="col.label === '图像' && col.value === true"
                        round
                        flat
                        color="secondary"
                        icon="image"
                        @click="showImageDialog(store.searchData.type, props.key)"
                      />
                      <q-item-label v-if="col.label !== '图像'">{{ col.value }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </div>
          </template>

          <template #no-data="{ icon, errorfilter }">
            <div class="full-width row q-gutter-sm">
              <q-icon
                size="2em"
                :name="errorfilter ? 'filter_b_and_w' : icon"
                color="red"
              />
              <span> 没有搜索到有关记录 </span>
            </div>
          </template>
        </q-table>
      </q-scroll-area>
    </div>

    <ImageDialog v-model="store.openImageDialog" @close="colseImageDialog" />

    <IPDialog
      v-model="store.openDialog.IP"
      @update="onUpdateIP()"
      @create="onCreateIP"
      @cancelupdate="onCancelUpdate"
      @cancelcreate="onCancelCreate"
    />
    <PhoneDialog
      v-model="store.openDialog.Phone"
      @update="onUpdatePhone()"
      @create="onCreatePhone"
      @cancelupdate="onCancelUpdate"
      @cancelcreate="onCancelCreate"
    />
    <PrinterDialog
      v-model="store.openDialog.Printer"
      @update="onUpdatePrinter()"
      @create="onCreatePrinter"
      @cancelupdate="onCancelUpdate"
      @cancelcreate="onCancelCreate"
    />
    <DataCenterDialog
      v-model="store.openDialog.Datacenter"
      @update="onUpdateDatacenter()"
      @create="onCreateDatacenter"
      @cancelupdate="onCancelUpdate"
      @cancelcreate="onCancelCreate"
    />
    <SurveillanceDialog
      v-model="store.openDialog.Surveillance"
      @update="onUpdateSurveillance()"
      @create="onCreateSurveillance"
      @cancelupdate="onCancelUpdate"
      @cancelcreate="onCancelCreate"
    />
    <DeleteDialog
      v-model="openDeleteDialog"
      @delete="onDelete(store.searchData.type, store.originalData._id)"
    />
    <HelpDialog v-model="openHelpDialog" />
  </q-page>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted, provide } from "vue";
import { useRouter } from "vue-router";
import IPDialog from "src/components/IPDialog.vue";
import HelpDialog from "src/components/HelpDialog.vue";
import PhoneDialog from "src/components/PhoneDialog.vue";
import DeleteDialog from "src/components/DeleteDialog.vue";
import PrinterDialog from "src/components/PrinterDialog.vue";
import DataCenterDialog from "src/components/DataCenterDialog.vue";
import SurveillanceDialog from "src/components/SurveillanceDialog.vue";
import ImageDialog from "src/components/ImageDialog.vue";
import { exportFile } from "quasar";
import { useUserStore } from "../stores/store";

const store = useUserStore();
const router = useRouter();

onMounted(async () => {
  store.searchData.type = "-请选择-";

  await store
    .verifyUser()
    .then(() => {
      if (!store.user) {
        router.push("/index");
      }
    })
    .catch(() => {
      router.push("/index");
    });
});

const visible = ref(true);
const showTable = ref(false);
const scrollAreaHeight = ref(170);
const uploader = ref();
provide("uploader", uploader);

const openDeleteDialog = ref(false);
const openHelpDialog = ref(false);
const customerRef = ref(null);
const typeRef = ref(null);
const fieldRef = ref(null);
const fieldState = ref(true);
const keywordRef = ref(null);
const searchLoading = ref(false);

const tableRef = ref(null);
const btnGroup = ref(true);
const searchFilter = ref("");

const fabPosition = ref([20, 20]);
const draggingFab = ref(false);

const downloadable = ref(false);

const customers = ["禾花", "鹅公岭", "新南", "白坭坑", "慧明", "创点"];

const keywordState = reactive({
  isEmpty: false,
  errorMsg: "",
});
const searchItems = reactive({
  typeError: false,
  customerError: false,
  errorMsg: "",
});

const columns = ref([]);

const moveFab = (e) => {
  draggingFab.value = e.isFirst !== true && e.isFinal !== true;
  fabPosition.value = [
    fabPosition.value[0] - e.delta.x,
    fabPosition.value[1] - e.delta.y,
  ];
};

let field = [];

watch(
  () => store.searchData.type,
  (newValue, oldValue) => {
    store.selected = [];
    if (newValue === "-请选择-") {
      fieldState.value = true;
    } else {
      fieldState.value = false;
      if (newValue === "IP") {
        field = ["IP", "姓名", "MAC", "办公室", "备注"];
        store.searchData.field = "IP";
      } else if (newValue === "Printer") {
        field = ["打印机", "硒鼓", "办公室", "数量"];
        store.searchData.field = "打印机";
      } else if (newValue === "Phone") {
        field = ["号码", "面板号", "楼层线路", "办公室", "备注"];
        store.searchData.field = "号码";
      } else if (newValue === "Datacenter") {
        field = ["IP", "名称", "备注"];
        store.searchData.field = "IP";
      } else if (newValue === "Surveillance") {
        field = ["IP", "类型", "备注"];
        store.searchData.field = "IP";
      }
    }

    if (newValue !== oldValue) {
      store.tableRows = [];
    }
  }
);

watch(
  () => store.selected,
  (newValue) => {
    if (newValue.length !== 0) {
      store.originalData = JSON.parse(JSON.stringify(newValue[0]));
      btnGroup.value = false;
      if (store.originalData.号码) {
        store.originalData.号码 = parseInt(store.originalData.号码);
      }
    } else {
      store.originalData = null;
      btnGroup.value = true;
    }
  }
);

const showSticky1 = computed(() => {
  return (
    store.searchData.type !== "-请选择-" &&
    store.searchData.customer !== "-请选择-"
  );
});

const showImageDialog = (t, i) => {
  // console.log('showImageDialog',t, i);
  store.showSticky2 = false;
  store.forceUpdateImg(t, i);
  store.openImageDialog = true;
};

const colseImageDialog = () => {
  store.showSticky2 = true;
};

const handleSearch = async () => {
  keywordState.isEmpty = false;
  searchItems.typeError = false;
  searchItems.customerError = false;
  downloadable.value = false;
  store.selected = [];
  const keyword = store.searchData.keyword.trim();

  // if ((await typeRef.value?.validate()) && (await customerRef.value?.validate()))
  if (store.searchData.type === "-请选择-") {
    searchItems.typeError = true;
    searchItems.errorMsg = "请选择类型";
    return;
  }

  if (store.searchData.customer === "-请选择-") {
    searchItems.customerError = true;
    searchItems.errorMsg = "请选择地点";
    return;
  }

  if (!keyword) {
    keywordState.isEmpty = true;
    keywordState.errorMsg = "搜索关键字不能为空";
    return;
  }
  if (
    keyword.length === 1 &&
    store.searchData.field !== "姓名" &&
    store.searchData.field !== "数量"
  ) {
    keywordState.isEmpty = true;
    keywordState.errorMsg = "关键字太少";
    return;
  }
  // console.log(store.searchData.field, store.searchData.keyword);
  // return
  searchLoading.value = true;
  let type = "";
  if (store.searchData.type === "-请选择-") {
    return store.failureTip("请选择搜索类型。错误代码：50001");
  }
  columns.value = tableColumns[store.searchData.type];

  const queryData = {
    customer: store.searchData.customer,
    field: store.searchData.field,
    keyword: keyword,
  };
  await store.axios
    .post("/query", {
      data: queryData,
      type: store.searchData.type,
    })
    .then((res) => {
      if (res.status === 201) {
        showTable.value = true;
        store.tableRows = res.data;
        if (store.tableRows.length !== 0) {
          downloadable.value = true;
        }
      }
    })
    .catch((err) => {
      if (err.response.data.status === "keywordError") {
        keywordState.isEmpty = true;
        keywordState.errorMsg = err.response.data.msg;
      } else if (err.response.data.status === "typeError") {
        store.tableRows = [];
        searchItems.typeError = true;
        searchItems.errorMsg = err.response.data.msg;
        // store.failureTip(err.response.data.msg);
      } else if (err.response.data.status === "customerError") {
        store.tableRows = [];
        searchItems.customerError = true;
        searchItems.errorMsg = err.response.data.msg;
        // store.failureTip(err.response.data.msg);
      } else {
        store.tableRows = [];
        store.failureTip("网络超时，请重试");
      }
    })
    .finally(async () => {
      scrollAreaHeight.value = (await tableRef.value?.$el.clientHeight) + 10;
      searchLoading.value = false;
    });
};

const sortIPv4 = (a, b) => {
  const ipToNumber = (ip) =>
    ip
      .split(".")
      .reduce(
        (acc, octet, index) => acc + parseInt(octet) * 256 ** (3 - index),
        0
      );

  const numericA = ipToNumber(a);
  const numericB = ipToNumber(b);

  return numericA - numericB;
};

const openCreateDialog = () => {
  store.isCreate = true;
  store.showSticky2 = false;

  for (const prop in store.Data[store.searchData.type]) {
    if (store.Data[store.searchData.type].hasOwnProperty(prop)) {
      if (
        prop !== "customer" &&
        prop !== "颜色" &&
        prop !== "数量" &&
        prop !== "类型"
      ) {
        store.Data[store.searchData.type][prop] = "";
      }
    }
  }
  store.openDialog[store.searchData.type] = true;
};

const onCancelCreate = () => {
  store.showSticky2 = true;
  store.clearFormState();
  store.btnLoading = false;
};

const openUpdateDialog = () => {
  store.isCreate = false;
  store.showSticky2 = false;

  //Make a copy of the data into originalData, and copy data into store.Data.xxx
  for (const prop in store.originalData) {
    if (store.originalData.hasOwnProperty(prop)) {
      if (prop !== "customer") {
        store.Data[store.searchData.type][prop] = store.originalData[prop];
      }
    }
  }
  store.getImage();
  for (const prop in store.Data[store.searchData.type]) {
    if (store.Data[store.searchData.type].hasOwnProperty(prop)) {
      store.initialUpdateData[prop] = store.Data[store.searchData.type][prop]
    }
  }
  store.openDialog[store.searchData.type] = true;
};

const onCancelUpdate = () => {
  store.showSticky2 = true;
  store.clearFormState();
  store.originalData = JSON.parse(JSON.stringify(store.selected[0]));
  if (store.originalData.号码) {
    store.originalData.号码 = parseInt(store.originalData.号码);
  }
  store.openDialog[store.searchData.type] = false;
};

const synchronizeLocalData = async (res) => {
  if (store.isCreate) {
    columns.value = tableColumns[store.searchData.type];
    showTable.value = true;
    store.selected = [];
    if (store.searchData.type === "IP") {
      store.Data.IP.MAC = store.Data.IP.MAC.replace(/./g, (char) =>
        char.toUpperCase()
      );
    }
    if (store.searchData.type === "Printer") {
      store.Data.Printer.数量 = store.Data.Printer.数量
        ? parseInt(store.Data.Printer.数量)
        : 0;
    }
    store.Data[store.searchData.type]._id = res.data._id;
    store.Data[store.searchData.type].updatedAt = res.data.updatedAt;
    if (store.hasPic) {
      store.systemMsg = res.data.msg;
      await uploader.value.upload();
    } else {
      store.showSticky2 = true;
      store.openDialog[store.searchData.type] = false;
      store.tableRows.unshift(
        JSON.parse(JSON.stringify(store.Data[store.searchData.type]))
      );
      store.clearData();
      store.successTip(res.data.msg);
    }
  } else {
    store.Data[store.searchData.type].updatedAt = res.data.updatedAt;
    const targetIndex = store.tableRows.findIndex(
      (item) => item._id === store.originalData._id
    );
    if (targetIndex !== -1) {
      for (const prop in store.Data[store.searchData.type]) {
        if (store.Data[store.searchData.type].hasOwnProperty(prop)) {
          if (prop !== "customer" && prop !== "_id") {
            store.tableRows[targetIndex][prop] =
              store.Data[store.searchData.type][prop];
            store.originalData[prop] = store.Data[store.searchData.type][prop];
          }
        }
      }
    } else {
      store.failureTip("更新本地数据失败，请重新获取数据.");
    }
    if (store.hasPic) {
      store.systemMsg = res.data.msg;
      await uploader.value.upload();
    } else {
      store.openDialog[store.searchData.type] = false;
      store.showSticky2 = true;
      store.successTip(res.data.msg);
    }
  }
};

const submitData = computed(() => {
  return {
    data: store.Data[store.searchData.type],
    type: store.searchData.type,
  };
});

const onCreateIP = async () => {
  if (!store.ipFormValidate()) {
    return;
  }
  store.btnLoading = true;
  await store.axios
    .post("/query/newip", submitData.value)
    .then((res) => {
      synchronizeLocalData(res);
    })
    .catch((err) => {
      if (err.response.data.status === "ipError") {
        store.formState.IP.errorMsg = err.response.data.msg;
        store.formState.IP.IPError = true;
      } else if (err.response.data.status === "macError") {
        store.formState.IP.errorMsg = err.response.data.msg;
        store.formState.IP.MACError = true;
      } else {
        store.failureTip("网络超时，请重试");
      }
    })
    .finally(async () => {
      store.btnLoading = false;
      scrollAreaHeight.value = (await tableRef.value?.$el.clientHeight) + 10;
    });
};

const onCreatePrinter = async () => {
  if (!store.printerFormValidate()) {
    return;
  }

  store.btnLoading = true;
  store.Data.Printer.硒鼓 = store.Data.Printer.硒鼓.toUpperCase();

  await store.axios
    .post("/query/newprinter", submitData.value)
    .then((res) => {
      synchronizeLocalData(res);
    })
    .catch((err) => {
      if (err.response.data.msg) {
        store.failureTip(err.response.data.msg);
      } else {
        store.failureTip("网络超时，请重试");
      }
    })
    .finally(async () => {
      store.btnLoading = false;
      scrollAreaHeight.value = (await tableRef.value?.$el.clientHeight) + 10;
    });
};

const onCreatePhone = async () => {
  if (!store.phoneFormValidate()) {
    return;
  }
  store.Data.Phone.楼层线路 = store.Data.Phone.楼层线路.toUpperCase();
  store.btnLoading = true;
  await store.axios
    .post("/query/newphone", submitData.value)
    .then((res) => {
      synchronizeLocalData(res);
    })
    .catch((err) => {
      if (err.response.data.status === "numberError") {
        store.formState.Phone.errorMsg = err.response.data.msg;
        store.formState.Phone.numberError = true;
      } else if (err.response.data.status === "colorError") {
        store.formState.Phone.errorMsg = err.response.data.msg;
        store.formState.Phone.colorError = true;
      } else if (err.response.data.status === "panelError") {
        store.formState.Phone.errorMsg = err.response.data.msg;
        store.formState.Phone.panelError = true;
      } else {
        store.failureTip("网络超时，请重试");
      }
    })
    .finally(async () => {
      store.btnLoading = false;
      scrollAreaHeight.value = (await tableRef.value?.$el.clientHeight) + 10;
    });
};

const onCreateDatacenter = async () => {
  if (!store.datacenterFormValidate()) {
    return;
  }
  store.btnLoading = true;
  await store.axios
    .post("/query/newdatacenter", submitData.value)
    .then((res) => {
      synchronizeLocalData(res);
    })
    .catch((err) => {
      if (err.response.data.status === "ipError") {
        store.formState.Datacenter.errorMsg = err.response.data.msg;
        store.formState.Datacenter.IPError = true;
      } else {
        store.failureTip("网络超时，请重试");
      }
    })
    .finally(async () => {
      store.btnLoading = false;
      scrollAreaHeight.value = (await tableRef.value?.$el.clientHeight) + 10;
    });
};

const onCreateSurveillance = async () => {
  if (!store.surveillanceFormValidate()) {
    return;
  }
  store.btnLoading = true;

  await store.axios
    .post("/query/newsurveillance", submitData.value)
    .then(async (res) => {
      synchronizeLocalData(res);
    })
    .catch((err) => {
      if (err.response.data.status === "ipError") {
        store.formState.Surveillance.errorMsg = err.response.data.msg;
        store.formState.Surveillance.IPError = true;
      } else {
        store.failureTip("网络超时，请重试");
      }
    })
    .finally(async () => {
      store.btnLoading = false;
      scrollAreaHeight.value = (await tableRef.value?.$el.clientHeight) + 10;
    });
};

const onUpdateIP = async () => {
  if (!store.ipFormValidate()) {
    return;
  }

  if (store.dataChanged()) {
    store.clearFormState();
    store.btnLoading = true;
    await store.axios
      .put("/query/updateip", submitData.value)
      .then((res) => {
        synchronizeLocalData(res);
      })
      .catch((err) => {
        if (err.response.data.status === "ipError") {
          store.formState.IP.errorMsg = err.response.data.msg;
          store.formState.IP.IPError = true;
        } else if (err.response.data.status === "macError") {
          store.formState.IP.errorMsg = err.response.data.msg;
          store.formState.IP.MACError = true;
        } else {
          store.failureTip("网络超时，请重试");
        }
      })
      .finally(() => {
        store.btnLoading = false;
      });
  } else if (store.hasPic) {
    await uploader.value.upload();
  } else {
    onCancelUpdate();
  }
};

const onUpdatePrinter = async () => {
  if (!store.printerFormValidate()) {
    return;
  }
  if (store.dataChanged()) {
    store.Data.Printer.数量 = store.Data.Printer.数量
      ? store.Data.Printer.数量
      : 0;
    store.btnLoading = true;
    await store.axios
      .put("/query/updateprinter", submitData.value)
      .then((res) => {
        synchronizeLocalData(res);
      })
      .catch((err) => {
        if (err.response.data.status === "colorError") {
          store.formState.Printer.errorMsg = err.response.data.msg;
          store.formState.Printer.colorError = true;
        } else {
          store.failureTip("网络超时，请重试");
        }
      })
      .finally(() => {
        store.btnLoading = false;
      });
  } else if (store.hasPic) {
    await uploader.value.upload();
  } else {
    onCancelUpdate();
  }
};

const onUpdatePhone = async () => {
  if (!store.phoneFormValidate()) {
    return;
  }

  if (store.dataChanged()) {
    store.btnLoading = true;
    store.Data.Phone.楼层线路 = store.Data.Phone.楼层线路.toUpperCase();
    await store.axios
      .put("/query/updatephone", submitData.value)
      .then((res) => {
        synchronizeLocalData(res);
      })
      .catch((err) => {
        if (err.response.data.status === "numberError") {
          store.formState.Phone.errorMsg = err.response.data.msg;
          store.formState.Phone.numberError = true;
        } else if (err.response.data.status === "colorError") {
          store.formState.Phone.errorMsg = err.response.data.msg;
          store.formState.Phone.colorError = true;
        } else if (err.response.data.status === "panelError") {
          store.formState.Phone.errorMsg = err.response.data.msg;
          store.formState.Phone.panelError = true;
        } else {
          store.failureTip("网络超时，请重试");
        }
      })
      .finally(() => {
        store.btnLoading = false;
      });
  } else if (store.hasPic) {
    await uploader.value.upload();
  } else {
    onCancelUpdate();
  }
};

const onUpdateDatacenter = async () => {
  if (!store.datacenterFormValidate()) {
    return;
  }

  if (store.dataChanged()) {
    store.clearFormState();
    store.btnLoading = true;
    await store.axios
      .put("/query/updatedatacenter", submitData.value)
      .then((res) => {
        synchronizeLocalData(res);
      })
      .catch((err) => {
        if (err.response.data.status === "ipError") {
          store.formState.Datacenter.errorMsg = err.response.data.msg;
          store.formState.Datacenter.IPError = true;
        } else {
          store.failureTip("网络超时，请重试");
        }
      })
      .finally(() => {
        store.btnLoading = false;
      });
  } else if (store.hasPic) {
    await uploader.value.upload();
  } else {
    onCancelUpdate();
  }
};

const onUpdateSurveillance = async () => {
  if (!store.surveillanceFormValidate()) {
    return;
  }

  if (store.dataChanged()) {
    store.clearFormState();
    store.btnLoading = true;
    try {
      await store.axios
        .put("/query/updatesurveillance", submitData.value)
        .then((res) => {
          synchronizeLocalData(res);
        })
        .catch((err) => {
          if (err.response.data.status === "ipError") {
            store.formState.Surveillance.errorMsg = err.response.data.msg;
            store.formState.Surveillance.IPError = true;
          } else {
            store.failureTip("网络超时，请重试");
          }
        })
        .finally(() => {
          store.btnLoading = false;
        });
    } catch (error) {
      console.log(error.message);
    }
  } else if (store.hasPic) {
    await uploader.value.upload();
  } else {
    onCancelUpdate();
  }
};

const onDelete = async (type, id) => {
  if(!type && !id) {
    return store.failureTip('参数错误，请重试')
  }

  await store.axios
    .delete("/query/delete", {
      params: {
        type: type,
        id: id,
      },
    })
    .then((res) => {
      store.selected = [];
      openDeleteDialog.value = false;
      store.successTip(res.data.msg);
      store.tableRows = store.tableRows.filter((lists) => lists._id !== id);
    })
    .catch((err) => {
      store.failureTip("网络超时，请重试");
    });
};

const tableColumns = {
  IP: [
    {
      name: "姓名",
      require: true,
      label: "姓名",
      align: "left",
      field: (row) => row.姓名,
      sortable: false,
    },
    {
      name: "IP",
      require: true,
      align: "left",
      label: "IP",
      field: "IP",
      sortable: true,
      sort: (a, b) => sortIPv4(a, b),
    },
    {
      name: "MAC",
      require: true,
      align: "left",
      label: "MAC",
      field: "MAC",
      sortable: false,
    },
    {
      name: "办公室",
      align: "left",
      label: "办公室",
      field: "办公室",
      sortable: false,
    },
    {
      name: "图像",
      align: "left",
      label: "图像",
      field: (row) => row.hasPic,
      sortable: false,
    },
    {
      name: "备注",
      align: "left",
      label: "备注",
      field: "备注",
      sortable: false,
    },

    {
      name: "更新于",
      align: "left",
      label: "更新于",
      field: "updatedAt",
      sortable: false,
    },
  ],
  Printer: [
    {
      name: "品牌",
      require: true,
      label: "品牌",
      align: "left",
      field: (row) => row.品牌,
      sortable: false,
    },
    {
      name: "打印机",
      require: true,
      label: "打印机",
      align: "left",
      field: (row) => row.打印机,
      sortable: false,
    },
    {
      name: "硒鼓",
      require: true,
      align: "left",
      label: "硒鼓",
      field: (row) => row.硒鼓,
      sortable: false,
    },
    {
      name: "颜色",
      require: true,
      align: "left",
      label: "颜色",
      field: "颜色",
      sortable: false,
    },
    {
      name: "数量",
      align: "left",
      label: "数量",
      field: "数量",
      sortable: false,
    },
    {
      name: "办公室",
      align: "left",
      label: "办公室",
      field: "办公室",
      sortable: false,
    },
    {
      name: "图像",
      align: "left",
      label: "图像",
      field: (row) => row.hasPic,
      sortable: false,
    },
    {
      name: "更新于",
      align: "left",
      label: "更新于",
      field: "updatedAt",
      sortable: false,
    },
  ],
  Phone: [
    {
      name: "号码",
      require: true,
      label: "号码",
      align: "left",
      field: (row) => row.号码,
      sortable: false,
    },
    {
      name: "面板号",
      label: "面板号",
      align: "left",
      field: (row) => row.面板号,
      sortable: false,
    },
    {
      name: "楼层线路",
      align: "left",
      label: "楼层线路",
      field: (row) => row.楼层线路,
      sortable: false,
    },
    {
      name: "颜色对",
      align: "left",
      label: "颜色对",
      field: "颜色对",
      sortable: false,
    },
    {
      name: "办公室",
      align: "left",
      label: "办公室",
      field: "办公室",
      sortable: false,
    },
    {
      name: "图像",
      align: "left",
      label: "图像",
      field: (row) => row.hasPic,
      sortable: false,
    },
    {
      name: "更新于",
      align: "left",
      label: "更新于",
      field: "updatedAt",
      sortable: false,
    },
  ],
  Datacenter: [
    {
      name: "名称",
      require: true,
      label: "名称",
      align: "left",
      field: (row) => row.名称,
      sortable: false,
    },
    {
      name: "IP",
      require: true,
      align: "left",
      label: "IP",
      field: "IP",
      sortable: true,
      sort: (a, b) => sortIPv4(a, b),
    },
    {
      name: "用户名",
      require: true,
      align: "left",
      label: "用户名",
      field: "用户名",
      sortable: false,
    },
    {
      name: "密码",
      align: "left",
      label: "密码",
      field: "密码",
      sortable: false,
    },
    {
      name: "图像",
      align: "left",
      label: "图像",
      field: (row) => row.hasPic,
      sortable: false,
    },
    {
      name: "备注",
      align: "left",
      label: "备注",
      field: "备注",
      sortable: false,
    },
    {
      name: "更新于",
      align: "left",
      label: "更新于",
      field: "updatedAt",
      sortable: false,
    },
  ],
  Surveillance: [
    {
      name: "类型",
      require: true,
      label: "类型",
      align: "left",
      field: (row) => row.类型,
      sortable: false,
    },
    {
      name: "IP",
      require: true,
      align: "left",
      label: "IP",
      field: "IP",
      sortable: true,
      sort: (a, b) => sortIPv4(a, b),
    },
    {
      name: "用户名",
      require: true,
      align: "left",
      label: "用户名",
      field: "用户名",
      sortable: false,
    },
    {
      name: "密码",
      align: "left",
      label: "密码",
      field: "密码",
      sortable: false,
    },
    {
      name: "图像",
      align: "left",
      label: "图像",
      field: (row) => row.hasPic,
      sortable: false,
    },
    {
      name: "备注",
      align: "left",
      label: "备注",
      field: "备注",
      sortable: false,
    },
    {
      name: "更新于",
      align: "left",
      label: "更新于",
      field: "updatedAt",
      sortable: false,
    },
  ],
};

const wrapCsvValue = (val, formatFn, row) => {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')
  return `"${formatted}"`;
};

const exportTable = () => {
  // naive encoding to csv format
  const content = [columns.value.map((col) => wrapCsvValue(col.label))]
    .concat(
      store.tableRows.map((row) =>
        columns.value
          .map((col) =>
            wrapCsvValue(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(",")
      )
    )
    .join("\r\n");

  const status = exportFile(
    store.searchData.customer +
      "-" +
      store.searchData.type +
      "-" +
      store.searchData.keyword +
      ".csv",
    "\ufeff" + content,
    "text/csv"
  );

  if (status !== true) {
    store.$q.notify({
      message: "浏览器拒绝下载",
      color: "negative",
      icon: "warning",
    });
  }
};
</script>

<style lang="sass" scoped></style>
