const goods = require("../../utils/goods.js")

Page({
  data: {
    goodsList: [],
    loading: false,
    loaded: false
  },

  onLoad() {
    this.loadGoods()
  },

  loadGoods() {
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
      wx.hideLoading()
    }).catch(() => {
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
    })
  },

  onRestock(e) {
    const { id, name } = e.currentTarget.dataset
    if (this.data.loading) return
    wx.showModal({
      title: "确认补货",
      content: `将「${name}」重新上架？`,
      confirmText: "补货",
      confirmColor: "#07c160",
      success: (res) => {
        if (!res.confirm) return
        goods.restock(id)
        const goodsList = this.data.goodsList.map((item) => {
          if (String(item.id) !== String(id)) return item
          return Object.assign({}, item, { status: "selling" })
        })
        this.setData({ goodsList })
        wx.showToast({
          title: "补货成功",
          icon: "success"
        })
      }
    })
  }
})
