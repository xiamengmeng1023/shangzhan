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
    user_realName: "",
    iconUrl: iconUrl,
    IsShow: false,
    someData: {
      cardList: [],
      MyCard: []
    },
    cardId: '',
    notice: {
      title: "暂无通知",
    },
  },
  ready() {
    this.getbussness()
    this.getMyCardId()
  },

  methods: {
    // 这里是一个自定义方法
    getbussness() {
      let [that, token, getMyCardUrl, isVip] = [this, wx.getStorageSync('uid'), dataUrl + "/Api/Cardlist/getMyCard", wx.getStorageSync('isVip')]
      if (isVip === "1") {
        that.setData({
          IsShow: false
        })
      } else {
        that.setData({
          IsShow: true
        })
      }
      let data = {
        token: token,
        order_status: 0,
      }
      // 微名片请求
      network.POST({
        params: data,
        url: getMyCardUrl,
        success: res => {
          // console.log("微名片请求", res);
          if (res.data.code === 0) {
            let resData = res.data.data
            // console.log('resData', resData[0]);
            // resData[0].name= ''
            that.setData({
              MyCard: resData,
              user_realName: resData[0].real_name
            })
            // console.log("user_realName", that.data.user_realName);
          }
        },
        fail: res => {
          console.log(res)
        }
      })
    },
    goToCardDetails() {
      wx.navigateTo({
        url: `/pages/card_details/card_details?cardid=${this.data.cardId}`
      });
    },
    // 获取我的名片id
    getMyCardId() {
      let [that, token, cardListUrl, isVip] = [this, wx.getStorageSync('uid'), dataUrl + "/Api/Cardlist/getMyCard", wx.getStorageSync('isVip')]
      if (isVip === "1") {
        that.setData({
          IsShow: false
        })
      } else {
        that.setData({
          IsShow: true
        })
      }
      let data = {
        token: token
      }
      network.POST({
        params: data,
        url: cardListUrl,
        success: res => {
          if (res.data.code === 0) {
            let resData = res.data.data
            // console.log('cardId222222222222', resData[0].id);
            that.setData({
              cardId: resData[0].id
            })
          }
        },
        fail: res => {
          console.log(res)
        }
      })
    },
  }
})