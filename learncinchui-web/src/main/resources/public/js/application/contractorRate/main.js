var selectedUserId ;
var ContractorRate = {
	BASE_URL : 	APP_CTX+"admin/contractorRate",
	List : {
		init: function(){
			selectedUserId=$("#users").val();
			$('#modal').on('hide.bs.modal', function () {
				ContractorRate.List.fetch(selectedUserId);
			});
			ContractorRate.List.fetch(selectedUserId);
			
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
				};
			$.get(ContractorRate.BASE_URL+"/list/"+id, function(data, status){	
				$('#tableList').parent().html(data);
				$('#tableList').dataTable(dataTableOptions);
				$('#search').unbind().keyup(function(){
					$('#tableList').dataTable().fnFilter(this.value);
				});
				App.Form.filterOnEdit();
				
		    });
		},
		deleteContractor : function(obj) {
			if (confirm('You are proceeding to delete record')) {
				var id = $(obj).attr('data-id');
				
				var url = ContractorRate.BASE_URL + "/delete/" + id;
				$.ajax({
					  type: "GET",
					  url: url,
					  success: function(response){
						  if(response.valid){
							  ContractorRate.List.init();
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

		},
		changeUser: function(obj){
			selectedUserId = $(obj).val();;
			ContractorRate.List.fetch(selectedUserId);
		}
	},
	Modal : {
		open : function(obj){
			if(ToolBox.isNotNull(selectedUserId)){
				var url = ContractorRate.BASE_URL+"/modal/"+selectedUserId;
				var id = $(obj).attr('data-id');
				var param1 = $(obj).attr('param1');
				if(ToolBox.isNotNull(id)){
					url = url+"/"+id; 
				}
				$.get(url, function(data, status){
					App.modal(data);
					ContractorRate.Modal.initQuarterDecimal();
					$('input[type=text][readonly]').focus(function(){
					    this.blur();
					    App.Form.initDate('.contractor-date');
					    // restricting start and end dates so that startdate is not greater
						// than end date
						$('#startDate').datetimepicker().on('dp.change', function(ev) {
							
							if(ToolBox.isNotNull($('#startDate').val())){
							}
							
						});

						$('#endDate').datetimepicker().on('dp.change', function(ev) {
							if(ToolBox.isNotNull($('#startDate').val())){
								$('#endDate').data('DateTimePicker').minDate(moment($('#startDate').val(), App.Constants.dateFormat));
							}
						});
						
					});
			    });
			}else {
				alert("No contractor selected!!");
			}
			
		},
		save : function(obj){
			debugger;
			App.Modal.save(obj,function(urmBean){				
				$('#id').val(urmBean.id);
			});	
		    return false;
		},
		checked : function(obj) {
			if ($(obj).is(":checked")) {
				$(obj).val("1");
			} else {
				$(obj).val("0");
			}
		},
		initQuarterDecimal : function() {
			$(':input[data-replace="quarterdecimal"]').keyup(function(e) {
				// don't check for tab space and arroy keys
				if ((e.which >= 37 && e.which <= 40) || e.which == 9)
					return;
				$(this).val(function(index, value) {
					return value
					// .replace(/\d/g, "")
					.match(/\d+(?:\.\d{0,2})?/);
				});

			});
		}
	}
}