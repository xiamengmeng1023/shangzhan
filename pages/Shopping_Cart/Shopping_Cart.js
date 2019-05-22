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
    picUrl: picUrl,
    iconUrl: iconUrl,
    inputVal: 1,
    ids: '',
    list: [],
    hasList: false, // 列表是否有数据
    orderNum: 0,
    isckall: false, //是否全选
    shopShow: false, //false 隐藏删除
  },
  //   Api/Cardlist/del_cart
  // token
  // cart_id
  del: function (e) {
    console.log("e", e)
    let [that, token, id, url] = [this, wx.getStorageSync("uid"), e.currentTarget.dataset.id, dataUrl + "/Api/Cardlist/del_cart"]
    let data = {
      token: token,
      cart_id: id
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("res", res)
        if (res.data.code === 0) {
          wx.showToast({
            title: '删除成功',
            duration: 600
          })
          this.getCard()
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  // 取消
  shopHide: function () {
    this.setData({
      shopShow: false
    })
  },
  // 长按删除
  shopLong: function () {
    this.setData({
      shopShow: true
    })
  },
  //全选
  ckall: function () {
    let that = this
    let [list, isckall, orderNum] = [that.data.list, that.data.isckall, 0]
    if (isckall === false) {
      for (let i = 0, len = list.store_list.length; i < len; i++) {
        list.store_list[i].IsCheck = true
        for (let j = 0, jen = list.store_list[i].goods_list.length; j < jen; j++) {
          list.store_list[i].goods_list[j].IsCheck = true
          orderNum += parseFloat(list.store_list[i].goods_list[j].goods_num) * parseFloat(list.store_list[i].goods_list[j].goods_price)
        }
      }
      that.setData({
        list: list,
        isckall: true,
        orderNum: orderNum
      })
    } else {
      for (let i = 0, len = list.store_list.length; i < len; i++) {
        list.store_list[i].IsCheck = false
        for (let j = 0, jen = list.store_list[i].goods_list.length; j < jen; j++) {
          list.store_list[i].goods_list[j].IsCheck = false
        }
      }
      that.setData({
        list: list,
        isckall: false,
        orderNum: orderNum
      })
    }
  },

  // 单个商店
  stairCkeck: function (e) {
    console.log("e", e)
    let [that] = [this]
    let [list, cid, orderNum] = [that.data.list, e.currentTarget.dataset.id, 0]
    for (let i = 0, len = list.store_list.length; i < len; i++) {
      if (cid === list.store_list[i].store_id) {
        list.store_list[i].IsCheck = !list.store_list[i].IsCheck
        for (let j = 0, jen = list.store_list[i].goods_list.length; j < jen; j++) {
          if (list.store_list[i].IsCheck === true) {
            list.store_list[i].goods_list[j].IsCheck = true
            orderNum += parseFloat(list.store_list[i].goods_list[j].goods_num) * parseFloat(list.store_list[i].goods_list[j].goods_price)
          } else {
            orderNum = 0;
            list.store_list[i].goods_list[j].IsCheck = false
          }
        }
      }
    }
    that.setData({
      list: list,
      orderNum: orderNum
    })
    for (let i = 0, len = list.store_list.length; i < len; i++) {
      if (list.store_list[i].IsCheck === true) {
        that.setData({
          isckall: true
        })
      } else {
        that.setData({
          isckall: false
        })
        break
      }
    }
  },
  // 单选
  onlyCheck: function (e) {
    console.log(e)
    let [that] = [this]
    let [list, cid, orderNum] = [that.data.list, e.currentTarget.dataset.id, 0]
    for (let i = 0, len = list.store_list.length; i < len; i++) {
      for (let j = 0, jen = list.store_list[i].goods_list.length; j < jen; j++) {
        if (list.store_list[i].goods_list[j].id === cid) {
          list.store_list[i].goods_list[j].IsCheck = !list.store_list[i].goods_list[j].IsCheck
        }
        if (list.store_list[i].goods_list[j].IsCheck === true) {
          orderNum += parseFloat(list.store_list[i].goods_list[j].goods_num) * parseFloat(list.store_list[i].goods_list[j].goods_price)
        }
      }
    }

    for (let i = 0, len = list.store_list.length; i < len; i++) {
      for (let j = 0, jen = list.store_list[i].goods_list.length; j < jen; j++) {
        if (list.store_list[i].goods_list[j].IsCheck === true) {
          list.store_list[i].IsCheck = true
        } else {
          list.store_list[i].IsCheck = false
          break
        }
      }
    }

    for (let i = 0, len = list.store_list.length; i < len; i++) {
      if (list.store_list[i].IsCheck === true) {
        that.setData({
          isckall: true
        })
      } else {
        that.setData({
          isckall: false
        })
        break
      }
    }

    that.setData({
      list: list,
      orderNum: orderNum
    })
  },
  // 增加
  add: function (even) {
    console.log("even", even)
    let [that, token, id, url] = [this, wx.getStorageSync("uid"), even.currentTarget.dataset.cid, dataUrl + "/Api/Cardlist/plus_cart"]
    let data = {
      token: token,
      cart_id: id
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("resdata", data)
        console.log("res", res)
        if (res.data.code === 0) {
          that.getCard()
        } else {
          wx.showToast({
            title: res.data.data || "失败",
            duration: 600
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })

  },
  // 减少
  sub: function (even) {
    console.log("even", even)
    let [that, token, id, url] = [this, wx.getStorageSync("uid"), even.currentTarget.dataset.cid, dataUrl + "/Api/Cardlist/reduce_cart"]
    if (even.currentTarget.dataset.num <= 1) {
      return
    } else {
      let data = {
        token: token,
        cart_id: id
      }
      network.POST({
        params: data,
        url: url,
        success: res => {
          console.log("resdata", data)
          console.log("res", res)
          if (res.data.code === 0) {
            that.getCard()
          }
        },
        fail: res => {
          console.log(res)
        }
      })
    }

  },
  // 去结算
  goSub() {
    let [list, subList] = [this.data.list, []]
    for (let i = 0, len = list.store_list.length; i < len; i++) {
      for (let j = 0, jen = list.store_list[i].goods_list.length; j < jen; j++) {
        if (list.store_list[i].goods_list[j].IsCheck === true) {
          subList.push(list.store_list[i].goods_list[j].id)
        }
      }
    }

    if (subList.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '请选择需要的商品',
        success(res) {
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })
    } else {
      let [token, cartIds, url] = [wx.getStorageSync("uid"), subList.toString(), dataUrl + "/Api/Cardlist/checkCart"]
      let params = {
        token: token,
        cart_ids: cartIds,
        // app_id: 'wxde059b418de529cd'
      }
      network.POST({
        params: params,
        url: url,
        success: res => {
          if (res.data.code == 0) {
            wx.redirectTo({
              url: '/pages/payment_Order/payment_Order?ids=' + JSON.stringify(subList),
            })
          } else {
            let resData = res.data.msg
            wx.showModal({
              title: '提示',
              content: resData,
            })

          }
        }
      })
    }
  },
  //获取购物车信息
  getCard: function () {
    let [that, token, url] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Cardlist/cart_list"]
    let data = {
      token: token,
      // app_id: 'wxde059b418de529cd'
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        // console.log("res111", res)
        if (res.data.code === 0) {
          let resData = res.data.data
          that.setData({
            list: resData
          })
        }
        console.log('list', that.data.list);
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let ids = JSON.parse(options.ids).toString()
    this.setData({
      ids: ids
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCard()
  },

})