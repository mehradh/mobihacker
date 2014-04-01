/**
 * Functions
 */

//+ getConversionRate -> float -> float -> string -> string
var getConversionRate = function(purchases, visits, concat) {
	return (100*(purchases/visits)).toFixed(3) + ' %';
};

//+ filterObject -> object -> filter -> array
var filterObject = function (object, filter) {
	if(filter != "All") {
		if (filter === "Unknown" || filter in object) object = object[filter];
		else object = [];
	}
	return object;
};

//+ createOptions -> object -> string -> string
var createOptions = function(object, initial) {
	_.each(object, function(value, index) {
		initial += '<option value="'+value+'">'+value+'</option>';
	});
	return initial;
};

//+ removeDuplicates -> object -> array -> array
var removeDuplicates = function(object, excludes) {
	return _.filter(object, function(value) {
		if(excludes.indexOf(value) < 0) {
			excludes.push(value);
			return value;
		}
	});
};

//+ sumObject -> object -> string -> number -> number
var sumObject = function(object, value, initial) {
	if(value in object) {
		initial += object[value];
	}else {
		_.each(object, function(element,i) {
			if(value in element) {
				initial += element[value];
			}else {
				initial = sumObject(element, value, initial);
			}
		});
	}
	return initial;
};

//+ sumObjectByKey -> object -> string -> string -> number -> number
var sumObjectByKey = function(object, key, value, initial) {
	if(typeof(object) === "object" && key in object) {
		initial += sumObject(object[key], value, 0);
	}else {
		_.each(object, function(element,i) {
			initial += sumObjectByKey(element, key, value, 0);
		});
	}
	return initial;
};

//+ sumAllObjects -> object -> string -> number -> number
var sumAllObjects = function(object, key, value, initial) {
	_.each(object, function(v,i) {
		initial += sumObjectByKey(v, key, value, 0);
	});
	return initial;
};

//+ getLabels -> object -> array -> array
var getLabels = function(object, initial) {
	_.map(object, function(value, index) {
		if(index != "visits" && index != "purchases") initial.push(index);
	});
	return initial;
};

//+ getInnerLabels -> function -> object -> array -> array
var getInnerLabels = function(func, object, initial) {
	_.map(object, function(value) {
		initial = func(value, initial);
	});
	return initial;
};