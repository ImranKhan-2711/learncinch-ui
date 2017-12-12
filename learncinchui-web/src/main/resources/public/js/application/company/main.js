var Company = {
	BASE_URL : APP_CTX + "admin/company",
	List : {
		init : function() {
			App.List.init(Company.BASE_URL);
		}
	},
	Modal : {
		open : function(obj) {
			App.Modal.open(obj, Company.BASE_URL, Company.Modal.init);
		},
		init : function(data) {
			// Add functions required to initialize after modal is rendered. for
			// example date pciker.
			$(document).on('change', '#logo', function() {
				var maxsize = parseInt($(this).data('data-maxsize'));
				console.log(maxsize)
				// check file size
				if(this.files[0].size>maxsize){
					// show error if file size greater than max size
					var msg=$(this).data('msg-maxsize');
					$('#formModal').find('.alert-danger').text(msg).removeClass('hide').show();
					//make paymentCheckImage empty 
					$('#paymentCheckImage').val('');
					//make current object null so that it does not hold any previous value
					 $(this).val(null);
					 
					return false;
					
				}
				Company.UploadLogo.readURL(this);
			});
			$(document).on('click', '#reloadIcon', function() {
				$('#fileBrowser').removeClass('hide');
				$('#imageSection').addClass('hide');
				$('#logo').val('');
			});
			$(':input[name="supplierReference"]').keyup(function(e) {
				if($(this).val().length>50){
					var msg = $(this).data('msg-supplierlength');
					$('#formModal').find('.alert-danger').text(msg)
					.removeClass('hide').show();
				}
			});
		},
		save : function(obj) {
			App.Modal.saveMultipart(obj, function(cmBean) {
				$('#id').val(cmBean.id);
				$('#invoiceSeq').val(cmBean.invoiceSeq);
			});
			return false;
		}
		
		
	},
	UploadLogo : {

		readURL : function(input) {
			if (input.files && input.files[0]) {
				var reader = new FileReader();
				reader.onload = function(e) {
					$('#img-upload').attr('src', e.target.result);
				}
				reader.readAsDataURL(input.files[0]);
				$('#imageSection').removeClass('hide');
				$('#fileBrowser').addClass('hide');
			}
		}
	}
}