const cacheName = 'Primi 0.0.0 f'
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

/*
self.addEventListener('activate', (e) =>
{
    const cacheWhitelist = [cacheName]
    e.waitUntil(
        caches.keys().then((cacheNames) =>
        {
            return Promise.all(
                cacheNames.map((n) =>
                {
                    if(cacheWhitelist.indexOf(n) === -1)
                        return caches.delete(n)
                })
            )
        })
    )
})
*/

// 更新時もう無いファイルは消す
self.addEventListener('activate', (e) =>
{
    const cacheWhitelist = [cacheName]
    e.waitUntil(
      (async() => {
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames
            .filter((n) => {
                if(cacheWhitelist.indexOf(n) === -1)
                    return caches.delete(n)
            })
            .map((n) => caches.delete(n)),
        )
      })(),
    )
})

// リクエスト
/*
self.addEventListener('fetch', (e) =>
{
    e.respondWith(
        async() =>
        {
            const cacheResponse = await caches.match(e.request)
            if (cacheResponse) return cacheResponse
    
            const fetchRequest = e.request.clone()
            const fetchResponse = await fetch(fetchRequest)
    
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic')
                return fetchResponse
    
            const responseToCache = fetchResponse.clone()
            const cache = await caches.open(cacheName)
    
            cache.put(e.request, responseToCache)

            return fetchResponse
        }
    )
})
*/

// リクエスト
self.addEventListener('fetch', (e) =>
{
    e.respondWith(
      (async() => {
        const cache = await caches.open(cacheName)
        const cachedResponse = await cache.match(e.request)
        const networkResponsePromise = fetch(e.request)
  
        e.waitUntil(
            (async() =>
            {
                const networkResponse = await networkResponsePromise
                await cache.put(e.request, networkResponse.clone())
            })(),
        );
  
        return cachedResponse | networkResponsePromise
      })(),
    )
})