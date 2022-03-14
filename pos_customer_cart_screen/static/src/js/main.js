/* Copyright (c) 2016-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>) */
/* See LICENSE file for full copyright and licensing details. */
/* License URL : <https://store.webkul.com/license.html/> */
odoo.define('pos_customer_cart_screen.pos_customer_cart_screen', function(require) {
	"use strict";
	var models = require('point_of_sale.models');
	var core = require('web.core');
	var QWeb = core.qweb;
	var Session = require('web.Session');
	const TicketScreen = require('point_of_sale.TicketScreen');
	const PaymentScreen = require('point_of_sale.PaymentScreen');
	const ProductScreen = require('point_of_sale.ProductScreen');
	const ReceiptScreen = require('point_of_sale.ReceiptScreen');
	const HeaderButton = require('point_of_sale.HeaderButton');
    const Registries = require('point_of_sale.Registries');
	var SuperOrder = models.Order.prototype;
	var SuperPosModel = models.PosModel;


    models.load_fields('pos.screen.config',['show_cart_type','show_product_image']);

    var PosResTicketScreen = TicketScreen =>
	class extends TicketScreen {

        selectOrder(order) {
			super.selectOrder(order);
			if(self.env && screen_data && screen_data.show_rating_on_page && screen_data.show_cart_type == 'auto'){
				self.env.pos.send_data_to_cart();
			}

		}
	}

	Registries.Component.extend(TicketScreen, PosResTicketScreen);

	Registries.Component.freeze();

	
	

    var PosResProductScreen = ProductScreen =>
        class extends ProductScreen {
		_setValue(val) {
			super._setValue(val);
			var self = this;
			if (this.currentOrder.get_selected_orderline()) {
				var screen_data = self.env.pos.db.pos_screen_data;
				if(screen_data && screen_data.show_cart_type == 'auto'){
				self.env.pos.send_data_to_cart();
				}
			}
		}
	}

	Registries.Component.extend(ProductScreen, PosResProductScreen);

	Registries.Component.freeze();

	

    var PosResPaymentScreen = PaymentScreen =>
        class extends PaymentScreen {
			send_data_to_cart_screen(){
				this.env.pos.send_data_to_cart();
			}
	}

	Registries.Component.extend(PaymentScreen, PosResPaymentScreen);

	Registries.Component.freeze();


    var PosResReceiptScreen = ReceiptScreen =>
        class extends ReceiptScreen {
			get get_screen_data(){
				return this.env.pos.db.pos_screen_data;
			}
            mounted() {
				super.mounted();
				var self = this;
				var order = self.env.pos.get_order();
				var screen_data = self.env.pos.db.pos_screen_data;
				if(screen_data && screen_data.show_cart_type == 'auto' && !screen_data.type_of_icons){
						self.env.pos.send_data_to_cart();
				}
				else{
					self.$('.button.cart_data').on('click',function(el){
						self.env.pos.send_data_to_cart();
					});
				}

			}	
	}

	Registries.Component.extend(ReceiptScreen, PosResReceiptScreen);

	Registries.Component.freeze();

	var SuperHeaderButton = HeaderButton.prototype.onClick;
    var PosResHeaderButton = HeaderButton =>
	class extends HeaderButton {

		onClick() {
			var self = this;
			var config = self.env.pos.config;
			var screen_data = self.env.pos.db.pos_screen_data;
			var url = '';
			if(screen_data && screen_data.ip_address)
				url = 'http://'+screen_data.ip_address;
			else
				url = window.location.origin;
			var connection = new Session(undefined,url + "/pos/"+config.id+'/screen/update', { use_cors: false});
			var welcome_html = self.env.pos.db.welcome_html;
			connection.rpc(url + "/pos/"+config.id+'/screen/update', {'html': welcome_html,'config_id':config.id,'welcome_html':welcome_html}).then(function(res){
				console.log("Res",res)
				SuperHeaderButton.call(self)
			}).catch(function (error) {
				console.log("error",error);
				SuperHeaderButton.call(self)
			});
		}

	}

	Registries.Component.extend(HeaderButton, PosResHeaderButton);

	Registries.Component.freeze();


	  models.PosModel = models.PosModel.extend({


		add_new_order: function(){
			var self = this;
			var res = SuperPosModel.prototype.add_new_order.call(self);
			var screen_data = self.db.pos_screen_data;
			if(screen_data && !screen_data.type_of_icons){
				var config = self.config;		
				var url = '';
				if(screen_data && screen_data.ip_address)
					url = 'http://'+screen_data.ip_address;
				else
					url = window.location.origin;
				var connection = new Session(undefined,url + "/pos/"+config.id+'/screen/update', { use_cors: false});
				var welcome_html = self.db.welcome_html
				connection.rpc(url + "/pos/"+config.id+'/screen/update', {'html': welcome_html,'config_id':config.id,'welcome_html':welcome_html}).then(function(res){
					console.log("************Welcome Screen**************",res)
				}).catch(function (error) {
					console.log("***********Error**************",error)
				});
			}
			return res;
		},

		delete_current_order:function(){
			var self = this;
			SuperPosModel.prototype.delete_current_order.call(self)
			var orderlines = self.get_order().get_orderlines();
			try{
				if(orderlines && Object.keys(orderlines).length > 0){
					if(self && self.db.pos_screen_data)
						self.send_data_to_cart();
				}
				else{
					var config = self.config;
					var screen_data = self.db.pos_screen_data;
					var url = '';
					if(screen_data && screen_data.ip_address)
						url = 'http://'+screen_data.ip_address;
					else
						url = window.location.origin;
					var connection = new Session(undefined,url + "/pos/"+config.id+'/screen/update', { use_cors: false});
					var welcome_html = self.db.welcome_html;
					connection.rpc(url + "/pos/"+config.id+'/screen/update', {'html': welcome_html,'config_id':config.id,'welcome_html':welcome_html}).then(function(res){
						console.log("Res",res)
					}).catch(function (error) {
						console.log("error",error)
					});
				}
			}
			catch(err){
				console.log("***************Exception*********",err)
			}
		},

		convert_path_to_image_base64:function(path, data) {
			return new Promise(function (resolve, reject) {
				var xhr = new XMLHttpRequest();
				xhr.onload = function() {
					var reader = new FileReader();
					reader.onloadend = function() {
						data.image_code = reader.result;
						resolve();
					}
					reader.readAsDataURL(xhr.response);
				};
				xhr.open('GET', path);
				xhr.responseType = 'blob';
				xhr.send();
			});
		},


		get_product_image_path:function(product){
			var path = window.location.origin + '/web/image?model=product.product&field=image_128&id=' + product.id;
			return path
		},


		getting_orderline_data:function(){
			var self = this;
			var orderlines_data = {
				'orderlines':{},
				'total_amount':0,
				'total_tax':0
			};
			var image_promises = [];
			var screen_data = self.db.pos_screen_data;
			var current_order= self.get_order();
			var orderlines = current_order.get_orderlines();
			var data_dict = {};
			console.log("for format",self.env.pos.format_currency)
			_.each(orderlines,function(orderline){
				var product = orderline.product;
				var path = self.get_product_image_path(product);
				var price = self.env.pos.format_currency(orderline.get_display_price());
				data_dict[orderline.id] = {
					'product_name':product.display_name,
					'quantity':orderline.quantityStr,
					'price':price,
					'path':path
				}
			});
			orderlines_data['orderlines'] = data_dict
			if(screen_data && screen_data.show_product_image){
				_.each(data_dict,function(line){
					image_promises.push(self.convert_path_to_image_base64(line.path,line));
				});
				return Promise.all(image_promises).then(function() {
					return orderlines_data
				})
			}
			else
				return orderlines_data
		},

		send_data_to_cart:function(){
			var self = this;
			var config = self.config;
			var current_order = self.get_order();
			var screen_data = self.db.pos_screen_data;
			var url = '';
			if(screen_data && screen_data.ip_address)
				url = 'http://'+screen_data.ip_address;
			else
				url = window.location.origin;
			var order = self.get_order();
			var orderline_html = '';
			var welcome_html = self.db.welcome_html;
			var paymentlines = [];
			if(current_order.is_paid())
				current_order.paymentlines.each(function(paymentline){
					paymentlines.push(paymentline.export_for_printing());
				});
			var items_count = 0;
			_.each(current_order.get_orderlines(),function(orderline){
				items_count += orderline.quantity;
			});
			console.log("paymentlines",paymentlines)
			var connection = new Session(undefined,url+ "/pos/"+config.id+'/screen/update',{ use_cors: false});
			if(screen_data && !screen_data.show_product_image){
				var data = self.getting_orderline_data()
				var orderlines_data = data;
				orderlines_data['items_count'] = items_count;
				orderlines_data['paymentlines'] = paymentlines;
				orderlines_data['order'] = current_order;
				orderlines_data['pos_name'] = self.config.name;
				orderlines_data['show_product_image'] = screen_data.show_product_image;
				if (order) {
					orderline_html = QWeb.render('CustomerCartScreen', {
						'orderlines': Object.values(data.orderlines),
						'orderlines_details':orderlines_data,
						'paymentlines': Object.values(paymentlines),
						'widget':self.chrome,
						'env':self.env.pos
					});
				}
				setTimeout(function(){
				connection.rpc(url + "/pos/"+config.id+'/screen/update', {'html': orderline_html,'config_id':config.id,'welcome_html':welcome_html}).catch(function (error) {
					console.log("***********Error*************",error)
				});
			},300);
			}
			else{
				self.getting_orderline_data().then(function (data) {
					var orderlines_data = data;
					orderlines_data['items_count'] = items_count;
					orderlines_data['paymentlines'] = paymentlines;
					orderlines_data['order'] = current_order;
					orderlines_data['pos_name'] = self.config.name;
					orderlines_data['show_product_image'] = screen_data.show_product_image;
					if (order) {
						orderline_html = QWeb.render('CustomerCartScreen', {
							'orderlines': Object.values(data.orderlines),
							'orderlines_details':orderlines_data,
							'paymentlines': Object.values(paymentlines),
							'env':self.env.pos
						});
						console.log('oderhtm;',orderline_html)
					}
					setTimeout(function(){
					connection.rpc(url + "/pos/"+config.id+'/screen/update', {'html': orderline_html,'config_id':config.id,'welcome_html':welcome_html}).catch(function (error) {
						console.log("***********Error*************",error)
					});
				},300)
				})
			}
		}
	  })

	models.Order = models.Order.extend({


		add_product: function(product, options){
			var self = this;
			var screen_data = self.pos.db.pos_screen_data;
			var res = SuperOrder.add_product.call(self, product, options);
			if(self.pos && screen_data && screen_data.show_rating_on_page && screen_data.show_cart_type == 'auto'){
				console.log("inside")
					self.pos.send_data_to_cart(self);
			}
			return res
		},

	});

});
