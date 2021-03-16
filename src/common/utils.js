//保留小数点后几位小数
export function toFix(value, num) {
  if (isNaN(value) || !value) {
    return value
  } else {
    return value.toFixed(num)
  }
}