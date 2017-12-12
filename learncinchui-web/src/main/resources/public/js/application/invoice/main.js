/**
 * 
 */

var Invoice = {
	BASE_URL : APP_CTX + "admin/invoice",
	init : function() {

	},
	Form : {
		open : function(obj) {
			var url = Invoice.BASE_URL + "/new";
			var id = $(obj).attr('data-id');
			if (ToolBox.isNotNull(id)) {
				url = Engagement.BASE_URL + "/edit/" + id;
			}
			window.location = url;
		},

	},
	deleteRow : function(obj) {
		debugger;
		$('#tableModal tr').find('.delete-r').click(function(event) {
			var rowLength = $('#tableModal').find('tr').length;
			if (rowLength > 2)
				$(this).closest('tr').remove();
			if (rowLength == 2)
				$('.delete-r').addClass('hide');
		});
	},
	addNew : function(obj) {
		$('.delete-r').removeClass('hide');
		var dataRows = $('#tableModal').find('tr').length - 1;
		// var i = dataRows
		var newRow = $('#tableModal').find('tr:last').clone();
		var index = $('#tableModal').find('tr:last')
				.find('input[name="index"]').val();
		var i = Number(index) + 1;
		// finding all the form elemnts like select, inputs checkbox radio
		// and change name params as per list index
		newRow.find(":input").each(
				function(j) {
					if ($(this).prop('name') != undefined) {
						var oldName = $(this).attr('name');
						var replaceNum = '['
								+ oldName.charAt(oldName.indexOf('[') + 1)
								+ ']';
						var replaceWith = '[' + i + ']';
						debugger;
						var newName = oldName.replace(replaceNum, replaceWith);
						$(this).prop('name', newName);
						// newRow.find("td:last").html('');
						if ($(this).prop('type') == "text") {
							$(this).attr('value', '');
						} else if ($(this).prop('type') == "number") {
							$(this).attr('value', '');
							// removing class indexed claas and adding new
							// class
						} else if ($(this).prop('type') == "hidden") {
							if ($(this).attr('name') == 'index') {
								$(this).attr('value', i);
							}
						} else {
							console.log("Missed attribute type"
									+ $(this).prop('type'));
						}
					}
				});

		$("#tableModal").append(newRow);
		Invoice.Modal.quarterdecimal();
		// App.initDecimal();
	},
	Modal : {
		init : function(data) {
			debugger;
			// Add functions required to initialize after modal is rendered. for
			// example date picker.
			$(document).on(
					'change',
					'#logo',
					function() {
						var maxsize = parseInt($(this).data('data-maxsize'));
						console.log(maxsize)
						// check file size
						var msg;
						if (this.files[0].size > maxsize) {
							// show error if file size greater than max size
							if (this.files[0].type.match('image/*') || this.files[0].type.match('application/pdf') || this.files[0].type.match('application/vnd.*') ){
								msg = $(this).data('msg-maxsize');
								$('#formModal').find('.alert-danger').text(msg)
										.removeClass('hide').show();
							}else{
								msg = $('#logo').data('msg-fileformat');
								$('#formModal').find('.alert-danger').text(msg)
										.removeClass('hide').show();
							}
							setTimeout(function() {
								$('.alert-danger').slideUp('slow');
							}, 4000);
							// make paymentCheckImage empty
							$('#paymentCheckImage').val('');
							// make current object null so that it does not hold
							// any previous value
							
							$(this).val(null);

							return false;

						}
						Invoice.UploadLogo.readURL(this);
					});
			$(document).on('click', '#reloadIcon', function() {
				$('#fileBrowser').removeClass('hide');
				$('#imageSection').addClass('hide');
				$('#excelSelection').addClass('hide');
				$('#pdfSelection').addClass('hide');
				$('#reloadSection').addClass('hide');
				$('#paymentCheckImage').val('');
				$('#contentType').val('');
			});

		},
		open : function(obj) {
			debugger;
			var modalUrl = '';
			if ($(obj).attr('url') != undefined)
				modalUrl = $(obj).attr('url');

			var url = Invoice.BASE_URL + modalUrl + "/modal";
			var id = $(obj).attr('data-id');
			if (ToolBox.isNotNull(id)) {
				url = url + "/" + id;
			}

			$.get(url, function(data, status) {
				debugger;
				App.modal(data);
				App.Form.initDate('#paymentDepositDate');
				Invoice.Modal.init();
				if ($('#contentType').val().match('image/*')) {
					// image can be jpg,png etc
					$('#imageSection').removeClass('hide');
				} else if ($('#contentType').val() == 'application/pdf') {
					$('#pdfSelection').removeClass('hide');
				} else if ($('#contentType').val().match('application/vnd.*')) {
					// excel file can be .xls or .xlsx
					$('#excelSelection').removeClass('hide');

				}
			});

		},
		openSpecificProject : function(obj) {
			var modalUrl = '';
			if ($(obj).attr('url') != undefined)
				modalUrl = $(obj).attr('url');
			var inputType = $(obj).attr('input-type');
			var url = Invoice.BASE_URL + modalUrl + "/" + inputType + "/modal";
			var id = $(obj).attr('data-id');

			if (ToolBox.isNotNull(id)) {
				url = url + "/" + id;
			}

			$.get(url, function(data, status) {
				App.modal(data);
			});

		},
		deleteInvoice : function(obj) {
			var modalUrl = '';
			if ($(obj).attr('url') != undefined)
				modalUrl = $(obj).attr('url');
			var companyId = '';
			if ($("#company").val() !== '') {
				companyId = $("#company option:selected").val();
			} else {
				companyId = 0;
			}
			var url = Invoice.BASE_URL + modalUrl + "/" + companyId;
			var id = $(obj).attr('data-id');

			if (ToolBox.isNotNull(id)) {
				url = url + "/" + id;
			}
			if (companyId != 0) {
				var companyName = $("#company option:selected").text();
				if (confirm("You are about to delete the last invoice for Company: "
						+ companyName
						+ ". Are you sure you want to delete the last invoice for selected Company?")) {
					Invoice.Modal.deleteInvloiceAjex(url);
				}
			} else {
				Invoice.Modal.deleteInvloiceAjex(url);
			}
		},
		deleteInvloiceAjex : function(url) {
			$.get(url, function(response, status) {

				if (response.valid) {
					$('.alert').hide();
					$('.alert-success').text(response.success).removeClass(
							'hide').slideDown('slow');
					$(document).scrollTop(0);
					setTimeout(function() {
						$('.alert-success').slideUp('slow');
					}, 4000);
				} else {

					$('.alert-danger').text(response.errors[0]).removeClass(
							'hide').slideDown('slow');
					$(document).scrollTop(0);
					setTimeout(function() {
						$('.alert-danger').slideUp('slow');
					}, 4000);

				}

				// reloading table
				App.List.fetch(Invoice.BASE_URL);
			});
		},
		openManualInvoice : function(obj) {
			var modalUrl = '';
			if ($(obj).attr('url') != undefined)
				modalUrl = $(obj).attr('url');
			var inputType = $(obj).attr('input-type');
			var url = Invoice.BASE_URL + modalUrl + "/" + inputType + "/modal";
			// var url = Invoice.BASE_URL+modalUrl+"/modal";
			var id = $(obj).attr('data-id');

			if (ToolBox.isNotNull(id)) {
				url = url + "/" + id;
			}

			$.get(url, function(data, status) {
				App.modal(data);
				// $( "#date" ).datepicker();
				$(".invoice-date").datetimepicker({
					format : App.Constants.dateFormat,
					autoclose : true,
					todayBtn : true,
					minView : 2,
					startView : 2
				});
				Invoice.Modal.quarterdecimal();
				$('.delete-r').addClass('hide');
			});
		},
		quarterdecimal : function() {
			$(':input[data-replace="quarterdecimal"]').keyup(function(e) {
				if ((e.which >= 37 && e.which <= 40) || e.which == 9)
					return;
				$(this).val(function(index, value) {
					return value.match(/\d+(?:\.\d{0,2})?/);
				});

			});
		},
		save : function(obj) {
			App.Modal.saveMultipart(obj, function(invoiceBean) {

			});
			return false;
		},
		savemanual : function(obj) {
			App.Modal.save(obj, function(invoiceHeaderBean) {
			});
			return false;
		},
		saveproject : function(obj) {
			App.Modal.save(obj, function(jobBean) {
				$('#inputType').val(jobBean.inputType);
				$('#jobMasterId').val(jobBean.jobMasterId);
			});
			return false;
		}
	},

	List : {
		init : function() {
			App.List.init(Invoice.BASE_URL);
		}
	},
	Filter : {
		filter : function() {
			// reset table before applying dropdown filters
			// Invoice.Filter.defaultFilter();

			var filteredData = $("#tableList").DataTable();
			filteredData.search('').columns().search('').draw();
			var company = '';
			if ($("#company").val() !== '') {
				company = $("#company option:selected").text();
				filteredData = filteredData.column(1).search(company).draw();
			}

			var project = '';
			if ($("#project").val() !== '') {
				project = $("#project option:selected").text();
				filteredData = filteredData.column(2).search(project).draw();
			}
		},

		defaultFilter : function() {
			var filteredData = $("#tableList").DataTable()
			filteredData.search('').columns().search('').draw();
			$("#project").val('');
			$("#company").val('')

		}
	},
	UploadLogo : {
		readURL : function(input) {
			if (input.files && input.files[0]) {
				debugger;
				var reader = new FileReader();
				reader.onload = function(e) {
					$('#img-upload').attr('src', e.target.result);
				}
				reader.readAsDataURL(input.files[0]);
				if (input.files[0].type.match('image/*')) {
					// image can be jpg,png etc
					$('#imageSection').removeClass('hide');
					$('#contentType').val(input.files[0].type);
				} else if (input.files[0].type.match('application/pdf')) {
					$('#pdfSelection').removeClass('hide');
					$('#contentType').val(input.files[0].type);
				} else if (input.files[0].type.match('application/vnd.*')) {
					// excel file can be .xls or .xlsx
					$('#excelSelection').removeClass('hide');
					$('#contentType').val(input.files[0].type);
				} else {
					debugger;
					var msg = $('#logo').data('msg-fileformat');
					$('#formModal').find('.alert-danger').text(msg)
							.removeClass('hide').show();
					setTimeout(function() {
						$('.alert-danger').slideUp('slow');
					}, 4000);
					return;
				}
				$('#reloadSection').removeClass('hide');
				$('#fileBrowser').addClass('hide');
			}
		}
	}
}

var JobMaster = {
	BASE_URL : APP_CTX + "admin/invoice",
	List : {
		init : function() {
			JobMaster.fetch(JobMaster.BASE_URL);

		}
	},
	fetch : function(baseUrl) {
		// to maintain page size after editing
		var lengthDropdown = $("select[name='tableList_length']");
		var pageSize = 10;
		if (ToolBox.isNotNull(lengthDropdown.val())) {
			pageSize = parseInt(lengthDropdown.val());
			// dataTableOptions.iDisplayLength = parseInt(lengthDropdown.val())
			// ;
			App.Form.filterOnEdit();
		}
		var dataTableOptions = {
			'aoColumnDefs' : [ {
				'bSearchable' : false,
				'bSortable' : false,
				'aTargets' : [ 'nosort' ]
			} ],
			'iDisplayLength' : pageSize
		};

		$.get(baseUrl + "/joblist", function(data, status) {
			$('#tableJobList').parent().html(data);
			// $('#tableJobList').dataTable(dataTableOptions);
		});
	}
}