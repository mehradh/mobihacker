$(document).ready( function() {	
	$.getJSON("data.json", function(result) {
		// Update outputs with initial values
		$('span[data-value="visits"]').text(sumObject(result, "visits", 0));
		$('span[data-value="purchases"]').text(sumObject(result, "purchases", 0));
		$('span[data-value="conversion"]').text(getConversionRate(sumObject(result, "purchases", 0), sumObject(result, "visits", 0)));
		
		// Create OS options and set Change handler
		$("select[name=os]").html(createOptions(getLabels(filterObject(result, "All"), ["All"]),"")).change(
			function(e) {
				var selectedOsArray = filterObject(result, $(this).val()),
					sumSelectedVisits = sumObject(selectedOsArray, "visits", 0),
					sumSelectedPurchases = sumObject(selectedOsArray, "purchases", 0),
					selectedOptions = createOptions(removeDuplicates(getLabels(filterObject(result, $(this).val()), ["All"]),[]),"");
				
				if($(this).val() === "All") {
					selectedOptions = createOptions(removeDuplicates(getInnerLabels(getLabels, result, ["All"]), []), "");
				}
				
				// Set content of Brands depending on selected OS
				$("select[name=brand]").html(selectedOptions);
				
				$('span[data-value="visits"]').text(sumSelectedVisits);
				$('span[data-value="purchases"]').text(sumSelectedPurchases);
				$('span[data-value="conversion"]').text(getConversionRate(sumSelectedPurchases, sumSelectedVisits));
			}
		);
		
		// Create Brand options and set Change handler
		$("select[name=brand]").html(createOptions(removeDuplicates(getInnerLabels(getLabels, result, ["All"]), []),"")).change(
			function(e) {
				var sumVisits, sumPurchases,
					selectedBrand = $(this).val(),
					selectedOs = $("select[name=os]").val();
					
				if(selectedOs === "All") {
					if(selectedBrand === "All") {
						// All All
						sumVisits = sumObject(result, "visits", 0);
						sumPurchases = sumObject(result, "purchases", 0);
					}else {
						// All X
						sumVisits = sumAllObjects(result, selectedBrand, "visits", 0);
						sumPurchases = sumAllObjects(result, selectedBrand, "purchases", 0);
					}
				}else {
					if(selectedBrand === "All") {
						// X All
						sumVisits = sumObject(filterObject(result, selectedOs), "visits", 0);
						sumPurchases = sumObject(filterObject(result, selectedOs), "purchases", 0);
					}else {
						// X X
						sumVisits = sumObject(filterObject(result, selectedOs)[selectedBrand], "visits", 0);
						sumPurchases = sumObject(filterObject(result, selectedOs)[selectedBrand], "purchases", 0);
					}
				}
				
				$('span[data-value="visits"]').text(sumVisits);
				$('span[data-value="purchases"]').text(sumPurchases);
				$('span[data-value="conversion"]').text(getConversionRate(sumPurchases, sumVisits));
			}
		);
	});
});