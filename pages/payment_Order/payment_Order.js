// pages/payment_Order/payment_Order.js
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
    ids: "",
    address: {}, //地址
    list: {},
    orderNum: "",
    checked: false,
    itemIndex: 0,
    pickerIndex: {},
    pickerId: {},
    orderAmount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let ids = JSON.parse(options.ids).toString()
    this.setData({
      ids: 205
    })
    console.log('ids', ids);
    let addressId = options.id || ""
    this.setData({
      addressId: addressId
    })
    let [that, token, url] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Member/update_address"]
    let data = {
      token: token,
      type: 1,
      address_id: addressId
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("res", data)
        console.log("res", res)
        if (res.data.code == 0 && res.data.data !== null) {
          let resData = res.data.data
          that.setData({
            rname: resData.name,
            phone: resData.mobile,
            region: [resData.province, resData.city, resData.area],
            dateilsAddress: resData.address,
            checked: resData.is_default == 1 ? true : false
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
  onShow: function () {
    let [
      that,
      ids,
      token,
      url
    ] = [
      this,
      this.data.ids,
      wx.getStorageSync("uid"),
      dataUrl + "/Api/Cardlist/cartSettlement"
    ]
    let data = {
      token: token,
      // app_id: 'wxde059b418de529cd',
      cart_ids: 205
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        if (res.data.code == 0) {
          let resData = res.data.data
          // console.log("resData1111111111111", resData)
          that.setData({
            address: resData.address,
            list: resData.store_list[0],
            orderNum: resData,
            pickerIndex: this.resizeData(resData.store_list)
          })
          that.orderData()
          console.log("pickerIndex", that.data.pickerIndex)
          console.log("pickerId", that.data.pickerId)
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  // 计算总价
  orderData() {
    let [pickerIndex, orderNum, list, num] = [this.data.pickerIndex, this.data.orderNum, this.data.list, 0];
    for (let i = 0, len = list.length; i < len; i++) {
      if (list[i].store_offer.length > 0) {
        num += Math.floor(list[i].subtotal) - Math.floor(list[i].store_offer[pickerIndex[list[i].store_id]].money)
      }
    }
    this.setData({
      orderAmount: num
    })
  },
  resizeData(data) {
    let returnData = {}
    let pickerId = {}

    for (let index in data) {
      if (data[index].store_offer.length > 0) {
        let itemData = data[index]
        let store_id = itemData.store_id
        let id = itemData.store_offer[0].id || ""
        returnData[store_id] = 0
        pickerId[store_id] = id || ""
      }
    }
    this.setData({
      pickerId: pickerId
    })
    //  pickerId
    return returnData
  },
  //提交订单
  submit: function () {
    let [that] = [this]
    let [orderNum, token, code, url, pickerId] = [that.data.orderNum, wx.getStorageSync("uid"), wx.getStorageSync("code"), dataUrl + "/Api/Wxpay/orderGoPay", that.data.pickerId]
    if (!orderNum.address.id) {
      wx.showModal({
        title: '提示',
        content: '请添加地址',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/address/address',
            })
          }
        }
      })
      return
    }
    that.setData({
      checked: true
    })
    let data = {
      token: token,
      code: code,
      cart_ids: orderNum.cart_ids,
      // app_id: 'wxde059b418de529cd',
      address_id: orderNum.address.id,
      express_shipping: orderNum.express_shipping,
      store_offer: JSON.stringify(pickerId),
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("resdata", data)
        console.log("res", res)
        if (res.data.code == 0) {
          let resData = res.data.data
          let order = resData.order_sn
          wx.requestPayment({
            timeStamp: resData.timestamp,
            nonceStr: resData.nonceStr,
            package: resData.package,
            signType: resData.signType,
            paySign: resData.paySign,
            success(res) {
              console.log("res", res)
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 600
              })
              that.setData({
                checked: false
              })
              setTimeout(function () {
                let orderUrl = dataUrl + "/Api/Wxpay/queryOrder"
                let orderData = {
                  order_sn: order
                }
                network.POST({
                  params: orderData,
                  url: orderUrl,
                  success: res => {
                    console.log("res", res)
                    if (res.data.code == 0) {
                      wx.redirectTo({
                        url: '/pages/orderDetails/orderDetails?orderSn=' + order,
                      })
                    }
                  },
                  fail: res => {
                    console.log(res)
                  }
                })

              }, 800)
            },
            fail(res) {
              wx.showModal({
                title: '提示',
                content: '支付失败',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.redirectTo({
                      url: '/pages/myOrder/myOrder',
                    })
                  }
                }
              })
            },
            complete: res => {
              that.setData({
                checked: false
              })
            }
          })
        }
      },
      fail: res => {
        console.log(res)
        that.setData({
          checked: false
        })
      }
    })
  },
})