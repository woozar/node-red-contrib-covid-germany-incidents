import * as Axios from 'axios'
// eslint-disable-next-line import/no-unresolved, no-unused-vars
import { Red, Node, NodeProperties } from 'node-red'

interface RegionalVaccinationsProperties extends NodeProperties {
  name: string
  region: string
}

interface Region {
  code: string
  population: number
}

interface RegionsData {
  [key: number]: Region
}

interface VaccinationData {
  population: number
  vaccinationsTotal: number
  peopleFirstTotal: number
  peopleFullTotal: number
  vaccinationsPercent: number
  peopleFirstPercent: number
  peopleFullPercent: number
}

async function getRegions(): Promise<RegionsData> {
  const getInhabitants = await Axios.default.get(`https://impfdashboard.de/data/regions.35d24a86.tsv`).catch(e => {
    throw new Error(`Could not load regions. ${e.message}`)
  })
  const result: RegionsData = {}
  for (const line of (getInhabitants.data as string).split('\n')) {
    const cols = line.split('\t')
    // skip first line
    if (cols.length < 4 || cols[1] === 'id') continue
    result[Number.parseInt(cols[1])] = {
      code: cols[2],
      population: Number.parseInt(cols[3])
    }
  }
  return result
}

async function getData(region: Region): Promise<VaccinationData> {
  const getVaccinations = await Axios.default.get(`https://impfdashboard.de/static/data/germany_vaccinations_by_state.tsv`).catch(e => {
    throw new Error(`Could not load data. ${e.message}`)
  })
  for (const line of (getVaccinations.data as string).split('\n')) {
    const cols = line.split('\t')
    if (cols[0] === region.code) {
      // code	vaccinationsTotal	peopleFirstTotal	peopleFullTotal
      return {
        population: region.population,
        vaccinationsTotal: Number.parseInt(cols[1]),
        peopleFirstTotal: Number.parseInt(cols[2]),
        peopleFullTotal: Number.parseInt(cols[3]),
        vaccinationsPercent: Math.round((1000 * Number.parseInt(cols[1])) / region.population) / 10,
        peopleFirstPercent: Math.round((1000 * Number.parseInt(cols[2])) / region.population) / 10,
        peopleFullPercent: Math.round((1000 * Number.parseInt(cols[3])) / region.population) / 10
      }
    }
  }
}

module.exports = (red: Red): void => {
  class CovidRegionalVaccinations {
    constructor(config: RegionalVaccinationsProperties) {
      red.nodes.createNode(this as any, config)
      const node: Node = this as any
      node.on('input', (_msg: any, send: Function, done: Function) => {
        getRegions()
          .then(async regions => {
            const data = await getData(regions[Number.parseInt(config.region)])
            send({ payload: data })
            done()
          })
          .catch(e => {
            node.error(e.message)
            done()
          })
      })
    }
  }
  red.nodes.registerType('covid-regional-vaccinations', CovidRegionalVaccinations as any)
}
