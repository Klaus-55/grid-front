import Vue from 'vue'
import Vuex from 'vuex'
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    units: [
      {unit: 'BABJ', unitName: '中央台', color: '#FB7DFF'},
      {unit: 'JSCP', unitName: '竞赛产品', color: '#D5FE00'},
      {unit: 'UPLD', unitName: '上传产品', color: '#DF7401'},
      {unit: 'YCP2', unitName: '预案产品2', color: '#FF0000'},
      {unit: 'YCP1', unitName: '预案产品1', color: '#0040FF'},
      {unit: 'BECS', unitName: '地市融合', color: '#15F6BA'},
      {unit: 'ECMT', unitName: '欧洲中心', color: '#C7FFB4'},
      {unit: 'G3KM', unitName: 'GRAPES_3KM', color: '#4BF8FF'},
      {unit: 'GGFS', unitName: 'GRAPES_GFS', color: '#FF6665'},
      {unit: 'GZHR', unitName: '华南模式', color: '#00F62E'},
      {unit: 'PFSN', unitName: '省台指导', color: '#FFC855'},
      {unit: 'SHMR', unitName: '华东模式', color: '#B6A6FF'},
      {unit: 'SOTN', unitName: 'rain2020_freqnew', color: '#FFBFB7'},
      {unit: 'SOTP', unitName: 'rain2020_tp', color: '#5BCFFF'},
      {unit: 'SOTS', unitName: '省台客观', color: '#7EB4EA'},
      {unit: 'v3_sh', unitName: 'v3_sh', color: '#7EB4EA'},
      {unit: 'v1_3km', unitName: 'v1_3km', color: '#5BCFFF'},
      {unit: 'v2_3km', unitName: 'v2_3km', color: '#FFBFB7'},
      {unit: 'v3_nmc', unitName: 'v3_nmc', color: '#00F62E'},
      {unit: 'v3_3km', unitName: 'v3_3km', color: '#4BF8FF'},
      {unit: 'SMG_FORECAST_PL', unitName: 'SMG_FORECAST_PL', color: '#7EB4EA'},
      {unit: 'RAT_QPF', unitName: 'RAT_QPF', color: '#5BCFFF'},
      {unit: 'RAT_FORECAST_PL', unitName: 'RAT_FORECAST_PL', color: '#FFBFB7'},
      {unit: 'RAT_Nowcast', unitName: 'RAT_Nowcast', color: '#00F62E'},
      {unit: 'RAT_FORECAST_DL', unitName: 'RAT_FORECAST_DL', color: '#4BF8FF'},
      {unit: 'RAT_TL', unitName: 'RAT_TL', color: '#FF0000'},
      {unit: 'SMG_Nowcast', unitName: 'SMG_Nowcast', color: '#15F6BA'},
      {unit: 'SMG_FORECAST_DL', unitName: 'SMG_FORECAST_DL', color: '#C7FFB4'},
      {unit: '4daefb68_008_h1', unitName: '4daefb68_008_h1', color: '#C7FFB4'},
      {unit: 'CompCpFT', unitName: 'CompCpFT', color: '#FFBFB7'},
      {unit: '4daefb68_006_h1', unitName: '4daefb68_006_h1', color: '#4BF8FF'},
    ],
    modes: [],
    modelViews: [],
    colors: [],
    selectedModes: [],
    userName: ''
  },
  actions,
  mutations,
  getters,
  modules: {}
})

export default store