<template>
  <q-layout view="hHh Lpr lFf">
    
      <q-header v-if="store.user">
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
          />
          <q-toolbar-title>
            <div class="gt-sm text-center"> {{ route.name }}</div>
            <q-icon
              class="q-pa-md lt-md icon-position"
              name="fas fa-dove"
              size="sm"
              color="white"
            />
          </q-toolbar-title>
          <q-btn round flat icon="person" @click="toggleRightDrawer">

          </q-btn>
        </q-toolbar>
      </q-header>
      <q-header v-else>
        <q-toolbar>
          <q-btn flat round dense icon="home" class="q-mr-sm" to="/index" @click="toIndexPage"/>
          <q-toolbar-title class="text-center ">{{ route.name }}</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-drawer
        v-if="store.user"
        v-model="leftDrawerOpen"
        :width="store.isMobile ? 250 : 320"
        show-if-above
        bordered
        side="left"
        class="shadow-3"
        :mini="leftMiniState"
        mini-to-overlay
        @mouseover="leftMiniState = false"
        @mouseout="leftMiniState = true"
        
      >
        <q-icon
          v-if="store.isMobile"
          class="q-pa-md"
          show-if-above
          name="fa-sharp fa-solid fa-dove"
          size="md"
          color="primary"
        />
        <q-list>
          <q-item v-ripple to="/" clickable exact>
            <q-item-section avatar>
              <q-icon name="home" :size="store.isMobile? 'sm' : 'md'" color="primary" />
            </q-item-section>
            <q-item-section class="text-weight-bold">首页</q-item-section>
          </q-item>

          <q-item
            v-if="store.user.userPrivilege.read"
            v-ripple
            clickable
            to="/query"
            exact
          >
            <q-item-section avatar>
              <q-icon name="search" :size="store.isMobile? 'sm' : 'md'" color="primary" />
            </q-item-section>
            <q-item-section class="text-weight-bold">查询</q-item-section>
          </q-item>

          <q-item v-ripple clickable to="/logger" exact>
            <q-item-section avatar>
              <q-icon name="edit_note" :size="store.isMobile? 'sm' : 'md'" color="primary" />
            </q-item-section>
            <q-item-section class="text-weight-bold">日志</q-item-section>
          </q-item>
          <q-item
            v-if="store.user.userPrivilege.superUser"
            v-ripple
            clickable
            to="/management"
            exact
          >
            <q-item-section avatar>
              <q-icon name="manage_accounts" :size="store.isMobile? 'sm' : 'md'" color="primary" />
            </q-item-section>
            <q-item-section class="text-weight-bold">用户管理</q-item-section>
          </q-item>
        </q-list>
      </q-drawer>

      <q-drawer 
        v-if="store.user"
        v-model="rightDrawerOpen" 
        show-if-above side="right" 
        bordered
        :mini="rigthMiniState"
        mini-to-overlay
        @mouseover="rigthMiniState = false"
        @mouseout="rigthMiniState = true"
        
      >
        <q-list>
          <q-item clickable @click="confirmLogout">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section> 退出账号 </q-item-section>
          </q-item>
          <q-item clickable @click="changePwd = true">
            <q-item-section avatar>
              <q-icon name="lock" />
            </q-item-section>
            <q-item-section> 更改密码 </q-item-section>
          </q-item>
          <q-item clickable @click="settings = true">
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section> 个人设定 </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>

      <q-dialog v-model="changePwd" persistent>
        <q-card class="q-pa-md" :style="store.isMobile? 'display:block; width: 100%;' : 'display:block; width: 450px;'">
          <q-card-section>
            <div class="text-h6 text-center">密码更改</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-md">
            <div class="div q-gutter-md">
              <q-input
                ref="originPwdRef"
                v-model="originPwd"
                type="password"
                filled
                autofocus
                dense
                bottom-slots
                hide-bottom-space
                autocomplete="off"
                :error="originPwdError"
              >
                <template #prepend>
                  <div class="text-subtitle2">原密码：</div>
                </template>
                <template #error>
                  {{ originPwdErrorMsg }}
                </template>
              </q-input>
              <q-input
                ref="newPwdRef"
                v-model="newPwd"
                type="password"
                filled
                dense
                bottom-slots
                hide-bottom-space
                lazy-rules="ondemand"
                autocomplete="off"
                :rules="[(val) => val.length >= 8 || '密码长度应该至少为8位数']"
              >
                <template #prepend>
                  <div class="text-subtitle2">新密码 ：</div>
                </template>
              </q-input>
              <q-input
                ref="repeatPwdRef"
                v-model="repeatPwd"
                type="password"
                filled
                dense
                bottom-slots
                hide-bottom-space
                lazy-rules="ondemand"
                autocomplete="off"
                :rules="[(val) => val == newPwd || '与输入的密码不一致']"
              >
                <template #prepend>
                  <div class="text-subtitle2">重复密码：</div>
                </template>
              </q-input>
            </div>
          </q-card-section>
          <q-card-actions align="right" class="text-primary">
            <q-btn v-close-popup flat label="取消" @click="cancelChangePwd" />
            <q-btn
              flat
              label="确定"
              :loading="changeLoading"
              @click="submitChangePwd"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="settings" persistent>
        <q-card class="q-pa-md" :style="store.isMobile? 'display:block; width: 100%;' : 'display:block; width: 450px;'">
          <q-card-section>
            <div class="text-h6 text-center">个人资料更改</div>
          </q-card-section>
          <q-separator class="q-mb-md "/>
          <q-card-section class="q-pa-sm">
            <div class="q-gutter-md">
              <q-input
                ref="nameRef"
                v-model="name"
                outlined
                autofocus
                dense
                bottom-slots
                hide-bottom-space
                lazy-rules="ondemand"
                :rules="[(val) => !!val || '名字不能为空']"
              >
                <template #prepend>
                  <div class="text-subtitle2">姓名：</div>
                </template>
                <template #before>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-select
                ref="genderRef"
                v-model="gender"
                outlined
                dense
                bottom-slots
                hide-bottom-space
                emit-value
                lazy-rules="ondemand"
                :options="genderOptions"
                :rules="[(val) => !!val || '性别不能为空']"
              >
                <template #prepend>
                  <div class="text-subtitle2">性别：</div>
                </template>
                <template #before>
                  <q-icon name="transgender" />
                </template>
                <template #option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-icon
                        :name="scope.opt.icon"
                        :color="scope.opt.value === '男' ? 'primary' : 'red'"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-input
                ref="phoneRef"
                v-model.number="phone"
                outlined
                dense
                bottom-slots
                hide-bottom-space
                lazy-rules="ondemand"
                :rules="[(val) => !!val || '电话不能为空']"
              >
                <template #before>
                  <q-icon name="phone_iphone" />
                </template>
                <template #prepend>
                  <div class="text-subtitle2">电话：</div>
                </template>
              </q-input>
              <q-input v-model="birth" outlined dense>
                <template #before>
                  <q-icon name="cake" />
                </template>
                <template #prepend>
                  <div class="text-subtitle2">出生年月：</div>
                </template>
              </q-input>
            </div>
          </q-card-section>
          <q-card-actions align="right" class="text-primary">
            <q-btn v-close-popup flat label="取消" @click="cancelSetting" />
            <q-btn flat label="确定" :loading="changeLoading" @click="submitSettings" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-page-container class="layout-container">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </q-page-container>
    
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../stores/store";

const store = useUserStore();

const route = useRoute();
const router = useRouter();
const changePwd = ref(false);
const settings = ref(false);
const originPwd = ref("");
const newPwd = ref("");
const repeatPwd = ref("");
const name = ref("");
const gender = ref("");
const phone = ref();
const birth = ref("");
const nameRef = ref(null);
const genderRef = ref(null);
const phoneRef = ref(null);
const originPwdRef = ref(null);
const newPwdRef = ref(null);
const repeatPwdRef = ref(null);
const changeLoading = ref(false);
const originPwdError = ref(false);
const originPwdErrorMsg = ref("");
const leftMiniState = ref(true);
const rigthMiniState = ref(true);

const cancelSetting = () => {
  name.value = store.user.name;
  gender.value = store.user.gender;
  phone.value = store.user.phone;
  birth.value = store.user.birth;
};

/*
If <keepalive>, route to 'register' and back to /index again, 
the mainTab.value will keeps at 'register' tab
So need to set the value to 'login' menully,via the store data.
*/
const toIndexPage = () => {
  store.mainTab = 'login';
}

const cancelChangePwd = () => {
  newPwd.value = "";
  repeatPwd.value = "";
  originPwdError.value = false;
};

const submitChangePwd = async () => {
  originPwdError.value = false;
  if (!originPwd.value) {
    originPwdError.value = true;
    originPwdErrorMsg.value = "原密码不能为空";
    return;
  }
  if (originPwd.value.length < 8) {
    originPwdError.value = true;
    originPwdErrorMsg.value = "原密码不应少于8位";
    return;
  }

  if (originPwd.value === newPwd.value) {
    originPwdError.value = true;
    originPwdErrorMsg.value = "原密码不能与新密码一致";
    return;
  }

  const data = {
    originPwd: originPwd.value,
    newPwd: newPwd.value,
  };

  if (
    (await newPwdRef.value?.validate()) &&
    (await repeatPwdRef.value?.validate())
  ) {
    changeLoading.value = true;
    store.axios
      .post("/user/changepwd", data)
      .then((res) => {
        if (res.status === 200) {
          changePwd.value = false;
          store.successTip(res.data.msg);
        }
      })
      .catch((err) => {
        if (err.response.data.status === "pwdError") {
          originPwdError.value = true;
          originPwdErrorMsg.value = "原密码验证错误";
        } else {
          store.failureTip(err.response.data.msg);
        }
      })
      .finally(() => {
        changeLoading.value = false;
      })
  }
};

const submitSettings = async () => {
  if (
    (await nameRef.value?.validate()) &&
    (await genderRef.value?.validate()) &&
    (await phoneRef.value?.validate())
  ) {
    const data = {
      name: name.value,
      gender: gender.value,
      phone: phone.value,
      birth: birth.value,
    }
    changeLoading.value = true;
    await store.axios.post("/user/personal", data)
      .then((res) => {
        if (res.status === 201) {
          settings.value = false;
          store.user.userInfo.name = name.value,
          store.user.userInfo.gender = gender.value,
          store.user.userInfo.phone = phone.value,
          store.user.userInfo.birth = birth.value,
          store.successTip(res.data.msg);
        }
      })
      .catch((err) => {
        store.failureTip(err.response.data.msg);
      })
      .finally(() => {
        changeLoading.value = false;
      })
  }
};

const genderOptions = [
  {
    label: "男",
    value: "男",
    icon: "male",
  },
  {
    label: "女",
    value: "女",
    icon: "female",
  },
];

const confirmLogout = () => {
  store.$q
    .dialog({
      title: "确定",
      message: `确定要退出当前账号吗?`,
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
      store.axios
        .post("/user/logout")
        .then((res) => {
          store.successTip(res.data.msg);
          store.authUser = null
          router.push("/index");
        })
        .catch((err) => {
          store.failureTip(err.response.data);
        })
    })
    .onCancel(() => {});
};

onMounted(async () => {
  await store.verifyUser();
  if (store.user) {
    name.value = store.user.userInfo.name;
    gender.value = store.user.userInfo.gender;
    phone.value = store.user.userInfo.phone;
    birth.value = store.user.userInfo.birth;
  }
});

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const rightDrawerOpen = ref(false);
const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};
</script>

<style lang="sass" scoped>
.icon-position
  position: absolute
  bottom: 0
  left: 50%
  transform: translateX(-50%)

.layout-container 
  height: 100vh
  max-width: 1200px
  margin: auto
  
</style>
