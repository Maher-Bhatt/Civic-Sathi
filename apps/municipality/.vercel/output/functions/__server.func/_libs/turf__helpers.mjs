//#region ../../node_modules/@turf/helpers/dist/esm/index.js
var earthRadius = 6371008.8;
earthRadius * 100, earthRadius * 100, earthRadius * 100, 360 / (2 * Math.PI), 360 / (2 * Math.PI), earthRadius * 3.28084, earthRadius * 3.28084, earthRadius * 39.37, earthRadius * 39.37, earthRadius / 1e3, earthRadius / 1e3, earthRadius / 1e3, earthRadius / 1609.344, earthRadius / 1609.344, earthRadius * 1e3, earthRadius * 1e3, earthRadius * 1e3, earthRadius / 1852, earthRadius / 1852, earthRadius * 1.0936, earthRadius * 1.0936;
function feature(geom, properties, options = {}) {
	const feat = { type: "Feature" };
	if (options.id === 0 || options.id) feat.id = options.id;
	if (options.bbox) feat.bbox = options.bbox;
	feat.properties = properties || {};
	feat.geometry = geom;
	return feat;
}
function polygon(coordinates, properties, options = {}) {
	for (const ring of coordinates) {
		if (ring.length < 4) throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
		if (ring[ring.length - 1].length !== ring[0].length) throw new Error("First and last Position are not equivalent.");
		for (let j = 0; j < ring[ring.length - 1].length; j++) if (ring[ring.length - 1][j] !== ring[0][j]) throw new Error("First and last Position are not equivalent.");
	}
	return feature({
		type: "Polygon",
		coordinates
	}, properties, options);
}
function featureCollection(features, options = {}) {
	const fc = { type: "FeatureCollection" };
	if (options.id) fc.id = options.id;
	if (options.bbox) fc.bbox = options.bbox;
	fc.features = features;
	return fc;
}
function multiPolygon(coordinates, properties, options = {}) {
	return feature({
		type: "MultiPolygon",
		coordinates
	}, properties, options);
}
//#endregion
export { multiPolygon as n, polygon as r, featureCollection as t };
