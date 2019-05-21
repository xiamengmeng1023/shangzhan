// pages/Personal_image/Personal_image.js
const app = getApp();
const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
const picUrl = app.globalData.imgUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    source: '',
    picUrl: picUrl,
    imgUrl: [],
    cardId: "",
    isShow: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cardId = options.card_id
    this.setData({
      cardId: cardId
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



  /**

 * 上传图片

 */

  // uploadimg() {

  //   var that = this;

  //   wx.chooseImage({ //从本地相册选择图片或使用相机拍照

  //     count: 1, // 默认9

  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有

  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有

  //     success: function (res) {

  //       //console.log(res)

  //       //前台显示

  //       that.setData({

  //         source: res.tempFilePaths

  //       })

  //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

  //       var tempFilePaths = res.tempFilePaths

  //       wx.uploadFile({

  //         url: 'http://www.website.com/home/api/uploadimg',

  //         filePath: tempFilePaths[0],

  //         name: 'file',



  //         success: function (res) {

  //           //打印

  //           console.log(res.data)

  //         }

  //       })



  //     }

  //   })

  // }

  onShow: function () {
    this.getCardImageList()
  },
  // 查询图片
  getCardImageList: function () {
    let [that, token, cardId, url] = [this, wx.getStorageSync("uid"), this.data.cardId, dataUrl + "/Api/Member/getCardImageList"]
    let data = {
      token: token,
      card_id: cardId
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("res", res)
        if (res.data.code == 0) {
          that.setData({
            imgUrl: res.data.data.content,
          })
        }
      }
    })
  },
  // 上传图片
  imgLoad: function () {
    let [that, url, token] = [this, dataUrl + "/Api/Member/uploadCardPic", wx.getStorageSync('uid')]
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'copmpressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log("tempFilePaths", res.tempFilePaths)
        let tempFilePaths = res.tempFilePaths
        that.setData({
          imgUrl: tempFilePaths
        })
        let data1 = {
          token: token,
          card_id: that.data.cardId
        }
        for (let i = 0, len = tempFilePaths.length; i < len; i++) {
          wx.uploadFile({
            url: url,
            filePath: tempFilePaths[i],
            header: {
              'content-type': 'json'
            },
            name: 'content',
            formData: data1,
            success: res => {
              let resData = JSON.parse(res.data)
              console.log("res上传", res)
              if (resData.code == 0) {
                wx.showToast({
                  title: resData.msg || "失败",
                  icon: 'success',
                  duration: 600
                })
                // that.getCardImageList()
              } else {
                wx.showToast({
                  title: "上传失败",
                  duration: 600
                })
              }
            }
          })
        }
        setTimeout(() => {
          that.onShow()
        }, 500);
      }
    })
  },
  delShow: function () {
    this.setData({
      isShow: true
    })
  },
  delModel: function (e) {
    console.log("e", e)
    let [that, url] = [this, e.currentTarget.dataset.url]
    wx.showModal({
      title: '提示',
      content: '是否要删除这张图片',
      success(res) {
        if (res.confirm) {
          that.delCardImage(url)
        } else if (res.cancel) {
          that.setData({
            isShow: false
          })
        }
      }
    })
  },
  // del
  delCardImage: function (img) {
    let [that, token, cardId, url] = [this, wx.getStorageSync("uid"), this.data.cardId, dataUrl + "/Api/Member/delCardImage"]
    let data = {
      token: token,
      card_id: cardId,
      del_content: img
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("res", res)
        if (res.data.code == 0) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 600
          })
          that.setData({
            isShow: false
          })
          that.getCardImageList()
        } else {
          wx.showToast({
            title: '删除失败',
            duration: 600
          })
          that.setData({
            isShow: false
          })
        }
      }
    })
  },

})