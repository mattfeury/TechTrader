$(function() {

  $('#landing').bind('pagebeforeshow',function(event, ui){
    
  });

  $('#list_products_page').bind('pagebeforeshow',function(event, ui){
		console.log('pagebeforeshow');
	
		//Remove the old rows
		$( ".product_list_row" ).remove();
		
		//JQuery Fetch The New Ones
		$.ajax({
			url: "api/product",
			dataType: "json",
	        async: false,
	        success: function(data, textStatus, jqXHR) {
				console.log(data);
	        	//Create The New Rows From Template
	        	$( "#product_list_row_template" ).tmpl( data ).appendTo( "#products_list" );
	        },
	        error: ajaxError
		});
		
		$('#products_list').listview('refresh');
	});
	
	//Bind the add page clear text
	$('#add_product_page').bind('pagebeforeshow', function() {
		console.log("Add Comment Page");
		$('#add_product_text')[0].value = "";
	});
	/*
	//Bind the add page button
	$('#add_button').bind('click', function() {
		console.log("Add Button");
		$.ajax({
			url: "api/product",
			dataType: "json",
	        async: false,
			data: {'productText': $('#add_product_text')[0].value},
			type: 'POST',
	        error: ajaxError
		});
	});
	
	//Bind the edit page save button
	$('#save_button').bind('click', function() {
		console.log("Save Button");
		var product_id = $.url().fparam("product_id");
		$.ajax({
			url: "api/product/"+product_id,
			dataType: "json",
	        async: false,
			data: {'productText': $('#edit_product_text')[0].value},
			headers: {'X-HTTP-Method-Override': 'PUT'},
			type: 'POST',
	        error: ajaxError
		});
	});
	
	//Bind the edit page remove button
	$('#remove_button').bind('click', function() {
		console.log("Remove Button");
		var product_id = $.url().fparam("product_id");
		$.ajax({
			url: "api/product/"+product_id,
			dataType: "json",
	        async: false,
			type: 'DELETE',
	        error: ajaxError
		});
	});*/
	
	//Cleanup of URL so we can have better client URL support
	$('#edit_product_page').bind('pagehide', function() {
		$(this).attr("data-url",$(this).attr("id"));
		delete $(this).data()['url'];
	});

});

/******************************************************************************/

function ajaxError(jqXHR, textStatus, errorThrown){
	console.log('ajaxError '+textStatus+' '+errorThrown);
	$('#error_message').remove();
	$("#error_message_template").tmpl( {errorName: textStatus, errorDescription: errorThrown} ).appendTo( "#error_dialog_content" );
	$.mobile.changePage($('#error_dialog'), {
		transition: "pop",
		reverse: false,
		changeHash: false
	});
}
