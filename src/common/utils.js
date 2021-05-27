//保留小数点后几位小数
import moment from "momnet";

export function toFix(value, num) {
  if (isNaN(value) || value === null) {
    return '/'
  } else {
    return value === 0 ? value : value.toFixed(num)
  }
}

//判断两个数组是否相等
export function scalarArrayEquals(array1, array2) {
  array1.sort()
  array2.sort()
  return array1.length == array2.length && array1.every(function(v,i) { return v === array2[i]});
}

//初始化radios选项
export function initRadios(year) {
  let radios = []
  for (let mon = 1; mon <= 12; mon++) {
    let obj = {}
    obj['label'] = mon + ''
    obj['disabled'] = moment().year() <= year && mon > moment().month() + 1
    obj['name'] = getCapitalNumber(mon) + '月'
    radios.push(obj)
    if (mon % 3 === 0) {
      let obj = {}
      obj['label'] = 'q' + (mon / 3)
      obj['disabled'] = moment().year() <= year && (mon / 3) >= moment().quarter()
      obj['name'] = getCapitalNumber(mon / 3) + '季度'
      radios.push(obj)
    }
  }
  radios.push({label: 'year', disabled: moment().year() <= year, name: '全年'})
  return radios
}

//得到大写数字
export function getCapitalNumber(num) {
  let rs = ''
  switch (num) {
    case 1: rs = '一'; break;
    case 2: rs = '二'; break;
    case 3: rs = '三'; break;
    case 4: rs = '四'; break;
    case 5: rs = '五'; break;
    case 6: rs = '六'; break;
    case 7: rs = '七'; break;
    case 8: rs = '八'; break;
    case 9: rs = '九'; break;
    case 10: rs = '十'; break;
    case 11: rs = '十一'; break;
    case 12: rs = '十二'; break;
  }
  return rs
}

//初始化年份下拉框的值
export function initYears(num) {
  let years = []
  for (let i = 0; i < num; i++) {
    years.push(moment().year() - i)
  }
  return years
}