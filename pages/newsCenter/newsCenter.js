// pages/newsCenter/newsCenter.js

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
    picUrl: picUrl,
    screndCount: 0,
    firstCount: 0,
    screndCount: 0,
    threeCount: 0,
    isReadMsg: false,
    isShowIndex: 1,
    // -----------------
    // informList: [], //通知
    msgList: [], //互动列表
    radarList: [], //雷达列表（第一个）
    NoticeList: [], //通知列表（第三个）
    MessagePage: 1,
    radarPage: 2,
    radarRows: 10,
    loadShow: false,
    token: wx.getStorageSync('uid')
  },

  onLoad() {
    // 获取雷达消息列表
    // this.getRadarList()
    // 获取互动消息列表
    // 获取通知消息列表
    // this.getNoticeList()
  },
  onShow() {
    // this.setData({
    //   loadShow: !this.data.loadShow
    // })
    let [
      that,
      url,
      token,
    ] = [
      this,
      dataUrl + '/Api/Message/getRadarMessageList',
      wx.getStorageSync('uid'),
    ]
    let data1 = {
      token: token,
    }
    network.POST({
      params: data1,
      url: url,
      success: res => {
        if (res.data.code === 0) {
          let resData = res.data.data;
          that.setData({
            msgList: resData
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
    this.setData({
      msgList: []
    })

    // 获取雷达未读数目
    this.getFirstCount()
    // 获取互动未读数目
    this.unReadNum()

    this.getRadarList()
    // 获取互动消息列表
    // this.getMessageList()
    // 获取通知消息列表
    this.getNoticeList()
    // 获取通知消息数目
    this.getNoticeListCount()
  },
  onHide: function () {
    this.setData({
      radarPage: 2
    })

  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  },

  onReachBottom() {
    let isShowIndex = this.data.isShowIndex

    if (isShowIndex == 1) {
      this.getRadarList()
    } else if (isShowIndex == 2) {
      this.setData({
        MessagePage: this.data.MessagePage + 1
      })
      this.getMessageList()
    }
  },

  // 点击上面的lab 切换下面内容
  navTap: function (e) {

    let that = this
    let index = e.currentTarget.dataset.index
    if (index == 1) {
      that.setData({
        isShowIndex: 1
      })
      that.getRadarList()
      that.getFirstCount()
    }
    if (index == 2) {
      that.setData({
        isShowIndex: 2
      })
      // that.getMessageList()
    }
    if (index == 3) {
      that.setData({
        isShowIndex: 3
      })
      that.getNoticeList()
      that.reNotice()
    }
    // that.setData({
    //   numType: num
    // })
    // let data1 = {
    //   token: token
    // }
    // if (num == 1) {
    //   network.POST({
    //     params: data1,
    //     url: informUrl,
    //     success: res => {
    //       if (res.data.code === 0) {
    //         let resData = res.data.data
    //         that.setData({
    //           informList: resData
    //         })
    //       }
    //     },
    //     fail: res => {
    //       console.log(res)
    //     }
    //   })
    //   return
    // }
    // if (num == 2) {
    //   network.POST({
    //     params: data1,
    //     url: radarUrl,
    //     success: res => {
    //       if (res.data.code === 0) {
    //         let resData = res.data.data
    //         that.setData({
    //           radarList: resData
    //         })
    //       }
    //     },
    //     fail: res => {
    //       console.log(res)
    //     }
    //   })
    //   return
    // }
    // if (num == 3) {
    //   let data2 = {
    //     token: 1642,
    //     app_id: 'wxde059b418de529cd'
    //   }
    //   // 通知请求
    //   network.POST({
    //     params: data2,
    //     url: NoticeUrl,
    //     success: res => {
    //       if (res.data.code === 0) {
    //         let resData = res.data.data
    //         that.setData({
    //           NoticeList: resData
    //         })
    //       }
    //     },
    //     fail: res => {
    //       console.log(res)
    //     }
    //   })
    //   return
    // }
  },
  // --------------------------------------------
  // 获取雷达列表数据(第一个)
  getRadarList() {
    this.setData({
      loadShow: !this.data.loadShow
    })
    let [
      that,
      url,
      token,
      radarPage,
      radarRows,
      radarList
    ] = [
      this,
      dataUrl + '/Api/Notice/getMessage',
      wx.getStorageSync('uid'),
      this.data.radarPage,
      this.data.radarRows,
      this.data.radarList
    ]
    let data1 = {
      token: token,
      page: radarPage,
      list_rows: radarRows
      // token: 1642,
      // app_id: 'wxde059b418de529cd'
    }

    network.POST({
      params: data1,
      url: url,
      success: res => {
        if (res.data.code === 0) {
          let resData = res.data.data
          // console.log('获取雷达(第一个)列表数据', resData)
          if (resData.length > 0 && resData.length < 5) {
            that.setData({
              radarList: resData,
              loadShow: !that.data.loadShow
            })
          } else if (resData.length > 5) {
            radarPage++
            that.setData({
              radarList: that.data.radarList.concat(resData),
              radarPage: radarPage,
              loadShow: !that.data.loadShow
            })
          }
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 获取雷达消息数目（第一个）
  getFirstCount() {
    let [that, token, getMessageCountUrl] = [
      this,
      wx.getStorageSync('uid'),
      dataUrl + '/Api/Notice/getMessageCount'
    ]
    let params = {
      token: token
      // app_id: 'wxde059b418de529cd'
    }
    network.POST({
      params: params,
      url: getMessageCountUrl,
      success: res => {
        if (res.data.code == 0) {
          // console.log('总数', res)
          if (res.data.data.count > 100) {
            res.data.data.count = 99
          }
          that.setData({
            firstCount: res.data.data.count
          })
        }
      },
      fail: res => {
        console.log('fail', res)
      }
    })
  },
  // --------------------------------------------

  // 获取互动消息列表(第二个)
  getMessageList() {
    this.setData({
      loadShow: !this.data.loadShow
    })
    // console.log('获取互动消息列表')
    let [that, token, MessagePage, url] = [
      this,
      wx.getStorageSync('uid'),
      this.data.MessagePage,
      dataUrl + '/Api/Message/getRadarMessageList'
    ]
    let params = {
      token: token,
      page: MessagePage,
      list_rows: 5
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        if (res.data.code == 0) {
          let resData = res.data.data
          console.log('MessagePage resData', resData);

          if (resData.length >= 0) {
            // console.log('MessagePage', MessagePage);
            that.setData({
              msgList: that.data.msgList.concat(resData),
              // loadShow: !that.data.loadShow
            })
            // console.log('获取消息列表', that.data.msgList)
          } else {
            if (MessagePage > 1) {
              that.setData({
                MessagePage: that.data.MessagePage - 1
              })
            }
          }
        }
      },
      fail: res => {
        console.log('res', res)
      }
    })
  },
  // 获取互动中未读消息数目(第二个)
  unReadNum() {
    let [that, token, url] = [
      this,
      wx.getStorageSync('uid'),
      dataUrl + '/Api/Notice/unReadNum'
    ]
    let params = {
      token: token
      // app_id: 'wxde059b418de529cd'
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        if (res.data.code == 0) {
          if (res.data.data.count > 100) {
            res.data.data.count = 99
          }
          that.setData({
            screndCount: res.data.data
          })
        }
      },
      fail: res => {
        console.log('fail', res)
      }
    })
  },
  // --------------------------------------------
  //获取通知消息列表（第三个）
  getNoticeList() {
    let [
      that,
      token,
      NoticeUrl
    ] = [
      this,
      wx.getStorageSync('uid'),
      dataUrl + '/Api/Notice/getNotice'
    ]
    let data2 = {
      token: token,
      // app_id: 'wxde059b418de529cd'
    }
    // 通知请求
    network.POST({
      params: data2,
      url: NoticeUrl,
      success: res => {
        if (res.data.code === 0) {
          let resData = res.data.data
          that.setData({
            NoticeList: resData
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  //获取通知未读消息数目（第三个）
  getNoticeListCount() {
    let [that, token, getNoticeListCountUrl] = [
      this,
      wx.getStorageSync('uid'),
      dataUrl + '/Api/Notice/getNoticeCount'
    ]
    let params = {
      token: token
      // app_id: 'wxde059b418de529cd'
    }
    network.POST({
      params: params,
      url: getNoticeListCountUrl,
      success: res => {
        if (res.data.code == 0) {
          console.log('总数', res)
          if (res.data.data.count > 100) {
            res.data.data.count = 99
          }
          that.setData({
            threeCount: res.data.data.count
          })
        }
      },
      fail: res => {
        console.log('fail', res)
      }
    })
  },
  // --------------------------------------------
  // 去聊天窗口
  msgTap: function (e) {
    let info = {
      id: e.currentTarget.dataset.id,
      singlechat: e.currentTarget.dataset.singlechat || '1',
      speakerName: e.currentTarget.dataset.speakerName,
      from: e.currentTarget.dataset.from
    }
    // <!-- 点击已读雷达内容 -->
    let [that, token, url] = [
      this,
      wx.getStorageSync('uid'),
      dataUrl + '/Api/Notice/setMessageStatus'
    ]
    let params = {
      token: token,
      // token: 1642,
      message_id: e.currentTarget.dataset.id
      // app_id: 'wxde059b418de529cd'
    }
    console.log('params', params);
    network.POST({
      params: params,
      url: url,
      success: res => {
        if (res.data.code == 0) {
          // let resData = res.data.data
          console.log('设置已读', res)
        }
      },
      fail: res => {
        console.log('res', res)
      }
    })
    // Api/Notice/setMessageStatus
    // this.radarMsg()
    // that.getMessageList()
    wx.navigateTo({
      url: '/pages/ChatWindow/ChatWindow?info=' + JSON.stringify(info)
    })
  },
  // 点击通知已读：Api/Group/setNoticeStatus
  reNotice() {
    let [that, token, url] = [
      this,
      wx.getStorageSync('uid'),
      dataUrl + '/Api/Notice/setNoticeStatus'
    ]
    let params = {
      token: token,
      // token: 1642,
      // app_id: 'wxde059b418de529cd'
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        if (res.data.code == 0) {
          // let resData = res.data.data
          console.log('设置已读', res)
        }
      },
      fail: res => {
        console.log('res', res)
      }
    })
  },
})