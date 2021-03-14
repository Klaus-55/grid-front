
import Highcharts from "highcharts";

export function initEcharts(data, modes, modeViews, ftime, jyys, jysx) {
  ftime.sort((a, b) => a - b)
  modes.sort()
  let series = []
  for (let i = 0; i < modes.length; i++) {
    let seriesItem = {}
    let seriesDate = []
    for (let j = 0; j < ftime.length; j++) {
      let dataItem = data.filter(res => res['wfsrc'] === modes[i] && res['wfhour'] === ftime[j])
      if (jysx === 'zh') {
        dataItem = data.filter(res => res['wfsrc'] === modes[i])
      }
      if (dataItem.length > 0) {
        seriesDate.push(dataItem[0][jyys])
      } else {
        seriesDate.push(NaN)
      }
    }
    seriesItem.name = modeViews[modes[i]]
    seriesItem.data = seriesDate
    series.push(seriesItem)
  }
  renderChart('grid-chart', ftime, series)
}

function renderChart(id, ftime, series) {
  let option = {
    chart: {
      type: 'column',
      backgroundColor: '#f8f8f8',
      spacingBottom: 0
    },
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
      categories: ftime,
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
      useHTML: true
    },
    plotOptions: {
      column: {
        borderWidth: 0
      }
    },
    series
  }
  Highcharts.chart(id, option)
}