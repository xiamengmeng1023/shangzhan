// pages/imageLabel/imageLabel.js
const app = getApp()
const dataUrl = app.globalData.url
const picUrl = app.globalData.imgUrl
const iconUrl = app.globalData.iconUrl;
const network = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: iconUrl,
    tagList: [],
    checkedList: [],
    list: [],
    cardId: '',
    // --------------------
    defaultList: [],
    isWarning: false,
    isShowInput: false,
    isSelect: true,
    customTag: "",

    // noSelect: '',
    // noSelectArr: [],
    // hasNoSelectArr: true,
    imageLabel_tit2: '最多添加8个标签，已添加8个',

    colorArr: [
      '#06cf7d',
      '#4a90e2',
      '#0090ff',
      '#8b572a',
      '#f5a623',
      '#7ed321',
      '#F45E4B',
      '#417505'
    ],
    randomColorArr: []
  },

  onLoad: function (options) {
    let cardId = options.card_id
    this.setData({
      cardId: cardId
    })
    // console.log('cardId', cardId)
    this.ml_isColor()
  },

  onShow: function () {
    // this.getCheckedLab()
    let [that, token, url] = [this, wx.getStorageSync('uid'), dataUrl + "/Api/Member/make_card"]
    let data = {
      token: token,
      type: 1
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        if (res.data.code === 0) {
          // console.log("res", res)
          let [resData] = [res.data.data]
          let tagList = resData.tag_list
          let tab;
          // console.log("resData.tab", resData.tab)
          // console.log("resData.tab", resData.tab != "")

          if (resData.tab) {
            tab = resData.tab.split(',')
          } else {
            tab = []
          }
          that.listRestore(tab, tagList)
          that.setData({
            tagList: tagList
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  listRestore(event, tagList) {
    // console.log("event", event)
    // console.log("tagList", tagList)
    let checkedList = []
    for (let i = 0, len = event.length; i < len; i++) {
      for (let j = 0, leng = tagList.length; j < leng; j++) {
        if (event[i] == tagList[j].id) {
          tagList[j].checked = true
          checkedList.push(tagList[j])
        }
      }
    }
    this.setData({
      checkedList: checkedList,
      list: event
    })
  },
  // getCheckedLab() {
  //   let [that, token, url] = [
  //     this,
  //     wx.getStorageSync('uid'),
  //     dataUrl + '/Api/Member/make_card'
  //   ]
  //   let data = {
  //     token: token,
  //     type: 1
  //   }
  //   network.POST({
  //     params: data,
  //     url: url,
  //     success: res => {
  //       // console.log('res1111111111111111111111111', res.data.data.tab);
  //       if (res.data.code === 0) {
  //         let [resData] = [res.data.data]
  //         console.log('resData', resData.tag_list)
  //         // that.setData({
  //         //   tagList: resData.tag_list
  //         // })
  //         // 添加id为temp的数组到checkedlist
  //         let temp = res.data.data.tab.split(',')
  //         // console.log('this.data.tagList', this.data.tagList);
  //         let tempArr = resData.tag_list

  //         for (let j = 0; j < tempArr.length; j++) {
  //           // console.log('temp[i]', (temp[i]))
  //           for (let i = 0; i < temp.length; i++) {
  //             if (temp[i] == tempArr[j].id) {
  //               tempArr[j].checked = true
  //               that.data.checkedList.push(tempArr[j])
  //               break
  //             }
  //           }
  //         }
  //         that.setData({
  //           tagList: tempArr,
  //           checkedList: that.data.checkedList
  //         })
  //         // console.log('tempArrt', this.data.tagList)

  //         console.log('this.data.checkedList', that.data.checkedList)
  //       }
  //     },
  //     fail: res => {
  //       console.log(res)
  //     }
  //   })
  // },

  // 随机颜色
  ml_isColor() {
    let that = this,
      // typeList = that.data.typeList.length,
      typeList = '50',
      colorArr = that.data.colorArr,
      colorLen = colorArr.length,
      randomColorArr = []
    //判断执行
    do {
      let random = colorArr[Math.floor(Math.random() * colorLen)]
      randomColorArr.push(random)
      typeList--
    } while (typeList > 0)

    that.setData({
      randomColorArr: randomColorArr
    })
    // console.log(randomColorArr)
  },
  // 点击转换为input输入
  clickAddImageLabel() {
    let isShowInput = this.data.isShowInput
    let that = this
    // console.log('isShowInput', isShowInput)
    if (isShowInput == false) {
      that.setData({
        isShowInput: true
      })
    } else {
      that.setData({
        isShowInput: false
      })
    }
  },

  // 获取value值
  inputVal(e) {
    this.setData({
      customTag: e.detail.value
    })
  },
  // 点击移除
  removeTagTap(e) {
    let [tagList, checkedList, tagIndex, id, list] = [
      this.data.tagList,
      this.data.checkedList,
      e.currentTarget.dataset.index,
      e.currentTarget.dataset.id,
      this.data.list
    ]
    if (checkedList.length < 9) {
      this.setData({
        isWarning: false
      })
    }
    // debugger
    for (let i = 0, len = checkedList.length; i < len; i++) {
      if (id == checkedList[i].id) {
        checkedList.splice(i, 1)
        break
      }
    }
    for (let j = 0, jLen = list.length; j < jLen; j++) {
      if (id == list[j]) {
        list.splice(j, 1)
        break
      }
    }
    for (let i = 0, len = tagList.length; i < len; i++) {
      if (id == tagList[i].id) {
        tagList[i].checked = false
        break
      }
    }
    this.setData({
      checkedList: checkedList,
      tagList: tagList,
      list: list
    })
    // console.log('checkedList', this.data.checkedList)
  },

  tagTap: function (e) {
    let [tagList, checkedList, tagIndex, id, list] = [
      this.data.tagList,
      this.data.checkedList,
      e.currentTarget.dataset.index,
      e.currentTarget.dataset.id,
      this.data.list
    ]
    // 判断长度
    if (checkedList.length > 7) {
      this.setData({
        isWarning: true
      })
      return
    }

    for (let i = 0, len = tagList.length; i < len; i++) {
      if (i == tagIndex) {
        if (!('checked' in tagList[i]) || tagList[i].checked === false) {
          tagList[i].checked = true
          checkedList.push(tagList[i])
          list.push(tagList[i].id)
        }
      }
    }
    this.setData({
      tagList: tagList,
      checkedList: checkedList,
      list: list
    })
    // console.log('1111111111', this.data.checkedList);
  },
  sub: function () {
    let [that, token, url, cardId, list] = [
      this,
      wx.getStorageSync('uid'),
      dataUrl + '/Api/Member/make_card',
      this.data.cardId,
      this.data.list.toString()
    ]
    let data = {
      token: token,
      type: 2,
      card_id: cardId,
      tab: list
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        if (res.data.code === 0) {
          let resData = res.data
          wx.showToast({
            title: resData.msg || '失败',
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
  // 自定义标签
  saveTab() {
    let [that, token, url, customTag] = [
      this,
      wx.getStorageSync('uid'),
      dataUrl + '/Api/Member/addTag',
      this.data.customTag
    ]
    let data = {
      token: token,
      tag: customTag
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        if (res.data.code === 0) {
          let resData = res.data
          wx.showToast({
            // title: resData.msg || '失败',
            title: '添加成功',
            icon: 'success',
            duration: 600
          })
          that.setData({
            isShowInput: false
          })
          setTimeout(function () {
            that.onShow()
          }, 800)
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  }
})