//请引入 proj4.js 和 proj4leaflet.js
L.CRS.Baidu = new L.Proj.CRS('EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=1440 +y_0=255 +datum=WGS84 +units=m +no_defs', {
  resolutions: function () {
    var level = 19;
    var res = [];
    res[0] = Math.pow(2, 18);
    for (var i = 1; i < level; i++) {
      res[i] = Math.pow(2, (18 - i))
    }
    return res;
  }(),
  origin: [0, 0],
  bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
});

L.tileLayer.baidu = function (option) {
  option = option || {};

  var layer;
  var subdomains = '0123456789';
  var attribution = '';
  // var attribution = option.attribution || '&nbsp;&nbsp;&copy; <a href=\"http://www.szmb.gov.cn\">深圳市气象局(台)</a>&nbsp;&nbsp;&nbsp;&nbsp;©Baidu&nbsp; - &nbsp;GS(2012)&nbsp;6003; ';
  switch (option.layer) {
    //单图层
    case "vec":
    default:
      //'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&b=0&limit=60&scaler=1&udt=20170525'
      layer = L.tileLayer('http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=' + (option.bigfont ? 'ph' : 'pl') + '&scaler=1&p=1', {
        name: option.name, subdomains: subdomains, tms: true,
        // attribution: attribution
      });
      break;
    case "MyDitu":
      layer = L.tileLayer('http://api0.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20171110&scale=1&ak=8d6c8b8f3749aed6b1aff3aad6f40e37&styles=t%3Aadministrative%7Ce%3Al%7Cv%3Aoff%7Cc%3A%2300000000%2Ct%3Aland%7Ce%3Aall%7Cc%3A%23fdf9f3ff%2Ct%3Awater%7Ce%3Aall%7Cc%3A%23a3cdffff%2Ct%3Agreen%7Ce%3Aall%7Cc%3A%23c9e59dff%2Ct%3Amanmade%7Ce%3Aall%7Cv%3Aoff%2Ct%3Abuilding%7Ce%3Aall%7Cv%3Aoff%2Ct%3Apoi%7Ce%3Aall%7Cv%3Aoff%2Ct%3Aroad%7Ce%3Aall%7Cv%3Aoff', {
        name: option.name, subdomains: subdomains, tms: true,
        // attribution: attribution
      });
      break;
    case "img_d":
      layer = L.tileLayer('http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46', {
        name: option.name, subdomains: subdomains, tms: true,
        // attribution: attribution
      });
      break;
    case "img_z":
      layer = L.tileLayer('http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=' + (option.bigfont ? 'sh' : 'sl') + '&v=020', {
        name: option.name, subdomains: subdomains, tms: true,
        // attribution: attribution
      });
      break;

    case "custom"://Custom 各种自定义样式
      //可选值：dark,midnight,grayscale,hardedge,light,redalert,googlelite,grassgreen,pink,darkgreen,bluish
      option.customid = option.customid || 'midnight';
      layer = L.tileLayer('http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=' + option.customid, {
        name: option.name, subdomains: "012", tms: true,
        // attribution: attribution
      });
      break;

    case "time"://实时路况
      var time = new Date().getTime();
      layer = L.tileLayer('http://its.map.baidu.com:8002/traffic/TrafficTileService?x={x}&y={y}&level={z}&time=' + time + '&label=web2D&v=017', {
        name: option.name, subdomains: subdomains, tms: true,
        // attribution: attribution
      });
      break;

    //合并
    case "img":
      layer = L.layerGroup([
        L.tileLayer.baidu({ name: "底图", layer: 'img_d', bigfont: option.bigfont }),
        L.tileLayer.baidu({ name: "注记", layer: 'img_z', bigfont: option.bigfont })
      ]);
      break;

    case "secondMap":
      layer = L.tileLayer('https://api.map.baidu.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20191119&scale=1&ak=8d6c8b8f3749aed6b1aff3aad6f40e37&styles=t%3Aroad%7Ce%3Aall%7Cv%3Aoff%2Ct%3Apoi%7Ce%3Aall%7Cv%3Aoff%2Ct%3Aadministrative%7Ce%3Aall%7Cv%3Aoff%2Ct%3Awater%7Ce%3Aall%7Cc%3A%23addbfcff%2Ct%3Aland%7Ce%3Aall%7Cc%3A%23ffffffff%2Ct%3Agreen%7Ce%3Aall%7Cc%3A%23ffffffff', {
        name: option.name, subdomains: subdomains, tms: true
      });
      break;
    case "nationalday":
      layer = L.tileLayer('http://api0.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20190924&scale=1&ak=8d6c8b8f3749aed6b1aff3aad6f40e37&styles=t%3Ahighway%7Ce%3Ag%7Cv%3Aon%7Cc%3A%23f4f3efff%2Ct%3Apoi%7Ce%3Aall%7Cv%3Aoff%2Ct%3Arailway%7Ce%3Aall%7Cv%3Aoff%2Ct%3Asubway%7Ce%3Aall%7Cv%3Aoff%2Ct%3Aadministrative%7Ce%3Aall%7Cv%3Aoff%2Ct%3Agreen%7Ce%3Aall%7Cv%3Aoff%7Cc%3A%23d9ead3ff%2Ct%3Amanmade%7Ce%3Aall%7Cv%3Aoff%2Ct%3Aarterial%7Ce%3Ag%7Cv%3Aon%7Cc%3A%23f4f3efff', {
        name: option.name, subdomains: subdomains, tms: true,
        // attribution: attribution
      });
      break;
    case "white-map":
      // layer = L.tileLayer('https://api.map.baidu.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20191224&scale=1&ak=8d6c8b8f3749aed6b1aff3aad6f40e37&styles=t%3Awater%7Ce%3Aall%7Cc%3A%23a5d6ffff%2Ct%3Aland%7Ce%3Aall%7Cc%3A%23ffffffff%2Ct%3Agreen%7Ce%3Aall%7Cc%3A%23ffffffff%2Ct%3Aroad%7Ce%3Aall%7Cv%3Aoff%2Ct%3Aadministrative%7Ce%3Aall%7Cv%3Aoff%2Ct%3Abuilding%7Ce%3Aall%7Cv%3Aoff%2Ct%3Apoi%7Ce%3Aall%7Cv%3Aoff', {
      //   name: option.name, subdomains: subdomains, tms: true,
        // attribution: attribution
      // });
      layer = L.tileLayer('http://api0.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20171110&scale=1&ak=8d6c8b8f3749aed6b1aff3aad6f40e37&styles=t%3Aadministrative%7Ce%3Al%7Cv%3Aoff%7Cc%3A%2300000000%2Ct%3Aland%7Ce%3Aall%7Cc%3A%23fdf9f3ff%2Ct%3Awater%7Ce%3Aall%7Cc%3A%23a3cdffff%2Ct%3Agreen%7Ce%3Aall%7Cc%3A%23c9e59dff%2Ct%3Amanmade%7Ce%3Aall%7Cv%3Aoff%2Ct%3Abuilding%7Ce%3Aall%7Cv%3Aoff%2Ct%3Apoi%7Ce%3Aall%7Cv%3Aoff%2Ct%3Aroad%7Ce%3Aall%7Cv%3Aoff', {
        name: option.name, subdomains: subdomains, tms: true,
      // attribution: attribution
      });
      break;
  }
  return layer;
};