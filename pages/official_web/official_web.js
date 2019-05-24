// pages/official_web/official_web.js

const app = getApp();
const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
const picUrl = app.globalData.imgUrl;
const iconUrl = app.globalData.iconUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: iconUrl,
    picUrl: picUrl,
    pageData: [],
    banner: [],
    companyData: '',
    Article: '',
    successCase: '',
    EnterpriseInfo: '',
    ContactInfo: '',
    autoplay: true,
    interval: 3000,
    vertical_1: false,
    vertical_2: true,
    circular: true,
    duration: 1000,
    slider: [],
    isScroll: true,
    swiperCurrent: 0,
    rColor: '',
    rColorList: ['#53A3FF', '#FF8781', '#F4BD62', '#8DDD51', '#FF8781'],
    cardId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let sceneId;
    console.log("'shareData' in options", 'shareData' in options)
    if ('shareData' in options) {
      sceneId = JSON.parse(options.shareData).sceneId;
      cardId = JSON.parse(options.shareData).cardId;
    } else {
      cardId = options.cardId || 0
      sceneId = ""
    }
    console.log("cardId", cardId)
    wx.setStorageSync("sceneId", sceneId)
    this.setData({
      cardId: cardId
    })
    console.log("cardId", this.data.cardId)
    let [token, isVip] = [wx.getStorageSync('uid'), wx.getStorageSync('isVip')]
    // , phone   , wx.getStorageSync('phone') || phone == "" || phone == null
    if (token == "" || token == null || isVip == "" || isVip == null) {
      wx.redirectTo({
        url: '/pages/logonwx/logonwx',
      })
    }
    // console.log('options', options);

    let [
      that,
      cardId,
      websiteUrl,
    ] = [
      this,
      this.data.cardId,
      dataUrl + "/Api/Cardlist/website"
    ]
    let data = {
      // token: token,
      // card_id: cardId
      token: 1954,
      card_id: 1785,
    }
    network.POST({
      params: data,
      url: websiteUrl,
      success: res => {
        if (res.data.code === 0) {
          console.log('官网数据', res);
          let [
            Data,
            banner,
            companyData,
            Article,
            successCase,
            EnterpriseInfo,
            ContactInfo,
            recruitInfo,
          ] = [
            res.data.data,
            res.data.data[0],
            res.data.data[1],
            res.data.data[2],
            res.data.data[6].datacon,
            res.data.data[3].datacon,
            res.data.data[8],
            res.data.data[7],
          ]

          for (let i = 0; i < recruitInfo.datacon.length; i++) {
            recruitInfo.datacon[i].firstKey = recruitInfo.datacon[i].title.slice(0, 1)
          }

          for (let i = 0; i < recruitInfo.datacon.length; i++) {
            recruitInfo.datacon[i].area = recruitInfo.datacon[i].address.substring(0, recruitInfo.datacon[i].address.indexOf("市"));
          }
          that.setData({
            pageData: Data,
            banner: banner,
            companyData: companyData,
            Article: Article,
            successCase: successCase,
            EnterpriseInfo: EnterpriseInfo,
            ContactInfo: ContactInfo,
            recruitInfo: recruitInfo,

          })
        }
      },
      fail: res => {
        console.log(res)
      }
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
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goToRecruitmentDetails() {
    wx.navigateTo({
      url: '/pages/recruitment_details/recruitment_details'
    })
  },
  ml_toCompany_details() {
    wx.navigateBack({
      delta: 1
    })
  },
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
    let [copy, ContactInfo] = [
      e.currentTarget.dataset.copy,
      this.data.ContactInfo
    ]

    if (copy === '1') {
      wx.setClipboardData({
        data: ContactInfo.datacon[0].tel || '',
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
        data: ContactInfo.datacon[0].email || '',
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
        data: ContactInfo.datacon[0].web_name || '',
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
        data: ContactInfo.datacon[0].title || '',
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
        data: ContactInfo.datacon[0].address || '',
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