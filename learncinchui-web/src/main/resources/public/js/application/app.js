$(document).ajaxStart(function() {
	$('#loader').show();
});

$(document).ajaxStop(function() {
	$('#loader').hide();
});

// Restrict all submit buttons from working unless page load completes
// $(function(){
$(':button').hide();
// $('#content').hide();

// });

// $(window).load(function() {

// $("#content").show();
// $(':button').show();
// });
// $('input:submit').live('click', restrictSubmit);
//
// // After everything loads, remove the restriction
// $(window).load(function(){
// $('input:submit').unbind(restrictSubmit);
// });
function restrictSubmit() {
	return false;
}
$(document).ready(function() {

	$(".sidebar-toggle").click(function() {
		$("body").toggleClass("hden");
	});

	setTimeout(function() {
		$('.alert-success').slideUp('slow');
	}, 4000);

	// $.fn.dataTableExt.afnFiltering.push(
	// function( oSettings, aData, iDataIndex ) {
	// var row = oSettings.aoData[iDataIndex].nTr;
	// return $(row).hasClass('no-sort') ? false : true;
	// }
	// );
	//			
	// $('input[type=text][readonly]').onfocus="this.blur()";

	Sidebar.initSubMenu();
	// GroupSelects.init();
});

var Sidebar = {

	initSubMenu : function() {
		$('.dropdown-side').click(
				function() {
					$('.dropdown-menu-side').slideToggle(
							'fast',
							function() {
								$('.dropdown-side').toggleClass('view-drp',
										$(this).is(':visible'));
							});
				});

		Sidebar.highlightMenu();

		Sidebar.hideEmptyMenu();

	},
	highlightMenu : function() {
		var path = window.location.pathname; // Returns path only
		$('.sidebar-menu').find('li').removeClass('active');
		var selectedMenu = $('a[href="' + path + '"]');
		// var selectedMenu =
		// $('.sidebar-menu').find('li->a').has('a[href="'+path+'"]');
		var isSubmenu = selectedMenu.parent().parent().hasClass(
				'dropdown-menu-side');
		if (isSubmenu) {
			$('.dropdown-side').click();
		}

		selectedMenu.parent().addClass('active');

	},
	hideEmptyMenu : function() {
		if ($('#projectMgmt').has('li').length > 0) {
			$('#projectMgmt').removeClass('hide');
		}
		if ($('#corpSettings').has('li').length > 0) {
			$('#corpSettings').removeClass('hide');
		}

		if ($('#userPerms').has('li').length > 0) {
			$('#userPerms').removeClass('hide');
		}

	}

}

/**
 * This App object is use for Common to All customs JS.
 */
App = {

	Form : {
		init : function() {

			$('input[type=text][readonly]').focus(function() {
				this.blur();
			});
		},
		initDate : function(selector, format, type) {

			formatValue = ToolBox.isNotNull(format) ? format
					: App.Constants.dateFormat;
			type = ToolBox.isNotNull(type) ? type : App.Constants.type;
			/*
			 * className=ToolBox.isNotNull(className)?className:
			 * App.Constants.dateClassName; className='.'+className;
			 */

			if (type == 'time') {
				formatValue = 'hh:ii';
				minViewValue = 0;
				startViewValue = 1;
				maxViewValue = 2;
			} else if (type == "full") {
				formatValue = formatValue + ' hh:ii'; // 24 hr time format
				minViewValue = 0;
				startViewValue = 2;
				maxViewValue = 4;
			} else if (type == "date") {
				formatValue = formatValue;
				minViewValue = 2;
				startViewValue = 2;
				maxViewValue = 4;
			}

			// $(selector).datetimepicker();
			$(selector).datetimepicker({
				format : formatValue,
				ignoreReadonly : true,
				keepOpen : false
			// autoclose: true,
			// todayBtn: true,
			// minView: minViewValue,
			// startView: startViewValue,
			// minuteStep: 01,
			// maxView:maxViewValue,
			// orientation:'auto'
			});

		},

		loadSelect : function(id, selectedId, url) {
			$.get(url + "/" + id, function(data) {
				$('#loadSelect').html(data);
				if (ToolBox.isNotNull(selectedId)) {
					$("#loadSelect").val(selectedId);
				}
			});
		},
		filterOnEdit : function(searchText) {
			$('#tableList').dataTable().fnFilter($('#search').val());
		}

	},

	Constants : {

		method : {
			POST : 'POST',
			GET : 'GET'
		},
		dateFormat : 'MM/DD/YYYY',
		type : 'date'
	/*
	 * , dateClassName:'datepick'
	 */

	},
	List : {
		init : function(baseUrl, callback) {
			$('#modal').on('hide.bs.modal', function() {
				App.List.fetch(baseUrl, callback);
			});
			App.List.fetch(baseUrl, callback);
		},
		fetch : function(baseUrl, callback) {
			// to maintain page size after editing
			var lengthDropdown = $("select[name='tableList_length']");
			var pageSize = 10;
			if (ToolBox.isNotNull(lengthDropdown.val())) {
				pageSize = parseInt(lengthDropdown.val());
			}

			$.get(baseUrl + "/list", function(data, status) {

				// get default sorting column for table. check for data property
				// on table compoenent and get column index
				var defaultSortColumnIndex = $('#tableList').attr(
						'data-default-sort');
				var aaSorting = [];
				if (ToolBox.isNotNull(defaultSortColumnIndex)) {
					aaSorting = [ [ defaultSortColumnIndex, 'desc' ] ];
				}

				var dataTableOptions = {
					'aoColumnDefs' : [ {
						'bSearchable' : false,
						'bSortable' : false,
						'aTargets' : [ 'nosort' ]
					} ],
					'iDisplayLength' : pageSize,
					dom : '<"top">rt<"bottom"lp><"clear">',
					"aaSorting" : aaSorting
				};
				$('#tableList').parent().html(data);
				// $('#tableList').destroy();
				var oTable = $('#tableList').dataTable(dataTableOptions);
				$('#search').unbind().keyup(function() {
					oTable.dataTable().fnFilter(this.value);
				});

				callback = callback || $.noop;
				// $.noop is blank function. aboave condition will check if
				// calback is udefined then exccuet balnk function
				callback();
				// if(typeof callback === 'function' && callback()){
				// callback();
				// }
				$('#tableList').dataTable().fnFilter($('#search').val());
			});
		}
	},
	Modal : {
		open : function(obj, baseUrl, callback) {

			var url = baseUrl + "/modal";
			var id = $(obj).attr('data-id');
			var param1 = $(obj).attr('param1');
			if (ToolBox.isNotNull(id)) {
				url = url + "/" + id;
			}
			$.get(url, function(data, status) {

				App.modal(data);
				callback(data);
				// $('input[type=text][readonly]').focus(function(){
				// this.blur();
				// });
				// $('input[type=password][readonly]').focus(function(){
				// this.blur();
				// });

				// App.Form.initDate();
			});
		},
		save : function(obj, callback) {
			debugger;
			var url = $(obj).attr("action");
			var formData = $(obj).serialize();
			$(obj).validate();
			if (!$('.alert-danger').is(':visible')) {

				$(obj).find(':submit').prop('disabled', true);
				debugger;
				$
						.ajax({
							type : "POST",
							url : url,
							data : formData,
							success : function(response) {
								debugger;
								if (response.valid) {
									$('.alert').hide();
									$('.alert-success').text(response.success).removeClass('hide').slideDown('slow');
									setTimeout(function() {
										$('.alert-success').slideUp('slow');
									}, 4000);
									callback(response.bean);
									$('#modal').modal('hide');
								} else {
									$(obj).find('.alert-danger').text(response.errors[0]).removeClass('hide').slideDown('slow');
									if ($('.modal-content').length) {
										document.querySelector('.modal-content').scrollTop = 0;
									}
								}
								$(obj).find(':submit').prop('disabled', false);

							},
							error : function(XMLHttpRequest, textStatus,
									errorThrown) {
								alert("Oops some error has occurred");
								$(obj).find(':submit').prop('disabled', false);

							}
						});

			}

		},
		saveMultipart : function(obj, callback) {

			var formData = new FormData($(obj)[0]);
			var url = $(obj).attr("action");

			$(obj).validate();

			if (!$('.alert-danger').is(':visible')) {
				$(obj).find(':submit').prop('disabled', true);
				debugger;
				$
						.ajax({
							type : "POST",
							url : url,
							data : formData,
							processData : false,
							contentType : false,
							success : function(response) {
								debugger;
								if (response.valid) {
									$('.alert').hide();
									$('.alert-success').text(response.success)
											.removeClass('hide').slideDown(
													'slow');
									setTimeout(function() {
										$('.alert-success').slideUp('slow');
									}, 4000);
									callback(response.bean);
									$('#modal').modal('hide');
								} else {
									// using the way
									// $(obj).find('.alert-danger') to display
									// the errors so that it displays the Error
									// Messages on current page like popup
									$(obj).find('.alert-danger').text(
											response.errors[0]).removeClass(
											'hide').slideDown('slow');
									if ($('.modal-content').length) {
										document
												.querySelector('.modal-content').scrollTop = 0;
									}
								}

								$(obj).find(':submit').prop('disabled', false);
							},
							error : function(XMLHttpRequest, textStatus,
									errorThrown) {
								debugger;
								alert("Oops!!! some error has occurred");
								$(obj).find(':submit').prop('disabled', false);
							}
						});

			}

		}
	},
	Replace : {
		Decimal : function(obj) {
			$(obj).val(obj.value.match(/\d+(?:\.\d{0,2})?/));
		}
	},
	initDecimal : function() {

		$(':input[data-replace="decimal"]').keyup(function() {
			App.Replace.Decimal(this);
			// $(this).val(this.value.match(/\d+(?:\.\d{0,2})?/));
		});
	},
	modal : function(response) {
		if (!ToolBox.isNotNull(response)) {
			$('#modal').html("");
			$('#modal').modal('hide');
		} else {
			$('#modal').html(response);
			$('#modal').modal('show');
		}
	},

	refreshContent : function(response) {
		$('#content').html("");
		$('#content').html(response);
	},

	executeMethod : function(functionName, context /* , args */) {
		var args = [].slice.call(arguments).splice(2);
		var namespaces = functionName.split(".");
		var func = namespaces.pop();
		for (var i = 0; i < namespaces.length; i++) {
			context = context[namespaces[i]];
		}
		return context[func].apply(context, args);
	}

}

/**
 * This object should be use for null, undefined and empty check.
 */
ToolBox = {

	isNotNull : function(obj) {
		if (obj != null && obj != undefined && obj != "")
			return true;
		return false;
	},
	isNumeric : function(val, decimalPlaces) {
		// If the last digit is a . then add a 0 before testing so if they type
		// 25. it will be accepted
		var lastChar = val.substring(val.length - 1);
		if (lastChar == ".")
			val = val + "0";

		var objRegExp = new RegExp("^\\s*-?(\\d+(\\.\\d{1," + decimalPlaces
				+ "})?|\\.\\d{1," + decimalPlaces + "})\\s*$", "g");
		if (decimalPlaces == -1)
			objRegExp = new RegExp(
					"^\\s*-?(\\d+(\\.\\d{1,25})?|\\.\\d{1,25})\\s*$", "g");

		return objRegExp.test(val);
	},
	toFixed : function(num, precision) {
		return (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision))
				.toFixed(precision);
	},
	roundFloat : function(num, dec) {
		var d = 1;
		for (var i = 0; i < dec; i++) {
			d += "0";
		}
		return Math.round(num * d) / d;
	}

}
