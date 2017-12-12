var Project = {
	BASE_URL : APP_CTX + "admin/project",
	List : {
		init : function() {
			App.List.init(Project.BASE_URL);

		},
	},

	Detail : {
		addRows : function() {

			// subtracting header and footer rows
			var dataRows = $('#tableList').find('tr').length - 1;
			var i = dataRows
			$('.delete-r').removeClass('hide');
			var newRow = $('#tableList').find('tr:last').clone();
			// in case its readonly
			newRow.removeClass('greyed');
			newRow.find('td').removeClass('greyed');
			// finding all the form elemnts like select, inputs checkbox radio
			// and change name params as per list index
			newRow.find(":input").each(
					function(j) {
						$(this).prop('readonly', false);
						if ($(this).prop('name') != undefined) {
							var oldName = $(this).attr('name');
							var replaceNum = '['
									+ oldName.charAt(oldName.indexOf('[') + 1)
									+ ']';
							var replaceWith = '[' + i + ']';
							var newName = oldName.replace(replaceNum,
									replaceWith);
							$(this).prop('name', newName);
							$(this).prop('id', '');

							if ($(this).prop('type') == "number") {
								$(this).attr('value', '');

							} else if ($(this).prop('type') == "hidden") {
								if ($(this).hasClass('clear-data')) {
									$(this).attr('value', '');
								}
								// in case of cloning readonly row use default
								// engagament select box
								if ($(this).parent().prop("tagName") == 'DIV') {
									/**
									 * if the first row that is cloned is
									 * read-only then select drop down needs to
									 * be created from scratch
									 */
									var div = $(this).parent();
									var td = $(div).parent();
									div.remove();
									// var engList = $('#engList').clone();
									var placeHolder = $('#loadSelect').attr(
											'placeholder');
									var select = $('<select>', {
										'class' : 'form-control',
										'required' : 'required',
										'name' : newName,
										'placeholder' : placeHolder
									});
									select.append($('#loadSelect').html());
									td.html(select);
								}
							} else if ($(this).prop('type') == "text") {
								$(this).attr('value', '');
							} else if ($(this).prop('type') == "select-one") {
								// In case the new row is in readonly mode
								// change it to editbale
								$(this).find('option').attr('disabled', false);
								$(this).removeClass('error');
								this.selectedIndex = 0;
								if (newName.indexOf('statusId') != -1) {
									$(this).val(1);// set status to new
								} else if (newName.indexOf('statusId') != -1) {
									$(this).val($('#loadSelect').val());
								}

								// $(this).val($('#loadSelect').val());
							} else {
								console.log("Missed attribute type"
										+ $(this).prop('type'));
							}
						}

					});
			$("#tableList").append(newRow);

			Project.Detail.initDate();
			// set selected engagement id selected in project form
			Project.Detail.addNewRow();
			// App.initDecimal();
			Project.Detail.initQuarterDecimal();

		},

		init : function() {
			var selectedMenu = $('a[href="' + Project.BASE_URL + '"]');
			$('.dropdown-side').click();
			selectedMenu.parent().addClass('active');
			App.Form.init();
			Project.Detail.initDate();
			Project.Detail.TotalBudget();
			Project.Detail.TotalHours();
			Project.Detail.SetReadonly();
			if (ToolBox.isNotNull($('#companyDropDown').val())) {
				Project.Detail.loadEngagements($('#companyDropDown'));
				// Project.Detail.loadEngForSubPro($('#companyDropDown'));
			}
			Project.Detail.calculateTotals();

			Project.Detail.initQuarterDecimal();
			debugger;
			var rowLength = $('#tableList').find('tr').length;
			if (rowLength == 2)
			$('.delete-r').addClass('hide');
		},
		initDate : function() {

			App.Form.initDate('.datepick');
			$('.startdatepick').datetimepicker().on('dp.change', function(ev) {
				// comment line by man
				// $(this).parent().parent().find('.enddatepick').data('DateTimePicker').minDate(ev.date);
			});

			$('.enddatepick').datetimepicker().on(
					'dp.change',
					function(ev) {
						$(this).parent().parent().find('.startdatepick').data(
								'DateTimePicker').maxDate(ev.date);
					});

		},
		calculateTotals : function() {
			// TODO: calculate totals for sub details rpoejcts
		},
		loadEngagements : function(obj) {

			var id = $(obj).val();

			App.Form.loadSelect(id, $("#engagementIdValue").val(),
					Project.BASE_URL + "/engagements");
			// Project.Detail.loadEngForSubPro(obj);
			// $("#loadSelect").val($("#engagementIdValue").val());
		},

		save : function(obj) {
			debugger;
			$(obj).validate();
			if (!$('.alert-danger').is(':visible')) {

				$(obj).find(':submit').prop('disabled', true);

				return true;
			}

			return false;
		},
		deleteSubproject : function(obj) {
			var id = $(obj).attr("data-id");
			var rowLength = $('#tableList').find('tr').length;
			var url = APP_CTX + "admin/subproject/delete/" + id
			// var url = BASE_URL+"/subproject/delete/"+id;

			if (confirm('You are proceeding to delete record')) {
				$.ajax({
					url : url,
					method : 'GET',
					success : function(response) {
						console.log("===> " + JSON.stringify(response));
						if (response.valid) {
							var index = $(obj).parent().siblings("td:last")
									.find("input").attr("name");
							index = parseInt(index.substring(
									index.indexOf('[') + 1,
									index.indexOf('[') + 2)) + 1;
							var totalRows = $("#tableList tbody tr").length;
							for (var i = index + 1; i <= totalRows; i++) {
								var inputs = $(
										"#tableList tbody tr:nth-child(" + i
												+ ")").find(":input");
								inputs.each(function(idx) {
									var oldName = $(inputs[idx]).attr("name");
									var newName = oldName.replace(oldName
											.charAt(oldName.indexOf('[') + 1),
											i - 2);
									$(this).prop('name', newName);
									$(this).prop('id', '');
								})
							}

							$(obj).closest('tr').remove();

							$("#modalSuccess").text(response.success)
									.removeClass('hide').slideDown('slow');
							if(rowLength == 3){
								$('.delete-r').addClass('hide');
							}
						} else {
							$("#modalError").text(response.errors[0])
									.removeClass('hide').slideDown('slow');
						}

					},
					error : function(data) {
						alert("Sorry , Try after Some Time");
					}
				});
			}

		},
		TotalBudget : function(obj) {
			var totalBudgetValue = 0;
			$(".tbudget").each(function() {
				var budgetValue;
				budgetValue = parseFloat($(this).val());
				if (!isNaN(budgetValue))
					totalBudgetValue = totalBudgetValue + budgetValue;
			});
			$("#totalBudget").html(ToolBox.roundFloat(totalBudgetValue, 3));

		},
		TotalHours : function(obj) {
			var totalHoursValue = 0;
			$(".thours").each(function() {
				var hoursValue;
				hoursValue = parseFloat($(this).val());
				if (!isNaN(hoursValue))
					totalHoursValue = totalHoursValue + hoursValue;
			});
			$("#totalHours").html(ToolBox.roundFloat(totalHoursValue, 3));

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
		},
		// loadEngForSubPro : function(obj) {
		//
		// var id = $(obj).val();
		// var selectedId = $("#engagementIdValue").val();
		// var url = Project.BASE_URL + "/engforsubpro";
		// $.get(url + "/" + id, function(data) {
		// $('.loadSelectSubPro').html(data);
		// if (ToolBox.isNotNull(selectedId)) {
		// $(".loadSelectSubPro").val(selectedId);
		// }
		// });
		// },
		addNewRow : function() {
			var selectedId = $("#engagementIdValue").val();
			if (ToolBox.isNotNull(selectedId)) {
				$(".loadSelectSubPro").val(selectedId);
			}
		},
		SetReadonly : function() {
			$('.greyed :input').prop('readonly', true);
			$('.greyed option:not(:selected)').attr('disabled', true);
		}

	}
}