# -*- coding: utf-8 -*-
#################################################################################
#
#   Copyright (c) 2016-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>)
#   See LICENSE file for full copyright and licensing details.
#   License URL : <https://store.webkul.com/license.html/>
# 
#################################################################################
from odoo import api, fields, models,_
from odoo.exceptions import ValidationError, Warning,UserError
from odoo.http import request
import logging
_logger = logging.getLogger(__name__)


class PosReviewScreen(models.Model):
	_name = 'pos.screen.config'
	_rec_name = 'related_id'

	url = fields.Text(string="Customer Display Url",compute="compute_url")
	show_rating_on_page = fields.Boolean(string="Show Rating On Page")
	welcome_screen_content = fields.Text(string="Welcome Screen")
	welcome_screen_heading = fields.Char(string="Welcome Screen Title",default="WELCOME")
	welcome_screen_subheading = fields.Char(string="Welcome Screen SubHeading")
	related_id = fields.Many2one('pos.config',string="Pos Config")
	ip_address = fields.Char(string="IP Address")
	promotions_pictures = fields.One2many('promotions.promotions','promotions_related_id',string="Promotional Pictures")

	@api.depends('related_id')
	def compute_url(self):
		for self_obj in self:
			data = None
			url = ''
			if(self_obj.ip_address):
				data = self_obj.ip_address
				url = 'http://{}/pos/customer/{}/screen'.format(data,self_obj.related_id.id)
			else:
				data = request.httprequest.host_url
				url = '{}pos/customer/{}/screen'.format(data,self_obj.related_id.id)
			self_obj.url = url

	@api.constrains('related_id')
	def validate_configs(self):
		records = self.search([])
		count = 0
		for record in records:
			if record.related_id == self.related_id:
				count += 1
		if(count >1):
			raise ValidationError("You can't have two same pos configs.")


	@api.constrains('promotions_pictures')
	def validate_promotional_pics(self):
		if(self.promotions_pictures and len(self.promotions_pictures) > 3):
			raise ValidationError("You can't set more than 3 promotional pictures.")


	def redirect_customer_screen(self):
		if self.url:
			url = self.url
		else:
			base_url = request.httprequest.host_url
			url = '{}pos/customer/{}/screen'.format(base_url,self.related_id.id)
		return {
				"type": "ir.actions.act_url",
				"url": url,
				"target": "new",
				}


	def write(self, vals):
		_logger.info("********Vals*****:%r",self.read([]))
		opened_session = self.related_id.mapped('session_ids').filtered(lambda s: s.state != 'closed')
		if opened_session:
			raise UserError(_('Unable to modify this PoS Screen Configuration because there is an open PoS Session based on it.'))
		result = super(PosReviewScreen,self).write(vals)
		return result


class Promotions(models.Model):
	_name = 'promotions.promotions'

	image = fields.Binary(string="Promotional Pictures")
	promotions_related_id = fields.Many2one('pos.screen.config',string="Promotions")

class PosConfig(models.Model):
	_inherit = 'pos.config'

	pos_review_screen = fields.One2many('pos.screen.config','related_id', string="Pos Review Screen")


	def open_screen_configuration(self):
		view_id_tree = self.env.ref('pos_customer_screen_base.pos_screen_conf_form').id
		if self.pos_review_screen and self.pos_review_screen.id:
			return {
				'type': 'ir.actions.act_window',
				'res_model': 'pos.screen.config',
				'view_mode': 'form',
				'res_id':self.pos_review_screen.id,
				'view_id':view_id_tree,
				'target': 'current'
			}
		else:
			raise Warning("No Customer Screen Settings available for this POS.")
