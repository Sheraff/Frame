self.importScripts('/scripts/Debouncer.js');

const CACHE_NAME = 'frame-files-cache-v0'
const URLS = [
	'/',
	'/style.css',
	'/script.js',
	'/modules/requestIdleNetwork.js',
	'scripts/Debouncer.js',
]

self.addEventListener('install', event => event.waitUntil(
	caches.open(CACHE_NAME)
		.then(cache => cache.addAll(URLS))
		.catch(() => console.warn('URLS list of forced caches is wrong'))
))

self.addEventListener('activate', event => event.waitUntil(
	self.clients.claim().then(async () => {
		const clients = await self.clients.matchAll()
		clients.forEach(client => client.postMessage({ active: true }))
	})
))

const debouncer = new Debouncer(self)

self.addEventListener('fetch', event => event.respondWith(
	caches.match(event.request).then(async cached => {
		// Cache hit - return response
		if (cached)
			return cached

		debouncer.pause()

		// Request
		const response = await fetch(event.request)

		debouncer.start()

		// Bad response, don't cache
		if (!response || response.status !== 200 || response.type !== 'basic')
			return response

		// Cache response
		const responseToCache = response.clone()
		caches.open(CACHE_NAME)
			.then(cache => cache.put(event.request, responseToCache))
		return response;
	})
))