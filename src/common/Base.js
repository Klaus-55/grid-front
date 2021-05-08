
import Highcharts from "highcharts";
import store from "../store";

export function initEcharts(data, ftime, jyys) {
  ftime.sort((a, b) => a - b)
  let modes = store.state.modes
  let series = []
  for (let i = 0; i < modes.length; i++) {
    let seriesItem = {}
    let seriesDate = []
    for (let j = 0; j < ftime.length; j++) {
      let dataItem = data.filter(res => res['wfsrc'] === modes[i] && res['wfhour'] === ftime[j])
      if (dataItem.length > 0) {
        seriesDate.push(dataItem[0][jyys])
      } else {
        seriesDate.push(NaN)
      }
    }
    seriesItem.name = store.getters.unitName(modes[i])
    seriesItem.data = seriesDate
    series.push(seriesItem)
  }
  let categories = []
  categories.push(...ftime)
  if (categories[0] === 0) categories[0] = '综合'
  renderChart('grid-chart', categories, series)
}

export function initZhuri(data, ftime, jyys) {
  let series = []
  let modes = store.state.modes
  for (let i = 0; i < modes.length; i++) {
    let seriesItem = {}
    let seriesDate = []
    for (let j = 0; j < ftime.length; j++) {
      let dataItem = data.filter(res => res['wfsrc'] === modes[i] && res['wfdatetime'] === ftime[j])
      if (dataItem.length > 0) {
        seriesDate.push(dataItem[0][jyys])
      } else {
        seriesDate.push(NaN)
      }
    }
    seriesItem.name = store.getters.unitName(modes[i])
    seriesItem.data = seriesDate
    series.push(seriesItem)
  }
  renderChart('grid-chart', ftime, series)
}

function renderChart(id, categories, series) {
  let option = {
    chart: {
      type: 'column',
      backgroundColor: '#f8f8f8',
      spacingBottom: 0
    },
    colors: store.state.colors,
    // colors: ['#FB7DFF', '#15F6BA', '#C7FFB4', '#4BF8FF'],
    // colors: ['#FF6665', '#00F62E', '#D5FE00', '#FFC855'],
    // colors: ['#B6A6FF', '#FFBFB7', '#5BCFFF', '#7EB4EA'],
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    xAxis: {
      // categories: [
      //   1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      //   14, 15, 16, 17, 18, 19, 20,21, 22, 23, 24
      // ],
      categories: categories,
      crosshair: true
    },
    yAxis: {
      title: {
        text: ''
      }
    },
    tooltip: {
      // head + 每个 point + footer 拼接成完整的 table
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.3f}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
      backgroundColor: '#000',
      borderColor: '#000',
      style: {
        color: '#fff'
      }
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        // dataLabels: {
        //   enabled: true,
        //   format: '{point.y:.3f}'
        // }
      }
    },
    series
  }
  Highcharts.chart(id, option)
}