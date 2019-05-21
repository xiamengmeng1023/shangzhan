// var numbers = 1
// var bool = true
// Page({
//   data: {
//     show_edit: 'block',
//     edit_show: 'none',
//     selectShopStatus: true,
//     shopList: [], // 购物车列表
//     // hasList: false,          // 列表是否有数据
//     // 默认展示数据
//     hasList: true,
//     // 商品列表数据
//     list: [{
//         shopid: 'a',
//         id: 1,
//         title: '园艺大师抗皱精华露',
//         image: '../../assets/order_img.png',
//         pro_name: '30ml',
//         num: 1,
//         price: 180,
//         selected: true
//       },
//       {
//         shopid: 'a',
//         id: 1,
//         title: '园艺大师抗皱精华露',
//         image: '../../assets/order_img.png',
//         pro_name: '30ml',
//         num: 1,
//         price: 180,
//         selected: true
//       },
//       {
//         shopid: 'a',
//         id: 2,
//         title: '伊芙琳玫瑰护手霜',
//         image: '../../assets/order_img.png',
//         pro_name: '25g',
//         num: 1,
//         price: 62,
//         selected: true
//       },
//       {
//         shopid: 'b',
//         id: 2,
//         title: '燕麦山羊手霜',
//         image: '../../assets/order_img.png',
//         pro_name: '75ml',
//         num: 1,
//         price: 175,
//         selected: true
//       }
//     ],
//     // 金额
//     totalPrice: 0, // 总价，初始为0
//     // 全选状态
//     selectAllStatus: true // 全选状态，默认全选
//   },
//   onload() {
//     // this.selectShopList()
//   },

//   onShow() {
//     wx.showToast({
//       title: '加载中',
//       icon: 'loading',
//       duration: 1000
//     })

//     // 价格方法
//     this.count_price()
//   },
//   /**
//    * 当前商品选中事件
//    */
//   selectList(e) {
//     var that = this
//     // 获取选中的radio索引
//     var index = e.currentTarget.dataset.index
//     // 获取到商品列表数据
//     var list = that.data.list
//     // 默认全选
//     that.data.selectAllStatus = true
//     // 循环数组数据，判断----选中/未选中[selected]
//     list[index].selected = !list[index].selected
//     // 如果数组数据全部为selected[true],全选
//     for (var i = list.length - 1; i >= 0; i--) {
//       if (!list[i].selected) {
//         that.data.selectAllStatus = false
//         break
//       }
//     }
//     // 重新渲染数据
//     that.setData({
//       list: list,
//       selectAllStatus: that.data.selectAllStatus
//     })
//     // 调用计算金额方法
//     that.count_price()
//   },
//   // 选择同一商店
//   selectShopList(e) {
//     var that = this
//     // 获取选中的radio索引
//     var index = e.currentTarget.dataset.index
//     // 获取到商品列表数据
//     var list = that.data.list
//     // 默认全选
//     // that.data.selectShopStatus = true;
//     // 把同一商店放入新的数组
//     var shopList = that.data.shopList
//     // 判断是否是一个商店
//     for (var i = list.length - 1; i >= 0; i--) {
//       const option = list[i]
//       // 如果数组里面本身不存在这个对象则把这个加进去
//       if (shopList.indexOf(option) == -1 && option.shopid == 'a') {
//         shopList.push(option) // 进行动态的操作
//         return shopList
//       }
//     }
//     console.log(shopList)

//     // shopList.forEach((item, index) => {
//     //   console.log(item);
//     //   var flag = true;
//     //   // if (shopList[index] == shopList[index]) {
//     //   //   console.log('111111');
//     //   //   flag = false;
//     //   //   break;
//     //   // }
//     //   // shopList.find((value, index, arr) => {
//     //   //   console.log(index);
//     //   // })
//     // })
//     // var arr = [];
//     // for (var i = 0; i < 100; i++) {
//     //   var arrNum = parseInt(Math.random() * 100) + 1;
//     //   var flag = true;
//     //   for (var j = 0; j <= arr.length; j++) {
//     //     if (arrNum == arr[j]) {
//     //       flag = false;
//     //       break;
//     //     }
//     //   }
//     //   if (flag) {
//     //     arr.push(arrNum);
//     //   } else {
//     //     i--;
//     //   }
//     // }
//     // console.log(arr)

//     // if (shopList.find(shopList[i]) !== -1) {
//     //   console.log('有重复的');
//     // }

//     // var newArr = Array.from(shopList) // 再把set转变成array
//     // console.log(newArr) // [1,2,3,4]

//     // 如果数组数据全部为selected[true],全选
//     that.data.selectShopStatus = !that.data.selectShopStatus

//     for (var i = shopList.length - 1; i >= 0; i--) {
//       shopList[i].selected = !shopList[i].selected
//       if (shopList[i].selected) {
//         that.data.selectShopStatus = true
//         // break
//       } else {
//         that.data.selectShopStatus = false
//       }
//     }
//     console.log('selectShopStatus', that.data.selectShopStatus)
//     // 如果数组数据全部为selected[true],全选

//     // if()
//     // 重新渲染数据
//     that.setData({
//       shopList: shopList,
//       selectShopStatus: that.data.selectShopStatus
//     })
//     // 调用计算金额方法
//     that.count_price()
//   },

//   /**
//    * 购物车全选事件
//    */
//   selectAll(e) {
//     // 全选ICON默认选中
//     let selectAllStatus = this.data.selectAllStatus
//     // true  -----   false
//     selectAllStatus = !selectAllStatus
//     // 获取商品数据
//     let list = this.data.list
//     // 循环遍历判断列表中的数据是否选中
//     for (let i = 0; i < list.length; i++) {
//       list[i].selected = selectAllStatus
//     }
//     // 页面重新渲染
//     this.setData({
//       selectAllStatus: selectAllStatus,
//       list: list
//     })
//     // 计算金额方法
//     this.count_price()
//   },

//   /**
//    * 绑定加数量事件
//    */
//   btn_add(e) {
//     // 获取点击的索引
//     const index = e.currentTarget.dataset.index
//     // 获取商品数据
//     let list = this.data.list
//     // 获取商品数量
//     let num = list[index].num
//     // 点击递增
//     num = num + 1
//     list[index].num = num
//     // 重新渲染 ---显示新的数量
//     this.setData({
//       list: list
//     })
//     // 计算金额方法
//     this.count_price()
//   },

//   /**
//    * 绑定减数量事件
//    */
//   btn_minus(e) {
//     //   // 获取点击的索引
//     const index = e.currentTarget.dataset.index
//     // const obj = e.currentTarget.dataset.obj;
//     // console.log(obj);
//     // 获取商品数据
//     let list = this.data.list
//     // 获取商品数量
//     let num = list[index].num
//     // 判断num小于等于1  return; 点击无效
//     if (num <= 1) {
//       return false
//     }
//     // else  num大于1  点击减按钮  数量--
//     num = num - 1
//     list[index].num = num
//     // 渲染页面
//     this.setData({
//       list: list
//     })
//     // 调用计算金额方法
//     this.count_price()
//   },

//   // 提交订单
//   btn_submit_order: function () {
//     var that = this
//     console.log(that.data.totalPrice)
//     wx.showModal({
//       title: '提示',
//       content: '合计金额:' + that.data.totalPrice,
//       showCancel: true, //是否显示取消按钮
//       success: function (res) {
//         if (res.cancel) {
//           //点击取消,默认隐藏弹框
//         } else {
//           // 调起支付
//           wx.requestPayment({
//             timeStamp: '',
//             nonceStr: '',
//             package: '',
//             signType: 'MD5',
//             paySign: '',
//             success: function (res) {},
//             fail: function (res) {},
//             complete: function (res) {}
//           })
//         }
//       },
//       fail: function (res) {}, //接口调用失败的回调函数
//       complete: function (res) {} //接口调用结束的回调函数（调用成功、失败都会执行）
//     })
//   },
//   /**
//    * 计算总价
//    */
//   count_price() {
//     // 获取商品列表数据
//     let list = this.data.list
//     // 声明一个变量接收数组列表price
//     let total = 0
//     // 循环列表得到每个数据
//     for (let i = 0; i < list.length; i++) {
//       // 判断选中计算价格
//       if (list[i].selected) {
//         // 所有价格加起来 count_money
//         total += list[i].num * list[i].price
//       }
//     }
//     // 最后赋值到data中渲染到页面
//     this.setData({
//       list: list,
//       totalPrice: total.toFixed(2)
//     })
//   }
// })


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