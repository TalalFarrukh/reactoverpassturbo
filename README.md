# reactoverpassturbo
This is a fullstack PERN application that uses the Overpass Turbo API to get streets and building data and map them onto leaflet

## Summary of working
There is a radius around the user of the applications. All the roads and the buildings within this radius are fetched from overpass turbo API from OSM and then inserted into a database. So basically as the user keeps moving, the objects around them are fetched and inserted into a database and then displayed onto a web map
