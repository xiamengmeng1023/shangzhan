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
    IsSub: "",
    radio: [{
      name: "企业标准版",
      type: 1,
      price: 1980,
      oldPrice: 3600,
      checked: true,
    }, {
      name: "企业定制版",
      type: 2,
      price: 5000,
      oldPrice: 9800,
      checked: false,
    }, ],

    setMealList: [{
        image: picUrl + "/Style/images/applets/assets/v3_enterpriseStatus_managementidentity.png",
        // listName: "noble",
        listName: "img",
        setMealName: "管理身份"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_join_present.png",
        // listName: "makeCard",
        listName: "img",
        setMealName: "账户赠送"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_join_privilege.png",
        // listName: "smallShop",
        listName: "img",
        setMealName: "推广特权"
      },

      {
        image: picUrl + "/Style/images/applets/assets/v3_join_award.png",
        // listName: "website",
        listName: "img",
        setMealName: "全栈有奖"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_join_interspace.png",
        // listName: "application",
        listName: "img",
        setMealName: "商栈空间"
      }, {
        image: picUrl + "/Style/images/applets/assets/v3_topUpVip_businesscard.png",
        //  listName: "makeCard",
        listName: "img",
        setMealName: "制作名片"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_topUpVip_message.png",
        //  listName: "smallShop",
        listName: "img",
        setMealName: "立体消息"
      },

      {
        image: picUrl + "/Style/images/applets/assets/v3_topUpVip_officialwebsite.png",
        //  listName: "website",
        listName: "img",
        setMealName: "绑定官网"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_topUpVip_Smallshop.png",
        //  listName: "application",
        listName: "img",
        setMealName: "绑定微店"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_topUpVip_share.png",
        //  listName: "application",
        listName: "img",
        setMealName: "分享有奖"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_topUpVip_protectionaward.png",
        //  listName: "application",
        listName: "img",
        setMealName: "环保有奖"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_topUpVip_rebate.png",
        //  listName: "application",
        listName: "img",
        setMealName: "两级返佣"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_topUpVip_appcenter.png",
        //  listName: "application",
        listName: "img",
        setMealName: "应用中心"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_enterpriseStatus_identitypresent.png",
        // listName: "makeCard",
        listName: "img",
        setMealName: "身份赠送"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_enterpriseStatus_CRMback-stagemanagement.png",
        // listName: "smallShop",
        listName: "img",
        setMealName: "CRM管理"
      },
    ],
    setMealListTo: [{
        image: picUrl + "/Style/images/applets/assets/v3_enterpriseStatus_managementidentity.png",
        // listName: "noble",
        listName: "img",
        setMealName: "管理身份"
      }, {
        image: picUrl + "/Style/images/applets/assets/v3_enterpriseStatus_OEM.png",
        // listName: "noble",
        listName: "img",
        setMealName: "企业贴牌"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_enterpriseStatus_definition.png",
        // listName: "smallShop",
        listName: "img",
        setMealName: "定制LG"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_enterpriseStatus_present.png",
        // listName: "makeCard",
        listName: "img",
        setMealName: "赠送子账户"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_enterpriseStatus_autonomously.png",
        // listName: "website",
        listName: "img",
        setMealName: "自主收款"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_enterpriseStatus_function.png",
        // listName: "application",
        listName: "img",
        setMealName: "选择功能"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_enterpriseStatus_drill.png",
        // listName: "application",
        listName: "img",
        setMealName: "训练营"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_join_present.png",
        // listName: "makeCard",
        listName: "img",
        setMealName: "账户赠送"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_join_privilege.png",
        // listName: "smallShop",
        listName: "img",
        setMealName: "推广特权"
      },

      {
        image: picUrl + "/Style/images/applets/assets/v3_join_award.png",
        // listName: "website",
        listName: "img",
        setMealName: "全栈有奖"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_join_interspace.png",
        // listName: "application",
        listName: "img",
        setMealName: "商栈空间"
      }, {
        image: picUrl + "/Style/images/applets/assets/v3_topUpVip_businesscard.png",
        //  listName: "makeCard",
        listName: "img",
        setMealName: "制作名片"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_topUpVip_message.png",
        //  listName: "smallShop",
        listName: "img",
        setMealName: "立体消息"
      },

      {
        image: picUrl + "/Style/images/applets/assets/v3_topUpVip_officialwebsite.png",
        //  listName: "website",
        listName: "img",
        setMealName: "绑定官网"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_topUpVip_Smallshop.png",
        //  listName: "application",
        listName: "img",
        setMealName: "绑定微店"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_topUpVip_share.png",
        //  listName: "application",
        listName: "img",
        setMealName: "分享有奖"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_topUpVip_protectionaward.png",
        //  listName: "application",
        listName: "img",
        setMealName: "环保有奖"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_topUpVip_rebate.png",
        //  listName: "application",
        listName: "img",
        setMealName: "两级返佣"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_topUpVip_appcenter.png",
        //  listName: "application",
        listName: "img",
        setMealName: "应用中心"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_enterpriseStatus_identitypresent.png",
        // listName: "makeCard",
        listName: "img",
        setMealName: "身份赠送"
      },
      {
        image: picUrl + "/Style/images/applets/assets/v3_enterpriseStatus_CRMback-stagemanagement.png",
        // listName: "smallShop",
        listName: "img",
        setMealName: "CRM管理"
      },
    ],
    type: 0
  },

  radioTap(e) {
    console.log("e", e)
    let [eVal, radio] = [e.currentTarget.dataset.id * 1, this.data.radio];
    for (let i = 0, len = radio.length; i < len; i++) {
      if (i == eVal) {
        radio[i].checked = true
      } else {
        radio[i].checked = false
      }
    }
    this.setData({
      radio: radio,
      type: eVal
    })
  },


  radioChange: function(e) {
    console.log("e", e)
    let [eVal, radio] = [e.detail.value * 1, this.data.radio]
    for (let i = 0, len = radio.length; i < len; i++) {
      if (i == eVal) {
        radio[i].checked = true
      } else {
        radio[i].checked = false
      }
    }
    this.setData({
      radio: radio,
      type: eVal
    })
    console.log("radio", this.data.radio)
  },

  /**
   * formTab 暂时性修改上个页面的值
   */
  formSubmit: function(e) {
    let [that, code, token, url, eValue] = [this, wx.getStorageSync("code"), wx.getStorageSync('uid'), dataUrl + "/Api/Wxpay/companyPay", e.detail.value.radio]
    that.setData({
      IsSub: true
    })
    // {
    //   name: "企业定制版",
    //     type: 2,
    //       price: 5000,
    //         oldPrice: 9800,
    //           checked: "",
    // }


    let radioData = that.data.radio
    console.log("radioData", radioData)
    let data = {
      code: code,
      token: token,
      type: radioData[eValue].type,
      order_title: radioData[eValue].name,
      order_amount: radioData[eValue].price,
      order_original_price: radioData[eValue].oldPrice,
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("res", res)
        console.log("res", data)
        if (res.data.code == 0) {
          let resData = res.data.data
          let [timestamp, nonceStr, pAge, signType, paySign, orderSn] = [resData.timestamp, resData.nonceStr, resData.package, resData.signType, resData.paySign, resData.order_sn]
          wx.requestPayment({
            timeStamp: timestamp,
            nonceStr: nonceStr,
            package: pAge,
            signType: signType,
            paySign: paySign,
            success: res => {
              console.log("success", res)
              let url1 = dataUrl + "/Api/Wxpay/queryOrder"
              let data1 = {
                order_sn: orderSn
              }
              network.POST({
                url: url1,
                params: data1,
                success: res => {
                  if (res.data.code == 0) {
                    let resData = res.data.data.order_type
                    wx.showModal({
                      title: res.data.msg,
                      content: resData == 2 ? '恭喜你成功申请企业标准版' : '恭喜你成功申请企业定制版版',
                      showCancel: false,
                      success(res) {
                        if (res.confirm) {
                          wx.navigateBack({
                            delta: 1
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
            fail: res => {
              console.log("fail", res)
              wx.showModal({
                title: res.data.msg,
                content: '你已取消订单',
                showCancel: false,
              })

            },
            complete: res => {
              console.log("complete", res)
              that.setData({
                IsSub: false
              })
            }
          })
        }
      },
      fail: res => {

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },


})