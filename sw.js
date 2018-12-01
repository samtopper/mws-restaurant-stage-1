self.importScripts('src/js/idb.js')

// self.importScripts('src/js/dbhelper.js')

const dbPromise = idb.open('restaurants-db', 1, function(upgradeDb) {
	switch(upgradeDb.oldVersion) {
	case 0:
		let keyValStore = upgradeDb.createObjectStore('keyval')
  		keyValStore.put('world', 'hello')
	case 1:
		upgradeDb.createObjectStore('people', { keyPath: 'name' })

		// creating index for grouping & writing queries
	case 2:
		const peopleStore = upgradeDb.transaction.objectStore('people')
		peopleStore.createIndex('language', 'favoriteLanguage')

	case 3:
		const restaurantStore = upgradeDb.createObjectStore('restaurants', {
			keyPath: 'id'
		})
		restaurantStore.createIndex('by-name','name')
	}
})

const dbInit = () => {
	// update no too
	dbPromise.then(function(db) {
		const tx = db.transaction('keyval')
		const keyValStore =tx.objectStore('keyval')
		return keyValStore.get('hello')
	}).then(function(val) {
		console.log('The value of hello is: ', val)
	})

	// adding an item
	dbPromise.then(function(db) {
		const tx = db.transaction('keyval', 'readwrite')
		const keyValStore = tx.objectStore('keyval')
		keyValStore.put('bar', 'foo')
		return tx.complete
	}).then(function() {
		console.log('Added foo bar in keyval')
	})

	// adding an item to people store
	dbPromise.then(function(db) {
		const tx = db.transaction('people', 'readwrite')
		const peopleStore = tx.objectStore('people')
		peopleStore.put({
			name: 'Sameer',
			age: 24,
			favoriteLanguage: 'JS'
		})
		peopleStore.put({
			name: 'Waseem',
			age: 22,
			favoriteLanguage: 'Urdu'
		})
		peopleStore.put({
			name: 'Asma',
			age: 19,
			favoriteLanguage: 'Arabic'
		})
		return tx.complete
	}).then(function() {
		console.log('Peoples Added')
	})

	// adding an item to restaurant store
	dbPromise.then( (db) => {
		const tx = db.transaction('restaurants', 'readwrite')
		const restaurantStore = tx.objectStore('restaurants')
		restaurantStore.put({
			id: '1',
			name: 'Sohail hotel'
		})
		return tx.complete
	}).then( () => console.log('1 restaurant added'))

	//retriving peoples from store
	// dbPromise.then(function(db) {
	//   const tx = db.transaction('people')
	//   const peopleStore = tx.objectStore('people')

	//   return peopleStore.getAll()
	// }).then(function(people) {
	//   console.log('People: ', people)
	// });

	dbPromise.then(function(db) {
		const tx = db.transaction('people')
		const peopleStore = tx.objectStore('people')
		const languageIndex = peopleStore.index('language')
    
		// return languageIndex.getAll()
		return languageIndex.getAll('JS')

	}).then(function(people) {
		console.log('People: ', people)
	})

	// usage of cursors is in the video

}
dbInit()
// run this in browser to delete db
// indexedDB.deleteDatabase('wittr')



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
