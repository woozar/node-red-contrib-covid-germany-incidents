"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Axios = require("axios");
module.exports = function (red) {
    var CovidLocalIncidents = (function () {
        function CovidLocalIncidents(config) {
            red.nodes.createNode(this, config);
            var node = this;
            node.on('input', function (_msg, send, done) {
                Axios.default
                    .get("https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/DIVI_Intensivregister_Landkreise/FeatureServer/0/query?where=AGS%3D" + config.region + "&returnGeodetic=false&outFields=*&returnGeometry=false&f=pjson")
                    .then(function (res) {
                    send({
                        payload: {
                            sites_count: res.data.features[0].attributes.anzahl_standorte,
                            units_used: res.data.features[0].attributes.betten_belegt,
                            units_free: res.data.features[0].attributes.betten_frei,
                            units_free_percent: res.data.features[0].attributes.Anteil_betten_frei,
                            units_total: res.data.features[0].attributes.betten_gesamt,
                            covid_cases: res.data.features[0].attributes.faelle_covid_aktuell,
                            covid_cases_ventilated: res.data.features[0].attributes.faelle_covid_aktuell_beatmet,
                            covid_cases_ventilated_percent: res.data.features[0].attributes.Anteil_covid_beatmet,
                            covid_cases_percent: res.data.features[0].attributes.Anteil_COVID_betten,
                            region_name: res.data.features[0].attributes.county,
                            state_name: res.data.features[0].attributes.BL,
                            date: res.data.features[0].attributes.daten_stand
                        }
                    });
                    done();
                })
                    .catch(function () { return done(); });
            });
        }
        return CovidLocalIncidents;
    }());
    red.nodes.registerType('covid-local-icus', CovidLocalIncidents);
};
