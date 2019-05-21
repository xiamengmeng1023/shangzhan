// pages/component/businessCard/businessCard.js
const app = getApp();
const dataUrl = app.globalData.url;
const network = require("../../../utils/util.js");
const picUrl = app.globalData.imgUrl;
const iconUrl = app.globalData.iconUrl;

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
  },
  data: {
    // 这里是一些组件内部数据
    someData: {
      iconUrl: iconUrl,
      orderList: [],
      isShowOrder: true
    }
  },
  ready() {
    this.order()
  },
  methods: {
    // 订单请求
    order() {
      console.log('订单请求');
      let [that, token, orderUrl, isVip] = [this, wx.getStorageSync('uid'), dataUrl + "/Api/Member/order_list", wx.getStorageSync('isVip')]
      // console.log('order订单方法执行了');
      let orderParams = {
        token: 1
      }
      network.POST({
        params: orderParams,
        url: orderUrl,
        success: res => {
          if (res.data.code == 0) {
            let resData = res.data
            console.log("订单resData", resData)
            that.setData({
              orderList: resData,
              isShowOrder: true
            })
          } else {
            that.setData({
              isShowOrder: false
            })
          }
        },
        fail: res => {
          console.log("fail", res)
        }
      })
    }
  }
})