var Payment = {
	BASE_URL : 	APP_CTX+"payment",
	List : {
		init : function() {		
			App.List.init(Payment.BASE_URL);
		}
	},
	Modal : {
		open : function(obj){
			App.Modal.open(obj,Payment.BASE_URL,Payment.Modal.init);
		},
		init : function(data){
			//Add functions required to initialize after modal is rendered. for example date pciker.
		},
		save : function(obj){
			App.Modal.save(obj,function(pmBean){				
				//$('#id').val(rmBean.id);
			});	

		    return false;
		}
	}
}