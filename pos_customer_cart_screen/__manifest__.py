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
  "name"                 :  "POS Customer Cart Screen",
  "summary"              :  """This module is used to show the products that are added into a particular cart. This is a handy way to show the customers what is in their cart.""",
  "category"             :  "Point Of Sale",
  "version"              :  "1.0.1",
  "author"               :  "Webkul Software Pvt. Ltd.",
  "license"              :  "Other proprietary",
  "website"              :  "https://store.webkul.com",
  "description"          :  """pos cart screen, pos customer screen, product screen, products on screen, items screen, pos screen
                               item screen, screen items, pos products screen""",
  "live_test_url"        :  "http://odoodemo.webkul.com/?module=pos_customer_cart_screen&lifetime=60&custom_url=/",
  "depends"              :  ['pos_customer_screen_base'],
  "data"                 :  [
                             'views/pos_customer_cart_screen_views.xml',
                             'views/template.xml',
                            ],
  "qweb"                 :  ['static/src/xml/pos_cart_screen_template.xml'],
  "images"               :  ['static/description/Banner.png'],
  "application"          :  True,
  "installable"          :  True,
  "auto_install"         :  False,
  "price"                :  39,
  "currency"             :  "USD",
  "pre_init_hook"        :  "pre_init_check",
}