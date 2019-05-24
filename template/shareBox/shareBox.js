// template/shareBox/shareBox.js
const app = getApp();
const dataUrl = app.globalData.url;
const picUrl = app.globalData.imgUrl;
const iconUrl = app.globalData.iconUrl;
const network = require("../../utils/util.js");
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isHide: {
      type: Boolean,
      observer() {}
    },
    obj: {
      type: Object,
    }
  },


  /**
   * 组件的初始数据
   */
  data: {
    picUrl: picUrl,
    iconUrl: iconUrl,
    isShow: false,
    // slide: true,
    alertImg: false,
    IsSub: false,
    codeImg: "",
    windowW: 0,
    windowH: 0,
    scale: 1,
    job: {},
    imgUrl: picUrl + "/Style/images/applets/img/haibao.png",
    news: {},
    details: {},
    textContent: {},
    mingPian: {}
  },
  ready() {
    this.reqCode()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 请求二维码
    reqCode() {
      let [that, token, url] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Qrcode/getQrcode"]
      let data = {
        token: token
      }
      network.POST({
        params: data,
        url: url,
        success: res => {
          console.log("data", res)
          if (res.data.code == 0) {
            let [codeImg, resData, obj] = [that.data.codeDetail, res.data.data, that.properties.obj]
            codeImg = picUrl + resData.qrcode
            wx.downloadFile({
              url: codeImg,
              success: res => {
                // console.log("res",res)
                that.setData({
                  codeImg: res.tempFilePath
                })
                that.sys();
                if (!!(obj)) {
                  that.swcichFn(that.properties.obj.checked_type)
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
    swcichFn(e) {
      console.log("checkedType", this.properties.obj)
      switch (e) {
        case 2:
          this.setData({
            news: this.properties.obj
          })
          this.newsImage() //新闻
          break
        case 3:
          this.setData({
            details: this.properties.obj
          })
          this.details() //商品
          break
        case 4:
          this.setData({
            textContent: this.properties.obj
          })
          this.txtImage() //文章
          break
        case 5:
          this.setData({
            job: this.properties.obj
          })
          this.jobImage() //招聘
          break
        case 6:
          this.setData({
            mingPian: this.properties.obj
          })
          this.minpianImage() //名片
          break
        default:
          // this.minpianImage()
          break
      }
    },
    sys: function () {
      var that = this;
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            windowW: res.windowWidth,
            windowH: res.windowHeight
          })
        },
      })
    },
    // 名片
    minpianImage() {
      let that = this
      const ctx = wx.createCanvasContext('myCanvas', that)
      let windowW = that.data.windowW
      let windowH = that.data.windowH
      let codeImg = that.data.codeImg
      let mingPian = that.data.mingPian
      if (mingPian.real_name.length > 10) { //用户昵称显示一行 截取
        mingPian.real_name = mingPian.real_name.slice(0, 10) + '...'
      };
      let bgPath = '/assets/imgs/mingpian_bg.png'
      that.setData({
        scale: 1.6
      })
      wx.downloadFile({
        url: picUrl + mingPian.logo,
        success: res => {
          let resLogo = res.tempFilePath
          wx.downloadFile({
            url: mingPian.icon,
            success: resp => {
              let resIcon = resp.tempFilePath
              ctx.beginPath()
              ctx.save()
              ctx.setFillStyle('#fff')
              ctx.fillRect(0, 0, windowW, windowH)
              ctx.drawImage(bgPath, 7, 16, 361, 215)
              let mingpian_logo_bg = "/assets/imgs/mingpian_logo_bg.png"
              ctx.drawImage(mingpian_logo_bg, 53, 16, 90, 75)
              ctx.drawImage(resLogo, 73, 28.5, 50, 50)
              ctx.setTextAlign('left');
              ctx.setFillStyle('#282828')
              ctx.setFontSize(22)
              ctx.fillText(mingPian.real_name, 70, 120)
              ctx.setFontSize(16)
              ctx.fillText(mingPian.job, 75 / 2, 150)
              // ctx.drawImage(res.tempFilePath, 73, 28.5, 50, 50)
              ctx.drawImage(resIcon, 190, 26, 60, 60)
              // ctx.drawImage(mingPian.icon, 190, 26, 60, 60)
              ctx.setTextAlign('left');
              ctx.setFillStyle('#282828')
              ctx.setFontSize(16)
              if (mingPian.name.length > 9) {
                mingPian.name = mingPian.name.slice(0, 9) + '...'
              }
              ctx.fillText(mingPian.name, 187, 120)
              ctx.drawImage("/img/linkIcon.png", 187, 140, 11, 10)
              ctx.setTextAlign('left');
              ctx.setFillStyle('#282828')
              ctx.setFontSize(14)
              if (mingPian.phone.length > 8) {
                mingPian.phone = mingPian.phone.slice(0, 8) + '...'
              }
              ctx.fillText(mingPian.phone, 206, 148)
              ctx.drawImage("/img/emailIcon.png", 187, 160, 11, 9)
              ctx.setFontSize(14)
              if (mingPian.email.length > 16) {
                mingPian.email = mingPian.email.slice(0, 14) + '...'
              }
              ctx.fillText(mingPian.email, 206, 168)
              ctx.setTextAlign('left');
              ctx.setFillStyle('#282828')
              ctx.setFontSize(18)
              ctx.fillText("您好！", 75 / 2, 240)
              ctx.fillText("我是" + " " + mingPian.name + " " + mingPian.job, 75 / 2, 280)
              ctx.fillText(mingPian.real_name, 75 / 2, 310)
              ctx.fillText("这是我的名片，请惠存！", 75 / 2, 340)
              ctx.fillText("谢谢", 75 / 2, 370)
              ctx.setTextAlign('left');
              ctx.setFillStyle('#444444')
              ctx.setFontSize(16)
              ctx.fillText("点击图片保存到相册", 75 / 2, 430)
              ctx.drawImage(codeImg, 244, 370, 100, 100)

              ctx.draw(true, setTimeout(function () {
                that.daochu()
              }, 1000))
            }
          })
        }
      })

    },
    // 商品
    details() {
      let that = this
      const ctx = wx.createCanvasContext('myCanvas', that)
      let windowW = that.data.windowW
      let windowH = that.data.windowH
      let codeImg = that.data.codeImg
      let details = that.data.details
      if (details.title.length > 10) { //用户昵称显示一行 截取
        details.title = details.title.slice(0, 10) + '...'
      };
      wx.downloadFile({
        url: details.big_pic,
        success: res => {
          console.log("res", res)
          let bgPath = res.tempFilePath
          that.setData({
            scale: 1.6
          })
          ctx.save()
          ctx.setFillStyle('#fff')
          ctx.fillRect(0, 0, windowW, windowH)
          ctx.drawImage(bgPath, 38, 16, 299, 579 / 2)
          ctx.setTextAlign('left');
          ctx.setFillStyle('#282828')
          ctx.setFontSize(18)
          ctx.fillText(details.title, 75 / 2, 346)
          ctx.setTextAlign('left');
          ctx.setFillStyle('#008cd6')
          ctx.setFontSize(16)
          ctx.fillText("￥" + details.v_price, 75 / 2, 400)
          ctx.drawImage(codeImg, 244, 326, 100, 100)
          ctx.setTextAlign('center');
          ctx.setFillStyle('#444444')
          ctx.setFontSize(16)
          ctx.fillText('点击图片保存到相册', 187.5, 470)
          ctx.draw(true, setTimeout(function () {
            that.daochu()
          }, 1000))
        }
      })
    },
    //新闻
    newsImage() {
      let that = this
      const ctx = wx.createCanvasContext('myCanvas', that)
      let windowW = that.data.windowW
      let windowH = that.data.windowH
      let codeImg = that.data.codeImg
      let news = that.data.news
      if (news.title.length > 16) { //用户昵称显示一行 截取
        news.title = news.title.slice(0, 16) + '...'
      };
      let bgPath = '/assets/imgs/news_bg.png'
      that.setData({
        scale: 1.6
      })
      ctx.save()
      ctx.setFillStyle('#fff')
      ctx.fillRect(0, 0, windowW, windowH)
      ctx.drawImage(bgPath, 36, 16, 303, 192)
      ctx.setTextAlign('left');
      ctx.setFillStyle('#282828')
      ctx.setFontSize(18)
      ctx.fillText(news.title, 75 / 2, 236)
      ctx.setTextAlign('left');
      ctx.setFillStyle('#8c8c8c')
      ctx.setFontSize(14)
      ctx.fillText(news.addtime, 75 / 2, 264)
      ctx.setTextAlign('left');
      ctx.setFillStyle('#444444')
      ctx.setFontSize(16)
      let chr = news.format_content.split("")
      let temp = "";
      let row = [];
      for (let a = 0, len = chr.length; a < len; a++) {
        if (ctx.measureText(temp).width < 260) {
          temp += chr[a];
        } else {
          a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
          row.push(temp);
          temp = "";
        }
      }
      row.push(temp);
      if (row.length > 2) {
        var rowCut = row.slice(0, 2);
        var rowPart = rowCut[1];
        var test = "";
        var empty = [];
        for (var a = 0; a < rowPart.length; a++) {
          if (ctx.measureText(test).width < 260) {
            test += rowPart[a];
          } else {
            break;
          }
        }
        empty.push(test);
        var group = empty[0] + "..." //这里只显示两行，超出的用...表示
        rowCut.splice(1, 1, group);
        row = rowCut;
      }
      for (var b = 0; b < row.length; b++) {
        ctx.fillText(row[b], 75 / 2, 310 + b * 30);
      }
      ctx.setTextAlign('center')
      ctx.setFontSize(16)
      ctx.drawImage(codeImg, 275 / 2, 365, 100, 100)
      ctx.fillText('点击图片保存到相册', 187.5, 500)
      ctx.draw(true, setTimeout(function () {
        that.daochu()
      }, 1000))

    },
    // 文章
    txtImage() {
      let that = this
      const ctx = wx.createCanvasContext('myCanvas', that)
      let windowW = that.data.windowW
      let windowH = that.data.windowH
      let codeImg = that.data.codeImg
      let text = that.data.textContent
      let bgPath = '/assets/imgs/text_bg.png'
      if (text.title.length > 10) {
        text.title = text.title.slice(0, 10) + '...'
      };
      if (text.format_content.length > 14) { //用户昵称显示一行 截取
        text.format_content = text.format_content.slice(0, 14) + '...'
      };
      ctx.save()
      ctx.setFillStyle('#fff')
      ctx.fillRect(0, 0, windowW, windowH)
      ctx.drawImage(bgPath, 75 / 2, 75 / 2, 303, 353)
      ctx.setTextAlign('center');
      ctx.setFillStyle('#282828')
      ctx.setFontSize(16)
      ctx.fillText(text.format_time, 187.5, 75)
      ctx.setTextAlign('center');
      ctx.setFillStyle('#282828')
      ctx.setFontSize(58)
      ctx.fillText(text.date, 187.5, 140)
      ctx.setTextAlign('center');
      ctx.setFillStyle('#282828')
      ctx.setFontSize(24)
      ctx.fillText(text.title, 187.5, 180)
      ctx.setTextAlign('left');
      ctx.setFillStyle('#282828')
      ctx.setFontSize(16)
      ctx.fillText(text.format_content, 58, 330)
      ctx.drawImage(codeImg, 230, 340, 100, 100)
      ctx.setTextAlign('left')
      ctx.setFontSize(16)
      ctx.fillText('点击图片保存到相册', 75 / 2, 440)
      ctx.draw(true, setTimeout(function () {
        that.daochu()
      }, 1000))

    },
    // 招聘  图片
    jobImage() {
      let that = this
      const ctx = wx.createCanvasContext('myCanvas', that)
      let windowW = that.data.windowW
      let windowH = that.data.windowH
      let job = that.data.job
      // let xinzi = that.data.xinzi
      let codeImg = that.data.codeImg
      if (job.title.length > 16) { //用户昵称显示一行 截取
        job.title = job.title.slice(0, 9) + '...'
      };
      let bgPath = '/assets/imgs/job_bg.jpg'
      that.setData({
        scale: 1.6
      })
      ctx.save()
      ctx.setFillStyle('#fff')
      ctx.fillRect(0, 0, windowW, windowH)
      ctx.drawImage(bgPath, 75 / 2, 75 / 2, 300, 150)
      ctx.setTextAlign('left');
      ctx.setFillStyle('#282828')
      ctx.setFontSize(18)
      ctx.fillText('岗位：' + job.title, 75 / 2, 220)
      ctx.setFontSize(14)
      ctx.fillText('薪资：' + job.xinzi, 75 / 2, 250)
      ctx.drawImage(codeImg, 225 / 2, 265, 150, 150)
      ctx.setTextAlign('center')
      ctx.setFontSize(16)
      ctx.fillText('点击图片保存到相册', 187.5, 440)
      ctx.draw(true, setTimeout(function () {
        that.daochu()
      }, 1000))
    },
    daochu: function () {
      var that = this;
      var windowW = that.data.windowW;
      var windowH = that.data.windowH;
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: windowW,
        height: windowH,
        canvasId: 'myCanvas',
        success: function (res) {
          let img = res.tempFilePath
          wx.uploadFile({
            url: dataUrl + "/Api/Home/getUrl",
            filePath: img,
            header: {
              'content-type': 'json'
            },
            name: 'image',
            formData: {
              // app_id: "wxde059b418de529cd"
              app_id: 'wx5550cef350778b61'
            },
            success: res => {
              let resData = JSON.parse(res.data)
              if (resData.code == 0) {
                that.setData({
                  imgUrl: resData.data
                })
              }
            }
          })
        },
        fail: function (res) {
          console.log("err", res)
        }
      }, that)
    },
    imgShow() {
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                console.log('授权成功')
              }
            })
          }
        }
      })
      this.setData({
        isShow: !this.data.isShow,
        // slide: !this.data.slide,
        alertImg: true,
      })
    },
    close() {
      this.setData({
        alertImg: false,
      })
    },
    down() {
      let that = this
      that.setData({
        IsSub: true
      })
      let imgSrc = that.data.imgUrl
      console.log("imgSrc", imgSrc)
      wx.downloadFile({
        url: imgSrc,
        success: function (res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (data) {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 1000
              })
              that.setData({
                alertImg: false,
                IsSub: false
              })
            },
            fail: function (err) {
              that.setData({
                alertImg: false,
                IsSub: true
              })
              if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                console.log("用户一开始拒绝了，我们想再次发起授权")
                console.log('打开设置窗口')
                wx.openSetting({
                  success(settingdata) {
                    console.log(settingdata)
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                    } else {
                      console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                    }
                  }
                })
              }
            }
          })
        }
      })
    },

    // 弹窗动画
    shareTap(e) {
      // 显示遮罩层
      var animation = wx.createAnimation({
        duration: 300,
        /**
         * http://cubic-bezier.com/
         * linear 动画一直较为均匀
         * ease 从匀速到加速在到匀速
         * ease-in 缓慢到匀速
         * ease-in-out 从缓慢到匀速再到缓慢
         *
         * http://www.tuicool.com/articles/neqMVr
         * step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
         * step-end 保持 0% 的样式直到动画持续时间结束 一闪而过
         */
        timingFunction: 'ease',
        delay: 0
      })
      this.animation = animation
      animation.translateY(800).step()
      this.setData({
        animationData: animation.export(), // export 方法每次调用后会清掉之前的动画操作。
        isShow: true,
      })
      setTimeout(() => {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export() // export 方法每次调用后会清掉之前的动画操作。
        })
        // console.log(this)
      }, 200)
    },
    // 关闭弹窗
    hideBuyModal() {
      // 隐藏遮罩层
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
        delay: 0
      })
      this.animation = animation
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
      setTimeout(
        function () {
          animation.translateY(800).step()
          this.setData({
            animationData: animation.export(),
            isShow: false,
          })
          // console.log(this)
        }.bind(this),
        100
      )
    },
  }
})