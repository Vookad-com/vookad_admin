import { useEffect, useState, useRef } from 'react';
import mapboxgl from "mapbox-gl"; 
import 'mapbox-gl/src/css/mapbox-gl.css'
import styles from "./mapInput.module.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX;

function MapInput(props) {
    const setPickup = props.settingMap;
    const [lng, setLng] = useState(null);
    const [lat, setLat] = useState(null);

    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);
    const [zoom, setZoom] = useState(9);
    const [searchLoco, setSearch] = useState('');
    const [Lresults, setResults] = useState([]);

    function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        } else {
          alert("Geolocation is not supported by this browser.");
        }
      }
  
    function showPosition(position) {
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
    }

    function setPosition(lat, lng){
        map.current.setCenter([lng,lat]);
        marker.current.setLngLat([lng,lat]);
        setResults([]);
    }

    async function handleSearch(e){
        setSearch(e.target.value);
        let search = e.target.value;
        let results = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?proximity=${lng},${lat}&access_token=${process.env.NEXT_PUBLIC_MAPBOX}`)
        let jsonify = await results.json();
        setResults(jsonify.features)
    }

    useEffect(() => {
        if (lng == null) {
          getLocation();
          return;
        }
        map.current = new mapboxgl.Map({
          container: "map", // container ID
          style: "mapbox://styles/mapbox/streets-v9", // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
          center: [lng, lat], // starting position
          zoom: 12, // starting zoom
        });
        const liveLocation = document.createElement("div");
        liveLocation.className = "liveLocation";

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(liveLocation).setLngLat([lng, lat]).addTo(map.current);
        marker.current = new mapboxgl.Marker({ draggable: true })
          .setLngLat([lng, lat])
          .addTo(map.current);
        setPickup([lng, lat]);
        function onDragEnd() {
          const lngLat = marker.current.getLngLat();
          setPickup([lngLat.lng, lngLat.lat]);
        }
        marker.current.on("dragend", onDragEnd);
      }, [lat,lng]);

    return <>
        {lng ? <div ref={mapContainer} className={styles.mapContainer} id="map">
                    <div className={styles.mapSearch}>
                        <input type="text" onChange={handleSearch} value={searchLoco} placeholder="Search Location" />
                        <ul>
                            {
                                Lresults.map((result,i) => (
                                    <li key={i} cursor="pointer" onClick={()=>{
                                        setPosition(result.center[1],result.center[0])
                                    }} >{result.place_name}</li>
                                ))
                            }
                        </ul>
                    </div>
                    <button onClick={(e)=>{
                        e.preventDefault();
                        map.current.setCenter([lng,lat]);
                        marker.current.setLngLat([lng,lat]);
                    }} className={styles.relocate}>
                    </button>
                </div> : `loading...`}
        </>;
};

export default MapInput;