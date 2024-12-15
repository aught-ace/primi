const CACHE_NAME = 'Primi'
const urlsToCache =
[
	'./manifest.json',
	'./icon.png',
	'./index.html',
	'./style.css',
	'./main.js',
	'./drawer/model.js',
	'./drawer/matrix.js',
	'./drawer/renderer.js',
]

// インストール
self.addEventListener('install', (e) => {
    e.waitUntil(caches
        .open(CACHE_NAME)
        .then((cache) => {
            return cache.addAll(urlsToCache);
        })
    )
})

// キャッシュロードするかフェッチ
self.addEventListener('fetch', (e) => {
    e.respondWith(caches
        .match(e.request)
        .then((response) => {
            return response ? response : fetch(e.request);
        })
    )
})