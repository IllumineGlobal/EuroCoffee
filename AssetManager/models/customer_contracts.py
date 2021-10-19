from odoo import models, fields, api, _


class CustomerContracts(models.Model):
    _inherit = 'res.partner'

    contract_details = fields.One2many('contracts.master','contract_customer_partner_id', string="Contracts Details")
