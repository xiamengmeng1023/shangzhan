const app = getApp();
const picUrl = app.globalData.imgUrl;
const iconUrl = app.globalData.iconUrl;

const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: picUrl,
    iconUrl: iconUrl,
    MyCard: [],
    imgUrl: '',
    checked: 2,
    checkedId: 1
  },
  checkTap: function (e) {
    console.log("e", e.currentTarget.dataset.id)

    let [that, imgUrl, id, token, url] = [this, this.data.imgUrl, e.currentTarget.dataset.id, wx.getStorageSync("uid"), dataUrl + "/Api/Cardlist/setTemplet"]
    wx.showModal({
      title: '提示',
      content: '是否更换名片模板',
      success(res) {
        if (res.confirm) {
          for (let i = 0, len = imgUrl.length; i < len; i++) {
            if (id == imgUrl[i].id) {
              imgUrl[i].is_check = true
            } else {
              imgUrl[i].is_check = false
            }
          }
          let params = {
            token: token,
            templet_id: id
          }
          network.POST({
            params: params,
            url: url,
            success: res => {
              console.log(res.data.data);

              if (res.data.code == 0) {
                that.setData({
                  imgUrl: imgUrl,
                  // checkedIndex: this.data.checkedIndex
                })
              }
              that.onShow()
            },
            fail: res => {
              console.log("resFail", res)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  getbussness() {
    let [that, token, getMyCardUrl] = [
      this,
      wx.getStorageSync('uid'),
      dataUrl + '/Api/Cardlist/getMyCard',
    ]

    let data = {
      token: token,
      order_status: 0
    }
    // 微名片请求
    network.POST({
      params: data,
      url: getMyCardUrl,
      success: res => {
        // console.log("微名片请求", res);
        if (res.data.code === 0) {
          let resData = res.data.data

          that.setData({
            MyCard: resData[0],
          })

          let reg = /^(\d{3})\d*(\d{4})$/;
          let str2 = resData[0].phone.replace(reg, '$1****$2')
          this.setData({
            phPhone: str2
          })

        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },


  onShow: function () {
    this.getbussness()
    let [that, token, url] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Cardlist/getTempletList"]
    let params = {
      token: token
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        if (res.data.code == 0) {
          let checkedData = res.data.data
          for (let i = 0, len = checkedData.length; i < len; i++) {
            if (checkedData[i].is_check == true) {
              console.log('checkedData[i]', Number(checkedData[i].id));
              that.setData({
                checkedId: Number(checkedData[i].id)
              })
            } else {

            }
          }

        }
      },
      fail: res => {
        console.log("res", res)
      }
    })
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

  }
})