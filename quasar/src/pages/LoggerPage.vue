<template>
  <q-page class="q-pa-xs column">
    <div class="row q-pa-xs">
      <div class="col-12">
        <div class="column items-center">
          <q-date
            v-model="selectedDate"
            class="item-center"
            :landscape="store.$q.screen.gt.md"
            :events="events"
            years-in-month-view
            :color="themeColor"
            :event-color="eventColor"
            today-btn
            style="width: 100%; max-width: 550px"
          >
            <div class="row justify-end">
              <q-btn label="设置" flat @click="settingDialog = true"/> 
              <q-btn icon="refresh" color="green" flat @click="getLoggerList"> 
                <q-tooltip>
                  刷新
                </q-tooltip>
              </q-btn>
            </div>
          </q-date>
        </div>
      </div>
      <div class="col-12">
        <q-input
          v-model="loggerData.logger"
          outlined
          type="textarea"
          autogrow
          class="q-py-md"
          placeholder="记录点事情吧..."
          @focus="inputLight = true"
          @blur="inputLight = false"
        >
          <template #prepend>
            <q-icon
              :name="inputLight ? 'tips_and_updates' : 'lightbulb'"
              :color="inputLight ? 'orange' : 'grey'"
            />
          </template>
          <template #append>
            <q-btn
              round
              dense
              flat
              icon="send"
              :color="inputLight ? 'primary' : 'grey'"
              :disable="sendBtnOff"
              @click="newLogger"
            />
          </template>
        </q-input>
        <div v-if="!isLogged" class="no-tasks text-center" style="height: 100%">
          <q-icon name="psychology_alt" size="150px" color="primary" />
        </div>
        <q-tab-panels
          v-model="selectedDate"
          animated
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel
            v-for="(list, index) in loggerLists"
            :key="list._id"
            :item="list"
            :index="index"
            :name="list.date"
            class="q-pa-none"
          >
            <form
              autocorrect="off"
              autocapitalize="off"
              autocomplete="off"
              spellcheck="false"
            >
              <div class="row justify-end q-pa-md q-gutter-x-sm">
                <div class="text-h5">{{ list.date }}</div>
                <q-space />
                <q-btn
                  v-if="visibleBtn"
                  label="修 改"
                  class="q-px-md"
                  color="primary"
                  :disable="sendBtnOff"
                  @click="updateLogger(list._id, list.logger, list.date, index)"
                >

                </q-btn>
                <q-btn
                  v-if="visibleBtn"
                  label="取 消"
                  class="q-px-md"
                  color="grey"
                  @click="onCancel(index)"
                ></q-btn>
              </div>

              <q-editor
                v-model="list.logger"
                :dense="$q.screen.lt.md"
                :readonly="readonlyEditor"
                :definitions="{
                  editable: {
                    tip: '开启编辑',
                    icon: 'edit',
                    lable: 'edit',
                    color: 'red',
                    handler: editable
                  }
                }"
                :toolbar="[
                  ['fullscreen'],
                  
                  [
                    {
                      label: '功能',
                      size: 'lg',
                      icon: 'filter_2',
                      fixedLabel: true,
                      list: 'only-icons',
                      options: [
                        'left',
                        'center',
                        'right',
                        'justify',
                        'bold',
                        'italic',
                        'strike',
                        'quote',
                        'underline',
                        'unordered',
                        'ordered',
                        'outdent',
                        'indent',
                        'print',
                        'hr',
                        'link',
                        'undo',
                        'redo',
                      ],
                    },
                  ],
                  [
                    {
                      label: '字体大小',
                      icon: $q.iconSet.editor.fontSize,
                      fixedLabel: true,
                      size: 'md',
                      fixedIcon: true,
                      list: 'no-icons',
                      options: [
                        'size-1',
                        'size-2',
                        'size-3',
                        'size-4',
                        'size-5',
                        'size-6',
                        'size-7',
                      ],
                    },
                    'removeFormat',
                  ],
                  ['viewsource'],
                  ['editable'],
                ]"
                :fonts="{
                  arial: 'Arial',
                  arial_black: 'Arial Black',
                  comic_sans: 'Comic Sans MS',
                  courier_new: 'Courier New',
                  impact: 'Impact',
                  lucida_grande: 'Lucida Grande',
                  times_new_roman: 'Times New Roman',
                  verdana: 'Verdana',
                }"
                @input="onEditorInput(index)"
              >
                <!-- <template #edit> -->
                
              </q-editor>
            </form>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <q-dialog v-model="settingDialog" persistent>
      <q-card style="min-width: 400px; min-height: 350px">
        <q-card-section>
          <div class="text-h6 text-center">设 置</div>
        </q-card-section>
        <q-card-section>
          <div class="q-gutter-sm q-pa-sm">
            <q-select
              v-model="monthRange"
              outlined
              dense
              :options="monthOption"
              transition-show="jump-up"
              transition-hide="jump-up"
              hint="0代表全部"
              hide-hint
              hide-bottom-space
            >
              <template #before>
                <div class="text-subtitle2">事件范围：</div>
              </template>
              <template #prepend>
                <div class="text-subtitle2">最近：</div>
              </template>
              <template #append>
                <div class="text-subtitle2">月</div>
              </template>
            </q-select>
            <q-select
              ref="themeColoRef"
              v-model="themeColor"
              outlined
              dense
              :options="colorOptions"
              hide-bottom-space
              emit-value
              map-options
              option-label="label"
              option-value="value"
              transition-show="jump-up"
              transition-hide="jump-up"
              :rules="[(val) => !!val || '请选择颜色']"
            >
              <template #before>
                <div class="text-subtitle2">日历颜色：</div>
              </template>
              <template #prepend>
                <div class="text-subtitle2"></div>
              </template>
              <template #append>
                <div class="text-subtitle2"></div>
              </template>
            </q-select>
            <q-select
              ref="eventColoRef"
              v-model="eventColor"
              outlined
              dense
              hide-bottom-space
              emit-value
              map-options
              :options="colorOptions"
              option-label="label"
              option-value="value"
              transition-show="jump-up"
              transition-hide="jump-up"
              :rules="[(val) => !!val || '请选择颜色']"
            >
              <template #before>
                <div class="text-subtitle2">事件颜色：</div>
              </template>
              <template #prepend>
                <div class="text-subtitle2"></div>
              </template>
              <template #append>
                <div class="text-subtitle2"></div>
              </template>
            </q-select>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-gutter-xs justify-end q-pa-sm">
            <q-btn
              outline
              label="提 交"
              color="primary"
              @click="calenderSetting"
            />
            <q-btn v-close-popup outline label="取 消" color="grey" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import { useUserStore } from "../stores/store";
import { useRouter } from "vue-router";

const store = useUserStore();
const router = useRouter();

const inputLight = ref(false);
const sendBtnOff = ref(false);
const selectedDate = ref(store.todayDate);
const loggerLists = ref([]);
const events = ref([]);
const themeColor = ref("");
const eventColor = ref("");
const monthRange = ref();
const visibleBtn = ref(false);
const readonlyEditor = ref(true);
const isLogged = ref(false);
const initialLoggerContent = ref([]);
const monthOption = [1, 3, 6, 0];
const themeColoRef = ref(null);
const eventColoRef = ref(null);
const settingDialog = ref(false);
const colorOptions = [
  { label: "蓝色", value: "primary" },
  { label: "橙色", value: "orange" },
  { label: "绿色", value: "green" },
  { label: "青色", value: "teal" },
  { label: "棕色", value: "brown" },
  { label: "紫色", value: "purple" },
];
const loggerData = reactive({
  _id: "",
  date: "",
  user: "",
  logger: "",
});

watch(
  () => selectedDate.value,
  (newValue) => {
    for (const date of events.value) {
      if (newValue === date) {
        isLogged.value = true;
        break;
      } else {
        isLogged.value = false;
      }
    }
  }
);

const calenderSetting = async () => {
  if (
    (await themeColoRef.value?.validate()) &&
    (await eventColoRef.value?.validate())
  ) {
    const loggerSettings = {
      monthRange: monthRange.value,
      themeColor: themeColor.value,
      eventColor: eventColor.value,
    };
    await store.axios
      .post("/user/loggersetting", loggerSettings)
      .then((res) => {
        getLoggerList();
        store.successTip(res.data.msg);
        settingDialog.value = false;
      })
      .catch((err) => {
        store.failureTip(err.response.data.msg);
      });
  }
};

const getLoggerList = async () => {
  await store.axios
    .post("/logger/logger", {
      month: monthRange.value,
      user: store.user.userInfo.email,
    })
    .then((res) => {
      loggerLists.value = res.data;
      initialLoggerContent.value = loggerLists.value.map((list) => list.logger);
      events.value = loggerLists.value.map((item) => item.date);
    })
    .catch((err) => {
      store.failureTip(err.response.data.msg);
    });
};

const editable = () => {
  readonlyEditor.value = !readonlyEditor.value
}

const onEditorInput = (index) => {
  const currentLoggerContent = loggerLists.value[index].logger;
  const initialContent = initialLoggerContent.value[index];
  if (currentLoggerContent !== initialContent) {
    visibleBtn.value = true;
  } else {
    visibleBtn.value = false;
  }
};

const onCancel = (index) => {
  loggerLists.value[index].logger = initialLoggerContent.value[index];
  visibleBtn.value = false;
};

const newLogger = async () => {
  if (!selectedDate.value) {
    store.failureTip('请选择日期');
    return;
  }
  if (loggerData.logger.length > 0) {
    loggerData.date = selectedDate.value;
    loggerData.user = store.user.userInfo.email;
    sendBtnOff.value = true;
    try {
      const res = await store.axios.post("/logger/newlogger", loggerData);
      
      loggerData._id = res.data.id;
      if (res.data.logger) {
        loggerData.logger =
          res.data.logger + "<ul><li>" + loggerData.logger + "</li></ul>";
      } else {
        loggerData.logger = "<ul><li>" + loggerData.logger + "</li></ul>";
      }
      loggerLists.value.unshift(JSON.parse(JSON.stringify(loggerData)));
      initialLoggerContent.value = loggerLists.value.map(
        (list) => list.logger
      );
      events.value = loggerLists.value.map((item) => item.date);
      store.successTip(res.data.msg);
      isLogged.value = true;
      sendBtnOff.value = false;
      loggerData.logger = "";
        
    } catch (error) {
      if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
        // console.log('forceUpdateImg2', err);
        this.failureTip('网络不佳，请重试')
      } else {
        store.failureTip('服务器回应错误');
      }
    }
  }
};

const updateLogger = async (id, log, date, index) => {
  if (log === "<br><ul><li>" || log === "<div><br></div>" || log.length === 0) {
    confirmDel(id, index);
  } else {
    sendBtnOff.value = true;
    loggerData._id = id;
    loggerData.date = date;
    loggerData.logger = log;
    await store.axios
      .post("/logger/updateLogger", loggerData)
      .then((res) => {
        loggerLists.value[index].logger = log;
        initialLoggerContent.value = loggerLists.value.map(
          (list) => list.logger
        );
        store.successTip(res.data.msg);
      })
      .catch((err) => {
        store.failureTip(err.response.data.msg);
      })
      .finally(() => {
        loggerData.date = "";
        loggerData.logger = "";
        loggerData._id = "";
        visibleBtn.value = false;
        readonlyEditor.value = true;
        sendBtnOff.value = false;
      });
  }
};

const confirmDel = (id, index) => {
  store.$q
    .dialog({
      title: "确定",
      message: `确定要删除记录?`,
      cancel: true,
      persistent: true,
      ok: {
        push: true,
        label: "确定",
        color: "green",
      },
      cancel: {
        push: true,
        color: "blue-grey",
        label: "取消",
      },
    })
    .onOk(async () => {
      await store.axios
        .delete("/logger/deletelogger", { params: { id: id }, })
        .then((res) => {
          loggerLists.value.splice(index, 1);
          initialLoggerContent.value = loggerLists.value.map(
            (list) => list.logger
          );
          events.value = loggerLists.value.map((item) => item.date);
          store.successTip(res.data.msg);
          visibleBtn.value = false;
          isLogged.value = false;
        })
        .catch((err) => {
          if (err.response.data.msg) {
            store.failureTip(err.response.data.msg);
          } else {
            store.failureTip('网络错误，获取日志失败')
          }
        });
    })
    .onCancel(() => {});
};

onMounted(async () => {
  await store.verifyUser()
  .then(async () => {
    if (store.user) {
      await store.axios
      .post("/user/alluser")
      .then(async (res) => {
        monthRange.value = store.user.loggerSetting.monthRange;
        themeColor.value = store.user.loggerSetting.themeColor;
        eventColor.value = store.user.loggerSetting.eventColor;
        await getLoggerList();
        isLogged.value = true;
      })
      .catch((err) => {
        if(err.response.data) {
          store.failureTip(err.response.data.msg)
        } else {
          store.failureTip('获取数据超时')
        }
      });
    }
  })
  .catch(() => {
    router.push("/index");
  })
});
</script>

<style lang="scss">
.no-tasks {
  opacity: 0.3;
}
</style>

