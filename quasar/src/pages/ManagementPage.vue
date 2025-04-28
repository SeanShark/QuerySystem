<template>
  <q-page class="q-pa-md">
    <h5 class="q-mt-none q-mb-md text-center lt-md">管理页</h5>
    <q-input v-model="filter" dense outlined class="q-py-md">
      <template #before>
        <div class="text-subtitle2">过滤：</div>
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
        class="rounded-borders col-12 col-md-4 col-lg-6 shadow-3"
      >
        <div
          class="coloum text-center text-h6 q-pa-md"
          :class="user.userInfo.banned ? 'text-strike' : ''"
        >
          {{ user.userInfo.email }}
          <q-avatar
            v-if="user.userPrivilege.superUser"
            text-color="red"
            icon="supervisor_account"
            size="lg"
          >
            <q-tooltip> 管理员 </q-tooltip>
          </q-avatar>
          <q-avatar
            v-if="user.userInfo.activationCode != null"
            text-color="warning"
            icon="question_mark"
            size="lg"
          >
            <q-tooltip> 用户未激活 </q-tooltip>
          </q-avatar>

          <q-avatar
            v-if="user.userInfo.banned"
            text-color="grey"
            icon="person_off"
            size="lg"
          >
            <q-tooltip> 用户已禁用 </q-tooltip>
          </q-avatar>
        </div>

        <q-separator />
        <q-expansion-item
          expand-separator
          icon="perm_identity"
          label="用户信息"
          header-class="text-green"
        >
          <q-card class="shadow-3">
            <q-card-section>
              <q-input
                v-model="user.userInfo.name"
                dense
                flat
                readonly
                item-aligned
              >
                <template #before>
                  <div class="text-subtitle2">姓名：</div>
                </template>
              </q-input>
              <q-input
                v-model="user.userInfo.phone"
                dense
                flat
                readonly
                item-aligned
              >
                <template #before>
                  <div class="text-subtitle2">电话：</div>
                </template>
              </q-input>

              <q-input
                v-model="user.userInfo.gender"
                dense
                flat
                readonly
                item-aligned
              >
                <template #before>
                  <div class="text-subtitle2">性别：</div>
                </template>
              </q-input>

              <q-input
                v-model="user.userInfo.birth"
                dense
                flat
                readonly
                item-aligned
              >
                <template #before>
                  <div class="text-subtitle2">生日:</div>
                </template>
              </q-input>

              <q-input
                v-model="user.userInfo.createdAt"
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
                v-model="user.userInfo.lastLogin"
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
          :disable="user.userInfo.banned"
        >
          <q-card>
            <q-card-section>
              <q-toggle
                v-if="user.userInfo.email !== '47262243@qq.com'"
                v-model="user.userPrivilege.superUser"
                name="user.userPrivilege.superUser"
                color="green"
                label="管理员"
                left-label
                :disable="clickable"
                @click="
                  updateUser(
                    user._id,
                    'userPrivilege.superUser',
                    user.userPrivilege.superUser
                  )
                "
              />
              <q-toggle
                v-model="user.userPrivilege.read"
                name="user.userPrivilege.read"
                color="green"
                label="读取"
                left-label
                :disable="clickable"
                @click="
                  updateUser(
                    user._id,
                    'userPrivilege.read',
                    user.userPrivilege.read
                  )
                "
              />
              <q-toggle
                v-model="user.userPrivilege.add"
                name="user.userPrivilege.add"
                color="green"
                label="增加"
                left-label
                :disable="clickable"
                @click="
                  updateUser(
                    user._id,
                    'userPrivilege.add',
                    user.userPrivilege.add
                  )
                "
              />
              <q-toggle
                v-model="user.userPrivilege.edit"
                name="user.userPrivilege.edit"
                color="green"
                label="编辑"
                left-label
                :disable="clickable"
                @click="
                  updateUser(
                    user._id,
                    'userPrivilege.edit',
                    user.userPrivilege.edit
                  )
                "
              />
              <q-toggle
                v-model="user.userPrivilege.delete"
                name="user.userPrivilege.delete"
                color="green"
                label="删除"
                left-label
                :disable="clickable"
                @click="
                  updateUser(
                    user._id,
                    'userPrivilege.delete',
                    user.userPrivilege.delete
                  )
                "
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="drafts"
          label="访问类型"
          header-class="text-teal"
          :disable="user.userInfo.banned"
        >
          <q-card>
            <q-card-section>
              <q-toggle
                v-model="user.databasePermissions.IP"
                color="green"
                label="终端"
                left-label
                :disable="clickable"
                @click="
                  updateUser(
                    user._id,
                    'databasePermissions.IP',
                    user.databasePermissions.IP
                  )
                "
              />
              <q-toggle
                v-model="user.databasePermissions.Phone"
                color="green"
                label="电话"
                left-label
                :disable="clickable"
                @click="
                  updateUser(
                    user._id,
                    'databasePermissions.Phone',
                    user.databasePermissions.Phone
                  )
                "
              />
              <q-toggle
                v-model="user.databasePermissions.Printer"
                color="green"
                label="耗材"
                left-label
                :disable="clickable"
                @click="
                  updateUser(
                    user._id,
                    'databasePermissions.Printer',
                    user.databasePermissions.Printer
                  )
                "
              />
              <q-toggle
                v-model="user.databasePermissions.Datacenter"
                color="green"
                label="机房"
                left-label
                :disable="clickable"
                @click="
                  updateUser(
                    user._id,
                    'databasePermissions.Datacenter',
                    user.databasePermissions.Datacenter
                  )
                "
              />
              <q-toggle
                v-model="user.databasePermissions.Surveillance"
                color="green"
                label="监控"
                left-label
                :disable="clickable"
                @click="
                  updateUser(
                    user._id,
                    'databasePermissions.Surveillance',
                    user.databasePermissions.Surveillance
                  )
                "
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="place"
          label="客户控制"
          header-class="text-info"
          :disable="user.userInfo.banned"
        >
          <q-card>
            <q-card-section>
              <q-toggle
                v-for="(value, customer) in store.customerAccessList"
                :key="customer"
                v-model="store.customerAccessList[customer]"
                color="green"
                :label="customer"
                left-label
                :disable="clickable"
                @click="
                  updateCustomerAccess(
                    user._id,
                    customer,
                    store.customerAccessList[customer]
                  )
                "
              />
            </q-card-section>
            <q-separator inset/>
            <q-tabs v-model="tab" class="text-teal">
              <q-tab label="增加" name="one" />
              <q-tab label="删除" name="two" />
            </q-tabs>

            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="one">
                <q-input 
                  v-model="newCustomer" 
                  label="客户名称"
                  maxlength="10"
                  filled
                  dense
                  @keyup.enter="newCustomerFunction"
                >
                  <template #append>
                    <q-btn round dense flat icon="add" color="green" @click="newCustomerFunction"/>
                  </template>
                </q-input>
                
              </q-tab-panel>

              <q-tab-panel name="two">
                <q-radio
                  v-for="(value, customer) in store.customerAccessList"
                  :key="customer"
                  v-model="selection"
                  :label="customer"
                  :val="customer"
                />
                <div align="right">
                  <q-btn label="删除" color="red" icon="delete" @click="delCustomer"> </q-btn>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          v-if="user.userInfo.email !== store.user.userInfo.email"
          expand-separator
          icon="manage_accounts"
          label="账户管理"
          header-class="text-indigo"
          :disable="user.userInfo.banned"
        >
          <q-card>
            <q-card-section>
              <div class="row justify-around">
                <q-toggle
                  v-model="user.userInfo.banned"
                  color="green"
                  label="禁用该账户"
                  left-label
                  :disable="clickable"
                  @click="updateUser(user._id, 'banned', user.userInfo.banned)"
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
const filter = ref("");
const isDisabled = ref(false);

const tab = ref("one");
const newCustomer = ref('');
const selection = ref()

const clickable = ref(false);

onMounted(async () => {
  // console.log(store.customerAccess);
  await store.verifyUser();
  
  if (store.user) {
    await store.getAllUserInfo();
    await store.getCustomers();
  } else {
    router.push("/index");
  }
  
});


const updateUser = async (id, field, value) => {
  if (isDisabled.value) {
    return;
  }
  if (!id || !field || typeof value !== "boolean") {
    store.failureTip("参数有误");
    return;
  }
  clickable.value = true;
  const data = {
    id: id,
    field: field,
    value: value,
  };
  await store.axios
    .post("/user/setuser", data)
    .then((res) => {
      if (res.status === 201) {
        store.successTip(res.data.msg);
      }
    })
    .catch((err) => {
      store.failureTip(err.response.data.msg);
    })
    .finally(() => {
      clickable.value = false;
    });
};


const updateCustomerAccess = async (id, customer, value) => {
  if (isDisabled.value) {
    return;
  }
  if (!id || typeof value !== "boolean" || !customer) {
    store.failureTip("参数有误");
    return;
  }
  clickable.value = true;
  const data = {
    id: id,
    customer: customer,
    value: value,
  };
  try {
    const res = await store.axios.post("/customer/updatecustomer", data);
    store.successTip(res.data.msg);
    if (id === store.user._id) {
      if(!value) {
        store.customersAvailable = store.customersAvailable.filter(item => item !== customer);
      } else {
        store.customersAvailable.push(customer);
      }
    }
  } catch (err) {
    store.failureTip(err.response.data.msg);
  }
  clickable.value = false;

};

const newCustomerFunction = async () => {
  if (newCustomer.value.length > 0) {
    try {
      const res = await store.axios.post("/customer/newcustomer", { customer: newCustomer.value });
      store.successTip(res.data.msg);
      const newCustomerInfo = {
        _id: res.data._id,
        customer: newCustomer.value,
        accessable: [],
      }
      store.customerAccessList[newCustomer.value] = false;
      store.customerLists.unshift(newCustomerInfo);
      newCustomer.value = '';
    } catch (error) {
      console.log(error);
      if (error.response.data.status) {
        store.failureTip(error.response.data.msg);
      } else {
        store.failureTip('失败，未知错误！');
      }
    }
  }
}

const delCustomer = async () => {
  if(selection.value) {
    try {
      const res = await store.axios.delete('/customer/delCustomer', {
        params: {
          customer: selection.value,
        },
      })
      store.successTip(res.data.msg);
      store.customerLists = store.customerLists.filter(item => item.customer !== selection.value);
      // delete customerAccess.value[selection.value];
      delete store.customerAccessList[selection.value];
      store.customersAvailable = store.customersAvailable.filter(item => item !== selection.value);
      if (store.searchData.customer === selection.value) {
        store.searchData.customer = "-请选择-";
      }
      selection.value = '';
    } catch (error) {
      if (error.response.data.status) {
        store.failureTip(error.response.data.msg)
      } else {
        store.failureTip('失败，未知错误！')
      }
    }
  }
}

const filteredUser = computed(() => {
  const searchTerm = filter.value.toLowerCase().trim();
  if (!searchTerm) return store.originalUsers;
  return store.originalUsers.filter((user) =>
    user.userInfo.email.toLowerCase().includes(searchTerm)
  );
});

const confirmDeleteUser = async (id) => {
  store.$q.dialog({
    title: "确认删除",
    message: "确认要删除该用户吗？",
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
  })
  .onOk(async () => {
    try {
      const res = await store.axios.delete("/user/deleteuser", {
        params: {
          id: id,
        },
      })
      originalUsers.value = originalUsers.value.filter((lists) => lists._id !== id);
      store.successTip(res.data.msg);
    } catch (err) {
      store.failureTip(err.response.data.msg);
    }
  })
  .onCancel(() => {
    // console.log('>>>> Cancel')
  })
  .onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  });
};


</script>

<style></style>
