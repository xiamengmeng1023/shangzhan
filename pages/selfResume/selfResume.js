// pages/selfResume/selfResume.js
const app = getApp();
const dataUrl = app.globalData.url;
const picUrl = app.globalData.imgUrl;
const network = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textLen: 0,
    card_id: "",
    getUrl: '',
    dataName: '',
    // textarea: "",
    placeholder: null,
    selfResume: [
      "个人简介",
      "让ta更好的了解自己",
      "例如：xxx职业教育创始人，我的工作很有意义，就是帮助那些有文化但是没有一技之长的人，教他们一项实用技术，给他们谋一份工作"
    ],
    merit: [
      "擅长领域",
      "描述自己擅长的领域",
      "有什么专长、做过最有成就的事、能提供的资源和帮助"
    ],
    demand: [
      "资源需求",
      "描述自己的需求",
      "想要找什么样的人脉、有什么样的需求或期待"
    ],
    reNum: "0",
    auto_height: true,
    maxlen: "200",
    textVal: "",
  },
  bindTextAreaBlur: function (e) {
    // console.log(e.detail.value)
  },

  bindFormSubmit: function (e) {
    let [that, token, textVal, getUrl, card_id] = [this, wx.getStorageSync('uid'),
      this.data.textVal, this.data.getUrl, this.data.card_id
    ]


    // let data3 = {
    //   token: token,
    //   require: textVal,
    //   card_id: card_id
    // }
    textVal = textVal.replace(/[& ]/g, "");

    let data
    if (that.data.dataName === "summary") {
      data = {
        token: token,
        summary: textVal,
        card_id: card_id
      }
    }
    if (that.data.dataName === "expert") {
      data = {
        token: token,
        expert: textVal,
        card_id: card_id
      }
    }
    if (that.data.dataName === "require") {
      data = {
        token: token,
        resource: textVal,
        card_id: card_id
      }
    }
    // console.log('111111111', data);
    network.POST({
      params: data,
      url: getUrl,
      success: res => {
        // console.log("res", data)
        // console.log("res", res)
        if (res.data.code === 0) {
          // let [resData] = [res.data.data]
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 600
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 800)
        }
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
    let that = this
    let pageindex = Number(options.pageindex);
    let summaryUrl = dataUrl + "/Api/Member/make_card_summary"
    let expertUrl = dataUrl + "/Api/Member/make_card_expert"
    let requireUrl = dataUrl + "/Api/Member/make_card_require"
    let card_id = options.card_id
    that.setData({
      card_id: card_id
    })

    // console.log('pageindex', pageindex);
    if (pageindex === 2) {
      that.setData({
        placeholder: that.data.selfResume,
        getUrl: summaryUrl,
        dataName: 'summary'
      })
    }
    if (pageindex === 5) {
      that.setData({
        placeholder: that.data.merit,
        getUrl: expertUrl,
        dataName: 'expert'
      })
    }
    if (pageindex === 6) {
      that.setData({
        placeholder: that.data.demand,
        getUrl: requireUrl,
        dataName: 'require'
      })
    }
    // console.log('showpage', this.data.showpage);
    wx.setNavigationBarTitle({
      title: that.data.placeholder[0]
    })
  },

  onShow() {
    let that = this
    let token = wx.getStorageSync("uid")
    let url = dataUrl + "/Api/Member/make_card"
    let dataName = that.data.dataName
    let data = {
      token: token,
      type: 1,
      card_id: that.data.card_id
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        if (res.data.code === 0) {
          let resData = res.data.data
          if (resData[dataName] !== null || '') {
            // console.log("resData.dataName", resData[dataName])
            let textnum = resData[dataName].length
            // console.log('textnum', textnum);
            that.setData({
              textVal: resData[dataName],
              reNum: textnum
            })
          }
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 监听textarea
  bindWordLimit(e) {
    // console.log('e', e.detail.value);
    this.setData({
      textVal: e.detail.value
    })
    let len = e.detail.cursor
    if (len <= 200) {
      this.setData({
        reNum: len
      })
    }
    if (len > this.data.max) return;
  },
})