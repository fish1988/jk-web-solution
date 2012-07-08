/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: CN
 */
$.extend($.validator.messages, {
			required : '不能为空',
			remote : '请修正该字段',
			email : '这个不是电子邮箱哦',
			url : '网址格式不正确',
			date : '请输入合法的日期，亲~',
			dateISO : '请输入合法的日期 (ISO)，亲~',
			number : '要输入数字哦',
			digits : '只能输入整数，亲~',
			creditcard : '请输入合法的信用卡号，亲~',
			equalTo : '请再次输入相同的值，亲~',
			accept : '请输入合法后缀名的串，亲~',
			maxlength : $.validator.format('亲，长度不能超过{0}哦'),
			minlength : $.validator.format('亲，长度不能小于{0}哦'),
			rangelength : $.validator.format('亲，长度要在{0}和{1}之间哦'),
			range : $.validator.format('亲~，要输入一个介于{0}和{1}之间的值哦'),
			max : $.validator.format('亲，不能超过{0}哦'),
			min : $.validator.format('亲，不能小于{0}哦')
		});

$.validator.addMethod('regex', function(value, element, param) {
			var re = new RegExp(param[0]);

			return this.optional(element) || re.test(value);
		}, '{1}');
$.validator.addMethod('file_size', function(value, element, param) {
			return this.optional(element)
					|| (element.files[0].size <= param * 1024 * 1024)
		}, '文件不能超过{0}M');

$.validator.addMethod("require_from_group", function(value, element, param) {
			var validator = this;
			var selector = param[1];

			var length = $(selector, element.form).filter(function() {
						return validator.elementValue(this);
					}).length;

			return length >= param[0];

		}, "{2}");

// define your custom styles and rules --- [0] regex [1]error [2]help info
var $formValidators = {
	qq : {
		regex : [/^\d{5,12}$/, '请输入正确的QQ号', '5-10位数字']
	},
	qqs : {
		regex : [/^(\d{5,12};)*\d{5,12}(;)?$/, '格式不正确', '请输入QQ号，多个以英文分号隔开']
	},
	tags : {
		require_from_group : [1, '.fill-one', '至少填写一个标签']
	},
	/*'combo-required':{
		regex : [/^(?!请选择$).+/, '请选择', '']
	},*/
	uploadJs : {
		regex : [/\.(js|html|htm|zip|7z|rar|css|less)$/i, '文件格式不正确', ''],
		file_size : 1
	},
	demoJs : {
		require_from_group : [1, '.use-one', '请输入演示地址或上传代码']
	}
}

// help info default = regex[2]
// function-class should be first
$('.help-block').each(function(el) {
	var info = $(this);
	if (info.text().length < 1) {
		var f_cls = info.attr('class').split(' ')[0];
		if ($formValidators[f_cls] && $formValidators[f_cls].regex
				&& $formValidators[f_cls].regex[2])
			info.text($formValidators[f_cls].regex[2]);
	}
})

$.validator.addClassRules($formValidators);