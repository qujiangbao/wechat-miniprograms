const GOODS_API = "https://dpaste.com/3SSGEYHB4.txt"
const STATUS_KEY = "goods_status_overrides"

function getStatusMap() {
  const map = wx.getStorageSync(STATUS_KEY)
  return map && typeof map === "object" ? map : {}
}

function setStatus(id, status) {
  const map = getStatusMap()
  map[String(id)] = status
  wx.setStorageSync(STATUS_KEY, map)
}

function normalizeGoods(data) {
  let list = data
  if (typeof list === "string") {
    try {
      list = JSON.parse(list)
    } catch (error) {
      return null
    }
  }
  if (list && !Array.isArray(list)) {
    list = list.list || list.data || list.goods || null
  }
  if (!Array.isArray(list)) return null
  return list.map((item) => ({
    id: item.id,
    name: item.name || "",
    price: Number(item.price),
    status: item.status || "",
    image: item.image || ""
  }))
}

function applyStatus(list) {
  const map = getStatusMap()
  return list.map((item) => {
    const status = map[String(item.id)]
    if (!status) return item
    return Object.assign({}, item, { status })
  })
}

function fetchGoods() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: GOODS_API,
      method: "GET",
      timeout: 15000,
      success(res) {
        if (res.statusCode !== 200) {
          reject(new Error("bad status"))
          return
        }
        const list = normalizeGoods(res.data)
        if (!list) {
          reject(new Error("bad data"))
          return
        }
        resolve(applyStatus(list))
      },
      fail: reject
    })
  })
}

function purchase(id) {
  setStatus(id, "sold")
}

function restock(id) {
  setStatus(id, "selling")
}

module.exports = {
  fetchGoods,
  purchase,
  restock
}
