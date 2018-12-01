/**
 * Common database helper functions.
 */
class DBHelper {
	/**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */

	// http://localhost:1337/restaurants

	static get DATABASE_URL() {
		const port = 1337 // Changed this to my server port
		return `http://localhost:${port}/restaurants`
  }

	static addRestaurantsToIdb() {
		// adding to restaurants store
		dbPromise.then(function(db) {
			const tx = db.transaction('restaurants', 'readwrite')
			const restaurantStore = tx.objectStore('restaurants')
			DBHelper.fetchRestaurants(() => console.log('dksafd;lsfkdsjf;k'))
			restaurantStore.put({
				name: 'sameerdd',
				id: 22,
				favoriteLanguage: 'Urdu'
			})
			return tx.complete
		}).then( () => {
				console.log('added to restaurants')
			})
  }
  
	/**
   * Fetch all restaurants.
   */
	static fetchRestaurants(callback) {

		fetch(DBHelper.DATABASE_URL)
			.then(response => response.json())
			.then(res => {
				console.log('save this data into idb', res)
				// first fetch data from indexedDb then from url, check knowledge hub question

				if(1){
					const tx = db.transaction('restaurants', 'readwrite')
					const store = tx.objectStore('restaurants')
					res.forEach( (restaurantData) => store.put(restaurantData))
				}
				callback(null, res)
			})
			.catch(e => {
				console.log('error',e)
				callback(e, null)
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
    // return (`http://localhost:1337/restaurants/${restaurant.id}`);

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
