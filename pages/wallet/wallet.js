// pages/wallet/wallet.js
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
      time: '',
      init: {},
   },

   // 提现
   cash_money() {
      let [balance, token, url] = [this.data.init.balance, wx.getStorageSync("uid"), dataUrl + "/Api/Member/idCard"]
      let params = {
         token: token,
         type: 1,
         // token: 1,
         // app_id: 'wxde059b418de529cd',
      }
      network.POST({
         params: params,
         url: url,
         success: res => {
            if (res.data.code == 0) {
               let resData = res.data.data
               switch (Math.floor(resData.status)) {
                  case 0:
                     wx.showModal({
                        title: '友情提示',
                        content: '您当前还没有实名认证，是否前往认证',
                        showCancel: true, //是否显示取消按钮
                        success: res => {
                           if (res.confirm) {
                              wx.navigateTo({
                                 url: '/pages/realNameAuthentication/realNameAuthentication',
                              })
                           }
                        }
                     })
                     break;
                  case 1:
                     if (balance > 0) {
                        wx.navigateTo({
                           url: '/pages/myWalletDetail/myWalletDetail?num=' + this.data.init.balance,
                        })
                     } else {
                        wx.showModal({
                           title: '提示',
                           content: '当前账户余额不足，无法提现',
                           showCancel: false,
                           success(res) {

                           }
                        })
                     }
                     break;
                  case 2:
                     wx.showModal({
                        title: '友情提示',
                        content: '实名认证失败，请重新填写',
                        success: res => {
                           if (res.confirm) {
                              wx.navigateTo({
                                 url: '/pages/realName/realName',
                              })
                           }
                        }
                     })
                     break;
                  case 3:
                     wx.showModal({
                        title: '友情提示',
                        content: '实名认证审核中...',
                        success: res => {
                           if (res.confirm) {}
                        }
                     })
                     break;
               }
            }
         },
         fail: res => {
            console.log("rfail", res)
         }
      })
   },


   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      //this.getTime()
   },
   getTime: function () {
      var time = network.formatTime(new Date())
      console.log(time)
      //为页面中time赋值
      this.setData({
         time: time
      })
      //打印
      // console.log(time)
   },


   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function () {

   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function () {
      let [that, url, token] = [this, dataUrl + "/Api/Member/my_purse", wx.getStorageSync("uid")]
      let data = {
         token: token,
         // token: 1,
         // app_id: 'wxde059b418de529cd'
      }
      network.POST({
         params: data,
         url: url,
         success: res => {
            if (res.data.code == 0) {
               let resData = res.data.data
               if (resData.balance === null) {
                  resData.balance = 0
               }
               that.setData({
                  init: resData
               })
            }
         },
         fail: res => {
            console.log(res)
         }
      })
   },
   goToHistoryOfWithdrawal() {
      wx.navigateTo({
         url: '/pages/HistoryOfWithdrawal/HistoryOfWithdrawal'
      })
   },
   goToRed() {
      wx.navigateTo({
         url: '/pages/redPacketRecord/redPacketRecord'
      })
   },

})