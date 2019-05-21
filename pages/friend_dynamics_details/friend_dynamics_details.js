// pages/newsDetails/newsDetails.js

const app = getApp()
const dataUrl = app.globalData.url
const network = require('../../utils/util.js')
const picUrl = app.globalData.imgUrl
const iconUrl = app.globalData.iconUrl
Page({
  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: iconUrl,
    dynamic: {},
    picUrl: picUrl,
    style_img: '',
    cardId: '',
    clickZanStatus: true,
    dList: [], //动态列表
    like: [],
    detailId: '',
    likeList: [],
    addtime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('options', options.id);
    let detailId = options.id
    this.setData({
      detailId: detailId
    })
    this.info()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  // 点赞
  onClickImage: function (e) {
    let [that, url, token, type, id] = [
      this,
      dataUrl + '/Api/Dynamic/addlike',
      wx.getStorageSync('uid'),
      e.currentTarget.dataset.type,
      this.data.detailId
    ]

    let params = {
      token: token,
      // token: 1642,
      dynamic_id: id,
      type: type
    }
    if (type == 1) {
      network.POST({
        params: params,
        url: url,
        success: res => {
          if (res.data.code == 0) {
            wx.showToast({
              title: '点赞成功',
              icon: 'success',
              duration: 800
            })
            that.info()
            // that.setData({
            //   style_img: 'transform:scale(1.5);'
            // })
            // setTimeout(() => {
            //   that.setData({
            //     style_img: 'transform:scale(1.3);'
            //   })
            // }, 200)
            // setTimeout(() => {
            //   that.setData({
            //     style_img: 'transform:scale(1);'
            //   })
            // }, 400)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 800
            })
          }
        },
        fail: res => {
          console.log('fail', res)
        }
      })
    }
    if (type == 2) {
      network.POST({
        params: params,
        url: url,
        success: res => {
          if (res.data.code == 0) {
            wx.showToast({
              title: '取消点赞',
              icon: 'success',
              duration: 800
            })
            that.info()
            // that.setData({
            //   style_img: 'transform:scale(1.5);'
            // })
            // setTimeout(() => {
            //   that.setData({
            //     style_img: 'transform:scale(1.3);'
            //   })
            // }, 200)
            // setTimeout(() => {
            //   that.setData({
            //     style_img: 'transform:scale(1);'
            //   })
            // }, 400)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 800
            })
          }
        },
        fail: res => {
          console.log('fail', res)
        }
      })
    }
    // this.startTimer();
  },

  info() {
    // console.log('detailId', detailId);
    let [that, token, url, detailId] = [
      this,
      wx.getStorageSync('uid'),
      dataUrl + '/Api/Dynamic/dynamic_detail',
      this.data.detailId
    ]
    let data = {
      token: token,
      // app_id: 'wxde059b418de529cd',
      dynamic_id: detailId
    }
    // 动态详情接口
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log('动态详情参数', data)
        console.log('动态详情', res)
        if (res.data.code === 0) {
          let resData = res.data.data
          let sjc = Number(resData.addtime) //时间戳
          let time = network.formatTime(sjc, 'Y/M/D h:m')
          // console.log(time); //转换为日期：2017/03/03 03:03:03
          that.setData({
            dynamic: resData,
            addtime: time,
            likeList: resData.nick_name
            // like: resData.addlike_status
          })

          // console.log(network.formatTime(sjc, 'Y/M/D h:m:s')); //转换为日期：2017/03/03 03:03:03

          // console.log(network.formatTime(sjc, 'h:m')); //转换为日期：03:03
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  }
})