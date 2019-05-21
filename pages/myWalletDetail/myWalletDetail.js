const app = getApp();
const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
Page({

   /**
    * 页面的初始数据
    */
   data: {
      balance: 0,
      brokerage: '',
   },

   // 提现金额输入
   withdraw_num(e) {
      this.setData({
         brokerage: e.detail.value
      })
   },

   // 申请提现
   apply_cash() {
      if (this.data.brokerage > parseFloat(this.data.balance)) {
         wx.showModal({
            title: '提示',
            content: '输入金额不能大于可提现金额',
            showCancel: false,
            success(res) {

            }
         })
      } else if (this.data.brokerage <= 0) {
         wx.showModal({
            title: '提示',
            content: '请输入有效的提现金额',
            showCancel: false,
            success(res) {

            }
         })
      }
      let [url, token] = [dataUrl + "/Api/Member/cash_withdrawal", wx.getStorageSync("uid")]
      let data = {
         token: 1,
         brokerage: this.data.brokerage,
         form_id: 'the formId is a mock one',
         // app_id: 'wxde059b418de529cd',
      }
      network.POST({
         params: data,
         url: url,
         success: res => {
            if (res.data.code == 0) {
               wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 600
               })
               setTimeout(function () {
                  wx.navigateBack({
                     delta: 1
                  })
               }, 800)
            } else if (res.data.code == 402) {
               wx.showModal({
                  title: '友情提示',
                  content: res.data.data,
                  success: res => {
                     if (res.confirm) {
                        wx.navigateTo({
                           url: '/pages/basics/basics',
                        })
                     }
                  }
               })
            }
         },
         fail: res => {
            console.log(res)
         }
      })
   },
   alltx() {
      this.setData({
         brokerage: this.data.balance
      })
   },


   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      this.setData({
         balance: options.num
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
   onShow: function () {

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

   }
})