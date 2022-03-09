/* Copyright (c) 2016-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>) */
/* See LICENSE file for full copyright and licensing details. */
/* License URL : <https://store.webkul.com/license.html/> */
odoo.define('pos_customer_review_cart_screen.env.pos_customer_review_cart_screen', function(require) {
	"use strict";
	var ProductScreen = require('point_of_sale.ProductScreen');
	const Registries = require('point_of_sale.Registries');
	var models = require('point_of_sale.models');
	var core = require('web.core');
	var QWeb = core.qweb;
	var Session = require('web.Session');

	models.load_models([{
		model: 'pos.screen.config',
		label: 'Pos Review Screen',
		fields: ['show_rating_on_page','related_id','welcome_screen_content','ip_address','welcome_screen_subheading','welcome_screen_heading'],
		loaded: function(self, result) {
		  self.db.pos_screen_data = null;
		  _.each(result, function(data) {
			  if(data && (data.related_id[0] == self.config.id))
			  	self.db.pos_screen_data = data;
		  });
		}
	  }],{'after':'pos.config'});

	models.load_models([{
		model: 'promotions.promotions',
		label: 'Promotional Images',
		fields: ['promotions_related_id','image'],
		loaded: function(self, result) {
		  self.db.screen_promotional_images = [];
		  _.each(result, function(data) {
			  if(data.promotions_related_id[0] == self.db.pos_screen_data.id)
			  	self.db.screen_promotional_images.push(data);
		  });
		}
	  }],{'after':'pos.screen.config'});


	  models.PosModel = models.PosModel.extend({

		show_welcome_screen: function(order){
			var self = this;
			var rendered_html = ''
			var config = self.config;
			var url = '';
			var screen_data = self.db.pos_screen_data || false;
			var promotionaly_images_data = self.db.screen_promotional_images;
			var get_promotional = [];
			var screen_refreshed = false;
			var welcome_screen_content = screen_data ? screen_data.welcome_screen_content : '';
			var welcome_screen_title = self.company.name;
			var image_convert_url = 'data:image/png;base64,';
			if(screen_data && screen_data.ip_address)
				url = 'http://'+screen_data.ip_address;
			else
				url = window.location.origin;
			_.each(promotionaly_images_data,function(image){
				var image_url = image_convert_url + image.image;
				get_promotional.push(image_url);
			});
			if(screen_data.banner)
				screen_data.image = image_convert_url + screen_data.banner;
			else
				screen_data.image = false;
			if (order) {
				if(screen_data && !screen_data.show_rating_on_page){
					rendered_html = QWeb.render('customer_facing_welcome_display_html',{
						'images':get_promotional,
						'content':welcome_screen_content,
						'screen_data':screen_data,
						'company_name':welcome_screen_title,
						'shop_name':config.name,
					});
					self.db.pos_screen_data.show_rating_on_page = true;
					screen_refreshed = true;
					self.db.welcome_html = rendered_html;
				}
			}
			var connection = new Session(undefined,url + "/pos/"+config.id+'/screen/update', { use_cors: false});
			connection.rpc(url + "/pos/"+config.id+'/screen/update', {'html': rendered_html,'config_id':config.id,'welcome_html':rendered_html}).then(function(res){
				console.log("res",res)
			});
		},

			
	  });



    var PosResProductScreen = ProductScreen =>
        class extends ProductScreen {
			mounted(){
				var self = this;
				var screen_data = self.env.pos.db.pos_screen_data;
				if(self.env.pos){
					if(screen_data && !screen_data.show_rating_on_page)
					self.env.pos.show_welcome_screen(self);
				}
				super.mounted();

			}
		}

		Registries.Component.extend(ProductScreen, PosResProductScreen);

		Registries.Component.freeze();

});
