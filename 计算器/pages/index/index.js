function formatNumber(value) {
  if (!isFinite(value)) return '错误'
  if (value === 0 || Object.is(value, -0)) return '0'

  const abs = Math.abs(value)
  let text
  if (abs >= 1e12 || abs < 1e-8) {
    text = value.toExponential(6).replace(/\.?0+e/, 'e').replace('e+', 'e')
  } else {
    text = value.toFixed(10).replace(/\.?0+$/, '')
  }
  return text === '-0' ? '0' : text
}

const OP_SYMBOL = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷'
}

Page({
  data: {
    display: '0',
    formula: '',
    activeOp: ''
  },

  current: '0',
  stored: null,
  operator: null,
  overwrite: true,

  onDigit(e) {
    const digit = e.currentTarget.dataset.digit
    if (this.data.display === '错误') {
      this.resetState()
    }

    if (this.overwrite) {
      this.current = digit === '.' ? '0.' : digit
      this.overwrite = false
    } else if (digit === '.' && this.current.indexOf('.') !== -1) {
      return
    } else if ((this.current === '0' || this.current === '-0') && digit !== '.') {
      this.current = (this.current.charAt(0) === '-' ? '-' : '') + digit
    } else if (this.current.replace('-', '').replace('.', '').length >= 12) {
      return
    } else {
      this.current += digit
    }

    this.setData({
      display: this.current,
      activeOp: ''
    })
  },

  onOperator(e) {
    if (this.data.display === '错误') return

    const next = e.currentTarget.dataset.op
    const value = parseFloat(this.current)

    if (this.operator && !this.overwrite) {
      const result = this.compute(this.stored, value, this.operator)
      if (result === null) return
      this.stored = result
      this.current = formatNumber(result)
    } else {
      this.stored = value
    }

    this.operator = next
    this.overwrite = true
    this.setData({
      display: formatNumber(this.stored),
      formula: formatNumber(this.stored) + ' ' + OP_SYMBOL[next],
      activeOp: next
    })
  },

  onEqual() {
    if (!this.operator || this.data.display === '错误') return

    const value = parseFloat(this.current)
    const result = this.compute(this.stored, value, this.operator)
    if (result === null) return

    this.setData({
      display: formatNumber(result),
      formula: formatNumber(this.stored) + ' ' + OP_SYMBOL[this.operator] + ' ' + this.current + ' =',
      activeOp: ''
    })
    this.current = formatNumber(result)
    this.stored = null
    this.operator = null
    this.overwrite = true
  },

  onClear() {
    this.resetState()
    this.setData({
      display: '0',
      formula: '',
      activeOp: ''
    })
  },

  onBackspace() {
    if (this.data.display === '错误') {
      this.onClear()
      return
    }
    if (this.overwrite) return

    if (this.current.length <= 1 || (this.current.length === 2 && this.current.charAt(0) === '-')) {
      this.current = '0'
      this.overwrite = true
    } else {
      this.current = this.current.slice(0, -1)
      if (this.current === '-' || this.current === '') {
        this.current = '0'
        this.overwrite = true
      }
    }

    this.setData({ display: this.current })
  },

  onSign() {
    if (this.data.display === '错误') return
    if (this.overwrite) {
      this.current = '-0'
      this.overwrite = false
      this.setData({
        display: this.current,
        activeOp: ''
      })
      return
    }
    if (this.current === '0' || this.current === '-0') {
      this.current = this.current === '0' ? '-0' : '0'
    } else {
      this.current = this.current.charAt(0) === '-' ? this.current.slice(1) : '-' + this.current
    }
    this.setData({ display: this.current })
  },

  onPercent() {
    if (this.data.display === '错误') return
    const value = parseFloat(this.current) / 100
    this.current = formatNumber(value)
    this.overwrite = true
    this.setData({ display: this.current })
  },

  compute(left, right, op) {
    let result
    if (op === '+') result = left + right
    else if (op === '-') result = left - right
    else if (op === '*') result = left * right
    else if (op === '/') {
      if (right === 0) {
        this.resetState()
        this.setData({
          display: '错误',
          formula: '不能除以 0',
          activeOp: ''
        })
        return null
      }
      result = left / right
    } else {
      result = right
    }

    if (!isFinite(result)) {
      this.resetState()
      this.setData({
        display: '错误',
        formula: '',
        activeOp: ''
      })
      return null
    }
    return result
  },

  resetState() {
    this.current = '0'
    this.stored = null
    this.operator = null
    this.overwrite = true
  }
})
