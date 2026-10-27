const {
  validateName,
  validateGender,
  validateOpinion
} = require('../../utils/validate.js');

const STORAGE_KEY = 'survey_records';
const GENDERS = ['男', '女'];
const EDUCATIONS = ['本科', '硕士', '其他'];
const SKILLS = ['HTML/CSS', 'JavaScript', '微信小程序', 'Vue', 'Java', 'UI设计'];

function pad(number) {
  return number < 10 ? '0' + number : '' + number;
}

function formatTime(date) {
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes());
}

function loadRecords() {
  try {
    const list = wx.getStorageSync(STORAGE_KEY);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    return [];
  }
}

function saveRecords(records) {
  wx.setStorageSync(STORAGE_KEY, records);
}

function createOptions(list) {
  return list.map((name) => ({
    name,
    value: name,
    checked: false
  }));
}

function createInitialData() {
  return {
    form: {
      name: '',
      gender: '',
      education: '',
      skills: [],
      opinion: ''
    },
    errors: {
      name: '',
      gender: '',
      opinion: ''
    },
    touched: {
      name: false,
      gender: false,
      opinion: false
    },
    genderOptions: createOptions(GENDERS),
    eduOptions: createOptions(EDUCATIONS),
    skillOptions: createOptions(SKILLS),
    formVisible: true,
    submitting: false,
    submitSuccess: false,
    result: null
  };
}

function markSingle(options, value) {
  return options.map((item) => ({
    ...item,
    checked: item.value === value
  }));
}

function markMulti(options, values) {
  return options.map((item) => ({
    ...item,
    checked: values.indexOf(item.value) !== -1
  }));
}

Page({
  data: {
    ...createInitialData(),
    records: []
  },

  onLoad() {
    this.setData({ records: loadRecords() });
  },

  onNameInput(e) {
    this.updateForm({ name: e.detail.value }, { name: true });
  },

  validateName() {
    this.updateForm({}, { name: true });
  },

  onGenderChange(e) {
    const gender = e.detail.value;
    this.updateForm({ gender }, { gender: true }, {
      genderOptions: markSingle(this.data.genderOptions, gender)
    });
  },

  onEducationChange(e) {
    const education = e.detail.value;
    this.updateForm({ education }, {}, {
      eduOptions: markSingle(this.data.eduOptions, education)
    });
  },

  onSkillsChange(e) {
    const picked = e.detail.value || [];
    const skills = this.data.skillOptions
      .map((item) => item.value)
      .filter((value) => picked.indexOf(value) !== -1);
    this.updateForm({ skills }, {}, {
      skillOptions: markMulti(this.data.skillOptions, skills)
    });
  },

  onOpinionInput(e) {
    this.updateForm({ opinion: e.detail.value }, { opinion: true });
  },

  validateOpinion() {
    this.updateForm({}, { opinion: true });
  },

  updateForm(formPatch, touchPatch, extra) {
    const form = { ...this.data.form, ...formPatch };
    const touched = { ...this.data.touched, ...touchPatch };
    this.setData({
      form,
      touched,
      errors: this.buildErrors(form, touched, false),
      ...(extra || {})
    });
  },

  buildErrors(form, touched, revealAll) {
    const showName = revealAll || touched.name;
    const showGender = revealAll || touched.gender;
    const showOpinion = revealAll || touched.opinion;
    return {
      name: showName ? validateName(form.name) : '',
      gender: showGender ? validateGender(form.gender) : '',
      opinion: showOpinion ? validateOpinion(form.opinion) : ''
    };
  },

  onReset() {
    if (this._lock || this.data.submitting) return;
    const fresh = createInitialData();
    fresh.records = this.data.records;
    fresh.formVisible = false;
    this.setData(fresh, () => {
      this.setData({ formVisible: true });
    });
  },

  onSubmit() {
    if (this._lock || this.data.submitting || this.data.submitSuccess) return;

    const form = this.data.form;
    const touched = { name: true, gender: true, opinion: true };
    const errors = this.buildErrors(form, touched, true);
    if (errors.name || errors.gender || errors.opinion) {
      this.setData({ touched, errors });
      return;
    }

    this._lock = true;
    this.setData({ submitting: true, errors, touched });

    setTimeout(() => {
      const record = {
        id: Date.now() + '-' + Math.floor(Math.random() * 10000),
        name: form.name.trim(),
        gender: form.gender,
        education: form.education || '未选择',
        skillsText: form.skills.length ? form.skills.join('、') : '未选择',
        opinion: form.opinion.trim(),
        timeText: formatTime(new Date())
      };
      const records = [record].concat(this.data.records);
      saveRecords(records);
      this._lock = false;
      this.setData({
        submitting: false,
        submitSuccess: true,
        result: record,
        records
      });
    }, 600);
  },

  onRewrite() {
    this._lock = false;
    const fresh = createInitialData();
    fresh.records = this.data.records;
    this.setData(fresh);
  },

  onDeleteRecord(e) {
    const id = e.currentTarget.dataset.id;
    const target = this.data.records.find((item) => item.id === id);
    if (!target) return;
    wx.showModal({
      title: '删除问卷',
      content: '确定删除「' + target.name + '」的这份问卷吗？',
      confirmText: '删除',
      confirmColor: '#ee0a24',
      success: (res) => {
        if (!res.confirm) return;
        const records = this.data.records.filter((item) => item.id !== id);
        saveRecords(records);
        this.setData({ records });
      }
    });
  }
});
