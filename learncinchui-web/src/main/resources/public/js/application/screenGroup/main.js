/**
 * 
 */
var ScreenGroup = {
	BASE_URL : 	APP_CTX+"admin/screenGroup",
	Form : {
		save : function(obj){
			
			return true;
		},
		init : function(){
//			$('.multiselect').multiselect({
//				submitAllLeft: false 
//				//submitAllRight: true
//			});
//			$('#loadScreen').click(function(){
//				ScreenGroup.Form.loadScreens();
//			});
			
			$('#groupId').change(function(){
				ScreenGroup.Form.loadScreens();
			});
			
			$('input[type="radio"]').click(function(){
			    if ($(this).is(':checked'))
			    {
			    	ScreenGroup.Form.loadScreens();
			    }
			  });
			
			ScreenGroup.Form.loadScreens();
		},
		loadSelected : function(){
			var groupId = $('#groupId').val();
			var accessId = $("input:radio[name ='accessId']:checked").val();
			if(ToolBox.isNotNull(groupId) && ToolBox.isNotNull(accessId))
			var url = ScreenGroup.BASE_URL+"/screensByGroup/"+groupId+"/"+accessId;
			$.getJSON(url, function(data){
				var options = [];
				$.each( data, function( key, val ) {
					var screen = val;
					//var option = document.createElement("option");
//					var text = document.createTextNode(screen.name);
					var option = $('<option>', { value: screen.id, text: screen.name});
					//var option = '<option value="'+screen.id+'">'+screen.name+'</option>';
					options.push( option );
					$('.multiselect option[value='+screen.id+']').remove();	
				  });
				
//				$('#multiselect_to_1').append('<option value="6">Item 6</option>');
				//$('#multiselect_to_1').find('option').remove();
				$('#multiselect_to_1').html('');
				$('#multiselect_to_1').append(options);
		    });
		},
		loadScreens : function(){
			var groupId = $('#groupId').val();
			var accessId = $("input:radio[name ='accessId']:checked").val();
			var url = ScreenGroup.BASE_URL+"/screensByGroup/"+groupId+"/"+accessId;
			
			if(ToolBox.isNotNull(groupId) && ToolBox.isNotNull(accessId)){
				$.get(url, function(data){
					$('#multiselectDiv').html(data);
					$('.multiselect').multiselect({submitAllLeft: false });
			    });
			}
			
		}
	}
	

}