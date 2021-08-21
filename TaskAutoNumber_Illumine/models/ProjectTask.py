# -*- coding: utf-8 -*-

# from odoo.exceptions import UserError
from datetime import datetime
from odoo import models, fields, api, _
import calendar
import time

class ProjectTask(models.Model):
    _inherit = 'project.task'

    @api.onchange('project_id')
    def get_auto_number(self):
        for rec in self:
            if rec.project_id.name =='Office Design':
                rec.name = 'OD-' + str(calendar.timegm(time.gmtime()))

            elif rec.project_id.name == "Research & Development":
                rec.name = 'RD-' + str(calendar.timegm(time.gmtime()))

            elif rec.project_id.name == "Installation":
                rec.name = 'IN-' + str(calendar.timegm(time.gmtime()))

            elif rec.project_id.name == "Internal":
                rec.name = 'IN-' + str(calendar.timegm(time.gmtime()))

            elif rec.project_id.name == "Preventive Maintenance":
                rec.name = 'PM-' + str(calendar.timegm(time.gmtime()))

            elif rec.project_id.name == "Other":
                rec.name = 'OT-' + str(calendar.timegm(time.gmtime()))

            elif rec.project_id.name == "Workshop":
                rec.name = 'WS-' + str(calendar.timegm(time.gmtime()))

            elif rec.project_id.name == "Uplift":
                rec.name = 'UP-' + str(calendar.timegm(time.gmtime()))

            elif rec.project_id.name == "Premium Response":
                rec.name = 'PR-' + str(calendar.timegm(time.gmtime()))

            elif rec.project_id.name == "Service Call":
                rec.name = 'SC-' + str(calendar.timegm(time.gmtime()))

            else:
                rec.name = 'PRJ-' + str(calendar.timegm(time.gmtime()))

    def get_number_onsave(self, current_id, project_name):
        if project_name == 'Office Design':
            return 'OD-' + str(current_id).zfill(5)

        elif project_name == "Research & Development":
            return 'RD-' + str(current_id).zfill(5)

        elif project_name == "Installation":
            return 'IN-' + str(current_id).zfill(5)

        elif project_name == "Internal":
            return 'IN-' + str(current_id).zfill(5)

        elif project_name == "Planned Preventive Maintenance":
            return 'PM-' + str(current_id).zfill(5)

        elif project_name == "Other":
            return 'OT-' + str(current_id).zfill(5)

        elif project_name == "Workshop":
            return 'WS-' + str(current_id).zfill(5)

        elif project_name == "Uplift":
            return 'UP-' + str(current_id).zfill(5)

        elif project_name == "Premium Response":
            return 'PR-' + str(current_id).zfill(5)

        elif project_name == "Service Call":
            return 'SC-' + str(current_id).zfill(5)

        else:
            return 'PRJ-' + str(current_id).zfill(5)


    @api.model
    def create(self, vals):
        rec = super(ProjectTask, self).create(vals)
        value = self.get_number_onsave(rec.id,rec.project_id.name)
        rec.name = value
        return rec

