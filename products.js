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

$(function() {
  $('#landing_page').bind('pagebeforeshow',function(event, ui){
  });
  $('#list_categories_page').bind('pagebeforeshow',function(event, ui){
    loadCategoriesIfNeeded();
    $('#categories_list').listview('refresh');
  });
	//Load categories before viewing add product page for the first time
	$('#add_product_page').bind('pagebeforeshow', function() {
    loadCategoriesIfNeeded();
    $('select#add_product_categories').selectmenu('refresh');
	});
  

  // Links to category pages should load the products
  // and populate the template
  $('a.category').live('click', function() {
		$( "#products_list" ).empty();

		//JQuery Fetch The New Ones
    var id = $(this).attr('data-id');
		$.ajax({
			url: "api/categories/" + id,
			dataType: "json",
      async: false,
      success: function(data) {
        //Create The New Rows From Template
        $( "#product_list_row_template" ).tmpl( data ).appendTo( "#products_list" );
    		$('#products_list').listview('refresh');
      },
      error: ajaxError
		});

  });
  
  // Links to product pages should load the product info
  // and populate the template
  $('a.product').live('click', function() {
		$( "#view_product_content" ).empty();
		
		//JQuery Fetch The New Ones
    var pId = $(this).attr('data-id');
		$.ajax({
			url: "api/product/" + pId,
			dataType: "json",
      async: false,
      success: function(data, textStatus, jqXHR) {
        //Create The New Rows From Template
        $( "#product_template" ).tmpl( data ).appendTo( "#view_product_content" );
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
      success: function() {
        //reset form
        $form
          .find('#add_product_title')
            .val('')
          .end()
          .find('#add_product_description')
            .val('')
          .end()
          .find('#add_product_price')
            .val('')
          .end()
          .find('#add_product_categories')
            .val('');
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
