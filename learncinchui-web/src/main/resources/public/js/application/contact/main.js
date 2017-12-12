var Contact = {
	BASE_URL : 	APP_CTX+"admin/contact",
	List : {
		init : function() {
			debugger;
			App.List.init(Contact.BASE_URL);
		}
	},
	Modal : {
		open : function(obj){
			App.Modal.open(obj,Contact.BASE_URL,Contact.Modal.init);
		},
		init : function(data){
			$("#workPhone").mask("+1 999-999-9999");
			$("#altPhone").mask("+1 999-999-9999");
		},
		save : function(obj){
			$('#modalError').addClass("hide");
			workemail.style.borderColor="#ccc";
			altemail.style.borderColor="#ccc";
			if(ToolBox.isNotNull($('#workemail').val().trim()) || ToolBox.isNotNull($('#altemail').val().trim()) ){
				if($('#workemail').val().trim()==$('#altemail').val().trim()){
					$('#modalError').html("Email and Alt Email can not be same");
					$('#modalError').removeClass("hide");
					 $("#modalError").removeAttr('style');
					 workemail.style.borderColor="red";
					 altemail.style.borderColor="red";
					return false;
				}
			}
			App.Modal.save(obj,function(cmBean){				
				$('#id').val(cmBean.id);
			});
		    return false;
		},
		isNumber : function(evt){
			evt = (evt) ? evt : window.event;
		    var charCode = (evt.which) ? evt.which : evt.keyCode;
		    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
		        return false;
		    }
		    return true;
		}
	}
}