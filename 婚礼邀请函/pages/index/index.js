Page({
  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  callGroom() {
    wx.makePhoneCall({
      phoneNumber: "13800138000"
    })
  },

  callBride() {
    wx.makePhoneCall({
      phoneNumber: "13900139000"
    })
  }
})
