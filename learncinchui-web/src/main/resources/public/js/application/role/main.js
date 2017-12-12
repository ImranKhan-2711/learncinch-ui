var Role = {
	BASE_URL : 	APP_CTX+"admin/role",
	List : {
		init : function() {		
			App.List.init(Role.BASE_URL);
		}
	},
	Modal : {
		open : function(obj){
			App.Modal.open(obj,Role.BASE_URL,Role.Modal.init);
		},
		init : function(data){
			//Add functions required to initialize after modal is rendered. for example date pciker.
		},
		save : function(obj){
			App.Modal.save(obj,function(rmBean){				
				$('#id').val(rmBean.id);
			});	

		    return false;
		}
	}
}