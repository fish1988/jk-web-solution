$().ready(function() {
            
            // share form : custom actions after being completely submitted
			$('#share-form').ajaxForm(function() {
                    $('#shareModal').modal('hide');
					alert('分享成功!');
					});
			$('#startTime').datepicker({horizontal:true});
			$('#endTime').datepicker({horizontal:true});
		});