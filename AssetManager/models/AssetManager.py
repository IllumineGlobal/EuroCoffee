from datetime import datetime
from odoo import models, fields, api, _

class AssetManager(models.Model):
    _name = "asset.master"
    _rec_name = "description"

    asset_id = fields.Char(string="Asset ID")
    description = fields.Char(string="Description")
    serial_number = fields.Char(string="Serial Number")
    acquisition_date = fields.Date(string="Acquisition Date")
    customer_partner_id = fields.Many2one('res.partner', string="Customer")

    task_details = fields.One2many('project.task', 'asset_description', string="Task List")
