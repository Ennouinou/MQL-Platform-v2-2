function LaureateComponentService() { 
	//TODO: Intitialize service for LaureateComponent 
	this.db= [];
	this.special=[];
} 
// Add model to database table object 
LaureateComponentService.prototype.add = function (onePromotion) {
	this.db.push(onePromotion);
};
// Add laureate to a specific promotion by ID
LaureateComponentService.prototype.addLaureate = function (promotion_id, oneLaureate) {
	for(let promotion of this.db) {
		if(promotion.id === promotion_id) {
			promotion.content.push(oneLaureate);
		}
	}
	console.log(this.db);
};
// Remove from database object by index 
LaureateComponentService.prototype.remove = function(index, laureate_id = null) {
	this.db.splice(index, 1);
};
// Remove Laureate in a specific promotion by ID
LaureateComponentService.prototype.removeLaureate = function(promotion_id, laureate_id) {
	for(let promotion of this.db) {
		if(promotion.id === promotion_id) {
			for(let i = 0; i<promotion.content.length; i++) {
				if(promotion.content[i].id === laureate_id) promotion.content.splice(i,1);
			}
		}
	}
};
// get from database object by index 
LaureateComponentService.prototype.get = function(index) {
	return this.db[index];
};
// get Laureate in a specific promotion by ID
LaureateComponentService.prototype.getLaureate = function(promotion_id, laureate_id) {
	for(let promotion of this.db) {
		if(promotion.id === promotion_id) {
			for(let laureate of promotion.content) {
				if(laureate.id === laureate_id) return laureate;
			}
		}
	}
};
// elements count of database object 
LaureateComponentService.prototype.size = function() { 
	return this.db.length;
};
// Number of laureates in a specific promotion
LaureateComponentService.prototype.sizeLaureates = function(promotion_id) {
	for(let promotion of this.db) {
		if(promotion.id === promotion_id) {
			return promotion.content.length;
		}
	}
};
// Load all data from source to database object 
LaureateComponentService.prototype.load = function(dbSource) {
	let tmp=[];
	for (let i = 0; i < dbSource.length; i++) {
		// Transforming database source into database object of Laureate model
		tmp.push(
			new Laureate( 
				dbSource[i].id, 
				dbSource[i].name,
				dbSource[i].gender,
				dbSource[i].job,
				dbSource[i].city,
				dbSource[i].email,
				dbSource[i].stage,
				dbSource[i].current_enterprise,
				dbSource[i].experience,
				dbSource[i].photo,
				dbSource[i].rating,
				dbSource[i].linked_in,
			)
		)
	}
	tmp.sort((a, b) => a.name.localeCompare(b.name));
	return tmp;
};
LaureateComponentService.prototype.loadspecial = function(dbSource) {
	for (let i = 0; i < dbSource.length; i++) {
		for(let j=0; j < dbSource[i].content.length ; j++){
			if(dbSource[i].content[j].rating!=='')
				this.special.push(
					new Laureate(
						dbSource[i].content[j].id,
						dbSource[i].content[j].name,
						dbSource[i].content[j].gender,
						dbSource[i].content[j].job,
						dbSource[i].content[j].city,
						dbSource[i].content[j].email,
						dbSource[i].content[j].stage,
						dbSource[i].content[j].current_enterprise,
						dbSource[i].content[j].experience,
						dbSource[i].content[j].photo,
						dbSource[i].content[j].rating,
						dbSource[i].content[j].linked_in,
					)
				)
		}
	}
};

/**
 * Defining search action methode
 * @param title_key
 * @returns {[]}
 */
LaureateComponentService.prototype.searchByKey = function(title_key) {
	let ret = [];
	let addPromo;
	for(let promo of this.db) {
		let tmp = [];
		addPromo = false;
		// Filter Laureates names
		for(let laureate of promo.content) {
			if(laureate.name.toLowerCase().includes(title_key.toLowerCase())) {
				tmp.push(laureate);
				addPromo = true;
			}
		}
		if(addPromo) {
			ret.push(new Promotion(promo.id, promo.name, promo.date, tmp));
		}
	}
	return ret;
};

LaureateComponentService.prototype.isUpToDate = function(promotion_id) {
	for(let promotion of this.db) {
		if(promotion.id === promotion_id) {
			return true;
		}
	}
	return false;
};

LaureateComponentService.prototype.sort = function() {
	// SORT BY DATE
	this.db = this.db.sort((a, b) => b.date - a.date);
};

LaureateComponentService.prototype.sortLaureates = function(promotion_id) {
	for(let promotion of this.db) {
		if(promotion.id === promotion_id) {
			promotion.content.sort((a, b) => a.name.localeCompare(b.name));
		}
	}
};

/**
 * Extraction of all promotions :
 * @param dbPromotions
 */
LaureateComponentService.prototype.loadPromotion = function (dbPromotions) {
	for (let promotion of dbPromotions){
		this.add(
			new Promotion(promotion.id,promotion.name,new Date(transformDate(promotion.date)), this.load(promotion.content)
			)
		)
	}
	this.sort();
};
