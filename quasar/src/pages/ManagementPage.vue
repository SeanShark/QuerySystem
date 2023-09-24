<template>
  <q-page class="q-pa-md">
    <h5 class="q-mt-none q-mb-md text-center">管理页</h5>
    <q-input
      v-model="filter"
      dense
      outlined
      class="q-py-md"
    >
      <template #before>
        <div class="text-subtitle2">
          过滤：
        </div>
      </template>
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>
    <div class="row q-gutter-md justify-center">
      <q-list
        v-for="(user, index) in filteredUser"
        :key="index"
        :item="user"
        bordered
        class="rounded-borders col-12 col-md-5 col-lg-3 shadow-3"
      >
        <div
          class="coloum text-center text-h6 q-pa-md"
          :class="user.banned ? 'text-strike' : ''"
        >
          {{ user.email }}
          <q-avatar
            v-if="user.userPrivilege.superUser"
            text-color="red"
            icon="supervisor_account"
            size="lg"
          >
            <q-tooltip>
            管理员
            </q-tooltip>
          </q-avatar>
          <q-avatar
            v-if="user.activationCode != null"
            text-color="warning"
            icon="question_mark"
            size="lg"
          >
            <q-tooltip>
              用户未激活
            </q-tooltip>
          </q-avatar>

          <q-avatar
            v-if="user.banned"
            text-color="grey"
            icon="person_off"
            size="lg"
          >
            <q-tooltip>
            用户已禁用
            </q-tooltip>
          </q-avatar>
        </div>

        <q-separator />
        <q-expansion-item
          expand-separator
          icon="perm_identity"
          label="用户信息"
        >
          <q-card class="shadow-3">
            <q-card-section>
              <q-input v-model="user.name" dense flat readonly item-aligned>
                <template #before>
                  <div class="text-subtitle2">姓名：</div>
                </template>
              </q-input>
              <q-input v-model="user.phone" dense flat readonly item-aligned>
                <template #before>
                  <div class="text-subtitle2">电话：</div>
                </template>
              </q-input>

              <q-input v-model="user.gender" dense flat readonly item-aligned>
                <template #before>
                  <div class="text-subtitle2">性别：</div>
                </template>
              </q-input>

              <q-input v-model="user.birth" dense flat readonly item-aligned>
                <template #before>
                  <div class="text-subtitle2">生日:</div>
                </template>
              </q-input>

              <q-input
                v-model="user.createdAt"
                dense
                flat
                readonly
                item-aligned
              >
                <template #before>
                  <div class="text-subtitle2">创建时间：</div>
                </template>
              </q-input>

              <q-input
                v-model="user.lastLogin"
                dense
                flat
                readonly
                item-aligned
              >
                <template #before>
                  <div class="text-subtitle2">最后登录：</div>
                </template>
              </q-input>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="task_alt"
          label="操作权限"
          header-class="text-primary"
          :disable="user.banned"
        >
          <q-card>
            <q-card-section>
              <q-toggle
                v-if="user.email !== '47262243@qq.com'"
                v-model="user.userPrivilege.superUser"
                name="user.userPrivilege.superUser"
                color="green"
                label="管理员"
                left-label
                :disable="clickable"
                @click="updateUser(user._id, 'userPrivilege.superUser', user.userPrivilege.superUser)"
              />
              <q-toggle
                v-model="user.userPrivilege.read"
                name="user.userPrivilege.read"
                color="green"
                label="读取"
                left-label
                :disable="clickable"
                @click="updateUser(user._id, 'userPrivilege.read', user.userPrivilege.read)"
              />
              <q-toggle
                v-model="user.userPrivilege.add"
                name="user.userPrivilege.add"
                color="green"
                label="增加"
                left-label
                :disable="clickable"
                @click="updateUser(user._id, 'userPrivilege.add', user.userPrivilege.add)"
              />
              <q-toggle
                v-model="user.userPrivilege.edit"
                name="user.userPrivilege.edit"
                color="green"
                label="编辑"
                left-label
                :disable="clickable"
                @click="updateUser(user._id, 'userPrivilege.edit', user.userPrivilege.edit)"
              />
              <q-toggle
                v-model="user.userPrivilege.delete"
                name="user.userPrivilege.delete"
                color="green"
                label="删除"
                left-label
                :disable="clickable"
                @click="updateUser(user._id, 'userPrivilege.delete', user.userPrivilege.delete)"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="drafts"
          label="访问类型"
          header-class="text-teal"
          :disable="user.banned"
        >
          <q-card>
            <q-card-section>
              <q-toggle
                v-model="user.databasePermissions.ip"
                color="green"
                label="终端"
                left-label
                :disable="clickable"
                @click="updateUser(user._id, 'databasePermissions.ip', user.databasePermissions.ip)"
              />
              <q-toggle
                v-model="user.databasePermissions.phone"
                color="green"
                label="电话"
                left-label
                :disable="clickable"
                @click="updateUser(user._id, 'databasePermissions.phone', user.databasePermissions.phone)"
              />
              <q-toggle
                v-model="user.databasePermissions.printer"
                color="green"
                label="耗材"
                left-label
                :disable="clickable"
                @click="updateUser(user._id, 'databasePermissions.printer', user.databasePermissions.printer)"
              />
              <q-toggle
                v-model="user.databasePermissions.datacenter"
                color="green"
                label="机房"
                left-label
                :disable="clickable"
                @click="updateUser(user._id, 'databasePermissions.datacenter', user.databasePermissions.datacenter)"
              />
              <q-toggle
                v-model="user.databasePermissions.surveillance"
                color="green"
                label="监控"
                left-label
                :disable="clickable"
                @click="updateUser(user._id, 'databasePermissions.surveillance', user.databasePermissions.surveillance)"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="place"
          label="地点控制"
          header-class="text-info"
          :disable="user.banned"
        >
          <q-card>
            <q-card-section>
              <q-toggle
                v-model="user.placeAccess.禾花"
                color="green"
                label="禾花"
                left-label
                :disable="clickable"
                @click="updateUser(user._id, 'placeAccess.禾花', user.placeAccess.禾花)"
              />
              <q-toggle
                v-model="user.placeAccess.新南"
                color="green"
                label="新南"
                left-label
                :disable="clickable"
                @click="updateUser(user._id, 'placeAccess.新南', user.placeAccess.新南)"
              />
              <q-toggle
                v-model="user.placeAccess.鹅公岭"
                color="green"
                label="鹅公岭"
                left-label
                :disable="clickable"
                @click="updateUser(user._id, 'placeAccess.鹅公岭', user.placeAccess.鹅公岭)"
              />
              <q-toggle
                v-model="user.placeAccess.白坭坑"
                color="green"
                label="白坭坑"
                left-label
                :disable="clickable"
                @click="updateUser(user._id, 'placeAccess.白坭坑', user.placeAccess.白坭坑)"
              />
              <q-toggle
                v-model="user.placeAccess.慧明"
                color="green"
                label="慧明"
                left-label
                :disable="clickable"
                @click="updateUser(user._id, 'placeAccess.慧明', user.placeAccess.慧明)"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          v-if="user.email !== store.user.email"
          expand-separator
          icon="manage_accounts"
          label="账户管理"
          header-class="text-indigo"
          :disable="user.banned"
        >
          <q-card>
            <q-card-section>
              <div
                class="row justify-around"
              >
                <q-toggle
                  v-model="user.banned"
                  color="green"
                  label="禁用该账户"
                  left-label
                  :disable="clickable"
                  @click="updateUser(user._id, 'banned', user.banned)"
                />
                <q-btn 
                  label="删除该用户"
                  color="grey-4" 
                  text-color="red"
                  @click="confirmDeleteUser(user._id)"
                >
                </q-btn>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/store";

const store = useUserStore();
const router = useRouter();

const originalUsers = ref([]);
const filter = ref("")
const isDisabled = ref(false)

const clickable = ref(false);
const updateUser = async (id, field, value) => {
  if (isDisabled.value) {
    return;
  }
  if (!id || !field || typeof(value) !== 'boolean') {
    store.failureTip('参数有误')
    return;
  }
  clickable.value = true;
  const data = {
    id: id,
    field: field,
    value: value,
    user: store.user.email
  };
  await store.axios
  .post("/user/setuser", data)
  .then((res) => {
    if (res.status === 201) {
      store.successTip(res.data.msg)
    } 
  })
  .catch((err) => {
    store.failureTip(err.response.data.msg)
  })
  .finally(() => {
    clickable.value = false;
  });
};

const filteredUser = computed(() => {
  const searchTerm = filter.value.toLowerCase().trim();
  if (!searchTerm) return originalUsers.value; 
  return originalUsers.value.filter(user => user.email.toLowerCase().includes(searchTerm));
});


const confirmDeleteUser = async (id) => {
      store.$q.dialog({
        title: '确认删除',
        message: '确认要删除该用户吗？',
        cancel: true,
        persistent: true,
        ok: {
          push: true,
          label: "确定",
          color: "green",
        },
        cancel: {
          push: true,
          color: "grey",
          label: "取消",
        },
      }).onOk(async () => {
        await store.axios.delete("/user/deleteuser", {
          params: {
            id: id,
            user: store.user.email,
          },
        })
        .then((res) => {
          if(res.status === 201) {
            originalUsers.value = originalUsers.value.filter((lists) => lists._id !== id);
            store.successTip(res.data.msg);
          }
        })
        .catch((err) => {
          store.failureTip(err.response.data.msg)
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }

onMounted(async () => {
  try {
    await store.verifyUser();
    if (store.user) {
      store.axios
        .post("/user/alluser", { user: store.user.email })
        .then((res) => {
          originalUsers.value = res.data;
        })
        .catch((err) => {
          console.log(err.response.data.msg);
        });
    } else {
      router.push("/index");
    }
  } catch (err) {
    router.push("/index");
  }
});


</script>

<style></style>
