const app = getApp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
  },
  onLoad: function () {
    let openId = wx.getStorageSync('openId');
    if (wx.getUserProfile && !openId) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }else{
      let userInfo = wx.getStorageSync('userInfo');
      console.log(userInfo)
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
    }
  },
  getUserProfile(e) {
    //避免每次后端请求
    if(wx.getStorageSync('openId')){
      return true;
    }
    let openId = "";
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: 'https://lxc.2free.cn/api/Me/openId',
            method: 'POST',
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success(res) {
              if (res.data.code === 200) {
                wx.setStorageSync('openId', res.data.data);
                openId = res.data.data;
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            },
          })
        } else {
          console.log('登陆失败' + res.errMsg)
        }
      }
    })
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.setStorageSync('userInfo', res.userInfo);
        //如果拿到了用户信息则给后端发送该信息
        wx.request({
          url: app.globalData.userInfoUrl, //仅为示例，并非真实的接口地址
          method: "POST",//方法get / post
          data: {
            "openId":  openId, //openId
            "nickName":  res.userInfo.nickName,//用户名
            "gender":  res.userInfo.gender,//性别
            "country":  res.userInfo.country,//国家
            "province":  res.userInfo.province,//省
            "city": res.userInfo.city,//城市
            "avatarUrl":  res.userInfo.avatarUrl//头像
          },
          header: {//设置请求头
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
            console.log(res)
          }
        });
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  navigateToAddress() {
    var hasUserInfo = this.data.hasUserInfo
    if (!hasUserInfo) {
      wx.showLoading({
        title: '请先登录喔',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
    } else {
      wx.navigateTo({
        url: '../address/address',
      })
    }
  }
})