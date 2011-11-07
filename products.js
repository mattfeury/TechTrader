/**
 * Ajax functions for loading things from the API and setting the appropriate templates
 */

// Categories array of {id, name} json objects
var categoriesLoaded = false;
function loadCategoriesIfNeeded() {
  if (categoriesLoaded) return false;

  $('#add_product_categories, #categories_list').empty();

  $.ajax({
    url: "api/categories",
    dataType: "json",
    async: false,
    success: function(data) {
      categoriesLoaded = true;
      
      // template on create product page
      $( "#category_option_template" ).tmpl( data ).appendTo( "#add_product_categories" );
      // template on list categories page
      $( "#category_list_row_template" ).tmpl( data ).appendTo( "#categories_list" );
      setTimeout(function() {
        var myselect = $("select#add_product_categories");
        myselect[0].selectedIndex = 0;
      }, 0);
    },
    error: ajaxError
  });
}
// Loads a given product with id = id
function loadProduct(id) {
  $( "#view_product_content" ).empty();    
  $.ajax({
    url: "api/product/" + id,
    dataType: "json",
    async: false,
    success: function(data, textStatus, jqXHR) {
      //Create The New Rows From Template
      $( "#product_template" ).tmpl( data ).appendTo( "#view_product_content" );
    },
    error: ajaxError
  });
}
// Loads all the products from a category
function loadProducts(catId) {
  $( "#products_list" ).empty();
  $.ajax({
    url: "api/categories/" + catId,
    dataType: "json",
    async: false,
    success: function(data) {
      //Create The New Rows From Template
      $( "#product_list_row_template" ).tmpl( data ).appendTo( "#products_list" );
      $('#products_list').listview('refresh');
    },
    error: ajaxError
  });
}

$(function() {
  
  // Load categories if we need
  $('#list_categories_page').bind('pagebeforeshow',function(event, ui){
    loadCategoriesIfNeeded();
    $('#categories_list').listview('refresh');
  });
  
	//Load categories before viewing add product page for the first time
	$('#add_product_page').bind('pagebeforeshow', function() {
    loadCategoriesIfNeeded();
    $('select#add_product_categories').selectmenu('refresh');
	});

	$('#view_product_page').bind('pagebeforeshow', function() {
    //we can't always count on getting the id from the url since
    //sometimes jQuery doesn't update it, so we mostly rely on the link clicked
    //if, however, we navigate direct to the page, no link was clicked so we'll need
    //to load from the url
    var idFromUrl = location.hash.split('=').pop();
    if (! $('#view_product_content').children().length && idFromUrl)
      loadProduct(idFromUrl);
	});
  $('#list_products_page').bind('pagebeforeshow',function(event, ui){
    // same nastiness as above
    var idFromUrl = location.hash.split('=').pop();
    if (! $('#products_list').children().length && idFromUrl)
      loadProducts(idFromUrl);
  });

  // Links to category pages should load the products
  // and populate the template
  $('a.category').live('click', function() {
    var id = $(this).attr('data-id');
    loadProducts(id);
  });
  
  // Links to product pages should load the product info
  // and populate the template
  $('a.product').live('click', function() {	
    var pId = $(this).attr('data-id');
    loadProduct(pId);
  });

  //Listener for the mail button. Used to send the owner of an item an email.
  $('.contact').live('click', function() {                                                                             
    var button = this;                                                                                     
    $.ajax({
        url: "/proxy/iam-dev01.iam.gatech.edu/directory/people?attribute=uid&query=" +                
             $(this).attr('data-id'),
             dataType: "xml",
             async: false, 
             success: function(xml) {                                                                 
                 var email = $(xml).find('mail').text();                                                        
                 var product_title = $(button).siblings('.title').text();                                       
                 var mailString = "mailto:" + email + "?subject=TechTrader:" + product_title +"&body=I am interested in your product."   
                 loction.href=mailString;                                                                               
             },
             error: ajaxError
   });
  });


	//Handles the add product form
	$('#add_button').bind('click', function() {
		console.log("Add Button");
    var $form = $('#add_product_content'),
        data = {
          title: $form.find('#add_product_title').val(),
          description: $form.find('#add_product_description').val(),
          price: $form.find('#add_product_price').val(),
          categoryId: $form.find('#add_product_categories').val()
        };

    if (data.title.trim() === '') {
      showError('Product title required', 'Please insert a valid product name.');
      return false;
    }

		$.ajax({
			url: "api/product",
			dataType: "json",
	    async: false,
			data: data,
			type: 'POST',
      success: function(data) {
        //reset form
        $form
          .find('#add_product_title').val('').end()
          .find('#add_product_description').val('').end()
          .find('#add_product_price').val('').end()
          .find('#add_product_categories').val('');

        //load the new product in the template since we redirect there
        loadProduct(data.productId);
      },
	    error: ajaxError
		});
	});
	/*
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

});

/******************************************************************************/

function ajaxError(jqXHR, textStatus, errorThrown){
	console.log('ajaxError '+textStatus+' '+errorThrown);
	showError(textStatus, errorThrown);
}
function showError(name, description) {
	$('#error_message').remove();
	$("#error_message_template").tmpl( {errorName: name, errorDescription: description} ).appendTo( "#error_dialog_content" );
	$.mobile.changePage($('#error_dialog'), {
		transition: "pop",
		reverse: false,
		changeHash: false
	});

}
