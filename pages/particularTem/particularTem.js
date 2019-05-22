const app = getApp();
const picUrl = app.globalData.imgUrl;
const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: picUrl,
    imgUrl: '',
  },
  checkTap: function (e) {
    console.log("e", e)
    let [that, imgUrl, id, token, url] = [this, this.data.imgUrl, e.currentTarget.dataset.id, wx.getStorageSync("uid"), dataUrl + "/Api/Cardlist/setTemplet"]
    wx.showModal({
      title: '提示',
      content: '是否更换名片模板',
      success(res) {
        if (res.confirm) {
          for (let i = 0, len = imgUrl.length; i < len; i++) {
            if (id == imgUrl[i].id) {
              imgUrl[i].is_check = true
            } else {
              imgUrl[i].is_check = false
            }
          }
          let params = {
            token: token,
            templet_id: id
          }
          network.POST({
            params: params,
            url: url,
            success: res => {
              if (res.data.code == 0) {
                that.setData({
                  imgUrl: imgUrl
                })
              }
            },
            fail: res => {
              console.log("resFail", res)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let [that, token, url] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Cardlist/getTempletList"]
    let params = {
      token: token
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        if (res.data.code == 0) {
          that.setData({
            imgUrl: res.data.data
          })
        }
      },
      fail: res => {
        console.log("res", res)
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

  }
})