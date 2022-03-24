from odoo import models, fields, api, _


class ContractsManager(models.Model):
    _name = "contracts.master"
    _rec_name = "contract_no"

    contract_no = fields.Char(string="Contract No")
    contract_start_date = fields.Date(string="Contract Start Date")
    contract_end_date = fields.Date(string="Contract End Date")
    contract_status = fields.Selection([('1', 'Active'), ('0', 'Expired')], string='Contract Status')
    contract_type = fields.Selection([('Service', 'Service'), ('FOL', 'FOL')], string='Contract Type')
    contract_customer_partner_id = fields.Many2one('res.partner', string="Customer")
