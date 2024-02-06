<template>
  <div class="q-pa-md row">
    <q-stepper
      ref="stepperRef"
      v-model="step"
      class="fixed-center"
      color="primary"
      animated
      transition-next="fade"
      :contracted="store.isMobile"
      :style="store.isMobile? 'width: 100%;' : 'width: 600px;'"
    >
      <q-step
        :name="1"
        title="邮箱地址"
        icon="email"
        :done="step > 1"
        style="min-height: 200px"
      >
        <div class="q-py-md">
          <q-input
            ref="emailRef"
            v-model="userInfo.email"
            filled
            type="email"
            label="邮箱地址"
            class="q-py-md"
            bottom-slots
            hide-bottom-space
            :error="errorDate.hasError"
            :loading="isLoading"
          >
            <template #before>
              <q-icon color="teal" name="mail" />
            </template>
            <template #error>
              {{ errorDate.errorMsg }}
            </template>
          </q-input>

          <div class="row justify-center items-center">
            <q-input
              v-model="captcha.Data"
              class="col-12"
              filled
              :error="captcha.hasError"
              label="验证码"
            >
              <template #before>
                <q-icon v-if="captcha.state" name="lock" color="grey" />
                <q-icon v-else name="lock_open" color="grey" />
              </template>
              <template #after>
                <div
                  class="q-pt-sm rounded-borders"
                  @click="getcapcha"
                  v-html="captcha.Url"
                ></div>
              </template>
              <template #error>
                {{ captcha.errorMsg }}
              </template>
              <template #append>
                <q-icon v-if="!captcha.state" name="done" color="green" />
              </template>
            </q-input>
          </div>
        </div>
      </q-step>

      <q-step
        :name="2"
        title="验证码"
        icon="key"
        :done="step > 2"
        style="min-height: 200px"
      >
        <div class="q-py-md">
          <q-input
            ref="codeRef"
            v-model="userInfo.code"
            filled
            type="text"
            label="重置码"
            class="q-py-md"
            bottom-slots
            hide-bottom-space
            :error="errorDate.hasError"
            :loading="isLoading"
          >
            <template #before>
              <q-icon color="red" name="key" />
            </template>
            <template #error>
              {{ errorDate.errorMsg }}
            </template>
          </q-input>
        </div>
      </q-step>

      <q-step
        :name="3"
        title="重置密码"
        icon="password"
        style="min-height: 200px"
      >
        <div class="q-pt-md">
          <q-input
            ref="passwordRef"
            v-model="userInfo.password"
            filled
            :type="isPwd ? 'password' : 'text'"
            label="密码"
            class="q-py-md"
            bottom-slots
            hide-bottom-space
            :rules="[checkPassword]"
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
          </q-input>
        </div>

        <div class="q-pb-md">
          <q-input
            ref="repeatpwdRef"
            v-model="userInfo.repeat_password"
            filled
            :type="isPwd ? 'password' : 'text'"
            label="重复密码"
            class="q-py-md"
            bottom-slots
            hide-bottom-space
            :rules="repeatpwdRule"
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
          </q-input>
        </div>
      </q-step>

      <template #navigation>
        <q-stepper-navigation class="row" on>
          <q-space />
          <q-btn
            color="primary"
            :label="step === 3 ? '提  交' : '下一步'"
            :disable="isDone"
            @click="goToNextStep"
          />
        </q-stepper-navigation>
      </template>

      <template #message>
        <q-banner v-if="step === 1" class="bg-blue-grey-6 text-white q-px-lg">
          请输入邮箱地址：
        </q-banner>
        <q-banner
          v-else-if="step === 2"
          class="bg-blue-grey-6 text-white q-px-lg"
        >
          请查收邮箱新邮件，并输入6位重置码：
        </q-banner>
        <q-banner v-else class="bg-blue-grey-6 text-white q-px-lg">
          请设置新密码：
        </q-banner>
      </template>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/store";

const store = useUserStore();
const userInfo = reactive({
  email: "",
  code: "",
  password: "",
  repeat_password: "",
});

const router = useRouter();
const step = ref(1);
const isPwd = ref(true);
const isDone = ref(false);
const isLoading = ref(false);
const emailRef = ref(null);
const codeRef = ref(null);
const passwordRef = ref(null);
const repeatpwdRef = ref(null);
const errorDate = reactive({
  hasError: false,
  errorMsg: "",
});

const stepperRef = ref(null);

const checkPassword = (val) => {
  return val.length >= 8 || "密码长度应该至少为8位数";
};

const repeatpwdRule = [
  (val) => val == userInfo.password || "与输入的密码不一致",
];

const goToNextStep = async () => {
  if (step.value === 1) {
    errorDate.hasError = false;
    captcha.hasError = false;

    if (!userInfo.email) {
      errorDate.errorMsg = "请输入邮箱地址";
      errorDate.hasError = true;
      return;
    }

    if (!captcha.state) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailPattern.test(userInfo.email)) {
        //if do not set next btn to disable will trigger a bug -
        //- that double(or more) click on the btn will jump to step 3 directly.
        isDone.value = true;
        errorDate.hasError = false;
        isLoading.value = true;
        await store.axios
          .post("/user/forgot", {
            email: userInfo.email,
          })
          .then(async () => {
            isLoading.value = false;
            store.successTip("验证码已发至您邮箱，请查收");
            return stepperRef.value.next();
          })
          .catch((err) => {
            errorDate.errorMsg =
              err.response.data && err.response.data.msg
                ? err.response.data.msg
                : "未知错误, 请重试.";
            errorDate.hasError = true;
            isLoading.value = false;
          })
          .finally(() => {
            isDone.value = false;
          })
      } else {
        errorDate.hasError = true;
        errorDate.errorMsg = "非法邮箱地址";
      }
    } else {
      if (captcha.Data.length === 0) {
        captcha.hasError = true;
        captcha.errorMsg = "请先完成图形验证码";
      } else if (captcha.Data.length === 4) {
        captcha.hasError = true;
        captcha.errorMsg = "图形验证码错误";
      } else {
        captcha.hasError = true;
        captcha.errorMsg = "图形验证码长度为4位字符";
      }
    }
    // stepperRef.value.next();
  } else if (step.value === 2) {
    if (userInfo.code.length === 6) {
      isDone.value = true;
      errorDate.hasError = false;
      isLoading.value = true;
      await store.axios
        .post("/user/verifyforgotcode", {
          email: userInfo.email,
          code: userInfo.code,
        })
        .then(async (res) => {
          if (res.data.status === "success") {
            store.successTip(res.data.msg);
            isLoading.value = false;
            stepperRef.value.next();
          }
        })
        .catch((err) => {
          isLoading.value = false;
          errorDate.hasError = true;
          errorDate.errorMsg = err.response.data.msg;
        })
        .finally(() => {
          isDone.value = false;
        })
    } else {
      isLoading.value = false;
      errorDate.hasError = true;
      errorDate.errorMsg = "验证码为6位数字";
    }
  } else {
    errorDate.hasError = false;
    if (
      (await passwordRef.value?.validate()) &&
      (await repeatpwdRef.value?.validate())
    ) {
      isLoading.value = true;
      await store.axios
        .post("/user/resetpassword", {
          email: userInfo.email,
          code: userInfo.code,
          password: userInfo.password,
        })
        .then(async (res) => {
          if (res.data.status === "success") {
            isLoading.value = false;
            isDone.value = true;
            setTimeout(() => {
              router.push("/index");
            }, 3000);
            store.successTip(res.data.msg);
            store.successTip('3秒之后自动转入登录页');
          }
        })
        .catch((err) => {
          isLoading.value = false;
          errorDate.hasError = true;
          errorDate.errorMsg = err.response.data.msg;
        });
    }
  }
};

const captcha = reactive({
  Url: "",
  Data: "",
  hasError: false,
  errorMsg: "",
  text: "",
  state: true,
});

onMounted(async () => {
  getcapcha();
  await store
    .verifyUser()
    .then(() => {
      isLoading.value = false;
      store.successTip("成功登录");
      router.push("/");
    })
    .catch((err) => {
      
    });
});

const getcapcha = () => {
  captcha.state = true;
  store.axios.get(`/user/captcha?${Math.random()}`).then((res) => {
    captcha.Url = res.data.data;
    captcha.text = res.headers["captcha"].toLowerCase();
  });
};

watch(
  () => captcha.Data,
  (newValue) => {
    if (newValue.toLowerCase() === captcha.text) {
      captcha.state = false;
      captcha.hasError = false;
    } else {
      captcha.state = true;
    }
  }
);
/* */


</script>

<style lang="sass" scoped></style>
