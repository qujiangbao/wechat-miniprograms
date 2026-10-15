Component({
  data: {
    selected: 0,
    color: "#cccccc",
    selectedColor: "#ff4c91",
    list: [
      {
        pagePath: "/pages/index/index",
        text: "邀请函",
        icon: "/images/tab/invite.png"
      },
      {
        pagePath: "/pages/picture/picture",
        text: "照片",
        icon: "/images/tab/marry.png"
      },
      {
        pagePath: "/pages/video/video",
        text: "美好时光",
        icon: "/images/tab/video.png"
      },
      {
        pagePath: "/pages/guest/guest",
        text: "宾客信息",
        icon: "/images/tab/guest.png"
      }
    ]
  },

  methods: {
    switchTab(e) {
      const index = Number(e.currentTarget.dataset.index)
      const url = this.data.list[index].pagePath
      this.setData({ selected: index })
      wx.switchTab({ url })
    }
  }
})
