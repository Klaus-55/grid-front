import Highcharts from "highcharts";
import store from "../store";
import HighchartsNoData from "highcharts/modules/no-data-to-display";
import HighchartsDrilldown from "highcharts/modules/drilldown";
import loadExporting from "highcharts/modules/exporting";
import FileSaver from "file-saver";
import XLSX from "xlsx";

loadExporting(Highcharts)

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
export function initMsEcharts(data, title, container) {
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
      text: title,
      margin: 5,
      style: {
        color: '#000',
        font: 'bold 20px "Trebuchet MS", Verdana, sans-serif'
      }
    },
    lang: {
      downloadPNG: "下载PNG文件",
      downloadJPEG: "下载JPEG图片",
      downloadSVG: "下载SVG文件",
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
    series: data.series,
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ['downloadPNG', 'downloadJPEG', 'downloadSVG']
        }
      }
    }
  }
  HighchartsNoData(Highcharts)
  Highcharts.chart(container, options)
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
    colors: data.colors,
    lang: {
      downloadPNG: "下载PNG文件",
      downloadJPEG: "下载JPEG图片",
      downloadSVG: "下载SVG文件",
      noData: '暂无数据'
    },
    noData: {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#303030'
      }
    },
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ['downloadPNG', 'downloadJPEG', 'downloadSVG']
        }
      }
    },
    title: {
      text: '',
    },
    xAxis: {
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
      events: {
        drillup: function(e) {
          // 上钻回调事件
          console.log(e.seriesOptions);
        },
        drilldown: function (e) {
          console.log(e)
        }
      }
    },
    lang: {
      downloadPNG: "下载PNG文件",
      downloadJPEG: "下载JPEG图片",
      downloadSVG: "下载SVG文件",
      drillUpText: '<< 返回上一级',
      noData: '暂无数据'
    },
    noData: {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#303030'
      }
    },
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ['downloadPNG', 'downloadJPEG', 'downloadSVG']
        }
      }
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

//市级预警图表初始化
export function initCityEcharts2({data, factory, title}) {
  let rd = data['area']
  let series = []
  let areas = ["湖南省", "长沙市","株洲市","湘潭市","衡阳市","邵阳市","岳阳市",
    "常德市","张家界市","益阳市","郴州市","永州市","怀化市","娄底市","湘西州"]
  let levels = ["红色", "橙色", "黄色", "蓝色"]
  for (let level of levels) {
    let seriesItem = {}
    let seriesData = []
    seriesItem.name = level
    for (let area of areas) {
      let obj = rd.find(obj => obj['area'] === area && obj['level'] === level);
      if (typeof obj === 'undefined') {
        seriesData.push(NaN)
      } else {
        seriesData.push(obj[factory])
      }
    }
    seriesItem.data = seriesData
    series.push(seriesItem)
  }
  let options = {
    chart: {
      type: "column",
      backgroundColor: "#F8F8F8",
    },
    lang: {
      downloadPNG: "下载PNG文件",
      downloadJPEG: "下载JPEG图片",
      downloadSVG: "下载SVG文件",
      noData: '暂无数据'
    },
    noData: {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#303030'
      }
    },
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ['downloadPNG', 'downloadJPEG', 'downloadSVG']
        }
      }
    },
    credits: {
      enabled: false,
    },
    colors: ["#EA7B7B",
              "#F6A467",
              "#F9CE73",
              "#83A8F2",],
    title: {
      text: title,
    },
    legend: {
      enabled: true
    },
    xAxis: {
      categories: areas,
    },
    yAxis: {
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
    series: series
  };
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
    lang: {
      downloadPNG: "下载PNG文件",
      downloadJPEG: "下载JPEG图片",
      downloadSVG: "下载SVG文件",
      noData: '暂无数据'
    },
    noData: {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#303030'
      }
    },
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ['downloadPNG', 'downloadJPEG', 'downloadSVG']
        }
      }
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

//省级预报竞赛图表初始化
export function initProChart(data, container) {
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
      text: '',
      margin: 5,
      style: {
        color: '#000',
        font: 'bold 20px "Trebuchet MS", Verdana, sans-serif'
      }
    },
    lang: {
      downloadPNG: "下载PNG文件",
      downloadJPEG: "下载JPEG图片",
      downloadSVG: "下载SVG文件",
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
    series: data.series,
    // series: [{
    //   name: '综合',
    //   data: [49.9, 71.5, 25.4, 56.2]
    // }, {
    //   name: '预警消息',
    //   data: [83.6, 78.8, 98.5, 93.4]
    // }, {
    //   name: '天气公报',
    //   data: [48.9, 38.8, 39.3, 41.4]
    // }, {
    //   name: '降水过程',
    //   data: [42.4, 33.2, 34.5, 39.7]
    // }],
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ['downloadPNG', 'downloadJPEG', 'downloadSVG']
        }
      }
    }
  }
  HighchartsNoData(Highcharts)
  Highcharts.chart(container, options)
}

//模式检验图表初始化
export function renderModelChart(data, mainTitle, subtitle, container) {
  let options = {
    chart: {
      type: "column",
      backgroundColor: "#F8F8F8",
    },
    credits: {
      enabled: false,
    },
    colors: ["#5E8CEB", "#59BDBE", "#978EBA", "#EBC980"],
    title: {
      text: mainTitle,
      margin: 5,
      style: {
        color: '#000',
        font: 'bold 20px "Trebuchet MS", Verdana, sans-serif'
      }
    },
    subtitle: {
      text: subtitle
    },
    lang: {
      downloadPNG: "下载PNG文件",
      downloadJPEG: "下载JPEG图片",
      downloadSVG: "下载SVG文件",
      noData: '暂无数据'
    },
    noData: {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#303030'
      }
    },
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ['downloadPNG', 'downloadJPEG', 'downloadSVG']
        }
      }
    },
    xAxis: {
      categories: data.categories,
      crosshair: true,
    },
    yAxis: {
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
        '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
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
    series: data.series
  };
  HighchartsNoData(Highcharts)
  Highcharts.chart(container, options);
}

export function exportExcelCom(document, id, title) {
  /* 从表生成工作簿对象 */
  let fix = document.querySelector('.el-table__fixed');
  let wb;
  if (fix) {
    wb = XLSX.utils.table_to_book(document.querySelector(id).removeChild(fix));
    document.querySelector(id).appendChild(fix);
  } else {
    wb = XLSX.utils.table_to_book(document.querySelector(id));
  }
  /* 获取二进制字符串作为输出 */
  let wbout = XLSX.write(wb, {
    bookType: "xlsx",
    bookSST: true,
    type: "array"
  });
  try {
    FileSaver.saveAs(
      //Blob 对象表示一个不可变、原始数据的类文件对象。
      //Blob 表示的不一定是JavaScript原生格式的数据。
      //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
      //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
      new Blob([wbout], { type: "application/octet-stream" }),
      //设置导出文件名称
      title
    );
  } catch (e) {
    if (typeof console !== "undefined") console.log(e, wbout);
  }
  return wbout;
}

