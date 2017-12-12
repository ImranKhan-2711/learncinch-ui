var selectedJobId ;
var JobMaster = {
	BASE_URL : APP_CTX + "admin/jobSchedule",
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
			App.Form.filterOnEdit();
		});
	},Modal : {
		open : function(obj){
			selectedJobId=$(obj).attr("data-id");
			if(ToolBox.isNotNull(selectedJobId)){
				var url = JobMaster.BASE_URL+"/modal";
				var id = $(obj).attr('data-id');
				if(ToolBox.isNotNull(id)){
					url = url+"/"+id; 
				}
				$.get(url, function(data, status){
					App.modal(data);
			    });
			}else {
				alert("No job selected!!");
			}
			
		},
		save : function(obj){
			App.Modal.save(obj,function(jobBean){
				debugger;
				$('#jobMasterId').val(jobBean.jobMasterId);
			});	
		    return false;
		}
	}
}