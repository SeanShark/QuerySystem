import { defineStore } from "pinia";
import axios from "axios";
import { store } from "quasar/wrappers";
import { reactive } from "vue";
import { useQuasar, date, exportFile } from "quasar";

export const useUserStore = defineStore("datastore", {
  state: () => ({
    authUser: null,
    $q: useQuasar(),
    axios: axios,
    todayDate: date.formatDate(new Date(), 'YYYY/MM/DD'),
    isDisabled: false,
    postStatus: false,
    selected: [],
    todolists: [],
    doingLists: [],
    doneLists: [],
    checkLists: [],
    filteredLists: [],
    systemMsg: "",
    originalData: null,
    addBtnLoading: false,
    editBtnLoading: false,
    isAdd: false,
    searchData: {
      type: "-请选择-",
      place: "-请选择-",
      field: "-请选择-",
      keyword: "",
    },
    ipFormState: {
      nameError: false,
      IPError: false,
      MACError: false,
      errorMsg: "",
    },
    phoneFormState: {
      numberError: false,
      colorError: false,
      panelError: false,
      officeError: false,
      errorMsg: "",
    },
    printerFormState: {
      brandError: false,
      typeError: false,
      cartridgeError: false,
      colorError: false,
      amountError: false,
      officeError: false,
      errorMsg: "",
    },
    datacenterFormState: {
      nameError: false,
      IPError: false,
      userError: false,
      errorMsg: "",
    },
    surveillanceFormState: {
      typeError: false,
      IPError: false,
      userError: false,
      pwdError: false,
      errorMsg: "",
    },
    colorOptions: ["黑色", "青色", "黄色", "红色"],
    colorPairOptions: ["默认", "橙色", "绿色", "蓝色", "棕色"],
    surveillanceTypes: ["主机", "摄像头", "路由交换", "其他"],
  }),

  getters: {
    user: (state) => state.authUser,
    isMobile: (state) => {
      return state.$q.platform.is.mobile || state.$q.screen.lt.sm;
    },
    IPData: (state) => reactive({
      _id: "",
      Place: state.searchData.place,
      姓名: "",
      IP: "",
      MAC: "",
      办公室: "",
      备注: "",
      updatedAt: "",
    }),
    printerData: (state) => reactive({
      _id: "",
      Place: state.searchData.place,
      品牌: "",
      打印机: "",
      硒鼓: "",
      颜色: state.colorOptions[0],
      数量: 0,
      办公室: "",
      updatedAt: "",
    }),
    phoneData: (state) => reactive({
      _id: "",
      Place: state.searchData.place,
      号码: "",
      面板号: "",
      楼层线路: "",
      颜色对: "",
      办公室: "",
      updatedAt: "",
    }),
    datacenterData: (state) => reactive({
      _id: "",
      Place: state.searchData.place,
      名称: "",
      IP: "",
      用户名: "",
      密码: "",
      备注: "",
      updatedAt: "",
    }),
    surveillanceData: (state) => reactive({
      _id: "",
      Place: state.searchData.place,
      类型: state.surveillanceTypes[0],
      IP: "",
      用户名: "",
      密码: "",
      备注: "",
      updatedAt: "",
    }),
  },
  actions: {
    async getToken(data) {
      await axios
        .post("/user/login", data)
        .then((res) => {
          if (res.data.status === "success") {
            localStorage.setItem("token", res.data.token);
          }
        })
        .catch((err) => {

          //console.log(err.response.data.msg);
        });
    },
    async verifyUser() {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        axios
          .get("/user/verifyuser", {
            headers: { token: token },
          })
          .then((res) => {
            this.authUser = res.data.user;
            resolve(); // Resolve the promise when user verification is complete
          })
          .catch((err) => {
            this.authUser = null;
            reject(err); // Reject the promise if an error occurs
          });
      });
    },
    logout () {
      localStorage.clear();
      store.authUser = null;
    },
    failureTip (msg) {
      this.$q.notify({
        type: "negative",
        progress: true,
        message: `${msg}`,
      });
    },
    successTip (msg) {
      this.$q.notify({
        type: "positive",
        progress: true,
        message: `${msg}`,
      });
    },    
    getTodolists () {
      return new Promise(async (resolve, reject) => {
        await axios.post("/todo/gettodolists", {
          owner: this.user.email
        })
        .then((res) => {
          this.todolists = res.data;
          this.doingLists = this.todolists.filter(lists => {
            return lists.isDone === false;
          })
          this.doneLists = this.todolists.filter(lists => {
            return lists.isDone === true;
          })

          resolve();
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        })
      })
    },
    async createTodo (todoData) {
      return new Promise(async (resolve, reject) => {
        await axios.post("/todo/addtodo/", todoData)
        .then((res) => {
          this.systemMsg = res.data.msg;
          this.getTodolists();
          resolve();
        })
        .catch((err) => {
          this.systemMsg = err.response.data.msg;
          reject(err);
        })
      })
    },
    editTodo (field, id, value) {
      return new Promise(async (resolve, reject) => {
        await axios.put("/todo/", {
          id: id,
          field: field,
          value: value,
        })
        .then((res) => {
          this.systemMsg = res.data.msg;
          this.getTodolists();
          resolve();
        })
        .catch((err) => {
          this.systemMsg = err.response.data.msg;
          console.log(err);
          reject(err);
        })
      })
    },
    deleteTodo (id) {
      return new Promise(async (resolve, reject) => {
        await axios.delete(`/todo/${id}`)
        .then((res) => {
          this.systemMsg = res.data.msg;
          this.getTodolists();
          resolve();
        })
        .catch((err) => {
          this.systemMsg = err.response.data.msg;
          reject(err);
        })
      })
    },
  },
});
