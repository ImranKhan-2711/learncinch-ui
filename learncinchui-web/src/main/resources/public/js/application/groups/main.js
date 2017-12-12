var Groups = {
	BASE_URL : 	APP_CTX+"admin/groups",
	
	List : {
		init : function() {
			debugger;
			App.List.init(Groups.BASE_URL);
		}
	},
	Modal : {
		open : function(obj){
			App.Modal.open(obj,Groups.BASE_URL,Groups.Modal.init);
		},
		init : function(data){
			//Add functions required to initilize after modal is rendered. for example date pciker.
		},
		save : function(obj){
			App.Modal.save(obj,function(gmBean){				
				$('#id').val(gmBean.id);
			});	
		    return false;
		}
	}
	
}