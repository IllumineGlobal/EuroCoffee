from odoo import models, fields, api, _


class CustomerAssets(models.Model):
    _inherit = 'res.partner'

    asset_details = fields.One2many('asset.master', 'customer_partner_id', string="Asset Details")

