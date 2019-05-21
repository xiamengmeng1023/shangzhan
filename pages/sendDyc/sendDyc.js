const app = getApp();
const dataUrl = app.globalData.url;
const picUrl = app.globalData.imgUrl;
const network = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: []
  },
  //上传图片
  add: function () {
    let [that] = [this]
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({
          imgList: res.tempFilePaths
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  remove: function () {
    var imgs = [];
    this.setData({
      imgList: imgs
    });
  },

  formSubmit: function (e) {
    let [that, eVal, imgList, token, url] = [this, e.detail.value.textarea, this.data.imgList, wx.getStorageSync('uid'), dataUrl + "/Api/Dynamic/issue"]
    // 去掉转义字符  
    // console.log('eVal1111', eVal);
    eVal = eVal.replace(/\s+/g, "");
    // eVal = eVal.replace(/[&\|\\\*^%$#@\-]/g, "");
    eVal = eVal.replace(/&/g, "");
    // console.log('eVal2222', eVal);
    if (eVal == "") {
      wx.showModal({
        title: '提示',
        content: '请输入文本内容',
        showCancel: false,
        success(res) {
          if (res.confirm) {} else if (res.cancel) {}
        }
      })
      return
    }
    if (imgList.length == "") {
      wx.showModal({
        title: '提示',
        content: '请上传图片',
        showCancel: false,
        success(res) {
          if (res.confirm) {} else if (res.cancel) {}
        }
      })
      return
    } else {
      var pic = "data:image/jpeg;base64," + wx.getFileSystemManager().readFileSync(imgList[0], 'base64')
    }
    let data = {
      token: token,
      // token: 1642,
      // app_id: 'wxde059b418de529cd',
      content: eVal,
      pic: pic
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            content: "动态已发布" || res.data.msg,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success(res) {
              if (res.confirm) {

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
  excludeSpecial(s) {
    // 去掉转义字符  

  }
})