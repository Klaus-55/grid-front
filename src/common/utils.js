//保留小数点后几位小数
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
