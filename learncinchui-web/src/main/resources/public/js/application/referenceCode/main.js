var selectedRefType;
var ReferenceCode = {
	BASE_URL : APP_CTX + "admin/referenceCode",
	BASEURL : APP_CTX + "admin/",
	List : {
		init : function(obj) {
			debugger;
			var refType = $(obj).parent().parent().find('td');
			selectedRefType = $(refType[0]).text();
			refUrl = $(obj).attr('ref-url');
			ReferenceCode.List.fetch(refUrl);
		},
		fetch : function(refUrl) {
			debugger;
			var dataTableOptions = {
				'aoColumnDefs' : [ {
					'bSearchable' : false,
					'bSortable' : false,
					'aTargets' : [ 'nosort' ]
				} ],
				'iDisplayLength' : $("select[name='refCodeList_length']").val(),
				dom : '<"top">rt<"bottom"lp><"clear">'
			};
			$.get(ReferenceCode.BASEURL + refUrl + "/list", function(data,
					status) {
				$('#refCodes').html(data);
				var oTable = $('#refCodeList').dataTable(dataTableOptions);
				$('#searchCode').unbind().keyup(function() {
					oTable.dataTable().fnFilter(this.value);
				});
				App.Form.filterOnEdit();
				$('html, body').animate({
					scrollTop : $("#refCodes").offset().top
				}, 1000);
			});
		},
		deletebyid : function(obj) {
			if (confirm('You are proceeding to delete record')) {
				var id = $(obj).attr('data-id');
				var url = ReferenceCode.BASEURL + refUrl + "/delete/" + id;
				$
						.ajax({
							type : "GET",
							url : url,
							success : function(response) {
								if (response.valid) {
									ReferenceCode.List.fetch(refUrl);
									$('.alert').hide();
									$('.alert-success').text(response.success)
											.removeClass('hide').slideDown(
													'slow');
									setTimeout(function() {
										$('.alert-success').slideUp('slow');
									}, 4000);
								} else {
									$('.alert-danger').text(
											response.errors[0]).removeClass(
											'hide').slideDown('slow');
									setTimeout(function() {
										$('.alert-success').slideUp('slow');
									}, 4000);
									 $(window).scrollTop(0);
								}
							}
						});
			}

		}
	},
	Modal : {

		open : function(obj) {
			debugger;
			currentModal = Constants.REF_CODE;
			var url = ReferenceCode.BASEURL + refUrl + "/modal";
			var id = $(obj).attr('data-id');
			if (ToolBox.isNotNull(id)) {
				url = url + "/" + id;
			}
			$.get(url, function(data, status) {
				App.modal(data);
				$('input[type=text][readonly]').focus(function() {
					this.blur();
				});
			});

		},
		save : function(obj) {
			debugger;
			App.Modal.save(obj, function(rcBean) {
				$('#id').val(rcBean.id);
			});

			return false;
		}
	}
}