var selectedEngagementId ;
var UserRole = {
	BASE_URL : 	APP_CTX+"admin/userRole",
	List : {
		init: function(){

			selectedEngagementId=$("#engagement").val();
			$('#modal').on('hide.bs.modal', function () {
				UserRole.List.fetch(selectedEngagementId);
			});
			UserRole.List.fetch(selectedEngagementId);
			
		},
		fetch: function(id){
			if(!ToolBox.isNotNull(id)){
				id = 0;
			}
			var dataTableOptions = {
					 'aoColumnDefs': [{
					        'bSortable': false,
					        'aTargets': ['nosort'],
					    }],
					  'iDisplayLength' : $("select[name='tableList_length']").val()  ,
					  'order' : [ [ 1, 'asc' ] ],
					  dom: '<"top">rt<"bottom"lp><"clear">'
//					  initComplete : function(){
//						  $('div.toolbar').html($('#pageButtons').html());
//					  }
				};
			$.get(UserRole.BASE_URL+"/list/"+id, function(data, status){	
				$('#tableList').parent().html(data);
				$('#tableList').dataTable(dataTableOptions);
				$('#search').unbind().keyup(function(){
					$('#tableList').dataTable().fnFilter(this.value);
				});
				App.Form.filterOnEdit();
		    });
		},
		changeEngagement: function(obj){
			//id = $(obj).val();
			selectedEngagementId = $(obj).val();;
			UserRole.List.fetch(selectedEngagementId);
		},
		deleteRole : function(obj) {
			debugger;
			if (confirm('You are proceeding to delete record')) {
				var id = $(obj).attr('data-id');
				var url = UserRole.BASE_URL + "/delete/" + id;
				$.ajax({
					  type: "GET",
					  url: url,
					  success: function(response){
						  if(response.valid){
							  UserRole.List.init();
							  $('.alert').hide();
							  $('.alert-success').text(response.success).removeClass('hide').slideDown('slow');
							  setTimeout(function() {
								  $('.alert-success').slideUp('slow');
								}, 4000);
						  }else{
							  $(obj).find('.alert-danger').text(response.errors[0]).removeClass('hide').slideDown('slow');
							  if($('.modal-content').length){
									document.querySelector('.modal-content').scrollTop = 0;	
								}
						  }
					  }
					});
			}

		}
	},
	Modal : {
		open : function(obj){
			if(ToolBox.isNotNull(selectedEngagementId)){
				var url = UserRole.BASE_URL+"/modal/"+selectedEngagementId;
				var id = $(obj).attr('data-id');
				var param1 = $(obj).attr('param1');
				if(ToolBox.isNotNull(id)){
					url = url+"/"+id; 
				}
				$.get(url, function(data, status){
					
					App.modal(data);
					$('input[type=text][readonly]').focus(function(){
					    this.blur();
					});
			    });
			}else {
				alert("No engagement selected!!");
			}
			
		},
		save : function(obj){
			App.Modal.save(obj,function(urmBean){				
				$('#userRateId').val(urmBean.id);
			});	
		    return false;
		}
//		,addEngagement: function(){
//			$(".modal-body").append("<input type='hidden' name='engagemenrMasterId' id='engagemenrMasterId'/>");
//			$("#engagemenrMasterId").val($("#engagement").val());
//		}
	}
}