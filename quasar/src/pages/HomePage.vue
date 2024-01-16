<template>
  <q-page>
    <p class="text-h6 text-center q-pa-md">任务To-Do</p>
    <div class="column q-pa-xs q-ma-none">
      <q-input
        ref="inputRef"
        v-model="todoData.todo"
        bg-color="white"
        class="col q-pa-none"
        bottom-slots
        hide-bottom-space
        :rules="[(val) => !!val || '请输入内容']"
        outlined
        placeholder="请输入您的内容"
        lazy-rules="ondemand"
        autocomplete="off"
        @keyup.enter="createTodo"
      >
        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #append>
          <q-btn round dense flat icon="send" @click.stop="createTodo" > 
            <q-tooltip >
            发送
            </q-tooltip>
          </q-btn>
        </template>
      </q-input>
      <div class="col q-pa-xs">
        <div class="q-gutter-sm row justify-center">
          <q-radio
            v-for="(color, index) in colorPanel"
            :key="index"
            v-model="todoData.color"
            :item="color"
            :index="index"
            keep-color
            :val="color.value"
            :color="color.color"
          >
            <q-tooltip :class="'bg-'+ color.color">
             {{ color.label}}
            </q-tooltip>
          </q-radio>
        </div>
      </div>
    </div>
    <div class="q-gutter-y-md q-pa-none">
      
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey q-pa-none"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="todo" label="任务" />
          <q-tab name="done" label="已完成" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel  class="q-pa-none" name="todo" style="min-height: 150px">
            <q-list separator bordered>
              <q-item
                v-for="(list, index) in store.doingLists"
                :key="list._id"
                v-ripple
                :item="list"
                :index="index"
                clickable
                
              >
                <q-item-section avatar>
                  <q-checkbox
                    v-model="list.isDone"
                    name="isDone"
                    color="primary"
                    @click.stop="handleClick('isDone', list._id, list.isDone)"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <div :class="list.color" class="text-body2">
                      {{ list.todo }}
                    </div>
                    <div class="text-italic">
                      {{ list.createdAt }}
                    </div>
                  </q-item-label>
                </q-item-section>

                <q-btn-dropdown
                  color="primary"
                  padding="none"
                  flat
                  size="sm"
                  dropdown-icon="change_history"
                  @click.stop
                >
                  <q-list>
                    <q-item v-close-popup clickable @click="editTask(list)">
                      <q-item-section avatar>
                        <q-icon name="edit_note" color="primary" size="sm" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>编辑</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-item
                      v-close-popup
                      clickable
                      @click="confirmDel(list._id)"
                    >
                      <q-item-section avatar>
                        <q-icon name="delete" color="red" size="sm" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>删除</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-item v-close-popup clickable @click="colorDialog(list)">
                      <q-item-section avatar>
                        <q-icon name="color_lens" color="teal" size="sm" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>颜色</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </q-item>
            </q-list>
            <div
              v-if="!store.doingLists.length"
              class="no-tasks absolute-center"
            >
              <q-icon name="check" size="50px" color="primary" />
              <div class="text-h5 text-primary text-center">无任务</div>
            </div>
          </q-tab-panel>

          <q-tab-panel class="q-pa-none" name="done" style="min-height: 150px">
            <q-list separator bordered>
              <q-item
                v-for="(list, index) in store.doneLists"
                :key="list._id"
                v-ripple
                :item="list"
                :index="index"
                clickable
                
              >
                <q-item-section avatar>
                  <q-checkbox
                    v-model="list.isDone"
                    color="primary"
                    @click.stop="handleClick('isDone', list._id, list.isDone)"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <div :class="list.color">{{ list.todo }}</div>
                  </q-item-label>
                  <div class="text-italic">
                      {{ list.createdAt }}
                    </div>
                </q-item-section>

                <q-btn-dropdown
                  color="primary"
                  padding="none"
                  flat
                  size="sm"
                  dropdown-icon="change_history"
                  @click.stop
                >
                  <q-list>
                    <q-item v-close-popup clickable @click="editTask(list)">
                      <q-item-section avatar>
                        <q-icon name="edit_note" color="primary" size="sm" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>编辑</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-item
                      v-close-popup
                      clickable
                      @click="confirmDel(list._id)"
                    >
                      <q-item-section avatar>
                        <q-icon name="delete" color="red" size="sm" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>删除</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-item v-close-popup clickable @click="colorDialog(list)">
                      <q-item-section avatar>
                        <q-icon name="color_lens" color="teal" size="sm" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>颜色</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </q-item>
            </q-list>
            <div
              v-if="!store.doneLists.length"
              class="no-tasks absolute-center"
            >
              <q-icon name="check" size="50px" color="primary" />
              <div class="text-h5 text-primary text-center">无任务</div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>


  </q-page>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { useUserStore } from "../stores/store";
import { useRouter } from "vue-router";
import { date } from "quasar";

const router = useRouter();
const store = useUserStore();

const inputRef = ref(null);

onMounted(async () => {
  let token = localStorage.getItem("token");

  if (token !== null) {
    try {
      await store.verifyUser()
      .then(() => {
        if(store.user) {
          store.getTodolists();
        }
        else {
          router.push("/index");
        }
      }).catch(() => {
        router.push("/index");
      })
    } catch (err) {
      router.push("/index");
    }
  } else {
    router.push("/index");
  }
});


const tab = ref("todo");
const todoData = reactive({
  owner: "",
  todo: "",
  color: "text-black",
  createdAt: "",
});

const createTodo = async () => {
  if (await inputRef.value?.validate()) {
    todoData.owner = store.user.email;
    todoData.createdAt = date.formatDate(Date.now(), "YYYY-MM-DD-HH:mm:ss");
    store
      .createTodo(todoData)
      .then(() => {
        todoData.todo = "";
        todoData.color = "text-black";
        store.successTip(store.systemMsg);
      })
      .catch(() => {
        store.failureTip(store.systemMsg);
      });
  }
};

const handleClick = (field, id, value) => {
  setTimeout(() => {
    store
      .editTodo(field, id, value)
      .then(() => {
        store.successTip(store.systemMsg);
        store.getTodolists();
      })
      .catch(() => {
        store.failureTip(store.systemMsg);
      });
  }, 300);
};

const colorPanel = [
  { label: "黑色", value: "text-black", color: "black" },
  { label: "蓝色", value: "text-primary", color: "primary" },
  { label: "紫色", value: "text-accent", color: "accent" },
  { label: "红色", value: "text-negative", color: "negative" },
  { label: "绿色", value: "text-positive", color: "positive" },
  { label: "黄色", value: "text-warning", color: "warning" },
  { label: "靛蓝色", value: "text-indigo", color: "indigo" },
];


const confirmDel = (id) => {
  store.$q.dialog({
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
      await store
        .deleteTodo(id)
        .then(() => {
          store.successTip(store.systemMsg);
        })
        .catch((err) => {
          store.failureTip(store.systemMsg);
        });
    })
    .onCancel(() => {});
};

const editTask = (list) => {
  store.$q.dialog({
    title: "编辑内容",
    message: "请输入需要编辑的内容",
    prompt: {
      model: `${list.todo}`,
      type: "text", // optional
    },
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
    .onOk((data) => {
      const createdAt = date.formatDate(Date.now(), "YYYY-MM-DD-HH:mm:ss");
      if (data === "") {
        return store.failureTip("内容不能为空");
      }
      store
        .editTodo("todo", list._id, data, createdAt)
        .then(() => {
          store.successTip(store.systemMsg);
        })
        .catch(() => {
          store.failureTip(store.systemMsg);
        });
    })
    .onCancel(() => {});
};

const colorDialog = (list) => {
  store.$q.dialog({
    title: "选择颜色",
    message: "选择你需要改变的颜色",
    options: {
      type: "radio",
      model: `${list.color}`,
      // isValid: (val) => val === "primary",
      inline: true,
      items: colorPanel,
    },
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
  }).onOk((color) => {
    store
      .editTodo("color", list._id, color)
      .then(() => {
        store.successTip(store.systemMsg);
      })
      .catch((err) => {
        store.failureTip(store.systemMsg);
      });
  });
};
</script>

<style lang="scss" scoped>
.no-tasks {
  opacity: 0.5;
}
</style>
