/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

const precacheManifest = [];


const CDNFiles = [
	'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
	'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
	'https://fonts.googleapis.com/icon?family=Material+Icons',
	'https://use.fontawesome.com/releases/v5.8.1/css/all.css',
];
const pagesToCache = [
	'/offline.html',
];
const CDNCacheName = 'cdn-files-v2';
const pageCacheName = 'pages-cache-v1';

// workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(precacheManifest);

const hydrateCache = async () => {
	// add cdn cache only if required as cdn files are not going to get changed
	const hydrateCDNCache = async () => {
		const hasAlreadyCached = await caches.has(CDNCacheName);

		if (!hasAlreadyCached) {
			const cache = await caches.open(CDNCacheName);
			await cache.addAll(CDNFiles);
		}
	};

	const hydratePagesCache = async () => {
		const hasAlreadyCached = await caches.has(pageCacheName);

		if (!hasAlreadyCached) {
			const cache = await caches.open(pageCacheName);
			await cache.addAll(pagesToCache);
		}
	};

	// cache cdn files and pages required
	await hydrateCDNCache();
	await hydratePagesCache();
};

// when installing hydrate caches and notify user that reload if required (if any)
self.addEventListener('install', async () => {
	const channel = new BroadcastChannel('service-worker-channel');

	// do we have to send it every time ? even when sw is being registered for the first time.
	channel.postMessage({
		promptReload: true,
	});

	await hydrateCache();

	channel.onmessage = async (message) => {
		const {
			data: {
				skipWaiting,
			},
		} = message;

		if (skipWaiting) {
			self.skipWaiting();
		}
	};
});

// delete old caches that are not required like old page caches
self.addEventListener('activate', (event) => {
	const cacheWhitelist = [
		CDNCacheName,
		pageCacheName,
		/^workbox-precache/,
	];

	event.waitUntil(
		caches.keys().then((cacheNames) => {
			Promise.all(
				cacheNames
					.filter((cacheName) => {
						let returnValue = false;

						for (let i = 0; i < cacheWhitelist.length; i += 1) {
							const item = cacheWhitelist[i];

							if (item instanceof RegExp) {
								returnValue = item.test(cacheName);
							}
							else {
								returnValue = item === cacheName;
							}

							if (returnValue) {
								return false;
							}
						}

						return true;
					})
					.map((cacheName) => {
						console.log('deleting cache', cacheName);
						return caches.delete(cacheName);
					}),
			);
		}),
	);
});

// intercept fetch requests and responds with cached file if they are available like CDN Files
self.addEventListener('fetch', (event) => {
	console.log('fetch event', event.request.url);
	// request.mode = navigate isn't supported in all browsers
	// so include a check for Accept: text/html header.
	// if (event.request.method === 'GET') {
	// 	console.log(event.request.url, event.request.headers.get('accept'));
	// }
	// ignore these request
	if (event.request.destination === 'document') {
		console.log('ignoring request', event.request.url);
		return fetch(event.request);
	}

	if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
		console.log('here');
		event.respondWith(
			fetch(event.request.url).catch((error) => {
				console.log(123, error);
				// Return the offline page
				return caches.match('/offline.html');
			}),
		);
	}
	else {
		event.respondWith(
			caches.match(event.request)
				.then((response) => {
					if (response) {
						console.log('Found ', event.request.url, ' in cache');
						return response;
					}

					return fetch(event.request);
				}),
		);
	}
});
