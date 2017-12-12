$.fn.validate = function() {
	$(".form-group").removeClass('has-error');
	Validate.errors = [];
	var formObj = this;
	$(this).find(":input").not("[type=image],[type=submit],[type=hidden],[type=button]").each(function(i) {
		var type = $(this).prop('type');
		var validatorsData = $(this).prop('validators')||$(this).attr('data-validators');
		var validators = new Array();
		if(this.hasAttribute('required')){
			validators.push('required');
		}
		if(type == 'number' || type == 'email' || type == 'url'){
			validators.push(type);
		}
		
		if(validatorsData!=undefined && validatorsData !=null){
			validatorsData.split(',').forEach(function(item, index){
				validators.push(item);
			});
		}
		
		if(!Validate.isValidated(validators,this)){
			$( this ).parent( ".form-group").addClass('has-error');
			$( this ).addClass('error');
			$(formObj).find('.alert-danger').text(Validate.errors[0]).removeClass('hide').slideDown('slow');
	
			if($('.modal-content').length){
				document.querySelector('.modal-content').scrollTop = 0;	
			}
			
//			    $('html,body').animate({
//			        scrollTop: formObj.offset().top
//			    }, 2000);
			
			return false;
		}
		$('.form-group').removeClass('has-error');
		$(this).removeClass('error');
		 $('.alert-danger').hide();
		return true;
		
	});
}

var Validate = {
		messages : function() {
	        this.errors = [];
	        this.success="";
	    },
		isValidated : function(validators,object){
		
			var mandatory = validators.indexOf('required') > -1;
//			var checkNumber =  validators.indexOf('number') > -1;
//			var checkDecimal =  validators.indexOf('decimal') > -1;
//			var checkEmail = validators.indexOf('email') > -1;
//			var checkUrl = validators.indexOf('url') > -1;
			var isValid = true;
				
			if(!isValid){
				Validate.errors.push(  $(object).attr('placeholder'));
				  return isValid;
			  }
			$.each(validators, function( index, value ) {
				isValid = App.executeMethod(value, Validate, object);	
				
				  if(!isValid){
//					Validate.messages().push(  $(object).attr('placeholder'));
					  var msg = $(object).data('msg-'+value);
					 
					  if(!ToolBox.isNotNull(msg)){
						  msg = $(object).attr('placeholder');
					  }
					  Validate.errors.push(  msg);
					  
					  return isValid;
				  }
				});
			
			return isValid;
			
		},
		required: function(object) {
			  var value = $.trim(object.value);
		      var isValid = value!='' && value != undefined;
		      return isValid;
		},
		email: function(object) {
		      var value = object.value;
		      var regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
		      var isValid = true;
		      if(ToolBox.isNotNull(value)){
		    	  isValid = regex.test(value);  
		      }
		      return isValid;
		},
		url: function(object) {
		      var value = object.value;
		      var regex = new RegExp(/^(http:\/\/www.|https:\/\/www.|http:\/\/|https:\/\/){1}([0-9A-Za-z]+\.[A-Za-z])/);
		      var isValid = true;
		      if(ToolBox.isNotNull(value)){
		    	  isValid = regex.test(value);  
		      }
		      return isValid;
		},
		number: function(object) {
		      var regex = new RegExp("^[0-9]+$");		      
		      var value = object.value;     
		      var isValid = true;
		      if(ToolBox.isNotNull(value)){
		    	  isValid = regex.test(value);  
		      }
		      return isValid;
	    },
	    numberwithmaxlength: function(object) {
		      var regex = new RegExp("^\s*-?[0-9]{1,10}\s*$");		      
		      var value = object.value;     
		      var isValid = true;
		      if(ToolBox.isNotNull(value)){
		    	  isValid = regex.test(value);  
		      }
		      return isValid;
	    },
	    decimal: function(object) {
	         var value = object.value;
	         var regex = new RegExp(/^\d+(?:\.\d{0,2})?$/);
	         var isValid = true;
		      if(ToolBox.isNotNull(value)){
		    	  isValid = regex.test(value);  
		      }
		      return isValid;
	     },
	     quarterdecimal: function(object) {
	         var value = object.value;
//	         var regex = new RegExp(/^\d+(?:\.\d{0,2})?$/);
//	         var regex = new RegExp(/^\d+(?:\d*|\.(?:0|5|00|25|50|75))$/);
	         var regex = new RegExp(/^((?:(?:[1-9]\d*|0)(?:\.(?:0|5|00|25|50|75))?)|(?:\.(?:0|5|00|25|50|75)))$/);
	         var isValid = true;
		      if(ToolBox.isNotNull(value)){
		    	  isValid = regex.test(value);  
		      }
		      return isValid;
	     },
	    selectOne: function(object) {
	         var value = object.value;
	         var isValid = value!='' && value != undefined && value!='0';
		      return isValid;
	    },
	    checkbox: function(object) {
	      var isValid = $(object).is(':checked');
	      return isValid;
	       
	     },
	     alphabets: function(object){
	    	 var regex = new RegExp(/^[a-zA-z]*$/);		      
		      var value = object.value;     
		      var isValid = true;
		      if(ToolBox.isNotNull(value)){
		    	  isValid = regex.test(value);  
		      }
		      return isValid;
	     },
	     alphabetswithspace: function(object){
	    	 debugger;
	    	 var regex = new RegExp(/^[a-z A-z]*$/);		      
		      var value = object.value;     
		      var isValid = true;
		      if(ToolBox.isNotNull(value)){
		    	  isValid = regex.test(value);  
		      }
		      return isValid;
	     },
	     username:function(object){
	    	 var regex = new RegExp(/^[a-zA-Z0-9-_@$!.]{4,10}$/);		      
		      var value = object.value;     
		      var isValid = true;
		      if(ToolBox.isNotNull(value)){
		    	  isValid = regex.test(value);  
		      }
		      return isValid;
	     },
	     phonenumber:function(object){
	    	 //var regex = new RegExp(/^\d{0,10}$/);
	    	 var regex = new RegExp(/^\+?\d?\s?\d{3}-\d{3}-\d{4}$/);
		      var value = object.value;     
		      var isValid = true;
		      if(ToolBox.isNotNull(value)){
		    	  isValid = regex.test(value);  
		      }
		      return isValid;
	     },
	     postalcode:function(object){
	    	 var regex = new RegExp(/^.{0,10}$/);		      
		      var value = object.value;     
		      var isValid = true;
		      if(ToolBox.isNotNull(value)){
		    	  isValid = regex.test(value);  
		      }
		      return isValid;
	     },
	     passwordstrength : function(object){
	    	 var regex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_@$!]).{6,}/);
	    	 var value = object.value;     
		      var isValid = false;
		      if(ToolBox.isNotNull(value)){
		    	  isValid = regex.test(value);  
		      }
		      return isValid;
	     },
	     alphanumeric:function(object){
	    	 var regex = new RegExp(/^[a-zA-Z0-9]*$/);		      
		      var value = object.value;     
		      var isValid = true;
		      if(ToolBox.isNotNull(value)){
		    	  isValid = regex.test(value);  
		      }
		      return isValid;
	     },
	     maxlength : function(object){
	    	 //var regex = new RegExp(/^[a-zA-Z0-9]*$/);		      
		      var value = object.value;
		      var length = $(object).attr('maxlength');
		      var isValid = true;
		      if(ToolBox.isNotNull(value)){
		    	  isValid = value.length <= length;  
		      }
		      return isValid;
	     },
	     multiple : function(object) {
				var isValid = true;
				isValid = (object.value % 15 == 0 && object.value<=30);
				return isValid;
		}
};


