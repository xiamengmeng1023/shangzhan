// pages/redPacketRecord/redPacketRecord.js
const app = getApp();
const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
Page({

   /**
    * 页面的初始数据
    */
   data: {
      list_data: [],

   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      let [that, url, token, brokerage] = [this, dataUrl + "/Api/Member/my_purse", wx.getStorageSync("uid"), dataUrl + "/Api/Member/brokerage_list"]
      let data = {
         token: token,
         // token: 1,
         // app_id: 'wxde059b418de529cd'

      }
      network.POST({
         params: data,
         url: brokerage,
         success: res => {
            if (res.data.code == 0) {
               that.setData({
                  list_data: res.data.data.lists
               })
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