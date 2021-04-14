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
            `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?f=pjson&where=AdmUnitId%3D${config.region}&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=county%20asc&outSR=102100&resultOffset=0&resultRecordCount=500&resultType=standard&cacheHint=true`
          )
          .then(res => {
            send({
              payload: {
                region_7_day_incidents: res.data.features[0].attributes.cases7_per_100k,
                state_7_day_incidents: res.data.features[0].attributes.cases7_bl_per_100k,
                region_name: res.data.features[0].attributes.county,
                state_name: res.data.features[0].attributes.BL
              }
            })
            done()
          })
          .catch(() => done())
      })
    }
  }
  red.nodes.registerType('covid-local-incidents', CovidLocalIncidents as any)
}
