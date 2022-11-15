import React , { useState, useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Polyline, Polygon, Popup } from 'react-leaflet'
import useGeoLoc from './useGeoLoc'
import { useSelector, useDispatch } from 'react-redux'
import { addLayer } from '../features/lineSlice'
import { addShapeLayer } from '../features/shapeSlice'


const Map = () => {

    const [data, setData] = useState(null)

    const [response, setResponse] = useState('')

    const polylineRedux = useSelector((state) => state.line.lineData)
    const polygonRedux = useSelector((state) => state.shape.shapeData)
    const dispatch = useDispatch()

    const loc = useGeoLoc()     //call useGeoLoc.js to get location of user

    useEffect(() => {
        fetch("http://localhost:5000/getRoads").then(response => {
            return response.json()
          }).then(geojson => {setData(geojson)}).then(() => {
            if(data) {
                data.forEach(element => {
                    if(element.type==="Polygon") {
                        dispatch(addShapeLayer(element))
                    }
                    else if(element.type==="LineString") {
                        dispatch(addLayer(element))
                    }
                })
            }
        })
    }, [loc])
    
    const insert = () => {
        fetch("http://localhost:5000/insertRoads", {
            method: "post",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({loc})
        })
        .then(res => setResponse(res))         
    }

  return (
    <div>
        <MapContainer center={[33.64498558968215, 72.98832287301876]} zoom={13} >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
            {polylineRedux ? polylineRedux.map(line => {return line ? 
                <Polyline pathOptions={{color:'red', weight:4}} positions={line.geojson.coordinates}>
                    <Popup>Way_id: {line.way_id} <br></br> Group_id: {line.group_id}</Popup>
                </Polyline>
            : null}) : null}

            {polygonRedux ? polygonRedux.map(shape => {return shape ? 
                <Polygon pathOptions={{color:'purple'}} positions={shape.geojson.coordinates}>
                    <Popup>Way_id: {shape.way_id} <br></br> Group_id: {shape.group_id}</Popup>
                </Polygon>
            : null}) : null}
        
        </MapContainer>
        


        

        <button onClick={insert}>Insert</button>
    </div>

  )
}

export default Map