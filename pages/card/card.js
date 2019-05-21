// pages/card/card.js


const app = getApp();
// let eventSegment_g = app.globalData.eventSegment;
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
    isaddLab: true,
    isShowDel: false,
    ismask: true,
    isimg: 'down',
    scrollId: '',
    addLab: '',
    aIndex: 0,
    clickId: 0,
    // eventSegment: eventSegment_g,
    // -------------------
    picUrl: picUrl,
    cardList: [],
    cardGroup: [],
    IsShow: false,
    page: 2,
    rows: 4,
    getcardListPage: 1,
    loadShow: false,
  },

  onShow: function () {
    this.getGroup()
    this.getcardList()
  },

  // 获取分组
  getGroup() {
    let [
      that,
      token,
      cardGroupUrl,
      isVip
    ] = [
      this,
      wx.getStorageSync('uid'),
      dataUrl + '/Api/CardGroup/cardGroupList',
      wx.getStorageSync('isVip')
    ]
    if (isVip === "1") {
      that.setData({
        IsShow: false
      })
    } else {
      that.setData({
        IsShow: true
      })
    }
    let data1 = {
      token: token,
    }
    // 获取分组
    network.POST({
      params: data1,
      url: cardGroupUrl,
      success: res => {
        if (res.data.code === 0) {
          console.log('分组列表', res);
          that.setData({
            cardGroup: res.data.data
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 获取名片列表
  getcardList() {
    this.setData({
      loadShow: !this.data.loadShow
    })
    let [
      that,
      token,
      getcardListPage,
      cardListUrl,
    ] = [
      this,
      wx.getStorageSync('uid'),
      this.data.getcardListPage,
      dataUrl + "/Api/Cardlist/getCardlist",
    ]
    let data = {
      token: token,
      page: getcardListPage,
      list_rows: 4
    }
    network.POST({
      params: data,
      url: cardListUrl,
      success: res => {
        if (res.data.code === 0) {
          // console.log('res111111111', res);
          let [resData, cardList] = [res.data.data, that.data.cardList]
          for (let i = 0, len = resData.length; i < len; i++) {
            if (!(resData[i].icon.substring(-1, 2) == "ht")) {
              resData[i].icon = picUrl + resData[i].icon
              resData[i].listMore = false
            }
          }
          if (resData.length >= 0) {
            getcardListPage++
            that.setData({
              cardList: that.data.cardList.concat(resData),
              getcardListPage: getcardListPage,
            })
          }
        }
      },
      fail: res => {
        console.log(res)
      }
    })
    that.setData({
      loadShow: !this.data.loadShow
    })
  },

  // 触底加载
  onReachBottom() {
    console.log('111111111111111111111111111');
    let getcardListPage = this.data.getcardListPage

    console.log('getcardListPage', getcardListPage);
    this.getcardList()
  },
  nextAlert: function () {
    wx.showModal({
      title: '提示',
      content: '此用户当前不是环保使者',
      showCancel: false,
      success(res) {
        if (res.confirm) {}
      }
    })
  },
  nextTap: function (e) {
    let [that, token, url, id] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Member/is_make_card", e.currentTarget.dataset.id]
    let data = {
      token: token
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        // is_make_card  0：未填写   1 :填写
        if (res.data.code == 0) {
          wx.navigateTo({
            url: `/pages/card_details/card_details?cardid=${id}`
          });
        }
      },
      fail: res => {
        console.log("res", res)
      }
    })
  },

  ml_tosearch() {
    wx.navigateTo({
      url: '../../pages/search/search'
    })
  },

  // 点击显示隐藏mask
  ml_clickSwitch() {
    // if (this.data.ismask == false && this.data.isimg == 'up') {
    //   this.setData({
    //     ismask: true,
    //     isimg: 'down',
    //     isaddLab: true
    //   })
    // } else {
    //   this.setData({
    //     ismask: false,
    //     isimg: 'up',
    //   })
    // }
    switch (this.data.ismask) {
      case false:
        this.setData({
          ismask: true,
          isimg: 'down',
          isaddLab: true,
          isShowDel: true
        })
        break;
      case true:
        this.setData({
          ismask: false,
          isimg: 'up',
          isShowDel: false
        })
        break;
      default:
        break;
    }
  },
  ml_isShowAddOrDEL() {
    if (this.data.isaddLab == false) {
      this.setData({
        isaddLab: true
      })
    } else {
      this.setData({
        isaddLab: false
      })
    }
  },
  // 点击删除标签
  // Api/CardGroup/deleteGroup
  // card_group_id
  ml_delLabel(e) {
    let [
      that,
      token,
      url,
      id
    ] = [
      this,
      wx.getStorageSync("uid"),
      dataUrl + "/Api/CardGroup/deleteGroup",
      e.currentTarget.dataset.id,
    ]
    let data = {
      token: token,
      card_group_id: id
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        // is_make_card  0：未填写   1 :填写
        if (res.data.code == 0) {
          // console.log('删除成功', res);
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 700
          })
          that.getGroup()
        } else {
          wx.showToast({
            title: '删除失败',
            icon: 'none',
            duration: 700
          })
          return
        }
      },
      fail: res => {
        console.log("res", res)
      }
    })
  },
  // 获取val值
  inputVal(e) {

    this.setData({
      addLab: e.detail.value
    })
    // console.log('input的值为', this.data.addLab);
  },
  // 添加标签分组
  addLabGrouping() {
    if (this.data.addLab == '') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: "请输入分组名称",
        success(res) {
          if (res.confirm) {}
        }
      })
      return
    }
    if (this.data.addLab.length > 5) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: "分组名称不能超过4个字",
        success(res) {
          if (res.confirm) {}
        }
      })
      return
    }
    let [
      that,
      token,
      url,
      name
    ] = [
      this,
      wx.getStorageSync("uid"),
      dataUrl + "/Api/CardGroup/addCardGroup",
      this.data.addLab
    ]
    let data = {
      token: token,
      name: name
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        // is_make_card  0：未填写   1 :填写
        if (res.data.code == 0) {
          console.log('添加成功', res);
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1500
          })
          that.setData({
            isaddLab: true,
            addLab: '',
            isShowDel: false
          })
          that.getGroup()
        } else if (res.data.code == 700) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: "分组已存在",
            success(res) {
              if (res.confirm) {}
            }
          })
          return
        }
      },
      fail: res => {
        console.log("res", res)
      }
    })

  },
  // 点击显示删除按钮
  tapShowDelBtn() {
    let flag = this.data.isShowDel
    // console.log('flag', flag);
    if (flag == true) {
      this.setData({
        isShowDel: false
      })
    } else {
      this.setData({
        isShowDel: true
      })
    }

  },
  // 获取时间分组数据
  getTimeGroup_card(e) {
    let [
      that,
      token,
      index,
      cardListUrl,
    ] = [
      this,
      wx.getStorageSync('uid'),
      e.currentTarget.dataset.type,
      dataUrl + "/Api/Cardlist/getCardlist",
    ]
    let data = {
      token: token,
      time_type: index
    }
    network.POST({
      params: data,
      url: cardListUrl,
      success: res => {
        if (res.data.code === 0) {
          wx.showToast({
            title: '加载中...',
            mask: true,
            icon: 'loading',
            duration: 300,
            success: () => {
              that.setData({
                cardList: res.data.data,
                aIndex: index
              })
            }
          })
          // console.log('获取时间分组', res);

          // that.ml_clickSwitch()
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  getTimeGroup_mask(e) {
    let scrollId = e.currentTarget.id
    let [
      that,
      token,
      index,
      cardListUrl,
    ] = [
      this,
      wx.getStorageSync('uid'),
      e.currentTarget.dataset.type,
      dataUrl + "/Api/Cardlist/getCardlist",
    ]
    console.log('data111111', e);

    let data = {
      token: token,
      time_type: index
    }
    network.POST({
      params: data,
      url: cardListUrl,
      success: res => {
        if (res.data.code === 0) {
          wx.showToast({
            title: '加载中...',
            mask: true,
            icon: 'loading',
            duration: 300,
            success: () => {
              that.setData({
                cardList: res.data.data,
                aIndex: index,
                isimg: 'down',
                ismask: true,
                isShowDel: true,
                scrollId: scrollId
              })
            }
          })
          console.log('获取时间分组', res);

          // that.ml_clickSwitch()
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  // 获取自定义的名片详情列表：Api/CardGroup/cardGroupMemberList
  getGroupInfo_card(e) {
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    // console.log('e', e);
    // clickId: id
    let [
      that,
      token,
      url,
    ] = [
      this,
      wx.getStorageSync("uid"),
      dataUrl + "/Api/CardGroup/cardGroupMemberList",
    ]
    that.setData({
      aIndex: index
    })
    let data = {
      token: token,
      card_group_id: id,
      listRows: 18,
      page: 1
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        // is_make_card  0：未填写   1 :填写
        let resData = res.data.data
        console.log('resData11111111111', resData);
        if (res.data.code == 0) {
          // debugger
          wx.showToast({
            title: '加载中...',
            mask: true,
            icon: 'loading',
            duration: 300,
            success: () => {
              that.setData({
                cardList: resData,
              })
            }
          })

          // console.log('获取分组为选中值的名片', that.data.cardList);

          // that.getcardList()
        }
      },
      fail: res => {
        console.log("res", res)
      }
    })

  },
  getGroupInfo_mask(e) {
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    let scrollId = e.currentTarget.id
    console.log('e', e);
    // clickId: id
    let [
      that,
      token,
      url,
    ] = [
      this,
      wx.getStorageSync("uid"),
      dataUrl + "/Api/CardGroup/cardGroupMemberList",
    ]
    let data = {
      token: token,
      card_group_id: id,
      listRows: 18,
      page: 1
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        // is_make_card  0：未填写   1 :填写
        let resData = res.data.data
        // console.log('resData11111111111', resData);
        if (res.data.code == 0) {
          // debugger
          wx.showToast({
            title: '加载中...',
            mask: true,
            icon: 'loading',
            duration: 300,
            success: () => {
              that.setData({
                cardList: resData,
                aIndex: index,
                isimg: 'down',
                ismask: true,
                scrollId: scrollId,
                isShowDel: true
              })
              console.log('scrollId', scrollId);
            }
          })


          // console.log('获取分组为选中值的名片', that.data.cardList);

          // that.getcardList()
        }
      },
      fail: res => {
        console.log("res", res)
      }
    })

  },

  // 下拉刷新
  onPullDownRefresh() {
    // wx.showToast({
    //   title: '正在刷新',
    //   icon: 'loading'
    // })
    this.onLoad()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500);
  },


})