//保留小数点后几位小数
export function toFix(value, num) {
  if (isNaN(num)) {
    return value
  } else {
    return value.toFixed(num)
  }
}