const cacheID = 'mws-restaurant-002'

const expectedCaches = ['mws-restaurant-002']

const cacheFiles = [
	'/',
	'/index.html',
	'/restaurant.html',
	'dest/css/sass/styles.css',
	'src/js/dbhelper.js',
	'src/js/main.js',
	'src/js/restaurant_info.js',
	'src/img/no_image.jpg'
]

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(cacheID).then(cache => {
			return cache
				.addAll(cacheFiles)
				.catch(error => {
					console.log('failed: caches open : ', error)
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
					return caches.delete(key)
				}
			})
		)).then(() => {
			console.log('mws-restaurant-001 now ready to handle fetches!')
		})
	)
})

self.addEventListener('fetch', function(e) {
	e.respondWith(
		caches.match(e.request).then(function(response) {
			if(response) {
				return response
			} else {
				return fetch(e.request)
					.then(function(response) {
						const clonedResponse = response.clone()
						caches.open(cacheID).then(function(cache) {
							cache.put(e.request, clonedResponse)
						})
						return response
					})
					.catch(function(err) {
						console.error(err)
					})
			}
		})
	)
})
