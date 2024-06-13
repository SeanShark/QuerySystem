import { defineStore } from "pinia";
import axios from "axios";
import { reactive } from "vue";
import { useQuasar, date, QSpinnerGears } from "quasar";

export const useUserStore = defineStore("datastore", {
  state: () => ({
    authUser: null,
    mainTab: "login",
    $q: useQuasar(),
    axios: axios,
    date: date,
    QSpinnerGears: QSpinnerGears,
    todayDate: date.formatDate(new Date(), "YYYY/MM/DD"),
    isDisabled: false,
    selected: [],
    tableRows: [],
    checkLists: [],
    filteredLists: [],
    fullscreen: false,
    picUploader: null,
    systemMsg: "",
    originalData: null,
    openImageDialog: false,
    btnLoading: false,
    uploadLimit: 5,
    hasPic: false,
    compress: false,
    isCreate: false,
    carouselSlide: 0,
    openCarouselDialog: false,
    picNames: [],
    showSticky2: true,
    openDialog: {
      '-请选择-': false,
      IP: false,
      Phone: false,
      Printer: false,
      Datacenter: false,
      Surveillance: false,
    },
    searchData: {
      type: "-请选择-",
      customer: "-请选择-",
      field: "-请选择-",
      keyword: "",
    },
    types: [
      { label: "-请选择-", value: "-请选择-", disable: true },
      { label: "终端", value: "IP" },
      { label: "耗材", value: "Printer" },
      { label: "电话", value: "Phone" },
      { label: "机房", value: "Datacenter" },
      { label: "监控", value: "Surveillance" },
    ],
    formState: {
      IP: {
        nameError: false,
        ipError: false,
        macError: false,
        errorMsg: "",
      },
      Phone: {
        numberError: false,
        colorError: false,
        panelError: false,
        officeError: false,
        errorMsg: "",
      },
      Printer: {
        brandError: false,
        typeError: false,
        cartridgeError: false,
        colorError: false,
        amountError: false,
        officeError: false,
        errorMsg: "",
      },
      Datacenter: {
        nameError: false,
        ipError: false,
        userError: false,
        errorMsg: "",
      },
      Surveillance: {
        typeError: false,
        ipError: false,
        userError: false,
        pwdError: false,
        errorMsg: "",
      },
    },
    颜色: ["黑色", "青色", "黄色", "红色"],
    颜色对: ["默认", "橙色", "绿色", "蓝色", "棕色"],
    类型: ["主机", "摄像头", "路由交换", "其他"],
  }),

  getters: {
    user: (state) => state.authUser,
    isMobile: (state) => {
      return state.$q.platform.is.mobile || state.$q.screen.lt.sm;
    },
    Data: (state) =>
      reactive({
        IP: {
          _id: "",
          customer: state.searchData.customer,
          姓名: "",
          IP: "",
          MAC: "",
          办公室: "",
          picNames: [],
          备注: "",
          updatedAt: "",
        },
        Printer: {
          _id: "",
          customer: state.searchData.customer,
          品牌: "",
          打印机型号: "",
          硒鼓型号: "",
          颜色: state.颜色[0],
          数量: 0,
          办公室: "",
          picNames: [],
          updatedAt: "",
        },
        Phone: {
          _id: "",
          customer: state.searchData.customer,
          号码: "",
          面板号: "",
          楼层线路: "",
          颜色对: state.颜色对[0],
          办公室: "",
          picNames: [],
          updatedAt: "",
        },
        Datacenter: {
          _id: "",
          customer: state.searchData.customer,
          名称: "",
          IP: "",
          用户名: "",
          密码: "",
          picNames: [],
          备注: "",
          updatedAt: "",
        },
        Surveillance: {
          _id: "",
          customer: state.searchData.customer,
          类型: state.类型[0],
          IP: "",
          用户名: "",
          密码: "",
          picNames: [],
          备注: "",
          updatedAt: "",
        },
      }),
  },
  actions: {
    async verifyUser() {
      return new Promise((resolve, reject) => {
        axios
          .post("/user/verifyuser")
          .then((res) => {
            this.authUser = res.data.user;
            resolve();
          })
          .catch((err) => {
            this.authUser = null;
            reject(err);
          });
      });
    },
    dateAndTime() {
      return this.date.formatDate(Date.now(), "YYYY/MM/DD-HH:mm:ss");
    },
    isValidIPv4(ip) {
      const ipv4Pattern =
        /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      return ipv4Pattern.test(ip);
    },
    clearFormState() {
      const dataType = this.searchData.type;
      for (const prop in this.formState[dataType]) {
        if (this.formState[dataType].hasOwnProperty(prop)) {
          if (prop !== "errorMsg") {
            this.formState[dataType][prop] = false;
          }
        }
      }
    },
    clearData() {
      if (this.searchData.type === "-请选择-" || !this.searchData.type) {
        return;
      }

      for (const prop in this.Data[this.searchData.type]) {
        if (this.Data[this.searchData.type].hasOwnProperty(prop)) {
          if (
            prop !== "customer" &&
            prop !== "颜色" &&
            prop !== "数量" &&
            prop !== "类型" &&
            prop !== "picNames"
          ) {
            this.Data[this.searchData.type][prop] = "";
          } else if (prop === "picNames") {
            this.Data[this.searchData.type][prop] = [];
          }
        }
      }
    },
    dataChanged() {
      for (const prop in this.Data[this.searchData.type]) {
        if (this.Data[this.searchData.type].hasOwnProperty(prop)) {
          if (this.Data[this.searchData.type][prop] !== this.originalData[prop]) {
            return true;
          }
        }
      }
       return false;
    },
    async deleteImg (picname) {
      this.$q.loading.show({
        message: '删除图片中，请稍等...'
      });
      try {
        const res = await this.axios.put('/upload/deleteimg', {
          id: this.Data[this.searchData.type]._id,
          type: this.searchData.type,
          picname: picname,
        })
        // console.log(res);
        if (res.status === 200) {
          //delete the picname from local data.
          const targetIndex = this.tableRows.findIndex((item) => item._id === this.originalData._id);
          const index = this.tableRows[targetIndex].picNames.indexOf(picname);
          this.tableRows[targetIndex].picNames.splice(index, 1);
          this.Data[this.searchData.type].picNames = this.tableRows[targetIndex].picNames;
          this.originalData.picNames = this.tableRows[targetIndex].picNames;
          this.successTip('图片删除成功.');
          this.uploadLimit = 5 - this.Data[this.searchData.type].picNames.length;
        } else {
          this.failureTip('删除失败，请重试.');
        }
        this.$q.loading.hide();
      } catch (err) {
        if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
          // console.log('forceUpdateImg2', err);
          this.failureTip('网络不佳，获取图像超时，请重试');
        } else {
          console.log('deleteImg', err);
        }
        this.$q.loading.hide();
      }
    },
    failureTip(msg) {
      this.$q.notify({
        type: "negative",
        progress: true,
        message: `${msg}`,
      });
    },
    successTip(msg) {
      this.$q.notify({
        type: "positive",
        progress: true,
        message: `${msg}`,
      });
    },
  },
});
