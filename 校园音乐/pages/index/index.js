const songs = [
  { id: 1, name: "晴天", artist: "周杰伦", duration: 269 },
  { id: 2, name: "稻香", artist: "周杰伦", duration: 223 },
  { id: 3, name: "起风了", artist: "买辣椒也用券", duration: 325 },
  { id: 4, name: "平凡之路", artist: "朴树", duration: 302 },
  { id: 5, name: "成都", artist: "赵雷", duration: 328 },
  { id: 6, name: "南山南", artist: "马頔", duration: 313 },
  { id: 7, name: "夜空中最亮的星", artist: "逃跑计划", duration: 252 },
  { id: 8, name: "告白气球", artist: "周杰伦", duration: 215 }
];

function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(seconds || 0));
  const minute = Math.floor(safe / 60);
  const second = safe % 60;
  const pad = (value) => (value < 10 ? `0${value}` : `${value}`);
  return `${pad(minute)}:${pad(second)}`;
}

function getVolumeTip(volume) {
  if (volume === 0) {
    return "静音";
  }
  if (volume <= 30) {
    return "音量偏低";
  }
  if (volume <= 70) {
    return "适中音量";
  }
  return "音量偏高";
}

Page({
  timer: null,

  data: {
    songs,
    currentIndex: 1,
    currentSong: songs[1],
    playing: false,
    currentTime: 0,
    currentTimeText: "00:00",
    durationText: formatTime(songs[1].duration),
    progress: 0,
    volume: 45,
    volumeTip: getVolumeTip(45)
  },

  onShow() {
    if (this.data.playing) {
      this.startTimer();
    }
  },

  onHide() {
    this.clearTimer();
  },

  onUnload() {
    this.clearTimer();
  },

  onSelectSong(e) {
    const index = Number(e.currentTarget.dataset.index);
    this.switchSong(index, this.data.playing);
  },

  onTogglePlay() {
    if (this.data.playing) {
      this.setData({ playing: false });
      this.clearTimer();
      return;
    }
    if (this.data.currentTime >= this.data.currentSong.duration) {
      this.setPlayback(0);
    }
    this.setData({ playing: true }, () => {
      this.startTimer();
    });
  },

  onPrev() {
    const index = (this.data.currentIndex - 1 + this.data.songs.length) % this.data.songs.length;
    this.switchSong(index, true);
  },

  onNext() {
    const index = (this.data.currentIndex + 1) % this.data.songs.length;
    this.switchSong(index, true);
  },

  switchSong(index, keepPlaying) {
    const currentSong = this.data.songs[index];
    this.clearTimer();
    this.setData({
      currentIndex: index,
      currentSong,
      playing: !!keepPlaying,
      currentTime: 0,
      currentTimeText: "00:00",
      durationText: formatTime(currentSong.duration),
      progress: 0
    }, () => {
      if (keepPlaying) {
        this.startTimer();
      }
    });
  },

  startTimer() {
    this.clearTimer();
    this.timer = setInterval(() => {
      const nextTime = this.data.currentTime + 1;
      if (nextTime >= this.data.currentSong.duration) {
        const nextIndex = (this.data.currentIndex + 1) % this.data.songs.length;
        this.switchSong(nextIndex, true);
        return;
      }
      this.setPlayback(nextTime);
    }, 1000);
  },

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  setPlayback(currentTime) {
    const duration = this.data.currentSong.duration || 1;
    this.setData({
      currentTime,
      currentTimeText: formatTime(currentTime),
      durationText: formatTime(duration),
      progress: Math.min(100, (currentTime / duration) * 100)
    });
  },

  onVolumeChanging(e) {
    this.updateVolume(e.detail.value);
  },

  onVolumeChange(e) {
    this.updateVolume(e.detail.value);
  },

  updateVolume(volume) {
    this.setData({
      volume,
      volumeTip: getVolumeTip(volume)
    });
  }
});
