const app = getApp();
const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
const picUrl = app.globalData.imgUrl;
const iconUrl = app.globalData.iconUrl;

Page({
  data: {
    card_id: '',
    baPic: "", //背景图
    picUrl: picUrl,
    iconUrl: iconUrl,
    cardId: '',
    isReceive: true,
    getStoreOfferList: [],
    autoplay: true,
    interval: 5000,
    duration: 1000,
    slider: [],
    isScroll: true,
    swiperCurrent: 0,
    //------------------------
    activIndex: 1,
    temp: true,
    ismask: true,
    isimg: 'down',
    btnName: 'add',
    isShowYhq_1: 0,
    isShowYhq_2: 0,
    eventSegment: [{
        id: 1,
        name: '全部',
        type: 'default'
      },
      {
        id: 2,
        name: '3个月内',
        type: 'default'
      },
      {
        id: 3,
        name: '半年内',
        type: 'default'
      },
      {
        id: 4,
        name: '一年内',
        type: 'default'
      },
      {
        id: 5,
        name: '全部',
        type: 'custom'
      },
      {
        id: 6,
        name: '同事',
        type: 'custom'
      },
      {
        id: 4,
        name: '销售',
        type: 'custom'
      },
      {
        id: 5,
        name: '前端',
        type: 'custom'
      },
      {
        id: 6,
        name: 'ui',
        type: 'custom'
      }
    ]
  },
  // onLoad() {
  //   let [that, token, url] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Qrcode/getQrcode"]
  //   let data = {
  //     token: token
  //   }
  //   network.POST({
  //     params: data,
  //     url: url,
  //     success: res => {
  //       console.log("data", res)
  //       if (res.data.code == 0) {
  //         let [codeDetail, resData] = [that.data.codeDetail, res.data.data]
  //         codeDetail.codeimg = picUrl + resData.qrcode
  //         codeDetail.codeNum = resData.recommend_code
  //         codeDetail.codeName = resData.recommend_name || ""
  //         codeDetail.codePhone = resData.phone || ""
  //         that.setData({
  //           codeDetail: codeDetail
  //         })
  //       }
  //     },
  //     fail: res => {
  //       console.log(res)
  //     }
  //   })

  //   // let that = this
  //   // console.log('op', op);
  //   // this.setData({
  //   //   card_id: op.card_id
  //   // })
  //   // //推荐频道
  //   // this.getRecommend(that)
  // },
  onLoad: function (options) {
    this.setData({
      cardId: options.card_id
    })
    console.log('cardId', this.data.cardId);
    // let sceneId;
    // let cardId;
    // // 分享用
    // if ('shareData' in options) {
    //   sceneId = JSON.parse(options.shareData).sceneId;
    //   cardId = JSON.parse(options.shareData).cardId;
    // } else {
    //   cardId = options.cardId || 0
    //   sceneId = ""
    // }
    // wx.setStorageSync("sceneId", sceneId)
    // this.setData({
    //   cardId: cardId
    // })
    // let [token, isVip] = [wx.getStorageSync('uid'), wx.getStorageSync('isVip')]
    // // , phone   , wx.getStorageSync('phone') || phone == "" || phone == null
    // if (token == "" || token == null || isVip == "" || isVip == null) {
    //   wx.redirectTo({
    //     url: '/pages/logonwx/logonwx',
    //   })
    // }
  },

  onShow: function () {
    // this.getStoreInfo()
    let [
      that,
      token,
      cardId,
      cardListUrl,
      getStoreOfferUrl
    ] = [
      this,
      wx.getStorageSync('uid'),
      this.data.cardId,
      dataUrl + "/Api/Cardlist/store",
      dataUrl + "/Api/StoreOffer/getStoreOffer"
    ]
    // console.log(' this.data.cardId,', this.data.cardId);
    let data = {
      token: token,
      card_id: cardId
    }
    // 微店内容
    network.POST({
      params: data,
      url: cardListUrl,
      success: res => {
        console.log('微店', res);
        // if (res.data.code == 704) {


        // }

        if (res.data.code == 0) {
          let resData = res.data.data
          if (!!(resData.config)) {
            resData.config.icon = picUrl + resData.config.icon
            resData.config.pic = picUrl + resData.config.pic
          }
          // resData.config.icon = picUrl + resData.config.icon
          // resData.config.pic = picUrl + resData.config.pic
          for (let i = 0, len = resData.goods.length; i < len; i++) {
            resData.goods[i].icon = picUrl + resData.goods[i].icon
          }
          that.setData({
            baPic: picUrl + resData.pic,
            config: resData.config,
            gcategory: resData.gcategory,
            goodsList: resData.goods,
            isShop: true
          })
        } else {
          that.setData({
            isShop: false,
            shopTxt: res.data.data
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
    // 优惠券
    network.POST({
      params: data,
      url: getStoreOfferUrl,
      success: res => {
        if (res.data.code === 0) {
          that.setData({
            getStoreOfferList: res.data.data
          })
        }
      },
      fail: res => {
        console.log("resfail", res)
      }
    })
  },

  swiperChange(e) {
    let that = this
    that.setData({
      swiperCurrent: e.detail.current
    })
  },
  getRecommend(data) {
    let that = this
    that.setData({
      slider: data.data.slider
    })
  },
  // 设置动态class
  ml_getClickId(e) {
    this.setData({
      activIndex: e.target.dataset.index
    })
  },
  ml_toCompany_details() {
    wx.navigateTo({
      url: `/pages/official_web/official_web?cardId=${this.data.cardId}`
    })
  },
  goToGoods_details(e) {
    // console.log("e", e)
    let [cardId, id] = [this.data.cardId, e.currentTarget.dataset.id]
    // let detail = {
    //   cardId: cardId,
    //   id: id
    // }
    wx.navigateTo({
      // url: '/pages/goods_details/goods_details?' + JSON.stringify(detail)
      url: `/pages/goods_details/goods_details?cardId=${cardId}&id=${id}`
    })
  },
  // 领取优惠券
  receiveOffer: function (e) {
    let index = e.currentTarget.dataset.index
    let [that, id, token, cardId, url] = [this, e.currentTarget.dataset.id, wx.getStorageSync("uid"), this.data.cardId, dataUrl + "/Api/StoreOffer/receiveOffer"]
    let params = {
      token: token,
      card_id: cardId,
      store_offer_id: id
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        console.log(res)
        if (res.data.code === 0) {
          let getStoreOfferList = that.data.getStoreOfferList
          for (let i = 0, len = getStoreOfferList.length; i < len; i++) {
            if (id === getStoreOfferList[i].id) {
              getStoreOfferList[i].checked = true
              break
            }
          }
          // that.setData({
          //   isShowYhq: 1
          // })
          if (index == '1') {
            this.setData({
              isShowYhq_1: 1
            })
          }
          if (index == '2') {
            this.setData({
              isShowYhq_2: 1
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.data,
            success(res) {}
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  shopDetail: function (e) {

  },


  // 请求商店数据
  // getStoreInfo() {
  //   let [
  //     that,
  //     token,
  //     cardId,
  //     cardListUrl
  //   ] = [
  //     this,
  //     wx.getStorageSync('uid'),
  //     this.data.card_id,
  //     dataUrl + "/Api/Cardlist/store"
  //   ]
  //   let data = {
  //     token: token,
  //     card_id: cardId
  //   }
  //   console.log('111111111111111111res', data);
  //   network.POST({
  //     params: data,
  //     url: cardListUrl,
  //     success: res => {
  //       if (res.data.code == 0) {
  //         let resData = res.data.data
  //         if (!!(resData.config)) {
  //           resData.config.icon = picUrl + resData.config.icon
  //           resData.config.pic = picUrl + resData.config.pic
  //         }

  //         for (let i = 0, len = resData.goods.length; i < len; i++) {
  //           resData.goods[i].icon = picUrl + resData.goods[i].icon
  //         }
  //         that.setData({
  //           baPic: picUrl + resData.pic,
  //           config: resData.config,
  //           gcategory: resData.gcategory,
  //           goodsList: resData.goods,
  //         })
  //       }
  //     },
  //     fail: res => {
  //       console.log(res)
  //     }
  //   })
  // },

  // navTap: function (e) {
  //   let [that, id, token, cardId, cardListUrl] = [this, e.currentTarget.dataset.id, wx.getStorageSync('uid'), this.data.cardId, dataUrl + "/Api/Cardlist/store"]
  //   that.setData({
  //     navItem: id
  //   })
  //   let data = {
  //     token: token,
  //     // card_id: cardId,
  //     card_id: 12,
  //     category_id: id
  //   }
  //   network.POST({
  //     params: data,
  //     url: cardListUrl,
  //     success: res => {
  //       if (res.data.code == 0) {
  //         let resData = res.data.data
  //         resData.config.icon = picUrl + resData.config.icon
  //         resData.config.pic = picUrl + resData.config.pic
  //         for (let i = 0, len = resData.goods.length; i < len; i++) {
  //           resData.goods[i].icon = picUrl + resData.goods[i].icon
  //         }
  //         that.setData({
  //           baPic: picUrl + resData.pic,
  //           config: resData.config,
  //           gcategory: resData.gcategory,
  //           goodsList: resData.goods
  //         })
  //       }
  //     },
  //     fail: res => {
  //       console.log(res)
  //     }
  //   })
  // },
})