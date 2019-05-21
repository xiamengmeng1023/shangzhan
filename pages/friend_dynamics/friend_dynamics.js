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
    cardId: '',
    iconUrl: iconUrl,
    clickZanStatus: true,
    dList: [], //动态列表
    likeList: [],
    page: 2,
    rows: 5,
    isVip: 0,
    is_company_member: 0,
    alliance_status: 0
  },

  onLoad: function (options) {


  },

  onShow: function () {
    let [
      that,
      token,
      isVipUrl
    ] = [
      this,
      wx.getStorageSync("uid"),
      dataUrl + "/Api/Member/isVip"
    ]
    let data = {
      token: token
    }

    // 请求数据是否是vip及等级
    network.POST({
      params: data,
      url: isVipUrl,
      success: res => {
        if (res.data.code == 0) {
          console.log('isVip', res);
          let isVipData = res.data.data
          if (isVipData.is_vip == '1' || isVipData.is_vip == 1) {
            that.setData({
              isVip: 1
            })
          } else if (isVipData.is_company_member == '1' || isVipData.is_company_member == 1) {
            that.setData({
              is_company_member: 1
            })
          } else if (isVipData.alliance_status == '1' || isVipData.alliance_status == 1) {
            that.setData({
              alliance_status: 1
            })
          }
          // wx.setStorageSync("isVip", resData.is_vip)
          // that.setData({
          //   phone: resData.phone || "",
          //   isVip: resData.is_vip,
          //   isOpenVip: resData.isOpenVip,
          //   isOpenAlliance: resData.isOpenAlliance,
          //   isOpenCompany: resData.isOpenCompany,
          //   isMark: resData.isMakeCard
          // })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
    this.getDynamiclist()


  },


  onUnload: function () {
    // if (timer != null) {
    //   cancelAnimationFrame(timer);
    // }
  },

  // 获取动态列表
  getDynamiclist() {
    let [that, token, url] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Dynamic/dynamic_list"]
    let data = {
      token: token,
      // token: 1642,
      // app_id: 'wxde059b418de529cd',
      page: 1,
      list_rows: 5
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        if (res.data.code == 0) {

          let resData = res.data.data
          // console.log('朋友动态数据', resData);
          that.setData({
            cardId: resData.card_id
          })
          if (Array.isArray(resData.data)) {
            that.setData({
              dList: resData.data,
              cardId: resData.card_id
            })
          }

        }
      },
      fail: res => {
        console.log("resfail", res)
      }
    })
  },

  goTodaetails(e) {
    wx.navigateTo({
      url: `/pages/friend_dynamics_details/friend_dynamics_details?id=${e.currentTarget.dataset.id}`
    })
  },
  // 点赞
  onClickImage: function (e) {
    let [
      that,
      url,
      token,
      type,
      id
    ] = [
      this,
      dataUrl + "/Api/Dynamic/addlike",
      wx.getStorageSync("uid"),
      e.currentTarget.dataset.type,
      e.currentTarget.dataset.id
    ]

    let params = {
      token: token,
      // token: 1642,
      // app_id: 'wxde059b418de529cd',
      dynamic_id: id,
      type: type
    }
    if (type == 1) {
      network.POST({
        params: params,
        url: url,
        success: res => {
          if (res.data.code == 0) {
            wx.showToast({
              title: '点赞成功',
              icon: 'success',
              duration: 800
            })
            that.getDynamiclist()
            // that.setData({
            //   style_img: 'transform:scale(1.5);'
            // })
            // setTimeout(() => {
            //   that.setData({
            //     style_img: 'transform:scale(1.3);'
            //   })
            // }, 200)
            // setTimeout(() => {
            //   that.setData({
            //     style_img: 'transform:scale(1);'
            //   })
            // }, 400)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 800
            })
          }
        },
        fail: res => {
          console.log("fail", res)
        }
      })
    }
    if (type == 2) {
      network.POST({
        params: params,
        url: url,
        success: res => {
          if (res.data.code == 0) {
            wx.showToast({
              title: '取消点赞',
              icon: 'success',
              duration: 800
            })
            that.getDynamiclist()
            // that.setData({
            //   style_img: 'transform:scale(1.5);'
            // })
            // setTimeout(() => {
            //   that.setData({
            //     style_img: 'transform:scale(1.3);'
            //   })
            // }, 200)
            // setTimeout(() => {
            //   that.setData({
            //     style_img: 'transform:scale(1);'
            //   })
            // }, 400)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 800
            })
          }
        },
        fail: res => {
          console.log("fail", res)
        }
      })
    }
    // this.startTimer();

  },

  // 去发布动态
  senddyc() {
    wx.navigateTo({
      url: "/pages/sendDyc/sendDyc",
    });
  },
  onReachBottom: function () {
    this.dListAdd()
  },
  dListAdd: function () {
    let [
      that,
      token,
      page,
      rows,
      url
    ] = [
      this,
      wx.getStorageSync("uid"),
      this.data.page,
      this.data.rows, dataUrl + "/Api/Dynamic/dynamic_list"
    ]
    let data = {
      token: token,
      page: page,
      list_rows: rows
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        if (res.data.code == 0) {
          let resData = res.data.data
          that.setData({
            cardId: resData.card_id
          })
          if (resData.data.length > 0) {
            page++
            that.setData({
              dList: that.data.dList.concat(resData.data),
              page: page
            })
          } else {
            this.setData({
              loadShow: false
            })
          }
        }
      },
      fail: res => {
        console.log("resfail", res)
      }
    })
  }
})