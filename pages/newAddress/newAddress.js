const app = getApp();
const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
const picUrl = app.globalData.imgUrl;

Page({
  data: {
    checked: true,
    dateilsAddress: "",
    picUrl: picUrl,
    rname: "", //姓名
    phone: "", //手机号码
    region: ['选择省', '选择市', '选择县'],
    addressId: "",
  },

  onLoad: function (options) {
    if (options.from == 'edit') {
      wx.setNavigationBarTitle({
        title: '编辑地址'
      })
    }
    if (options.from == 'new') {
      wx.setNavigationBarTitle({
        title: '新增地址'
      })
    }
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
  onShow() {
    // var pages = getCurrentPages();
    // var prevPage = pages[pages.length - 2]; //上一个页面
    // console.log('prevPage', prevPage);
  },


  switchChange(e) {
    console.log('switch1 发生 change 事件，携带值为', e.currentTarget.dataset.mindex)
    if (e.currentTarget.dataset.mindex == '1') {
      this.setData({
        checked: false
      })
    }
    if (e.currentTarget.dataset.mindex == '2') {
      this.setData({
        checked: true
      })
    }

  },
  // 修改地址
  bindRegionChange: function (e) {
    var that = this
    that.setData({
      region: e.detail.value
    })
  },
  // 表单提交
  formSubmit: function (e) {
    console.log("e", e)
    let [that, token, region, eVal] = [this, wx.getStorageSync("uid"), this.data.region, e.detail.value]
    let [name, phone, province, city, area, address, addressId] = [eVal.rname, eVal.phone, region[0], region[1], region[2], eVal.dateilsAddress, that.data.addressId]

    if (name.trim() === "") {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: "请输入姓名",
        success(res) {
          if (res.confirm) {

          }
        }
      })
      return
    }
    if (name.indexOf('&') != -1) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: "姓名不能含有非法字符",
        success(res) {
          if (res.confirm) {

          }
        }
      })
      return
    }

    if (phone === "" || !(/^1[3-9][0-9]\d{4,8}$/.test(phone))) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: "请输入正确的手机号码",
        success(res) {
          if (res.confirm) {

          }
        }
      })
      return
    }
    if (address.trim() === "") {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: "请输入详细地址",
        success(res) {
          if (res.confirm) {

          }
        }
      })
      return
    }
    if (address.indexOf('&') != -1) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: "详细地址不能含有非法字符",
        success(res) {
          if (res.confirm) {

          }
        }
      })
      return
    }
    let data = {
      token: token,
      name: name,
      province: province,
      city: city,
      area: area,
      address: address,
      mobile: phone,
      // is_default: isdefault ? "1" : "0"
    }
    if (addressId === "") {
      that.addFn(data)
    } else {
      that.setFn(data)
    }
  },
  // 修改
  setFn: function (even) {
    console.log("even", even)
    let [that, url] = [this, dataUrl + "/Api/Member/update_address"]
    let data = {
      token: even.token,
      type: 2,
      address_id: that.data.addressId,
      name: even.name,
      province: even.province,
      city: even.city,
      area: even.area,
      address: even.address,
      mobile: even.mobile,
      is_default: that.data.checked ? "1" : "0"
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("resData", data)
        console.log("resData", res)
        let resData = res.data.data;
        if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: resData,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1,
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: resData.data || "添加失败",
            success(res) {

            }
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 添加
  addFn: function (even) {
    console.log("even", even)
    let [that, url] = [this, dataUrl + "/Api/Member/add_address"]
    let data = {
      token: even.token,
      name: even.name,
      province: even.province,
      city: even.city,
      area: even.area,
      address: even.address,
      mobile: even.mobile,
      is_default: that.data.checked ? "1" : "0"
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("resData", data)
        console.log("resData", res)
        let resData = res.data.data;
        if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: resData,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1,
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: resData.data || "添加失败",
            success(res) {

            }
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 删除
  remove() {
    let [that, token, addressId, url] = [this, wx.getStorageSync("uid"), this.data.addressId, dataUrl + "/Api/Member/del_address"]
    let data = {
      token: token,
      address_id: addressId
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        // console.log("res", data)
        // console.log("res", res)
        if (res.data.code == 0) {
          let resData = res.data.data
          console.log(7777777777777777777777777777777777);
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: "删除成功",
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1,
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
})