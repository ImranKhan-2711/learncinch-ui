var date = new Date();
var year = date.getFullYear();
var Holiday = {
	BASE_URL : APP_CTX + "admin/holiday",
	List : {
		init : function() {
			debugger;
			App.List.init(Holiday.BASE_URL, function() {
				$("#year").val(year);
				// adding change event to year dropdown
				$("#year").change(function() {
					Holiday.Filter.yearFilter(this);
				});
				$("#year").change();
			});
		},
		deleteHoliday : function(obj) {
			if (confirm('You are proceeding to delete record')) {
				year = $("#year").val();
				var id = $(obj).attr('data-id');
				var url = Holiday.BASE_URL + "/delete/" + id;
				$.ajax({
					  type: "GET",
					  url: url,
					  success: function(response){
						  if(response.valid){
							  Holiday.List.init();
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
		open : function(obj) {
			var url = Holiday.BASE_URL + "/modal";
			var id = $(obj).attr('data-id');
			if (ToolBox.isNotNull(id)) {
				url = url + "/" + id;
			}
			$.get(url, function(data, status) {
				App.modal(data);
				App.Form.initDate('#holidayDate');
			});
		},
		save : function(obj) {
			var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20|21)\d{2}$/;

			App.Modal.save(obj, function(hmBean) {
				$('#id').val(hmBean.id);
				var url = Holiday.BASE_URL + "/selectyear";
				$.get(url, function(data) {
					$('#year').html(data);
					$("#year").val(year);
				});
			});
			return false;
		}
	},
	Filter : {
		yearFilter : function(obj) {

			var selected = $(obj).val();
			year = $("#year").val();
			if (ToolBox.isNotNull(selected)) {
				var oTable = $('#tableList').DataTable();
				oTable.column(1).search(selected).draw();
			}
		}
	}
}