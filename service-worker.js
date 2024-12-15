const cacheName = 'Primi 0.0.0 j'
const file =
[
    'icon.png',
	'index.html',
	'offline-nocache.html',
	'style.css',
	'main.js',
	'drawer/model.js',
	'drawer/matrix.js',
	'drawer/renderer.js',
]
const cacheKey =
[
    cacheName
]

// インストール
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches
            .open(cacheName)
            .then((cache) => {
                return cache.addAll(file)
            })
    )
})

// 要らなくなったキャッシュを消す
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => {
                    return !cacheKey.includes(key)
                }).map((key) => {
                    return caches.delete(key)
                })
            )
        })
    )
})

// リクエスト
self.addEventListener('fetch', (e) =>
{
    var online = navigator.onLine
  
    // オンライン
    if(online)
    {
        e.respondWith(
          caches.match(e.request)
            .then((response) => {
                if (response) return response

                return fetch(e.request).then((response) => {
                    cloneResponse = response.clone()
                    if(response)
                    {
                        if(response && response.status == 200)
                        {
                            caches
                                .open(cacheName)
                                .then((cache) => {
                                    cache.put(e.request, cloneResponse)
                                })
                        } else {
                            return response
                        }
                    }
                    return response
                }).catch(function(err) {
                    return console.error(err)
                })
            })
        )
    }
    // オフライン
    else
    {
        e.respondWith(
            caches
                .match(e.request)
                .then((response) =>
                {
                    if(response) return response

                    return caches
                        .match('offline-nocache.html')
                        .then((responseNodata) =>
                        {
                            return responseNodata
                        })
                })
        )
    }
})