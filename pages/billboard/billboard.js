// pages/billboard/billboard.js


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
    flag: "",
    picUrl: picUrl,
    isItem: false,
    type: 1,
    list: [],
    info: [],
    isShowType: 1,
    from: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.from
    let that = this
    // console.log('options', options);
    // this.setData({
    //   from: type
    // })
    console.log('type', type);
    switch (type) {
      case '1':
        that.setData({
          isShowType: 1,
          flag: "1"
        })
        that.tugOrder()
        wx.setNavigationBarTitle({
          title: '风云榜'
        })
        // console.log("风云榜", that.data.isShowType)

        break;
      case '2':
        that.setData({
          isShowType: 2,
          flag: "3"
        })
        that.companyTugOrder()

        wx.setNavigationBarTitle({
          title: '企业榜'
        })
        // console.log("企业榜", that.data.isShowType)
        break;
      default:
        break;
    }
    // if (type === '1') {
    //   this.setData({
    //     isShowType: 1
    //   })
    //   this.tugOrder()
    // }
    // if (type === '2') {
    //   this.setData({
    //     isShowType: 2
    //   })
    //   this.companyTugOrder()
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getIndex(e) {
    // console.log('e', e.currentTarget.dataset.index)
    let flag = e.currentTarget.dataset.index
    if (flag == "1") {
      this.setData({
        flag: "1"
      })
      this.tugOrder()
    }
    if (flag == "2") {
      this.setData({
        flag: "2"
      })
      this.wealthOrder()
    }
    if (flag == "3") {
      this.setData({
        flag: "3"
      })
      this.companyTugOrder()
    }
    if (flag == "4") {
      this.setData({
        flag: "4"
      })
      this.companyWealthOrder()
    }
  },
  // 风云-拓客榜
  tugOrder() {
    let [
      that,
      token,
      url
    ] = [
      this,
      wx.getStorageSync("uid"),
      dataUrl + "/Api/Find/tugOrder"
    ]
    let params = {
      token: token
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        if (res.data.code == 0) {
          let resData = res.data.data

          for (let i = 0; i < resData.listData.length; i++) {
            if (Number(resData.listData[i].ranking) < 10) {
              resData.listData[i].ranking = '0' + resData.listData[i].ranking
              // console.log('i', resData.listData[i].ranking);
            }
          }

          if (Number(resData.userData[0].ranking) < 10) {
            resData.userData[0].ranking = '0' + resData.userData[0].ranking
            // console.log('i', resData.listData[i].ranking);
          }
          // console.log("风云-拓客榜", resData)
          that.setData({
            list: resData.listData,
            info: resData.userData[0]
          })
        }
      }
    })
  },

  // 风云-财富榜
  wealthOrder() {
    let [
      that,
      token,
      url
    ] = [
      this,
      wx.getStorageSync("uid"),
      dataUrl + "/Api/Find/wealthOrder"
    ]
    let params = {
      token: token
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        console.log("风云-财富榜", res)
        if (res.data.code == 0) {
          let resData = res.data.data

          for (let i = 0; i < resData.listData.length; i++) {
            if (Number(resData.listData[i].ranking) < 10) {
              resData.listData[i].ranking = '0' + resData.listData[i].ranking
              // console.log('i', resData.listData[i].ranking);
            }
          }

          if (Number(resData.userData[0].ranking) < 10) {
            resData.userData[0].ranking = '0' + resData.userData[0].ranking
            // console.log('i', resData.listData[i].ranking);
          }
          // console.log("风云-拓客榜", resData)
          that.setData({
            list: resData.listData,
            info: resData.userData[0]
          })
        }
      }
    })
  },

  // 企业榜-拓客榜
  companyTugOrder() {
    let [that, token, url] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Find/companyTugOrder"]
    let params = {
      token: token
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        console.log("企业榜-拓客榜", res)
        if (res.data.code == 0) {
          let resData = res.data.data
          for (let i = 0; i < resData.listData.length; i++) {
            if (Number(resData.listData[i].ranking) < 10) {
              resData.listData[i].ranking = '0' + resData.listData[i].ranking
              // console.log('i', resData.listData[i].ranking);
            }
          }

          if (Number(resData.userData[0].ranking) < 10) {
            resData.userData[0].ranking = '0' + resData.userData[0].ranking
            // console.log('i', resData.listData[i].ranking);
          }
          // console.log("风云-拓客榜", resData)

          that.setData({
            list: resData.listData,
            info: resData.userData[0]
          })
          console.log('list', that.data.list);

        }
      }
    })
  },
  //  企业榜-财富榜
  companyWealthOrder() {
    let [that, token, url] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Find/companyWealthOrder"]
    let params = {
      token: token
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        console.log("企业榜-财富榜", res)
        if (res.data.code == 0) {
          let resData = res.data.data
          for (let i = 0; i < resData.listData.length; i++) {
            if (Number(resData.listData[i].ranking) < 10) {
              resData.listData[i].ranking = '0' + resData.listData[i].ranking
              // console.log('i', resData.listData[i].ranking);
            }
          }

          if (Number(resData.userData[0].ranking) < 10) {
            resData.userData[0].ranking = '0' + resData.userData[0].ranking
            // console.log('i', resData.listData[i].ranking);
          }
          // console.log("风云-拓客榜", resData)
          that.setData({
            list: resData.listData,
            info: resData.userData[0]
          })
        }
      }
    })
  },


})