var refUrl = null;
var currentModal = 'refType';
var Constants = {
	REF_TYPE : 'refType',
	REF_CODE : 'refCode'
};
var ReferenceType = {
	BASE_URL : APP_CTX + "admin/referenceType",

	List : {
		init : function() {
			App.List.init(ReferenceType.BASE_URL);
			$('hide.bs.modal').unbind();
			$('#modal').on('hide.bs.modal', function() {
				if (currentModal == Constants.REF_TYPE) {
					App.List.fetch(ReferenceType.BASE_URL);
				} else if (currentModal == Constants.REF_CODE) {
					ReferenceCode.List.fetch(refUrl);
				}

			});
		}
	}

}