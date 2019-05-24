// pages/home/home.js
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
    dataUrl: dataUrl,
    user_realName: '',
    phPhone: '',
    isbind: '',
    IsShow: false,
    isShowPerfect: false,
    someData: {
      cardList: [],
      MyCard: []
    },
    cardId: '',
    notice: {
      title: '暂无通知'
    },
    // ----------------
    headColor: '',
    headTitColor: '',
    btnColor: 'w',
    order_sn: '',
    newsType: '新闻',

    isShowOrder: true,
    typeId: '',
    typeUrl: '',
    newsId: '',
    MyCard: [],
    hasOrder: true,
    order_status: '已付款',
    navH: null,
    topnav: ['全部', '待付款', '待收货', '已完成'],
    notice: {
      title: '暂无通知',
      id: ''
    },
    dynamic: [],
    ware: [],
    // 利润数据
    profit: {
      profit: 0,
      num: 0,
      hits: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 设置顶部栏高度
    this.setData({
      navH: app.globalData.navHeight * 2 + 'rpx'
    })
    console.log("options", options)
    // 接收分享
    let sceneId
    if ('shareData' in options) {
      sceneId = JSON.parse(options.shareData).sceneId
    } else {
      sceneId = options.scene || ''
    }

    wx.setStorageSync('sceneId', sceneId)
    console.log('sceneId', sceneId);
    //
    let [token, isVip] = [wx.getStorageSync('uid'), wx.getStorageSync('isVip')]
    // , phone   , wx.getStorageSync('phone') || phone == "" || phone == null
    if (token == '' || token == null || isVip == '' || isVip == null) {
      wx.redirectTo({
        url: '/pages/logonwx/logonwx'
      })
    }
    // 成为好友接口    
    let that = this
    let addFriendUrl = dataUrl + '/Api/Home/cardFriends'
    let data = {
      token: token,
      scene_id: sceneId
    }
    network.POST({
      params: data,
      url: addFriendUrl,
      success: res => {
        if (res.data.code === 0) {
          // console.log('res111111111111', res);
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  onShow: function () {
    let that = this
    that.getDynamic()
    that.getNotice()
    that.getProfit()
    that.getOrder()
    that.getbussness()
    let isVip = wx.getStorageSync('isVip')
    if (isVip === '1') {
      that.setData({
        IsShow: true
      })
    } else {
      that.setData({
        IsShow: false
      })
    }
  },

  // 监听滚动
  onPageScroll: function (e) {
    // console.log(e.scrollTop);
    if (e.scrollTop <= 50) {
      this.setData({
        headColor: 'transparent',
        btnColor: 'w',
        headTitColor: '#fff'
      })
    } else if (e.scrollTop >= 50) {
      this.setData({
        headColor: '#fff',
        btnColor: 'b',
        headTitColor: '#000'
      })
      // } else if (e.scrollTop >= 200 && e.scrollTop < 300) {
      //   this.setData({
      //     // style_op: "0.7",
      //     btnColor: "b"
      //   })
      // } else {
      //   this.setData({
      //     // style_op: "1",
      //     btnColor: "b"
      //   })
    }
  },
  // ml_toNewsCenter() {
  //   wx.navigateTo({
  //     url: '../../pages/newsCenter/newsCenter'
  //   })
  // },
  goToRadar() {
    wx.navigateTo({
      url: '/pages/radarStatistics/radarStatistics'
    })
  },
  goToMinShop() {
    if (this.data.isbind == '1') {
      wx.navigateTo({
        url: `/pages/company_details/company_details?card_id=${this.data.cardId}`
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '绑定公司可开通企业微店',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '去绑定',
        confirmColor: '#3190FE',
        success: (result) => {
          if (result.confirm) {
            wx.navigateTo({
              url: `/pages/bind_company/bind_company?card_id=${this.data.cardId}`
            })
          }
        }
      });
    }
  },
  // 通知请求
  getNotice() {
    let that = this
    let noticeUrl = dataUrl + '/Api/Home/getNotice'
    let token = wx.getStorageSync('uid')
    let data = {
      token: token
    }
    network.POST({
      params: data,
      url: noticeUrl,
      success: res => {
        if (res.data.code === 0) {
          // console.log('ressssssssssss', res.data.data !== null);
          if (res.data.data !== null) {
            let [resData, notice] = [res.data.data, that.data.notice]
            notice.title = resData.title
            notice.id = resData.id
            that.setData({
              notice: notice
            })
          }
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 动态请求
  getDynamic() {
    let that = this
    let dynamicUrl = dataUrl + '/Api/Home/getDynamic'
    // let token = 1
    let token = wx.getStorageSync('uid')
    let data = {
      token: token
    }
    network.POST({
      params: data,
      url: dynamicUrl,
      success: res => {
        if (res.data.code === 0) {
          let resData = res.data.data
          // console.log("最新动态", res);
          if ((resData.length = 0)) {
            // console.log('动态', resData[0].type);
            //  0：新闻；1：产品；2：招聘;3：文章;4：祝福语'
            that.setData({
              dynamic: resData,
              typeId: resData[0].type,
              newsId: resData[0].con_id
            })
            switch (that.data.typeId) {
              case '0':
                // console.log('新闻');
                that.setData({
                  typeUrl: '/pages/newsDetails/newsDetails',
                  newsType: '新闻'
                })
                break
              case '1':
                // console.log('产品');
                that.setData({
                  typeUrl: '/pages/goods_details/goods_details',
                  newsType: '产品'
                })
                break
              case '2':
                // console.log('招聘');
                that.setData({
                  typeUrl: '/pages/recruitment_details/recruitment_details',
                  newsType: '招聘'
                })
                break
              case '3':
                // console.log('文章');
                that.setData({
                  typeUrl: '/pages/newsDetails/newsDetails',
                  newsType: '文章'
                })
                break
              case '4':
                // console.log('祝福语');
                that.setData({})
                break
              default:
                break
            }
          }
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 财富请求
  getProfit() {
    let that = this
    let profitUrl = dataUrl + '/Api/Home/getProfit'
    let token = wx.getStorageSync('uid')
    let data = {
      token: token
    }
    network.POST({
      params: data,
      url: profitUrl,
      success: res => {
        // console.log('利润resData', res);
        if (res.data.code === 0) {
          let [resData, profit] = [res.data.data, that.data.profit]
          profit.profit = resData.profit
          profit.num = resData.num
          profit.hits = resData.hits
          if (profit.num < 10) {
            profit.num = "0" + profit.num
          }
          if (profit.hits < 10) {
            profit.hits = "0" + profit.hits
          }
          that.setData({
            profit: profit
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 订单请求
  getOrder() {
    let that = this
    let orderUrl = dataUrl + '/Api/Member/order_list'
    // 先获取假数据
    // let token = 1642
    let token = wx.getStorageSync('uid')
    let data = {
      token: token,
      // app_id: 'wxde059b418de529cd'
    }
    network.POST({
      params: data,
      url: orderUrl,
      success: res => {
        if (res.data.code === 0) {
          // console.log("订单列表", res.data.data[0].store_list[0].goods_list[0])
          if (res.data.msg == '暂无订单记录！') {
            // console.log("订单为空");
            that.setData({
              hasOrder: false
            })
          } else {
            // order_status 订单状态：0-未付款1-已付款2-已发货-3-退款4-已退款5-已签收6-企业已激活7-赠送
            let num = res.data.data[0].order_status
            // console.log("num", num)
            switch (num) {
              case '0':
                that.setData({
                  order_status: '未付款'
                })
                break
              case '1':
                that.setData({
                  order_status: '已付款'
                })
                break
              case '2':
                that.setData({
                  order_status: '已发货'
                })
                break
              case '3':
                that.setData({
                  order_status: '退款'
                })
                break
              case '4':
                that.setData({
                  order_status: '已退款'
                })
                break
              case '5':
                that.setData({
                  order_status: '已签收'
                })
                break
              default:
                break
            }
            if (res.data.code == 0) {
              let resData = res.data.data[0].store_list[0].goods_list[0]
              resData.store_name = res.data.data[0].store_list[0].store_name
              // 订单号
              resData.order_sn = res.data.data[0].order_sn
              // console.log("resData", resData);
              that.setData({
                order_data: resData,
                isShowOrder: true
              })
            } else {
              that.setData({
                isShowOrder: false
              })
            }
          }
        }
      },
      fail: res => {
        console.log('fail', res)
      }
    })
  },

  // 微名片
  getbussness() {
    let [that, token, getMyCardUrl, isVip] = [
      this,
      wx.getStorageSync('uid'),
      dataUrl + '/Api/Cardlist/getMyCard',
      wx.getStorageSync('isVip')
    ]
    if (isVip === '1') {
      that.setData({
        IsShow: false
      })
    } else {
      that.setData({
        IsShow: true
      })
    }
    let data = {
      token: token,
      order_status: 0
    }
    // 微名片请求
    network.POST({
      params: data,
      url: getMyCardUrl,
      success: res => {
        // console.log("微名片请求", res);
        if (res.data.code === 0) {
          let resData = res.data.data
          // console.log('resData', resData[0]);
          // resData[0].name = ''
          if (resData[0].real_name == '' || resData[0].job == '' || resData[0].name == '' || resData[0].phone == '' || resData[0].email == '') {
            that.setData({
              isShowPerfect: true
            })
          }

          that.setData({
            MyCard: resData,
            cardId: resData[0].id,
            user_realName: resData[0].real_name,
            isbind: resData[0].is_bind
          })

          let reg = /^(\d{3})\d*(\d{4})$/;
          let str2 = resData[0].phone.replace(reg, '$1****$2')
          this.setData({
            phPhone: str2
          })

        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  goToCardDetails() {
    wx.navigateTo({
      url: `/pages/card_details/card_details?cardid=${this.data.cardId}`
    })
  },
  // 获取我的名片id
  // getMyCardId() {
  //   let [that, token, cardListUrl, isVip] = [
  //     this,
  //     wx.getStorageSync('uid'),
  //     dataUrl + '/Api/Cardlist/getMyCard',
  //     wx.getStorageSync('isVip')
  //   ]
  //   if (isVip === '1') {
  //     that.setData({
  //       IsShow: false
  //     })
  //   } else {
  //     that.setData({
  //       IsShow: true
  //     })
  //   }
  //   let data = {
  //     token: token
  //   }
  //   network.POST({
  //     params: data,
  //     url: cardListUrl,
  //     success: res => {
  //       if (res.data.code === 0) {
  //         let resData = res.data.data
  //         // console.log('获取我的名片id', resData[0].id);
  //         that.setData({
  //           cardId: resData[0].id
  //         })
  //       }
  //     },
  //     fail: res => {
  //       console.log(res)
  //     }
  //   })
  // },

  // 用户点击右上角分享
  onShareAppMessage() {
    let [
      sceneId,
      cardId
    ] = [
      wx.getStorageSync("uid"),
      this.data.cardId
    ]
    let shareData = {
      sceneId,
      cardId
    }
    // console.log(' this.data.cardId', this.data.cardId);
    // console.log(' sceneId', sceneId);
    return {
      title: app.globalData.shareText,
      path: '/pages/index/index?shareData=' + JSON.stringify(shareData),
      success: res => {
        console.log("resShare", shareData)
      }
    }
  },
})