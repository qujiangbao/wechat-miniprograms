Page({
  isLoading: false,

  data: {
    shopList: [],
    page: 1,
    pageSize: 10,
    total: 0
  },

  getShopList(callback) {
    this.isLoading = true
    wx.showLoading({
      title: "数据加载中..."
    })
    wx.request({
      url: "http://127.0.0.1:3000/data",
      method: "GET",
      data: {
        page: this.data.page,
        pageSize: this.data.pageSize
      },
      success: (res) => {
        if (res.statusCode !== 200 || !Array.isArray(res.data)) {
          wx.showToast({
            title: "数据加载失败",
            icon: "none"
          })
          return
        }
        const total = Number(res.header["X-Total-Count"] || res.header["x-total-count"] || 0)
        this.setData({
          shopList: this.data.shopList.concat(res.data),
          total: total
        })
      },
      fail: () => {
        wx.showToast({
          title: "请先启动本地服务器",
          icon: "none"
        })
      },
      complete: () => {
        wx.hideLoading()
        this.isLoading = false
        callback && callback()
      }
    })
  },

  onLoad() {
    this.getShopList()
  },

  onPullDownRefresh() {
    this.setData({
      shopList: [],
      page: 1,
      total: 0
    })
    this.getShopList(() => {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom() {
    if (this.data.page * this.data.pageSize >= this.data.total) {
      return wx.showToast({
        title: "数据加载完毕！",
        icon: "none"
      })
    }
    if (this.isLoading) {
      return
    }
    this.setData({
      page: this.data.page + 1
    })
    this.getShopList()
  }
})
