<template>
  <div class="row">
    <q-card
      class="shadow-13 fixed-center q-pa-none col-xs-12 col-md-6"
      style="max-width: 550px"
    >
      <q-tabs
        v-model="store.mainTab"
        align="justify"
        narrow-indicator
        class="q-mb-md"
      >
        <q-tab 
          class="text-primary" 
          name="login" 
          label=" 登 录 "
        />
        <q-route-tab
          class="text-orange"
          name="register"
          label=" 注 册 "
          to="/register"
        />
      </q-tabs>

      <div class="q-gutter-y-sm">
        <q-tab-panels
          v-model="store.mainTab"
          animated
          transition-prev="fade"
          transition-next="fade"
          class="text-center q-ma-none q-pa-none"
        >
          <!-- Login Page -->
          <q-tab-panel class="q-gutter-sm" name="login">
            <div class="text-h5 q-pb-md">登 录 页</div>

            <q-avatar size="120px" class="shadow-3">
              <img src="/icons/img_avatar.png" />
            </q-avatar>
            <div class="q-pt-sm">
              <q-input
                v-model="loginInfo.email"
                filled
                type="email"
                label="邮箱地址"
                class="q-py-xs"
                bottom-slots
                hide-bottom-space
                :error="loginInfo.nameError"
              >
                <template #before>
                  <q-icon color="teal" name="mail" />
                </template>
                <template #error>
                  {{ loginInfo.errorMsg }}
                </template>
              </q-input>
            </div>

            <div class="q-mb-md">
              <q-input
                v-model="loginInfo.password"
                filled
                :type="isPwd ? 'password' : 'text'"
                label="密码"
                
                bottom-slots
                hide-bottom-space
                :error="loginInfo.pwdError"
              >
                <template #before>
                  <q-icon name="lock" />
                </template>
                <template #append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
                <template #error>
                  {{ loginInfo.errorMsg }}
                </template>
              </q-input>
            </div>

            <div class="q-my-md row justify-between">
              <q-toggle
                v-model="loginInfo.remember"
                class="left"
                label="记住我"
              />
              <q-btn
                flat
                color="indigo-7"
                label="忘记密码？"
                to="/forgot"
                class="text-italic"
              />
            </div>

            <div class="q-py-md">
              <q-btn
                color="primary"
                class="full-width"
                icon-right="login"
                label="登 录"
                :loading="isLoading"
                @click="loginSubmit"
              />
            </div>
          </q-tab-panel>

          <!-- Register Page-->
        </q-tab-panels>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useUserStore } from "src/stores/store";
import { useRouter } from "vue-router";

const store = useUserStore();
const router = useRouter();

const isPwd = ref(true);
const isLoading = ref(false);



onMounted(async () => {
  const token = localStorage.getItem("token");

  if (token !== null) {
    await store.verifyUser()
    .then(() => {
      if(store.user) {
        router.push("/");
      }
    })
  }
});

const loginInfo = reactive({
  email: "",
  password: "",
  remember: false,
  pwdError: false,
  nameError: false,
  errorMsg: "",
});

const loginSubmit = async () => {
  loginInfo.nameError = false;
  loginInfo.pwdError = false;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!loginInfo.email) {
    loginInfo.nameError = true;
    return loginInfo.errorMsg = "请输入用户名";
  } else if (!loginInfo.password) {
    loginInfo.pwdError = true;
    return loginInfo.errorMsg = "密码不能为空";
  } 
  
  if (!emailPattern.test(loginInfo.email)) {
    loginInfo.nameError = true;
    loginInfo.errorMsg = "非法邮箱地址";
    return;
  }
  isLoading.value = true;
  await store.axios
    .post("/user/login", loginInfo)
    .then(async (res) => {
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        await store
          .verifyUser()
          .then(() => {
            isLoading.value = false;
            store.successTip("成功登录");
            router.push("/");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      isLoading.value = false;
      if (err.response.data.status === "nameError") {
        loginInfo.nameError = true;
        loginInfo.errorMsg = err.response.data.msg;
      } else if (err.response.data.status === "pwdError") {
        loginInfo.pwdError = true;
        loginInfo.errorMsg = err.response.data.msg;
      } else {
        store.store.failureTip(err.response.data.msg);
      }
    });
};

</script>

<style lang="sass" scoped></style>
