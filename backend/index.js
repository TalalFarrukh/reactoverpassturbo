const express = require('express')
const PORT = 5000
const bodyParser = require('body-parser')
const client = require('./db.js')
const cors = require('cors')
const overpass = require('query-overpass')
const queryOverpass = require('@derhuerst/query-overpass')
const osmtogeojson = require('osmtogeojson')


const app = express()
app.use(cors())

app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(bodyParser.json())


app.post("/insertRoads", async (req, res) => {
    const {loc} = req.body
    
    const south = loc.coordinates.lat - 0.01; const north = loc.coordinates.lat + 0.01
    const west = loc.coordinates.lng - 0.01; const east = loc.coordinates.lng + 0.01

    const query = `[out:json][bbox:${south}, ${west}, ${north}, ${east}][timeout:25];
    ( way["highway"="tertiary"]; way["highway"="residential"]; way["highway"="service"]; 
    way["highway"="unclassified"]; way["highway"="living_street"];
    way["building"="residential"]; way["building"="apartments"]; way["building"="detached"]; way["building"="house"];
    way["building"="bungalow"]; way["building"="semidetached_house"]; way["building"="terrace"];
    way["building"="commercial"]; way["building"="industrial"]; way["building"="office"];
    way["building"="retail"]; way["building"="supermarket"]; way["building"="warehouse"]; );out body;>;out skel qt;`
    
    const z = await queryOverpass(query)


    //go to node_modules > osmtogeojson > index.js > make the following changes on line 180, 181, 183, 187, 198:
    //change json.element to json
    const convertData = await osmtogeojson(z, {flatProperties: true})   
    
    var group_id = await client.query(`SELECT group_id FROM roads ORDER BY group_id DESC LIMIT 1`)
    if(group_id.rows.length > 0) {
        group_id = group_id.rows[0].group_id
    }
    else {
        group_id = 1
    }

    if(convertData) {
        console.log('Data converted')
        const features = convertData.features
        client.query(`SELECT id, way_id, ST_AsGeoJSON(ST_FlipCoordinates(geometry))::json AS geojson FROM roads`, async (err, results) => {
            if(!err) {
                features.forEach(async feature => {
                    if(!results.rows.some(x => x.way_id === feature.properties.id)) {
                        await client.query(`insert into roads (way_id, geometry, group_id, type) values ($1 ,ST_GeomFromGeoJSON($2), $3, $4)`, 
                        [feature.properties.id, feature.geometry, group_id, feature.geometry.type], (err, results) => {
                            if(err) console.log(err.message)
                        })
                    }
                })
    
                res.status(200).json('Success')
            }
    
            else console.log(err.message)
        })
    }

    client.end
    
})


app.get("/getRoads", async (req, res) => {
    client.query(`SELECT way_id, group_id, type, ST_AsGeoJSON(ST_FlipCoordinates(geometry))::json AS geojson FROM roads`, (err, results) => {
        if(!err) {
            console.log(results.rows)
            res.status(200).json(results.rows)
        } 
        else console.log(err.message)
    })
    client.end
})


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})


