$(document).ready(function() {
	var data,//JSON data
		selectOs = $('select[name="os"]'), //select OS
		selectBrand = $('select[name="brand"]'); //select Brand
	
	/* Get JSON data */
	$.getJSON( "data.json", function(result) {
		data = result;
		selectOs.appendOption("All");//append All option
		
		$.each(data, function(os) {
			selectOs.appendOption(os);//append OS option
		});
		
		selectOs.change();//trigger change event to create Brands
	});
	
	/* Select Os Change */
	selectOs.change(function(e) {
		//remove Brands if any and append All option
		selectBrand.empty();
		selectBrand.appendOption("All");
		
		var filter = $(this).val();//selected OS
		if(filter === "All") {
			$.each(data, function(os, osValues) {
				selectBrand.appendOsBrands(osValues);//appends Brands of current OS
			});
		}else {
			selectBrand.appendOsBrands(data[filter]);//appends Brands of selected OS
		}
		
		updateOutputs();//update visual outputs
	});
	
	/* Updates outputs / Select Brand Change */
	function updateOutputs() {
		var	selectedOs = selectOs.val(),
			selectedBrand = selectBrand.val(),
			selectedData = selectedOs === "All" ? data : data[selectedOs],
			
			//Here's where all the magic happens :)
			/* Returns an object containing Visits and Purchases for the selected OS and Brand */
			selectedValues = getSelectedValues(selectedData, selectedOs, selectedBrand);
		
		$('span[data-value="visits"]').text(selectedValues.visits);
		$('span[data-value="purchases"]').text(selectedValues.purchases);
		$('span[data-value="conversion"]').text((100*(selectedValues.purchases/selectedValues.visits)).toFixed(3) + " %");
	}
	
	/* Selected Brand Change */
	selectBrand.change(updateOutputs);	
	
	/* Get Selected OS and Brand values */
	function getSelectedValues(selectedData, selectedOs, selectedBrand) {
		var visits = 0, purchases = 0;
		if("visits" in selectedData) {
			//no children, has Visits and Purchases directly attached
			visits += selectedData.visits;
			purchases += selectedData.purchases;
		}else {
			//has children
			$.each(selectedData, function(topBrand, topBrandKey) {
				if("visits" in this) {
					//Selected OS = All and current Brand is the selected Brand,
					//Or, Any brand is selected and finally if none of these is true, 
					//check selected Brand is current Brand again this time without selected OS
					if((selectedOs === "All" && selectedBrand === topBrand) || selectedBrand === "All" || selectedBrand === topBrand){
						visits += this.visits;
						purchases += this.purchases;
					}
				}else {
					$.each(this, function(brand) {
						//Is current brand, topBrand or All equal to Selected Brand
						if(selectedBrand === "All" || selectedBrand === topBrand || selectedBrand === brand) {
							if("visits" in this) {
								visits += this.visits;
								purchases += this.purchases;
							}else {
								//We've reached the lowest level for this particular JSON
								$.each(this, function(device) {
									visits += this.visits;
									purchases += this.purchases;
								});
							}
						}
					});
				}
			});
		}
		
		return {
			visits: visits,
			purchases: purchases,
		};
	}
});

/* Returns an Option element with assigned Key for it's text and value */
$.fn.appendOption = function(key) {
	var option = $('<option></option>', {value:key, text:key});
	return this.append(option);
};

/* Appends all OS Brands if not already added */
$.fn.appendOsBrands = function(values) {
	var _this = this;
	
	$.each(values, function(brand, brandValues) {
		//if current level is an Object, and it is not yet added, append Brand
		if($.type(brandValues) === "object" && _this.has('option[value="'+brand+'"]').length < 1) {
			_this.appendOption(brand);
		}
	});
	
	return this;
};