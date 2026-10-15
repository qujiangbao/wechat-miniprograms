Page({
  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
  },

  data: {
    movieList: [
      {
        title: "海边随拍",
        createTime: "2018-07-25",
        src: "http://127.0.0.1:3000/01.mp4"
      },
      {
        title: "勿忘初心",
        createTime: "2018-08-16",
        src: "http://127.0.0.1:3000/02.mp4"
      },
      {
        title: "十年之约",
        createTime: "2018-10-01",
        src: "http://127.0.0.1:3000/03.mp4"
      }
    ]
  }
})
