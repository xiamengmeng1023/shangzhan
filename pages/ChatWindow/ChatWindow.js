const webim = require('../../utils/webim_wx.js');
const webimhandler = require('../../utils/webim_handler.js');
const tls = require('../../utils/tls.js');
const app = getApp();
const dataUrl = app.globalData.url;
const picUrl = app.globalData.imgUrl;
const iconUrl = app.globalData.iconUrl;
const network = require("../../utils/util.js");
global.webim = webim;
let selToID
var Config = {
  sdkappid: 1400187105,
  accountType: 36862,
  accountMode: 0, //帐号模式，0-表示独立模式，1-表示托管模式
};

tls.init({
  sdkappid: Config.sdkappid,
})

let loginInfo = {
  sdkAppID: 1400187105,
  appIDAt3rd: "wxde059b418de529cd",
  accountType: 36862,
  accountMode: 0,
  identifier: "M" + wx.getStorageSync("uid"),
  userSig: ""
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    getMessage: [],
    token: wx.getStorageSync("uid"),
    eVal: "",
    id: "",
    from: '',
    iconUrl: iconUrl,
    singlechat: "",
    messageWindow: "",
    windowH: "",
    scrollTop: 0,
    listpage: 1,
    list_rows: 10,
  },

  initIM() {
    let [that, token, identifier, url] = [this, wx.getStorageSync("uid"), "M" + wx.getStorageSync("uid"), dataUrl + "/Api/Message/getUserSig"]

    let onConnNotify = function (resp) {
      var info;
      switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
          webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
          break;
        case webim.CONNECTION_STATUS.OFF:
          info = '连接已断开，无法收到新消息，请检查下您的网络是否正常: ' + resp.ErrorInfo;
          webim.Log.warn(info);
          break;
        case webim.CONNECTION_STATUS.RECONNECT:
          info = '连接状态恢复正常: ' + resp.ErrorInfo;
          webim.Log.warn(info);
          break;
        default:
          webim.Log.error('未知连接状态: =' + resp.ErrorInfo);
          break;
      }
    };
    let onMsgNotify = function (newMsgList) {
      var sess, newMsg;
      //获取所有聊天会话
      var sessMap = webim.MsgStore.sessMap();
      for (var j in newMsgList) { //遍历新消息
        newMsg = newMsgList[j];
        if (newMsg.fromAccount == selToID) { //为当前聊天对象的消息
          let text = newMsg.elems[0].content.text
          that.addMsg(text)
        }
      }
    }
    let listeners = {
      "onConnNotify": onConnNotify, //监听连接状态回调变化事件,必填
      "onMsgNotify": onMsgNotify //监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
    }
    //即时通讯登陆

    let params = {
      identifier: identifier
    }
    let config = {
      sdkappid: 1400187105,
      accountType: 36862,
      accountMode: 0, //帐号模式，0-表示独立模式，1-表示托管模式
    };
    network.POST({
      params: params,
      url: url,
      success: res => {
        loginInfo.userSig = res.data.data
        let options = {}
        webim.login(loginInfo, listeners, options, function (res) {},
          function (err) {
            console.log("fail", err)
          })
      },
      fail: res => {
        console.log("res", res)
      }
    })
  },
  // 聊天对象
  windowUrl: function (eid) {
    let [that, token, messageWindowUrl] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Message/messageWindow"]
    let messageWindowParams = {
      token: token,
      audience_id: that.data.from || eid
    }
    network.POST({
      params: messageWindowParams,
      url: messageWindowUrl,
      success: res => {
        let resaData = res.data.data
        for (let i = 0, len = resaData.length; i < len; i++) {
          if (resaData[i].id != token) {
            wx.setNavigationBarTitle({
              title: resaData[i].nick_name
            })
          }
        }
        that.setData({
          messageWindow: resaData
        })
      },
      fail: res => {

      }
    })
  },

  // 聊天记录
  getMessage: function (eid) {
    let [that, token, getMessageUrl, page, list_rows] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Message/getMessage", this.data.listpage, this.data.list_rows]
    let getMessageParams = {
      token: token,
      audience_id: that.data.from || eid,
      page: page,
      list_rows: list_rows
    }
    network.POST({
      params: getMessageParams,
      url: getMessageUrl,
      success: res => {
        if (res.data.code == 0) {
          if (res.data.data.length > 0) {
            page++
          }
          that.setData({
            getMessage: res.data.data.reverse(),
            listpage: page,
            scrollTop: res.data.data.length * 1000
          })
          console.log("scrollTop", that.data.scrollTop)
        }
      },
      fail: res => {

      }
    })
  },
  scrollToBottom() {
    // let self = this

  },
  //已读
  setMessageStatus: function (eid) {
    let [that, token, setMessageStatusUrl] = [this, wx.getStorageSync("uid"), this.data.singlechat == 1 ? dataUrl + "/Api/Message/setMessageStatus" : dataUrl + "/Api/Message/setCustomMessageStatus"]
    let params = {
      token: token,
      audience_id: that.data.from || eid
    }
    network.POST({
      params: params,
      url: setMessageStatusUrl,
      success: res => {
        console.log("已读res", res)
      },
      fail: res => {
        console.log("fail", res)
      }
    })
  },


  // 即时通讯退出
  out: function () {
    webim.logout(function (resp) {
      console.log("resp", resp)
      // loginInfo.identifier = null;
      // loginInfo.userSig = null;
    }, function (err) {
      console.log("fail", err)
    })
  },
  bindinput: function (e) {
    let [that, eVal] = [this, e.detail.value]
    that.setData({
      eVal: eVal
    })
  },
  bindconfirm: function (e) {
    let [that, eVal] = [this, e.detail.value]
    that.setData({
      eVal: eVal
    })
  },
  bindfocus: function (e) {
    let [that, eVal] = [this, e.detail.value]
    that.setData({
      eVal: eVal
    })
  },
  // 获取input value
  bindblur: function (e) {
    let [that, eVal] = [this, e.detail.value]
    that.setData({
      eVal: eVal
    })
  },
  sendMessage: function () {
    let [that, token, content, url] = [this, wx.getStorageSync("uid"), this.data.eVal, dataUrl + "/Api/Message/sendMessage"]
    if (!content) {
      wx.showToast({
        title: "消息不能为空",
        icon: 'loading'
      })
      return
    }
    let params = {
      token: token,
      audience_id: this.data.id,
      content: content,
      type: 0
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        console.log("成功", res)
        let messageWindow = that.data.messageWindow
        let addMsg = {
          speaker_id: token,
          content: content
        }
        for (let i = 0, len = messageWindow.length; i < len; i++) {
          if (token == messageWindow[i].id) {
            addMsg.speaker_icon = messageWindow[i].icon
          }
        }
        that.setData({
          getMessage: that.data.getMessage.concat(addMsg),
          eVal: "",
          scrollTop: that.data.getMessage.length * 1000
        })
        console.log(addMsg)
      },
      fail: res => {
        console.log("err", res)
      }
    })
  },
  addMsg(even) {
    let getMessage = {
      speaker_id: this.data.id,
      content: even
    }
    let [messageWindow, token] = [this.data.messageWindow, wx.getStorageSync("uid")]
    for (let i = 0, len = messageWindow.length; i < len; i++) {
      if (token != messageWindow[i].id) {
        getMessage.speaker_icon = messageWindow[i].icon
      }
    }
    this.setMessageStatus()
    this.setData({
      getMessage: this.data.getMessage.concat(getMessage),
      scrollTop: this.data.getMessage.length * 1000
    })
  },

  scrolltoupper() {
    let [that, token, id, getMessageUrl, page, list_rows] = [this, wx.getStorageSync("uid"), this.data.id, dataUrl + "/Api/Message/getMessage", this.data.listpage, this.data.list_rows]
    if (page === 1) {
      return
    }
    let getMessageParams = {
      token: token,
      audience_id: id,
      page: page,
      list_rows: list_rows
    }
    network.POST({
      params: getMessageParams,
      url: getMessageUrl,
      success: res => {
        if (res.data.code == 0) {
          let resData = res.data.data
          let getMessage = that.data.getMessage
          if (resData.length > 0) {
            page++
          }
          console.log("resData", resData)
          for (let i = 0, len = resData.length; i < len; i++) {
            getMessage.unshift(resData[i])
          }
          that.setData({
            getMessage: getMessage,
            listpage: page
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
  onLoad: function (options) {
    console.log("options", options)
    let info = JSON.parse(options.info)
    this.setData({
      id: info.id,
      singlechat: info.singlechat,
      from: info.from,
    })

    wx.setNavigationBarTitle({
      title: options.speakerName
    })

  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let [that, token, id] = [this, wx.getStorageSync("uid"), this.data.id]
    this.initIM()
    selToID = "M" + id
    // 聊天对象
    that.windowUrl(id)
    //聊天记录
    that.getMessage(id)
    //已读 未读
    that.setMessageStatus(id)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowH: res.windowHeight,
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // this.out()
    webim.logout()
    selToID = ""
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // this.out()
    webim.logout()
    selToID = ""
  },

})