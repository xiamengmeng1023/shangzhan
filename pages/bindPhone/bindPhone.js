// pages/bindPhone/bindPhone.js
const app = getApp();
const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    phPhone: "",
    verifyCode: "获取验证码",
    disabled: "",
  },
  onLoad(options) {
    // 若不为空则说明已经绑定过
    if (options.phone.length !== 0) {
      wx.setNavigationBarTitle({
        title: "更换手机号码" //页面标题为路由参数
      })
      this.setData({
        phone: options.phone
      })
      // let phone = this.data.phone
      // let reg = /^(\d{3})\d*(\d{4})$/;
      // let str2 = phone.replace(reg, '$1****$2')
      // this.setData({
      //   phPhone: str2
      // })
    }
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
  //获取验证码
  getCode: function (e) {
    let that = this
    let [phone, url, token] = [that.data.phone, dataUrl + "/Api/Sms/SendSign", wx.getStorageSync('uid')];

    let data1 = {
      token: token,
      phone: phone,
    }

    if (phone == '') {
      wx.showModal({
        title: '提示',
        content: '请输入手机号',
        showCancel: false
      })
      return;
    } else if (!(/^1[3-9][0-9]{9}$/.test(phone))) {
      wx.showModal({
        title: '提示',
        content: '手机号码格式不正确',
        showCancel: false
      })
      return;
    } else {
      that.setData({
        disabled: true,
      })
      let total_micro_second = 60 * 1000; //表示60秒倒计时，想要变长就把60修改更大
      //验证码倒计时
      count_down(this, total_micro_second);
      network.POST({
        params: data1,
        url: url,
        success: res => {
          console.log("res", data1)
          console.log("res", res)
          if (res.data.code !== 0) {
            wx.showToast({
              title: res.data.msg || "已完成",
              icon: 'success',
              duration: 600,
              mask: true,
            })
            that.setData({
              disabled: false,
            })
          }
        },
        fail: res => {
          console.log(res.data)
        }
      })
    }
  },
  // 提交表单
  formSubmit: function (e) {
    console.log("e", e)
    let [token, phone, code, url] = [wx.getStorageSync('uid'), e.detail.value.phone, e.detail.value.code, dataUrl + "/Api/Member/bindMobile"]
    let data = {
      token: token,
      phone: phone,
      code: code
    }
    if (phone == "" || phone == null || !(/^1[3-9][0-9]{9}$/.test(phone))) {
      wx.showModal({
        title: '提示',
        content: '手机号码格式不正确',
        showCancel: false
      })
      return
    }
    if (code == "") {
      wx.showModal({
        title: '提示',
        content: '请输入验证码',
        showCancel: false
      })
      return
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })
          setTimeout(() => {
            wx.setStorageSync("phone", phone)
            wx.switchTab({
              url: '/pages/index/index',
            })
          }, 800)
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })
        }
      },
      fail: res => {
        console.log("resFailurl", url)
        console.log("resFaildata", data)
        console.log("resFail", res.data)
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