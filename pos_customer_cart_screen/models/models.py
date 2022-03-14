# -*- coding: utf-8 -*-
#################################################################################
#
#   Copyright (c) 2016-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>)
#   See LICENSE file for full copyright and licensing details.
#   License URL : <https://store.webkul.com/license.html/>
# 
#################################################################################
from odoo import api, fields, models


class PosCustomerCartScreen(models.Model):
	_inherit = 'pos.screen.config'

	show_cart_type = fields.Selection([('auto','Automatically On Adding Product'),('button','On Button Click')], string="Show Cart Products",help="User can choose whether he wants to add the product automatically on addition of product or on the click of a button",default="auto")
	show_product_image = fields.Boolean(string="Show Product Image",default=True)