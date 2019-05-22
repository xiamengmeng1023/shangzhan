const app = getApp();
const dataUrl = app.globalData.url;
const picUrl = app.globalData.imgUrl;
const network = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: picUrl,
    navId: 1,
    getPage: 1,
    getListRows: 10,
    myListPage: 1,
    myListRows: 10,
    findGroud: [],
    myGroud: [],
    isVip: 0,
  },
  // nav 切换
  find(e) {
    let navId = e.currentTarget.dataset.id
    if (navId == 1) {
      this.setData({
        getPage: 1,
        findGroud: []
      })
      this.getGroupList()
    } else {
      this.setData({
        myListPage: 1,
        myGroud: [],
      })
      this.getMyGroupList()
    }
    this.setData({
      navId: navId
    })
  },

  // 我的群列表
  getMyGroupList() {
    let [that, token, myListPage, myListRows, url] = [this, wx.getStorageSync("uid"), this.data.myListPage, this.data.myListRows, dataUrl + "/Api/Group/getMyGroupList"]
    let params = {
      token: token,
      page: myListPage,
      list_rows: myListRows
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        console.log("getMyGroupList",res.data.data)
        if (res.data.code == 0) {
          if (res.data.data.length > 0) {
            myListPage ++
            console.log(" myListPage ++", myListPage++)
            that.setData({
              myListPage: myListPage,
              myGroud: that.data.myGroud.concat(res.data.data)
            })
          }
        } else {
          let resMsg = res.data.msg;
          wx.showModal({
            title: '提示',
            content: resMsg,
            showCancel: false,
            success(res) {}
          })
        }
      },
      fail: res => {
        console.log("fail", res)
      }
    })
  },
  // 发现群列表
  getGroupList() {
    let [that, token, getPage, getListRows, url] = [this, wx.getStorageSync("uid"), this.data.getPage, this.data.getListRows, dataUrl + "/Api/Group/getGroupList"]
    let params = {
      token: token,
      page: getPage,
      list_rows: getListRows
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        console.log("res", res)
        if (res.data.code == 0) {
          if (res.data.data.length > 0) {
            getPage++
            that.setData({
              getPage: getPage,
              findGroud: that.data.findGroud.concat(res.data.data)
            })
          }

        } else {
          let resMsg = res.data.msg;
          wx.showModal({
            title: '提示',
            content: resMsg,
            showCancel: false,
            success(res) {}
          })
        }
      },
      fail: res => {
        console.log("fail", res)
      }
    })

  },
  // 跳转至群信息修改
  setGroupTap(e) {
    let [that, isVip, id] = [this, this.data.isVip, e.currentTarget.dataset.id]
    if (Math.floor(isVip)) {
      wx.navigateTo({
        url: '/pages/groupAdd/groupAdd?id=' + id,
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: "您还不是付费会员用户",
        confirmText: "成为会员",
        confirmColor: "#0090FF",
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/topUpVip/topUpVip',
            })
          } else if (res.cancel) {

          }
        }
      })
    }
  },

  // 跳转至群详情
  inGroupTap(e) {
    console.log("e", e)
    let [that, isVip, id] = [this, this.data.isVip, e.currentTarget.dataset.id]
    if (Math.floor(isVip)) {
      wx.navigateTo({
        url: '/pages/groupDetails/groupDetails?id=' + id,
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: "您还不是付费会员用户",
        confirmText: "成为会员",
        confirmColor: "#0090FF",
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/topUpVip/topUpVip',
            })
          } else if (res.cancel) {

          }
        }
      })
    }
  },

  // 判断是否是付费用户
  isVip() {
    let [that, token, url] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Member/isVip"]
    let params = {
      token: token
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        console.log("isVip", res)
        if (res.data.code == 0) {
          that.setData({
            isVip: res.data.data.vip
          })
        } else {
          let resMsg = res.data.msg;
          wx.showModal({
            title: '提示',
            content: resMsg,
            showCancel: false,
            success(res) {}
          })
        }
      },
      fail: res => {
        console.log("fail", res)
      }
    })
  },

  // 跳转至 添加 群页面
  nextAddGroup(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/groupAdd/groupAdd?id=' + id,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.isVip()
    let navId = this.data.navId
    if (navId == 1) {
      this.setData({
        getPage: 1,
        findGroud: []
      })
      this.getGroupList()
    } else {
      this.setData({
        myListPage: 1,
        myGroud: [],
      })
      this.getMyGroupList()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("123")
    let navId = this.data.navId
    if (navId == 1) {
      this.getGroupList()
    } else if (navId == 2) {
      this.getMyGroupList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})