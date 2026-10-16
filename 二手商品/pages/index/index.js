const goods = require("../../utils/goods.js")

Page({
  data: {
    goodsList: [],
    loading: false,
    loaded: false
  },

  onLoad() {
    this.loadGoods(false)
  },

  onShow() {
    if (!this.data.loaded) return
    this.loadGoods(false)
  },

  onRefresh() {
    this.loadGoods(true)
  },

  onManage() {
    wx.navigateTo({
      url: "/pages/manage/manage"
    })
  },

  loadGoods(isRefresh) {
    if (this._requesting) return
    this._requesting = true
    this.setData({ loading: true })
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    goods.fetchGoods().then((list) => {
      this._requesting = false
      this.setData({
        goodsList: list,
        loaded: true,
        loading: false
      })
      wx.hideLoading({
        complete: () => {
          if (!isRefresh) return
          setTimeout(() => {
            wx.showToast({
              title: "刷新成功",
              icon: "success"
            })
          }, 100)
        }
      })
    }).catch(() => {
      this.handleFail()
    })
  },

  handleFail() {
    this._requesting = false
    this.setData({ loading: false })
    wx.hideLoading({
      complete: () => {
        setTimeout(() => {
          wx.showToast({
            title: "加载失败，请点击重试",
            icon: "none"
          })
        }, 100)
      }
    })
  },

  onGoodsTap(e) {
    const { status, name, price, id } = e.currentTarget.dataset
    if (status === "sold" || this.data.loading) return
    wx.showModal({
      title: "确认购买",
      content: `${name}：¥${price}`,
      confirmText: "购买",
      confirmColor: "#07c160",
      success: (res) => {
        if (!res.confirm) return
        goods.purchase(id)
        const goodsList = this.data.goodsList.map((item) => {
          if (String(item.id) !== String(id)) return item
          return Object.assign({}, item, { status: "sold" })
        })
        this.setData({ goodsList })
        wx.showToast({
          title: "购买成功",
          icon: "success"
        })
      }
    })
  }
})
