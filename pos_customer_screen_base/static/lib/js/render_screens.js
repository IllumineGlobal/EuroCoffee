/* Copyright (c) 2016-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>) */
/* See LICENSE file for full copyright and licensing details. */
/* License URL : <https://store.webkul.com/license.html/> */
$(function() {
    "use strict";
    var timeout_id = null;
    var check_timeout_id = null;
    var reset_timeout_id = null;
    var timeElapsed = 0;
    var givenTimeout = 180;
    var last_html = '';
    var force_load = true;
    var src = window.location.pathname;
    var config_id = src.split('customer/') && src.split('customer/')[1][0];
    


    //Main ajax that runs to check the continous updation of the screen
    function longpolling() {

        $.ajax({
            type: 'POST',
            url: window.location.origin+'/pos/'+config_id+'/fetch/screen',
            dataType: 'json',
            beforeSend: function(xhr){xhr.setRequestHeader('Content-Type', 'application/json');},
            data: JSON.stringify({"jsonrpc": "2.0","config_id":config_id}),
            success: function(data) {
                if(data && data.result){
                    givenTimeout = data.result.screen_reset_timeout;
                    if (data.result.rendered_html) 
                        if(data.result.is_update){
                            $('.main_body').html(data.result.rendered_html);
                            force_load = false;
                            changeUpdationValue();
                                 }         //Used to change the dvalue of of the to_update 
                    if(force_load)
                        updateForceLoad();
                    if(last_html.localeCompare(data.result.rendered_html) != 0 && data.result.rendered_html && data.result.rendered_html.indexOf('/show/review') != -1){
                        timeElapsed += 1
                        var timeout = Math.max(givenTimeout,180)            //Timeout On which the screen gets reset
                        if(timeElapsed >= timeout){
                            if(check_timeout_id)
                                clearTimeout(check_timeout_id);
                            reset_timeout_id = setTimeout(resetScreen, 1000);
                            timeElapsed = 0;
                        }
                    }
                        $('.submit-review button').on('click',function(event){
                            if($('a.smiley-block.radio-option.active').length){
                                $('.right-review-screen').hide();
                                $('.thanks_review').show();
                                if(timeout_id)
                                    clearTimeout(timeout_id);
                                timeout_id = setTimeout(longpolling, 2000);
                            }
                            else if($('span.star-rating.active').length){
                                $('.right-review-screen').hide();
                                $('.thanks_review').show();
                                if(timeout_id)
                                    clearTimeout(timeout_id);
                                timeout_id = setTimeout(longpolling, 2000);
                            }
                            else{
                                event.preventDefault();
                                var smiley = $('a.smiley-block.radio-option');
                                var stars = $('span.star-rating');
                                var timeout_smiley = 50;
                                var timeout_index = 0;
                                smiley.each(function(index, el) {
                                    timeout_index = index;
                                    setTimeout(function(){
                                        $('a.smiley-block.radio-option.active').removeClass('active')  ;
                                        $(el).addClass('active');
                                    },timeout_smiley+timeout_index*50)
                                });
                                setTimeout(function(){
                                    $('a.smiley-block.radio-option.active').removeClass('active')  ;
                                },timeout_smiley+(timeout_index+1)*50)
                                stars.each(function(index, el) {
                                    timeout_index = index;
                                    setTimeout(function(){
                                        $('span.star-rating.active').removeClass('active')  ;
                                        $(el).addClass('active');
                                    },timeout_smiley+timeout_index*50)
                                });
                                setTimeout(function(){
                                    $('span.star-rating.active').removeClass('active')  ;
                                },timeout_smiley+(timeout_index+1)*50)

                            }
                        })
                        $('.cancel-review button').on('click',function(event){
                            $('.right-review-screen').hide();
                            $('.cancelled_review').show();
                            if(timeout_id)
                                clearTimeout(timeout_id);
                            timeout_id = setTimeout(longpolling, 2000);
                        })
                            timeout_id = setTimeout(longpolling, 1000);
                }
            },
            error: function (jqXHR, status, err) {
                if(timeout_id)
                    clearTimeout(timeout_id);
                    timeout_id = setTimeout(longpolling, 5000);
            },

            timeout: 30000,
        });
    }

    //Ajax to reset the review screen

    function resetScreen() {
        $.ajax({
            type: 'POST',
            url: window.location.origin+'/pos/'+config_id+'/reset/screen',
            dataType: 'json',
            beforeSend: function(xhr){xhr.setRequestHeader('Content-Type', 'application/json');},
            data: JSON.stringify({"jsonrpc": "2.0","config_id":config_id}),
            success: function(data) {
                if(data && data.result){
                    if(reset_timeout_id)
                        clearTimeout(reset_timeout_id);
                    timeout_id = setTimeout(longpolling, 1000);
                }
            },
            error:function(jqXHR, status, err){
                console.log("error",err)
                if(reset_timeout_id)
                    clearTimeout(reset_timeout_id);
                reset_timeout_id = setTimeout(resetScreen, 1000);
            },  
            timeout: 30000,
        });
    }

    //Ajax to change the value of is_update to 'false' as the screen has been updated now
    function changeUpdationValue() {
        $.ajax({
            type: 'POST',
            url: window.location.origin+'/pos/'+config_id+'/change/update',
            dataType: 'json',
            beforeSend: function(xhr){xhr.setRequestHeader('Content-Type', 'application/json');},
            data: JSON.stringify({"jsonrpc": "2.0","config_id":config_id}),
            success: function(data) {
                console.log("update chnaged",data)
            },
            error:function(jqXHR, status, err){
                console.log("error",err)
            },  
            timeout: 30000,
        });
    }


    function updateForceLoad() {
        $.ajax({
            type: 'POST',
            url: window.location.origin+'/pos/'+config_id+'/force/update',
            dataType: 'json',
            beforeSend: function(xhr){xhr.setRequestHeader('Content-Type', 'application/json');},
            data: JSON.stringify({"jsonrpc": "2.0","config_id":config_id}),
            success: function(data) {
                console.log("Force_changed",data)
            },
            error:function(jqXHR, status, err){
                console.log("error",err)
            },  
            timeout: 30000,
        });
    }

        
    longpolling();
});
