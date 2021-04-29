import * as Axios from 'axios'
import * as fs from 'fs'

describe('covid-regional-icus', () => {
  it('returns the current incident value for the selected region', async () => {
    // const res = await Axios.default.get(
    //   'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=county%20asc&resultOffset=0&resultRecordCount=500&resultType=standard&cacheHint=true'
    // )
    // let c: [{ attributes: {
    //   AdmUnitId: number,
    //   GEN: string
    //  }}] = res.data.features
    // c = c.sort((i1, i2) => i1.attributes.GEN.localeCompare(i2.attributes.GEN))
    // for(const x of c) {
    //   fs.appendFileSync('output.html', `<option value="${x.attributes.AdmUnitId}">${x.attributes.GEN}</option>\n`)
    // }
  })
})
