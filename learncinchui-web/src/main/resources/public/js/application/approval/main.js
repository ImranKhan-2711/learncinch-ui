var Approval = {
	BASE_URL : 	APP_CTX+"approval",
	
	List : {
		init : function() {
			App.List.init(Approval.BASE_URL);
			App.Form.initDate('#weekDate','MM/DD/YYYY');
			//$('#weekDate').datetimepicker('setDaysOfWeekDisabled', [1,2,3,4,5,6]);
//			$('#weekDate').data('DateTimePicker').defaultDate(moment().startOf('week'));
			$('#weekDate').data('DateTimePicker').useCurrent(false);
			
			return false;
		}
	},
	Filter: {
		
		
		filter: function(){
			debugger;
			var filteredData = $("#tableList").DataTable()
			filteredData.search( '' ).columns().search( '' ).draw();
			var status = '';
			if($("#status").val() !== ''){
				status = $("#status option:selected").text();
				filteredData = filteredData.column(2)
			    .search(status)
			    .draw();
			}
			var associate = '';
			if($("#userMasterId").val() !== ''){
				associate = $("#userMasterId option:selected").text();
				filteredData = filteredData.column(1).search(associate)
			    .draw();
			}
			var weekDate = $("#weekDate").val();
			if($("#weekDate").val() !== ''){
				weekDate = $("#weekDate").val();
				var weekStart = moment(weekDate,App.Constants.dateFormat).startOf('week').format(App.Constants.dateFormat);
				filteredData = filteredData.column(0).search(weekStart)
			    .draw();
			}
			
		},
		defaultFilter: function(){
			var filteredData = $("#tableList").DataTable()
			filteredData.search( '' ).columns().search( '' ).draw();
			$("#weekDate").val('');
			$("#userMasterId").val('');
			$("#status").val('');
			
		}
	}
}