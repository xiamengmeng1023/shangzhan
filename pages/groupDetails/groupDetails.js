const app = getApp();
const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
const picUrl = app.globalData.imgUrl;
const patrn = app.globalData.patrn;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: picUrl,
    alertShow: false, //判断弹窗是否显示
    details: {},
  },
  // 下载二维码到本地
  downPic() {
    let that = this;
    wx.showToast({   
      icon: 'loading',
      title: '正在保存图片',
      duration: 1000  
    })
    //判断权限
    wx.getSetting({
      success(res) {
        //没有权限，发起授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() { //用户允许授权，保存图片到相册
              that.savePhoto();
            },
            fail() { //用户点击拒绝授权，跳转到设置页，引导用户授权
              wx.openSetting({
                success() {
                  wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success() {
                      that.savePhoto();
                    }
                  })
                }
              })
            }
          })
        } else { //用户已授权，保存到相册
          that.savePhoto()
        }
      }
    })
    // wx.downloadFile({
    //   url: details.code, // 仅为示例，并非真实的资源
    //   success(res) {
    //     wx.playVoice({
    //       filePath: res.tempFilePath
    //     })
    //   }
    // })
  },

  savePhoto() {
    let that = this
    let details = this.data.details;
    wx.downloadFile({
      url: details.code,
      success: function(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: "success",
              duration: 1000
            })
          }
        })
      }
    })
  },
  //弹窗显示
  alertShow() {
    this.setData({
      alertShow: !this.data.alertShow
    })
  },

  // 复制微信号
  copyNum(e) {
    let weixin = e.currentTarget.dataset.num;
    wx.setClipboardData({
      data: weixin,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {}
        })
      }
    })
  },

  // 获取群信息
  getGroupDetail(id) {
    let [that, token, url] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Group/getGroupDetail"]
    let params = {
      token: token,
      group_id: id,
      type: 1,
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        console.log("res", res)
        if (res.data.code == 0) {
          that.setData({
            details: res.data.data
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id
    this.getGroupDetail(id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})