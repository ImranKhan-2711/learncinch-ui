var Engagement = {
	BASE_URL : APP_CTX + "admin/engagement",
	List : {
		init : function() {
			App.List.init(Engagement.BASE_URL);
		}
	},
	Form : {
		open : function(obj) {
			var url = Engagement.BASE_URL + "/new";
			var id = $(obj).attr('data-id');
			if (ToolBox.isNotNull(id)) {
				url = Engagement.BASE_URL + "/edit/" + id;
			}
			window.location = url;

		},
		save : function(obj) {
			debugger;
			var form = $(obj).closest('form')
			var url = form.attr("action");
			var formData = form.serialize();
			$(obj).validate();
			if (!$('#formError').is(':visible')) {

				return true;
			}
			return false;
		},
		init : function() {
			// var currentDate = new Date();
			var selectedMenu = $('a[href="' + Engagement.BASE_URL + '"]');
			$('.dropdown-side').click();
			selectedMenu.parent().addClass('active');

			App.Form.initDate('.engagement-date');
			// restricting start and end dates so that startdate is not greater
			// than end date
			$('#startDate').datetimepicker().on('dp.change', function(ev) {
				// $('#endDate').datetimepicker('setStartDate', ev.date);

				if (ToolBox.isNotNull($('#startDate').val())) {
					// moment is used to avoid the warning of deprecated date
					// App.Constants.dateFormat is MM/DD/YYYY
					// comment line by man
					// $('#endDate').data('DateTimePicker').minDate(moment($('#startDate').val(),
					// App.Constants.dateFormat));
				}

			});

			$('#endDate').datetimepicker().on(
					'dp.change',
					function(ev) {
						// $('#startDate').datetimepicker('setEndDate',
						// ev.date);
						// $('#startDate').data('DateTimePicker').maxDate(ev.date);

						// Minimum End Date is Start Date , End date can't be
						// less than start date
						// moment is used to avoid the warning of deprecated
						// date
						// App.Constants.dateFormat is MM/DD/YYYY
						if (ToolBox.isNotNull($('#startDate').val())) {
							$('#endDate').data('DateTimePicker').minDate(
									moment($('#startDate').val(),
											App.Constants.dateFormat));
						}

					});

			App.Form.initDate('#contractDate', 'YYYY.MM.DD');
			// App.initDecimal();
			Engagement.Form.initQuarterDecimal();
			if (ToolBox.isNotNull($('#dropDownId').val())) {
				Engagement.ParentEngagement();
			}
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
	},
	addNew : function(obj) {

		// subtracting header and footer rows
		var dataRows = $('#tableList').find('tr').length - 1;
		var i = dataRows
		var newRow = $('#tableList').find('tr:last').clone();
		debugger;
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
						newRow.find("td:last").html('');
						if ($(this).prop('type') == "number") {
							$(this).attr('value', '');
							// removing class indexed claas and adding new
							// class
						} else if ($(this).prop('type') == "hidden") {
							if ($(this).hasClass('clear-data')) {
								$(this).attr('value', '');
							}
						} else if ($(this).prop('type') == "text") {
							$(this).attr('value', '');
						} else {
							console.log("Missed attribute type"
									+ $(this).prop('type'));
						}
					}
				});

		$("#tableList").append(newRow);
		// App.initDecimal();
		Engagement.Form.initQuarterDecimal();
	},
	deleteRate : function(obj) {
		debugger;
		var id = $(obj).attr("data-id");
		var url = Engagement.BASE_URL + "Rate/delete/" + id
		var options = {
			url : url,
			method : 'GET',
		}
		$
				.ajax(options)
				.done(
						function(data) {
							debugger;
							confirm('You are proceeding to delete record');
							if (data.success !== null) {
								var index = $(obj).parent().siblings("td:last")
										.find("input").attr("name");
								index = parseInt(index.substring(index
										.indexOf('[') + 1,
										index.indexOf('[') + 2)) + 1;
								var totalRows = $("#tableList tbody tr").length;

								for (var i = index + 1; i <= totalRows; i++) {
									var inputs = $(
											"#tableList tbody tr:nth-child("
													+ i + ")").find(":input");
									inputs.each(function(idx) {
										var oldName = $(inputs[idx]).attr(
												"name");
										var newName = oldName.replace(
												oldName.charAt(oldName
														.indexOf('[') + 1),
												i - 2);
										console.log(oldName, newName);
									})
								}

								$(obj).closest('tr').remove();
							}
						})

	},
	InvoiceContactDropDown : function(obj) {
		debugger;
		var companyId = $('#dropDownId').val();

		var url = Engagement.BASE_URL + "/dropDown";
		$
				.ajax({
					type : "POST",
					url : url,
					data : "companyId=" + companyId,
					success : function(data) {
						$('#selectInvoiceContactId').empty();
						$('#selectInvoiceContactId')
								.append(
										'<option value="">--Select Invoice Contact--</option>');
						$('#selectInvoiceAdressId').empty();
						$('#selectInvoiceAdressId')
								.append(
										'<option value="">--Select Invoice Address--</option>');
						for (i in data) {
							$('#selectInvoiceContactId').append(
									'<option value="' + data[i].id + '">'
											+ data[i].name + '</option>');
							$('#selectInvoiceAdressId').append(
									'<option value="' + data[i].id + '">'
											+ data[i].name + '</option>');
						}

					}
				});
		Engagement.ParentEngagement();
		
	},
	ParentEngagement(){
		var id = $('#dropDownId').val();
		var selectedId =  $('#engagementIdValue').val();
		var url = Engagement.BASE_URL + "/engagements/" + id;
		$.get(url, function(data) {
			$('#loadSelect').html(data);
			if (ToolBox.isNotNull(selectedId)) {
				$("#loadSelect").val(selectedId);
			}
			
		});
	}
}