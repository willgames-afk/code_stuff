const cacheName = 'testIDE-v0';
const appShellFiles = [
	'/',
	'index.html',
	'index.js',
];
const contentToCache = appShellFiles;

//Install Service Worker
self.addEventListener('install', (e) => {
	console.log("[Service Worker] Install");
	e.waitUntil((async () => {
		const cache = await caches.open(cacheName);
		console.log("[Service Worker] Caching all: app shell and content");
		await cache.addAll(contentToCache);
	})());
});

//Fetch Content
self.addEventListener("fetch", (e) => {
	e.respondWith((async () => {
		const r = await caches.match(e.request);
		console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
		if (r) return r;
		const response = await fetch(e.request);
		const cache = await caches.open(cacheName);
		console.log(`[Service Worker] Caching new resource: ${e.request.url}`)
		cache.put(e.request, response.clone());
		return response;
	})());
});