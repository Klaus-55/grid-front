import {
  updateModes,
  changeModes,
} from "./mutation-types";
import * as Utils from "../common/utils"
export default {
  [updateModes](state, payload) {
    let temp = [];
    state.modelViews.forEach(res => {
      let index = state.modes.indexOf(res);
      if (index === -1) {
        temp.push(res);
      }
    });
    state.modes = []
    state.modelViews = []
    state.colors = []
    let modes = []
    //循环遍历data取出当前数据所有的模式代码
    for (const d of payload.data) {
      if (modes.indexOf(d['wfsrc']) === -1) {
        modes.push(d['wfsrc'])
      }
    }
    //根据顺序添加模式
    for (const unit of state.units) {
      if (modes.indexOf(unit['unit']) !== -1) {
        state.modelViews.push(unit['unit'])
        state.modes.push(unit['unit'])
        state.colors.push(unit['color'])
      }
    }
    if (temp.length > 0) {
      for (const t of temp) {
        let index = state.modes.indexOf(t)
        if (index !== -1) {
          state.modes.splice(index, 1)
          state.colors.splice(index, 1)
        }
      }
    }
    if (payload.jyx === 'jqpf') {
      let index1 = state.modes.indexOf('BABJ');
      let index2 = state.modelViews.indexOf('BABJ');
      if (index1 !== -1) {
        state.modes.splice(index1, 1)
        state.colors.splice(index1, 1)
      }
      if (index2 !== -1) {
        state.modelViews.splice(index2, 1)
      }
    }
    // state.modelViews.push(...state.modes)
  },
  [changeModes](state, modes) {
    state.modes = []
    state.colors = []
    for (const unit of state.units) {
      if (modes.indexOf(unit['unit']) !== -1) {
        state.modes.push(unit['unit'])
        state.colors.push(unit['color'])
      }
    }
  }
}