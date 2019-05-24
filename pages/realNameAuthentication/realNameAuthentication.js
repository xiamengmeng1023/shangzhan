// pages/realNameAuthentication/realNameAuthentication.js
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
    rname: "", //姓名
    phone: "", //手机号码
    verifyCode: "获取验证码",
    disabled: "",
    isRealName: false,
    rCode: "", //身份证
    // deadline: "", //有效期
    checked: false,

    // 身份证照片验证
    front: iconUrl + "btn/idcard.png",
    reverse: iconUrl + "btn/idcard.png",
    Isfront: 0,
    Isreverse: 0,
    ischooseImageZm: 0,
    ischooseImageFm: 0
  },
  blurTel: function (e) {
    let phone = e.detail.value;
    this.setData({
      phone: phone
    })
  },

  bindinput: function (e) {
    let phone = e.detail.value;
    this.setData({
      phone: phone
    })
  },
  //获取验证码
  getCode: function (e) {
    let that = this
    let [phone, url, token] = [that.data.phone, dataUrl + "/Api/Sms/SendSign", wx.getStorageSync('uid')];
    that.setData({
      disabled: true,
    })
    let data1 = {
      token: token,
      phone: phone,
    }

    if (phone == '' || !(/^1[3-9][0-9]{9}$/.test(phone))) {
      wx.showModal({
        title: '提示',
        content: '手机号码格式不正确',
        showCancel: false
      })
      that.setData({
        disabled: "",
      })
      return;
    } else {
      let total_micro_second = 60 * 1000; //表示60秒倒计时，想要变长就把60修改更大
      //验证码倒计时
      count_down(this, total_micro_second);
      console.log("data1", data1)
      network.POST({
        params: data1,
        url: url,
        success: res => {
          console.log("rescode", res)
          if (res.data.code !== 0) {
            wx.showToast({
              title: res.data.msg,
              duration: 1000
            })
          }
        },
        fail: res => {
          console.log(res.data)
        }
      })
    }
  },
  checkboxChange: function (e) {
    console.log(e)
    if (e.detail.value.length == 1) {
      this.setData({
        checked: true
      })
    } else {
      this.setData({
        checked: false
      })
    }
  },

  formSubmit: function (e) {
    let [
      that,
      eValue,
      url,
      uploadUrl,
      token
    ] = [
      this,
      e.detail.value,
      dataUrl + "/Api/MemberIdcard/idCard",
      dataUrl + "/Api/MemberIdcard/uploadIdcard",
      wx.getStorageSync('uid')
    ]
    // console.log("e", eValue)
    if (that.data.checked == false) {
      wx.showModal({
        title: '提示',
        content: '请阅读《服务协议》',
        showCancel: false
      })
      return
    }
    // deadline, eValue.deadline
    let [rname, phone, code, rCode] = [eValue.rname, eValue.phone, eValue.code, eValue.rCode]
    if (rname == "") {
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
        showCancel: false
      })
      return
    }
    if (phone == '' || !(/^1[3-9][0-9]{9}$/.test(phone))) {
      wx.showModal({
        title: '提示',
        content: '手机号码不正确',
        showCancel: false
      })
      return;
    }
    if (code == "") {
      wx.showModal({
        title: '提示',
        content: '请输入验证码',
        showCancel: false
      })
      return;
    }
    if (rCode == "" || !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(rCode)) {
      wx.showModal({
        title: '提示',
        content: '请输入身份证号码',
        showCancel: false
      })
      return;
    }
    if (that.data.Isfront == 0) {
      wx.showModal({
        title: '提示',
        content: '请上传身份证正面',
        showCancel: false
      })
      return
    }
    if (that.data.Isreverse == 0) {
      wx.showModal({
        title: '提示',
        content: '请上传身份证背面',
        showCancel: false
      })
      return
    }
    // if (deadline == "") {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请输入正确的身份证有效期限',
    //     showCancel: false
    //   })
    //   return;
    // }
    let data1 = {
      token: token,
      app_id: "wx5550cef350778b61",
      card_number: rCode,
      real_name: rname
      // type: 1,
    }
    let data2 = {
      token: token,
      type: 1,
      real_name: rname,
      phone: phone,
      code: code,
      card_number: rCode,
      idcard_zm: that.data.front,
      app_id: "wx5550cef350778b61",
    }
    let data3 = {
      token: token,
      type: 2,
      real_name: rname,
      phone: phone,
      code: code,
      card_number: rCode,
      idcard_fm: that.data.reverse,
      app_id: "wx5550cef350778b61",
    }
    // 正面
    if (that.data.Isfront == 1 && that.data.Isreverse == 1) {
      wx.uploadFile({
        url: uploadUrl,
        filePath: that.data.front,
        header: {
          'content-type': 'json'
        },
        name: 'idcard_zm',
        formData: data2,
        success: res => {
          console.log("front", res)
          let resData = JSON.parse(res.data)
          if (resData.code == 0) {
            // that.setData({
            //   Isfront: 1
            // })
            console.log('图片上传成功');
          } else {
            that.setData({
              front: ""
            })
            wx.showToast({
              icon: 'none',
              title: '上传失败',
              duration: 600
            })
          }
        }
      })
      wx.uploadFile({
        url: uploadUrl,
        filePath: that.data.reverse,
        header: {
          'content-type': 'json'
        },
        name: 'idcard_fm',
        formData: data3,
        success: res => {
          console.log("reverse", res)
          let resData = JSON.parse(res.data)
          if (resData.code == 0) {
            // that.setData({
            //   Isfront: 1
            // })
            console.log('图片上传成功');

          } else {
            that.setData({
              reverse: ""
            })
            wx.showToast({
              icon: 'none',
              title: '上传失败',
              duration: 600
            })
          }
        }
      })
    }
    // 反面
    // if (that.data.Isreverse == 1) {
    //   wx.uploadFile({
    //     url: uploadUrl,
    //     filePath: that.data.reverse,
    //     header: {
    //       'content-type': 'json'
    //     },
    //     name: 'idcard_fm',
    //     formData: data3,
    //     success: res => {
    //       console.log("reverse", res)
    //       let resData = JSON.parse(res.data)
    //       if (resData.code == 0) {
    //         // that.setData({
    //         //   Isfront: 1
    //         // })
    //         console.log('图片上传成功');

    //       } else {
    //         that.setData({
    //           reverse: ""
    //         })
    //         wx.showToast({
    //           icon: 'none',
    //           title: '上传失败',
    //           duration: 600
    //         })
    //       }
    //     }
    //   })
    // }

    network.POST({
      params: data1,
      url: url,
      success: res => {
        // console.log("res", data1)
        // console.log("res", res)
        if (res.data.code == 0) {
          // Isfront=0是未上传
          // this.idcardbackpic()

          wx.navigateTo({
            url: '/pages/realNamereSult/realNamereSult',
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })
        }
      },
      fail: res => {
        console.log(res.data)
      }
    })

  },
  //身份证正面照
  idcardfrontpic() {
    let [
      that,
      url,
      token,
    ] = [
      this,
      dataUrl + "/Api/MemberIdcard/uploadIdcard",
      wx.getStorageSync('uid'),
    ]
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'copmpressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths[0]
        that.setData({
          front: tempFilePaths,
          // ischooseImageZm: 1,
          Isfront: 1
        })
        console.log(tempFilePaths)
        // console.log(token)

        // let data1 = {
        //   token: token,
        //   // type: 1,
        //   app_id: "wx5550cef350778b61"
        // }

        // wx.uploadFile({
        //   url: url,
        //   filePath: tempFilePaths,
        //   header: {
        //     'content-type': 'json'
        //   },
        //   name: 'idcard_zm',
        //   formData: data1,
        //   success: res => {
        //     // console.log("front", res)
        //     let resData = JSON.parse(res.data)
        //     if (resData.code == 0) {
        //       // that.setData({
        //       //   Isfront: 1
        //       // })
        //       console.log('图片上传成功');

        //     } else {
        //       that.setData({
        //         front: ""
        //       })
        //       wx.showToast({
        //         icon: 'none',
        //         title: '上传失败',
        //         duration: 600
        //       })
        //     }
        //   }
        // })

      },
    })
  },

  //身份证反面照
  idcardbackpic() {
    let [that, url, token] = [this, dataUrl + "/Api/Member/uploadIdcard", wx.getStorageSync('uid')]
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'copmpressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths[0]
        that.setData({
          reverse: tempFilePaths,
          // ischooseImageFm: 1,
          Isreverse: 1
        })
        console.log(tempFilePaths)
        // var data1 = {
        //   token: token,
        //   type: 2,
        //   app_id: "wx5550cef350778b61"
        // }
        // wx.uploadFile({
        //   url: url,
        //   filePath: tempFilePaths[0],
        //   header: {
        //     'content-type': 'json'
        //   },
        //   name: 'idcard',
        //   formData: data1,
        //   success: res => {
        //     let resData = JSON.parse(res.data)
        //     if (resData.code == 0) {
        //       that.setData({
        //         Isreverse: 2
        //       })
        //     } else {
        //       that.setData({
        //         reverse: "",
        //       })
        //       wx.showToast({
        //         icon: 'none',
        //         title: '上传失败',
        //         duration: 600
        //       })
        //     }
        //   }
        // })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let [that, url, token] = [this, dataUrl + "/Api/Member/idCard", wx.getStorageSync('uid')]
    let data1 = {
      token: token,
      type: 1,
      // 假数据
      // token: 1642,
      // app_id: 'wxde059b418de529cd'
    }
    network.POST({
      params: data1,
      url: url,
      success: res => {
        console.log("身份证数据", res)

        if (res.data.code == 0) {

          if (res.data.data !== '') {
            let resData = res.data.data
            wx.setStorageSync("realName", resData.status)
            // if (resData.idcard_fm !== '' && resData.idcard_zm !== '') {}
            that.setData({
              rname: resData.real_name,
              rCode: resData.card_number,
              phone: resData.phone,
              front: resData.idcard_zm,
              reverse: resData.idcard_fm,
              Isfront: 1,
              Isreverse: 1,
              isRealName: resData.status == '1' ? false : true
              // deadline: resData.expired
            })
          }

        }
      },
      fail: res => {
        console.log(res.data)
      }
    })
  },
  gotoProtocol() {
    wx.navigateTo({
      url: "/pages/protocol/protocol",
    })
  }
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