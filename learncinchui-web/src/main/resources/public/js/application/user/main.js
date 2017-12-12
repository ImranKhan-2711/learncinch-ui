var User = {
	BASE_URL : APP_CTX + "admin/user",
	List : {
		init : function() {
			App.List.init(User.BASE_URL);
		},
		update : function() {
			// alert('hi im in update ');
		}
	},
	Modal : {
		open : function(obj) {
			App.Modal.open(obj, User.BASE_URL, User.Modal.init);

		},
		init : function(data) {

			App.Form.initDate('.datepick');
			// restricting start and end dates so that startdate is not greater
			// than end date
			$('#startDate').datetimepicker().on('dp.change', function(ev) {
				// comment line by man
				// $('#endDate').data('DateTimePicker').minDate(ev.date);
			});

			$('#endDate').datetimepicker().on('dp.change', function(ev) {
				$('#startDate').data('DateTimePicker').maxDate(ev.date);
			});

			$('#pwd').keyup(
					function(ev) {
						if (Validate.passwordstrength(this)) {
							$(this).removeClass('error');
							$('.alert-danger').hide();
						} else {
							$(this).addClass('error');
							var msg = $(this).data('msg-passwordstrength');
							$('#formModal').find('.alert-danger').text(msg)
									.removeClass('hide').show();
						}
					});
			$(".workPhone").mask("+1 999-999-9999");
			$(".altPhone").mask("+1 999-999-9999");

		},
		save : function(obj) {
			$('#modalError').addClass("hide");
			workemail.style.borderColor = "#ccc";
			altemail.style.borderColor = "#ccc";
			if (ToolBox.isNotNull($('#workemail').val().trim())
					|| ToolBox.isNotNull($('#altemail').val().trim())) {
				if ($('#workemail').val().trim() == $('#altemail').val().trim()) {
					$('#modalError').text($('#altemail').data('msg-notequal'));
					$('#modalError').removeClass("hide");
					$('#workemail').addClass('error');
					$('#altemail').addClass('error');
					return false;
				}
			}
			App.Modal.save(obj, function(umBean) {
				$('#id').val(umBean.id);
				$('#contactBean.id').val(umBean.contactBean.id);

			});
			return false;
		},
		saveForm : function(obj) {
			debugger;
			var workEmail = $('#workEmail').val();
			var altEmail = $('#altemail').val();
			if (ToolBox.isNotNull(workEmail) || ToolBox.isNotNull(altEmail)) {
				if (workEmail.trim() == altEmail.trim()) {
					$(obj).find('.alert-danger').text(
							$('#altemail').data('msg-notequal')).removeClass(
							'hide').slideDown('slow');
					setTimeout(function() {
						$('.alert-danger').slideUp('slow');
					}, 4000);
					return false;
				}
			}

			if (ToolBox.isNotNull($('#workemail').val().trim())
					|| ToolBox.isNotNull($('#altemail').val().trim())) {
				if ($('#workemail').val().trim() == $('#altemail').val().trim()) {
					$('#modalError').text($('#altemail').data('msg-notequal'));
					$('#modalError').removeClass("hide");
					$('#workemail').addClass('error');
					$('#altemail').addClass('error');
					return false;
				}
			}
			var form = $(obj).closest('form')
			var url = form.attr("action");
			var formData = form.serialize();
			$(obj).validate();
			if (!$('#formError').is(':visible')) {

				return true;
			}
			return false;
		},
		removeReadonly : function(obj) {
			$("#pwd").attr("readonly", false);
			// $("#pwd").unbind();
			$('#pwd').attr('data-validators', 'passwordstrength');
			$("#pwd").val('');
			alert("For new/update Password Kindly keep it other than password ");
		},
		validatePwd : function(obj) {
			var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_@$!]).{6,}/;
			var pwdId = document.getElementById('pwd');
			if (!re.test(obj)) {
				pwdId.style.borderColor = "red";
			} else {
				pwdId.style.borderColor = "#ccc";
			}
		},
		isNumber : function(evt) {
			evt = (evt) ? evt : window.event;
			var charCode = (evt.which) ? evt.which : evt.keyCode;
			if (charCode > 31 && (charCode < 48 || charCode > 57)) {
				return false;
			}
			return true;
		},
		editProfile : function() {
			$("#altPhone").mask("+1 999-999-9999");
		}
	}
}