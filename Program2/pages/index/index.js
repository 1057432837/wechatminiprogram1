import {
  request
} from "../../request/index.js";
const app = getApp()
const db = wx.cloud.database()
const books = db.collection('books')
Page({
  data: {
    cardCur: 0,
    gridCol: 4,
    skin: false,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [],
    load: true,
    noticeList: [],
    swiperList: [],
    iconList: [],
    scrollList: [],
    bookList: []
  },
  onLoad() {
    // 初始化towerSwiper 传已有的数组名即可
    let that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    app.wxRequest("GET", "https://lxc.2free.cn/api/Index/swiperList", "{}", (res) => {
        that.setData({
          swiperList: res.data,
        })
      }),
      app.wxRequest("GET", "https://lxc.2free.cn/api/Index/iconList", "{}", (res) => {
        that.setData({
          iconList: res.data
        })
      }),
      app.wxRequest("GET", "https://lxc.2free.cn/api/Index/scrollList", "{}", (res) => {
        that.setData({
          scrollList: res.data
        })
      }),
      app.wxRequest("GET", "https://lxc.2free.cn/api/Index/noticeList", "{}", (res) => {
        that.setData({
          noticeList: res.data
        })
      }),
      app.wxRequest("GET", "https://lxc.2free.cn/api/Index/bookList", "{}", (res) => {
        that.setData({
          bookList: res.data
        })
      })

    let list = [{}];
    for (let i = 0; i < 7; i++) {
      list[i] = {};
      list[i].name = {};
      list[i].id = i
    }
    this.setData({
      list: list,
    })

  },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  onReady() {
    wx.hideLoading()
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },
  navigateBtn: function () {
    wx.navigateTo({
      url: '../hot/hot',
      success: function (res) {},
      fail: function () {},
      complete: function () {}
    })
  },
})