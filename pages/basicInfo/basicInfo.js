// pages/BusinessCardsMX/BusinessCardsMX.js

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
    imgUrl: "",
    rname: "", //姓名
    phone: "", //手机号码
    email: "", //邮箱
    weixin: "", //微信
    company: "", //公司名
    job: "", //职位
    signature: "", //个性签名
    cardId: "",
    logoUrl: "", //公司logo
    address: "", //地址
    IsSub: "",
    userInfo: {
      avatarUrl: "", //用户头像
      nickName: "", //用户昵称
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let [
      that,
      token,
      url
    ] = [
      this,
      wx.getStorageSync("uid"),
      dataUrl + "/Api/Member/getUserInfo"
    ]
    let data = {
      token: token,
      type: 1
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        // console.log("res", data)
        if (res.data.code == 0) {
          let resData = res.data.data
          let icon = resData.icon
          let logo = resData.logo
          if (icon.substr(0, 2) == "ht") {
            icon = resData.icon
          } else {
            icon = picUrl + resData.icon
            logo = picUrl + resData.logo
          }
          that.setData({
            cardId: resData.id,
            imgUrl: icon,
            rname: resData.real_name, //姓名
            phone: resData.phone, //手机号码
            email: resData.email, //邮箱
            weixin: resData.weixin, //微信
            company: resData.name, //公司名
            logoUrl: logo,
            job: resData.job, //职位
            address: resData.address,
            signature: resData.signature, //个性签名
          })
          // console.log("icon", that.data.logoUrl)
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 保存资料
  // saveTap() {
  //   let [
  //     that,
  //     token,
  //     url
  //   ] = [
  //     this,
  //     wx.getStorageSync("uid"),
  //     dataUrl + "/Api/Member/getUserInfo"
  //   ]
  //   let data = {
  //     token: token,
  //     type: 1
  //   }
  //   network.POST({
  //     params: data,
  //     url: url,
  //     success: res => {
  //       if (res.data.code == 0) {
  //         console.log("基本资料", res);
  //         // let resData = res.data.data
  //         // wx.setStorageSync("isVip", resData.is_vip)
  //         // that.setData({
  //         //   phone: resData.phone || "",
  //         //   isVip: resData.is_vip,
  //         //   isOpenVip: resData.isOpenVip,
  //         //   isOpenAlliance: resData.isOpenAlliance,
  //         //   isOpenCompany: resData.isOpenCompany,
  //         //   isMark: resData.isMakeCard
  //         // })
  //       }
  //     },
  //     fail: res => {
  //       console.log(res)
  //     }
  //   })
  // },
  formSubmit: function (e) {
    // console.log('e', e);
    let [that, eValue, url, token] = [this, e.detail.value, dataUrl + "/Api/Member/getUserInfo", wx.getStorageSync('uid')]
    that.setData({
      IsSub: true
    })
    let [rname, phone, email, weixin, company, job, signature, cardId, address] = [eValue.rname, eValue.phone, eValue.email, eValue.weixin, eValue.company, eValue.job, eValue.signature, that.data.cardId, eValue.address]
    if (rname == "") {
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
        showCancel: false,
        success: res => {
          if (res.confirm) {
            that.setData({
              IsSub: ""
            })
          }
        }
      })
      return
    }
    if (phone == '' || !(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(phone))) {
      wx.showModal({
        title: '提示',
        content: '手机号码不正确',
        showCancel: false,
        success: res => {
          if (res.confirm) {
            that.setData({
              IsSub: ""
            })
          }
        }
      })
      return;
    }
    // if (email == "" || !(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email))) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '邮箱格式不正确',
    //     showCancel: false,
    //     success: res => {
    //       if (res.confirm) {
    //         that.setData({
    //           IsSub: ""
    //         })
    //       }
    //     }
    //   })
    //   return;
    // }
    // if (weixin == "") {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请输入微信号',
    //     showCancel: false,
    //     success: res => {
    //       if (res.confirm) {
    //         that.setData({
    //           IsSub: ""
    //         })
    //       }
    //     }
    //   })
    //   return
    // }
    // if (company == "") {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请输入公司名称',
    //     showCancel: false,
    //     success: res => {
    //       if (res.confirm) {
    //         that.setData({
    //           IsSub: ""
    //         })
    //       }
    //     }
    //   })
    //   return
    // }
    // if (job == "") {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请输入职位名称',
    //     showCancel: false,
    //     success: res => {
    //       if (res.confirm) {
    //         that.setData({
    //           IsSub: ""
    //         })
    //       }
    //     }
    //   })
    //   return
    // }
    rname = rname.replace(/[& ]/g, "")
    phone = phone.replace(/[& ]/g, "")
    email = email.replace(/[& ]/g, "")
    weixin = weixin.replace(/[& ]/g, "")
    company = company.replace(/[& ]/g, "")
    job = job.replace(/[& ]/g, "")
    signature = signature.replace(/[& ]/g, "")
    address = address.replace(/[& ]/g, "")
    let data = {
      token: token,
      type: 2,
      id: cardId,
      real_name: rname,
      phone: phone,
      email: email,
      weixin: weixin,
      name: company,
      job: job,
      signature: signature,
      address: address
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        // console.log("resData", data)
        console.log("res", res)
        if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            content: "编辑成功",
            showCancel: false,
            success: res => {
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
            success: res => {
              if (res.confirm) {

              }
            }
          })
        }
        that.setData({
          IsSub: ""
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  logoImg: function () {
    let [that, url, token] = [this, dataUrl + "/Api/Member/uploadLogo", wx.getStorageSync('uid')]
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'copmpressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths
        that.setData({
          logoUrl: tempFilePaths
        })
        console.log(token)
        let data1 = {
          token: token,
          card_id: that.data.cardId,
          app_id: "wx5550cef350778b61"
        }
        wx.uploadFile({
          url: url,
          filePath: tempFilePaths[0],
          header: {
            'content-type': 'json'
          },
          name: 'logo',
          formData: data1,
          success: res => {
            console.log("logo", res)

          }
        })
      },
    })
  },
  upLoadImg: function () {
    let [that, url, token] = [this, dataUrl + "/Api/Member/uploadIcon", wx.getStorageSync('uid')]
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'copmpressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths
        that.setData({
          imgUrl: tempFilePaths
        })
        console.log(token)
        let data1 = {
          token: token,
          card_id: that.data.cardId,
          app_id: "wx5550cef350778b61"
        }
        wx.uploadFile({
          url: url,
          filePath: tempFilePaths[0],
          header: {
            'content-type': 'json'
          },
          name: 'icon',
          formData: data1,
          success: res => {
            console.log("front", res)
          }
        })
      },
    })
  },
})