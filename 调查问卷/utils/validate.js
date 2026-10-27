const NAME_MIN = 2;
const NAME_MAX = 10;
const OPINION_MIN = 10;
const OPINION_MAX = 200;

function validateName(name) {
  const value = (name || '').trim();
  if (!value) return '姓名不能为空';
  if (value.length < NAME_MIN || value.length > NAME_MAX) {
    return '姓名长度需为' + NAME_MIN + '-' + NAME_MAX + '个字符';
  }
  return '';
}

function validateGender(gender) {
  if (!gender) return '请选择性别';
  return '';
}

function validateOpinion(opinion) {
  const value = (opinion || '').trim();
  if (value.length < OPINION_MIN) return '最少需要不少于10个字';
  if (value.length > OPINION_MAX) return '意见不能超过200个字';
  return '';
}

module.exports = {
  NAME_MIN,
  NAME_MAX,
  OPINION_MIN,
  OPINION_MAX,
  validateName,
  validateGender,
  validateOpinion
};
