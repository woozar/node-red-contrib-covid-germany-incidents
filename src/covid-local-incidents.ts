import * as Axios from 'axios'
// eslint-disable-next-line import/no-unresolved, no-unused-vars
import { Red, Node, NodeProperties } from 'node-red'

interface LocalIncidentsProperties extends NodeProperties {
  name: string
  region: string
}

module.exports = (red: Red): void => {
  class CovidLocalIncidents {
    constructor(config: LocalIncidentsProperties) {
      red.nodes.createNode(this as any, config)
      const node: Node = this as any
      node.on('input', (_msg: any, send: Function, done: Function) => {
        Axios.default
          .get(
            `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?f=json&where=AdmUnitId%3D${config.region}&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=county%20asc&outSR=102100&resultOffset=0&resultRecordCount=500&resultType=standard&cacheHint=true`
          )
          .then(res => {
            send({
              local_7_day_incidents: res.data.features[0].properties.cases7_per_100k,
              regional_7_day_incidents: res.data.features[0].properties.cases7_bl_per_100k,
              local_name: res.data.features[0].properties.county,
              regional_name: res.data.features[0].properties.BL
            })
            done()
          })
      })
    }
  }
  red.nodes.registerType('time-based-dimmer', CovidLocalIncidents as any)
}
