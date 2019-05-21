// pages/Set_password/Set_password.js
const app = getApp();
const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
const picUrl = app.globalData.imgUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: picUrl,
    phone: "",
    hide_phone: "",
    verifyCode: "获取验证码",
    disabled: false,
    is_password: 1
  },
  onLoad: function (options) {

    this.setData({
      is_password: options.is_password
    })
    if (this.data.is_password == 1) {
      wx.setNavigationBarTitle({
        title: "修改支付密码"
      })
    }
    let phone = options.phone
    // let reg = /^(\d{3})\d*(\d{4})$/;
    // let str2 = phone.replace(reg, '$1****$2')
    this.setData({
      phone: phone,
      // hide_phone: str2
    })
  },

  fauseTel: function (e) {
    console.log("e", e)
    let phone = e.detail.value;
    this.setData({
      phone: phone
    })
  },
  blurTel: function (e) {
    let phone = e.detail.value;
    this.setData({
      phone: phone
    })
  },

  getCode: function () {
    let [
      that,
      token,
      phone,
      url
    ] = [
      this,
      wx.getStorageSync("uid"),
      this.data.phone,
      dataUrl + "/Api/Sms/SendSign"
    ]
    let data = {
      token: token,
      phone: phone
    }
    if (phone == "" || !(/^1[3-9][0-9]{9}$/.test(phone))) {
      wx.showModal({
        title: '提示',
        content: '手机号码格式不正确',
        showCancel: false
      })
      return;
    }
    that.setData({
      disabled: true,
    })
    let total_micro_second = 60 * 1000; //表示60秒倒计时，想要变长就把60修改更大
    //验证码倒计时
    count_down(this, total_micro_second);
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("res", res)
      }
    })
  },

  successTap: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  formSubmit: function (e) {
    console.log(e)
    let [that, eVal, token, url] = [this, e.detail.value, wx.getStorageSync("uid"), dataUrl + "/Api/Member/setPasswd"]
    let [phone, code, password, pwds] = [eVal.phone, eVal.code, eVal.password, eVal.pwds]
    if (phone == "" || !(/^1[3-9][0-9]{9}$/.test(phone))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确格式的手机号',
        showCancel: false
      })
      return;
    }
    if (code == "") {
      wx.showModal({
        title: '提示',
        content: '请输入验证码',
        showCancel: false,
        success: res => {

        }
      })
      return
    }
    if (password == "" || password.length < 6) {
      wx.showModal({
        title: '提示',
        content: '密码长度不能小于6位',
        showCancel: false,
        success: res => {

        }
      })
      return
    }
    if (password !== pwds) {
      wx.showModal({
        title: '提示',
        content: '两次密码不一致',
        showCancel: false,
        success: res => {

        }
      })
      return
    }


    let data = {
      token: token,
      code: code,
      phone: phone,
      paypwd: password,
      paypwd2: pwds
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success(res) {
              if (res.confirm) {

              }
            }
          })
        }
      }
    })
  },
})


/* 毫秒级倒计时 */
function count_down(that, total_micro_second) {
  if (total_micro_second <= 0) {
    that.setData({
      verifyCode: "重新发送",
      disabled: false
    });
    // timeout则跳出递归
    return;
  }
  // 渲染倒计时时钟
  that.setData({
    verifyCode: date_format(total_micro_second) + " 秒"
  });

  setTimeout(function () {
    total_micro_second -= 10;
    count_down(that, total_micro_second);
  }, 10)
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60)); // equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

  return sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}