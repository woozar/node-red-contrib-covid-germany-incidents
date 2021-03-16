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
                    .get("https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?f=json&where=AdmUnitId%3D" + config.region + "&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=county%20asc&outSR=102100&resultOffset=0&resultRecordCount=500&resultType=standard&cacheHint=true")
                    .then(function (res) {
                    send({
                        payload: {
                            region_7_day_incidents: res.data.features[0].attributes.cases7_per_100k,
                            state_7_day_incidents: res.data.features[0].attributes.cases7_bl_per_100k,
                            region_name: res.data.features[0].attributes.county,
                            state_name: res.data.features[0].attributes.BL
                        }
                    });
                    done();
                })
                    .catch(function () { return done(); });
            });
        }
        return CovidLocalIncidents;
    }());
    red.nodes.registerType('covid-local-incidents', CovidLocalIncidents);
};
