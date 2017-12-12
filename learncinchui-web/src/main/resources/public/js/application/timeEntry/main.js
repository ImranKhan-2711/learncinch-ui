$(document).ready(
		function() {

			// initializing select box with opt group as parent
			GroupSelects.init();

			// totals of table rows and columns and block at the top
			Totals.block();
			Totals.table();
			TimeEntry.BillableCheck();
			TimeEntry.StatusCheck()
			$('#checkAllRows').change(
					function() {
						$('.rowCheckbox').not(':disabled').attr('checked',
								$('#checkAllRows').is(':checked'))
					});
			$('#checkAllRows').attr('checked', true).trigger("change");
			// App.initDecimal();
			TimeEntry.initQuarterDecimal();

		});

var GroupSelects = {
	init : function() {
		// the select dropdowns with optgroup values will display select value
		// along with its optgroup lable

		$('.group-select').each(function() {
			GroupSelects.SetDisplay(this);
		});

		$('.group-select').change(function() {
			GroupSelects.SetBillable(this);
			GroupSelects.SetDisplay(this);
		});

		$('.group-select').focus(function() {
			GroupSelects.ResetDisplay(this);
		});
		
//		$('.group-select').click(function() {
//			GroupSelects.SetDisplay(this);
//		});
		

	},
	SetDisplay : function(obj) {
		var opt = $(obj).find(':selected');
		var sel = opt.text();
		var og = opt.closest('optgroup').attr('label');

		$(obj).blur().find(':selected').text(og + ': ' + sel);
	},
	ResetDisplay : function(obj) {
		$(obj).find('option').each(function() {
			t = $(this).text().split(': ');
			// var text = '';
			// if(t.length>2){
			// $(this).text(t[1]+": "+t[2]);
			// }
			$(this).text(t[1]);

		});
	},
	SetBillable : function(obj) {
		var opt = $(obj).find(':selected');
		var billable = $(opt).data("billable");
		// console.log('billable'+billable);
		var tr = $(obj).parent().parent();
		// set checked for billable check if value is Y otherwise set it
		// unchecked

		if (billable == 'Y') {
			$(tr).find('input:checkbox').attr('checked', true)
					.trigger("change");
		} else {
			$(tr).find('input:checkbox').attr('checked', false).trigger(
					"change");
		}
	}
}

var Totals = {
	block : function() {
		/**
		 * Calculating Block totals
		 */
		var billable = 0;
		$('.billable').each(function() {
			if ($(this).val().trim() != '') {
				billable = billable + parseFloat($(this).val());
			}
		});

		var nonBillable = 0;
		$('.non-billable').each(function() {
			if ($(this).val().trim() != '') {
				nonBillable = nonBillable + parseFloat($(this).val());
			}
		});

		var totalHours = billable + nonBillable;

		$('#totalBillable').text(ToolBox.toFixed(billable, 2));
		$('#totalNonBillable').text(ToolBox.toFixed(nonBillable, 2));
		$('#totalHours').text(ToolBox.toFixed(totalHours, 2));

	},

	table : function() {

		/**
		 * FUnction for calculating row and column totals of a table
		 */

		// row totals
		$('.rowTotal').each(function(rowIndex) {
				var total = 0;
				$('.row-' + rowIndex).each(	function() {
					if ($(this).attr('data-replace') == "quarterdecimal" && $(this).val().trim() != '') {
						total = total+ parseFloat($(this).val().trim());
					}
				});
				$(this).text(ToolBox.toFixed(total, 2));
			});

		// column totals
		$('.colTotal').each(function(colIndex) {
			var total = 0;
			var index = colIndex + 1;
			$('.col-' + index).each(function() {
					if ($(this).attr('data-replace') == "quarterdecimal"&& $(this).val().trim() != '') {
						total = total + parseFloat($(this).val().trim());
					} else if (this.nodeName.toLowerCase() === 'td'	&& $(this).text().trim() != '') {
						total = total+ parseFloat($(this).text().trim());
					}
				});
			$(this).text(ToolBox.toFixed(total, 2));
		});

	}

}

var TimeEntry = {
	addRows : function() {
		// console.log("Adding");
		// subtracting header and footer rows. We have 2 header and one footer
		// so subtracting 3
		var dataRows = $('#timeEntry').find('tr').length - 3;

		var i = dataRows
		// for (i = dataRows; i < dataRows + 3; i++) {

		var newRow = $('#timeEntry').find('tr:eq(2)').clone();
		// in case if its readonly row
		newRow.removeClass('greyed');
		newRow.find('td').removeClass('greyed');
		// finding all the form elemnts like select, inputs checkbox radio
		// and change name params as per list index
		newRow.find(":input").each(function(j) {
				$(this).prop('readonly', false);

				if ($(this).prop('name') != undefined) {
					var oldName = $(this).attr('name');
					var replaceNum = '['+ oldName.charAt(oldName.indexOf('[') + 1)+ ']';
					var replaceWith = '[' + i + ']';
					var newName = oldName.replace(replaceNum,replaceWith);
					$(this).prop('name', newName);
					$(this).prop('id', '');
					
					// resetting new values of inputs to get blank row
					if ($(this).prop('type') == "checkbox") {
						// $(this).prop('checked', false);
						// $(this).prop('value', false);
						$(this).removeAttr('checked');

					// correcting row id on checkbox needed for checkbox click event
						$(this).attr('data-rowid', i);
					} else if ($(this).prop('type') == "select-one") {
						this.selectedIndex = 0;
					// In case the new row is in readonly mode change it to editbale
						$(this).find('option').attr('disabled',	false);
						$(this).removeClass('error');
						// setting parenct child group selects
						$(this).change(function() {
							GroupSelects.SetBillable(this);
							GroupSelects.SetDisplay(this);
						});
//						$(this).click(function() {
//							GroupSelects.SetDisplay(this);
//						});
						$(this).focus(function() {
							GroupSelects.ResetDisplay(this);
							var curIndex = this.selectedIndex; 
							//this.selectedIndex = -1;
							//this.selectedIndex = curIndex;  
						});
						
						GroupSelects.SetDisplay(this);

					} else if ($(this).attr('data-replace') == "quarterdecimal") {
						$(this).attr('value', '');
						// removing class indexed claas and adding new class
						$(this).removeClass('row-0').addClass('row-' + i);
						$(this).removeClass('billable').addClass('non-billable');
					} else if ($(this).prop('type') == "hidden") {
						if ($(this).hasClass('clear-data')) {
							$(this).attr('value', '');
						}

						if ($(this).parent().prop("tagName") == 'DIV') {
							/**
							 * if the first row that is cloned is
							 * read-only then select drop down needs
							 * to be created from scratch
							 */
							var div = $(this).parent();
							var td = $(div).parent();
							div.remove();
							// var engList = $('#engList').clone();
							var placeHolder = $('#engList').attr('placeholder');
							var select = $('<select>', {
								'class' : 'group-select',
								'required' : 'required',
								'name' : newName,
								'placeholder' : placeHolder
							});
							select.append($('#engList').html());
							td.html(select);
							$(select).change(function() {
								GroupSelects.SetDisplay(this);
								GroupSelects.SetBillable(this);
							});

							$(select).focus(function() {
								GroupSelects.ResetDisplay(this);
							});
							GroupSelects.SetDisplay(this);
						}

						/**
						 * input type checkboxs have hidded fields
						 * that as well if(newName.startsWith('_')){
						 * $(this).attr('value', 'off'); }
						 */
					} else if ($(this).prop('type') == "text") {
						$(this).attr('value', '');
						if (newName.indexOf('description' != -1)) {
							$(this).attr('required', 'required');
						}
					} else {
						console.log("Missed attribute type"	+ $(this).prop('type'));
					}
				}
			});
		newRow.find('.rowTotal').text("0.00");

		// appending row to table
		$("#timeEntry").append(newRow);

		// }

		TimeEntry.BillableCheck();
		// replace value with 2 decimal points
		TimeEntry.initQuarterDecimal();
	},

	BillableCheck : function() {
		$("input:checkbox").change(function() {
			// if (this.checked) {
			var rowIndex = $(this).data("rowid");
			if ($(this).is(':checked')) {
				$('.row-' + rowIndex).each(function() {
					$(this).removeClass('non-billable').addClass('billable');
				});
			} else {
				$('.row-' + rowIndex).each(function() {
					$(this).removeClass('billable').addClass('non-billable');
				});
			}
			Totals.block();
			// }
		});
	},
	StatusCheck : function() {

		// var readOnly = $('#reportStatusId').val()=='7';
		// var timeEntryScreen = $('#screen').val()=='timeEntry';
		// if(readOnly && timeEntryScreen){
		// $('#timeEntryForm button').prop('disabled', true);
		// $(':input').prop('disabled', true);
		// }

		$('.greyed :input').prop('readonly', true);
		$('.greyed option:not(:selected)').attr('disabled', true);
		$('.greyed input:checkbox').not('.rowCheckbox').click(function() {
			return false
		});
		;
		// $('#timeEntryForm button').prop('disabled', true);
		// $(':input').prop('disabled', true);
		// $(".greyed").find(":input").each(function(i) {
		// if ($(this).prop('type') == "checkbox") {
		// $(this).click(function(){
		// return false;
		// });
		// } else if ($(this).prop('type') == "select-one") {
		//			
		// } else if ($(this).prop('type') == "number") {
		//			
		// } else if ($(this).prop('type') == "hidden") {
		//			
		// }else if ($(this).prop('type') == "text") {
		//											
		// } else {
		// console.log("Missed attribute type" + $(this).prop('type'));
		// }
		//					
		// });
	},
	initQuarterDecimal : function() {
		$(':input[data-replace="quarterdecimal"]').keyup(function(e) {
			// don't check for tab space and arroy keys
			if ((e.which >= 37 && e.which <= 40) || e.which == 9)
				return;

			$(this).val(function(index, value) {
				value = value == "." ? "0." : value;
				return value
				// .replace(/\d/g, "")
				.match(/\d+(?:\.\d{0,2})?/);
			});

		});
	},
	Save : function(obj) {

		$('.rowTotal').each(function(rowIndex) {
			var total = parseFloat($(this).text());

			// validation should be applied on only those select dropdowns who
			// has atleast one hour field filled up
			var select = $(this).parent().find('select');
			/**
			 * if the total of row is zero then remove the required attribte of
			 * corresponding select box of that row
			 */
			if (total == 0) {
				select.removeAttr('required');
			} else {
				select.attr('required', 'required');
			}

		});

		$(obj).validate();
		if (!$('.alert-danger').is(':visible')) {
			// $(obj).find(':submit').prop('disabled', true);
			$(obj).find(':submit').submit(function() {
				return false;
			});
			return true;
		}

		return false;
	}

}