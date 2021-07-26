
import Highcharts from "highcharts";
import store from "../store";
import HighchartsNoData from "highcharts/modules/no-data-to-display";
import HighchartsDrilldown from "highcharts/modules/drilldown";

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

//中短期预报质量图表初始化
export function initMsEcharts(data) {
  let options = {
    chart: {
      type: 'column',
      backgroundColor: '#F8F8F8',
    },
    credits: {
      enabled: false
    },
    colors: ['#5E8CEB', '#59BDBE', '#978EBA', '#EBC980'],
    title: {
      text: ''
    },
    lang: {
      noData: '暂无数据'
    },
    noData: {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#303030'
      }
    },
    xAxis: {
      // categories: ['湖南省','预报员1','预报员2','预报员3'],
      categories: data.categories,
      crosshair: true
    },
    yAxis: {
      // min: 0,
      title: {
        text: ''
      }
    },
    tooltip: {
      // head + 每个 point + footer 拼接成完整的 table
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        dataLabels: {
          enabled: true
        }
      }
    },
    series: data.series
  }
  Highcharts.chart('container', options)
  HighchartsNoData(Highcharts)
}

//短临预报质量图表初始化
export function initSaEcharts(data) {
  let options = {
    chart: {
      type: "column",
      backgroundColor: "#F8F8F8",
    },
    credits: {
      enabled: false,
    },
    colors: [
      "#8FCACB",
      "#C1BAD8",
      "#EA7B7B",
      "#F6A467",
      "#F9CE73",
      "#83A8F2",
    ],
    lang: {
      noData: '暂无数据'
    },
    noData: {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#303030'
      }
    },
    title: {
      text: '',
    },
    xAxis: {
      // categories: [
      //   "湖南省气象台",
      //   "长沙市气象台",
      //   "株洲市气象台",
      //   "湘潭市气象台",
      //   "衡阳市气象台",
      //   "邵阳市气象台",
      //   "岳阳市气象台",
      //   "常德市气象台",
      //   "张家界市气象台",
      //   "益阳市气象台",
      //   "郴州市气象台",
      //   "永州市气象台",
      //   "怀化市气象台",
      //   "娄底市气象台",
      //   "湘西州气象台",
      // ],
      categories: data.categories,
      crosshair: true,
    },
    yAxis: {
      // min: 0,
      title: {
        text: "",
      },
    },
    tooltip: {
      // head + 每个 point + footer 拼接成完整的 table
      headerFormat:
        '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
        },
      },
    },
    // series: [
    //   {
    //     name: "不分级别",
    //     data: [2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3],
    //   },
    //   {
    //     name: "所有级别",
    //     data: [3.1, 3.1, 3.1, 3.1, 3.1, 3.1, 3.1, 3.1, 3.1, 3.1, 3.1, 3.1, 3.1, 3.1, 3.1],
    //   },
    //   {
    //     name: "红色",
    //     data: [1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8],
    //   },
    //   {
    //     name: "橙色",
    //     data: [2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1],
    //   },
    //   {
    //     name: "黄色",
    //     data: [2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5],
    //   },
    //   {
    //     name: "蓝色",
    //     data: [2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4],
    //   },
    // ],
    series: data.series
  };
  HighchartsNoData(Highcharts)
  Highcharts.chart("container", options);
}

//市级预警图表初始化
export function initCityEcharts(data, title) {
  let options = {
    chart: {
      type: "column",
      backgroundColor: "#F8F8F8",
    },
    lang: {
      drillUpText: '<< 返回上一级',
      noData: '暂无数据'
    },
    credits: {
      enabled: false,
    },
    colors: ["#88B5EB"],
    title: {
      text: title,
    },
    legend: {
      enabled: false
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: "",
      },
    },
    tooltip: {
      headerFormat:
        '<span style="font-size:10px"><b>{point.key}:{point.y:.1f}</b></span>',
      pointFormat: "",
      footerFormat: "",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [{
      colorByPoint: true,
      data: data.data
      // data: [
      //   {name: '湖南省', y: 75.2, drilldown: '湖南省'},
      //   {name: '长沙', y: 3.2, drilldown: 'changsha'},
      //   {name: '株洲', y: 3.1, drilldown: 'zhuzhou'},
      //   {name: '湘潭', y: 3.0, drilldown: 'xiangtan'},
      //   {name: '衡阳', y: 3.0, drilldown: 'hengyang'},
      //   {name: '岳阳', y: 3.0, drilldown: 'yueyang'},
      //   {name: '张家界', y: 3.0, drilldown: 'zhangjiajie'},
      //   {name: '娄底', y: 3.0, drilldown: 'loudi'},
      //   {name: '郴州', y: 3.0, drilldown: 'chenzhou'},
      //   {name: '常德', y: 3.0, drilldown: 'changde'},
      //   {name: '益阳', y: 3.0, drilldown: 'yiyang'},
      //   {name: '邵阳', y: 3.0, drilldown: 'shaoyang'},
      //   {name: '永州', y: 3.0, drilldown: 'yongzhou'},
      //   {name: '怀化', y: 3.0, drilldown: 'huaihua'},
      //   {name: '湘西州', y: 3.0, drilldown: 'xiangxizhou'},
      // ]
    }],
    drilldown: {
      drillUpButton: {
        relativeTo: 'spacingBox',
        position: {
          align: 'left',
          y: -5,
          x: -5
        }
      },
      series: data.series
      // series: [
      //   {
      //     id: '湖南省',
      //     data: [
      //       {name: '唐佳', y: 2.1},
      //       {name: '陈龙', y: 1.8},
      //       {name: '兰明才', y: 1.6},
      //       {name: '徐靖宇', y: 1.8},
      //       {name: '蔡瑾婕', y: 1.3},
      //       {name: '苏涛', y: 1.1},
      //     ]
      //   }, {
      //     id: 'changsha',
      //     data: [
      //       {name: '长沙市气象台', y: 4}
      //     ]
      //   }, {
      //     id: 'zhuzhou',
      //     data: [
      //       {name: '株洲市气象台', y: 4}
      //     ]
      //   }, {
      //     id: 'xiangtan',
      //     data: [
      //       {name: '湘潭市气象台', y: 4}
      //     ]
      //   }, {
      //     id: 'hengyang',
      //     data: [
      //
      //     ]
      //   }
      // ]
    }
  };
  HighchartsDrilldown(Highcharts)
  Highcharts.chart("bottom-highcharts", options);
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

