//index.js
//获取应用实例
import {
  request
} from "../../request/index.js";
const app = getApp()

Page({
  data: {
      StatusBar: app.globalData.StatusBar,
      CustomBar: app.globalData.CustomBar,
      Custom: app.globalData.Custom,
      hasUserInfo: false,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      TabCur: 1,
      scrollLeft: 0,
      statusBarHeight: app.globalData.statusBarHeight,
      isCartEmpty: false, // 购物车是否有商品
      hasAllSelected: false, // 是否全选
      bookList:[{
        "book1":
        {
          'name':'微信小程序开发零基础入门',
          'image':"https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg",
          'introduce':'这是微信小程序开发零基础入门的介绍',
          'class':{
            'class1':'分类1',
            'class2':'分类2'
          }
        }
      }
      ],
      cartList: [
        {
          "merchantInfo": {
            "merchantId": "222",
            "name": "这是我家的小小小店",
            "icon": '/assets/images/cart_none_a.png',
            "hasSelected": false,
            "quantityUpdatable": false,
            "isActivity": false
          },
          "goodsList": [{
              "id": 2221,
              "merchantId": "222",
              "title": '格力迷你静音台式电风扇',
              "image": '/assets/images/cart_none_a.png',
              "quantity": 4,
              "price": 130,
              "quantityUpdatable": false,
              "hasSelected": false
            },
            {
              "id": 22222,
              "merchantId": "222",
              "title": '格力家用台式电风扇',
              "image": '/assets/images/cart_none_a.png',
              "quantity": 1,
              "price": 320,
              "quantityUpdatable": false,
              "hasSelected": false
            }
          ]
        },
        {
          "merchantInfo": {
            "merchantId": "333",
            "name": "这是我家的小小小店",
            "icon": '/assets/images/cart_none_a.png',
            "hasSelected": false,
            "isActivity": true
          },
          "goodsList": [{
              "id": 3331,
              "merchantId": "333",
              "title": '格力迷你静音台式电风扇',
              "image": '/assets/images/cart_none_a.png',
              "quantity": 4,
              "price": 110,
              "quantityUpdatable": false,
              "hasSelected": false
            },
            {
              "id": 3332,
              "merchantId": "333",
              "title": '格力家用台式电风扇',
              "image": '/assets/images/cart_none_a.png',
              "quantity": 1,
              "price": 310,
              "quantityUpdatable": false,
              "hasSelected": false
            },
            {
              "id": 3333,
              "merchantId": "333",
              "title": '格力迷你静音台式电风扇',
              "image": '/assets/images/cart_none_a.png',
              "quantity": 4,
              "price": 120,
              "quantityUpdatable": false,
              "hasSelected": false
            }
          ]
        },

      ],
      totalPrice: 0,
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  selectGoodsGroup(e) {
    console.log(e);
    let cartList = this.data.cartList;
    const merchantId = e.currentTarget.dataset.merchantId;
 
    cartList.forEach(function (item) {
      if (item.merchantInfo.merchantId === merchantId) {
        const hasSelected = item.merchantInfo.hasSelected;
        item.merchantInfo.hasSelected = !hasSelected;
 
        item.goodsList.forEach(function (goods) {
          goods.hasSelected = item.merchantInfo.hasSelected;
        })
        return;
      };
    })
 
    this.setData({
      cartList: cartList,
    })
    this.calculateTotalPrice();
    this.verifyHasAllSelected();
  },
 
  /**
   * 计算商品总价格事件
   */
  calculateTotalPrice() {
    let cartList = this.data.cartList;
    let totalPrice = 0;
    cartList.forEach(function (item) {
      item.goodsList.forEach(function (goods) {
        // console.log(goods);
        if (goods.hasSelected) {
          totalPrice += goods.price * goods.quantity;
        }
        // console.log(totalPrice);
      })
    })
 
    this.setData({
      totalPrice: totalPrice
    })
  },
 
  /**
   * 验证是否全选事件
   */
  verifyHasAllSelected() {
    let hasAllSelected = true;
    let cartList = this.data.cartList;
    cartList.forEach(function (item) {
      if (!item.merchantInfo.hasSelected) {
        hasAllSelected = false;
        return;
      }
      item.goodsList.forEach(function (goods) {
        if (!goods.hasSelected) {
          hasAllSelected = false;
          return;
        }
      })
    })
    console.log(hasAllSelected);
    this.setData({
      hasAllSelected: hasAllSelected,
    })
  },
 
  /**
   * 单个商品选择事件
   */
  selectGoodsSingle(e) {
    console.log(e);
    let cartList = this.data.cartList;
    const merchantId = e.currentTarget.dataset.merchantId;
    const goodsId = e.currentTarget.dataset.goodsId;
 
    cartList.forEach(function (item) {
      if (item.merchantInfo.merchantId === merchantId) {
        item.goodsList.forEach(function (goods) {
          if (goods.id === goodsId) {
            const hasSelected = goods.hasSelected;
            goods.hasSelected = !hasSelected;
            return;
          }
        })
        return;
      }
    });
    this.setData({
      cartList: cartList,
    })
    this.calculateTotalPrice();
    this.verifyHasAllSelected();
  },
 
  /**
   * 商品数量减1事件
   */
  minus(e) {
    console.log(e);
    let cartList = this.data.cartList;
    const merchantId = e.currentTarget.dataset.merchantId;
    const goodsId = e.currentTarget.dataset.goodsId;
    let hasSelected;
 
    cartList.forEach(function (item) {
      if (item.merchantInfo.merchantId === merchantId) {
        item.goodsList.forEach(function (goods) {
          if (goods.id === goodsId) {
            if (goods.quantity <= 1) {
              wx.showToast({
                title: '商品数量少于1',
              })
            } else {
              goods.quantity -= 1;
            }
            hasSelected = goods.hasSelected;
            return;
          }
        })
        return;
      }
    });
    this.setData({
      cartList: cartList,
    })
    if (hasSelected) {
      this.calculateTotalPrice();
    }
  },
 
  /**
   * 商品数量加1事件
   */
  pluse(e) {
    console.log(e);
    let cartList = this.data.cartList;
    const merchantId = e.currentTarget.dataset.merchantId;
    const goodsId = e.currentTarget.dataset.goodsId;
    let hasSelected;
 
    cartList.forEach(function (item) {
      if (item.merchantInfo.merchantId === merchantId) {
        item.goodsList.forEach(function (goods) {
          if (goods.id === goodsId) {
            if (goods.quantity >= 10) {
              wx.showToast({
                title: '数量超过10',
              })
            } else {
              goods.quantity += 1;
            }
            hasSelected = goods.hasSelected;
            return;
          }
        })
        return;
      }
    });
    this.setData({
      cartList: cartList,
    })
    if (hasSelected) {
      this.calculateTotalPrice();
    }
 
  },
 
  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let hasAllSelected = this.data.hasAllSelected;
    hasAllSelected = !hasAllSelected;
    let cartList = this.data.cartList;
    for (let i = 0; i < cartList.length; i++) {
      let item = cartList[i];
      item.hasSelected = hasAllSelected;
      item.merchantInfo.hasSelected = hasAllSelected;
      let goodsList = item.goodsList;
      for (let i = 0; i < goodsList.length; i++) {
        let goodsItem = goodsList[i];
        goodsItem.hasSelected = hasAllSelected;
      }
    }
 
    this.setData({
      hasAllSelected: hasAllSelected,
      cartList: cartList
    });
    this.calculateTotalPrice();
  },
 
  /**
   * 显示修改单个商品数量布局事件
   */
  showUpdateQuantity(e) {
    console.log(e);
    const merchantId = e.currentTarget.dataset.merchantId;
    const goodsId = e.currentTarget.dataset.goodsId;
 
    this.showOrHideUpdateQuantity(merchantId, goodsId, true);
  },
 
  /**
   * 隐藏修改单个商品数量事件 
   */
  hideUpdateQuantity(e) {
    console.log(e);
    const merchantId = e.currentTarget.dataset.merchantId;
    const goodsId = e.currentTarget.dataset.goodsId;
 
    this.showOrHideUpdateQuantity(merchantId, goodsId, false);
  },
 
  /**
   * 显示改商品数量对话框事件
   */
  showUpdateQuantityDialog() {
 
  },
 
  /**
   * 显示或者隐藏修改商品数量布局事件
   */
  showOrHideUpdateQuantity(merchantId, goodsId, quantityUpdatable) {
    let cartList = this.data.cartList;
    console.log(merchantId);
    cartList.forEach(function (item) {
      if (item.merchantInfo.merchantId === merchantId) {
        item.goodsList.forEach(function (goods) {
          if (goods.id === goodsId) {
            goods.quantityUpdatable = quantityUpdatable;
            return;
          }
        })
        return;
      }
 
    });
    this.setData({
      cartList: cartList,
    })
  },
  addToCart: function() {
    var that = this.data
  },
  onLoad:function(){
    app.wxRequest("GET", "https://lxc.2free.cn/api/hot/bookList", "{}", (res) => {
      that.setData({
        bookList: res.data
      }, )
    })
  }
})
