// self.importScripts('src/js/idb.js')

/**
 * Common database helper functions.
 */
class DBHelper {
	/**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */

	static get DATABASE_URL() {
		const port = 1337 // Changed this to my server port
		return `http://localhost:${port}/restaurants`
  	}

  // initialize 'restaurants-db' idb
  	static dbInit() {
	const dbPromise = idb.open('restaurants-db', 1, function(upgradeDb) {
		switch(upgradeDb.oldVersion) {
		case 0:
			const restaurantStore = upgradeDb.createObjectStore('restaurants', {
				keyPath: 'id'
			})
			restaurantStore.createIndex('by-name','name')
		}
	})
	return dbPromise;
  	}

	// save data into 'restaurants' Idb
	static saveDataInDb(data) {
			return DBHelper.dbInit().then(db => {
		
			if (!db) return;

			const store = db.transaction('restaurants', 'readwrite').objectStore('restaurants')
			data.forEach( (eachRestaurant) => 
				store.put(eachRestaurant)
			)
		})
	}

	static fetchFromUrlAndSave() {
		return fetch(DBHelper.DATABASE_URL)
		.then(response => response.json())
		.then(allRestaurants => {
			console.log('save this data into idb', allRestaurants)
			DBHelper.saveDataInDb(allRestaurants)
		})
	}

	static getDataFromCache() {
		return DBHelper.dbInit().then(db => {
			if (!db) return;
			// get data from cache
			const store = db.transaction('restaurants').objectStore('restaurants')
			return store.getAll()
		})
	}

/* Fetch all restaurants.*/
	static fetchRestaurants(callback) {
		// getting data from cache, if not found get it from url & save it
		return DBHelper.getDataFromCache().then( allRestaurants => {
			if(allRestaurants.length > 0) {
				return Promise.resolve(allRestaurants)
			} else {
				return DBHelper.fetchFromUrlAndSave()
			}
		}).then( allRestaurants => {
			callback(null, allRestaurants)
		}).catch(err => {
			console.log('error',err)
			callback(err, null)
		})
	}

	/**
   * Fetch a restaurant by its ID.
   */
	static fetchRestaurantById(id, callback) {
		// fetch all restaurants with proper error handling.
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null)
			} else {
					const restaurant = restaurants.find(r => r.id == id)
			if (restaurant) { // Got the restaurant
						callback(null, restaurant)
			} else { // Restaurant does not exist in the database
						callback('Restaurant does not exist', null)
			}
			}
		})
  	}

	/**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
	static fetchRestaurantByCuisine(cuisine, callback) {
		// Fetch all restaurants  with proper error handling
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null)
      } else {
				// Filter restaurants to have only given cuisine type
				const results = restaurants.filter(r => r.cuisine_type == cuisine)
        callback(null, results)
      }
		})
  }

	/**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
	static fetchRestaurantByNeighborhood(neighborhood, callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null)
      } else {
				// Filter restaurants to have only given neighborhood
				const results = restaurants.filter(r => r.neighborhood == neighborhood)
        callback(null, results)
      }
		})
  }

	/**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
	static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null)
      } else {
				let results = restaurants
				if (cuisine != 'all') { // filter by cuisine
					results = results.filter(r => r.cuisine_type == cuisine)
        }
				if (neighborhood != 'all') { // filter by neighborhood
					results = results.filter(r => r.neighborhood == neighborhood)
        }
				callback(null, results)
      }
		})
  }

	/**
   * Fetch all neighborhoods with proper error handling.
   */
	static fetchNeighborhoods(callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null)
      } else {
				// Get all neighborhoods from all restaurants
				const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
				// Remove duplicates from neighborhoods
				const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
				callback(null, uniqueNeighborhoods)
      }
		})
  }

	/**
   * Fetch all cuisines with proper error handling.
   */
	static fetchCuisines(callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null)
      } else {
				// Get all cuisines from all restaurants
				const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
				// Remove duplicates from cuisines
				const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
				callback(null, uniqueCuisines)
      }
		})
  }

	/**
   * Restaurant page URL.
   */
	static urlForRestaurant(restaurant) {
		return (`restaurant.html?id=${restaurant.id}`)
  }

	/**
   * Restaurant image URL.
   */
	static imageUrlForRestaurant(restaurant) {
		if(!restaurant.photograph){
			return('dest/images/no_image.jpg')
		}
		return (`dest/images/${restaurant.photograph}.jpg`)
  }

	/**
   * Map marker for a restaurant.
   */
	static mapMarkerForRestaurant(restaurant, map) {
		const marker = new google.maps.Marker({
			position: restaurant.latlng,
			title: restaurant.name,
			url: DBHelper.urlForRestaurant(restaurant),
			map: map,
			animation: google.maps.Animation.DROP}
		)
    return marker
  }

}
