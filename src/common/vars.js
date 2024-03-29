export const waringMessageVar = `
1、当某县（市、区）天气实况达到预警消息发布标准对应表中对应标准时，如已发布相对应的预警，
评定该预警级别为正确（NA），其他等级不评。<br>
2、当某县（市、区）天气实况达到预警消息发布标准对应表中对应标准时，
如已发布的预警级别高于实况级别，评定发布的预警级别为空报（NB），实况级别为正确（NA），
其他等级不评。或者发布了预警而未出现灾害天气，亦评定发布的预警级别为空报（NB），
其他等级不评。例如预警级别为红色，实况级别为黄色，则评定黄色正确，红色空报，其他不评。<br>
3、当某县（市、区）天气实况达到预警消息发布标准对应表中对应标准时，
如未发布预警或已发布的预警级别低于实况级别则评定实况对应的预警级别为漏报（NC），
发布的预警级别为正确（NA），其他等级不评。例如预警级别为黄色，实况级别为红色，
则评定黄色正确，红色漏报，其他不评。`

export const warningDetailVar = `
说明：1.实况县是根据县站点灾害天气情况判定。如果是暴雨，则说明该县有3个区域站或者1个基本站达到了暴雨天气。
如果是高温（大雾），则说明该县有1个基本站达到了高温（大雾）天气。<br>
2.预报日期和实况时间：预报日期为预警发布日期，假如是漏报（未发布预警），则预报日期为预报员值班日期。
实况时间对应预报生效日，例如预报日期（漏报值班日期）2016-03-03，对应实况时间则为2016-03-04
某些情况比较特殊，如暴雨预警对应发布后的24小时，10点前发布的高温对应当日实况。`

export const skill = ['zhjq', 'qyjq', 'genjq', 'baoyujq', 'zhjsjq', 'maxtjq', 'mintjq']
export const quality = ["qyzql","qyts","genzql","stormzql", "ljo1zql","ljo2zql",
  "ljo3zql","ljo4zql", "zhjs","tmaxozql","tmaxtzql","tminozql","tmintzql"]
export const townQuality = ['zhzl', 'qyzql', 'qyts', 'genzql', 'stormzql', 'tmaxozql',
  'tmaxtzql', 'tminozql', 'tmintzql', 'fj1zql', 'fj2zql',
  'fj3zql', 'fj4zql', 'fj5zql', 'fj6zql', 'ljo1zql', 'ljo2zql',
  'ljo3zql', 'ljo4zql', 'ljo5zql', 'ljo6zql', 'zhjs']
export const weatherFac = ['qyzql', 'qyts', 'genzql', 'stormzql', 'fj1zql', 'fj2zql',
  'fj3zql', 'fj4zql', 'fj5zql', 'fj6zql', 'ljo1zql', 'ljo2zql',
  'ljo3zql', 'ljo4zql', 'ljo5zql', 'ljo6zql', 'zhjs']
export const keyValue = {
  zhjq: "综合技巧",
  qyjq: "晴雨（雪）预报技巧",
  genjq: "一般性降水技巧",
  baoyujq: "暴雨以上技巧",
  zhjsjq: "综合降水技巧",
  maxtjq: "最高温度预报技巧",
  mintjq: "最低温度预报技巧",
  zhzl: '综合质量',
  qyzql: "晴雨（雪）准确率",
  qyts: "晴雨（雪）TS",
  genzql: "一般性降水准确率",
  stormzql: "暴雨（雪）以上准确率",
  fj1zql: "分级降水（小雨）",
  fj2zql: "分级降水（中雨）",
  fj3zql: "分级降水（大雨）",
  fj4zql: "分级降水（暴雨）",
  fj5zql: "分级降水（大暴雨）",
  fj6zql: "分级降水（特大暴雨）",
  ljo1zql: "累加降水量≥0.0mm",
  ljo2zql: "累加降水量≥10mm",
  ljo3zql: "累加降水量≥25mm",
  ljo4zql: "累加降水量≥50mm",
  ljo5zql: "累加降水量≥100mm",
  ljo6zql: "累加降水量≥250mm",
  zhjs: "综合降水",
  tmaxozql: "最高气温误差≤1℃准确率",
  tmaxtzql: "最高气温误差≤2℃准确率",
  tminozql: "最低气温误差≤1℃准确率",
  tmintzql: "最低气温误差≤2℃准确率",
}