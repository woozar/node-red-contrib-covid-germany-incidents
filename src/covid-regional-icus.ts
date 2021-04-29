import * as Axios from 'axios'
// eslint-disable-next-line import/no-unresolved, no-unused-vars
import { Red, Node, NodeProperties } from 'node-red'

interface LocalIncidentsProperties extends NodeProperties {
  name: string
  region: string
}

module.exports = (red: Red): void => {
  class CovidRegionalIncidents {
    constructor(config: LocalIncidentsProperties) {
      red.nodes.createNode(this as any, config)
      const node: Node = this as any
      node.on('input', (_msg: any, send: Function, done: Function) => {
        Axios.default
          .get(
            `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/DIVI_Intensivregister_Landkreise/FeatureServer/0/query?where=BL__ID%3D${config.region}&returnGeodetic=false&outFields=*&returnGeometry=false&f=pjson`
          )
          .then(res => {
            const payload = {
              sites_count: 0,
              units_used: 0,
              units_free: 0,
              units_total: 0,
              covid_cases: 0,
              covid_cases_ventilated: 0,
              region_name: '',
              state_name: ''
            } as any
            for(const item of res.data.features) {
              payload.sites_count += item.attributes.anzahl_standorte
              payload.units_used += item.attributes.betten_belegt
              payload.units_free += item.attributes.betten_frei
              payload.units_total += item.attributes.betten_gesamt
              payload.covid_cases += item.attributes.faelle_covid_aktuell
              payload.covid_cases_ventilated += item.attributes.faelle_covid_aktuell_beatmet
              payload.region_name = item.attributes.county
              payload.state_name = item.attributes.BL
            }
            payload.units_free_percent = 100 * payload.units_free / payload.units_total
            payload.covid_cases_percent = 100 * payload.covid_cases / payload.units_total
            payload.covid_cases_ventilated_percent = 100 * payload.covid_cases_ventilated / payload.covid_cases

            send({ payload })
            done()
          })
          .catch(() => done())
      })
    }
  }
  red.nodes.registerType('covid-regional-icus', CovidRegionalIncidents as any)
}
