// pages/myIdentity/myIdentity.js
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
    isIndex: 1,
    IsSub: '',
    iconUrl: iconUrl,
    dueTime: '',
    // 是否是vip
    isVip: 0,
    is_company_member: 1,
    alliance_status: 0,
    // showModalStatus: false,
    orderType: 0,
    isDownOrUp: '',
    showFxModal: false,
    vipState: 0,
    list: [{
        icon: '/imgs/myIden-iden',
        name: '尊贵身份'
      },
      {
        icon: '/imgs/myiden-idcard',
        name: '定制名片'
      },
      {
        icon: '/imgs/myiden-myShop',
        name: '微店绑定'
      },
      {
        icon: '/imgs/myiden-www',
        name: '官网绑定'
      },
      {
        icon: '/imgs/myiden-has',
        name: '收益加成'
      },
      {
        icon: '/imgs/myIden-iden',
        name: '尊贵身份'
      },
      {
        icon: '/imgs/myiden-idcard',
        name: '定制名片'
      },
      {
        icon: '/imgs/myiden-myShop',
        name: '微店绑定'
      },
      {
        icon: '/imgs/myiden-www',
        name: '官网绑定'
      },
      {
        icon: '/imgs/myiden-myShop',
        name: '微店绑定'
      }
    ],
    radio: [{
        name: '月度环保使者',
        price: 0.01,
        oldPrice: 30,
      },
      {
        name: '年度环保使者',
        price: 99,
        oldPrice: 365,
      },
      {
        name: '企业标准版',
        price: 1980,
        oldPrice: 3600,
      },
      {
        name: '企业至尊版',
        price: 9999,
        oldPrice: 9999,
      },
      {
        name: '一星联盟',
        price: 1000,
        oldPrice: 1000,
      },
      {
        name: '二星联盟',
        price: 3000,
        oldPrice: 3000,
      },
      {
        name: '三星联盟',
        price: 5000,
        oldPrice: 5000,
      }
    ]
  },
  onShow() {
    let [
      that,
      token,
      isVipUrl,
    ] = [
      this,
      wx.getStorageSync("uid"),
      dataUrl + "/Api/Member/isVip",
    ]
    let data = {
      token: token
    }
    // 请求数据是否是vip及等级
    network.POST({
      params: data,
      url: isVipUrl,
      success: res => {
        if (res.data.code == 0) {
          console.log('isVip', res);
          let isVipData = res.data.data
          that.setData({
            dueTime: isVipData.vip_expired
          })
          if (isVipData.is_vip == 1) {
            that.setData({
              isVip: 1
            })
          } else if (isVipData.is_company_member == 1) {
            that.setData({
              is_company_member: 1
            })
          } else if (isVipData.alliance_status == 1) {
            that.setData({
              alliance_status: 1
            })
          }
          // wx.setStorageSync("isVip", resData.is_vip)
          // that.setData({
          //   phone: resData.phone || "",
          //   isVip: resData.is_vip,
          //   isOpenVip: resData.isOpenVip,
          //   isOpenAlliance: resData.isOpenAlliance,
          //   isOpenCompany: resData.isOpenCompany,
          //   isMark: resData.isMakeCard
          // })
        }
      },
      fail: res => {
        console.log(res)
      }
    })

  },
  getindex(e) {
    let temp = Number(e.currentTarget.dataset.index)
    // console.log('temp', temp)
    if (temp === 1) {
      this.setData({
        isIndex: 1,
        orderType: 0
      })
    } else if (temp === 2) {
      this.setData({
        isIndex: 2,
        orderType: 2
      })
    } else if (temp === 3) {
      this.setData({
        isIndex: 3,
        orderType: 5
      })
    }
  },
  // 弹窗动画
  showBuyModal(e) {

    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 300,
      /**
       * http://cubic-bezier.com/
       * linear 动画一直较为均匀
       * ease 从匀速到加速在到匀速
       * ease-in 缓慢到匀速
       * ease-in-out 从缓慢到匀速再到缓慢
       *
       * http://www.tuicool.com/articles/neqMVr
       * step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
       * step-end 保持 0% 的样式直到动画持续时间结束 一闪而过
       */
      timingFunction: 'ease',
      delay: 0
    })
    this.animation = animation
    animation.translateY(800).step()
    this.setData({
      animationData: animation.export(), // export 方法每次调用后会清掉之前的动画操作。
      // showModalStatus: true
      showFxModal: true
    })
    setTimeout(() => {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export() // export 方法每次调用后会清掉之前的动画操作。
      })
      // console.log(this)
    }, 200)
  },
  // 关闭弹窗
  hideBuyModal() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
      delay: 0
    })
    this.animation = animation
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export()
    })
    setTimeout(
      function () {
        animation.translateY(800).step()
        this.setData({
          animationData: animation.export(),
          showFxModal: false
        })
        // console.log(this)
      }.bind(this),
      100
    )
  },
  // 调支付
  // 获取订单类型
  getOrderType(e) {
    // console.log('e.currentTarget.dataset', Number(e.currentTarget.dataset.index));
    this.setData({
      orderType: Number(e.currentTarget.dataset.index)
    })
  },
  // 订单提交
  formSubmit: function (e) {
    // console.log('e', e)
    let [
      that,
      token,
      orderType,
      code
    ] = [
      this,
      wx.getStorageSync('uid'),
      this.data.orderType,
      wx.getStorageSync('code')
    ]
    that.setData({
      IsSub: true
    })
    let radioData = that.data.radio
    let orderTit
    switch (radioData[orderType].name) {
      case '月度环保使者':
        orderTit = '月度黄金会员'
        break;
      case '年度环保使者':
        orderTit = '年度黄金会员'
        break;
      case '一星联盟':
        orderTit = '一星联盟商'
        break;
      case '二星联盟':
        orderTit = '二星联盟商'
        break;
      case '三星联盟':
        orderTit = '二星联盟商'
        break;
      case '企业标准版':
        orderTit = '企业标准版'
        break;
      case '企业至尊版':
        orderTit = '企业定制版'
        break;
      default:
        break;
    }

    let data = {
      token: token,
      code: code,
      order_title: orderTit,
      order_amount: radioData[orderType].price,
      order_original_price: radioData[orderType].oldPrice,
      app_id: "wx5550cef350778b61"
      // app_id: "wxde059b418de529cd"
    }
    // 企业版加type类型
    if (that.data.orderType == 2) {
      data.type = 1
    } else if (that.data.orderType == 3) {
      data.type = 2
    }
    // console.log('data', data);
    let url
    if (that.data.isIndex == 1) {
      url = dataUrl + '/Api/Wxpay/pay'
    } else if (that.data.isIndex == 2) {
      url = dataUrl + '/Api/Wxpay/companyPay'
    } else if (that.data.isIndex == 3) {
      url = dataUrl + '/Api/Wxpay/alliancePay'
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        // console.log('res', res)
        console.log('res', data)
        if (res.data.code == 0) {
          let resData = res.data.data
          let [timestamp, nonceStr, pAge, signType, paySign, orderSn] = [
            resData.timestamp,
            resData.nonceStr,
            resData.package,
            resData.signType,
            resData.paySign,
            resData.order_sn
          ]
          wx.requestPayment({
            timeStamp: timestamp,
            nonceStr: nonceStr,
            package: pAge,
            signType: signType,
            paySign: paySign,
            success: res => {
              console.log('success', res)
              let url1 = dataUrl + '/Api/Wxpay/queryOrder'
              let data1 = {
                order_sn: orderSn
              }
              network.POST({
                url: url1,
                params: data1,
                success: res => {
                  console.log('res成功', data1)
                  console.log('res成功', res)
                  if (res.data.code == 0) {
                    that.setData({
                      vipState: 1
                    })
                    wx.showModal({
                      title: res.data.msg,
                      content: '恭喜你成为环保使者',
                      showCancel: false,
                      success(res) {
                        if (res.confirm) {
                          wx.navigateBack({
                            delta: 1
                          })
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
            fail: res => {
              console.log('fail', res)
            },
            complete: res => {
              console.log('complete', res)
              that.setData({
                IsSub: false
              })
            }
          })
        }
      },
      fail: res => {}
    })
  },
  // previewImage: function (e) {
  //   var current = e.target.dataset.src
  //   wx.previewImage({
  //     current: current,
  //     urls: [current]
  //   })
  // }
})