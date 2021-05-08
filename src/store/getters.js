export default {
  unitName(state) {
    return (unit) => {
      let unitItem = state.units.filter(res => res['unit'] === unit);
      if (unitItem.length > 0) {
        return unitItem[0]['unitName']
      }
    }
  }
}