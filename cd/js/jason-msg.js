/* ==========================================================
 *	jason-msg.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'; //

	/* Msg Code
	 * ============== */

	$(function() {
				// add-on data
				$.jMsg = {
					internal_error : '内部错误',
					success : '操作成功',
					failure : '操作失败',
					validation_error : '验证错误',
					captcha_error : '验证码不正确',
					user_not_exist_error : '用户不存在',
					user_or_password_error : '用户名或密码不正确',
					file_exist_error : '文件已经存在',
					save_file_error : '保存文件出错',
					empty_records_error : '记录为空',
					empty_packedfiles_error : '要批量下载的安装包文件都不存在',
					old_password_error : '旧密码不正确',
					empty_sourcefiles_error : '源包列表为空',
					empty_channels_error : '渠道号列表为空',
					duplicated_record_error : '重复记录',
					approve_user_error : '您不在审批人列表中',
					qqnum_duplicated_error : 'QQ号已存在',
					actived : '已激活',
					not_install : '未安装',
					installed : '已安装',
					reinstall : '覆盖安装',
					channels_out_error : '营业厅和员工总数超过9999个',
					duplicated_channels_error : '渠道号已存在',
					channels_invalid_error : '渠道号无效',
					app_exist_error : '该应用已存在',
					name_exist_error : '该名称已存在',
					qqnum_validation_error : 'QQ号未登录',
					qqnum_not_exist_error : '该用户不存在',
					app_name_duplicated_error : '应用名称不能重复',
					packMsg : function(msg) {
						return msg
								.replace('channels_not_exist_error', '渠道号不存在')
								.replace('channels_invalid_error', '渠道号无效');
					}
				}
			});

}(window.jQuery);