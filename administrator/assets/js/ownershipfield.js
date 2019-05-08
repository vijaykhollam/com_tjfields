/*
 * @package    Com_Tjfields
 * @author     Techjoomla <extensions@techjoomla.com>
 * @copyright  Copyright (c) 2009-2019 TechJoomla. All rights reserved
 * @license    GNU General Public License version 2, or later
 */

var ownership = {
	/* This function to get all users in tjucm via ajax */
	getUsers: function (element, ajaxUrl) {
		jQuery('.user-ownership, .chzn-results').empty();
		jQuery.ajax({
			url: ajaxUrl,
			type: 'POST',
			data: element,
			dataType:"json",
			success: function (data) {
				let selectOption = '';
				let op = '';

				for(let index = 0; index < data.length; ++index)
				{
					selectOption = '';
					if (element.user_id == data[index].value)
					{
						selectOption = ' selected="selected" ';
					}
					op="<option value='"+data[index].value+"' "+selectOption+" > " + data[index]['text'] + "</option>" ;
					jQuery('.user-ownership').append(op);
				}

				/* IMP : to update to chz-done selects*/
				jQuery(".user-ownership").trigger("liszt:updated");
			}
		});
	},
	/* This function to populate all users in ownership field of tjucm form */
	setUsers: function (element) {
		let clientId = '';
		let ajaxUrl = Joomla.getOptions('system.paths').base + "/index.php?option=com_tjfields&task=fields.getAllUsers&format=json";

		element.user_id = jQuery("#ownership_user").val();

		// Check class exists or not
		if (jQuery(".cluster-ownership").length > 0)
		{
			clientId = jQuery(".cluster-ownership").val();

			element.client = clientId;
			ajaxUrl = Joomla.getOptions('system.paths').base + "/index.php?option=com_cluster&task=clusterusers.getUsersByClientId&format=json";
		}

		if ((jQuery.trim(clientId) != '' && clientId != 'undefined') || (jQuery(".cluster-ownership").length == 0))
		{
			this.getUsers(element, ajaxUrl);
		}
	}
}

jQuery(document).ready(function() {

	let dataFields = {client: 0, user_id: 0};

	//Get All users for user field
	ownership.setUsers(dataFields);

	/* This function to get users based on cluster value in tjucm via ajax */
	jQuery('.cluster-ownership').change(function(){

		// Check class exists or not
		if (jQuery(".user-ownership").length == 0)
		{
			return undefined;
		}

		let dataFields = {client: jQuery(this).val() , user_id: jQuery("#ownership_user").val()};
		let ajaxUrl = Joomla.getOptions('system.paths').base + "/index.php?option=com_cluster&task=clusterusers.getUsersByClientId&format=json";
		//Get All associated users
		ownership.getUsers(dataFields, ajaxUrl);
	});
});
