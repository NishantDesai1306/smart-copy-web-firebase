module.exports = {
	globDirectory: 'build/',
	globPatterns: [
		'**/*.{png,ico,css,js}',
	],
	swDest: 'build\\sw.js',
	swSrc: 'src/sw.js',
	injectionPointRegexp: /(const precacheManifest = )\[\](;)/,
};
