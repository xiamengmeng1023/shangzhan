// pages/goods_details/goods_details.js
const app = getApp();
const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
const picUrl = app.globalData.imgUrl;
const WxParse = require('../../wxParse/wxParse.js');
const iconUrl = app.globalData.iconUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tempUrl: '',
    // newsId: '',
    // dataUrl: dataUrl,
    // pageData: '',
    iconUrl: iconUrl,
    picUrl: picUrl,
    goods: {},
    goodsId: "",
    favorite: 0,
    cardId: '',
    is_pay: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    this.setData({
      goodsId: options.id,
      cardId: options.cardId
    })
    if ('shareData' in options) {
      let sceneId = JSON.parse(options.shareData).sceneId || "";
      let id = JSON.parse(options.shareData).id;
      wx.setStorageSync("sceneId", sceneId)
      wx.setStorageSync("id", id)
      if (app.isNull()) {
        let [
          that,
          token,
          url,
          favoriteUrl
        ] = [
          this,
          wx.getStorageSync("uid"),
          dataUrl + "/Api/Cardlist/goods_detail",
          dataUrl + "/Api/Cardlist/favorite"
        ]
        that.setData({
          goodId: id
        })

        let data = {
          token: token,
          goods_id: id
        }
        network.POST({
          params: data,
          url: url,
          success: res => {
            if (res.data.code == 0) {
              let resData = res.data.data
              resData.goods.big_pic = picUrl + resData.goods.big_pic
              that.setData({
                goods: resData.goods,
              })
              WxParse.wxParse('summary', 'html', resData.goods.content, that, 1)
            }
          },
          fail: res => {
            console.log("resfail", res)
          }
        })
        let data1 = {
          token: token,
          goods_id: id,
          type: 0,
        }
        network.POST({
          params: data1,
          url: favoriteUrl,
          success: res => {
            console.log("data1", data1)
            console.log("res", res)
            if (res.data.code == 0) {
              if (res.data.data.status === 1) {
                that.setData({
                  favorite: 2
                })
              } else {
                that.setData({
                  favorite: 1
                })
              }

            }
          },
          fail: res => {
            console.log("resfail", res)
          }
        })
      } else {
        app.isNull()
      }

    } else {
      let [
        that,
        token,
        id,
        url,
        favoriteUrl
      ] = [
        this, wx.getStorageSync("uid"),
        options.id || JSON.parse(options.detail).id,
        dataUrl + "/Api/Cardlist/goods_detail",
        dataUrl + "/Api/Cardlist/favorite"
      ]
      that.setData({
        goodId: id
      })
      let cardId
      if (options.detail) {
        cardId = JSON.parse(options.detail).cardId
      } else {
        cardId = ""
      }
      let data = {
        token: token,
        goods_id: that.data.goodsId,
        card_id: that.data.cardId
      }
      network.POST({
        params: data,
        url: url,
        success: res => {
          console.log("res", res)
          if (res.data.code == 0) {
            let resData = res.data.data
            resData.goods.big_pic = picUrl + resData.goods.big_pic
            that.setData({
              goods: resData.goods,
              is_pay: resData.is_pay
            })
            WxParse.wxParse('summary', 'html', resData.goods.content, that, 1)
          } else if (res.data.code === 1) {
            wx.showModal({
              title: '温馨提示',
              content: res.data.data,
              showCancel: false,
              success: res => {
                if (res.confirm) {
                  that.setData({
                    IsSub: ""
                  })
                }
              }
            })
            wx.navigateBack({
              delta: 1
            })
          }
        },
        fail: res => {
          console.log("resfail", res)
        }
      })
      let data1 = {
        token: token,
        goods_id: id,
        type: 0
      }
      network.POST({
        params: data1,
        url: favoriteUrl,
        success: res => {
          if (res.data.code == 0) {
            if (res.data.data.status === 1) {
              that.setData({
                favorite: 2
              })
            } else {
              that.setData({
                favorite: 1
              })
            }
          }
        },
        fail: res => {
          console.log("resfail", res)
        }
      })
    }
    // console.log('options1111111111111', options);


    // let that = this
    // let url = dataUrl + "/Api/Cardlist/goods_detail"
    // let token = wx.getStorageSync('uid')
    // let data = {
    //   token: token,
    //   goods_id: that.data.goodsId,
    //   cardId: that.data.cardId
    // }
    // // console.log('111111111', this.data.goodsId);
    // // debugger
    // network.POST({
    //   params: data,
    //   url: url,
    //   success: res => {
    //     if (res.data.code === 0) {
    //       // console.log('data', data);
    //       // console.log('商品详情', res);
    //       let resData = res.data.data
    //       resData.goods.big_pic = picUrl + resData.goods.big_pic

    //       that.setData({
    //         goods: resData.goods
    //       })
    //       WxParse.wxParse('summary', 'html', resData.goods.content, that, 1)
    //     }
    //   },
    //   fail: res => {
    //     console.log("错误", res)
    //   }
    // })

    // switch (options.typeId) {
    //   case "0":
    //     console.log('新闻');
    //     that.setData({
    //       tempUrl: "/Api/Home/getNewsDetail",
    //     })
    //     break;
    //   case "1":
    //     console.log('产品');
    //     that.setData({
    //       tempUrl: "/Api/Cardlist/goods_detail",
    //     })
    //     break;
    //   case "2":
    //     console.log('招聘');
    //     that.setData({
    //       tempUrl: "/Api/Home/getzhaopinDetail",
    //     })
    //     break;
    //   case "3":
    //     console.log('文章');
    //     that.setData({
    //       tempUrl: "/Api/Home/getArticleDetail",
    //     })
    //     break;
    //   case "4":
    //     console.log('祝福语');
    //     that.setData({})
    //     break;
    //   default:
    //     break;
    // }
    // console.log('options', options.newsId);
    // console.log("options", options.shareData)

  },
  onShow() {
    // 商品详情

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goToshoppingCar() {
    wx.navigateTo({
      url: '../../pages/Shopping_Cart/Shopping_Cart'
    })
  },
  // 收藏
  favoriteTap: function () {
    console.log('收藏');
    let [that, token, id, favoriteUrl] = [this, wx.getStorageSync("uid"), this.data.goodsId, dataUrl + "/Api/Cardlist/favorite"]
    let data = {
      token: token,
      goods_id: id,
      type: 1,
    }
    network.POST({
      params: data,
      url: favoriteUrl,
      success: res => {
        console.log("resFFF", data)
        console.log("resFFF", res)
        if (res.data.code == 0) {
          that.setData({
            favorite: 2
          })
          console.log("favorite", that.data.favorite)
          wx.showToast({
            title: res.data.data || "收藏成功",
            icon: 'success',
            duration: 600
          })
        }
      },
      fail: res => {
        console.log("resfail", res)
      }
    })
  },
  // 取消收藏
  removeFavoriteTap: function () {
    console.log('取消收藏');
    let [that, token, id, favoriteUrl] = [this, wx.getStorageSync("uid"), this.data.goodsId, dataUrl + "/Api/Cardlist/favorite"]
    let data = {
      token: token,
      goods_id: id,
      type: 2,
    }
    network.POST({
      params: data,
      url: favoriteUrl,
      success: res => {
        console.log("resFFF", data)
        console.log("resFFF", res)
        if (res.data.code == 0) {
          that.setData({
            favorite: 1
          })
          console.log("favorite取消", that.data.favorite)
          wx.showToast({
            title: res.data.data || "取消成功",
            icon: 'success',
            duration: 600
          })
        }
      },
      fail: res => {
        console.log("resfail", res)
      }
    })
  },
  // 添加购物车
  shopCar(e) {
    let typeId = e.currentTarget.dataset.index
    console.log('typeId', typeId);

    // let goodsId = this.data.newsId
    let [that,
      token,
      goodsId,
      url
    ] = [
      this,
      wx.getStorageSync("uid"),
      this.data.goodsId,
      dataUrl + "/Api/Cardlist/add_cart"
    ]
    let data = {
      token: token,
      goods_id: goodsId,
      // app_id: 'wxde059b418de529cd',
      goods_num: 1,
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        // console.log("goodsId", that.data.goodsId)
        // console.log("res", data)
        if (res.data.code == 0) {
          if (typeId == 1) {
            wx.showToast({
              title: '添加购物车成功', //提示文字
              duration: 1200, //显示时长
              mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
              icon: 'success', //图标，支持"success"、"loading"  
              success: function () {}, //接口调用成功
              fail: function () {}, //接口调用失败的回调函数  
            })
          } else {
            wx.navigateTo({
              url: '../../pages/Shopping_Cart/Shopping_Cart?goodsId=' + that.data.goodsId
            })
          }
        }
      },
      fail: res => {
        console.log("resfail", res)
      }
    })
  },
})