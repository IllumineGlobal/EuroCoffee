from odoo import models, fields, api, _

class ContractAsset(models.Model):
    _inherit = 'contracts.master'

    contract_asset_id = fields.Many2one('asset.master', string="Asset")

    @api.onchange('contract_customer_partner_id')
    def get_asset_for_project(self):
        for rec in self:
            contract_asset_id = fields.One2many('asset.master', rec.contract_customer_partner_id.id, string="Asset")
