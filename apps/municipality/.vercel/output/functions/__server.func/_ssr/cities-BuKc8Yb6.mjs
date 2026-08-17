//#region node_modules/.nitro/vite/services/ssr/assets/cities-BuKc8Yb6.js
var CITIES = [{
	id: "vadodara",
	name: "Vadodara",
	state: "Gujarat",
	center: [22.3072, 73.1812],
	zoom: 13
}, {
	id: "bengaluru",
	name: "Bengaluru",
	state: "Karnataka",
	center: [12.9716, 77.5946],
	zoom: 12
}];
var getCity = (id) => CITIES.find((c) => c.id === id) ?? CITIES[0];
/** Neutral, muted basemaps — no blue-heavy, neon or rainbow styling. */
var TILES = {
	dark: {
		url: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
		labels: "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
	},
	light: {
		url: "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
		labels: "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
	}
};
var ATTRIBUTION = "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy; <a href=\"https://carto.com/attributions\">CARTO</a>";
//#endregion
export { getCity as i, CITIES as n, TILES as r, ATTRIBUTION as t };
