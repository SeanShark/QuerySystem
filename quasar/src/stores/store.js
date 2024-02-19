import { defineStore } from "pinia";
import axios from "axios";
import { reactive } from "vue";
import { useQuasar, date } from "quasar";

export const useUserStore = defineStore("datastore", {
  state: () => ({
    authUser: null,
    mainTab: "login",
    $q: useQuasar(),
    axios: axios,
    todayDate: date.formatDate(new Date(), "YYYY/MM/DD"),
    isDisabled: false,
    selected: [],
    tableRows: [],
    checkLists: [],
    filteredLists: [],
    initialUpdateData: [],
    fullscreen: false,
    picUploader: null,
    systemMsg: "",
    originalData: null,
    openImageDialog: false,
    btnLoading: false,
    hasPic: false,
    imageId: null,
    imageUrl: null,
    isCreate: false,
    showSticky2: true,
    openDialog: {
      IP: false,
      Phone: false,
      Printer: false,
      Datacenter: false,
      Surveillance: false,
    },
    searchData: {
      type: "",
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
        IPError: false,
        MACError: false,
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
        IPError: false,
        userError: false,
        errorMsg: "",
      },
      Surveillance: {
        typeError: false,
        IPError: false,
        userError: false,
        pwdError: false,
        errorMsg: "",
      },
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
    Data: (state) =>
      reactive({
        IP: {
          _id: "",
          customer: state.searchData.customer,
          姓名: "",
          IP: "",
          MAC: "",
          办公室: "",
          备注: "",
          updatedAt: "",
        },
        Printer: {
          _id: "",
          customer: state.searchData.customer,
          品牌: "",
          打印机: "",
          硒鼓: "",
          颜色: state.colorOptions[0],
          数量: 0,
          办公室: "",
          updatedAt: "",
        },
        Phone: {
          _id: "",
          customer: state.searchData.customer,
          号码: "",
          面板号: "",
          楼层线路: "",
          颜色对: "",
          办公室: "",
          updatedAt: "",
        },
        Datacenter: {
          _id: "",
          customer: state.searchData.customer,
          名称: "",
          IP: "",
          用户名: "",
          密码: "",
          备注: "",
          updatedAt: "",
        },
        Surveillance: {
          _id: "",
          customer: state.searchData.customer,
          类型: state.surveillanceTypes[0],
          IP: "",
          用户名: "",
          密码: "",
          备注: "",
          hasPic: false,
          updatedAt: "",
        },
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
          if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
            // console.log('forceUpdateImg2', err);
            this.failureTip('登录超时，请重试')
          } else {
            console.log('getToken', err);
          }
        });
    },
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
    ipFormValidate() {
      if (!this.Data.IP.姓名) {
        this.formState.IP.nameError = true;
        this.formState.IP.errorMsg = "使用人不能为空";
        return false;
      } else {
        this.formState.IP.nameError = false;
      }

      if (!this.isValidIPv4(this.Data.IP.IP)) {
        this.formState.IP.errorMsg = "请输入合法IPv4地址";
        this.formState.IP.IPError = true;
        return false;
      } else {
        this.formState.IP.IPError = false;
      }

      if (this.Data.IP.MAC.length === 0) {
        this.formState.IP.MACError = true;
        this.formState.IP.errorMsg = "该区域不能为空";
        return false;
      } else {
        this.formState.IP.MACError = false;
      }

      this.clearFormState();
      return true;
    },
    printerFormValidate() {
      if (!this.Data.Printer.品牌) {
        this.formState.Printer.errorMsg = "请输入品牌";
        this.formState.Printer.brandError = true;
        return false;
      } else {
        this.formState.Printer.brandError = false;
      }
      if (!this.Data.Printer.打印机) {
        this.formState.Printer.errorMsg = "请输入打印机型号";
        this.formState.Printer.typeError = true;
        return false;
      } else {
        this.formState.Printer.typeError = false;
      }
      if (!this.Data.Printer.硒鼓) {
        this.formState.Printer.errorMsg = "请输入硒鼓型号";
        this.formState.Printer.cartridgeError = true;
        return false;
      } else {
        this.formState.Printer.cartridgeError = false;
      }
      if (!this.Data.Printer.颜色) {
        this.formState.Printer.errorMsg = "请输入颜色";
        this.formState.Printer.colorError = true;
        return false;
      } else {
        this.formState.Printer.colorError = false;
      }
      if (this.Data.Printer.数量.length === 0) {
        this.formState.Printer.errorMsg = "请输入数量";
        this.formState.Printer.amountError = true;
        return false;
      } else {
        this.formState.Printer.amountError = false;
      }
      if (typeof this.Data.Printer.数量 !== "number") {
        this.formState.Printer.errorMsg = "请输入数量";
        this.formState.Printer.amountError = true;
        return false;
      } else {
        this.formState.Printer.colorError = false;
      }
      if (!this.Data.Printer.办公室) {
        this.formState.Printer.errorMsg = "请输入所在办公室";
        this.formState.Printer.officeError = true;
        return false;
      } else {
        this.formState.Printer.officeError = false;
      }
      this.clearFormState();
      return true;
    },
    phoneFormValidate() {
      const number = this.Data.Phone.号码;

      if (typeof number !== "number") {
        this.formState.Phone.errorMsg = "请输入数字";
        this.formState.Phone.numberError = true;
        return false;
      } else {
        this.formState.Phone.numberError = false;
      }

      if (number < 10000000 || number > 100000000) {
        this.formState.Phone.errorMsg = "请输入8位号码";
        this.formState.Phone.numberError = true;
        return false;
      } else {
        this.formState.Phone.numberError = false;
      }

      if (this.Data.Phone.面板号.length === 0) {
        this.formState.Phone.errorMsg = "面板号不能为空";
        this.formState.Phone.panelError = true;
        return false;
      } else {
        this.formState.Phone.panelError = false;
      }

      if (!this.Data.Phone.办公室) {
        this.formState.Phone.errorMsg = "办公室不能为空";
        this.formState.Phone.officeError = true;
        return false;
      } else {
        this.formState.Phone.officeError = false;
      }
      this.clearFormState();
      return true;
    },
    datacenterFormValidate() {
      if (!this.Data.Datacenter.名称) {
        this.formState.Datacenter.errorMsg = "请输入名称";
        this.formState.Datacenter.nameError = true;
        return false;
      } else {
        this.formState.Datacenter.nameError = false;
      }
      if (!this.isValidIPv4(this.Data.Datacenter.IP)) {
        this.formState.Datacenter.errorMsg = "请输入合法IPv4地址";
        this.formState.Datacenter.IPError = true;
        return false;
      } else {
        this.formState.Datacenter.IPError = false;
      }
      if (!this.Data.Datacenter.用户名) {
        this.formState.Datacenter.errorMsg = "请输入用户名";
        this.formState.Datacenter.userError = true;
        return false;
      } else {
        this.formState.Datacenter.userError = false;
      }

      this.clearFormState();
      return true;
    },
    surveillanceFormValidate() {
      if (!this.Data.Surveillance.类型) {
        this.formState.Surveillance.errorMsg = "请输入名称";
        this.formState.Surveillance.typeError = true;
        return false;
      } else {
        this.formState.Surveillance.typeError = false;
      }
      if (!this.isValidIPv4(this.Data.Surveillance.IP)) {
        this.formState.Surveillance.errorMsg = "请输入合法IPv4地址";
        this.formState.Surveillance.IPError = true;
        return false;
      } else {
        this.formState.Surveillance.IPError = false;
      }
      if (!this.Data.Surveillance.用户名) {
        this.formState.Surveillance.errorMsg = "请输入用户名";
        this.formState.Surveillance.userError = true;
        return false;
      } else {
        this.formState.Surveillance.userError = false;
      }
      if (!this.Data.Surveillance.密码) {
        this.formState.Surveillance.errorMsg = "请输入用户名";
        this.formState.Surveillance.pwdError = true;
        return false;
      } else {
        this.formState.Surveillance.pwdError = false;
      }

      this.clearFormState();
      return true;
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
            prop !== "hasPic"
          ) {
            this.Data[this.searchData.type][prop] = "";
          }
        }
      }
    },
    dataChanged() {
      for (const prop in this.Data[this.searchData.type]) {
        if (this.Data[this.searchData.type].hasOwnProperty(prop)) {
          if (this.Data[this.searchData.type][prop] !== this.initialUpdateData[prop]) {
            return true;
          }
        }
      }
       return false;
    },
    async getImage() {
      // console.log('getImage1',this.Data[this.searchData.type]._id);
      // console.log('getImage2',this.searchData.type);
      if (
        this.imageId === this.Data[this.searchData.type]._id &&
        this.Data[this.searchData.type]._id !== ""
      ) {
        return;
      }
      if (!this.Data[this.searchData.type].hasPic) {
        this.imageId = null;
        this.imageUrl = null;
        return;
      }
      await this.forceUpdateImg();
    },
    async forceUpdateImg(t, i) {
      let type, id;
      //update mode nerver send params
      if (t && i){
        type = t;
        id = i;
      }
      else {
        type = this.searchData.type;
        id = this.Data[this.searchData.type]._id;
      }
      // console.log(type, this.Data[this.searchData.type]);
      if (!type || !id) {
        return this.failureTip('获取图片参数错误');
      }

      //distinguish between the update and view mode.
      if(id === this.imageId && t && i && !this.imageUrl) {
        return;
      }

      this.$q.loading.show({
        message: "正在加载图片，请稍后...",
      });

      await this.axios.get("/upload/imgs", {
          params: {
            type: type,
            id: id,
          },
        })
        .then((res) => {
          try {
            this.imageId = res.data.id;
            this.imageUrl = null;
            const bufferData = res.data.buffer.data;
            const blob = new Blob([new Uint8Array(bufferData)], {
              type: "image/png",
            });

            // Create a data URL using FileReader
            const fileReader = new FileReader();
            fileReader.onload = () => {
              const base64Image = fileReader.result;
              this.imageUrl = base64Image;
            };
            fileReader.readAsDataURL(blob);
          } catch (error) {
            console.log('forceUpdateImg1', error);
            // this.failureTip()
          }
        })
        .catch((err) => {
          if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
            // console.log('forceUpdateImg2', err);
            this.failureTip('网络不佳，获取图像超时，请重试')
          } else {
            console.log('forceUpdateImg', err);
          }
          this.imageUrl = null;
          this.imageId = null;
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },
    
    async deleteImg () {
      this.$q.loading.show({
        message: '删除图片中，请稍等...'
      });
      try {
        const res = await this.axios.put('/upload/deleteimg', {
          id: this.Data[this.searchData.type]._id,
          type: this.searchData.type,
        })
        // console.log(res);
        if (res.status === 200) {
          this.Data[this.searchData.type].hasPic = false;
          const targetIndex = this.tableRows.findIndex((item) => item._id === this.originalData._id);
          this.tableRows[targetIndex].hasPic = false;
          this.originalData.hasPic = false;
          this.imageUrl = null;
          this.successTip('图片删除成功.')
        } else {
          this.failureTip('删除失败，请重试.')
        }
        this.$q.loading.hide();
      } catch (err) {
        if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
          // console.log('forceUpdateImg2', err);
          this.failureTip('网络不佳，获取图像超时，请重试')
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
