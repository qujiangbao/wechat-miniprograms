Page({
  data: {
    current: 0,
    banners: [
      { id: 1, src: "/images/swiper01.jpg" },
      { id: 2, src: "/images/swiper02.jpg" }
    ],
    navs: [
      { name: "美食", icon: "/images/shi.png" },
      { name: "休闲", icon: "/images/xiu.png" },
      { name: "结婚", icon: "/images/hun.png" },
      { name: "房产", icon: "/images/fang.png" },
      { name: "学习", icon: "/images/xue.png" },
      { name: "娱乐", icon: "/images/yu.png" },
      { name: "汽车", icon: "/images/che.png" },
      { name: "工作", icon: "/images/gong.png" },
      { name: "场馆", icon: "/images/chang.png" }
    ]
  },

  onSwiperChange(e) {
    this.setData({
      current: e.detail.current
    })
  },

  onNavTap(e) {
    wx.showToast({
      title: e.currentTarget.dataset.name,
      icon: "none"
    })
  }
})
