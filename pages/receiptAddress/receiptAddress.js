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
    data_isdef: 0,

    picUrl: picUrl,
    addressList: [],
    checkedId: "",
    bindex: '',

    delBtnWidth: 180,
    list: [],
    startX: ""
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.initEleWidth();
  },


  onShow: function () {
    // 34.Api / Member / address_list
    this.getOrderList()
  },

  // 点击设置默认
  setDefault(e) {
    // let data_isdef = e.currentTarget.dataset.is_default
    // if (data_isdef == 0) {
    //   this.setData({
    //     data_isdef: 1
    //   })
    // }
    console.log('e', e);
    let [that,
      bindex,
      mid,
      token,
      url
    ] = [
      this,
      e.currentTarget.dataset.index,
      e.currentTarget.dataset.mid,
      wx.getStorageSync("uid"),
      dataUrl + "/Api/Member/update_address"
    ]
    that.setData({
      checkedId: mid,
      bindex: e.currentTarget.dataset.index,
    })
    let tempData = that.data.addressList
    // console.log('bindex', that.data.bindex);
    // 遍历地址列表设置其他的为0，选择的为1
    for (let i = 0, len = tempData.length; i < len; i++) {
      tempData[i].is_default = '0'
    }
    // debugger
    tempData[bindex].is_default = '1'
    // console.log('tempData', tempData);
    that.setData({
      addressList: tempData
    })

    let even = that.data.addressList[bindex]
    let data = {
      token: token,
      type: 2,
      address_id: mid,
      name: even.name,
      province: even.province,
      city: even.city,
      area: even.area,
      address: even.address,
      mobile: even.mobile,
      is_default: mid == that.data.checkedId ? "1" : "0"
    }
    // this.setData({
    //   checkedId: resData[this.data.bindex].id
    // })
    console.log('checkedId', that.data.checkedId);
    // console.log('data', data);
    console.log('默认ID', mid)
    network.POST({
      params: data,
      url: url,
      success: res => {
        // let resData = res.data.data
        if (res.data.code == 0) {
          wx.showToast({
            title: '设置成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          // wx.navigateBack({
          //   delta: 1
          // })
        } else {
          // that.setData({
          //   addressList: resData
          // })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  // 获取地址列表
  getOrderList() {
    let [that,
      token,
      url
    ] = [
      this,
      wx.getStorageSync("uid"),
      // 1,
      dataUrl + "/Api/Member/address_list"
    ]
    let data = {
      token: token
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        if (res.data.code == 0) {
          let resData = res.data.data
          console.log('地址列表', resData);
          for (let i = 0; i < resData.length; i++) {
            if (resData[i].is_default === '1') {
              console.log('is_default值为1的index为：', i);
              that.setData({
                checkedId: resData[i].id
              })
              break
            }
          }
          for (let i = 0, len = resData.length; i < len; i++) {
            resData[i].str = resData[i].name.substr(0, 1)
          }

          that.setData({
            addressList: resData
          })
        } else {
          that.setData({
            addressList: resData
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 滑动删除
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，说明向右滑动，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.addressList;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        addressList: list
      });
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.addressList;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        addressList: list
      });
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

  remove: function (e) {
    let [that, token, addresId, url] = [this, wx.getStorageSync("uid"), e.currentTarget.dataset.index, dataUrl + "/Api/Member/del_address"]
    let data = {
      token: token,
      address_id: addresId
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("res", data)
        console.log("res", res)
        if (res.data.code == 0) {
          let resData = res.data.data
          // wx.showModal({
          //   title: '提示',
          //   showCancel: true,
          //   content: resData.data,
          //   success(res) {
          //     if (res.confirm) {
          //       wx.navigateBack({
          //         delta: 1,
          //       })
          //     }
          //   }
          // })
          that.onShow()
        }
      },
      fail: res => {
        console.log(res)
      }
    })

  },
  gotoEdit(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/newAddress/newAddress?id=${id}&from=edit`
    })
  }

})