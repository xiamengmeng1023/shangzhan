// pages/mine/mine.js
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
    picUrl: picUrl,
    iconUrl: iconUrl,
    text: "制作",
    phone: "",
    // vip状态
    isVip: 0,
    is_company_member: 0,
    alliance_status: 0,
    isOpenVip: 0,
    isOpenAlliance: 0,
    isOpenCompany: 0,
    isMark: 0,
    userImgUrl: '',
    isIndex: 1,
    list: [{
        icon: '/imgs/my-order.png',
        text: '订单',
        url: '/pages/order/order'
      },
      {
        icon: '/imgs/my-shopCar.png',
        text: '购物车',
        url: '/pages/Shopping_Cart/Shopping_Cart'

      },
      {
        icon: '/imgs/qym.png',
        text: '企业码',
        url: "/pages/enterpriseSta/enterpriseSta",

      },
      {
        icon: '/imgs/my-ticket.png',
        text: '券包',
        url: '/pages/ticketBag/ticketBag'
      },
      {
        icon: '/imgs/my-cash.png',
        text: '钱包',
        url: '/pages/wallet/wallet'

      },
      {
        icon: '/imgs/my-appCenter.png',
        text: '应用中心'
      },
      {
        icon: '/imgs/my-collection.png',
        text: '收藏',
        url: '/pages/collect/collect'

      },
      {
        icon: '/imgs/my-setting.png',
        text: '设置',
        url: '/pages/setting/setting'
      },
    ]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.globalData);
  },
  onShow: function () {
    let [
      that,
      token,
      url,
      isVipUrl
    ] = [
      this,
      wx.getStorageSync("uid"),
      dataUrl + "/Api/Member/index",
      dataUrl + "/Api/Member/isVip"
    ]
    let data = {
      token: token
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        if (res.data.code == 0) {
          let resData = res.data.data
          wx.setStorageSync("isVip", resData.is_vip)
          that.setData({
            phone: resData.phone || "",
            isVip: resData.is_vip,
            isOpenVip: resData.isOpenVip,
            isOpenAlliance: resData.isOpenAlliance,
            isOpenCompany: resData.isOpenCompany,
            isMark: resData.isMakeCard
          })
          if (that.data.isMark !== 0) {
            that.setData({
              text: "查看"
            })
          }
        }
      },
      fail: res => {
        console.log(res)
      }
    })
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

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function () {
  //   let [
  //     that,
  //     token,
  //     url,
  //     isBindUrl
  //   ] = [
  //     this,
  //     wx.getStorageSync('uid'),
  //     dataUrl + "/Api/Member/make_card",
  //     dataUrl + "/Api/Member/isBind"
  //   ]
  //   let data1 = {
  //     token: token
  //   }
  //   network.POST({
  //     params: data1,
  //     url: isBindUrl,
  //     success: res => {
  //       console.log("res", res)
  //       if (res.data.code === 0) {
  //         let [resData] = [res.data.data]
  //         if (resData.is_bind == 1 || resData.is_bind == 2) {
  //           let info = {}
  //           info.bindUid = resData.bind_uid
  //           info.Isbind = resData.is_bind
  //           that.setData({
  //             IsBind: false,
  //             info: info
  //           })
  //         } else {
  //           that.setData({
  //             IsBind: true
  //           })
  //         }
  //       }
  //     },
  //     fail: res => {
  //       console.log(res)
  //     }
  //   })


  //   let data = {
  //     token: token,
  //     type: 1
  //   }
  //   network.POST({
  //     params: data,
  //     url: url,
  //     success: res => {
  //       console.log("res", res)
  //       if (res.data.code === 0) {
  //         let [resData] = [res.data.data]
  //         that.setData({
  //           cardId: resData.id
  //         })
  //         if (resData.status == 1) {
  //           wx.showModal({
  //             title: '提示',
  //             content: '你已制作过名片',
  //             showCancel: false,
  //             success(res) {
  //               if (res.confirm) {
  //                 wx.navigateBack({
  //                   delta: 1
  //                 })
  //               }
  //             }
  //           })
  //         }
  //       }
  //     },
  //     fail: res => {
  //       console.log(res)
  //     }
  //   })
  // },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 自定义方法
  ml_clickHidden() {
    if (this.data.isDownOrUp) {
      this.setData({
        isDownOrUp: false
      })
    } else {
      this.setData({
        isDownOrUp: true

      })
    }
  },
  explain() {
    wx.navigateTo({
      url: '/pages/explain/explain'
    })
  },
  goToMyIdentity() {
    wx.navigateTo({
      url: '/pages/myIdentity/myIdentity'
    })
  },
  goToReferralCode() {
    wx.navigateTo({
      url: '/pages/referralCode/referralCode'
    })
  },
  // 点击去制作名片
  makeShopTap() {

    wx.navigateTo({
      url: '/pages/BusinessCardsMX/BusinessCardsMX',
    })
    // let [that, token, url] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Member/is_make_card"]
    // let data = {
    //   token: token
    // }
    // network.POST({
    //   params: data,
    //   url: url,
    //   success: res => {
    //     // is_make_card  0：未填写   1 :填写
    //     // console.log("制作名片res", res);
    //     if (res.data.code == 0) {
    //       if (res.data.data.is_vip == 0 || res.data.data.vip_expired_status == 0) {
    //         wx.showModal({
    //           title: '提示',
    //           content: '目前你不是环保使者',
    //           success(res) {
    //             if (res.confirm) {
    //               wx.navigateTo({
    //                 url: '/pages/myIdentity/myIdentity',
    //               })
    //             }
    //           }
    //         })
    //       } else {
    //         if (res.data.data.is_make_card == 0) {
    //           wx.showModal({
    //             title: '提示',
    //             content: '你还没有填写基本资料，是否前往填写',
    //             success(res) {
    //               if (res.confirm) {
    //                 wx.navigateTo({
    //                   url: '/pages/basicInfo/basicInfo',
    //                 })
    //               }
    //             }
    //           })
    //         } else {
    //           wx.navigateTo({
    //             url: '/pages/BusinessCardsMX/BusinessCardsMX',
    //           })
    //         }
    //       }
    //     }
    //   },
    //   fail: res => {
    //     console.log("res", res)
    //   }
    // })
  },
  go(e) {
    wx.navigateTo({
      url: this.data.list[e.currentTarget.dataset.index].url,
    })
  },
  GoToBasicInfo() {
    wx.navigateTo({
      url: "/pages/basicInfo/basicInfo"
    })
  }
})