console.log("Map Toen", mapToken);
mapboxgl.accessToken = mapToken;
const defaultCenter = [72.5714, 23.0225];
const map = new mapboxgl.Map({
  container: "map", // container ID // [lng, lat]
  // center:
  //   listing?.geometry?.coordinates && listing.geometry.coordinates.length === 2
  //     ? listing.geometry.coordinates
  //     : defaultCenter,
  center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  // center: [72.5714, 23.0225], // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

console.log(listing.geometry.coordinates);
const marker1 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates) //lisitng.geometry.coordinates
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`
    )
  )
  .addTo(map);
