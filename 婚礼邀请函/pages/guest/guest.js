Page({
  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
  },

  onSubmit(e) {
    const { name, phone, gender, dessert } = e.detail.value
    const guestName = (name || "").trim()

    if (!guestName) {
      wx.showToast({ title: "请输入姓名", icon: "none" })
      return
    }
    if (!/^1\d{10}$/.test(phone || "")) {
      wx.showToast({ title: "请输入正确的手机号", icon: "none" })
      return
    }
    if (!gender) {
      wx.showToast({ title: "请选择性别", icon: "none" })
      return
    }

    const foods = dessert && dessert.length ? dessert.join("、") : "未选择"
    wx.showModal({
      title: "提交成功",
      content: `${guestName}，感谢您光临婚礼。\n性别：${gender}\n点心：${foods}`,
      showCancel: false
    })
  }
})
