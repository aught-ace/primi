const cacheName = 'Primi 0.0.0 a'
const files =
[
    './icon.png',
	'./index.html',
	'./style.css',
	'./main.js',
	'./drawer/model.js',
	'./drawer/matrix.js',
	'./drawer/renderer.js',
    './manifest.json',
]

// インストール
self.addEventListener('install', async(e) =>
{
    const cache = await caches.open(cacheName)
    return cache.addAll(files)
})

// 更新時もう無いファイルは消したりする
self.addEventListener('activate', (e) =>
{
    const cacheWhitelist = [cacheName]
    e.waitUntil(
        caches.keys().then((cacheNames) =>
        {
            return Promise.all(
                cacheNames.map((cacheName) =>
                {
                    if(cacheWhitelist.indexOf(cacheName) === -1)
                        return caches.delete(cacheName)
                })
            )
        })
    )
})

// リクエスト
self.addEventListener('fetch', (e) =>
{
    e.respondWith(
        async() =>
        {
            const cacheResponse = await caches.match(e.request)
            if (cacheResponse) return cacheResponse
    
            const fetchRequest = e.request.clone()
            const fetchResponse = await fetch(fetchRequest)
    
            if(!fetchResponse) return fetchResponse
    
            const responseToCache = fetchResponse.clone()
            const cache = await caches.open(cacheName)
    
            cache.put(e.request, responseToCache)

            return fetchResponse
        }
    )
})