// pages/newsDetails/newsDetails.js

const app = getApp();
const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
const picUrl = app.globalData.imgUrl;
const iconUrl = app.globalData.iconUrl;
const WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: iconUrl,
    news: {},
    picUrl: picUrl,
    like: [],
    detailId: "",
    likeList: [],
    type: 1,
    id: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if ('shareData' in options) {
      let sceneId = JSON.parse(options.shareData).sceneId || "";
      let id = JSON.parse(options.shareData).id;
      wx.setStorageSync("sceneId", sceneId)
      wx.setStorageSync("id", id)
      if (app.isNull()) {
        let [that, url] = [this, dataUrl + "/Api/Home/getNewsDetail"]
        that.setData({
          id: id
        })
        let data = {
          id: id,
          // app_id: "wxde059b418de529cd"
        }
        network.POST({
          params: data,
          url: url,
          success: res => {
            if (res.data.code === 0) {
              let resData = res.data.data
              resData.pic = picUrl + resData.pic
              // console.log('res111111111111', resData.pic);
              that.setData({
                news: resData
              })
              WxParse.wxParse('summary', 'html', that.data.news.content, that, 5)
            }
          },
          fail: res => {
            console.log(res)
          }
        })
      } else {
        app.isNull()
      }

    } else {
      let [that, id, url] = [this, options.id, dataUrl + "/Api/Home/getNewsDetail"]
      that.setData({
        id: id
      })
      let data = {
        id: id,
        // app_id: "wxde059b418de529cd"
      }
      // 动态详情接口
      network.POST({
        params: data,
        url: url,
        success: res => {
          if (res.data.code === 0) {
            // console.log('res111111111111', res);
            let resData = res.data.data
            resData.pic = picUrl + resData.pic
            that.setData({
              news: resData
            })
            WxParse.wxParse('summary', 'html', that.data.news.content, that, 5)
          }
        },
        fail: res => {
          console.log(res)
        }
      })
    }
  },
  onShareAppMessage() {
    let [sceneId, id] = [wx.getStorageSync("uid"), this.data.id]
    let shareData = {
      sceneId,
      id
    }
    return {
      title: app.globalData.shareText,
      path: '/pages/news/news?shareData=' + JSON.stringify(shareData),
      success: res => {}
    }
  }
})