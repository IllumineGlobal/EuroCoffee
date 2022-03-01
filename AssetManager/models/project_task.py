from odoo import models, fields, api, _

class ProjectTask(models.Model):
    _inherit = 'project.task'

    description = fields.Many2one('asset.master', string="Asset")

    @api.onchange('partner_id')
    def get_asset_for_project(self):
        for rec in self:
            description = fields.One2many('asset.master', rec.partner_id.id, string="Asset")
