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
    IsBind: false, //true :未绑定 false：绑定
    card_id: null,
    imgUrl: [],
    info: {},
    list: [{
        tit: '基本资料',
        isMb10: true,
        id: '1'
      },
      {
        tit: '个人简介',
        isMb10: false,
        id: '2'
      },
      {
        tit: '印象标签',
        isMb10: false,
        id: '3'
      },
      {
        tit: '个人图片',
        isMb10: true,
        id: '4'
      },
      {
        tit: '擅长领域',
        isMb10: false,
        id: '5'
      },
      {
        tit: '资源需求',
        isMb10: true,
        id: '6'
      },
      {
        tit: '名片模板',
        isMb10: false,
        id: '7'
      },
      {
        tit: '绑定公司',
        isMb10: false,
        id: '8'
      }
    ]
  },


  /**
   * 生命周期函数--监听页面加载
   */

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let [
      that,
      token,
      url,
      isBindUrl
    ] = [
      this,
      wx.getStorageSync('uid'),
      dataUrl + "/Api/Member/make_card", dataUrl + "/Api/Member/isBind"
    ]
    let data1 = {
      token: token
    }
    network.POST({
      params: data1,
      url: isBindUrl,
      success: res => {
        console.log("isBindUrl", res)
        if (res.data.code === 0) {
          let [resData] = [res.data.data]
          if (resData.is_bind == 1 || resData.is_bind == 2) {
            let info = {}
            info.bindUid = resData.bind_uid
            info.Isbind = resData.is_bind
            that.setData({
              IsBind: false,
              info: info
            })
          } else {
            that.setData({
              IsBind: true
            })
          }

        }
      },
      fail: res => {
        console.log(res)
      }
    })
    let data = {
      token: token,
      type: 1
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        if (res.data.code === 0) {
          let [resData] = [res.data.data]
          that.setData({
            card_id: resData.id
          })
          if (resData.status == 1) {
            // wx.showModal({
            //   title: '提示',
            //   content: '你已制作过名片',
            //   showCancel: false,
            //   success(res) {
            //     if (res.confirm) {
            //       wx.navigateBack({
            //         delta: 1
            //       })
            //     }
            //   }
            // })
          }
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  isWhichPageToGo(e) {
    // console.log('e', e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index

    let app = getApp()
    app.globalData.mydata = {
      index: index
    };
    //存储数据到app对象上
    // 点击跳转

    if (index === '1') {
      wx.navigateTo({
        url: '../../pages/basicInfo/basicInfo'
      })
    } else if (index === '2' || index === '5' || index === '6') {
      wx.navigateTo({
        url: `/pages/selfResume/selfResume?pageindex=${index}&card_id=${this.data.card_id}`
      })
    } else if (index === '3') {
      wx.navigateTo({
        url: `/pages/imageLabel/imageLabel?card_id=${this.data.card_id}`
      })
    } else if (index === '4') {
      wx.navigateTo({
        url: `/pages/Personal_image/Personal_image?card_id=${this.data.card_id}`
      })
    } else if (index === '7') {
      wx.navigateTo({
        url: "/pages/particularTem/particularTem"
      })
    } else if (index === '8') {
      let info = this.data.info;
      console.log('info', info);
      if (this.data.IsBind) {
        wx.navigateTo({
          url: `/pages/bind_company/bind_company?card_id=${this.data.card_id}`
        })
      } else {
        wx.navigateTo({
          url: `/pages/bind_end/bind_end?info=${JSON.stringify(info)}&card_id=${this.data.card_id}`
        })
      }
    }
  }


})