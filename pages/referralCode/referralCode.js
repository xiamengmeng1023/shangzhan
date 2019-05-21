// pages/myCard/myCard.js
const app = getApp();
const dataUrl = app.globalData.url;
const picUrl = app.globalData.imgUrl;
const network = require("../../utils/util.js");
const iconUrl = app.globalData.iconUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: picUrl,
    iconUrl: iconUrl,
    user_realName: "",
    codeDetail: {
      codeimg: picUrl + "/Style/images/applets/img/imgs/expandCard.png",
      codeNum: "M1288506",
      codeName: "admin",
      codePhone: "",
      codeImg: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('名片夹名字', options.user_realName);

    let [that, token, url] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Qrcode/getQrcode"]
    let data = {
      token: token
    }
    // 请求推荐码
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("data", res)
        if (res.data.code == 0) {
          let [codeDetail, resData] = [that.data.codeDetail, res.data.data]
          codeDetail.codeimg = picUrl + resData.qrcode
          codeDetail.codeNum = resData.recommend_code
          codeDetail.codeName = resData.recommend_name || ""
          codeDetail.codePhone = resData.phone || ""
          codeDetail.codeImg = resData.qrcode || ""
          that.setData({
            codeDetail: codeDetail,
            user_realName: options.user_realName
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let sceneId = wx.getStorageSync("uid")
    let shareData = {
      sceneId
    }
    return {
      title: app.globalData.shareText,
      path: '/pages/index/index?shareData=' + JSON.stringify(shareData),
      success: res => {}
    }
  },

})