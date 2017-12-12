var Password = {
	Form : {
		init : function() {
			// hiding notifications on page load
			$(".alert-danger").hide().slideDown();
			setTimeout(function() {
				$(this).removeClass('error');
				$('.alert-danger').hide();
			}, 3000);
			$(".alert-success").hide().slideDown();
			setTimeout(function() {
				$(this).removeClass('success');
				$(".alert-success").hide();
			}, 3000);
		
			// The key up events for current password
			$('#currentPassword').keyup(function() {
				$(this).removeClass('error');
				$('.alert-danger').hide();
			});
			
			// The key up events for new password and confirm password
			$('#newPassword').keyup(function() {
				if(Validate.passwordstrength(this)){
					$(this).removeClass('error');
					$('.alert-danger').hide();
				} else {
					$(this).addClass('error');
					var msg = $('#newPassword').data('msg-passwordstrength');
					$('.alert-danger').text(msg).removeClass('hide').show();
				}
			});

			$('#confirmPassword').keyup(function() {
				if ($('#newPassword').val() != $('#confirmPassword').val() && $.trim($('#confirmPassword').val()) != '') {
					$('#confirmPassword').addClass('error');
					var msg = $('#confirmPassword').data('msg-notequal');
					$('.alert-danger').text(msg).removeClass('hide').show();
				} else {
					$('#confirmPassword').removeClass('error');
					$('.alert-danger').hide();
				}
					});
		},
		save : function(obj) {
			//if (!$('.alert-danger').is(':visible')
			//		&& !$(':input').hasClass('error')) {
				$(obj).validate();
			//}
			if (!$('.alert-danger').is(':visible') && !$(':input').hasClass('error')) {
				$(obj).find(':submit').prop('disabled', true);
				return true;
			}
			return false;

		}

	}
}