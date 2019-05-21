// pages/bind_company/bind_company.js
const app = getApp();
const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
const picUrl = app.globalData.imgUrl;
const iconUrl = app.globalData.iconUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: iconUrl,
    cardId: "",
    radio: [],
    inputVal: "",
    autoFocus: true,
    isWarning: true,
    // picUrl: picUrl,
    // status: "",
    // backBtn: "返回",
    // info: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cardId = options.card_id
    this.setData({
      cardId: cardId,
      inputVal: ""
    })
  },

  blursearch: function (e) {
    // console.log('e', e.detail.value);
    let that = this
    that.setData({
      autoFocus: false,
    });
  },
  //input框聚焦
  inputfocus: function (e) {

  },
  //联想
  inputsearch(e) {
    // console.log('e', e.detail.value);
    let that = this
    // 如果输入框有内容，展示联想
    if (e.detail.value) {
      that.setData({
        inputVal: e.detail.value,
        autoFocus: true
      });
      that.sub()
    } else {}
  },

  // blur: function (e) {
  //   this.setData({
  //     inputVal: e.detail.value
  //   })
  // },
  // bindinput: function (e) {
  //   this.setData({
  //     inputVal: e.detail.value
  //   })
  // },
  sub: function () {
    let [that, token, eVal, url] = [this, wx.getStorageSync("uid"), this.data.inputVal, dataUrl + "/Api/Member/getCompanyList"]
    let params = {
      keywords: eVal
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        // console.log("res", res)
        if (res.data.code == 0) {
          let resData = res.data.data
          that.setData({
            radio: resData
          })
        } else {
          // let resData = res.data.data
          // wx.showModal({
          //   title: '提示',
          //   content: resData,
          //   // cancelText: "暂不使用",
          //   // confirmText: "我要申请",
          //   success(res) {
          //     if (res.confirm) {
          //       // wx.navigateTo({
          //       //   url: '/pages/enterpriseStatus/enterpriseStatus',
          //       // })
          //     } else if (res.cancel) {

          //     }
          //   }
          // })
        }
        // if (res.data.code === 0) {
        //   let [resData, cardList] = [res.data.data, that.data.cardList]
        //   for (let i = 0, len = resData.length; i < len; i++) {
        //     if (!(resData[i].icon.substring(-1, 2) == "ht")) {
        //       resData[i].icon = picUrl + resData[i].icon
        //       resData[i].listMore = false
        //     }
        //   }
        //   that.setData({
        //     cardList: resData
        //   })

        // }
      }
    })
  },
  bindFormSubmit: function (e) {
    // console.log("e", e)
    let [that, token, url, cardId, bindUid] = [this, wx.getStorageSync('uid'), dataUrl + "/Api/Member/make_card", this.data.cardId, e.detail.value.radio]
    console.log('bindUid', bindUid);

    if (bindUid == '' || null) {
      wx.showToast({
        title: "企业码不能为空",
        icon: 'success',
        duration: 600
      })
      return
    }
    let data = {
      token: token,
      type: 2,
      card_id: cardId,
      bind_uid: bindUid
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("res", data)
        console.log("res", res)
        if (res.data.code === 0) {
          let resData = res.data
          wx.showToast({
            title: resData.msg || "失败",
            icon: 'success',
            duration: 600
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 800)
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
})