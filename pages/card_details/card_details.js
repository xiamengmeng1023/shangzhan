// pages/card_details/card_details.js

const app = getApp()
let eventSegment = app.globalData.eventSegment
const picUrl = app.globalData.imgUrl
const dataUrl = app.globalData.url
const iconUrl = app.globalData.iconUrl
const network = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */

  data: {
    ismask: false,
    picUrl: picUrl,
    iconUrl: iconUrl,
    isMaskShow: false,
    isShowGrouping: false,
    isShowTopBox: 'false',
    isBindCompany: false,
    is_myself_card: true,
    isaddLab: true,
    shopId: '',
    style_op: '0',
    temp: true,
    isimg: 'down',
    btnName: 'add',
    cardId: '',
    IsShowVip: false,
    addLab: '',
    templab: '',
    activIndex: '',
    cardGroup: [],
    eventSegment: eventSegment,
    cardDetails: {},
    groupIndex: 0,
    userPic: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    // console.log('cardId', options.cardid);
    let sceneId
    let cardId
    // console.log("'shareData' in options", 'shareData' in options)
    if ('shareData' in options) {
      sceneId = JSON.parse(options.shareData).sceneId
      cardId = JSON.parse(options.shareData).cardId
    } else {
      cardId = options.cardId || 0
      sceneId = ''
    }
    // console.log("cardId", cardId)
    wx.setStorageSync('sceneId', sceneId)
    this.setData({
      cardId: options.cardid
    })
    // console.log("cardId", this.data.cardId)
    let [token, isVip] = [wx.getStorageSync('uid'), wx.getStorageSync('isVip')]
    // , phone   , wx.getStorageSync('phone') || phone == "" || phone == null
    if (token == '' || token == null || isVip == '' || isVip == null) {
      wx.redirectTo({
        url: '/pages/logonwx/logonwx'
      })
    }
    // console.log('isVip', isVip);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let [that, isVip, token, cardId, cardListUrl, storeUrl] = [
      this,
      wx.getStorageSync('isVip'),
      wx.getStorageSync('uid'),
      this.data.cardId,
      dataUrl + '/Api/Cardlist/getCardinfo',
      dataUrl + '/Api/Cardlist/getStoreinfo'
    ]
    // console.log('isVip', isVip);

    if (isVip === '1') {
      that.setData({
        IsShowVip: true
      })
    } else {
      that.setData({
        IsShowVip: false
      })
    }
    let data = {
      token: token,
      cardid: that.data.cardId
      // cardid: 1
    }
    // console.log('我的名片id为', data);

    // 个人信息
    network.POST({
      params: data,
      url: cardListUrl,
      success: res => {
        console.log('res个人信息', res)
        if (res.data.code === 0) {
          let [resData, cardList] = [res.data.data, that.data.cardList]
          that.setData({
            cardDetails: resData,
            card_id: resData.id,
          })
          if (res.data.data.is_myself_card === 1) {
            that.setData({
              is_myself_card: true
            })
          } else {
            that.setData({
              is_myself_card: false
            })
          }
          if (resData.is_bind === '1') {
            that.setData({
              isBindCompany: true,
            })
          } else {
            that.setData({
              isBindCompany: false
            })
          }
        } else {
          that.setData({
            userPic: '/imgs/xiaomi.png'
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
    let url1 = dataUrl + '/Api/Member/is_make_card'
    let data1 = {
      token: token
    }
    network.POST({
      params: data1,
      url: url1,
      success: res => {
        // console.log("res", res)
        // is_make_card  0：未填写   1 :填写
        if (res.data.code == 0) {
          if (
            res.data.data.is_vip == 0 ||
            res.data.data.vip_expired_status == 0
          ) {
            wx.showModal({
              title: '提示',
              content: '目前你不是环保使者，是否前往申请',
              success(res) {
                if (res.confirm) {
                  // wx.navigateBack({
                  //   delta: 1
                  // })
                  wx.navigateTo({
                    url: '/pages/myIdentity/myIdentity'
                  })
                }
              }
            })
          }
        }
      },
      fail: res => {
        console.log('res', res)
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let [sceneId, cardId] = [wx.getStorageSync('uid'), this.data.cardId]
    let shareData = {
      sceneId,
      cardId
    }
    // console.log("shareData", shareData)
    return {
      title: app.globalData.shareText,
      path: '/pages/card_details/card_details?shareData=' +
        JSON.stringify(shareData),
      success: res => {
        console.log('resShare', shareData)
      }
    }
  },

  // 监听滚动
  onPageScroll: function (e) {
    // console.log(e.scrollTop)
    if (e.scrollTop <= 80) {
      this.setData({
        isShowTopBox: true,
        style_op: '0'
      })
    } else if (e.scrollTop >= 80 && e.scrollTop < 200) {
      this.setData({
        isShowTopBox: false,
        style_op: '0.4'
      })
    } else if (e.scrollTop >= 200 && e.scrollTop < 300) {
      this.setData({
        isShowTopBox: false,
        style_op: '0.7'
      })
    } else {
      this.setData({
        isShowTopBox: false,
        style_op: '1'
      })
    }
  },
  //拨打电话遮罩
  ml_closeMask() {
    this.setData({
      ismask: !this.data.ismask
    })
  },
  // 到微店页
  ml_toCompany_details() {
    // console.log('this.data.cardId', this.data.cardId)
    wx.navigateTo({
      url: `/pages/company_details/company_details?card_id=${this.data.cardId}`
    })
  },
  ml_toBindCompany() {
    wx.navigateTo({
      url: `/pages/bind_company/bind_company?card_id=${this.data.cardId}`
    })
  },
  // 点击弹出分组窗口
  ml_isShowGrouping() {
    if (this.data.isShowGrouping) {
      this.setData({
        isShowGrouping: false,
        isaddLab: true
      })
    } else {
      this.setData({
        isShowGrouping: true
      })
    }
    this.getGroup()
  },

  // 获取分组
  getGroup() {
    // 获取分组
    let [that, token, cardGroupUrl] = [
      this,
      wx.getStorageSync('uid'),
      dataUrl + '/Api/CardGroup/cardGroupList'
    ]

    let data1 = {
      token: token
    }
    // 获取分组
    network.POST({
      params: data1,
      url: cardGroupUrl,
      success: res => {
        if (res.data.code === 0) {
          // console.log('分组列表', res)
          that.setData({
            cardGroup: res.data.data
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  // 点击设置分组
  ml_getClickId(e) {
    let index = e.target.dataset.index
    let gid = e.target.dataset.gid
    // console.log('index', index)
    let [that, token, cardId, addCardGroupUrl] = [
      this,
      wx.getStorageSync('uid'),
      this.data.cardId,
      dataUrl + '/Api/CardGroup/addCardGroupMember'
    ]

    let data = {
      token: token,
      card_group_id: gid,
      card_id: cardId
    }
    network.POST({
      params: data,
      url: addCardGroupUrl,
      success: res => {
        if (res.data.code === 0) {
          // console.log('点击设置分组', res);
          // that.setData({
          //   cardGroup: res.data.data
          // })
          that.setData({
            activIndex: index
          })
          wx.showToast({
            title: '分组成功',
            icon: 'success',
            duration: 1500
          })
          that.getGroup()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  ml_Back() {
    wx.navigateBack({
      delta: 1
    })
  },

  ml_isShowAddOrDEL() {
    if (this.data.isaddLab == false) {
      this.setData({
        isaddLab: true
      })
    } else {
      this.setData({
        isaddLab: false
      })
    }
  },
  // 获取val值
  inputVal(e) {
    this.setData({
      addLab: e.detail.value
    })
    // console.log('inputVal', this.data.addLab);
  },

  // 添加分组
  addLabGrouping() {
    if (this.data.addLab == '') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入分组名称',
        success(res) {
          if (res.confirm) {}
        }
      })
      return
    }
    if (this.data.addLab.length > 5) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '分组名称不能超过4个字',
        success(res) {
          if (res.confirm) {}
        }
      })
      return
    }
    let [that, token, url, name] = [
      this,
      wx.getStorageSync('uid'),
      dataUrl + '/Api/CardGroup/addCardGroup',
      this.data.addLab
    ]
    let data = {
      token: token,
      name: name
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        // is_make_card  0：未填写   1 :填写
        if (res.data.code == 0) {
          console.log('添加成功', res)
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1500
          })
          that.setData({
            isaddLab: true,
            addLab: ''
          })
          that.getGroup()
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg,
            success(res) {
              if (res.confirm) {}
            }
          })
          return
        }
      },
      fail: res => {
        console.log('res', res)
      }
    })
  },
  // 存入通讯录
  addphone: function () {
    let that = this
    wx.addPhoneContact({
      firstName: that.data.cardDetails.real_name || 'Lily',
      mobilePhoneNumber: that.data.cardDetails.phone || '021-57878218',
      success: function (res) {
        console.log('电话添加联系人返回：', res)
      }
    })
  },
  //拨打电话
  callTap: function () {
    let cardDetails = this.data.cardDetails
    // console.log('cardDetails.phone', cardDetails.phone);
    wx.makePhoneCall({
      phoneNumber: cardDetails.phone || '暂无号码'
    })
  },
  // 复制文本
  copyText: function (e) {
    // console.log("e", e)
    let [copy, cardDetails] = [
      e.currentTarget.dataset.copy,
      this.data.cardDetails
    ]

    if (copy === '1') {
      wx.setClipboardData({
        data: cardDetails.phone || '',
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '复制成功'
              })
            }
          })
        }
      })
      return
    }
    if (copy === '2') {
      wx.setClipboardData({
        data: cardDetails.email || '',
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '复制成功'
              })
            }
          })
        }
      })
      return
    }
    if (copy === '3') {
      wx.setClipboardData({
        data: cardDetails.weixin || '',
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '复制成功'
              })
            }
          })
        }
      })
      return
    }
    if (copy === '4') {
      wx.setClipboardData({
        data: cardDetails.bind_company || '',
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '复制成功'
              })
            }
          })
        }
      })
      return
    }
    if (copy === '5') {
      wx.setClipboardData({
        data: cardDetails.address || '',
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '复制成功'
              })
            }
          })
        }
      })
      return
    }
  }
})