# -*- coding: utf-8 -*-
#################################################################################
# Author      : Webkul Software Pvt. Ltd. (<https://webkul.com/>)
# Copyright(c): 2015-Present Webkul Software Pvt. Ltd.
# All Rights Reserved.
#
#
#
# This program is copyright property of the author mentioned above.
# You can`t redistribute it and/or modify it.
#
#
# You should have received a copy of the License along with this program.
# If not, see <https://store.webkul.com/license.html/>
#################################################################################
{
  "name"                 :  "POS Customer Screen Base",
  "summary"              :  """This is the base module for other modules related to the pos customer screen.""",
  "category"             :  "Point Of Sale",
  "version"              :  "1.0.3",
  "author"               :  "Webkul Software Pvt. Ltd.",
  "license"              :  "Other proprietary",
  "website"              :  "https://store.webkul.com",
  "description"          :  """pos customer screen, customer screen in odoo, odoo customer screen, review screen, cart screen""",
  "depends"              :  ['point_of_sale'],
  "data"                 :  [
                             'security/ir.model.access.csv',
                             'views/pos_customer_screen_base_views.xml',
                             'views/template.xml',
                            ],
  "qweb"                 :  ['static/src/xml/pos_customer_screen_templates.xml'],
  "images"               :  ['static/description/Banner.png'],
  "application"          :  True,
  "installable"          :  True,
  "auto_install"         :  False,
  "price"                :  30,
  "currency"             :  "USD",
  "pre_init_hook"        :  "pre_init_check",
}