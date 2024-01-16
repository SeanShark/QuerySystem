<template>
  <q-page class="q-pa-md">
    <h5 class="q-mt-none q-mb-md text-center lt-md">客户管理</h5>


  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/store";

const store = useUserStore();
const router = useRouter();


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
