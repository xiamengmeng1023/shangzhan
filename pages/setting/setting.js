// pages/setting/setting.js
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
    status: "",
    isRealName: true,
    isOpenCompany: 0,
    phoneNum: '',
    is_password: 1
    // list: [{
    //     name: '实名认证',
    //     url: '/pages/realNameAuthentication/realNameAuthentication'
    //   },
    //   {
    //     name: '手机绑定',
    //     url: '/pages/bindPhone/bindPhone'
    //   },
    //   {
    //     name: '支付密码',

    //     url: "/pages/Set_password/Set_password"
    //   },
    //   {
    //     name: '收货地址',
    //     url: '/pages/receiptAddress/receiptAddress'
    //   },
    //   {
    //     name: '商栈客服',
    //     url: '/pages/customer_service/customer_service'
    //   },
    //   {
    //     name: '关于我们',
    //     url: '/pages/aboutUs/aboutUs'
    //   },
    // ]
  },

  /**
   * 生命周期函数--监听页面加载
   */


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let [that, url, token] = [this, dataUrl + "/Api/Member/idCard", wx.getStorageSync('uid')]
    let data1 = {
      token: token,
      type: 1
    }
    network.POST({
      params: data1,
      url: url,
      success: res => {
        if (res.data.code == 0) {
          let resData = res.data.data
          // console.log('resData.status', resData.status);

          if (resData == '') {
            that.setData({
              isRealName: false
            })
            return
          }

          that.setData({
            is_password: resData.is_password
          })

          if (resData.phone !== '') {
            that.setData({
              phoneNum: resData.phone
            })
          }
          console.log('Number(resData.status)', Number(resData.status))
          let status = Number(resData.status)
          if (status == 1) {
            that.setData({
              isRealName: true
            })

          } else if (status == 0 || 2 || 3) {
            that.setData({
              isRealName: false
            })
          }

          // switch (Number(resData.status)) {
          //   case 0:
          //     that.setData({
          //       isRealName: false
          //     })
          //     break;
          //   case 1:
          //     that.setData({
          //       isRealName: true
          //     })
          //     break;
          //   case 2:
          //     that.setData({
          //       isRealName: false
          //     })
          //     break;
          //   case 3:
          //     that.setData({
          //       isRealName: false
          //     })
          //     break;
          // }
        }
      },
      fail: res => {
        console.log(res.data)
      }
    })
  },

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
  go(e) {
    wx.navigateTo({
      url: this.data.list[e.currentTarget.dataset.index].url,
    })
  },

  realNameTap: function () {
    // let [realName] = [wx.getStorageSync("realName")]
    // if (parseInt(realName) === 0 || parseInt(realName) === 1) {
    //   wx.navigateTo({
    //     url: '/pages/realNamereSult/realNamereSult',
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '/pages/realName/realName',
    //   })
    // }
    let [token, url] = [wx.getStorageSync("uid"), dataUrl + "/Api/Member/idCard"]
    let params = {
      token: token,
      type: 1
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        if (res.data.code == 0) {
          let resData = res.data.data
          console.log("res", resData)
          switch (resData.status) {
            case '0':
              wx.navigateTo({
                url: '/pages/realNameAuthentication/realNameAuthentication',
              })
              break;
            case '1':
              wx.navigateTo({
                url: '/pages/realNamereSult/realNamereSult',
              })
              break;
            case '2':
              wx.navigateTo({
                url: '/pages/realNamereSult/realNamereSult',
              })
              break;
            case '3':
              wx.navigateTo({
                url: '/pages/realNamereSult/realNamereSult',
              })
              break;
          }
        }
      },
      fail: res => {
        console.log("fail", res)
      }
    })
  },

  enterpriseTap: function () {
    let [that, token, url] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Member/companyOrder"]
    let data = {
      token: token
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("resData", data)
        console.log("res", res)
        if (res.data.code == 0) {
          let resData = res.data.data
          if (resData.length > 0) {
            wx.navigateTo({
              url: '/pages/enterpriseSta/enterpriseSta',
            })
          } else {
            wx.navigateTo({
              url: '/pages/enterpriseStatus/enterpriseStatus',
            })
          }
        } else {
          wx.navigateTo({
            url: '/pages/enterpriseStatus/enterpriseStatus',
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  onLoad(options) {
    let isOpenCompany = options.isOpenCompany
    this.setData({
      isOpenCompany: isOpenCompany
    })
  }
})