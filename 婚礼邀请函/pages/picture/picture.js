Page({
  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
  },

  data: {
    imgUrls: [
      "/images/timg1.jpg",
      "/images/timg2.jpg",
      "/images/timg3.jpg",
      "/images/timg4.jpg"
    ]
  }
})
