const CACHE_NAME = 'Primi 0.0.0 t2'
const files =
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
            return cache.addAll(files);
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