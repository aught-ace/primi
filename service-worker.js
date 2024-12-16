const cacheName = 'Primi 0.0.0 t'
const file =
[
	'index.html',
	'style.css',
	'main.js',
    'icon.png',
    'apple-touch-icon.png',
	'drawer/model.js',
	'drawer/matrix.js',
	'drawer/renderer.js',
	'offline-nocache.html',
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
        e.respondWith(caches
            .match(e.request)
            .then((response) => {

                // キャッシュにあればそのまま返す
                if (response) return response

                // 無い場合
                return fetch(e.request).then((response) => {
                    cloneResponse = response.clone()
                    if(response)
                    {
                        // ページが正しい状態
                        if(response && response.status == 200)
                        {
                            // キャッシュに置く
                            caches
                                .open(cacheName)
                                .then((cache) => {
                                    cache.put(e.request, cloneResponse)
                                })
                        // ページがエラー状態
                        } else {
                            console.error('Response Status: ' + response.status)
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