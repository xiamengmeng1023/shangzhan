const app = getApp();
const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
const picUrl = app.globalData.imgUrl;
const patrn = app.globalData.patrn;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    picUrl: picUrl,
    id: "", //群id 当id是0的时候  属于新建
    codeUrl: "", //二维码图片
    gName: "", //群昵称
    weixin: "", //微信号
    cate: "", //分类
    summary: "",
    identityList: [{ //选择身份
        id: 0,
        text: "我是群主"
      },
      {
        id: 1,
        text: "我是群友"
      }
    ],
    scaleList: [{ //选择人数
        id: 50,
        text: "50人"
      },
      {
        id: 100,
        text: "100人"
      },
      {
        id: 200,
        text: "200人"
      },
      {
        id: 500,
        text: "500人"
      },
    ],
    scaleIndex: -1,
    region: [],
    index: -1,
    groupImgList: [],
  },
  // 上传二维码图片
  groupCode() {
    let [that, token, id, url] = [this, wx.getStorageSync("uid"), this.data.id, dataUrl + "/Api/Group/uploadGroupCode"]
    let params = {
      token: token,
      // token: 277,
      app_id: "wxde059b418de529cd",
      group_id: id == 0 ? "" : id
    }
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: url,
          filePath: tempFilePaths[0],
          name: 'code',
          formData: params,
          success(res) {
            let resData = JSON.parse(res.data)
            console.log("res", resData)
            if (resData.code == 0) {
              that.setData({
                codeUrl: tempFilePaths[0],
                id: resData.data.group_id
              })
            }
          }
        })
      }
    })
  },
  // 选择身份
  identity(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  regionCity(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  scaleTap(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      scaleIndex: e.detail.value
    })
  },
  // 上传群图片
  groupImg() {
    let that = this
    wx.chooseImage({
      count: 4 - that.data.groupImgList.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var imgsrc = res.tempFilePaths;
        var groupImgList = that.data.groupImgList
        console.log("groupImgList", groupImgList.length)
        if (groupImgList.length < 4) {
          that.setData({
            groupImgList: that.data.groupImgList.concat(imgsrc)
          })
          that.uploadimg({
            url: dataUrl + "/Api/Group/uploadGroupPic", //这里是你图片上传的接口
            path: imgsrc //这里是选取的图片的地址数组
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '群图片最少需上传1张图，最多4张',
            showCancel: false,
            success(res) {}
          })
        }
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  //多张图片上传
  uploadimg(data) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0, //上传失败的个数
      token = wx.getStorageSync("uid"),
      id = that.data.id;
    var params = {
      token: token,
      // token: 277,

      app_id: "wxde059b418de529cd",
      group_id: id == 0 ? "" : id
    };
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'pic', //这里根据自己的实际情况改
      formData: params, //这里是上传图片时一起上传的数据
      success: (resp) => {
        success++; //图片上传成功，图片上传成功的变量+1
        console.log(resp)
        console.log(i);
        if (resp.code == 0) {
          that.setData({
            id: resp.data.group_id
          })
        }
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) { //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else { //若图片还没有传完，则继续调用函数
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }

      }
    });
  },

  // 群消息提交
  formSubmit(e) {
    console.log("e", e)
    let [that, id, gName, identityId, wxNum, region, scaleIndex, scale, cate, summary, codeUrl, groupImgList, token, url] = [this, this.data.id, e.detail.value.gName, e.detail.value.identity, e.detail.value.wxNum, this.data.region, this.data.scaleIndex, e.detail.value.scale, e.detail.value.cate, e.detail.value.summary, this.data.codeUrl, this.data.groupImgList, wx.getStorageSync("uid"), dataUrl + "/Api/Group/setGroup"]
    // 判断是否上传图片二维码
    if (!codeUrl) {
      wx.showModal({
        title: '提示',
        content: '请上传群二维码图片',
        showCancel: false,
        success(res) {}
      })
      return
    }
    if (!gName.trim()) {
      wx.showModal({
        title: '提示',
        content: '请输入群昵称',
        showCancel: false,
        success(res) {}
      })
      return
    }
    if (patrn.test(gName)) {
      wx.showModal({
        title: '提示',
        content: '群昵称含有特殊字符',
        showCancel: false,
        success(res) {}
      })
      return
    }
    console.log("identityId", identityId)
    if (identityId < 0) {
      wx.showModal({
        title: '提示',
        content: '请选择身份',
        showCancel: false,
        success(res) {}
      })
      return
    }
    if (!wxNum.trim()) {
      wx.showModal({
        title: '提示',
        content: '请输入微信号码',
        showCancel: false,
        success(res) {}
      })
      return
    }
    if (patrn.test(wxNum)) {
      wx.showModal({
        title: '提示',
        content: '微信号码含有特殊字符',
        showCancel: false,
        success(res) {}
      })
      return
    }
    if (!summary.trim()) {
      wx.showModal({
        title: '提示',
        content: '请输入群简介',
        showCancel: false,
        success(res) {}
      })
      return
    }
    if (patrn.test(summary)) {
      wx.showModal({
        title: '提示',
        content: '简介含有特殊字符',
        showCancel: false,
        success(res) {}
      })
      return
    }
    if (groupImgList.length < 1) {
      wx.showModal({
        title: '提示',
        content: '请上传群图片',
        showCancel: false,
        success(res) {}
      })
      return
    }

    // console.log("params", params)
    console.log("scale", scale)
    let params = {
      token: token,
      // token: 277,
      group_id: id,
      name: gName,
      identity: identityId,
      weixin: wxNum,
      summary: summary,
    }
    if (region.length > 0) {
      params.province = region[0]
      params.city = region[1]
      params.area = region[2]
    }
    if (!!scale) {
      params.scale = scale * 1
    }
    if (!!cate) {
      params.cate = cate
    }
    wx.showLoading({
      title: '正在生成中...',
    })

    network.POST({
      params: params,
      url: url,
      success: res => {
        console.log("setGroup",res.data.data)
        if (res.data.code == 0) {
          let resData = res.data.msg
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: resData,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.hideLoading()
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {
          let resData = res.data.msg
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: resData,
            showCancel: false,
            success(res) {}
          })
        }
      },
      fail: res => {

      }
    })
  },
  // 群查询
  getGroupDetail() {
    let [that, token, id, url] = [this, wx.getStorageSync("uid"), this.data.id, dataUrl + "/Api/Group/getGroupDetail"]
    if (id == 0) {
      return
    }
    let params = {
      token: token,
      group_id: id,
      type: 2
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        console.log("res", res)
        if (res.data.code == 0) {
          let resData = res.data.data
          let region = [];
          if (!!resData.city) {
            region[0] = resData.province
            region[1] = resData.city
            region[2] = resData.area
          }
          let scale = Math.floor(resData.scale);
          let scaleList = that.data.scaleList;
          let scaleIndex;
          for (let i = 0, len = scaleList.length; i < len; i++) {
            if (scaleList[i].id == scale) {
              scaleIndex = i;
              break
            }
          }
          let pics = [];
          for (let i = 0, len = resData.pics.length; i < len; i++) {
            pics.push(resData.pics[i].thumb_pic)
          }
          that.setData({
            codeUrl: resData.code, //群二维码
            gName: resData.name, //群昵称
            index: resData.identity - 0, //选择身份
            weixin: resData.weixin, //微信号码
            region: region, //城市
            scaleIndex: scaleIndex,
            cate: resData.cate, //分类
            summary: resData.summary,
            groupImgList: pics
          })
          console.log("scaleIndex", that.data.scaleIndex)
        } else {
          // let resData = res.data.msg
          // wx.showModal({
          //   title: '提示',
          //   content: resData,
          //   showCancel: false,
          //   success(res) {}
          // })
          console.log("getGroupDetail", res)
        }
      },
      fail: res => {
        console.log("fail", res)
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id
    this.setData({
      id: id
    })
    this.getGroupDetail()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})