<template>
  <q-page class="column q-pa-sm">
    <div class="text-center row justify-center q-pa-md" >
      <div class="text-center text-h5">信息查询</div>
      <q-icon name="info" size="sm" color="orange-10" @click="openHelpDialog = true"> 
        <q-tooltip>
          点击获得帮助
        </q-tooltip>
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
              outlined
              bottom-slots
              hide-bottom-space
              lazy-rules="ondemand"
              :error="searchItems.typeError"
              :options="typeOptions"
            >
              <template #prepend>
                <q-icon
                  name="title"
                  color="primary"
                  @click.stop.prevent
                />
              </template>
              <template #error>
                {{ searchItems.errorMsg }}
              </template>
            </q-select>
          </div>

          <div class="col-12 col-sm-6 col-md-3 q-pa-xs">
            <q-select
              ref="placeRef"
              v-model="store.searchData.place"
              label="地点"
              transition-show="jump-up"
              transition-hide="jump-up"
              outlined
              bottom-slots
              hide-bottom-space
              lazy-rules="ondemand"
              :error="searchItems.placeError"
              :options="places"
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
        v-if="showSticky1 && showSticky2"
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
            :disable="store.searchData.place === '-请选择-' || store.searchData.type === '-请选择-'"
            @click="openAddDialog"
          />
          <q-fab-action 
            label="编辑"
            :color="btnGroup? 'grey' : 'primary'" 
            icon="edit"
            :disable="btnGroup"
            :hide-label="store.isMobile"
            @click="openEditDialog"
          />
          <q-fab-action 
            label="删除"
            :color="btnGroup? 'grey' : 'red'" 
            icon="delete" 
            :disable="btnGroup"
            :hide-label="store.isMobile"
            @click="openDeleteDialog = true"
          />
          <q-fab-action 
            label="导出"
            :color="downloadable? 'secondary' : 'grey'" 
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
          :rows="tableRows"
          :columns="columns"
          :filter="searchFilter"
          row-key="_id"
          selection="single"
        >
          <template #top-left>
            搜索结果：共 {{ tableRows.length }} 条
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


          <template #item="props">
            <div
              class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
              :style="props.selected ? 'transform: scale(0.98);' : ''"
            >
              <q-card
                bordered
                :flat="
                  props.selected
                    ? false : true
                "
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
                    <q-checkbox
                      v-model="props.selected"
                      dense
                    />
                  </div>
                </q-card-section>
                <q-separator />
                <q-list dense>
                  <q-item
                    v-for="col in props.cols.filter(
                      (col) => col.name !== 'desc'
                    )"
                    :key="col.name"
                    class="row"
                  >
                  <q-item-section class="col-3">
                      <q-item-label>{{ col.label }}</q-item-label>
                    </q-item-section>
                    <q-item-section class="col-9">
                      <q-scroll-area
                        v-if="col.label === '备注'"
                        class="wrap"
                        style="height: 50px"
                      >
                        <q-item-label>{{ col.value }}</q-item-label>
                      </q-scroll-area>
                      <div v-else>
                        <q-item-label>{{ col.value }}</q-item-label>
                      </div>
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

    <IPDialog 
      v-model="openIPDialog"
      @edit="onEditIP(store.originalData._id)"
      @add="onNewIP"
      @canceledit="onCancelEdit"
      @canceladd="onCancelAdd"
    />
    <PhoneDialog 
      v-model="openPhoneDialog"
      @edit="onUpdatePhone(store.originalData._id)"
      @add="onNewPhone"
      @canceledit="onCancelEdit"
      @canceladd="onCancelAdd"
    />
    <PrinterDialog 
      v-model="openPrinterDialog"
      @edit="onUpdatePrinter(store.originalData._id)"
      @add="onNewPrinter"
      @canceledit="onCancelEdit"
      @canceladd="onCancelAdd"
    />
    <DataCenterDialog 
      v-model="openDataCenterDialog"
      @edit="onUpdateDataCenter(store.originalData._id)"
      @add="onNewDataCenter"
      @canceledit="onCancelEdit"
      @canceladd="onCancelAdd"
    />
    <SurveillanceDialog 
      v-model="openSurveillanceDialog"
      @edit="onUpdateSurveillance(store.originalData._id)"
      @add="onNewSurveillance"
      @canceledit="onCancelEdit"
      @canceladd="onCancelAdd"
    />
    <DeleteDialog 
      v-model="openDeleteDialog"
      @delete="onDelete(store.searchData.type, store.originalData._id)"
    />
    <HelpDialog 
      v-model="openHelpDialog"
    />
  </q-page>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted} from "vue";
import { useRouter } from "vue-router";
import IPDialog from 'src/components/IPDialog.vue';
import HelpDialog from 'src/components/HelpDialog.vue';
import PhoneDialog from 'src/components/PhoneDialog.vue';
import DeleteDialog from 'src/components/DeleteDialog.vue';
import PrinterDialog from 'src/components/PrinterDialog.vue';
import DataCenterDialog from 'src/components/DataCenterDialog.vue';
import SurveillanceDialog from 'src/components/SurveillanceDialog.vue';
import { exportFile } from 'quasar';
import { useUserStore } from "../stores/store";

const store = useUserStore();
const router = useRouter();


onMounted(async () => {
  store.searchData.type = "-请选择-";

  await store.verifyUser()
    .then(() => {
      if(!store.user) {
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

const openIPDialog = ref(false);
const openPhoneDialog = ref(false);
const openPrinterDialog = ref(false);
const openDataCenterDialog = ref(false);
const openSurveillanceDialog = ref(false);
const openDeleteDialog = ref(false);
const openHelpDialog = ref(false);
const placeRef = ref(null);
const typeRef = ref(null);
const fieldRef = ref(null);
const fieldState = ref(true);
const keywordRef = ref(null);
const searchLoading = ref(false);

const tableRef = ref(null);
const btnGroup = ref(true);
const tableRows = ref([]);
const searchFilter = ref("");

const fabPosition = ref([20, 20]);
const draggingFab = ref(false)

const downloadable = ref(false)

const typeOptions = ["终端", "耗材", "电话", "机房", "监控"];
const places = ["禾花", "鹅公岭", "新南", "白坭坑", "慧明", "创点"];

const keywordState = reactive({
  isEmpty: false,
  errorMsg: ""
});
const searchItems = reactive({
  typeError: false,
  placeError: false,
  errorMsg: ""
})

const columns = ref([]);

const moveFab = (e) => {
  draggingFab.value = e.isFirst !== true && e.isFinal !== true
  fabPosition.value = [
    fabPosition.value[0] - e.delta.x,
    fabPosition.value[1] - e.delta.y
  ]
}

let field = [];

watch(
  () => store.searchData.type,
  (newValue, oldValue) => {
    store.selected = [];
    if (newValue === "-请选择-") {
      fieldState.value = true;
    }
    else {
      fieldState.value = false;
      if (newValue === "终端") {
        field = ["IP","姓名",  "MAC", "办公室", "备注"];
        store.searchData.field = "IP";
      } else if (newValue === "耗材") {
        field = ["打印机", "硒鼓", "办公室", "数量"];
        store.searchData.field = "打印机";
      } else if (newValue === "电话") {
        field = ["号码", "面板号", "楼层线路", "办公室", "备注"];
        store.searchData.field = "号码";
      } else if (newValue === "机房") {
        field = ["IP", "名称", "备注"];
        store.searchData.field = "IP";
      } else if (newValue === "监控") {
        field = ["IP", "类型", "备注"];
        store.searchData.field = "IP";
      }
    }

    if (newValue !== oldValue) {
      tableRows.value = []
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
    return store.searchData.type !== "-请选择-" && store.searchData.place !== "-请选择-"
})
const showSticky2 = ref(true);

const clearFormState = () => {
  if (store.searchData.type === "终端") {
    for (const prop in store.ipFormState) {
      if (store.ipFormState.hasOwnProperty(prop)) {
        if (prop !== 'errorMsg') {
          store.ipFormState[prop] = false;
        }
      }
    }
  } 
  else if (store.searchData.type === "耗材"){
    for (const prop in store.printerFormState) {
      if (store.printerFormState.hasOwnProperty(prop)) {
        if (prop !== 'errorMsg') {
          store.printerFormState[prop] = false;
        }
      }
    }
  }
  else if (store.searchData.type === "电话"){
    for (const prop in store.phoneFormState) {
      if (store.phoneFormState.hasOwnProperty(prop)) {
        if (prop !== 'errorMsg') {
          store.phoneFormState[prop] = false;
        }
      }
    }
  } else if (store.searchData.type === "机房"){
    for (const prop in store.datacenterFormState) {
      if (store.datacenterFormState.hasOwnProperty(prop)) {
        if (prop !== 'errorMsg') {
          store.datacenterFormState[prop] = false;
        }
      }
    }
  } else {
    for (const prop in store.surveillanceFormState) {
      if (store.surveillanceFormState.hasOwnProperty(prop)) {
        if (prop !== 'errorMsg') {
          store.surveillanceFormState[prop] = false;
        }
      }
    }
  }
}

const onCancelEdit = () => {
  showSticky2.value = true;
  clearFormState();
  store.originalData = JSON.parse(JSON.stringify(store.selected[0]));
  if (store.originalData.号码) {
    store.originalData.号码 = parseInt(store.originalData.号码);
  }
};

const onCancelAdd = () => {
  showSticky2.value = true;
  clearFormState();
  store.addBtnLoading = false;
};

const handleSearch = async () => {
  keywordState.isEmpty = false;
  searchItems.typeError = false;
  searchItems.placeError = false;
  downloadable.value = false;
  store.selected = [];
  const keyword = store.searchData.keyword.trim();

  // if ((await typeRef.value?.validate()) && (await placeRef.value?.validate())) 
  if(store.searchData.type === '-请选择-') {
    searchItems.typeError = true;
    searchItems.errorMsg = '请选择类型';
    return;
  }

  if(store.searchData.place === '-请选择-') {
    searchItems.placeError = true;
    searchItems.errorMsg = '请选择地点';
    return;
  }

  if (!keyword) {
    keywordState.isEmpty = true;
    keywordState.errorMsg = "搜索关键字不能为空";
    return;
  }
  if (keyword.length === 1 && store.searchData.field !== '姓名' && store.searchData.field !== '数量') {
    keywordState.isEmpty = true;
    keywordState.errorMsg = "关键字太少";
    return;
  }
  // console.log(store.searchData.field, store.searchData.keyword);
  // return
  searchLoading.value = true;
  let type = '';

  //need to set value and text
  if (store.searchData.type === "终端") {
    type = 'ip';
    columns.value = ipColumns;
  } else if (store.searchData.type === "耗材") {
    type = 'printer';
    columns.value = printerColumns;
  } else if (store.searchData.type === "电话") {
    type = 'phone';
    columns.value = phoneColumns;
  } 
  else if (store.searchData.type === "机房") {
    type = 'datacenter';
    columns.value = datacenterColumns;
  } 
  else if (store.searchData.type === "监控") {
    type = 'surveillance';
    columns.value = surveillanceColumns;
  } 
  else {
    searchLoading.value = false;
    store.failureTip('错误搜索类型1');
    return;
  }

  const queryData = {
    Place: store.searchData.place,
    field: store.searchData.field,
    keyword: keyword,
  };
  await store.axios.post("/query", { 
    data: queryData,
    type: type
   })
    .then((res) => {
      if (res.status === 201) {
        showTable.value = true;
        tableRows.value = res.data;
        if (tableRows.value.length !== 0) {
          downloadable.value = true;
        }
      }
    })
    .catch((err) => {
      if (err.response.data.status === "keywordError") {
        keywordState.isEmpty = true;
        keywordState.errorMsg = err.response.data.msg;
      }
      else if (err.response.data.status === "typeError") {
        tableRows.value = [];
        searchItems.typeError = true;
        searchItems.errorMsg = err.response.data.msg
        // store.failureTip(err.response.data.msg);
      }
      else if (err.response.data.status === "placeError") {
        tableRows.value = [];
        searchItems.placeError = true;
        searchItems.errorMsg = err.response.data.msg
        // store.failureTip(err.response.data.msg);
      }
      else {
        tableRows.value = [];
        store.failureTip(err.response.data.msg);
      }
    })
    .finally(async () => {
      scrollAreaHeight.value = await tableRef.value?.$el.clientHeight + 10;
      searchLoading.value = false;
    })
  
};

const isValidIPv4 = (ip) => {
  const ipv4Pattern =
    /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Pattern.test(ip);
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

const openAddDialog = () => {
  store.isAdd = true;
  showSticky2.value = false;
  if (store.searchData.type === "终端") {
    for (const prop in store.IPData) {
      if (store.IPData.hasOwnProperty(prop)) {
        if (prop !== 'Place') {
          store.IPData[prop] = "";
        }
      }
    }
    openIPDialog.value = true;
  }
  else if (store.searchData.type === "电话") {
    for (const prop in store.phoneData) {
      if (store.phoneData.hasOwnProperty(prop)) {
        if (prop !== 'Place') {
          store.phoneData[prop] = "";
        }
      }
    }
    openPhoneDialog.value = true;
  }
  else if (store.searchData.type === "耗材") {
    for (const prop in store.printerData) {
      if (store.printerData.hasOwnProperty(prop)) {
        if (prop !== 'Place' && prop !== '颜色' && prop !== '数量') {
          store.printerData[prop] = "";
        }
      }
    }
    openPrinterDialog.value = true;
  }
  else if (store.searchData.type === "机房") {
    for (const prop in store.datacenterData) {
      if (store.datacenterData.hasOwnProperty(prop)) {
        if (prop !== 'Place') {
          store.datacenterData[prop] = "";
        }
      }
    }
    openDataCenterDialog.value = true;
  } else if (store.searchData.type === "监控") {
    for (const prop in store.surveillanceData) {
      if (store.surveillanceData.hasOwnProperty(prop)) {
        if (prop !== 'Place' && prop !== '类型') {
          store.surveillanceData[prop] = "";
        }
      }
    }
    openSurveillanceDialog.value = true;
  } else {
    console.log('openAddDialog');
  }
}
const openEditDialog = () => {
  store.isAdd = false;
  showSticky2.value = false;
  if (store.searchData.type === "终端") {
    for (const prop in store.originalData) {
      if (store.originalData.hasOwnProperty(prop)) {
        if (prop !== 'Place') {
          store.IPData[prop] = store.originalData[prop];
        }
      }
    }
    openIPDialog.value = true;
  }
  else if (store.searchData.type === "电话") {
    for (const prop in store.originalData) {
      if (store.originalData.hasOwnProperty(prop)) {
        if (prop !== 'Place') {
          store.phoneData[prop] = store.originalData[prop];
        }
      }
    }
    openPhoneDialog.value = true;
  }
  else if (store.searchData.type === "耗材") {
    for (const prop in store.originalData) {
      if (store.originalData.hasOwnProperty(prop)) {
        if (prop !== 'Place') {
          store.printerData[prop] = store.originalData[prop];
        }
      }
    }
    openPrinterDialog.value = true;
  }
  else if (store.searchData.type === "机房") {
    for (const prop in store.originalData) {
      if (store.originalData.hasOwnProperty(prop)) {
        if (prop !== 'Place') {
          store.datacenterData[prop] = store.originalData[prop];
        }
      }
    }
    openDataCenterDialog.value = true;
  } 
  else if (store.searchData.type === "监控") {
    for (const prop in store.originalData) {
      if (store.originalData.hasOwnProperty(prop)) {
        if (prop !== 'Place') {
          store.surveillanceData[prop] = store.originalData[prop];
        }
      }
    }
    openSurveillanceDialog.value = true;
  } 
  else {
    console.log('openEditDialog');
  }
}

const ipFormValidate = () => {
  if (!store.IPData.姓名) {
    store.ipFormState.nameError = true;
    store.ipFormState.errorMsg = "使用人不能为空"
    return false;
  } else {
    store.ipFormState.nameError = false;
  }

  if (!isValidIPv4(store.IPData.IP)) {
    store.ipFormState.errorMsg = "请输入合法IPv4地址";
    store.ipFormState.IPError = true;
    return false;
  } else {
    store.ipFormState.IPError = false;
  }

  if (store.IPData.MAC.length === 0) {
    store.ipFormState.MACError = true;
    store.ipFormState.errorMsg = "该区域不能为空"
    return false;
  } else {
    store.ipFormState.MACError = false;
  }

  clearFormState();
  return true
  
}

const onNewIP = async () => {
  if(!ipFormValidate()) {
    return;
  }
  store.addBtnLoading = true;
  const IPData = {
    data: store.IPData,
    type: 'ip'
  };
  await store.axios
    .post("/query/newip", IPData)
    .then((res) => {
      columns.value = ipColumns;
      showTable.value = true; 
      openIPDialog.value = false;
      showSticky2.value = true;
      store.IPData.MAC = store.IPData.MAC.replace(/./g, (char) => char.toUpperCase());
      store.IPData._id = res.data._id;
      store.IPData.updatedAt = res.data.updatedAt;
      tableRows.value.unshift(JSON.parse(JSON.stringify(store.IPData)));
      store.selected = [];
      for (const prop in store.IPData) {
        if (store.IPData.hasOwnProperty(prop)) {
          if (prop !== 'Place') {
            store.IPData[prop] = "";
          }
        }
      }
      store.successTip(res.data.msg);
    })
    .catch((err) => {
      if (err.response.data.status === "ipError") {
        store.ipFormState.errorMsg = err.response.data.msg;
        store.ipFormState.IPError = true;
      } else if (err.response.data.status === "macError") {
        store.ipFormState.errorMsg = err.response.data.msg;
        store.ipFormState.MACError = true;
      } else {
        store.failureTip(err.response.data.msg);
      }
    })
    .finally(async () => {
      store.addBtnLoading = false;
      scrollAreaHeight.value = await tableRef.value?.$el.clientHeight + 10;
    });
  
};


const printerFormValidate = () => {
  if (!store.printerData.品牌) {
    store.printerFormState.errorMsg = "请输入品牌";
    store.printerFormState.brandError = true;
    return false;
  } else {
    store.printerFormState.brandError = false;
  }
  if (!store.printerData.打印机) {
    store.printerFormState.errorMsg = "请输入打印机型号";
    store.printerFormState.typeError = true;
    return false;
  } else {
    store.printerFormState.typeError = false;
  }
  if (!store.printerData.硒鼓) {
    store.printerFormState.errorMsg = "请输入硒鼓型号";
    store.printerFormState.cartridgeError = true;
    return false;
  } else {
    store.printerFormState.cartridgeError = false;
  }
  if (!store.printerData.颜色) {
    store.printerFormState.errorMsg = "请输入颜色";
    store.printerFormState.colorError = true;
    return false;
  } else {
    store.printerFormState.colorError = false;
  }
  if (store.printerData.数量.length === 0) {
    store.printerFormState.errorMsg = "请输入数量";
    store.printerFormState.amountError = true;
    return false;
  } else {
    store.printerFormState.amountError = false;
  }
  if (typeof(store.printerData.数量) !== 'number') {
    store.printerFormState.errorMsg = "请输入数量";
    store.printerFormState.amountError = true;
    return false;
  } else {
    store.printerFormState.colorError = false;
  }
  if (!store.printerData.办公室) {
    store.printerFormState.errorMsg = "请输入所在办公室";
    store.printerFormState.officeError = true;
    return false;
  } else {
    store.printerFormState.officeError = false;
  }
  //clearFormState();
  return true;
}


const onNewPrinter = async () => {
  if (!printerFormValidate()) {
    return;
  }

  store.addBtnLoading = true;
  store.printerData.硒鼓 = store.printerData.硒鼓.toUpperCase();

  const printerData = {
    data: store.printerData,
    type: 'printer'
  };
  await store.axios
    .post("/query/newprinter", printerData)
    .then((res) => {
      columns.value = printerColumns;
      showTable.value = true;
      openPrinterDialog.value = false;
      showSticky2.value = true;
      store.printerData._id = res.data._id;
      store.printerData.数量 = store.printerData.数量? parseInt(store.printerData.数量) : 0;
      store.printerData.updatedAt = res.data.updatedAt;
      tableRows.value.unshift(JSON.parse(JSON.stringify(store.printerData)));
      store.selected = [];
      for (const prop in store.printerData) {
        if (store.printerData.hasOwnProperty(prop)) {
          if (prop !== 'Place' && prop !== '颜色' && prop !== '数量') {
            store.printerData[prop] = "";
          }
        }
      }
      store.successTip(res.data.msg);
    })
    .catch((err) => {
      store.failureTip(err.response.data.msg);
    })
    .finally( async () => {
      store.addBtnLoading = false;
      scrollAreaHeight.value = await tableRef.value?.$el.clientHeight + 10;
    });
  
};

const phoneFormValidate = () => {
  const number = store.phoneData.号码;

  if (typeof number !== "number") {
    store.phoneFormState.errorMsg = "请输入数字";
    store.phoneFormState.numberError = true;
    return false;
  } else {
    store.phoneFormState.numberError = false;
  }

  if (number < 10000000 || number > 100000000) {
    store.phoneFormState.errorMsg = "请输入8位号码";
    store.phoneFormState.numberError = true;
    return false;
  } else {
    store.phoneFormState.numberError = false;
  }

  if (store.phoneData.面板号.length === 0) {
    store.phoneFormState.errorMsg = "面板号不能为空";
    store.phoneFormState.panelError = true;
    return false;
  } else {
    store.phoneFormState.panelError = false;
  }

  if (!store.phoneData.办公室) {
    store.phoneFormState.errorMsg = "办公室不能为空";
    store.phoneFormState.officeError = true;
    return false;
  } else {
    store.phoneFormState.officeError = false;
  }
  clearFormState();
  return true;
}


const onNewPhone = async () => {
  if(!phoneFormValidate()) {
    return;
  }
  store.phoneData.楼层线路 = store.phoneData.楼层线路.toUpperCase();
  store.addBtnLoading = true;
  const phoneData = {
    data: store.phoneData,
    type: 'phone'
  };
  await store.axios
    .post("/query/newphone", phoneData)
    .then((res) => {
      columns.value = phoneColumns;
      showTable.value = true;
      openPhoneDialog.value = false;
      showSticky2.value = true;
      store.phoneData._id = res.data._id;
      store.phoneData.updatedAt = res.data.updatedAt;
      tableRows.value.unshift(JSON.parse(JSON.stringify(store.phoneData)));
      store.selected = [];
      for (const prop in store.phoneData) {
        if (store.phoneData.hasOwnProperty(prop)) {
          if (prop !== 'Place') {
            store.phoneData[prop] = "";
          }
        }
      }
      store.successTip(res.data.msg);
    })
    .catch((err) => {
      if (err.response.data.status === "numberError") {
        store.phoneFormState.errorMsg = err.response.data.msg;
        store.phoneFormState.numberError = true;
      } else if (err.response.data.status === "colorError") {
        store.phoneFormState.errorMsg = err.response.data.msg;
        store.phoneFormState.colorError = true;
      } else if (err.response.data.status === "panelError") {
        store.phoneFormState.errorMsg = err.response.data.msg;
        store.phoneFormState.panelError = true;
      } else {
        store.failureTip(err.response.data.msg);
      }
    })
    .finally(async () => {
      store.addBtnLoading = false;
      scrollAreaHeight.value = await tableRef.value?.$el.clientHeight + 10;
    });
};

const datacenterFormValidate = () => {
  if (!store.datacenterData.名称) {
    store.datacenterFormState.errorMsg = "请输入名称";
    store.datacenterFormState.nameError = true;
    return false;
  } else {
    store.datacenterFormState.nameError = false;
  }
  if (!isValidIPv4(store.datacenterData.IP)) {
    store.datacenterFormState.errorMsg = "请输入合法IPv4地址";
    store.datacenterFormState.IPError = true;
    return false;
  } else {
    store.datacenterFormState.IPError = false;
  }
  if (!store.datacenterData.用户名) {
    store.datacenterFormState.errorMsg = "请输入用户名";
    store.datacenterFormState.userError = true;
    return false;
  } else {
    store.datacenterFormState.userError = false;
  }

  clearFormState();
  return true;
}

const onNewDataCenter = async () => {
  if(!datacenterFormValidate()) {
    return;
  }
  store.addBtnLoading = true;
  const datacenterData = {
    data: store.datacenterData,
    type: 'datacenter'
  };
  await store.axios
    .post("/query/newdatacenter", datacenterData)
    .then((res) => {
      columns.value = datacenterColumns;
      showTable.value = true; 
      openDataCenterDialog.value = false;
      showSticky2.value = true;
      store.datacenterData._id = res.data._id;
      store.datacenterData.updatedAt = res.data.updatedAt;
      tableRows.value.unshift(JSON.parse(JSON.stringify(store.datacenterData)));
      store.selected = [];
      for (const prop in store.datacenterData) {
        if (store.datacenterData.hasOwnProperty(prop)) {
          if (prop !== 'Place') {
            store.datacenterData[prop] = "";
          }
        }
      }
      store.successTip(res.data.msg);
    })
    .catch((err) => {
      if (err.response.data.status === "ipError") {
        store.datacenterFormState.errorMsg = err.response.data.msg;
        store.datacenterFormState.IPError = true;
      } else {
        store.failureTip(err.response.data.msg);
      }
    })
    .finally(async () => {
      store.addBtnLoading = false;
      scrollAreaHeight.value = await tableRef.value?.$el.clientHeight + 10;
    });

};

const surveillanceFormValidate = () => {
  if (!store.surveillanceData.类型) {
    store.surveillanceFormState.errorMsg = "请输入名称";
    store.surveillanceFormState.typeError = true;
    return false;
  } else {
    store.surveillanceFormState.typeError = false;
  }
  if (!isValidIPv4(store.surveillanceData.IP)) {
    store.surveillanceFormState.errorMsg = "请输入合法IPv4地址";
    store.surveillanceFormState.IPError = true;
    return false;
  } else {
    store.surveillanceFormState.IPError = false;
  }
  if (!store.surveillanceData.用户名) {
    store.surveillanceFormState.errorMsg = "请输入用户名";
    store.surveillanceFormState.userError = true;
    return false;
  } else {
    store.surveillanceFormState.userError = false;
  }
  if (!store.surveillanceData.密码) {
    store.surveillanceFormState.errorMsg = "请输入用户名";
    store.surveillanceFormState.pwdError = true;
    return false;
  } else {
    store.surveillanceFormState.pwdError = false;
  }

  clearFormState();
  return true;
}

const onNewSurveillance = async () => {
  if(!surveillanceFormValidate()) {
    return;
  }

  store.addBtnLoading = true;
  const surveillanceData = {
    data: store.surveillanceData,
    type: 'surveillance'
  };
  await store.axios
    .post("/query/newsurveillance", surveillanceData)
    .then((res) => {
      columns.value = surveillanceColumns;
      showTable.value = true; 
      openSurveillanceDialog.value = false;
      showSticky2.value = true;
      store.surveillanceData._id = res.data._id;
      store.surveillanceData.updatedAt = res.data.updatedAt;
      tableRows.value.unshift(JSON.parse(JSON.stringify(store.surveillanceData)));
      store.selected = [];
      for (const prop in store.surveillanceData) {
        if (store.surveillanceData.hasOwnProperty(prop)) {
          if (prop !== 'Place' && prop !== '类型') {
            store.surveillanceData[prop] = "";
          }
        }
      }
      store.successTip(res.data.msg);
    })
    .catch((err) => {
      if (err.response.data.status === "ipError") {
        store.surveillanceFormState.errorMsg = err.response.data.msg;
        store.surveillanceFormState.IPError = true;
      } else {
        store.failureTip(err.response.data.msg);
      }
    })
    .finally(async () => {
      store.addBtnLoading = false;
      scrollAreaHeight.value = await tableRef.value?.$el.clientHeight + 10;
    });
};


const onEditIP = async (id) => {
  if(!ipFormValidate()){
    return;
  }

  clearFormState();
  store.editBtnLoading = true;
  const IPData = {
    data: store.IPData,
    type: 'ip'
  };
  await store.axios
    .put("/query/updateip", IPData)
    .then((res) => {
      const date = res.data.updatedAt;
      store.IPData.updatedAt = date;
      const targetIndex = tableRows.value.findIndex(
        (item) => item._id === id
      );
      if (targetIndex !== -1) {
        for (const prop in store.IPData) {
          if (store.IPData.hasOwnProperty(prop)) {
            if (prop !== 'Place' && prop !== '_id') {
              tableRows.value[targetIndex][prop] = store.IPData[prop];
              store.originalData[prop] = store.IPData[prop];
            }
          }
        }
      } else {
        console.log("Element with _id", id, "not found.");
      }
      openIPDialog.value = false;
      showSticky2.value = true;
      store.successTip(res.data.msg);
    })
    .catch((err) => {
      if (err.response.data.status === "ipError") {
        store.ipFormState.errorMsg = err.response.data.msg;
        store.ipFormState.IPError = true;
      } else if (err.response.data.status === "macError") {
        store.ipFormState.errorMsg = err.response.data.msg;
        store.ipFormState.MACError = true;
      } else {
        store.failureTip(err.response.data.msg);
      }
    })
    .finally(() => {
      store.editBtnLoading = false;
    });

};

const onUpdatePrinter = async (id) => {
  if (!printerFormValidate()) {
    return;
  }
  store.printerData.数量 = store.printerData.数量? store.printerData.数量 : 0;
  store.editBtnLoading = true;
  const printerData = {
    data: store.printerData,
    type: 'printer'
  };
  await store.axios
    .put("/query/updateprinter", printerData)
    .then((res) => {
      store.printerData.updatedAt = res.data.updatedAt;
      const targetIndex = tableRows.value.findIndex(
        (item) => item._id === id
      );
      if (targetIndex !== -1) {
        for (const prop in store.printerData) {
          if (store.printerData.hasOwnProperty(prop)) {
            if (prop !== 'Place' && prop !== '_id') {
              tableRows.value[targetIndex][prop] = store.printerData[prop];
              store.originalData[prop] = store.printerData[prop];
            }
          }
        }
      } else {
        console.log("Element with _id", id, "not found.");
      }
      openPrinterDialog.value = false;
      showSticky2.value = true;
      store.successTip(res.data.msg);
    })
    .catch((err) => {
      if (err.response.data.status === "colorError") {
        store.printerFormState.errorMsg = err.response.data.msg;
        store.printerFormState.colorError = true;
      } else {
        store.failureTip(err.response.data.msg);
      }
    })
    .finally(() => {
      store.editBtnLoading = false;
    });
  
};



const onUpdatePhone = async (id) => {
  if(!phoneFormValidate()) {
    return;
  }
  store.editBtnLoading = true;
  store.phoneData.楼层线路 = store.phoneData.楼层线路.toUpperCase();
  const phoneData = {
    data: store.phoneData,
    type: 'phone'
  };
  await store.axios
    .put("/query/updatephone", phoneData)
    .then((res) => {
      store.phoneData.updatedAt = res.data.updatedAt;
      const targetIndex = tableRows.value.findIndex(
        (item) => item._id === id
      );
      if (targetIndex !== -1) {
        for (const prop in store.phoneData) {
          if (store.phoneData.hasOwnProperty(prop)) {
            if (prop !== 'Place' && prop !== '_id') {
              tableRows.value[targetIndex][prop] = store.phoneData[prop];
              store.originalData[prop] = store.phoneData[prop];
            }
          }
        }
      } else {
        console.log("Element with _id", id, "not found.");
      }
      openPhoneDialog.value = false;
      showSticky2.value = true;
      store.successTip(res.data.msg);
    })
    .catch((err) => {
      if (err.response.data.status === "numberError") {
        store.phoneFormState.errorMsg = err.response.data.msg;
        store.phoneFormState.numberError = true;
      } else if (err.response.data.status === "colorError") {
        store.phoneFormState.errorMsg = err.response.data.msg;
        store.phoneFormState.colorError = true;
      } else if (err.response.data.status === "panelError") {
        store.phoneFormState.errorMsg = err.response.data.msg;
        store.phoneFormState.panelError = true;
      } else {
        store.failureTip(err.response.data.msg);
      }
    })
    .finally(() => {
      store.editBtnLoading = false;
    });
  
};

const onUpdateDataCenter = async (id) => {
  if(!datacenterFormValidate()) {
    return;
  }

  clearFormState();
  store.addBtnLoading = true;
  const datacenterData = {
    data: store.datacenterData,
    type: 'datacenter'
  };
  await store.axios
    .put("/query/updatedatacenter", datacenterData)
    .then((res) => {
      store.datacenterData.updatedAt =res.data.updatedAt;

      const targetIndex = tableRows.value.findIndex(
        (item) => item._id === id
      );
      if (targetIndex !== -1) {
        for (const prop in store.datacenterData) {
          if (store.datacenterData.hasOwnProperty(prop)) {
            if (prop !== 'Place' && prop !== '_id') {
              tableRows.value[targetIndex][prop] = store.datacenterData[prop];
              store.originalData[prop] = store.datacenterData[prop];
            }
          }
        }
      } else {
        console.log("Element with _id", id, "not found.");
      }
      store.editBtnLoading = false;
      openDataCenterDialog.value = false;
      showSticky2.value = true;
      store.successTip(res.data.msg);
    })
    .catch((err) => {
      if (err.response.data.status === "ipError") {
        store.datacenterFormState.errorMsg = err.response.data.msg;
        store.datacenterFormState.IPError = true;
      } else {
        store.failureTip(err.response.data.msg);
      }
    })
    .finally(() => {
      store.addBtnLoading = false;
    });

};

const onUpdateSurveillance = async (id) => {
  if(!surveillanceFormValidate()) {
    return;
  }

  clearFormState();
  store.addBtnLoading = true;
  const surveillanceData = {
    data: store.surveillanceData,
    type: 'surveillance'
  };
  await store.axios
    .put("/query/updatesurveillance", surveillanceData)
    .then((res) => {
      store.surveillanceData.updatedAt = res.data.updatedAt;

      const targetIndex = tableRows.value.findIndex(
        (item) => item._id === id
      );
      if (targetIndex !== -1) {
        for (const prop in store.surveillanceData) {
          if (store.surveillanceData.hasOwnProperty(prop)) {
            if (prop !== 'Place' && prop !== '_id') {
              tableRows.value[targetIndex][prop] = store.surveillanceData[prop];
              store.originalData[prop] = store.surveillanceData[prop];
            }
          }
        }
      } else {
        console.log("Element with _id", id, "not found.");
      }
      store.editBtnLoading = false;
      openSurveillanceDialog.value = false;
      showSticky2.value = true;
      store.successTip(res.data.msg);
    })
    .catch((err) => {
      if (err.response.data.status === "ipError") {
        store.surveillanceFormState.errorMsg = err.response.data.msg;
        store.surveillanceFormState.IPError = true;
      } else {
        store.failureTip(err.response.data.msg);
      }
    })
    .finally(() => {
      store.addBtnLoading = false;
    });

};

const onDelete = async (type, id) => {
  await store.axios.delete("/query/delete", {
    params: { 
      type: type,
      id: id,
    },
  })
  .then((res) => {
    store.selected = [];
    openDeleteDialog.value = false;
    store.successTip(res.data.msg);
    tableRows.value = tableRows.value.filter((lists) => lists._id !== id);
  })
  .catch((err) => {
    store.failureTip(err.response.data.msg);
  })
};

const ipColumns = [
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
];

const printerColumns = [
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
    name: "更新于",
    align: "left",
    label: "更新于",
    field: "updatedAt",
    sortable: false,
  },
];

const phoneColumns = [
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
    name: "更新于",
    align: "left",
    label: "更新于",
    field: "updatedAt",
    sortable: false,
  },
];

const datacenterColumns = [
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
];
const surveillanceColumns = [
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
];

const wrapCsvValue  = (val, formatFn, row) => {
  let formatted = formatFn !== void 0
    ? formatFn(val, row)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')
  return `"${formatted}"`
}

const exportTable = () => {
  // naive encoding to csv format
  const content = [columns.value.map(col => wrapCsvValue(col.label))].concat(
    tableRows.value.map(row => columns.value.map(col => wrapCsvValue(
      typeof col.field === 'function'
        ? col.field(row)
        : row[ col.field === void 0 ? col.name : col.field ],
      col.format,
      row
    )).join(','))
  ).join('\r\n')

  const status = exportFile(
    store.searchData.place + '-' + store.searchData.type + '-' + store.searchData.keyword + '.csv',
    "\ufeff" + content,
    'text/csv'
  )

  if (status !== true) {
    store.$q.notify({
      message: '浏览器拒绝下载',
      color: 'negative',
      icon: 'warning'
    })
  }
}
     

</script>

<style lang="sass" scoped>
</style>
