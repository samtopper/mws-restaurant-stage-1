
var cacheID = 'mws-restaurant-001'

const expectedCaches = ['mws-restaurant-001'];

const cacheFiles = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheID).then(cache => {
            return cache
            .addAll(cacheFiles)
            .catch(error => {
                console.log('Caches open failed: ', error)
            })
        })
    )
})

self.addEventListener('activate', event => {
    // delete any caches that aren't in expectedCaches
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
        keys.map(key => {
            if (!expectedCaches.includes(key)) {
            return caches.delete(key);
            }
        })
        )).then(() => {
            console.log('mws-restaurant-001 now ready to handle fetches!');
        })
    );
})

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(response) {
            if(response) {
                return response;
            } else {
                return fetch(e.request)
                .then(function(response) {
                    const clonedResponse = response.clone()
                    caches.open(cacheID).then(function(cache) {
                        cache.put(e.request, clonedResponse)
                    })
                    return response;
                })
                .catch(function(err) {
                    console.error(err)
                })
            }
        })
    )
})
