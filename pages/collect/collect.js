// pages/collect/collect.js

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
    isSelect: 1,
    page: 1,
    listRows: 18,
    list: [
      '商品',
      '职位'
    ],
    cardId: '',
    goodslist: []
    // waterFallImages: [{
    //   id: '1',
    //   src: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1554189125&di=69f32cffdc0484f48cdd852ded996f6b&src=http://hbimg.b0.upaiyun.com/28a4962c297205e0868cdb45bb527e2bc5319f08f019-l7N1A3_fw658',
    //   name: '照片01',
    //   data: '2017/11/1'
    // }, {
    //   id: '2',
    //   src: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1554189125&di=69f32cffdc0484f48cdd852ded996f6b&src=http://hbimg.b0.upaiyun.com/28a4962c297205e0868cdb45bb527e2bc5319f08f019-l7N1A3_fw658',
    //   name: '照片02',
    //   data: '2017/11/2'
    // }, {
    //   id: '3',
    //   src: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1554189125&di=69f32cffdc0484f48cdd852ded996f6b&src=http://hbimg.b0.upaiyun.com/28a4962c297205e0868cdb45bb527e2bc5319f08f019-l7N1A3_fw658',
    //   name: '照片03',
    //   data: '2017/11/3'
    // }, {
    //   id: '4',
    //   src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554199270658&di=42db0c5f798c73607913830eea7c8caf&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2Ffcfaaf51f3deb48f87661219f11f3a292cf578ed.jpg',
    //   name: '照片04',
    //   data: '2017/11/4'
    // }, {
    //   id: '5',
    //   src: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1554189125&di=69f32cffdc0484f48cdd852ded996f6b&src=http://hbimg.b0.upaiyun.com/28a4962c297205e0868cdb45bb527e2bc5319f08f019-l7N1A3_fw658',
    //   name: '照片05',
    //   data: '2017/11/5'
    // }]
  },
  //  微名片获取card
  getbussness() {
    let [that, token, getMyCardUrl] = [
      this,
      wx.getStorageSync('uid'),
      dataUrl + '/Api/Cardlist/getMyCard',
    ]

    let data = {
      token: token,
    }
    // 微名片请求
    network.POST({
      params: data,
      url: getMyCardUrl,
      success: res => {
        // console.log("微名片请求", res);
        if (res.data.code === 0) {
          let resData = res.data.data
          console.log('cardid是', resData[0].id);
          resData[0].name = ''
          that.setData({
            cardId: resData[0].id,
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },


  isSelectfunc(e) {
    // console.log(e.currentTarget.dataset.index)
    this.setData({
      isSelect: e.currentTarget.dataset.index
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.getbussness()
    let [
      that,
      token,
      isSelect,
      page,
      listRows,
      url
    ] = [
      this,
      wx.getStorageSync('uid'),
      this.data.isSelect,
      this.data.page,
      this.data.listRows,
      dataUrl + '/Api/Favorite/favoriteList',
    ]
    let data = {
      token: token,
      type: isSelect,
      page: page,
      listRows: listRows
      // app_id: 'wxde059b418de529cd'
    }
    // 动态详情接口
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log('收藏', data)
        console.log('动态详情', res)
        if (res.data.code === 0) {
          let resData = res.data.data

          that.setData({
            goodslist: resData,
          })

        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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