const MIN_LEVEL = 1
const MAX_LEVEL = 5

Page({
  data: {
    isOn: false,
    brightness: 3,
    tip: '',
    showTip: false
  },

  tipTimer: null,

  onUnload() {
    this.clearTipTimer()
  },

  onToggle() {
    this.setData({
      isOn: !this.data.isOn
    })
  },

  onDim() {
    this.changeBrightness(-1)
  },

  onBrighten() {
    this.changeBrightness(1)
  },

  changeBrightness(delta) {
    if (!this.data.isOn) {
      this.showTip('请先开启灯光')
      return
    }

    const next = this.data.brightness + delta
    if (next < MIN_LEVEL) {
      this.showTip('已达最低亮度')
      return
    }
    if (next > MAX_LEVEL) {
      this.showTip('已达最高亮度')
      return
    }

    this.setData({
      brightness: next
    })
  },

  showTip(title) {
    this.clearTipTimer()
    this.setData({
      tip: title,
      showTip: true
    })
    this.tipTimer = setTimeout(() => {
      this.setData({ showTip: false })
      this.tipTimer = null
    }, 1600)
  },

  clearTipTimer() {
    if (this.tipTimer) {
      clearTimeout(this.tipTimer)
      this.tipTimer = null
    }
  }
})
