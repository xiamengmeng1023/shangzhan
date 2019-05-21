// pages/friend_dynamics/friend_dynamics.js
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
    picUrl: picUrl,
    style_img: '',
    iconUrl: iconUrl,
    clickZanStatus: true,
    cardId: "",
    userInfo: {}, //用户信息
    IsToken: true,
    dList: [], //动态列表
    likeList: [],


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("options", options)
    let cardId = options.cardId || 0
    this.setData({
      cardId: cardId
    })
  },

  onShow() {
    let [
      that,
      token,
      cardId,
      url,
      getMemberinfoUrl
    ] = [
      this,
      wx.getStorageSync("uid"),
      this.data.cardId,
      dataUrl + "/Api/Dynamic/my_dynamic_list",
      dataUrl + "/Api/Dynamic/getMemberinfo"
    ]
    let data = {
      token: token,
      // token: 1642,
      // app_id: 'wxde059b418de529cd',
      cardid: cardId
    }
    // 动态列表
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("res", res)
        if (res.data.code == 0) {
          let resData = res.data.data
          for (let i = 0, len = resData.length; i < len; i++) {
            let time = new Date(resData[i].addtime)
            resData[i].month = time.getMonth() + 1
            resData[i].date = time.getDate()
          }
          console.log("resData", resData)
          that.setData({
            dList: resData
          })
        } else {
          that.setData({
            dList: []
          })
        }
      },
      fail: res => {
        console.log("resfail", res)
      }
    })
    // 基本信息
    network.POST({
      params: data,
      url: getMemberinfoUrl,
      success: res => {
        // console.log("getMemberinfoUrl", res)
        if (res.data.code == 0) {
          let resData = res.data.data
          that.setData({
            userInfo: resData
          })
          if (token === resData.me_id) {
            that.setData({
              IsToken: true
            })
          } else {
            that.setData({
              IsToken: false
            })
          }
        }
      },
      fail: res => {
        console.log("resfail", res)
      }
    })
  },

  // 删除
  delTap: function (e) {
    console.log("e", e)
    let [that, token, dynamicId, url] = [this, wx.getStorageSync("uid"), e.currentTarget.dataset.id, dataUrl + "/Api/Dynamic/dynamic_del"]
    let data = {
      token: token,
      // token: 1642,
      // app_id: 'wxde059b418de529cd',
      dynamic_id: dynamicId
    }
    wx.showModal({
      title: '温馨提示',
      content: '是否删除此动态？',
      showCancel: true, //是否显示取消按钮
      confirmColor: "#0090FF",
      success(res) {
        if (res.confirm) {
          network.POST({
            params: data,
            url: url,
            success: res => {
              // console.log("res", res)
              // console.log("res", data)
              if (res.data.code == 0) {
                let resData = res.data.data
                wx.showToast({
                  title: "删除成功",
                  duration: 600
                })
                setTimeout(function () {
                  that.onShow()
                }, 800)
              } else {
                wx.showToast({
                  title: "删除失败",
                  icon: 'none',
                  duration: 600
                })
              }
            },
            fail: res => {
              console.log("resfail", res)
            }
          })
        } else if (res.cancel) {}
      }
    })

  },
  //上传背景图
  uploadDynamic: function () {
    if (this.data.IsToken) {
      let [that, url, token] = [this, dataUrl + "/Api/Dynamic/uploadDynamic", wx.getStorageSync('uid')]
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'copmpressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          let tempFilePaths = res.tempFilePaths
          that.setData({
            logoUrl: tempFilePaths
          })
          console.log(token)
          let data1 = {
            token: token,
          }
          wx.uploadFile({
            url: url,
            filePath: tempFilePaths[0],
            header: {
              'content-type': 'json'
            },
            name: 'dynamic_pic',
            formData: data1,
            success: res => {
              let resData = JSON.parse(res.data)
              console.log("logo", resData)

              if (resData.code == 0) {
                wx.showModal({
                  title: '提示',
                  content: '上传成功',
                  showCancel: true, //是否显示取消按钮
                  success(res) {
                    if (res.confirm) {
                      that.onShow()
                    }
                  }
                })
              }
            }
          })
        },
      })
    }

  },
  // 去发布动态
  senddyc() {
    wx.navigateTo({
      url: "/pages/sendDyc/sendDyc",
    });
  },
})