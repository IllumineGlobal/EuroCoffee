# -*- coding: utf-8 -*-
#################################################################################
#
#   Copyright (c) 2016-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>)
#   See LICENSE file for full copyright and licensing details.
#   License URL : <https://store.webkul.com/license.html/>
#
#################################################################################
from odoo.http import request,Response
from odoo import http
import jinja2
import json
import os.path as os_path
import threading
import logging
_logger = logging.getLogger(__name__)



dir_path = os_path.realpath(os_path.join(os_path.dirname(__file__), '../views'))
env_obj = jinja2.Environment(loader=jinja2.FileSystemLoader(dir_path), autoescape=True)
env_obj.filters["json"] = json.dumps
template = env_obj.get_template('pos_customer_screen.xml')

class CustomerScreenBase(http.Controller):

    def __init__(self):
        super(CustomerScreenBase, self).__init__()
        self.cart_data = {}
        self.review_data = []
        self.screen_reset_timeout = 180



    @http.route('/pos/customer/<int:id>/screen', type='http', auth='none')
    def display_welcome_screen(self,**kw):
        main_js = None
        main_css = None
        bootstrap_js = None
        bootstrap_css = None

        with open(os_path.join(os_path.dirname(__file__), "../static/lib/js/render_screens.js")) as js:
            main_js = js.read()

        with open(os_path.join(os_path.dirname(__file__), "../static/lib/css/main.css")) as css:
            main_css = css.read()

        with open(os_path.join(os_path.dirname(__file__), "../static/lib/js/bootstrap.bundle.min.js")) as js:
            bootstrap_js = js.read()

        with open(os_path.join(os_path.dirname(__file__), "../static/lib/css/bootstrap.css")) as css:
            bootstrap_css = css.read()

        return template.render({
            'main_js': main_js,
            'main_css':main_css,
            'bootstrap_js':bootstrap_js,
            'bootstrap_css':bootstrap_css
        })


    @http.route('/pos/<int:id>/screen/update',  type="json", auth="none",cors='*')
    def screen_update(self,**kw):
        self.screen_reset_timeout = kw.get('screen_reset_timeout')
        if kw.get('id') not in self.cart_data:
            try:
                self.cart_data[kw.get('id')] = {
                    'html' : kw.get('html'),
                    'welcome_html':kw.get('welcome_html'),
                    'is_update':True
                }
            except Exception as e:
                _logger.info("****************Exception*****************:%r",e)
        else:
            self.update_customer_review_display(kw.get("html"),kw.get('config_id'),kw.get('welcome_html'))
        if len(self.review_data) and kw.get('html') and '/show/review' in kw.get('html'):
            review_data =  self.review_data
            self.review_data = []
            return json.dumps(review_data)
        return False



    def update_customer_review_display(self, html=None,config_id=None,welcome_html=None):
        self.cart_data[config_id].update({
            'html':html,
            'is_update':True,
            'welcome_html':welcome_html
                        })


    @http.route('/pos/<int:id>/fetch/screen', type='json', auth='none')
    def get_rendered_screen(self,**kw):
        return self.get_updated_screen(kw.get('id'))


    def get_updated_screen(self,id):
        if self.cart_data.get(id):
            cart_data = self.cart_data.get(id)
        else:
            cart_data = {
                'html':'',
                'is_update':False
            }
        if cart_data and not cart_data.get('is_update'):
            cart_data = {
                'html':'',
                'is_update':False
            }
        return {'rendered_html': cart_data.get('html'),'is_update':cart_data.get('is_update'),'screen_reset_timeout':self.screen_reset_timeout}




    @http.route('/pos/<int:id>/change/update', type='json', auth='none')
    def change_screen_values(self,**kw):
        if kw.get('id') and kw.get('id') in self.cart_data.keys() and self.cart_data and self.cart_data[kw.get('id')] and self.cart_data[kw.get('id')].get('is_update'):
            self.cart_data[kw.get('id')]['is_update'] = False
            return 'done'


    @http.route('/pos/<int:id>/force/update', type='json', auth='none')
    def force_load_values(self,**kw):
        if kw.get('id') and kw.get('id') in self.cart_data.keys() and self.cart_data and self.cart_data[kw.get('id')]:
            self.cart_data[kw.get('id')].update({
                'html': self.cart_data[kw.get('id')].get('html'),
                'is_update':True
            })
            return 'done'
        


    @http.route('/pos/<int:id>/reset/screen', type='json', auth='none')                                                         
    def reset_review_screen(self,**kw):
        if kw.get('id') and kw.get('id') in self.cart_data.keys() and self.cart_data[kw.get('id')] and self.cart_data[kw.get('id')].get('welcome_html'):
            welcome_html = self.cart_data[kw.get('id')].get('welcome_html')                                                                                  
            self.cart_data[kw.get('id')].update({
                'html':welcome_html,
                'is_update':True
            })
            return True
        else:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
            return False



    @http.route('/pos/<int:id>/show/review',type='http', auth='none', cors='*', csrf=False, save_session=False)
    def review_screen(self,**kw):
        if kw.get('id') and kw.get('id') in self.cart_data.keys() and self.cart_data[kw.get('id')] and self.cart_data[kw.get('id')].get('welcome_html'):
            welcome_html = self.cart_data[kw.get('id')].get('welcome_html')
            self.cart_data[kw.get('id')].update({
                'html':welcome_html,
                'is_update':True
            })
        if kw.get('to_check') == 'True':
            self.review_data.append({
                'config_id':kw.get('id'),
                'order_ref':kw.get('order_id'),
                'review_content':kw.get('content'),
                'rating':kw.get('rating')
            })
