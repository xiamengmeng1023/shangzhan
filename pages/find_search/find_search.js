const app = getApp();
const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
const picUrl = app.globalData.imgUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: picUrl,
    navList: [],
    list: [],
    inputVal: "",
    isShow: false,
    failMsg: "",
    search_type: "",
  },
  navTab: function (e) {
    let [id, navList] = [e.currentTarget.dataset.id, this.data.navList]
    // console.log('id', id);
    for (let i = 0, len = navList.length; i < len; i++) {
      if (id === navList[i].id) {
        navList[i].checked = true
      } else {
        navList[i].checked = false
      }
    }
    this.setData({
      navList: navList
    })
  },

  bindKeyInput: function (e) {
    // console.log("ebindKeyInput", e)
    let val = e.detail.value
    this.setData({
      inputVal: val
    })
  },
  blur: function (e) {
    console.log("blur", e)
    let val = e.detail.value
    this.setData({
      inputVal: val
    })
  },
  subSoso: function () {
    let [that, inputVal, navList, token, url] = [this, this.data.inputVal, this.data.navList, wx.getStorageSync("uid"), dataUrl + "/Api/Find/getSearchResult"]
    let id = "";
    for (let i = 0, len = navList.length; i < len; i++) {
      if (navList[i].checked) {
        id = navList[i].id
        break
      }
    }
    let params = {
      token: token,
      search_type: id,
      keywords: inputVal,
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        console.log("res", res)
        if (res.data.code == 0) {
          that.setData({
            isShow: false,
            list: res.data.data.data,
            search_type: res.data.data.search_type
          })
          console.log("list", that.data.list)
          console.log("isShow", that.data.isShow)
        } else {
          that.setData({
            isShow: true,
            failMsg: res.data.data,
          })
        }
      },
      fail: res => {
        console.log("res", res)
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let [that, url] = [this, dataUrl + "/Api/Find/getSearchField"]
    console.log("res", options)
    network.POST({
      url: url,
      success: res => {
        console.log("res", res)
        if (res.data.code == 0) {
          that.setData({
            navList: res.data.data
          })
        }
      },
      fail: res => {
        console.log("res", res)
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