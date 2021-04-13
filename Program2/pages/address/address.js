// pages/address/address.js
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: '',
    region: ['江苏省', '南通市', '如东县'],
    address: '',
    getCode: '验证码',
    iscode: '',
    code: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  inputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  inputCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  getCode: function () {
    var phone = this.data.phone;
    var that = this;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (phone == "") {
      wx.showToast({
        title: '手机号码不能为空',
        icon: 'none',
        duration: 1000,
      })
      that.setData({
        disabled: !disabled
      })
    } else if (!myreg.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      that.setData({
        disabled: !disabled
      })
    } else {
      wx.request({
        data: {},
        'url': 'https://lxc.2free.cn/api/Address/setAddress',
        success(res) {
          console.log(res.data.data)
          that.setData({
            iscode: res.data.data
          })
          console.log('111')
          var num = 61;
          var timer = setInterval(
            function () {
              num--;
              if (num <= 0) {
                clearInterval(timer);
                that.setData({
                  getCode: '重新发送',
                  disabled: false
                })
              } else {
                that.setData({
                  getCode: num + "s"
                })
              }
            }, 1000)
        }
      })
    }
  },
  getVerificationCode() {
    this.getCode();
    var that = this;
    that.setData({
      disabled: true
    })
  },
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        // 返回数据
        var locationString = res.latitude + "," + res.longitude;
        wx.request({
          url: 'http://apis.map.qq.com/ws/geocoder/v1/?l&get_poi=1',
          data: {
            'key': 'POCBZ-TB7RS-RCLO6-6ROI7-EQD5T-USB3R',
            location: locationString
          },
          method: 'GET',
          success: function (res) {
            console.log(res.data.result.address)
            that.setData({
              address: res.data.result.address
            })
          }
        })
      }
    })
  },
  formSubmit(e) {
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if(this.data.name == ""){
      wx.showToast({
        title: '收货人不能为空',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if(this.data.phone == ""){
      wx.showToast({
        title: '手机号码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false
    }else if(!myreg.test(this.data.phone)){
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if(this.data.code == ""){
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false
    }else if(this.data.code != this.data.iscode){
      wx.showToast({
        title: '验证码错误',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if(this.data.address = ""){
      wx.showToast({
        title: '收货地址不能为空',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    else{
      wx.setStorageSync('name', this.data.name);
      wx.setStorageSync('phone', this.data.phone);
      wx.navigateBack({
        delta: 1,
      })
    }
  },
})