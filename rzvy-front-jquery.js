/*
* rzvy
* Online Multi Business Appointment Scheduling & Reservation Booking Calendar
*/
var rzvy_loader = '<div class="rzvy-loader"><div class="spinner-border m-5" role="status"><span class="visually-hidden">Loading...</span></div></div>';
var is_login_logout_clicked = "N";
$(document).ready(function(){
	var site_url = generalObj.site_url;
	var ajax_url = generalObj.ajax_url;
    $('[data-toggle="tooltip"]').tooltip();
	
	/** Show Location selector Modal **/
	if(generalObj.location_selector == "Y"){
		$("#rzvy-location-selector-modal").modal("show");
	}
	
	/** JS to add intltel input to phone number **/
	if(formfieldsObj.en_ff_phone_status == "Y"){
		$("#rzvy_user_phone").intlTelInput({ initialCountry: generalObj.defaultCountryCode, separateDialCode: true, utilsScript: site_url+"includes/vendor/intl-tel-input/js/utils.js", formatOnDisplay: false });
	}
	if(formfieldsObj.g_ff_phone_status == "Y"){
		$("#rzvy_guest_phone").intlTelInput({ initialCountry: generalObj.defaultCountryCode, separateDialCode: true, utilsScript: site_url+"includes/vendor/intl-tel-input/js/utils.js", formatOnDisplay: false });
	}
	
	/** JS to get frequently discount **/
	$.ajax({
		type: 'post',
		data: {
			'get_all_frequently_discount': 1
		},
		url: ajax_url + "rzvy_front_ajax.php",
		success: function (res) {
			if(res != ""){
				$("#rzvy_frequently_discount_content").html(res);
				$(".show_hide_frequently_discount").show();
			}else{
				$("#rzvy_frequently_discount_content").html("");
				$(".show_hide_frequently_discount").hide();
			}
		}
	});
	
	/** JS to load form **/
	$(".rzvy_hide_calendar_before_staff_selection").hide();
	$.ajax({
		type: 'post',
		data: {
			'on_pageload': 1,
			'precid':generalObj.precateid,
		},
		url: ajax_url + "rzvy_front_ajax.php",
		success: function (res) {
			$("#rzvy-default-pageload-container").html(res);
			$('.owl-carousel').each(function() {
				var $carousel = $(this);
				var $items = ($carousel.data('items') !== undefined) ? $carousel.data('items') : 1;
				var $items_lg = ($carousel.data('items-lg') !== undefined) ? $carousel.data('items-lg') : 1;
				var $items_md = ($carousel.data('items-md') !== undefined) ? $carousel.data('items-md') : 1;
				var $items_sm = ($carousel.data('items-sm') !== undefined) ? $carousel.data('items-sm') : 1;
				var $items_ssm = ($carousel.data('items-ssm') !== undefined) ? $carousel.data('items-ssm') : 1;
				$carousel.owlCarousel ({	
				  loop : ($carousel.data('loop') !== undefined) ? $carousel.data('loop') : true,
				  items : $carousel.data('items'),
				  margin : ($carousel.data('margin') !== undefined) ? $carousel.data('margin') : 0,
				  dots : ($carousel.data('dots') !== undefined) ? $carousel.data('dots') : true,
				  nav : ($carousel.data('nav') !== undefined) ? $carousel.data('nav') : false,
				  navText : ["<div class='slider-no-current'><span class='current-no'></span><span class='total-no'></span></div><span class='current-monials'></span>", "<div class='slider-no-next'></div><span class='next-monials'></span>"],
				  autoplay : ($carousel.data('autoplay') !== undefined) ? $carousel.data('autoplay') : false,
				  autoplayTimeout : ($carousel.data('autoplay-timeout') !== undefined) ? $carousel.data('autoplay-timeout') : 5000000,
				  animateIn : ($carousel.data('animatein') !== undefined) ? $carousel.data('animatein') : false,
				  animateOut : ($carousel.data('animateout') !== undefined) ? $carousel.data('animateout') : false,
				  mouseDrag : ($carousel.data('mouse-drag') !== undefined) ? $carousel.data('mouse-drag') : true,
				  autoWidth : ($carousel.data('auto-width') !== undefined) ? $carousel.data('auto-width') : false,
				  autoHeight : ($carousel.data('auto-height') !== undefined) ? $carousel.data('auto-height') : false,
				  center : ($carousel.data('center') !== undefined) ? $carousel.data('center') : false,
				  stagePadding : (generalObj.stagepadding=='Y') ? 50 : false,
				  responsiveClass: true,
				  dotsEachNumber: true,
				  smartSpeed: 600,
				  autoplayHoverPause: true,
				  responsive : {
					0 : {
					  items : $items_ssm,
					},
					480 : {
					  items : $items_sm,
					},
					768 : {
					  items : $items_md,
					},
					992 : {
					  items : $items_lg,
					},
					1200 : {
					  items : $items,
					}
				  }
				});
				var totLength = $('.owl-dot', $carousel).length;
				$('.total-no', $carousel).html(totLength);
				$('.current-no', $carousel).html(totLength);
				$carousel.owlCarousel();
				$('.current-no', $carousel).html(1);
				$carousel.on('changed.owl.carousel', function(event) {
				  var total_items = event.page.count;
				  var currentNum = event.page.index + 1;
				  $('.total-no', $carousel ).html(total_items);
				  $('.current-no', $carousel).html(currentNum);
				});
			});
			var precateid = generalObj.precateid;
			$('.rzvy-pcategories-selection').each(function(){
				if($(this).data('id')==precateid){
					$(this).trigger('click');
				}
			});
			$('.rzvy-pcategories-selection-pcategories').each(function(){
				if($(this).data('id')==precateid){
					$(this).trigger('click');	
				}
			});
		}
	});
	
	/** feedbacks list slider JS **/
	var feedback_index = 1;
	$(".rzvy_list_of_feedbacks:eq(0)").show();
	if($(".rzvy_list_of_feedbacks").length>1){
		setInterval(function(){ 
			var feedback_i;
			var feedback_x = $(".rzvy_list_of_feedbacks").length;
			for (feedback_i = 0; feedback_i < feedback_x; feedback_i++) {
				$(".rzvy_list_of_feedbacks:eq("+(feedback_i)+")").hide();
			}
			feedback_index++;
			if (feedback_index > feedback_x) {
				feedback_index = 1;
			}
			$(".rzvy_list_of_feedbacks:eq("+(feedback_index-1)+")").fadeIn();
		}, 10000);
	}
	
	/** Validation patterns **/
	$.validator.addMethod("pattern_name", function(value, element) {
		return this.optional(element) || /^[a-zA-Z '.']+$/.test(value);
	}, langObj.please_enter_only_alphabets);
	$.validator.addMethod("pattern_price", function(value, element) {
		return this.optional(element) || /^[0-9]\d*(\.\d{1,2})?$/.test(value);
	}, langObj.please_enter_only_numerics);
	
	$.validator.addMethod("pattern_phone", function(value, element) {
		return this.optional(element) || /\d+(?:[ -]*\d+)*$/.test(value);
	}, langObj.please_enter_valid_phone_number_without_country_code);
	$.validator.addMethod("pattern_zip", function(value, element) {
		return this.optional(element) || /^[a-zA-Z 0-9\-]*$/.test(value);
	}, langObj.please_enter_valid_zip);
	
	/** validate feedback form **/
	$('#rzvy_feedback_form').validate({
		rules: {
			rzvy_fb_name:{ required: true },
			rzvy_fb_email: { required:true, email:true },
			rzvy_fb_review: { required:true }
		},
		messages: {
			rzvy_fb_name:{ required: langObj.please_enter_name },
			rzvy_fb_email: { required: langObj.please_enter_email, email: langObj.please_enter_valid_email },
			rzvy_fb_review: { required: langObj.please_enter_review }
		}
	});
	
	/** validate login form **/
	$('#rzvy_login_form').validate({
		rules: {
			rzvy_login_email: { required:true, email:true },
			rzvy_login_password: { required:true, minlength: 8, maxlength: 20 }
		},
		messages: {
			rzvy_login_email: { required: langObj.please_enter_email, email: langObj.please_enter_valid_email },
			rzvy_login_password: { required: langObj.please_enter_password, minlength: langObj.please_enter_minimum_8_characters, maxlength: langObj.please_enter_maximum_20_characters },
		}
	});
	
	/** two checkout configuration **/
	var twocheckout_status = generalObj.twocheckout_status;
	if(twocheckout_status == 'Y'){
		$(function(){ TCO.loadPubKey('sandbox'); });
	}
	setTimeout(function(){
		/** Trigger Category On Page Load **/
		var booking_first_selection_as = generalObj.booking_first_selection_as;
		var single_category_status = generalObj.single_category_status;
		if(single_category_status == "Y" && booking_first_selection_as == "category"){
			if($('.rzvy-categories-radio-change').length==1){
				$('.rzvy-categories-radio-change').trigger('click');
				$('.rzvy-company-services-blocks').hide();
			}
		}
		
		/** Auto Trigger Service Check if first All Service enabled On Page Load **/
		var single_service_status = generalObj.single_service_status;
		if(single_service_status == "Y" && booking_first_selection_as == "service"){
			if($('.rzvy-services-radio-change').length==1){
				$('.rzvy-services-radio-change').trigger('click');	
				$('.rzvy_show_hide_services').hide();
			}
		}
	}, 1000);
});
/* Function Payment Methods Refresh */
function rzvy_ov_payment_method_refresh_func(){
	var ajax_url = generalObj.ajax_url;
	$(".rzvy-card-detail-box").slideUp(1000);
	$(".rzvy-bank-transfer-detail-box").slideUp(1000);
	$.ajax({
		type: 'post',
		async:true,
		data: {
			'get_payment_methods': 1
		},
		url: ajax_url + "rzvy_front_cart_ajax.php",
		success: function (response) {
			$(".rzvy_payment_methods_container").html(response);
		}
	});
}	
/** stripe check **/
var stripe_status = generalObj.stripe_status;
if(stripe_status == "Y"){
	var stripe_pkey = generalObj.stripe_pkey;
	if(stripe_pkey != ""){
		/* Create a Stripe client. */
		var rzvy_stripe = Stripe(stripe_pkey);

		/* Create an instance of Elements. */
		var rzvy_stripe_elements = rzvy_stripe.elements();

		/* Custom styling can be passed to options when creating an Element. */
		var rzvy_stripe_plan_style = {
			base: {
				color: '#32325d',
				lineHeight: '18px',
				fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
				fontSmoothing: 'antialiased',
				fontSize: '16px',
				'::placeholder': {
					color: '#aab7c4'
				}
			},
			invalid: {
				color: '#fa755a',
				iconColor: '#fa755a'
			}
		};

		/* Create an instance of the card Element. */
		var rzvy_stripe_plan_card = rzvy_stripe_elements.create('card', {style: rzvy_stripe_plan_style});

		/* Add an instance of the card Element. */
		rzvy_stripe_plan_card.mount('#rzvy_stripe_plan_card_element');
	}
}

$(document).ajaxComplete(function(){
	if($(".rzvy_cart_items_list li").length>0){
		$(".sa_hide_show_booking_summary").show();
	}else{
		$(".sa_hide_show_booking_summary").hide();
	}
});
$(document).bind("ready ajaxComplete", function(){
	var ajaxurl = generalObj.ajax_url;
    $('[data-toggle="tooltip"]').tooltip();
	
	if(formfieldsObj.en_ff_firstname == "Y"){ var is_required_firstname = true; }else{ var is_required_firstname = false; }
	if(formfieldsObj.en_ff_lastname == "Y"){ var is_required_lastname = true; }else{ var is_required_lastname = false; }
	if(formfieldsObj.en_ff_phone == "Y"){ var is_required_phone = true; }else{ var is_required_phone = false; }
	if(formfieldsObj.en_ff_address == "Y"){ var is_required_address = true; }else{ var is_required_address = false; }
	if(formfieldsObj.en_ff_city == "Y"){ var is_required_city = true; }else{ var is_required_city = false; }
	if(formfieldsObj.en_ff_state == "Y"){ var is_required_state = true; }else{ var is_required_state = false; }
	if(formfieldsObj.en_ff_country == "Y"){ var is_required_country = true; }else{ var is_required_country = false; }
	if(formfieldsObj.en_ff_dob == "Y"){ var is_required_dob = true; }else{ var is_required_dob = false; }
	if(formfieldsObj.en_ff_notes == "Y"){ var is_required_notes = true; }else{ var is_required_notes = false; }
	if(formfieldsObj.en_ff_image == "Y"){ var is_required_image = true; }else{ var is_required_image = false; }
	
	if(formfieldsObj.g_ff_firstname == "Y"){ var is_required_gfirstname = true; }else{ var is_required_gfirstname = false; }
	if(formfieldsObj.g_ff_lastname == "Y"){ var is_required_glastname = true; }else{ var is_required_glastname = false; }
	if(formfieldsObj.g_ff_phone == "Y"){ var is_required_gphone = true; }else{ var is_required_gphone = false; }
	if(formfieldsObj.g_ff_address == "Y"){ var is_required_gaddress = true; }else{ var is_required_gaddress = false; }
	if(formfieldsObj.g_ff_city == "Y"){ var is_required_gcity = true; }else{ var is_required_gcity = false; }
	if(formfieldsObj.g_ff_state == "Y"){ var is_required_gstate = true; }else{ var is_required_gstate = false; }
	if(formfieldsObj.g_ff_country == "Y"){ var is_required_gcountry = true; }else{ var is_required_gcountry = false; }
	if(formfieldsObj.g_ff_dob == "Y"){ var is_required_gdob = true; }else{ var is_required_gdob = false; }
	if(formfieldsObj.g_ff_notes == "Y"){ var is_required_gnotes = true; }else{ var is_required_gnotes = false; }	
	if(formfieldsObj.g_ff_image == "Y"){ var is_required_gimage = true; }else{ var is_required_gimage = false; }	
	
	
	var is_phone_min = formfieldsObj.ff_phone_min;
	var is_phone_max = formfieldsObj.ff_phone_max;
	
	/** validate user detail form **/
	$("#rzvy_user_detail_form").validate({
		rules: {
			rzvy_user_email:{ required: true, email:true, remote: { 
				url:ajaxurl+"rzvy_check_email_ajax.php",
				type:"POST",
				async:false,
				data: {
					email: function(){ return $("#rzvy_user_email").val(); },
					check_front_email_exist: 1
				}
			} },
			rzvy_user_password: { required:true, minlength: 8, maxlength: 20 },
			rzvy_user_firstname:{ required: is_required_firstname, maxlength: 50 },
			rzvy_user_lastname: { required:is_required_lastname, maxlength: 50 },
			rzvy_user_phone: { required:is_required_phone, minlength: is_phone_min, maxlength: is_phone_max, pattern_phone:true },
			rzvy_user_address: { required:is_required_address },
			rzvy_user_city: { required:is_required_city },
			rzvy_user_state: { required:is_required_state },
			rzvy_user_zip: { required:true, pattern_zip:true, minlength: 5, maxlength: 10 },
			rzvy_user_country: { required:is_required_country },
			rzvy_user_dob: { required:is_required_dob },
			rzvy_user_notes: { required:is_required_notes },
			rzvy_user_image: { required:is_required_image, accept: "jpg|jpeg|png" },
		},
		messages: {
			rzvy_user_email:{ required: langObj.please_enter_email, email: langObj.please_enter_valid_email, remote: langObj.email_already_exist },
			rzvy_user_password: { required: langObj.please_enter_password, minlength: langObj.please_enter_minimum_8_characters, maxlength: langObj.please_enter_maximum_20_characters },
			rzvy_user_firstname:{ required: langObj.please_enter_first_name, maxlength: langObj.please_enter_maximum_50_characters },
			rzvy_user_lastname: { required: langObj.please_enter_last_name, maxlength: langObj.please_enter_maximum_50_characters },
			rzvy_user_phone: { required: langObj.please_enter_phone_number, minlength: langObj.please_enter_minimum_10_digits, maxlength: langObj.please_enter_maximum_15_digits },
			rzvy_user_address: { required: langObj.please_enter_address },
			rzvy_user_city: { required: langObj.please_enter_city },
			rzvy_user_state: { required: langObj.please_enter_state },
			rzvy_user_zip: { required: langObj.please_enter_zip, minlength: langObj.please_enter_minimum_5_characters, maxlength: langObj.please_enter_maximum_10_characters },
			rzvy_user_country: { required: langObj.please_enter_country },
			rzvy_user_dob: { required: langObj.please_enter_birthdate },
			rzvy_user_notes: { required: langObj.please_enter_notes },
			rzvy_user_image: { required: langObj.please_upload_image , accept: langObj.please_select_a_valid_image_file},
		}
	});
	
	/** validate guest user detail form **/
	$("#rzvy_guestuser_detail_form").validate({
		rules: {
			rzvy_guest_email:{ required: true, email:true, remote: { 
				url:ajaxurl+"rzvy_check_email_ajax.php",
				type:"POST",
				async:false,
				data: {
					email: function(){ return $("#rzvy_guest_email").val(); },
					check_front_email_exist: 1
				}
			} },
			rzvy_guest_firstname:{ required: is_required_gfirstname, maxlength: 50 },
			rzvy_guest_lastname: { required:is_required_glastname, maxlength: 50 },
			rzvy_guest_phone: { required:is_required_gphone, minlength: is_phone_min, maxlength: is_phone_max, pattern_phone:true },
			rzvy_guest_address: { required:is_required_gaddress },
			rzvy_guest_city: { required:is_required_gcity },
			rzvy_guest_state: { required:is_required_gstate },
			rzvy_guest_zip: { required:true, pattern_zip:true, minlength: 5, maxlength: 10 },
			rzvy_guest_country: { required:is_required_gcountry },
			rzvy_guest_dob: { required:is_required_gdob },
			rzvy_guest_notes: { required:is_required_gnotes },
			rzvy_guest_image: { required:is_required_gimage ,accept: "jpg|jpeg|png"},
		},
		messages: {
			rzvy_guest_email:{ required: langObj.please_enter_email, email: langObj.please_enter_valid_email, remote: langObj.email_is_already_registered },
			rzvy_guest_firstname:{ required: langObj.please_enter_first_name, maxlength: langObj.please_enter_maximum_50_characters },
			rzvy_guest_lastname: { required: langObj.please_enter_last_name, maxlength: langObj.please_enter_maximum_50_characters },
			rzvy_guest_phone: { required: langObj.please_enter_phone_number, minlength: langObj.please_enter_minimum_10_digits, maxlength: langObj.please_enter_maximum_15_digits },
			rzvy_guest_address: { required: langObj.please_enter_address },
			rzvy_guest_city: { required: langObj.please_enter_city },
			rzvy_guest_state: { required: langObj.please_enter_state },
			rzvy_guest_zip: { required: langObj.please_enter_zip, minlength: langObj.please_enter_minimum_5_characters, maxlength: langObj.please_enter_maximum_10_characters },
			rzvy_guest_country: { required: langObj.please_enter_country },
			rzvy_guest_dob: { required: langObj.please_enter_birthdate },
			rzvy_guest_notes: { required: langObj.please_enter_notes },
			rzvy_guest_image: { required: langObj.please_upload_image , accept: langObj.please_select_a_valid_image_file },
		}
	});
	
	/** validate forget password form **/
	$('#rzvy_forgot_password_form').validate({
        rules: {
            rzvy_forgot_password_email: {required: true, email: true}
        },
        messages: {
            rzvy_forgot_password_email: { required: langObj.please_enter_email_address, email: langObj.please_enter_valid_email_address }
        }
    });
});

/** Forget password JS **/
$(document).on('click','#rzvy_forgot_password_btn',function(e){
	e.preventDefault();
	var email = $('#rzvy_forgot_password_email').val();
	var site_url = generalObj.site_url;
	var ajax_url = generalObj.ajax_url;
	if ($('#rzvy_forgot_password_form').valid()){
		$(this).append(rzvy_loader);
		$.ajax({
			type: 'post',
			data: {
				'email': email,
				'forgot_password': 1
			},
			url: ajax_url + "rzvy_login_ajax.php",
			success: function (res) {
				$(".rzvy-loader").remove();
				if(res.trim() == "mailsent"){
					swal(langObj.reset_password_link_sent_successfully_at_your_registered_email_address, "", "success");
				}else if(res.trim() == "tryagain"){
					swal(langObj.oops_error_occurred_please_try_again, "", "error");
				}else{
					swal(langObj.invalid_email_address, "", "error");
				}
			}
		});
	}
});

/** JS to add multiple qty addons into cart **/
$(document).on("click", ".rzvy-frequently-discount-change", function(){
	var id = $(this).val();
	var ajax_url = generalObj.ajax_url;
	$(this).parent().append(rzvy_loader);
	
	
	if(id>1){
		$(".show_hide_recurrence_booking").show();
	}else{
		$(".show_hide_recurrence_booking").hide();
	}
	
	$.ajax({
		type: 'post',
		data: {
			'id': id,
			'update_frequently_discount': 1
		},
		url: ajax_url + "rzvy_front_ajax.php",
		success: function (res) {
			
			$.ajax({
				type: 'post',
				async:true,
				data: {
					'user': $(".rzvy-user-selection:checked").val(),
					'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
					'payment_method': $(".rzvy-payment-method-check:checked").val(),
					'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
					'refresh_cart_sidebar': 1
				},
				url: ajax_url + "rzvy_front_cart_ajax.php",
				success: function (response) {
					$(".rzvy-loader").remove();
					$("#rzvy_refresh_cart").html(response);

					if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
						$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
					}else{
						$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
					}
					if($(".rzvy-partial-deposit-control-input").prop("checked")){
						if(Number($(".rzvy_cart_pd_amount").val())>0){
							$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
						}else{
							$(".rzvy_update_partial_amount").html("0");
						}
						$(".rzvy-cart-partial-deposite-main").show();
					}else{
						$(".rzvy_update_partial_amount").html("0");
						$(".rzvy-cart-partial-deposite-main").hide();
					}					
					if($(".rzvy-lpoint-control-input").prop("checked")){
						$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
						if(Number($(".rzvy_cart_lp_amount").val())>0){
							$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
						}else{
							$(".rzvy_update_lpoint_amount").html("0");
						}
						$(".rzvy-cart-lpoint-main").slideDown(1000);
					}else{
						$(".rzvy_update_lpoint_count").html("0");
						$(".rzvy_update_lpoint_amount").html("0");
						$(".rzvy-cart-lpoint-main").slideUp(1000);
					}
					rzvy_ov_payment_method_refresh_func();
				}
			});
		}
	});
});

/** JS to add multiple qty addons into cart **/
$(document).on("click", ".rzvy-addon-card-multipleqty-js-counter-btn", function(){
	var id = $(this).data("id");
	var ajax_url = generalObj.ajax_url;
	var minlimit = $("#rzvy-addon-card-mnl-"+id).val();
	var maxlimit = $("#rzvy-addon-card-ml-"+id).val();
	var currentVal = parseInt($(".rzvy-addon-card-multipleqty-unit-"+id).val());
	if($('.rzvy-addon-card-multipleqty-unit-selection-'+id).hasClass("rzvy_required") && currentVal==minlimit && $(this).data('action') == "minus"){
		$('#rzvy-addon-card-multipleqty-minus-js-counter-btn-'+id).addClass('rzvy_nc');
		return false
	}
	if($('.rzvy-addon-card-multipleqty-unit-selection-'+id).hasClass("rzvy_required") && currentVal==minlimit  && $(this).data('action') == "plus"){
		$('#rzvy-addon-card-multipleqty-minus-js-counter-btn-'+id).removeClass('rzvy_nc');
	}
	
	if($(this).data('action') == "plus") {
		var qty = Number($('.rzvy-addon-card-multipleqty-unit-'+id).val());
		if (qty < minlimit) {
			qty = minlimit;
		}else{
			var qty = Number($('.rzvy-addon-card-multipleqty-unit-'+id).val()) + 1;
		}
		
		if(qty>maxlimit){
			qty = maxlimit;
		}
	}else{
		var qty = Number($('.rzvy-addon-card-multipleqty-unit-'+id).val());
		if (qty <= minlimit) {
			qty = 0;
		}
		if(qty>0){
			var qty = Number($('.rzvy-addon-card-multipleqty-unit-'+id).val()) - 1;
		}else{
			var qty = 0;
		}
	}
	if(qty>0){
		if(!$(this).parent().parent().parent().parent().hasClass('selected')){
			$(this).parent().parent().parent().parent().addClass('selected');
		}
	}else{
		$(this).parent().parent().parent().parent().removeClass('selected');
	}
	$(this).parent().parent().parent().append(rzvy_loader);
	
	$.ajax({
		type: 'post',
		data: {
			'id': id,
			'qty': qty,
			'add_to_cart_item': 1
		},
		url: ajax_url + "rzvy_front_cart_ajax.php",
		success: function (res) {	
			$(".rzvy-loader").remove();
			var addoncuston_pricinginfo = res.split('##&##');
			if(addoncuston_pricinginfo[0]){
				$('.rzvy_addon_rate_'+id).html(addoncuston_pricinginfo[0]);
			}
			if(addoncuston_pricinginfo[1]){
				$('.rzvy_addon_duration_'+id).html(addoncuston_pricinginfo[1]);
			}
						
			$.ajax({
				type: 'post',
				async:true,
				data: {
					'user': $(".rzvy-user-selection:checked").val(),
					'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
					'payment_method': $(".rzvy-payment-method-check:checked").val(),
					'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
					'refresh_cart_sidebar': 1
				},
				url: ajax_url + "rzvy_front_cart_ajax.php",
				success: function (response) {
					$("#rzvy_refresh_cart").html(response);
					if(qty>0){
						$('.rzvy-addon-card-multipleqty-unit-'+id).val(qty);
						$('.rzvy-addon-card-multipleqty-unit-selection-'+id).addClass("list_active");
					}else{
						$('.rzvy-addon-card-multipleqty-unit-'+id).val(qty);
						$('.rzvy-addon-card-multipleqty-unit-selection-'+id).removeClass("list_active");
					}
					if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
						$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
					}else{
						$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
					}
					if($(".rzvy-partial-deposit-control-input").prop("checked")){
						if(Number($(".rzvy_cart_pd_amount").val())>0){
							$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
						}else{
							$(".rzvy_update_partial_amount").html("0");
						}
						$(".rzvy-cart-partial-deposite-main").show();
					}else{
						$(".rzvy_update_partial_amount").html("0");
						$(".rzvy-cart-partial-deposite-main").hide();
					}
					
					if($(".rzvy-lpoint-control-input").prop("checked")){
						$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
						if(Number($(".rzvy_cart_lp_amount").val())>0){
							$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
						}else{
							$(".rzvy_update_lpoint_amount").html("0");
						}
						$(".rzvy-cart-lpoint-main").slideDown(1000);
					}else{
						$(".rzvy_update_lpoint_count").html("0");
						$(".rzvy_update_lpoint_amount").html("0");
						$(".rzvy-cart-lpoint-main").slideUp(1000);
					}
					rzvy_ov_payment_method_refresh_func();
					/** Calculate addon duration **/
					$.ajax({
						type: 'post',
						data: { 'front_addon_duration': 1 },
						url: ajax_url + "rzvy_front_addon_duration.php",
						success: function (res) {
							$(".slot_refresh_div").html("");
							$(".rzvy_reset_slot_selection").trigger("click");
						}
					});
					
					/** JS to load calendar **/
					$.ajax({
						type: 'post',
						async:true,
						data: {
							'online': "Y",
							'get_calendar_on_load': 1
						},
						url: ajax_url + "rzvy_calendar_ajax.php",
						success: function (res) {
							$(".rzvy-inline-calendar-container").html(res);
							$.ajax({
								type: 'post',
								async:true,
								data: {
									'selected_date': generalObj.rzvy_todate,
									'get_slots': 1
								},
								url: ajax_url + "rzvy_front_ajax.php",
								success: function(resslots) {
									if(resslots.indexOf('rzvy_time_slots_selection')<0){
										$('.rzvy_todate').removeClass('full_day_available');
										$('.rzvy_todate').removeClass('rzvy_date_selection');
										$('.rzvy_todate').addClass('previous_date');
									}	
								}	
							});
						}
					});	
				}
			});
		}
	});
});

/** JS to add single qty addons into cart **/
$(document).on("click", ".rzvy-addon-card-singleqty-unit-selection", function(){
	var id = $(this).data("id");
	var check = $("#rzvy-addon-card-singleqty-unit-"+id).hasClass("list_active");
	var ajax_url = generalObj.ajax_url;
	if($(this).hasClass("rzvy_required") && check){
		return false
	}
	
	if(!check){
		$("#rzvy-addon-card-singleqty-unit-"+id).addClass("list_active");
		var qty = 1;
		$(this).parent().parent().parent().addClass('selected');
	}else{
		$("#rzvy-addon-card-singleqty-unit-"+id).removeClass("list_active");
		var qty = 0;
		$(this).parent().parent().parent().removeClass('selected');
	}
	$(this).parent().parent().append(rzvy_loader);
	
	$.ajax({
		type: 'post',
		data: {
			'id': id,
			'qty': qty,
			'add_to_cart_item': 1
		},
		url: ajax_url + "rzvy_front_cart_ajax.php",
		success: function (res) {
						
			$.ajax({
				type: 'post',
				async:true,
				data: {
					'user': $(".rzvy-user-selection:checked").val(),
					'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
					'payment_method': $(".rzvy-payment-method-check:checked").val(),
					'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
					'refresh_cart_sidebar': 1
				},
				url: ajax_url + "rzvy_front_cart_ajax.php",
				success: function (response) {
					$(".rzvy-loader").remove();
					$("#rzvy_refresh_cart").html(response);
					if(qty==0){
						$("#rzvy-addon-card-singleqty-unit-"+id).removeClass("list_active");
					}
					if($(".rzvy_cart_items_list li").length>0){
						$(".rzvy-frequently-discount-change:checked").trigger("click");
					}
					if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
						$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
					}else{
						$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
					}
					if($(".rzvy-partial-deposit-control-input").prop("checked")){
						if(Number($(".rzvy_cart_pd_amount").val())>0){
							$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
						}else{
							$(".rzvy_update_partial_amount").html("0");
						}
						$(".rzvy-cart-partial-deposite-main").show();
					}else{
						$(".rzvy_update_partial_amount").html("0");
						$(".rzvy-cart-partial-deposite-main").hide();
					}
					
					if($(".rzvy-lpoint-control-input").prop("checked")){
						$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
						if(Number($(".rzvy_cart_lp_amount").val())>0){
							$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
						}else{
							$(".rzvy_update_lpoint_amount").html("0");
						}
						$(".rzvy-cart-lpoint-main").slideDown(1000);
					}else{
						$(".rzvy_update_lpoint_count").html("0");
						$(".rzvy_update_lpoint_amount").html("0");
						$(".rzvy-cart-lpoint-main").slideUp(1000);
					}
					rzvy_ov_payment_method_refresh_func();
					/** Calculate addon duration **/
					$.ajax({
						type: 'post',
						data: { 'front_addon_duration': 1 },
						url: ajax_url + "rzvy_front_addon_duration.php",
						success: function (res) {
							$(".slot_refresh_div").html("");
							$(".rzvy_reset_slot_selection").trigger("click");
						}
					});
					
					/** JS to load calendar **/
					$.ajax({
						type: 'post',
						async:true,
						data: {
							'online': "Y",
							'get_calendar_on_load': 1
						},
						url: ajax_url + "rzvy_calendar_ajax.php",
						success: function (res) {
							$(".rzvy-inline-calendar-container").html(res);
							$.ajax({
								type: 'post',
								async:true,
								data: {
									'selected_date': generalObj.rzvy_todate,
									'get_slots': 1
								},
								url: ajax_url + "rzvy_front_ajax.php",
								success: function(resslots) {
									if(resslots.indexOf('rzvy_time_slots_selection')<0){
										$('.rzvy_todate').removeClass('full_day_available');
										$('.rzvy_todate').removeClass('rzvy_date_selection');
										$('.rzvy_todate').addClass('previous_date');
									}	
								}	
							});
						}
					});	
				}
			});
		}
	});
});

/** JS to remove item from cart **/
$(document).on("click", ".rzvy_remove_addon_from_cart", function(){
	var id = $(this).data("id");
	var ajax_url = generalObj.ajax_url;
	
	$('.rzvy-addon-card-multipleqty-unit-selection-'+id).parent().parent().parent().parent().removeClass('selected');
	$('#rzvy-addon-card-singleqty-unit-'+id).parent().parent().parent().parent().removeClass('selected');
	
	var qty = 0;
	$.ajax({
		type: 'post',
		data: {
			'id': id,
			'qty': qty,
			'add_to_cart_item': 1
		},
		url: ajax_url + "rzvy_front_cart_ajax.php",
		success: function (res) {			
			$.ajax({
				type: 'post',
				async:true,
				data: {
					'user': $(".rzvy-user-selection:checked").val(),
					'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
					'payment_method': $(".rzvy-payment-method-check:checked").val(),
					'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
					'refresh_cart_sidebar': 1
				},
				url: ajax_url + "rzvy_front_cart_ajax.php",
				success: function (response) {
					$("#rzvy_refresh_cart").html(response);
					$("#rzvy-addon-card-singleqty-unit-"+id).removeClass("list_active");
					$('.rzvy-addon-card-multipleqty-unit-'+id).val(qty);
					$('.rzvy-addon-card-multipleqty-unit-selection-'+id).removeClass("list_active");
	
					if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
						$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
					}else{
						$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
					}
					if($(".rzvy-partial-deposit-control-input").prop("checked")){
						if(Number($(".rzvy_cart_pd_amount").val())>0){
							$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
						}else{
							$(".rzvy_update_partial_amount").html("0");
						}
						$(".rzvy-cart-partial-deposite-main").show();
					}else{
						$(".rzvy_update_partial_amount").html("0");
						$(".rzvy-cart-partial-deposite-main").hide();
					}
					
					if($(".rzvy-lpoint-control-input").prop("checked")){
						$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
						if(Number($(".rzvy_cart_lp_amount").val())>0){
							$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
						}else{
							$(".rzvy_update_lpoint_amount").html("0");
						}
						$(".rzvy-cart-lpoint-main").slideDown(1000);
					}else{
						$(".rzvy_update_lpoint_count").html("0");
						$(".rzvy_update_lpoint_amount").html("0");
						$(".rzvy-cart-lpoint-main").slideUp(1000);
					}
					rzvy_ov_payment_method_refresh_func();
					/** Calculate addon duration **/
					$.ajax({
						type: 'post',
						data: { 'front_addon_duration': 1 },
						url: ajax_url + "rzvy_front_addon_duration.php",
						success: function (res) {
							$(".slot_refresh_div").html("");
							$(".rzvy_reset_slot_selection").trigger("click");
						}
					});
					
					/** JS to load calendar **/
					$.ajax({
						type: 'post',
						async:true,
						data: {
							'online': "Y",
							'get_calendar_on_load': 1
						},
						url: ajax_url + "rzvy_calendar_ajax.php",
						success: function (res) {
							$(".rzvy-inline-calendar-container").html(res);
							$.ajax({
								type: 'post',
								async:true,
								data: {
									'selected_date': generalObj.rzvy_todate,
									'get_slots': 1
								},
								url: ajax_url + "rzvy_front_ajax.php",
								success: function(resslots) {
									if(resslots.indexOf('rzvy_time_slots_selection')<0){
										$('.rzvy_todate').removeClass('full_day_available');
										$('.rzvy_todate').removeClass('rzvy_date_selection');
										$('.rzvy_todate').addClass('previous_date');
									}	
								}	
							});
						}
					});	
				}
			});
		}
	});
});

/** Show hide card payemnt box JS **/
$(document).on("change", ".rzvy-payment-method-check", function(){
	if($(this).val() == "stripe" || $(this).val() == "2checkout" || $(this).val() == "authorize.net"){
		$(".rzvy-card-detail-box").slideDown(2000);
	}else{
		$(".rzvy-card-detail-box").slideUp(1000);
	}
	if($(this).val() == "bank transfer"){
		$(".rzvy-bank-transfer-detail-box").slideDown(2000);
	}else{
		$(".rzvy-bank-transfer-detail-box").slideUp(1000);
	}
	$("#rzvy_refresh_cart").html("<label>"+langObj.no_items_in_cart+"</label>");
	var ajax_url = generalObj.ajax_url;
	$.ajax({
		type: 'post',
		data: {
			'user': $(".rzvy-user-selection:checked").val(),
			'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
			'payment_method': $(this).val(),
			'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
			'refresh_cart_sidebar': 1
		},
		url: ajax_url + "rzvy_front_cart_ajax.php",
		success: function (response) {
			$("#rzvy_refresh_cart").html(response);
			if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
				$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
			}else{
				$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
			}
			if($(".rzvy-partial-deposit-control-input").prop("checked")){
				if(Number($(".rzvy_cart_pd_amount").val())>0){
					$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
				}else{
					$(".rzvy_update_partial_amount").html("0");
				}
				$(".rzvy-cart-partial-deposite-main").show();
			}else{
				$(".rzvy_update_partial_amount").html("0");
				$(".rzvy-cart-partial-deposite-main").hide();
			}
			
			if($(".rzvy-lpoint-control-input").prop("checked")){
				$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
				if(Number($(".rzvy_cart_lp_amount").val())>0){
					$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
				}else{
					$(".rzvy_update_lpoint_amount").html("0");
				}
				$(".rzvy-cart-lpoint-main").slideDown(1000);
			}else{
				$(".rzvy_update_lpoint_count").html("0");
				$(".rzvy_update_lpoint_amount").html("0");
				$(".rzvy-cart-lpoint-main").slideUp(1000);
			}
		}
	});
});

$(document).on("change", ".rzvy-partial-deposit-control-input", function(){
	$("#rzvy_refresh_cart").html("<label>"+langObj.no_items_in_cart+"</label>");
	var ajax_url = generalObj.ajax_url;
	$.ajax({
		type: 'post',
		async:true,
		data: {
			'user': $(".rzvy-user-selection:checked").val(),
			'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
			'payment_method': $(".rzvy-payment-method-check:checked").val(),
			'is_partial': $(this).prop("checked"),
			'refresh_cart_sidebar': 1
		},
		url: ajax_url + "rzvy_front_cart_ajax.php",
		success: function (response) {
			$("#rzvy_refresh_cart").html(response);
			if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
				$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
			}else{
				$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
			}
			if($(".rzvy-partial-deposit-control-input").prop("checked")){
				if(Number($(".rzvy_cart_pd_amount").val())>0){
					$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
				}else{
					$(".rzvy_update_partial_amount").html("0");
				}
				$(".rzvy-cart-partial-deposite-main").show();
			}else{
				$(".rzvy_update_partial_amount").html("0");
				$(".rzvy-cart-partial-deposite-main").hide();
			}
			
			if($(".rzvy-lpoint-control-input").prop("checked")){
				$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
				if(Number($(".rzvy_cart_lp_amount").val())>0){
					$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
				}else{
					$(".rzvy_update_lpoint_amount").html("0");
				}
				$(".rzvy-cart-lpoint-main").slideDown(1000);
			}else{
				$(".rzvy_update_lpoint_count").html("0");
				$(".rzvy_update_lpoint_amount").html("0");
				$(".rzvy-cart-lpoint-main").slideUp(1000);
			}
			rzvy_ov_payment_method_refresh_func();
		}
	});
});

/** Show hide customer detail box according selection JS **/
$(document).on("change", ".rzvy-user-selection", function(){
	if($(this).attr("id") == "rzvy-new-user"){
		$(".rzvy_referral_code_div").slideDown(2000);
	}else if($(this).attr("id") == "rzvy-guest-user"){
		$("#rzvy_apply_referral_code_btn").trigger("click");
		$(".rzvy_referral_code_div").slideUp(1000);
	}else if($(this).attr("id") == "rzvy-user-forget-password"){
		$("#rzvy_apply_referral_code_btn").trigger("click");
		$(".rzvy_referral_code_div").slideUp(1000);
		$("#rzvy_remove_applied_coupon").trigger("click");
	}else{
		$(".rzvy_referral_code_div").slideDown(2000);
		$("#rzvy_remove_applied_coupon").trigger("click");
	}
	
	var coupon_code = $('#rzvy_coupon_code').val();
	if(coupon_code==undefined || coupon_code==null || coupon_code==''){
		var url_coupon_code = $('#rzvy_url_coupon_code').val();
		if(url_coupon_code!==undefined && url_coupon_code!==null && url_coupon_code!=''){
			var coupon_code = $('#rzvy_coupon_code').val(url_coupon_code);
		}
	}	
	var coupon_code = $('#rzvy_coupon_code').val();
	if(coupon_code!==undefined && coupon_code!==null && coupon_code!=''){
		var ajax_url = generalObj.ajax_url;
		$.ajax({
			type: 'post',
			data: {
				'check_cart_amount': 1
			},
			url: ajax_url + "rzvy_front_ajax.php",
			success: function (ress_cartamount) {
				if(ress_cartamount == "sufficient"){
					var autotrigger = 'Y';
					rzvy_autoapplypromo_urlcallback(autotrigger);
				}
			}
		});		
	}
});

/** JS to mark rating stars **/
function rzvy_add_star_rating(ths,sno){
	for (var i=1;i<=5;i++){
		var cur=document.getElementById("rzvy-sidebar-feedback-star"+i)
		cur.className="fa fa-star-o rzvy-sidebar-feedback-star"
	}

	for (var i=1;i<=sno;i++){
		var cur=document.getElementById("rzvy-sidebar-feedback-star"+i)
		if(cur.className=="fa fa-star-o rzvy-sidebar-feedback-star")
		{
			cur.className="fa fa-star rzvy-sidebar-feedback-star rzvy-sidebar-feedback-star-checked"
		}
	}
	$("#rzvy_fb_rating").val(sno);
}

/** JS to show sub categories according parent category selection **/
$(document).on('click', ".rzvy-pcategories-selection", function(){
	$("#rzvy_refresh_cart").html("<label>"+langObj.no_items_in_cart+"</label>");
	$("#rzvy_categories_html_content").html("");
	$("#rzvy_services_html_content").html("");
	$("#rzvy_multipleqty_addon_html_content").html("");
	$("#rzvy_singleqty_addon_html_content").html("");
	$(".rzvy_hide_calendar_before_staff_selection").hide();
	$(".rzvy_show_hide_sub_categories").hide();
	$(".rzvy_show_hide_services").hide();
	$(".rzvy_show_hide_addons").hide();
	$("#rzvy-staff-main").html("");
	$("#rzvy-staff-main").hide();
	var ajax_url = generalObj.ajax_url;
	var id = $(this).data("id");
	var next_nprid = $(this).data("nprid");
	var curr_nprid = parseInt(next_nprid)-1;
	$(".rzvy-pcategories-selection").removeClass("list_active");
	$(".rzvy-pcategories-selection-pcategories").removeClass("list_active");
	
	if(next_nprid==1){
		$('.rzvy-pc-row-1 .item').each(function(){		
			$(this).parent().removeClass("selected");
			$(this).removeClass("selected");
		});
		$('.rzvy-npc-row').each(function(){		
			$(this).remove();	
		});
	}
	
	$('.rzvy-npc-row').each(function(){
		var rid = $(this).data('rid');
		if(rid>=next_nprid){
			$(this).remove();
		}
		if(rid==curr_nprid){
			/* $(this).find('.item.selected').removeClass('selected');
			$(this).find('.owl-item.selected').removeClass('selected'); */
			$(this).find('.item').parent().removeClass('selected');
		}
	});	
	$("#rzvy-pcategories-selection-"+id).addClass("list_active");
	$(this).parent().parent().parent().addClass('selected');
	$(this).parent().parent().append(rzvy_loader);	
	
	
	$.ajax({
		type: 'post',
		data: {
			'id': id,
			'get_subcat_by_pcid': 1
		},
		url: ajax_url + "rzvy_front_ajax.php",
		success: function (res) {
			$(".rzvy-loader").remove();
			$("#rzvy_categories_html_content").html(res);
			$(".rzvy_show_hide_sub_categories").slideDown(1000);
			$('html, body').animate({
				scrollTop: parseInt($(".rzvy_categories_html_content_scroll").offset().top)
			}, 800);
		}
	});
});

/** JS to show services according category selection **/
$(document).on("click", ".rzvy-categories-radio-change", function(){
	$("#rzvy_refresh_cart").html("<label>"+langObj.no_items_in_cart+"</label>");
	$("#rzvy_services_html_content").html("");
	$("#rzvy_multipleqty_addon_html_content").html("");
	$("#rzvy_singleqty_addon_html_content").html("");
	$(".rzvy_hide_calendar_before_staff_selection").hide();
	$(".rzvy_show_hide_services").hide();
	$(".rzvy_show_hide_addons").hide();
	$("#rzvy-staff-main").html("");
	$("#rzvy-staff-main").hide();
	var ajax_url = generalObj.ajax_url;
	var id = $(this).data("id");
	$(".rzvy-categories-radio-change").removeClass("list_active");
	$("#rzvy-categories-radio-"+id).addClass("list_active");
	$(this).parent().parent().append(rzvy_loader);
	$(".rzvy-categories-radio-change").parent().parent().parent().parent().removeClass('selected');
	$(this).parent().parent().parent().parent().addClass('selected');
	
	$.ajax({
		type: 'post',
		data: {
			'id': id,
			'get_services_by_cat_id': 1
		},
		url: ajax_url + "rzvy_front_ajax.php",
		success: function (res) {
			$(".rzvy-loader").remove();
			$("#rzvy_services_html_content").html(res);
			$(".rzvy_show_hide_services").slideDown(1000);
			
			/** Auto Trigger Service Check **/
			var single_service_status = generalObj.single_service_status;
			if(single_service_status == "Y"){
				if($('.rzvy-services-radio-change').length==1){
					$('.rzvy-services-radio-change').trigger('click');	
					$('.rzvy_show_hide_services').slideUp(1000);
				}else{
					$('.rzvy-services-radio-change.list_active').trigger('click');
					$('.rzvy_show_hide_services').slideDown(1000);
				}
			}
		}
	});
});

/** JS to show addons according services selection **/
$(document).on("click", ".rzvy-services-radio-change", function(){
	$("#rzvy_refresh_cart").html("<label>"+langObj.no_items_in_cart+"</label>");
	$("#rzvy_multipleqty_addon_html_content").html("");
	$("#rzvy_singleqty_addon_html_content").html("");
	$(".rzvy_hide_calendar_before_staff_selection").hide();
	$(".rzvy_show_hide_addons").hide();
	var ajax_url = generalObj.ajax_url;
	var id = $(this).data("id");
	$(".rzvy-services-radio-change").removeClass("list_active");
	$("#rzvy-services-radio-"+id).addClass("list_active");
	$(this).parent().parent().append(rzvy_loader);
	
	/** To get addons **/
	$.ajax({
		type: 'post',
		data: {
			'id': id,
			'get_multi_and_single_qty_addons_content': 1
		},
		url: ajax_url + "rzvy_front_ajax.php",
		success: function (res) {
			$(".rzvy-loader").remove();
			$("#rzvy_multi_and_single_qty_addons_content").html(res);
			/* $(".rzvy_reset_slot_selection").trigger("click"); */
			if($(".rzvy-addon-card-multipleqty-js-counter-value").length>0 || $(".rzvy-addon-card-singleqty-unit-selection").length>0){
				$(".rzvy_show_hide_addons").slideDown(1000);
			}else{
				$(".rzvy_show_hide_addons").hide();
			}
			$(".rzvy_required_multiqty").each(function(){
				var addonid = $(this).data('id');
				$('#rzvy-addon-card-multipleqty-plus-js-counter-btn-'+addonid).trigger('click');
				$('#rzvy-addon-card-multipleqty-minus-js-counter-btn-'+addonid).addClass('rzvy_nc');
			});
			$(".rzvy_required_singleqty").each(function(){
				var addonid = $(this).data('id');
				$(this).trigger('click');
				$(this).addClass('rzvy_nc');
			});
			rzvy_staff_according_service(ajax_url, id);
			$.ajax({
				type: 'post',
				async:true,
				data: {
					'user': $(".rzvy-user-selection:checked").val(),
					'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
					'payment_method': $(".rzvy-payment-method-check:checked").val(),
					'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
					'refresh_cart_sidebar': 1
				},
				url: ajax_url + "rzvy_front_cart_ajax.php",
				success: function (response) {
					$("#rzvy_refresh_cart").html(response);
					if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
						$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
					}else{
						$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
					}
					if($(".rzvy-partial-deposit-control-input").prop("checked")){
						if(Number($(".rzvy_cart_pd_amount").val())>0){
							$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
						}else{
							$(".rzvy_update_partial_amount").html("0");
						}
						$(".rzvy-cart-partial-deposite-main").show();
					}else{
						$(".rzvy_update_partial_amount").html("0");
						$(".rzvy-cart-partial-deposite-main").hide();
					}
					
					if($(".rzvy-lpoint-control-input").prop("checked")){
						$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
						if(Number($(".rzvy_cart_lp_amount").val())>0){
							$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
						}else{
							$(".rzvy_update_lpoint_amount").html("0");
						}
						$(".rzvy-cart-lpoint-main").slideDown(1000);
					}else{
						$(".rzvy_update_lpoint_count").html("0");
						$(".rzvy_update_lpoint_amount").html("0");
						$(".rzvy-cart-lpoint-main").slideUp(1000);
					}
					rzvy_ov_payment_method_refresh_func();
				}
			});
		}
	});
});

/** JS to apply coupons **/
$(document).on("click", "#rzvy_apply_coupon_code_btn", function(){
	var autotrigger = 'N';
	rzvy_autoapplypromo_urlcallback(autotrigger);
});


/** JS to show available coupons **/
$(document).on("click", ".rzvy-coupon-radio", function(){
	var ajax_url = generalObj.ajax_url;
	var id = $(this).val();
	var coupon_code = $(this).data("promo");
	var coupon_user = $('.rzvy-user-selection:checked').val();
	$(".rzvy-available-coupons-list").removeClass("rzvy-coupon-radio-checked");
	$("#rzvy-coupon-radio-"+id).parent().addClass("rzvy-coupon-radio-checked");
	
	$.ajax({
		type: 'post',
		data: {
			'id': id,
			'coupon_user': coupon_user,
			'apply_coupon': 1
		},
		url: ajax_url + "rzvy_front_ajax.php",
		success: function (res) {
			if(res=="available"){
				$("#rzvy-available-coupons-modal").modal("hide");
				$(".rzvy_remove_applied_coupon").attr('data-id', id);				
				$(".rzvy_applied_coupon_badge").html(coupon_code);
				$(".rzvy_remove_applied_coupon").show();
				$(".rzvy_remove_applied_coupon").bind('click');
				$(".rzvy_applied_coupon_div").slideDown(1000);
				swal(langObj.applied_promo_applied_successfully, "", "success");
				$.ajax({
					type: 'post',
					async:true,
					data: {
						'user': $(".rzvy-user-selection:checked").val(),
						'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
						'payment_method': $(".rzvy-payment-method-check:checked").val(),
						'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
						'refresh_cart_sidebar': 1
					},
					url: ajax_url + "rzvy_front_cart_ajax.php",
					success: function (response) {
						$("#rzvy_refresh_cart").html(response);

						if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
							$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
						}else{
							$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
						}
						if($(".rzvy-partial-deposit-control-input").prop("checked")){
							if(Number($(".rzvy_cart_pd_amount").val())>0){
								$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
							}else{
								$(".rzvy_update_partial_amount").html("0");
							}
							$(".rzvy-cart-partial-deposite-main").show();
						}else{
							$(".rzvy_update_partial_amount").html("0");
							$(".rzvy-cart-partial-deposite-main").hide();
						}
						
						if($(".rzvy-lpoint-control-input").prop("checked")){
							$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
							if(Number($(".rzvy_cart_lp_amount").val())>0){
								$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
							}else{
								$(".rzvy_update_lpoint_amount").html("0");
							}
							$(".rzvy-cart-lpoint-main").slideDown(1000);
						}else{
							$(".rzvy_update_lpoint_count").html("0");
							$(".rzvy_update_lpoint_amount").html("0");
							$(".rzvy-cart-lpoint-main").slideUp(1000);
						}
						rzvy_ov_payment_method_refresh_func();
					}
				});
			}else{
				$(".rzvy-coupon-radio").prop("checked", false);
				swal(res, "", "error");
			}
		}
	});
});

/** JS to revert coupon **/
$(document).on("click", ".rzvy_remove_applied_coupon", function(){
	var ajax_url = generalObj.ajax_url;
	var id = $(this).data("id");
	if(id!=""){
		$.ajax({
			type: 'post',
			data: {
				'id': id,
				'remove_applied_coupon': 1
			},
			url: ajax_url + "rzvy_front_ajax.php",
			success: function (res) {
				$('#rzvy_coupon_code').val('');
				$(".rzvy_remove_applied_coupon").attr('data-id', "");
				$(".rzvy_applied_coupon_badge").html('');
				$(".rzvy-available-coupons-list").removeClass("rzvy-coupon-radio-checked");
				$(".rzvy-coupon-radio").prop("checked", false);
				$(".rzvy_remove_applied_coupon").hide();
				$(".rzvy_applied_coupon_div").slideUp(1000);
				$.ajax({
					type: 'post',
					async:true,
					data: {
						'user': $(".rzvy-user-selection:checked").val(),
						'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
						'payment_method': $(".rzvy-payment-method-check:checked").val(),
						'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
						'refresh_cart_sidebar': 1
					},
					url: ajax_url + "rzvy_front_cart_ajax.php",
					success: function (response) {
						$("#rzvy_refresh_cart").html(response);

						if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
							$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
						}else{
							$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
						}
						if($(".rzvy-partial-deposit-control-input").prop("checked")){
							if(Number($(".rzvy_cart_pd_amount").val())>0){
								$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
							}else{
								$(".rzvy_update_partial_amount").html("0");
							}
							$(".rzvy-cart-partial-deposite-main").show();
						}else{
							$(".rzvy_update_partial_amount").html("0");
							$(".rzvy-cart-partial-deposite-main").hide();
						}
						
						if($(".rzvy-lpoint-control-input").prop("checked")){
							$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
							if(Number($(".rzvy_cart_lp_amount").val())>0){
								$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
							}else{
								$(".rzvy_update_lpoint_amount").html("0");
							}
							$(".rzvy-cart-lpoint-main").slideDown(1000);
						}else{
							$(".rzvy_update_lpoint_count").html("0");
							$(".rzvy_update_lpoint_amount").html("0");
							$(".rzvy-cart-lpoint-main").slideUp(1000);
						}
						rzvy_ov_payment_method_refresh_func();
					}
				});
			}
		});
	}
});
/** JS to revert coupon **/
$(document).on("click", ".rzvy_remove_applied_rcoupon", function(){
	var ajax_url = generalObj.ajax_url;
	$.ajax({
		type: 'post',
		data: {
			'remove_applied_rcoupon': 1
		},
		url: ajax_url + "rzvy_front_ajax.php",
		success: function (res) {
			$(".rzvy_applied_referral_coupon_div_text").slideUp(1000);
			$(".rzvy-rcoupon-radio").prop("checked", false);
			$.ajax({
				type: 'post',
				async:true,
				data: {
					'user': $(".rzvy-user-selection:checked").val(),
					'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
					'payment_method': $(".rzvy-payment-method-check:checked").val(),
					'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
					'refresh_cart_sidebar': 1
				},
				url: ajax_url + "rzvy_front_cart_ajax.php",
				success: function (response) {
					$("#rzvy_refresh_cart").html(response);
					if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
						$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
					}else{
						$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
					}
					if($(".rzvy-partial-deposit-control-input").prop("checked")){
						if(Number($(".rzvy_cart_pd_amount").val())>0){
							$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
						}else{
							$(".rzvy_update_partial_amount").html("0");
						}
						$(".rzvy-cart-partial-deposite-main").show();
					}else{
						$(".rzvy_update_partial_amount").html("0");
						$(".rzvy-cart-partial-deposite-main").hide();
					}
					
					if($(".rzvy-lpoint-control-input").prop("checked")){
						$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
						if(Number($(".rzvy_cart_lp_amount").val())>0){
							$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
						}else{
							$(".rzvy_update_lpoint_amount").html("0");
						}
						$(".rzvy-cart-lpoint-main").slideDown(1000);
					}else{
						$(".rzvy_update_lpoint_count").html("0");
						$(".rzvy_update_lpoint_amount").html("0");
						$(".rzvy-cart-lpoint-main").slideUp(1000);
					}
					rzvy_ov_payment_method_refresh_func();
				}
			});
		}
	});
});

/** JS to show available coupons in modal **/
$(document).on("click", "#rzvy-available-coupons-open-modal", function(){
	var ajax_url = generalObj.ajax_url;
	if($("#rzvy-guest-user").prop("checked") || $("#rzvy-user-forget-password").prop("checked")){
		swal(langObj.opps_please_book_your_appointment_as_new_or_existing_customer, "", "error");
	}else{
		$.ajax({
			type: 'post',
			data: {
				'get_available_coupons': 1
			},
			url: ajax_url + "rzvy_front_ajax.php",
			success: function (res) {
				if(res != "none_of_coupons_available"){
					$("#rzvy-available-coupons-open-modal").show();
					$(".rzvy_avail_promo_modal_body").html(res);
					if(is_login_logout_clicked == "Y"){
						is_login_logout_clicked = "N";
					}else{
						$("#rzvy-available-coupons-modal").modal("show");
					}
				}else{
					$("#rzvy-available-coupons-open-modal").hide();
				}
			}
		});
	}
});

/** JS to submit feedback **/
$("#rzvy_submit_feedback_btn").click(function(){
	var ajax_url = generalObj.ajax_url;
	if($('#rzvy_feedback_form').valid()){
		$(this).append(rzvy_loader);
		var name = $("#rzvy_fb_name").val();
		var email = $("#rzvy_fb_email").val();
		var review = $("#rzvy_fb_review").val();
		var rating = $("#rzvy_fb_rating").val();
		
		$.ajax({
			type: 'post',
			data: {
				'email': email,
				'check_feedback_exist': 1
			},
			url: ajax_url + "rzvy_front_ajax.php",
			success: function (res) {
				$(".rzvy-loader").remove();
				if(res=="exist"){
					swal(langObj.oops_your_review_already_exist, "", "error");
				}else{	
					$.ajax({
						type: 'post',
						data: {
							'name': name,
							'email': email,
							'review': review,
							'rating': rating,
							'add_feedback': 1
						},
						url: ajax_url + "rzvy_front_ajax.php",
						success: function (res) {
							
							if(res=="added"){
								swal(langObj.submitted_your_review_submitted_successfully, "", "success");
								location.reload();
							}else{
								swal(langObj.opps_something_went_wrong_please_try_again, "", "error");
							}
							
						}
					});
				}
			}
		});	
	}
});

/** JS to get end time slots **/
$(document).on("click", ".rzvy_time_slots_selection", function(){
	var ajax_url = generalObj.ajax_url;
	var check_endslot_status = generalObj.endslot_status;
	var selected_slot = $(this).val();
	var selected_date = $("#rzvy_time_slots_selection_date").val();
	
	if(selected_slot != "" && selected_date != "" && check_endslot_status == "Y"){
		$.ajax({
			type: 'post',
			data: {
				'selected_date': selected_date,
				'selected_slot': selected_slot,
				'get_endtime_slots': 1
			},
			url: ajax_url + "rzvy_front_ajax.php",
			success: function (res) {
				$("#rzvy_time_slots_selection_starttime").val(selected_slot);
				$(".rzvy_available_slots_block").html(res);
			}
		});
	}else{
		$.ajax({
			type: 'post',
			data: {
				'selected_date': selected_date,
				'selected_startslot': selected_slot,
				'add_selected_slot_withendslot': 1
			},
			url: ajax_url + "rzvy_front_ajax.php",
			success: function (res) {
				$(".rzvy_selected_slot_detail").html(res);
				$(".rzvy_selected_slot_detail").show();
				/* $(".rzvy_back_to_calendar").trigger("click"); */
				$("#rzvy_fdate").val(selected_date);
				$("#rzvy_fstime").val(selected_slot);
				/* $("#rzvy_fetime").val(selected_endslot); */
				$("#rzvy_time_slots_selection_date").val(selected_date);
				$("#rzvy_time_slots_selection_starttime").val(selected_slot);
				/* $("#rzvy_time_slots_selection_endtime").val(selected_endslot); */
				$.ajax({
					type: 'post',
					data: {
						'user': $(".rzvy-user-selection:checked").val(),
						'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
						'payment_method': $(".rzvy-payment-method-check:checked").val(),
						'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
						'refresh_cart_sidebar': 1
					},
					url: ajax_url + "rzvy_front_cart_ajax.php",
					success: function (response) {
						$("#rzvy_refresh_cart").html(response);
						if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
							$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
						}else{
							$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
						}
						if($(".rzvy-partial-deposit-control-input").prop("checked")){
							if(Number($(".rzvy_cart_pd_amount").val())>0){
								$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
							}else{
								$(".rzvy_update_partial_amount").html("0");
							}
							$(".rzvy-cart-partial-deposite-main").show();
						}else{
							$(".rzvy_update_partial_amount").html("0");
							$(".rzvy-cart-partial-deposite-main").hide();
						}
						
						if($(".rzvy-lpoint-control-input").prop("checked")){
							$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
							if(Number($(".rzvy_cart_lp_amount").val())>0){
								$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
							}else{
								$(".rzvy_update_lpoint_amount").html("0");
							}
							$(".rzvy-cart-lpoint-main").slideDown(1000);
						}else{
							$(".rzvy_update_lpoint_count").html("0");
							$(".rzvy_update_lpoint_amount").html("0");
							$(".rzvy-cart-lpoint-main").slideUp(1000);
						}
					}
				});
			}
		});
	}
});

/** JS to add slots **/
$(document).on("click", ".rzvy_endtime_slots_selection", function(){
	var ajax_url = generalObj.ajax_url;
	var selected_endslot = $(this).val();
	var selected_startslot = $("#rzvy_time_slots_selection_starttime").val();
	var selected_date = $("#rzvy_time_slots_selection_date").val();
	if(selected_endslot != "" && selected_startslot != "" && selected_date != ""){
		$.ajax({
			type: 'post',
			data: {
				'selected_date': selected_date,
				'selected_startslot': selected_startslot,
				'selected_endslot': selected_endslot,
				'add_selected_slot': 1
			},
			url: ajax_url + "rzvy_front_ajax.php",
			success: function (res) {
				$(".rzvy_selected_slot_detail").html(res);
				$(".rzvy_selected_slot_detail").show();
				$(".rzvy_back_to_calendar").trigger("click");
				$("#rzvy_fdate").val(selected_date);
				$("#rzvy_fstime").val(selected_startslot);
				$("#rzvy_fetime").val(selected_endslot);
				$("#rzvy_time_slots_selection_date").val(selected_date);
				$("#rzvy_time_slots_selection_starttime").val(selected_startslot);
				$("#rzvy_time_slots_selection_endtime").val(selected_endslot);
				$.ajax({
					type: 'post',
					data: {
						'user': $(".rzvy-user-selection:checked").val(),
						'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
						'payment_method': $(".rzvy-payment-method-check:checked").val(),
						'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
						'refresh_cart_sidebar': 1
					},
					url: ajax_url + "rzvy_front_cart_ajax.php",
					success: function (response) {
						$("#rzvy_refresh_cart").html(response);
						if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
							$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
						}else{
							$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
						}
						if($(".rzvy-partial-deposit-control-input").prop("checked")){
							if(Number($(".rzvy_cart_pd_amount").val())>0){
								$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
							}else{
								$(".rzvy_update_partial_amount").html("0");
							}
							$(".rzvy-cart-partial-deposite-main").show();
						}else{
							$(".rzvy_update_partial_amount").html("0");
							$(".rzvy-cart-partial-deposite-main").hide();
						}
												
						if($(".rzvy-lpoint-control-input").prop("checked")){
							$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
							if(Number($(".rzvy_cart_lp_amount").val())>0){
								$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
							}else{
								$(".rzvy_update_lpoint_amount").html("0");
							}
							$(".rzvy-cart-lpoint-main").slideDown(1000);
						}else{
							$(".rzvy_update_lpoint_count").html("0");
							$(".rzvy_update_lpoint_amount").html("0");
							$(".rzvy-cart-lpoint-main").slideUp(1000);
						}
					}
				});
			}
		});
	}
});

/** JS to make login on frontend **/
$(document).on("click", "#rzvy_login_btn", function(e){
	e.preventDefault();
	var ajax_url = generalObj.ajax_url;
	var email = $("#rzvy_login_email").val();
	var password = $("#rzvy_login_password").val();
	if($("#rzvy_login_form").valid()){
		$(this).append(rzvy_loader);
		$.ajax({
			type: 'post',
			data: {
				'email': email,
				'password': password,
				'front_login': 1
			},
			url: ajax_url + "rzvy_front_ajax.php",
			success: function (res) {
				$(".rzvy-loader").remove();
				var detail = $.parseJSON(res);
				if(detail['status'] == "success"){
					$(".rzvy_loggedin_name").html(detail['email']);
					$("#rzvy_user_email").val(detail['email']);
					$("#rzvy_user_password").val(detail['password']);
					$("#rzvy_user_firstname").val(detail['firstname']);
					$("#rzvy_user_lastname").val(detail['lastname']);
					$("#rzvy_user_zip").val(detail['zip']);
					if(formfieldsObj.en_ff_phone_status == "Y"){
						$("#rzvy_user_phone").intlTelInput("setNumber", detail['phone']);
					}else{
						$("#rzvy_user_phone").val(detail['phone']);
					}
					$("#rzvy_user_address").val(detail['address']);
					$("#rzvy_user_city").val(detail['city']);
					$("#rzvy_user_state").val(detail['state']);
					$("#rzvy_user_country").val(detail['country']);
					$("#rzvy_user_dob").val(detail['dob']);
					
					$("#rzvy-existing-user-box").hide();
					$(".rzvy-users-selection-div").hide();
					$(".rzvy_hide_after_login").hide();
					$(".rzvy-logout-div").show();
					$("#rzvy-new-user-box").show();
					
					$(".rzvy-lpoint-control-input").trigger("click");
					$(".rzvy_remove_applied_coupon").trigger("click");
					$("#rzvy_apply_referral_code_btn").trigger("click");
					$(".rzvy_applied_referral_coupon_code").html("");
					$(".rzvy_applied_referral_coupon_div_text").slideDown(1000);
					$(".rzvy_apply_referral_coupon_div").show();
					is_login_logout_clicked = "Y";
					$("#rzvy-available-coupons-open-modal").trigger("click");
					$(".rzvy-cart-lpoint-div").show();
					
					var dataToggle = 'rzvy-new-user';
					var $dataForm = $('[data-form="'+dataToggle+'"]');
					$dataForm.slideDown();
					$('[data-form]').not($dataForm).slideUp();
					
					$.ajax({
						type: 'post',
						data: {
							'get_available_rcoupons': 1
						},
						url: ajax_url + "rzvy_front_ajax.php",
						success: function (res) {
							if(res != "none_of_coupons_available"){
								$("#rzvy-customer-referral-coupons-container").html(res);
							}else{
								$("#rzvy-customer-referral-coupons-container").html('');
							}
						}
					});					
					
				}else{
					swal(langObj.opps_your_entered_email_not_registered_please_book_an_appointment_as_new_customer, "", "error");
				}
			}
		});
	}
});

/** JS to make logout on frontend **/
$(document).on("click", "#rzvy_logout_btn", function(){
	var ajax_url = generalObj.ajax_url;	
	$(this).append(rzvy_loader);	
	$.ajax({
		type: 'post',
		data: {
			'front_logout': 1
		},
		url: ajax_url + "rzvy_front_ajax.php",
		success: function (res) {
			$(".rzvy-loader").remove();
			$(".rzvy_loggedin_name").html("");
			$("#rzvy_user_email").val("");
			$("#rzvy_user_password").val("");
			$("#rzvy_user_firstname").val("");
			$("#rzvy_user_lastname").val("");
			$("#rzvy_user_zip").val("");
			if(formfieldsObj.en_ff_phone_status == "Y"){
				$("#rzvy_user_phone").intlTelInput("setNumber", "");
			}else{
				$("#rzvy_user_phone").val("");
			}
			$("#rzvy_user_address").val("");
			$("#rzvy_user_city").val("");
			$("#rzvy_user_state").val("");
			$("#rzvy_user_country").val("");
			$("#rzvy_login_email").val("");
			$("#rzvy_login_password").val("");
			$("#rzvy_user_dob").val("");
			
			$("#rzvy-existing-user-box").show();
			$(".rzvy-users-selection-div").show();
			$(".rzvy_hide_after_login").show();
			$(".rzvy-logout-div").hide();
			$("#rzvy-new-user-box").hide();
			
			$(".referralcode_applied_msg").hide();
			
			$(".rzvy-lpoint-control-input").trigger("change");
			$(".rzvy_remove_applied_coupon").trigger("click");
			$("#rzvy_apply_referral_code_btn").trigger("click");
			$(".rzvy_applied_referral_coupon_code").html("");
			$(".rzvy_applied_referral_coupon_div_text").slideUp(1000);
			$(".rzvy_apply_referral_coupon_div").show();
			is_login_logout_clicked = "Y";
			$("#rzvy-available-coupons-open-modal").trigger("click");
			$(".rzvy-cart-lpoint-div").hide();
			$("#rzvy-customer-referral-coupons-container").html('');
			
			var dataToggle = 'rzvy-existing-user';
			var $dataForm = $('[data-form="'+dataToggle+'"]');
			$dataForm.slideDown();
			$('[data-form]').not($dataForm).slideUp();
		}
	});
});

$(document).on("focusout", "#rzvy_guest_email", function(){
	$("#rzvy_apply_referral_code_btn").trigger("click");
});
$(document).on("focusout", "#rzvy_user_email", function(){
	$("#rzvy_apply_referral_code_btn").trigger("click");
});
/** JS to apply referral code on frontend **/
$(document).on("click", "#rzvy_apply_referral_code_btn", function(){
	var ajax_url = generalObj.ajax_url;
	var referral_code = $("#rzvy_referral_code").val().toUpperCase();
	var email = $("#rzvy_user_email").val();
	var gemail = $("#rzvy_guest_email").val();
	
	$(".referralcode_applied_msg").hide();
	
	if(referral_code==undefined || referral_code==null || referral_code==''){
		$('#rzvy_referral_code').addClass('error'); 
		$('#rzvy-referral-empty-error').removeClass('d-none'); 
		return false;
	}
	
	if(referral_code.length==8){
		$(this).append(rzvy_loader);	
		$('#rzvy_referral_code').removeClass('error'); 
		$('#rzvy-referral-empty-error').addClass('d-none'); 
		if((email != "" && ($(".rzvy-user-selection:checked").val() == "ec" || $(".rzvy-user-selection:checked").val() == "nc"))/*  || (gemail != "" && $(".rzvy-user-selection:checked").val() == "gc") */){
			$.ajax({
				type: 'post',
				data: {
					'email': email,
					'gemail': "", /* gemail */
					'user': $(".rzvy-user-selection:checked").val(),
					'referral_code': referral_code,
					'apply_referral_code': 1
				},
				url: ajax_url + "rzvy_front_ajax.php",
				success: function (res) {
					$(".rzvy-loader").remove();
					if(res == "applied"){
						$(".rzvy_referral_code_div").hide();
						$(".rzvy_referral_code_applied_div").show();
						$(".rzvy_referral_code_applied_text").html(referral_code);
						swal(langObj.referral_code_applied_successfully, "", "success");						
					}else if(res == "owncode"){
						$(".rzvy_referral_code_div").show();
						$(".rzvy_referral_code_applied_div").hide();
						$(".rzvy_referral_code_applied_text").html("");
						swal(langObj.you_cannot_use_your_own_referral_code, "", "error");
						$(".referralcode_applied_msg").show();
						$(".referralcode_applied_msg").html(langObj.you_cannot_use_your_own_referral_code);
					}else if(res == "onfirstbookingonly"){
						$(".rzvy_referral_code_div").show();
						$(".rzvy_referral_code_applied_div").hide();
						$(".rzvy_referral_code_applied_text").html("");
						swal(langObj.you_can_apply_referral_code_only_on_first_booking, "", "error");
						$(".referralcode_applied_msg").show();
						$(".referralcode_applied_msg").html(langObj.you_can_apply_referral_code_only_on_first_booking);
					}else if(res == "notexist"){
						$(".rzvy_referral_code_div").show();
						$(".rzvy_referral_code_applied_div").hide();
						$(".rzvy_referral_code_applied_text").html("");
						swal(langObj.opps_youve_entered_incorrect_referral_code, "", "error");
					}else{
						$(".rzvy_referral_code_div").show();
						$(".rzvy_referral_code_applied_div").hide();
						$(".rzvy_referral_code_applied_text").html("");
						swal(langObj.opps_something_went_wrong_please_try_again, "", "error");
					}
					
					$("#rzvy_refresh_cart").html("<label>"+langObj.no_items_in_cart+"</label>");
					$.ajax({
						type: 'post',
						async:true,
						data: {
							'user': $(".rzvy-user-selection:checked").val(),
							'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
							'payment_method': $(".rzvy-payment-method-check:checked").val(),
							'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
							'refresh_cart_sidebar': 1
						},
						url: ajax_url + "rzvy_front_cart_ajax.php",
						success: function (response) {
							$("#rzvy_refresh_cart").html(response);
							if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
								$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
							}else{
								$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
							}
							if($(".rzvy-partial-deposit-control-input").prop("checked")){
								if(Number($(".rzvy_cart_pd_amount").val())>0){
									$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
								}else{
									$(".rzvy_update_partial_amount").html("0");
								}
								$(".rzvy-cart-partial-deposite-main").show();
							}else{
								$(".rzvy_update_partial_amount").html("0");
								$(".rzvy-cart-partial-deposite-main").hide();
							}
							
							if($(".rzvy-lpoint-control-input").prop("checked")){
								$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
								if(Number($(".rzvy_cart_lp_amount").val())>0){
									$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
								}else{
									$(".rzvy_update_lpoint_amount").html("0");
								}
								$(".rzvy-cart-lpoint-main").slideDown(1000);
							}else{
								$(".rzvy_update_lpoint_count").html("0");
								$(".rzvy_update_lpoint_amount").html("0");
								$(".rzvy-cart-lpoint-main").slideUp(1000);
							}
							rzvy_ov_payment_method_refresh_func();
						}
					});
				}
			});
		}else{
			$.ajax({
				type: 'post',
				data: {
					'remove_referral_code': 1
				},
				url: ajax_url + "rzvy_front_ajax.php",
				success: function (res) {
					$(".rzvy-loader").remove();
					/* $(".rzvy_referral_code_div").show(); */
					$(".rzvy_referral_code_applied_div").hide();
					$(".rzvy_referral_code_applied_text").html("");
					swal(langObj.please_register_or_login_to_use_referral_code_feature, "", "error");

					$("#rzvy_refresh_cart").html("<label>"+langObj.no_items_in_cart+"</label>");
					$.ajax({
						type: 'post',
						async:true,
						data: {
							'user': $(".rzvy-user-selection:checked").val(),
							'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
							'payment_method': $(".rzvy-payment-method-check:checked").val(),
							'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
							'refresh_cart_sidebar': 1
						},
						url: ajax_url + "rzvy_front_cart_ajax.php",
						success: function (response) {
							$("#rzvy_refresh_cart").html(response);
							if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
								$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
							}else{
								$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
							}
							if($(".rzvy-partial-deposit-control-input").prop("checked")){
								if(Number($(".rzvy_cart_pd_amount").val())>0){
									$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
								}else{
									$(".rzvy_update_partial_amount").html("0");
								}
								$(".rzvy-cart-partial-deposite-main").show();
							}else{
								$(".rzvy_update_partial_amount").html("0");
								$(".rzvy-cart-partial-deposite-main").hide();
							}
							
							if($(".rzvy-lpoint-control-input").prop("checked")){
								$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
								if(Number($(".rzvy_cart_lp_amount").val())>0){
									$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
								}else{
									$(".rzvy_update_lpoint_amount").html("0");
								}
								$(".rzvy-cart-lpoint-main").slideDown(1000);
							}else{
								$(".rzvy_update_lpoint_count").html("0");
								$(".rzvy_update_lpoint_amount").html("0");
								$(".rzvy-cart-lpoint-main").slideUp(1000);
							}
							rzvy_ov_payment_method_refresh_func();
						}
					});
				}
			});
		}
	}else if(referral_code.length>1){
		$('#rzvy_referral_code').removeClass('error'); 
		$('#rzvy-referral-empty-error').addClass('d-none'); 
		swal(langObj.please_enter_8_characters_long_referral_code, "", "error");
	}
});

/** JS to trigger counter on click of multiple qty box **/
$(document).on("click", ".rzvy_make_multipleqty_addon_card_selected", function(){
	var id = $(this).data("id");
	if($(".rzvy-addon-card-multipleqty-unit-"+id).val()==0){
		$("#rzvy-addon-card-multipleqty-plus-js-counter-btn-"+id).trigger("click");
	} else if($(".rzvy-addon-card-multipleqty-unit-"+id).val()==1){
		$("#rzvy-addon-card-multipleqty-minus-js-counter-btn-"+id).trigger("click");
	} else if($(".rzvy-addon-card-multipleqty-unit-"+id).val()==$("#rzvy-addon-card-mnl-"+id).val()){
		$("#rzvy-addon-card-multipleqty-minus-js-counter-btn-"+id).trigger("click");
	} else if($(".rzvy-addon-card-multipleqty-unit-"+id).val()>=$("#rzvy-addon-card-mnl-"+id).val()){
		$(".rzvy-addon-card-multipleqty-unit-"+id).val("1");
		$("#rzvy-addon-card-multipleqty-minus-js-counter-btn-"+id).trigger("click");
	} else {
		/** do nothing **/
	}
});

/** validate date **/
function rzvy_isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if(!dateString.match(regEx)) return false;  /** Invalid format **/
  var d = new Date(dateString);
  if(Number.isNaN(d.getTime())) return false; /** Invalid date **/
  return d.toISOString().slice(0,10) === dateString;
}

/** JS to book an appointment **/
$(document).on("click", "#rzvy_book_appointment_btn", function(){
	var ajax_url = generalObj.ajax_url;
	var ty_page = generalObj.ty_link;
	$(".rzvy_main_loader").removeClass("rzvy_hide_loader");
	$("#rzvy-tc-concent").removeClass("is-invalid");
	$(this).append(rzvy_loader);
	if($(".rzvy-user-selection:checked").val() == "ec" || $(".rzvy-user-selection:checked").val() == "nc" || $(".rzvy-user-selection:checked").val() == "gc"){
		/** Check for location **/
		$.ajax({
			type: 'post',
			data: {
				'check_cart_amount': 1
			},
			url: ajax_url + "rzvy_front_ajax.php",
			success: function (ress_cartamount) {
				if(ress_cartamount == "sufficient"){
					var location_zipcode = "";
					if($(".rzvy-user-selection:checked").val() == "ec" || $(".rzvy-user-selection:checked").val() == "nc"){
						location_zipcode = $("#rzvy_user_zip").val();
					}else if($(".rzvy-user-selection:checked").val() == "gc"){
						location_zipcode = $("#rzvy_guest_zip").val();
					}
					if(location_zipcode != ""){
						$.ajax({
							type: 'post',
							data: {
								'final_check': 1,
								'zipcode': location_zipcode,
								'check_zip_location': 1
							},
							url: ajax_url + "rzvy_location_selector_ajax.php",
							success: function (res) {
								if(res=="addintocart"){
									$(".rzvy-loader").remove();
									if($(".rzvy-pcategory-container").is(':visible') && !$(".rzvy-pcategory-container").is(':hidden')){							
										$('html, body').animate({
											scrollTop: parseInt($(".rzvy-pcategory-container").offset().top)
										}, 800);
									}else if($(".rzvy_categories_html_content").is(':visible') && !$(".rzvy_categories_html_content").is(':hidden')){	
										$('html, body').animate({
											scrollTop: parseInt($(".rzvy_categories_html_content_scroll").offset().top)
										}, 800);
									}else if($(".rzvy_show_hide_services").is(':visible') && !$(".rzvy_show_hide_services").is(':hidden')){	
										$('html, body').animate({
											scrollTop: parseInt($(".rzvy_show_hide_services").offset().top)
										}, 800);
									}
									$(".rzvy_main_loader").addClass("rzvy_hide_loader");
									swal(langObj.please_add_item_in_your_cart, "", "error");
								}else if(res=="choosedatetime" && generalObj.book_with_datetime == "Y"){
									$(".rzvy-loader").remove();
									if($(".rzvy_hide_calendar_before_staff_selection").is(':visible') && !$(".rzvy_hide_calendar_before_staff_selection").is(':hidden')){
										$('html, body').animate({
											scrollTop: parseInt($(".rzvy_hide_calendar_before_staff_selection").offset().top)
										}, 800);
									}
									$(".rzvy_main_loader").addClass("rzvy_hide_loader");
									swal(langObj.please_select_appointment_slot, "", "error");
								}else if(res=="alreadybooked"){
									$(".rzvy-loader").remove();
									if($(".rzvy_hide_calendar_before_staff_selection").is(':visible') && !$(".rzvy_hide_calendar_before_staff_selection").is(':hidden')){
										$('html, body').animate({
											scrollTop: parseInt($(".rzvy_hide_calendar_before_staff_selection").offset().top)
										}, 800);
									}
									$(".rzvy_main_loader").addClass("rzvy_hide_loader");
									swal(langObj.please_select_another_appointment_slot, "", "error");
								}else if(res!="available"){
									$(".rzvy-loader").remove();
									$(".rzvy_main_loader").addClass("rzvy_hide_loader");
									swal(langObj.opps_we_are_not_available_at_your_location, "", "error");
									$("#rzvy-location-selector-modal").modal("show");
								}else{
									
									/*** Booking code START ***/
									/* if($(".rzvy-categories-radio-change:checked").val() === undefined && generalObj.booking_first_selection_as == "category"){ */
									if(!(Number($(".rzvy-pcategories-selection.list_active").data("id"))>0) && generalObj.booking_first_selection_as == "category" && $(".rzvy-pcategory-container").is(':visible') && !$(".rzvy-pcategory-container").is(':hidden')){
										$(".rzvy-loader").remove();
										if($(".rzvy-pcategory-container").is(':visible') && !$(".rzvy-pcategory-container").is(':hidden')){							
											$('html, body').animate({
												scrollTop: parseInt($(".rzvy-pcategory-container").offset().top)
											}, 800);
										}
										$(".rzvy_main_loader").addClass("rzvy_hide_loader");
										swal(langObj.please_add_item_in_your_cart, "", "error");
									}else if(!(Number($(".rzvy-categories-radio-change.list_active").data("id"))>0) && generalObj.booking_first_selection_as == "category"){
										$(".rzvy-loader").remove();
										if($(".rzvy_categories_html_content").is(':visible') && !$(".rzvy_categories_html_content").is(':hidden')){							
											$('html, body').animate({
												scrollTop: parseInt($(".rzvy_categories_html_content_scroll").offset().top)
											}, 800);
										}
										$(".rzvy_main_loader").addClass("rzvy_hide_loader");
										swal(langObj.please_add_item_in_your_cart, "", "error");
									}else if(!(Number($(".rzvy-services-radio-change.list_active").data("id"))>0)){
										$(".rzvy-loader").remove();
										if($(".rzvy_show_hide_services").is(':visible') && !$(".rzvy_show_hide_services").is(':hidden')){							
											$('html, body').animate({
												scrollTop: parseInt($(".rzvy_show_hide_services").offset().top)
											}, 800);
										}
										$(".rzvy_main_loader").addClass("rzvy_hide_loader");
										swal(langObj.please_add_item_in_your_cart, "", "error");
									}else{
										if($("#rzvy_fdate").val() == "" && generalObj.book_with_datetime == "Y"){
											$(".rzvy-loader").remove();
											if($(".rzvy_hide_calendar_before_staff_selection").is(':visible') && !$(".rzvy_hide_calendar_before_staff_selection").is(':hidden')){
												$('html, body').animate({
													scrollTop: parseInt($(".rzvy_hide_calendar_before_staff_selection").offset().top)
												}, 800);
											}
											$(".rzvy_main_loader").addClass("rzvy_hide_loader");
											swal(langObj.please_select_appointment_slot, "", "error");
										/* }else if($(".rzvy-staff-change:checked").val() === undefined || $(".rzvy-staff-change:checked").val()<=0 || $(".rzvy-staff-change:checked").val() == ""){
											swal(langObj.please_select_staff_member, "", "error"); */
										}else{
											if($("#rzvy_fstime").val() == "" && generalObj.book_with_datetime == "Y"){
												$(".rzvy-loader").remove();
												if($(".rzvy_hide_calendar_before_staff_selection").is(':visible') && !$(".rzvy_hide_calendar_before_staff_selection").is(':hidden')){
													$('html, body').animate({
														scrollTop: parseInt($(".rzvy_hide_calendar_before_staff_selection").offset().top)
													}, 800);
												}
												$(".rzvy_main_loader").addClass("rzvy_hide_loader");
												swal(langObj.please_select_appointment_slot, "", "error");
											}else if($("#rzvy_fetime").val() == "" && generalObj.endslot_status == "Y" && generalObj.book_with_datetime == "Y"){
												$(".rzvy-loader").remove();
												if($(".rzvy_hide_calendar_before_staff_selection").is(':visible') && !$(".rzvy_hide_calendar_before_staff_selection").is(':hidden')){
													$('html, body').animate({
														scrollTop: parseInt($(".rzvy_hide_calendar_before_staff_selection").offset().top)
													}, 800);
												}
												$(".rzvy_main_loader").addClass("rzvy_hide_loader");
												swal(langObj.please_select_appointment_slot, "", "error");
											}else{
												var user_selection = $(".rzvy-user-selection:checked").val();
												if(user_selection == "ec"){
													if($("#rzvy_login_btn").is(":visible")){
														$(".rzvy-loader").remove();
														$("#rzvy_login_btn").trigger("click");
														$(".rzvy_main_loader").addClass("rzvy_hide_loader");
														swal(langObj.please_login_to_book_an_appointment, "", "error");
													}else{
														if(!$("#rzvy_user_detail_form").valid()){
															$(".rzvy-loader").remove();
															if($("#rzvy_user_detail_form").is(':visible') && !$("#rzvy_user_detail_form").is(':hidden')){
																$('html, body').animate({
																	scrollTop: parseInt($("#rzvy_user_detail_form").offset().top)
																}, 800);
															}
															$(".rzvy_main_loader").addClass("rzvy_hide_loader");
														}
														if($("#rzvy_user_detail_form").valid()){
															if($(".rzvy-tc-control-input").prop("checked")){
																
																/** book existing customer appointment **/
																var email = $("#rzvy_user_email").val();
																var password = $("#rzvy_user_password").val();
																var firstname = $("#rzvy_user_firstname").val();
																var lastname = $("#rzvy_user_lastname").val();
																var zip = $("#rzvy_user_zip").val();
																if(formfieldsObj.en_ff_phone_status == "Y"){
																	var phone = $("#rzvy_user_phone").intlTelInput("getNumber");
																}else{
																	var phone = $("#rzvy_user_phone").val();
																}
																var address = $("#rzvy_user_address").val();
																var city = $("#rzvy_user_city").val();
																var state = $("#rzvy_user_state").val();
																var country = $("#rzvy_user_country").val();
																var dob = $("#rzvy_user_dob").val();
																var notes = $("#rzvy_user_notes").val();
																var image = $("#rzvy_user_image_url").val();
																var payment_method = $(".rzvy-payment-method-check:checked").val();
																									
																if(payment_method == "paypal"){
																	rzvy_paypal_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, dob, notes, image);
																}else if(payment_method == "billplz"){
																	rzvy_billplz_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, dob, notes, image);
																}else if(payment_method == "razorpay"){
																rzvy_razorpay_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, dob, notes, image);
																}else if(payment_method == "stripe"){
																	var stripe_pkey = generalObj.stripe_pkey;
																	if(stripe_pkey != ""){
																		rzvy_stripe.createToken(rzvy_stripe_plan_card).then(function(result) {
																			if (result.error) {
																				$(".rzvy-loader").remove();
																				/* Inform the user if there was an error. */
																				$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																				$("#rzvy_stripe_plan_card_errors").html(result.error.message);
																			} else {
																				/* Send the token via ajax */
																				var token = result.token.id;
																				rzvy_stripe_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, token, dob, notes, image);
																			}
																		});
																	}else{
																		$(".rzvy-loader").remove();
																		$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																		swal(langObj.opps, langObj.please_contact_business_admin_to_set_payment_accounts_credentials, "error");
																	}
																}else if(payment_method == "authorize.net"){
																	var cardnumber = $("#rzvy-cardnumber").val();
																	var cardcvv = $("#rzvy-cardcvv").val();
																	var cardexmonth = $("#rzvy-cardexmonth").val();
																	var cardexyear = $("#rzvy-cardexyear").val();
																	var cardholdername = $("#rzvy-cardholdername").val();
																	
																	var cdetail_valid = $.payment.validateCardNumber(cardnumber);
																	if (!cdetail_valid) {
																		$(".rzvy-loader").remove();
																		$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																		swal(langObj.opps_your_card_number_is_not_valid, "", "error");
																		return false;
																	}else{
																		var ymdetail_valid = $.payment.validateCardExpiry(cardexmonth, cardexyear);
																		if (!ymdetail_valid) {
																			$(".rzvy-loader").remove();
																			$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																			swal(langObj.opps_your_card_expiry_is_not_valid, "", "error");
																			return false;
																		}else{
																			var cvvdetail_valid = $.payment.validateCardCVC(cardcvv);
																			if (!cvvdetail_valid) {
																				$(".rzvy-loader").remove();
																				$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																				swal(langObj.opps_your_cvv_is_not_valid, "", "error");
																				return false;
																			}else{
																				if(cardholdername == ""){
																					$(".rzvy-loader").remove();
																					$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																					swal(langObj.please_enter_card_holder_name, "", "error");
																					return false;
																				}
																			}
																		}
																	}
																	cardnumber = cardnumber.replace(/\s+/g, '');
																	
																	rzvy_authorizenet_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, cardnumber, cardcvv, cardexmonth, cardexyear, cardholdername, dob, notes, image);
																
																}else if(payment_method == "2checkout"){
																	
																	var cardnumber = $("#rzvy-cardnumber").val();
																	var cardcvv = $("#rzvy-cardcvv").val();
																	var cardexmonth = $("#rzvy-cardexmonth").val();
																	var cardexyear = $("#rzvy-cardexyear").val();
																	var cardholdername = $("#rzvy-cardholdername").val();
																	
																	var cdetail_valid = $.payment.validateCardNumber(cardnumber);
																	if (!cdetail_valid) {
																		$(".rzvy-loader").remove();
																		$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																		swal(langObj.opps_your_card_number_is_not_valid, "", "error");
																		return false;
																	}else{
																		var ymdetail_valid = $.payment.validateCardExpiry(cardexmonth, cardexyear);
																		if (!ymdetail_valid) {
																			$(".rzvy-loader").remove();
																			$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																			swal(langObj.opps_your_card_expiry_is_not_valid, "", "error");
																			return false;
																		}else{
																			var cvvdetail_valid = $.payment.validateCardCVC(cardcvv);
																			if (!cvvdetail_valid) {
																				$(".rzvy-loader").remove();
																				$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																				swal(langObj.opps_your_cvv_is_not_valid, "", "error");
																				return false;
																			}else{
																				if(cardholdername == ""){
																					$(".rzvy-loader").remove();
																					$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																					swal(langObj.please_enter_card_holder_name, "", "error");
																					return false;
																				}
																			}
																		}
																	}
																	cardnumber = cardnumber.replace(/\s+/g, '');
																	
																	var twocheckout_sid = generalObj.twocheckout_sid;
																	var twocheckout_pkey = generalObj.twocheckout_pkey;
																	/*  Called when token created successfully. */
																	function successCallback(data) {
																		/* Set the token as the value for the token input */
																		var token = data.response.token.token;
																		rzvy_2checkout_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, token, dob, notes, image);
																	};

																	/*  Called when token creation fails. */
																	function errorCallback(data) {
																		if (data.errorCode === 200) {
																			$(".rzvy-loader").remove();
																			$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																			tokenRequest();
																		} else {
																			$(".rzvy-loader").remove();
																			$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																			swal(data.errorMsg, "", "error");
																		}
																	};

																	function tokenRequest() {
																		/* Setup token request arguments */
																		var args = {
																			sellerId: twocheckout_sid,
																			publishableKey: twocheckout_pkey,
																			ccNo: $("#rzvy-cardnumber").val(),
																			cvv: $("#rzvy-cardcvv").val(),
																			expMonth: $("#rzvy-cardexmonth").val(),
																			expYear: $("#rzvy-cardexyear").val()
																		};
																		/* Make the token request */
																		TCO.requestToken(successCallback, errorCallback, args);
																	};

																	tokenRequest();
																}else if(payment_method == "bank transfer"){
																	rzvy_pay_at_venue_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, dob, notes, image);
																}else if(payment_method == "pay-at-venue"){
																	payment_method = "pay-at-venue";
																	rzvy_pay_at_venue_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, dob, notes, image);
																}else{
																	$(".rzvy-loader").remove();							
																	swal(langObj.oops_error_occurred_please_try_again, "", "error");
																}
															}else{
																$(".rzvy-loader").remove();
																$("#rzvy-tc-concent").addClass("is-invalid");
																$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																swal(langObj.please_accept_our_terms_conditions, "", "error");
															}
														}
													}
												} else if(user_selection == "nc"){
													if(!$("#rzvy_user_detail_form").valid()){
														$(".rzvy-loader").remove();
														if($("#rzvy_user_detail_form").is(':visible') && !$("#rzvy_user_detail_form").is(':hidden')){
															$('html, body').animate({
																scrollTop: parseInt($("#rzvy_user_detail_form").offset().top)
															}, 800);
														}
														$(".rzvy_main_loader").addClass("rzvy_hide_loader");
													}
													if($("#rzvy_user_detail_form").valid()){
														if($(".rzvy-tc-control-input").prop("checked")){
															/** book new customer appointment **/
															var email = $("#rzvy_user_email").val();
															var password = $("#rzvy_user_password").val();
															var firstname = $("#rzvy_user_firstname").val();
															var lastname = $("#rzvy_user_lastname").val();
															var zip = $("#rzvy_user_zip").val();
															if(formfieldsObj.en_ff_phone_status == "Y"){
																var phone = $("#rzvy_user_phone").intlTelInput("getNumber");
															}else{
																var phone = $("#rzvy_user_phone").val();
															}
															var address = $("#rzvy_user_address").val();
															var city = $("#rzvy_user_city").val();
															var state = $("#rzvy_user_state").val();
															var country = $("#rzvy_user_country").val();
															var dob = $("#rzvy_user_dob").val();
															var notes = $("#rzvy_user_notes").val();
															var image = $("#rzvy_user_image_url").val();
															var payment_method = $(".rzvy-payment-method-check:checked").val();
															
															if(payment_method == "paypal"){
																rzvy_paypal_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, dob, notes, image);
															}else if(payment_method == "billplz"){
																rzvy_billplz_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, dob, notes, image);
															}else if(payment_method == "razorpay"){
																rzvy_razorpay_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, dob, notes, image);
															}else if(payment_method == "stripe"){
																var stripe_pkey = generalObj.stripe_pkey;
																if(stripe_pkey != ""){
																	rzvy_stripe.createToken(rzvy_stripe_plan_card).then(function(result) {
																		if (result.error) {
																			$(".rzvy-loader").remove();
																			$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																			$("#rzvy_stripe_plan_card_errors").html(result.error.message);
																		} else {
																			/* Send the token via ajax */
																			var token = result.token.id;
																			rzvy_stripe_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, token, dob, notes, image);
																		}
																	});
																}else{
																	$(".rzvy-loader").remove();
																	$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																	swal(langObj.opps, langObj.please_contact_business_admin_to_set_payment_accounts_credentials, "error");
																}
															}else if(payment_method == "authorize.net"){
																var cardnumber = $("#rzvy-cardnumber").val();
																var cardcvv = $("#rzvy-cardcvv").val();
																var cardexmonth = $("#rzvy-cardexmonth").val();
																var cardexyear = $("#rzvy-cardexyear").val();
																var cardholdername = $("#rzvy-cardholdername").val();
																
																var cdetail_valid = $.payment.validateCardNumber(cardnumber);
																if (!cdetail_valid) {
																	$(".rzvy-loader").remove();
																	$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																	swal(langObj.opps_your_card_number_is_not_valid, "", "error");
																	return false;
																}else{
																	var ymdetail_valid = $.payment.validateCardExpiry(cardexmonth, cardexyear);
																	if (!ymdetail_valid) {
																		$(".rzvy-loader").remove();
																		$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																		swal(langObj.opps_your_card_expiry_is_not_valid, "", "error");
																		return false;
																	}else{
																		var cvvdetail_valid = $.payment.validateCardCVC(cardcvv);
																		if (!cvvdetail_valid) {
																			$(".rzvy-loader").remove();
																			$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																			swal(langObj.opps_your_cvv_is_not_valid, "", "error");
																			return false;
																		}else{
																			if(cardholdername == ""){
																				$(".rzvy-loader").remove();
																				$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																				swal(langObj.please_enter_card_holder_name, "", "error");
																				return false;
																			}
																		}
																	}
																}
																cardnumber = cardnumber.replace(/\s+/g, '');
																
																rzvy_authorizenet_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, cardnumber, cardcvv, cardexmonth, cardexyear, cardholdername, dob, notes, image);
															}else if(payment_method == "2checkout"){
																
																var cardnumber = $("#rzvy-cardnumber").val();
																var cardcvv = $("#rzvy-cardcvv").val();
																var cardexmonth = $("#rzvy-cardexmonth").val();
																var cardexyear = $("#rzvy-cardexyear").val();
																var cardholdername = $("#rzvy-cardholdername").val();
																
																var cdetail_valid = $.payment.validateCardNumber(cardnumber);
																if (!cdetail_valid) {
																	$(".rzvy-loader").remove();
																	$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																	swal(langObj.opps_your_card_number_is_not_valid, "", "error");
																	return false;
																}else{
																	var ymdetail_valid = $.payment.validateCardExpiry(cardexmonth, cardexyear);
																	if (!ymdetail_valid) {
																		$(".rzvy-loader").remove();
																		$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																		swal(langObj.opps_your_card_expiry_is_not_valid, "", "error");
																		return false;
																	}else{
																		var cvvdetail_valid = $.payment.validateCardCVC(cardcvv);
																		if (!cvvdetail_valid) {
																			$(".rzvy-loader").remove();
																			$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																			swal(langObj.opps_your_cvv_is_not_valid, "", "error");
																			return false;
																		}else{
																			if(cardholdername == ""){
																				$(".rzvy-loader").remove();
																				$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																				swal(langObj.please_enter_card_holder_name, "", "error");
																				return false;
																			}
																		}
																	}
																}
																cardnumber = cardnumber.replace(/\s+/g, '');
																
																var twocheckout_sid = generalObj.twocheckout_sid;
																var twocheckout_pkey = generalObj.twocheckout_pkey;
																/*  Called when token created successfully. */
																function successCallback(data) {
																	/* Set the token as the value for the token input */
																	var token = data.response.token.token;
																	rzvy_2checkout_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, token, dob, notes, image);
																};

																/*  Called when token creation fails. */
																function errorCallback(data) {
																	if (data.errorCode === 200) {
																		$(".rzvy-loader").remove();
																		$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																		tokenRequest();
																	} else {
																		$(".rzvy-loader").remove();
																		$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																		swal(data.errorMsg, "", "error");
																	}
																};

																function tokenRequest() {
																	/* Setup token request arguments */
																	var args = {
																		sellerId: twocheckout_sid,
																		publishableKey: twocheckout_pkey,
																		ccNo: $("#rzvy-cardnumber").val(),
																		cvv: $("#rzvy-cardcvv").val(),
																		expMonth: $("#rzvy-cardexmonth").val(),
																		expYear: $("#rzvy-cardexyear").val()
																	};
																	/* Make the token request */
																	TCO.requestToken(successCallback, errorCallback, args);
																};

																tokenRequest();
															}else if(payment_method == "bank transfer"){
																rzvy_pay_at_venue_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, dob, notes, image);
															}else if(payment_method == "pay-at-venue"){
																payment_method = "pay-at-venue";
																rzvy_pay_at_venue_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, dob, notes, image);
															}else{
																$(".rzvy-loader").remove();							
																swal(langObj.oops_error_occurred_please_try_again, "", "error");
															}
														}else{
															$(".rzvy-loader").remove();
															$("#rzvy-tc-concent").addClass("is-invalid");
															$(".rzvy_main_loader").addClass("rzvy_hide_loader");
															swal(langObj.please_accept_our_terms_conditions, "", "error");
														}
													}
												} else if(user_selection == "gc"){
													if(!$("#rzvy_guestuser_detail_form").valid()){
														$(".rzvy-loader").remove();
														if($("#rzvy_guestuser_detail_form").is(':visible') && !$("#rzvy_guestuser_detail_form").is(':hidden')){
															$('html, body').animate({
																scrollTop: parseInt($("#rzvy_guestuser_detail_form").offset().top)
															}, 800);
														}
														$(".rzvy_main_loader").addClass("rzvy_hide_loader");
													}
													if($("#rzvy_guestuser_detail_form").valid()){
														if($(".rzvy-tc-control-input").prop("checked")){
															/** book guest customer appointment **/
															var email = $("#rzvy_guest_email").val();
															var password = "";
															var firstname = $("#rzvy_guest_firstname").val();
															var lastname = $("#rzvy_guest_lastname").val();
															var zip = $("#rzvy_guest_zip").val();
															if(formfieldsObj.g_ff_phone_status == "Y"){
																var phone = $("#rzvy_guest_phone").intlTelInput("getNumber");
															}else{
																var phone = $("#rzvy_guest_phone").val();
															}
															var address = $("#rzvy_guest_address").val();
															var city = $("#rzvy_guest_city").val();
															var state = $("#rzvy_guest_state").val();
															var country = $("#rzvy_guest_country").val();
															var dob = $("#rzvy_guest_dob").val();
															var notes = $("#rzvy_guest_notes").val();
															var image = $("#rzvy_guest_image_url").val();
															var payment_method = $(".rzvy-payment-method-check:checked").val();

															if(payment_method == "paypal"){
																rzvy_paypal_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, dob, notes, image);
															}else if(payment_method == "billplz"){
																rzvy_billplz_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, dob, notes, image);
															}else if(payment_method == "razorpay"){
																rzvy_razorpay_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, dob, notes, image);
															}else if(payment_method == "stripe"){
																var stripe_pkey = generalObj.stripe_pkey;
																if(stripe_pkey != ""){
																	rzvy_stripe.createToken(rzvy_stripe_plan_card).then(function(result) {
																		if (result.error) {
																			$(".rzvy-loader").remove();
																			$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																			$("#rzvy_stripe_plan_card_errors").html(result.error.message);
																		} else {
																			/* Send the token via ajax */
																			var token = result.token.id;
																			rzvy_stripe_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, token, dob, notes, image);
																		}
																	});
																}else{
																	$(".rzvy-loader").remove();
																	$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																	swal(langObj.opps, langObj.please_contact_business_admin_to_set_payment_accounts_credentials, "error");
																}
															}else if(payment_method == "authorize.net"){
																var cardnumber = $("#rzvy-cardnumber").val();
																var cardcvv = $("#rzvy-cardcvv").val();
																var cardexmonth = $("#rzvy-cardexmonth").val();
																var cardexyear = $("#rzvy-cardexyear").val();
																var cardholdername = $("#rzvy-cardholdername").val();
																
																var cdetail_valid = $.payment.validateCardNumber(cardnumber);
																if (!cdetail_valid) {
																	$(".rzvy-loader").remove();
																	$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																	swal(langObj.opps_your_card_number_is_not_valid, "", "error");
																	return false;
																}else{
																	var ymdetail_valid = $.payment.validateCardExpiry(cardexmonth, cardexyear);
																	if (!ymdetail_valid) {
																		$(".rzvy-loader").remove();
																		$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																		swal(langObj.opps_your_card_expiry_is_not_valid, "", "error");
																		return false;
																	}else{
																		var cvvdetail_valid = $.payment.validateCardCVC(cardcvv);
																		if (!cvvdetail_valid) {
																			$(".rzvy-loader").remove();
																			$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																			swal(langObj.opps_your_cvv_is_not_valid, "", "error");
																			return false;
																		}else{
																			if(cardholdername == ""){
																				$(".rzvy-loader").remove();
																				$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																				swal(langObj.please_enter_card_holder_name, "", "error");
																				return false;
																			}
																		}
																	}
																}
																cardnumber = cardnumber.replace(/\s+/g, '');
																
																rzvy_authorizenet_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, cardnumber, cardcvv, cardexmonth, cardexyear, cardholdername, dob, notes, image);

															}else if(payment_method == "2checkout"){
																
																var cardnumber = $("#rzvy-cardnumber").val();
																var cardcvv = $("#rzvy-cardcvv").val();
																var cardexmonth = $("#rzvy-cardexmonth").val();
																var cardexyear = $("#rzvy-cardexyear").val();
																var cardholdername = $("#rzvy-cardholdername").val();
																
																var cdetail_valid = $.payment.validateCardNumber(cardnumber);
																if (!cdetail_valid) {
																	$(".rzvy-loader").remove();
																	$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																	swal(langObj.opps_your_card_number_is_not_valid, "", "error");
																	return false;
																}else{
																	var ymdetail_valid = $.payment.validateCardExpiry(cardexmonth, cardexyear);
																	if (!ymdetail_valid) {
																		$(".rzvy-loader").remove();
																		$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																		swal(langObj.opps_your_card_expiry_is_not_valid, "", "error");
																		return false;
																	}else{
																		var cvvdetail_valid = $.payment.validateCardCVC(cardcvv);
																		if (!cvvdetail_valid) {
																			$(".rzvy-loader").remove();
																			$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																			swal(langObj.opps_your_cvv_is_not_valid, "", "error");
																			return false;
																		}else{
																			if(cardholdername == ""){
																				$(".rzvy-loader").remove();
																				$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																				swal(langObj.please_enter_card_holder_name, "", "error");
																				return false;
																			}
																		}
																	}
																}
																cardnumber = cardnumber.replace(/\s+/g, '');
																
																var twocheckout_sid = generalObj.twocheckout_sid;
																var twocheckout_pkey = generalObj.twocheckout_pkey;
																/*  Called when token created successfully. */
																function successCallback(data) {
																	/* Set the token as the value for the token input */
																	var token = data.response.token.token;
																	rzvy_2checkout_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, token, dob, notes, image);
																};

																/*  Called when token creation fails. */
																function errorCallback(data) {
																	if (data.errorCode === 200) {
																		$(".rzvy-loader").remove();
																		$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																		tokenRequest();
																	} else {
																		$(".rzvy-loader").remove();
																		$(".rzvy_main_loader").addClass("rzvy_hide_loader");
																		swal(data.errorMsg, "", "error");
																	}
																};

																function tokenRequest() {
																	/* Setup token request arguments */
																	var args = {
																		sellerId: twocheckout_sid,
																		publishableKey: twocheckout_pkey,
																		ccNo: $("#rzvy-cardnumber").val(),
																		cvv: $("#rzvy-cardcvv").val(),
																		expMonth: $("#rzvy-cardexmonth").val(),
																		expYear: $("#rzvy-cardexyear").val()
																	};
																	/* Make the token request */
																	TCO.requestToken(successCallback, errorCallback, args);
																};

																tokenRequest();
															}else if(payment_method == "bank transfer"){
																rzvy_pay_at_venue_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, dob, notes, image);
															}else if(payment_method == "pay-at-venue"){
																payment_method = "pay-at-venue";
																rzvy_pay_at_venue_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, dob, notes, image);
															}else{
																$(".rzvy-loader").remove();							
																swal(langObj.oops_error_occurred_please_try_again, "", "error");
															}
														}else{
															$(".rzvy-loader").remove();
															$("#rzvy-tc-concent").addClass("is-invalid");
															$(".rzvy_main_loader").addClass("rzvy_hide_loader");
															swal(langObj.please_accept_our_terms_conditions, "", "error");
														}
													}
												}
											}
										}
									}
									/*** Booking code END ***/
								}
							}
						});
					}else{
						$(".rzvy-loader").remove();
						$(".rzvy_main_loader").addClass("rzvy_hide_loader");
						swal(langObj.opps_please_check_for_services_available_at_your_location_or_not, "", "error");
						$("#rzvy-location-selector-modal").modal("show");
						return false;
					}
				}else{
					$(".rzvy-loader").remove();
					$(".rzvy_main_loader").addClass("rzvy_hide_loader");
					swal(langObj.opps_minimum_cart_value_should_be+" "+ress_cartamount+". "+langObj.please_add_more_item_into_cart, "", "error");
					return false;
				}
			}
		});
	}else{
		$(".rzvy-loader").remove();
		$(".rzvy_main_loader").addClass("rzvy_hide_loader");
		swal(langObj.please_login_to_book_an_appointment, "", "error");
	}
});
function rzvy_pay_at_venue_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, dob, notes, image){
	$(".rzvy_main_loader").removeClass("rzvy_hide_loader");
	$.ajax({
		type: 'post',
		data: {
			'email': email,
			'password': password,
			'firstname': firstname,
			'lastname': lastname,
			'zip': zip,
			'phone': phone,
			'address': address,
			'city': city,
			'state': state,
			'country': country,
			'dob': dob,
			'notes': notes,
			'image': image,
			'payment_method': payment_method,
			'type': user_selection,
			'pay_at_venue_appointment': 1
		},
		url: ajax_url + "rzvy_front_checkout_ajax.php",
		success: function (response) {
			$(".rzvy-loader").remove();
			if(response.indexOf("BOOKED")>=0){
				$(".rzvy_main_loader").addClass("rzvy_hide_loader");
				var responseinfo = response.split('###');
			swal({
					title: "<h4 style='margin-top:10px;line-height:45px;'>"+langObj.thankyou_booking_complete+"<h4>",
					type: 'success',
					text: responseinfo[1],
					html: true,
					showCancelButton: false,
					closeOnConfirm: false,
					confirmButtonText: langObj.finish,
					cancelButtonText: 'Cancel',
				}, function (bookingdone) {
					$('html, body').animate({
						scrollTop: parseInt($(".rzvy-wizard").offset().top)
					}, 800);
					window.location.href = ty_page;
				});
			}			
		}
	});
}
function rzvy_paypal_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, dob, notes, image){
	$(".rzvy_main_loader").removeClass("rzvy_hide_loader");
	$.ajax({
		type: 'post',
		data: {
			'email': email,
			'password': password,
			'firstname': firstname,
			'lastname': lastname,
			'zip': zip,
			'phone': phone,
			'address': address,
			'city': city,
			'state': state,
			'country': country,
			'dob': dob,
			'notes': notes,
			'image': image,
			'payment_method': payment_method,
			'type': user_selection,
			'paypal_appointment': 1
		},
		url: ajax_url + "rzvy_front_checkout_ajax.php",
		success: function (res) { 
			$(".rzvy-loader").remove();
			var response_detail = $.parseJSON(res);
			if(response_detail.status=='success'){
				window.location.href = response_detail.value; 
			}
			if(response_detail.status=='error'){
				$(".rzvy_main_loader").addClass("rzvy_hide_loader");
				swal(response_detail.value, "", "error");
			}
		}
	});
}
function rzvy_authorizenet_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, cardnumber, cardcvv, cardexmonth, cardexyear, cardholdername, dob, notes, image){
	$(".rzvy_main_loader").removeClass("rzvy_hide_loader");
	$.ajax({
		type: 'post',
		data: {
			'email': email,
			'password': password,
			'firstname': firstname,
			'lastname': lastname,
			'zip': zip,
			'phone': phone,
			'address': address,
			'city': city,
			'state': state,
			'country': country,
			'dob': dob,
			'notes': notes,
			'image': image,
			'payment_method': payment_method,
			'type': user_selection,
			'cardnumber': cardnumber,
			'cardcvv': cardcvv,
			'cardexmonth': cardexmonth,
			'cardexyear': cardexyear,
			'cardholdername': cardholdername,
			'authorizenet_appointment': 1
		},
		url: ajax_url + "rzvy_front_checkout_ajax.php",
		success: function (res) { 
			$(".rzvy-loader").remove();
			var response_detail = $.parseJSON(res);
			if(response_detail.status==false){
				$(".rzvy_main_loader").addClass("rzvy_hide_loader");
				swal(response_detail.error, "", "error");
			} else {
				 $.ajax({
					type: "POST",
					url: ajax_url + "rzvy_front_appt_process_ajax.php",
					success:function(response){
						if(response.indexOf("BOOKED")>=0){
							$(".rzvy_main_loader").addClass("rzvy_hide_loader");
							var responseinfo = response.split('###');
						swal({
								title: "<h4 style='margin-top:10px;line-height:45px;'>"+langObj.thankyou_booking_complete+"<h4>",
								type: 'success',
								text: responseinfo[1],
								html: true,
								showCancelButton: false,
								closeOnConfirm: false,
								confirmButtonText: langObj.finish,
								cancelButtonText: 'Cancel',
							}, function (bookingdone) {
								$('html, body').animate({
									scrollTop: parseInt($(".rzvy-wizard").offset().top)
								}, 800);
								window.location.href = ty_page;
							});
						}
					}
				});
			}
		}
	});
}
function rzvy_2checkout_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, token, dob, notes, image){
	$(".rzvy_main_loader").removeClass("rzvy_hide_loader");
	$.ajax({
		type: 'post',
		data: {
			'email': email,
			'password': password,
			'firstname': firstname,
			'lastname': lastname,
			'zip': zip,
			'phone': phone,
			'address': address,
			'city': city,
			'state': state,
			'country': country,
			'dob': dob,
			'notes': notes,
			'image': image,
			'payment_method': payment_method,
			'type': user_selection,
			'token': token,
			'2checkout_appointment': 1
		},
		url: ajax_url + "rzvy_front_checkout_ajax.php",
		success: function (res) { 
			$(".rzvy-loader").remove();
			var response_detail = $.parseJSON(res);
			if(response_detail.status==false){
				$(".rzvy_main_loader").addClass("rzvy_hide_loader");
				swal(response_detail.error, "", "error");
			} else {
				 $.ajax({
					type: "POST",
					url: ajax_url + "rzvy_front_appt_process_ajax.php",
					success:function(response){
						if(response.indexOf("BOOKED")>=0){
							$(".rzvy_main_loader").addClass("rzvy_hide_loader");
							var responseinfo = response.split('###');
						swal({
								title: "<h4 style='margin-top:10px;line-height:45px;'>"+langObj.thankyou_booking_complete+"<h4>",
								type: 'success',
								text: responseinfo[1],
								html: true,
								showCancelButton: false,
								closeOnConfirm: false,
								confirmButtonText: langObj.finish,
								cancelButtonText: 'Cancel',
							}, function (bookingdone) {
								$('html, body').animate({
									scrollTop: parseInt($(".rzvy-wizard").offset().top)
								}, 800);
								window.location.href = ty_page;
							});
						}
					}
				});
			}
		}
	});
}
function rzvy_stripe_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, token, dob, notes, image){
	$(".rzvy_main_loader").removeClass("rzvy_hide_loader");
	$.ajax({
		type: 'post',
		data: {
			'email': email,
			'password': password,
			'firstname': firstname,
			'lastname': lastname,
			'zip': zip,
			'phone': phone,
			'address': address,
			'city': city,
			'state': state,
			'country': country,
			'dob': dob,
			'notes': notes,
			'image': image,
			'payment_method': payment_method,
			'type': user_selection,
			'token': token,
			'stripe_appointment': 1
		},
		url: ajax_url + "rzvy_front_checkout_ajax.php",
		success: function (res) { 
			$(".rzvy-loader").remove();
			var response_detail = $.parseJSON(res);
			if(response_detail.status==false){
				$(".rzvy_main_loader").addClass("rzvy_hide_loader");
				swal(response_detail.error, "", "error");
			} else {
				 $.ajax({
					type: "POST",
					url: ajax_url + "rzvy_front_appt_process_ajax.php",
					success:function(response){
						if(response.indexOf("BOOKED")>=0){
							$(".rzvy_main_loader").addClass("rzvy_hide_loader");
							var responseinfo = response.split('###');
						swal({
								title: "<h4 style='margin-top:10px;line-height:45px;'>"+langObj.thankyou_booking_complete+"<h4>",
								type: 'success',
								text: responseinfo[1],
								html: true,
								showCancelButton: false,
								closeOnConfirm: false,
								confirmButtonText: langObj.finish,
								cancelButtonText: 'Cancel',
							}, function (bookingdone) {
								$('html, body').animate({
									scrollTop: parseInt($(".rzvy-wizard").offset().top)
								}, 800);
								window.location.href = ty_page;
							});
						}
					}
				});
			}
		}
	});
}
function rzvy_billplz_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, dob, notes, image){
	$(".rzvy_main_loader").removeClass("rzvy_hide_loader");
	$.ajax({
		type: 'post',
		data: {
			'email': email,
			'password': password,
			'firstname': firstname,
			'lastname': lastname,
			'zip': zip,
			'phone': phone,
			'address': address,
			'city': city,
			'state': state,
			'country': country,
			'dob': dob,
			'notes': notes,
			'image': image,
			'payment_method': payment_method,
			'type': user_selection,
			'billplz_appointment': 1
		},
		url: ajax_url + "rzvy_front_checkout_ajax.php",
		success: function (res) { 
			$(".rzvy-loader").remove();
			var response_detail = $.parseJSON(res);
			if(response_detail.status=='success'){
				window.location.href = response_detail.value; 
			}
			if(response_detail.status=='error'){
				$(".rzvy_main_loader").addClass("rzvy_hide_loader");
				swal(response_detail.value, "", "error");
			}
		}
	});
}

function rzvy_razorpay_appointment(email, password, firstname, lastname, zip, phone, address, city, state, country, payment_method, user_selection, ajax_url, ty_page, dob, notes, image){
	$(".rzvy_main_loader").removeClass("rzvy_hide_loader");
	$.ajax({
		type: 'post',
		data: {
			'email': email,
			'password': password,
			'firstname': firstname,
			'lastname': lastname,
			'zip': zip,
			'phone': phone,
			'address': address,
			'city': city,
			'state': state,
			'country': country,
			'dob': dob,
			'notes': notes,
			'image': image,
			'payment_method': payment_method,
			'type': user_selection,
			'razorpay_appointment': 1
		},
		url: ajax_url + "rzvy_front_checkout_ajax.php",
		success: function (res) { 
			$(".rzvy-loader").remove();
			var response_detail = $.parseJSON(res);
			if(response_detail.status=='success'){
				window.location.href = response_detail.value; 
			}
			if(response_detail.status=='error'){
				$(".rzvy_main_loader").addClass("rzvy_hide_loader");
				swal(response_detail.value, "", "error");
			}
		}
	});
}
/** swal to apply referral discount coupon **/
$(document).on("click", "#rzvy_apply_referral_coupon", function(){
	var ajax_url = generalObj.ajax_url;
	if($(".rzvy-user-selection:checked").val() == "ec"){
		if($("#rzvy_login_btn").is(":visible")){
			$("#rzvy_login_btn").trigger("click");
			swal(langObj.please_login_to_apply_referral_discount_coupon, "", "error");
		}else{
			var ref_discount_coupon = $("#rzvy_referral_discount_coupon_code").val();
			if(ref_discount_coupon != ""){
				$(this).append(rzvy_loader);
				ref_discount_coupon = ref_discount_coupon.toUpperCase();
				$.ajax({
					type: 'post',
					data: {
						'ref_discount_coupon': ref_discount_coupon,
						'apply_referral_discount': 1
					},
					url: ajax_url + "rzvy_front_ajax.php",
					success: function (res) {
						$(".rzvy-loader").remove();
						if(res == "notexist"){
							$(".rzvy_applied_referral_coupon_code").html("");
							$(".rzvy_applied_referral_coupon_div_text").slideUp(1000);
							$(".rzvy_apply_referral_coupon_div").show();
							swal(langObj.please_enter_valid_referral_discount_coupon, "", "error");
						}else if(res == "used"){
							$(".rzvy_applied_referral_coupon_code").html("");
							$(".rzvy_applied_referral_coupon_div_text").slideUp(1000);
							$(".rzvy_apply_referral_coupon_div").show();
							swal(langObj.referral_discount_coupon_already_used, "", "error");
						}else if(res == "applied"){
							$(".rzvy_applied_referral_coupon_code").html(ref_discount_coupon);
							$(".rzvy_applied_referral_coupon_div_text").slideDown(1000);
							$(".rzvy_apply_referral_coupon_div").hide();
							swal(langObj.applied_referral_discount_coupon_applied_successfully, "", "success");
							$.ajax({
								type: 'post',
								async:true,
								data: {
									'user': $(".rzvy-user-selection:checked").val(),
									'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
									'payment_method': $(".rzvy-payment-method-check:checked").val(),
									'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
									'refresh_cart_sidebar': 1
								},
								url: ajax_url + "rzvy_front_cart_ajax.php",
								success: function (response) {
									$("#rzvy_refresh_cart").html(response);
									/* if($(".rzvy_cart_items_list li").length>0){
										$(".rzvy-frequently-discount-change").prop('checked', false);
									} */
									if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
										$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
									}else{
										$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
									}
									if($(".rzvy-partial-deposit-control-input").prop("checked")){
										if(Number($(".rzvy_cart_pd_amount").val())>0){
											$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
										}else{
											$(".rzvy_update_partial_amount").html("0");
										}
										$(".rzvy-cart-partial-deposite-main").show();
									}else{
										$(".rzvy_update_partial_amount").html("0");
										$(".rzvy-cart-partial-deposite-main").hide();
									}
									
									if($(".rzvy-lpoint-control-input").prop("checked")){
										$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
										if(Number($(".rzvy_cart_lp_amount").val())>0){
											$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
										}else{
											$(".rzvy_update_lpoint_amount").html("0");
										}
										$(".rzvy-cart-lpoint-main").slideDown(1000);
									}else{
										$(".rzvy_update_lpoint_count").html("0");
										$(".rzvy_update_lpoint_amount").html("0");
										$(".rzvy-cart-lpoint-main").slideUp(1000);
									}
									rzvy_ov_payment_method_refresh_func();
								}
							});
						}else {
							$(".rzvy_applied_referral_coupon_code").html("");
							$(".rzvy_applied_referral_coupon_div_text").slideUp(1000);
							$(".rzvy_apply_referral_coupon_div").show();
							swal(langObj.opps_something_went_wrong_please_try_again, "", "error");
						}
					}
				});
			}else{
				swal(langObj.please_enter_referral_discount_coupon_code, "", "error");
			}
		}
	}else{
		swal(langObj.please_login_to_apply_referral_discount_coupon, "", "error");
	}
});

/** Get available slots JS **/
$(document).on("click", ".rzvy_date_selection", function(){
	var selected_date = $(this).data("day");
	if (selected_date.length>0) {
		$(".rzvy_available_slots_block").html("");
		var ajax_url = generalObj.ajax_url;
		$(".rzvy_date_selection").removeClass("active_selected_date");
		$(this).addClass("active_selected_date");
		$.ajax({
			type: 'post',
			data: {
				'selected_date': selected_date,
				'get_slots': 1
			},
			url: ajax_url + "rzvy_front_ajax.php",
			success: function (res) {
				$("#rzvy_time_slots_selection_date").val(selected_date);
				$(".rzvy-inline-calendar-container-main").slideUp(1000);
				$(".rzvy_available_slots_block").html(res);
				$(".rzvy_available_slots_block").slideDown(1000);
			}
		});
	}
});

/** Reset available slots JS **/
$(document).on("click", ".rzvy_reset_slot_selection", function(){
	var selected_date = $(this).data("day");
	if (selected_date.length>0) {
		$(".rzvy_reset_slot_selection i").addClass("fa-spin");
		var ajax_url = generalObj.ajax_url;
		$.ajax({
			type: 'post',
			data: {
				'selected_date': selected_date,
				'get_slots': 1
			},
			url: ajax_url + "rzvy_front_ajax.php",
			success: function (res) {
				$(".rzvy_available_slots_block").show();
				$(".rzvy_available_slots_block").html(res);
			}
		});
	}
});

/** Get available slots JS **/
$(document).on("click", ".rzvy_back_to_calendar", function(){
	$(".rzvy-inline-calendar-container-main").slideDown(1000);
	$(".rzvy_available_slots_block").slideUp(1000);
});

$(document).on("click", ".rzvy_cal_prev_month, .rzvy_cal_next_month", function(){
	var ajax_url = generalObj.ajax_url;
	var selected_month = $(this).data("month");
	if(generalObj.book_with_datetime == "Y"){
		$.ajax({
			type: 'post',
			data: {
				'online': "Y",
				'selected_month': selected_month,
				'get_calendar_on_next_prev': 1
			},
			url: ajax_url + "rzvy_calendar_ajax.php",
			success: function (res) {
				$(".rzvy-inline-calendar-container").html(res);
				$.ajax({
					type: 'post',
					data: {
						'selected_date': generalObj.rzvy_todate,
						'get_slots': 1
					},
					url: ajax_url + "rzvy_front_ajax.php",
					success: function(resslots) {
						if(resslots.indexOf('rzvy_time_slots_selection')<0){
							$('.rzvy_todate').removeClass('full_day_available');
							$('.rzvy_todate').removeClass('rzvy_date_selection');
							$('.rzvy_todate').addClass('previous_date');
						}	
					}	
				});	
			}
		});
	}
});

/** Check location JS **/
$(document).on('click', '#rzvy_location_check_btn', function(){
	var ajaxurl = generalObj.ajax_url;
	var siteurl = generalObj.site_url;
	var zipcode = $("#rzvy_ls_input_keyword").val();
	
	if(zipcode != "" && zipcode !== null){
			$(this).append(rzvy_loader);
			$(".rzvy_main_loader").removeClass("rzvy_hide_loader");
			$.ajax({
				type: 'post',
				data: {
					'zipcode': zipcode,
					'check_zip_location': 1
				},
				url: ajaxurl + "rzvy_location_selector_ajax.php",
				success: function (res) {
					$(".rzvy-loader").remove();
					$(".rzvy_main_loader").addClass("rzvy_hide_loader");
					var precateid = generalObj.precateid;
					if(precateid==0){
						$('.rzvy-categories-radio-change').trigger('click'); 
					}
					if(res=="available"){
						$("#rzvy_user_zip").val(zipcode);
						$("#rzvy_guest_zip").val(zipcode);
						swal(langObj.available_our_service_available_at_your_location, "", "success");
						$("#rzvy-location-selector-modal").modal("hide");
					}else{
						swal(langObj.opps_we_are_not_available_at_your_location, "", "error");
					}
				}
			});
	}else{
		swal(langObj.please_enter_valid_zipcode, "", "error");
	}
});

/** Set selected language JS **/
$(document).on('change', '#rzvy_langauges', function(){
	var ajaxurl = generalObj.ajax_url;
	var lang = $(this).val();
	$(".rzvy_main_loader").removeClass("rzvy_hide_loader");
	$.ajax({
		type: 'post',
		data: {
			'lang': lang,
			'set_selected_language': 1
		},
		url: ajaxurl + "rzvy_front_ajax.php",
		success: function (res) {
			location.reload();
		}
	});
});
/** Staff according service */
function rzvy_staff_according_service(ajax_url, id){
	$.ajax({
		type: 'post',
		data: {
			'id': id,
			'get_staff_according_service': 1
		},
		url: ajax_url + "rzvy_front_ajax.php",
		success: function (res) {
			$("#rzvy-staff-main").show();
			$("#rzvy-staff-main").html(res);
			if($(".rzvy-staff-change").length==1 && generalObj.single_staff_showhide_status != "Y"){
				$(".rzvy_hide_calendar_before_staff_selection").show();
				$(".rzvy-staff-change").trigger("click", true);
				$("#rzvy-staff-main").hide();
			}else if($(".rzvy-staff-change").length==1 && generalObj.single_staff_showhide_status == "Y"){
				$(".rzvy_hide_calendar_before_staff_selection").show();
				$(".rzvy-staff-change").trigger("click", true);
				$("#rzvy-staff-main").show();
			}else if($(".rzvy-staff-change").length==0){
				$(".rzvy_hide_calendar_before_staff_selection").show();
				$("#rzvy-staff-main").hide();
				if(generalObj.book_with_datetime == "Y"){
					/** JS to load calendar **/
					$.ajax({
						type: 'post',
						data: {
							'online': "Y",
							'get_calendar_on_load': 1
						},
						url: ajax_url + "rzvy_calendar_ajax.php",
						success: function (res) {
							$(".rzvy-inline-calendar-container").html(res);
							$.ajax({
								type: 'post',
								data: {
									'selected_date': generalObj.rzvy_todate,
									'get_slots': 1
								},
								url: ajax_url + "rzvy_front_ajax.php",
								success: function(resslots) {
									if(resslots.indexOf('rzvy_time_slots_selection')<0){
										$('.rzvy_todate').removeClass('full_day_available');
										$('.rzvy_todate').removeClass('rzvy_date_selection');
										$('.rzvy_todate').addClass('previous_date');
									}	
								}	
							});	
							
							
							$(".rzvy_selected_slot_detail").html("");
							$(".rzvy_selected_slot_detail").hide();
							$("#rzvy_fdate").val("");
							$("#rzvy_fstime").val("");
							$("#rzvy_time_slots_selection_date").val("");
							$("#rzvy_time_slots_selection_starttime").val("");
							$(".rzvy_hide_calendar_before_staff_selection").show();
							$.ajax({
								type: 'post',
								data: {
									'user': $(".rzvy-user-selection:checked").val(),
									'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
									'payment_method': $(".rzvy-payment-method-check:checked").val(),
									'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
									'refresh_cart_sidebar': 1
								},
								url: ajax_url + "rzvy_front_cart_ajax.php",
								success: function (response) {
									$("#rzvy_refresh_cart").html(response);
									if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
										$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
									}else{
										$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
									}
									if($(".rzvy-partial-deposit-control-input").prop("checked")){
										if(Number($(".rzvy_cart_pd_amount").val())>0){
											$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
										}else{
											$(".rzvy_update_partial_amount").html("0");
										}
										$(".rzvy-cart-partial-deposite-main").show();
									}else{
										$(".rzvy_update_partial_amount").html("0");
										$(".rzvy-cart-partial-deposite-main").hide();
									}
									
									if($(".rzvy-lpoint-control-input").prop("checked")){
										$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
										if(Number($(".rzvy_cart_lp_amount").val())>0){
											$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
										}else{
											$(".rzvy_update_lpoint_amount").html("0");
										}
										$(".rzvy-cart-lpoint-main").slideDown(1000);
									}else{
										$(".rzvy_update_lpoint_count").html("0");
										$(".rzvy_update_lpoint_amount").html("0");
										$(".rzvy-cart-lpoint-main").slideUp(1000);
									}
								}
							});
						}
					});
				}
			}else{}
		}
	});
}

/** JS to set staff on service selection **/
$(document).on("click", ".rzvy-staff-change", function(event, is_trigger_clicked = false){
	var ajax_url = generalObj.ajax_url;
	var id = $(this).data("id");
	$(".rzvy-staff-change").removeClass("staff_active");
	$("#rzvy-staff-change-id-"+id).addClass("staff_active");
	$('#rzvy-staff-main .owl-stage-outer .owl-item').each(function(){
		$(this).removeClass('selected');
	});  
	$('.rzvy-staff-change-tt').each(function(){
		$(this).removeClass('selected');
	});  
	if(id=='today' || id=='tomorrow'){
		$(this).toggleClass('selected');
		var staff_ids = [];
		$(".rzvy-staff-change").each(function(){
			var staffid = $(this).data("id");
			if(staffid!='today' && staffid!='tomorrow'){
				staff_ids.push(staffid);
			}
		});
		var seldate = $(this).data("sdate");
		$("#rzvy_time_slots_selection_date").val(seldate);
		$(this).append(rzvy_loader);
	
		$.ajax({
			type: 'post',
			data: {
				'staff_ids':staff_ids,
				'slots_of':id,
				'get_slots_any_staff': 1
			},
			url: ajax_url + "rzvy_front_ajax.php",
			success: function(resanyslots){
				$(".rzvy-loader").remove();
				$(".rzvy_hide_calendar_before_staff_selection").show();
				$(".rzvy-inline-calendar-container").html(resanyslots);
				
			}	
		});	
		return false;
	}
	$(this).parent().parent().parent().parent().toggleClass('selected');
	if(is_trigger_clicked){
		var dataset = {
			'id': id,
			'set_staff_according_service': 1
		}
	}else{
		var dataset = {
			'id': id,
			'set_staff_according_service_manual': 1,
			'set_staff_according_service': 1
		}
	}
	$(this).parent().parent().append(rzvy_loader);
	
	$.ajax({
		type: 'post',
		data: dataset,
		url: ajax_url + "rzvy_front_ajax.php",
		success: function (res) {
			$(".rzvy-loader").remove();
			if(generalObj.book_with_datetime == "Y"){
				/** JS to load calendar **/
				$.ajax({
					type: 'post',
					data: {
						'online': "Y",
						'get_calendar_on_load': 1
					},
					url: ajax_url + "rzvy_calendar_ajax.php",
					success: function (res) {
						$(".rzvy-inline-calendar-container").html(res);
						$.ajax({
							type: 'post',
							data: {
								'selected_date': generalObj.rzvy_todate,
								'get_slots': 1
							},
							url: ajax_url + "rzvy_front_ajax.php",
							success: function(resslots) {
								if(resslots.indexOf('rzvy_time_slots_selection')<0){
									$('.rzvy_todate').removeClass('full_day_available');
									$('.rzvy_todate').removeClass('rzvy_date_selection');
									$('.rzvy_todate').addClass('previous_date');
								}	
							}	
						});	
						$(".rzvy_selected_slot_detail").html("");
						$(".rzvy_selected_slot_detail").hide();
						$("#rzvy_fdate").val("");
						$("#rzvy_fstime").val("");
						$("#rzvy_time_slots_selection_date").val("");
						$("#rzvy_time_slots_selection_starttime").val("");
						$(".rzvy_hide_calendar_before_staff_selection").show();
						$.ajax({
							type: 'post',
							data: {
								'user': $(".rzvy-user-selection:checked").val(),
								'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
								'payment_method': $(".rzvy-payment-method-check:checked").val(),
								'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
								'refresh_cart_sidebar': 1
							},
							url: ajax_url + "rzvy_front_cart_ajax.php",
							success: function (response) {
								$("#rzvy_refresh_cart").html(response);
								if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
									$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
								}else{
									$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
								}
								if($(".rzvy-partial-deposit-control-input").prop("checked")){
									if(Number($(".rzvy_cart_pd_amount").val())>0){
										$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
									}else{
										$(".rzvy_update_partial_amount").html("0");
									}
									$(".rzvy-cart-partial-deposite-main").show();
								}else{
									$(".rzvy_update_partial_amount").html("0");
									$(".rzvy-cart-partial-deposite-main").hide();
								}
								
								if($(".rzvy-lpoint-control-input").prop("checked")){
									$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
									if(Number($(".rzvy_cart_lp_amount").val())>0){
										$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
									}else{
										$(".rzvy_update_lpoint_amount").html("0");
									}
									$(".rzvy-cart-lpoint-main").slideDown(1000);
								}else{
									$(".rzvy_update_lpoint_count").html("0");
									$(".rzvy_update_lpoint_amount").html("0");
									$(".rzvy-cart-lpoint-main").slideUp(1000);
								}
							}
						});
					}
				});
			}
		}
	});
});
/* Rezervy Sroll auto to next element */
if(generalObj.auto_scroll_each_module_status == "Y"){
	$(document).ajaxComplete(function(event,xhr,options){
		if(options.url!==undefined || options.url!==undefined!==null){
			var rzvy_currajax_xhr = options.url;
			if(rzvy_currajax_xhr.indexOf('rzvy_front_ajax.php')>=0){
				if(options.data!==undefined || options.data!==undefined!==null){
					var rzvy_currajax_xhrdata = options.data;
					if(rzvy_currajax_xhrdata.indexOf('on_pageload')>=0){
						if($(".rzvy-pcategory-container").is(':visible') && !$(".rzvy-pcategory-container").is(':hidden')){							
							$('html, body').animate({
								scrollTop: parseInt($(".rzvy-pcategory-container").offset().top)
							}, 800);
						}else if($(".rzvy_categories_html_content").is(':visible') && !$(".rzvy_categories_html_content").is(':hidden')){							
							$('html, body').animate({
								scrollTop: parseInt($(".rzvy_categories_html_content_scroll").offset().top)
							}, 800);
						}else if($(".rzvy_show_hide_services").is(':visible') && !$(".rzvy_show_hide_services").is(':hidden')){							
							$('html, body').animate({
								scrollTop: parseInt($(".rzvy_show_hide_services").offset().top)
							}, 800);
						}
					}
					if(rzvy_currajax_xhrdata.indexOf('get_subcat_by_pcid')>=0){
						if($(".rzvy_categories_html_content").is(':visible') && !$(".rzvy_categories_html_content").is(':hidden')){							
							$('html, body').animate({
								scrollTop: parseInt($(".rzvy_categories_html_content_scroll").offset().top)
							}, 800);
						}
					}
					if(rzvy_currajax_xhrdata.indexOf('get_services_by_cat_id')>0){
						if($(".rzvy_show_hide_services").is(':visible') && !$(".rzvy_show_hide_services").is(':hidden')){							
							$('html, body').animate({
								scrollTop: parseInt($(".rzvy_show_hide_services").offset().top)
							}, 800);
						}
					}
					if(rzvy_currajax_xhrdata.indexOf('get_multi_and_single_qty_addons_content')>0){
						if($(".rzvy_show_hide_addons").is(':visible') && !$(".rzvy_show_hide_addons").is(':hidden')){
							$('html, body').animate({
								scrollTop: parseInt($(".rzvy_show_hide_addons").offset().top)
							}, 800);
						}
					}
					if(rzvy_currajax_xhrdata.indexOf('get_staff_according_service')>0){
						if($(".rzvy_show_hide_addons").is(':visible') && !$(".rzvy_show_hide_addons").is(':hidden')){
							/* Let customer choose addon stop scroll here */
						}else if($("#rzvy-staff-main").is(':visible') && !$("#rzvy-staff-main").is(':hidden')){
							$('html, body').animate({
								scrollTop: parseInt($("#rzvy-staff-main").offset().top)
							}, 800);
						}else if($(".show_hide_frequently_discount").is(':visible') && !$(".show_hide_frequently_discount").is(':hidden')){
							$('html, body').animate({
								scrollTop: parseInt($(".show_hide_frequently_discount").offset().top)
							}, 800);
						}else if($(".rzvy_hide_calendar_before_staff_selection").is(':visible') && !$(".rzvy_hide_calendar_before_staff_selection").is(':hidden')){
							$('html, body').animate({
								scrollTop: parseInt($(".rzvy_hide_calendar_before_staff_selection").offset().top)
							}, 800);
						}else{
							if($(".rzvy-users-selection-div").is(':visible') && !$(".rzvy-users-selection-div").is(':hidden')){
								$('html, body').animate({
									scrollTop: parseInt($(".rzvy-users-selection-div").offset().top)
								}, 800);
							}
						}
					}
					
					/* Staff Manual Selected */
					if(rzvy_currajax_xhrdata.indexOf('set_staff_according_service_manual')>=0 || rzvy_currajax_xhrdata.indexOf('get_slots_any_staff')>=0){		
						if($(".show_hide_frequently_discount").is(':visible') && !$(".show_hide_frequently_discount").is(':hidden')){
							$('html, body').animate({
								scrollTop: parseInt($(".show_hide_frequently_discount").offset().top)
							}, 800);
						}else if($(".rzvy_hide_calendar_before_staff_selection").is(':visible') && !$(".rzvy_hide_calendar_before_staff_selection").is(':hidden')){
							$('html, body').animate({
								scrollTop: parseInt($(".rzvy_hide_calendar_before_staff_selection").offset().top)
							}, 800);
						}else if(!$(".rzvy_hide_calendar_before_staff_selection").is(':visible') && $(".rzvy_hide_calendar_before_staff_selection").is(':hidden')){
							setTimeout(function(){		
								$('html, body').animate({
									scrollTop: parseInt($(".rzvy_hide_calendar_before_staff_selection").offset().top)
								}, 800);
							},1000);
						}else{
							if($(".rzvy-users-selection-div").is(':visible') && !$(".rzvy-users-selection-div").is(':hidden')){
								$('html, body').animate({
									scrollTop: parseInt($(".rzvy-users-selection-div").offset().top)
								}, 800);
							}
						}
					}
					/* Staff Trigger Selected */
					else if(rzvy_currajax_xhrdata.indexOf('set_staff_according_service')>=0){
						setTimeout(function(){								
							if($(".rzvy_show_hide_addons").is(':visible') && !$(".rzvy_show_hide_addons").is(':hidden')){
								/* Let customer choose addon stop scroll here */
							}else if($(".show_hide_frequently_discount").is(':visible') && !$(".show_hide_frequently_discount").is(':hidden')){
								$('html, body').animate({
									scrollTop: parseInt($(".show_hide_frequently_discount").offset().top)
								}, 800);
							}else if($(".rzvy_hide_calendar_before_staff_selection").is(':visible') && !$(".rzvy_hide_calendar_before_staff_selection").is(':hidden')){
								$('html, body').animate({
									scrollTop: parseInt($(".rzvy_hide_calendar_before_staff_selection").offset().top)
								}, 800);
							}
						},1000);
					}else{}
					
					if(rzvy_currajax_xhrdata.indexOf('selected_startslot')>=0){
						/* Commented for RB - Recurrence Bookings */
						/* if($(".show_hide_frequently_discount").is(':visible') && !$(".show_hide_frequently_discount").is(':hidden')){
							$('html, body').animate({
								scrollTop: parseInt($(".show_hide_frequently_discount").offset().top)
							}, 800);
						}else{ */
						setTimeout(function(){	
							if($(".rzvy_recurrence_dates_container").is(':visible') && !$(".rzvy_recurrence_dates_container").is(':hidden')){
							$('html, body').animate({
								scrollTop: parseInt($(".rzvy_recurrence_dates_container").offset().top)
							}, 800);
							}else if($(".rzvy-users-selection-div").is(':visible') && !$(".rzvy-users-selection-div").is(':hidden')){
								$('html, body').animate({
									scrollTop: parseInt($(".rzvy-users-selection-div").offset().top)
								}, 800);
							}
						},1000);
						/* } */
					}
					
					if(rzvy_currajax_xhrdata.indexOf('update_frequently_discount')>=0){
						if($(".show_hide_recurrence_booking").is(':visible') && !$(".show_hide_recurrence_booking").is(':hidden')){
							$('html, body').animate({
								scrollTop: parseInt($(".show_hide_recurrence_booking").offset().top)
							}, 800);
						}else if(!$(".rzvy_hide_calendar_before_staff_selection").is(':visible') && $(".rzvy_hide_calendar_before_staff_selection").is(':hidden')){
							setTimeout(function(){		
								$('html, body').animate({
									scrollTop: parseInt($(".rzvy_hide_calendar_before_staff_selection").offset().top)
								}, 800);
							},1000);
						}else if($(".rzvy-users-selection-div").is(':visible') && !$(".rzvy-users-selection-div").is(':hidden') && $(".rzvy_selected_slot_detail").is(':visible') && !$(".rzvy_selected_slot_detail").is(':hidden')){
								$('html, body').animate({
									scrollTop: parseInt($(".rzvy-users-selection-div").offset().top)
								}, 800);
						}
					}
					
				}				
			}			
		}
	});
}

$(document).on("change", ".rzvy-lpoint-control-input", function(){
	$("#rzvy_refresh_cart").html("<label>"+langObj.no_items_in_cart+"</label>");
	var ajax_url = generalObj.ajax_url;
	$.ajax({
		type: 'post',
		data: {
			'lpoint_check': $(this).prop("checked"),
			'apply_loyalty_point': 1
		},
		url: ajax_url + "rzvy_front_ajax.php",
		success: function (response) {
			$.ajax({
				type: 'post',
				async:true,
				data: {
					'user': $(".rzvy-user-selection:checked").val(),
					'use_lpoint': $(this).prop("checked"),
					'payment_method': $(".rzvy-payment-method-check:checked").val(),
					'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
					'refresh_cart_sidebar': 1
				},
				url: ajax_url + "rzvy_front_cart_ajax.php",
				success: function (response) {
					$("#rzvy_refresh_cart").html(response);
					if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
						$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
					}else{
						$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
					}
					if($(".rzvy-partial-deposit-control-input").prop("checked")){
						if(Number($(".rzvy_cart_pd_amount").val())>0){
							$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
						}else{
							$(".rzvy_update_partial_amount").html("0");
						}
						$(".rzvy-cart-partial-deposite-main").show();
					}else{
						$(".rzvy_update_partial_amount").html("0");
						$(".rzvy-cart-partial-deposite-main").hide();
					}
					if($(".rzvy-lpoint-control-input").prop("checked")){
						$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
						if(Number($(".rzvy_cart_lp_amount").val())>0){
							$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
						}else{
							$(".rzvy_update_lpoint_amount").html("0");
						}
						$(".rzvy-cart-lpoint-main").slideDown(1000);
					}else{
						$(".rzvy_update_lpoint_count").html("0");
						$(".rzvy_update_lpoint_amount").html("0");
						$(".rzvy-cart-lpoint-main").slideUp(1000);
					}
					rzvy_ov_payment_method_refresh_func();
				}
			});
		}
	});
});

/** JS to show available rcoupon **/
$(document).on("click", ".rzvy-rcoupon-radio", function(){
	var ajax_url = generalObj.ajax_url;
	var id = $(this).val();
	var coupon_code = $(this).data("promo");
	$(".rzvy-available-rcoupon-list").removeClass("rzvy-rcoupon-radio-checked");
	$("#rzvy-rcoupon-radio-"+id).parent().addClass("rzvy-rcoupon-radio-checked");
	
	var ref_discount_coupon = coupon_code.toUpperCase();
	$.ajax({
		type: 'post',
		data: {
			'ref_discount_coupon': ref_discount_coupon,
			'apply_referral_discount': 1
		},
		url: ajax_url + "rzvy_front_ajax.php",
		success: function (res) {
			$("#rzvy-available-coupons-modal").modal("hide");
			if(res == "notexist"){
				$(".rzvy_remove_applied_rcoupon").attr('data-id','');
				$("#rzvy-rcoupon-radio-"+id).prop("checked", false);
				$("#rzvy-rcoupon-radio-"+id).removeAttr("checked");
				$(".rzvy_applied_referral_coupon_code").html("");
				$(".rzvy_applied_referral_coupon_div_text").slideUp(1000);
				$(".rzvy_apply_referral_coupon_div").show();
				swal(langObj.please_enter_valid_referral_discount_coupon, "", "error");
			}else if(res == "used"){
				$(".rzvy_remove_applied_rcoupon").attr('data-id','');
				$("#rzvy-rcoupon-radio-"+id).prop("checked", false);
				$("#rzvy-rcoupon-radio-"+id).removeAttr("checked");				
				$(".rzvy_applied_referral_coupon_code").html("");
				$(".rzvy_applied_referral_coupon_div_text").slideUp(1000);
				$(".rzvy_apply_referral_coupon_div").show();
				swal(langObj.referral_discount_coupon_already_used, "", "error");
			}else if(res == "applied"){
				$(".rzvy_applied_referral_coupon_code").html(ref_discount_coupon);
				$(".rzvy_applied_referral_coupon_div_text").slideDown(1000);
				$(".rzvy_apply_referral_coupon_div").hide();
				$(".rzvy_remove_applied_rcoupon").attr('data-id',id);
				swal(langObj.applied_referral_discount_coupon_applied_successfully, "", "success");
				$.ajax({
					type: 'post',
					async:true,
					data: {
						'user': $(".rzvy-user-selection:checked").val(),
						'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
						'payment_method': $(".rzvy-payment-method-check:checked").val(),
						'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
						'refresh_cart_sidebar': 1
					},
					url: ajax_url + "rzvy_front_cart_ajax.php",
					success: function (response) {
						$("#rzvy_refresh_cart").html(response);
						/* if($(".rzvy_cart_items_list li").length>0){
							$(".rzvy-frequently-discount-change").prop('checked', false);
						} */
						if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
							$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
						}else{
							$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
						}
						if($(".rzvy-partial-deposit-control-input").prop("checked")){
							if(Number($(".rzvy_cart_pd_amount").val())>0){
								$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
							}else{
								$(".rzvy_update_partial_amount").html("0");
							}
							$(".rzvy-cart-partial-deposite-main").show();
						}else{
							$(".rzvy_update_partial_amount").html("0");
							$(".rzvy-cart-partial-deposite-main").hide();
						}
						
						if($(".rzvy-lpoint-control-input").prop("checked")){
							$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
							if(Number($(".rzvy_cart_lp_amount").val())>0){
								$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
							}else{
								$(".rzvy_update_lpoint_amount").html("0");
							}
							$(".rzvy-cart-lpoint-main").slideDown(1000);
						}else{
							$(".rzvy_update_lpoint_count").html("0");
							$(".rzvy_update_lpoint_amount").html("0");
							$(".rzvy-cart-lpoint-main").slideUp(1000);
						}
						rzvy_ov_payment_method_refresh_func();
					}
				});
			}else {
				$(".rzvy_remove_applied_rcoupon").attr('data-id','');
				$("#rzvy-rcoupon-radio-"+id).prop("checked", false);
				$("#rzvy-rcoupon-radio-"+id).removeAttr("checked");		
				$(".rzvy_applied_referral_coupon_code").html("");
				$(".rzvy_applied_referral_coupon_div_text").slideUp(1000);
				$(".rzvy_apply_referral_coupon_div").show();
				swal(langObj.opps_something_went_wrong_please_try_again, "", "error");
			}
		}
	});
});
/* Adjust Booking Summary Style On Scroll 
$(window).on('scroll', function () {
    var rzvy_scrollTop = $(window).scrollTop();
	var rzvy_Width = window.innerWidth;
	var rzvy_rswidth = $('.rzvy_right_side_container').width();
	if(rzvy_Width<=992){
		$('.rzvy_sticky_bottom_booking_summary').css({'position':'unset','width':rzvy_rswidth+'px'});
	}else{
		if (rzvy_scrollTop < 50) {
				$('.rzvy_sticky_bottom_booking_summary').css({'position':'absolute','bottom':'unset','width':rzvy_rswidth+'px'});  
		}else{
				$('.rzvy_sticky_bottom_booking_summary').css({'position':'fixed','bottom':'20px','width':rzvy_rswidth+'px'});		
		}
	}
});*/

/* iCal file Download */
$(document).on("click", "#rzvy_ical_booking_info_download", function(){
	var rzvy_blob = new Blob([$('#rzvy_ical_booking_info').text()], { type: 'text/calendar' });
	var rzvy_icslink = document.createElement('a');
	rzvy_icslink.href = window.URL.createObjectURL(rzvy_blob);
	rzvy_icslink.download = 'booking.ics';
	rzvy_icslink.click();
});

/* Set Staff Id In Today/Tomorrow All Slots */
$(document).on("change", ".rzvy_anystaff_selection", function(event){
	var ajax_url = generalObj.ajax_url;
	var id = $(this).data("staffid");
	var dataset = {
		'id': id,
		'set_staff_according_any': 1,
	}
	$.ajax({
		type: 'post',
		data: dataset,
		url: ajax_url + "rzvy_front_ajax.php",
		success: function (res) {
			$.ajax({
				type: 'post',
				data: {
					'user': $(".rzvy-user-selection:checked").val(),
					'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
					'payment_method': $(".rzvy-payment-method-check:checked").val(),
					'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
					'refresh_cart_sidebar': 1
				},
				url: ajax_url + "rzvy_front_cart_ajax.php",
				success: function (response) {
					$("#rzvy_refresh_cart").html(response);
					if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
						$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
					}else{
						$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
					}
					if($(".rzvy-partial-deposit-control-input").prop("checked")){
						if(Number($(".rzvy_cart_pd_amount").val())>0){
							$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
						}else{
							$(".rzvy_update_partial_amount").html("0");
						}
						$(".rzvy-cart-partial-deposite-main").show();
					}else{
						$(".rzvy_update_partial_amount").html("0");
						$(".rzvy-cart-partial-deposite-main").hide();
					}
					
					if($(".rzvy-lpoint-control-input").prop("checked")){
						$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
						if(Number($(".rzvy_cart_lp_amount").val())>0){
							$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
						}else{
							$(".rzvy_update_lpoint_amount").html("0");
						}
						$(".rzvy-cart-lpoint-main").slideDown(1000);
					}else{
						$(".rzvy_update_lpoint_count").html("0");
						$(".rzvy_update_lpoint_amount").html("0");
						$(".rzvy-cart-lpoint-main").slideUp(1000);
					}
				}
			});
		}
	});
});
/** JS to make logout on frontend **/
$(document).on("click", "#rzvy_logout_header_btn", function(){
	var ajax_url = generalObj.ajax_url;	
	$(this).append(rzvy_loader);	
	$.ajax({
		type: 'post',
		data: {
			'front_logout': 1
		},
		url: ajax_url + "rzvy_front_ajax.php",
		success: function (res) {
			$(".rzvy-loader").remove();
			location.reload();
		}
	});
});

/** JS to apply coupons auto from promo URL **/
function rzvy_autoapplypromo_urlcallback(trigger='N'){
	var ajax_url = generalObj.ajax_url;
	var coupon_code = $('#rzvy_coupon_code').val();
	var coupon_user = $('.rzvy-user-selection:checked').val();
	$('#rzvy-coupon-empty-error').addClass('d-none');
	$('#rzvy-coupon-response-error').addClass('d-none');
	if(coupon_code=='' && trigger=='N'){
		$('#rzvy-coupon-empty-error').removeClass('d-none');
		return false;
	}
	if(trigger=='N'){
		$("#rzvy_apply_coupon_code_btn").append(rzvy_loader);
	}
	$.ajax({
		type: 'post',
		data: {
			'id': coupon_code,
			'coupon_user': coupon_user,
			'apply_input': 1,
			'apply_coupon': 1
		},
		url: ajax_url + "rzvy_front_ajax.php",
		success: function (res) {
			if(trigger=='N'){
				$(".rzvy-loader").remove();
			}
			if(res=="available"){
				$("#rzvy-available-coupons-modal").modal("hide");
				$(".rzvy_remove_applied_coupon").attr('data-id', coupon_code);				
				$(".rzvy_applied_coupon_badge").html(coupon_code);
				$(".rzvy_remove_applied_coupon").show();
				$(".rzvy_remove_applied_coupon").bind('click');
				$(".rzvy_applied_coupon_div").slideDown(1000);
				if(trigger=='N'){				
					swal(langObj.applied_promo_applied_successfully, "", "success");
				}
				$.ajax({
					type: 'post',
					async:true,
					data: {
						'user': $(".rzvy-user-selection:checked").val(),
						'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
						'payment_method': $(".rzvy-payment-method-check:checked").val(),
						'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
						'refresh_cart_sidebar': 1
					},
					url: ajax_url + "rzvy_front_cart_ajax.php",
					success: function (response) {
						$("#rzvy_refresh_cart").html(response);

						if($(".rzvy_cart_items_list_li").hasClass("rzvy_subtotal_exit")){
							$(".remove_payment_according_services_showhide").removeClass("rzvy_hide_show_payment_according_services");
						}else{
							$(".remove_payment_according_services_showhide").addClass("rzvy_hide_show_payment_according_services");
						}
						if($(".rzvy-partial-deposit-control-input").prop("checked")){
							if(Number($(".rzvy_cart_pd_amount").val())>0){
								$(".rzvy_update_partial_amount").html($(".rzvy_cart_pd_amount").val());
							}else{
								$(".rzvy_update_partial_amount").html("0");
							}
							$(".rzvy-cart-partial-deposite-main").show();
						}else{
							$(".rzvy_update_partial_amount").html("0");
							$(".rzvy-cart-partial-deposite-main").hide();
						}
						
						if($(".rzvy-lpoint-control-input").prop("checked")){
							$(".rzvy_update_lpoint_count").html($(".rzvy_cart_lp_amount").data("lpointtotal"));
							if(Number($(".rzvy_cart_lp_amount").val())>0){
								$(".rzvy_update_lpoint_amount").html($(".rzvy_cart_lp_amount").val());
							}else{
								$(".rzvy_update_lpoint_amount").html("0");
							}
							$(".rzvy-cart-lpoint-main").slideDown(1000);
						}else{
							$(".rzvy_update_lpoint_count").html("0");
							$(".rzvy_update_lpoint_amount").html("0");
							$(".rzvy-cart-lpoint-main").slideUp(1000);
						}
						rzvy_ov_payment_method_refresh_func();
					}
				});
			}else{
				$(".rzvy-coupon-radio").prop("checked", false);
				if(trigger=='N'){				
					swal(res, "", "error");
				}else{
					$('#rzvy-coupon-response-error').removeClass('d-none');
					$("#rzvy-coupon-response-error").html(res);
				}
				if($(".rzvy_remove_applied_coupon").is(':visible') && !$(".rzvy_remove_applied_coupon").is(':hidden')){			
					$(".rzvy_remove_applied_coupon").trigger("click");					
				}	
			}
		}
	});
}

$(document).ajaxComplete(function(event,xhr,options){
	if(options.url!==undefined || options.url!==undefined!==null){
		var rzvy_currajax_xhr = options.url;
		if(rzvy_currajax_xhr.indexOf('rzvy_front_cart_ajax.php')>=0 || rzvy_currajax_xhr.indexOf('rzvy_front_ajax.php')>=0){
			if(options.data!==undefined || options.data!==undefined!==null){
				var rzvy_currajax_xhrdata = options.data;					
				if(rzvy_currajax_xhrdata.indexOf('add_to_cart_item')>=0 || rzvy_currajax_xhrdata.indexOf('front_login')>=0 || rzvy_currajax_xhrdata.indexOf('front_logout')>=0 || rzvy_currajax_xhrdata.indexOf('get_multi_and_single_qty_addons_content')>=0){
					var coupon_code = $('#rzvy_coupon_code').val();
					if(coupon_code!==undefined && coupon_code!==null && coupon_code!=''){
						var ajax_url = generalObj.ajax_url;
						$.ajax({
							type: 'post',
							data: {
								'check_cart_amount': 1
							},
							url: ajax_url + "rzvy_front_ajax.php",
							success: function (ress_cartamount) {
								if(ress_cartamount == "sufficient"){
									var autotrigger = 'Y';
									rzvy_autoapplypromo_urlcallback(autotrigger);
								}
							}
						});		
					}
				}
				/* Recurrence Booking Check */				
				if(rzvy_currajax_xhrdata.indexOf('add_selected_slot_withendslot')>=0 || rzvy_currajax_xhrdata.indexOf('update_frequently_discount')>=0 || rzvy_currajax_xhrdata.indexOf('get_slots')>=0){
					var recurrence_booking_limit = $("#rzvy_recurrence_booking_limit").val();
					var recurrence_type = $(".rzvy-frequently-discount-change:checked").val();
					var selected_date = $("#rzvy_time_slots_selection_date").val();
					var selected_time = $("#rzvy_time_slots_selection_starttime").val();
					
					if(rzvy_currajax_xhrdata.indexOf('get_slots')>=0){
						var selected_date = '';
						var selected_time = '';
					}
					
					var ajax_url = generalObj.ajax_url;
					$.ajax({
						type: 'post',
						data: {
							'selected_date':selected_date,
							'selected_time':selected_time,
							'recurrence_type':recurrence_type,
							'recurrence_booking_limit':recurrence_booking_limit,
							'get_recurrence_detail': 1
						},
						url: ajax_url + "rzvy_front_ajax.php",
						success: function (ress_rb) {
							$('.rzvy_recurrence_dates_container').remove();
							$('.slot_refresh_div').after(ress_rb);
							
							var rb_payment = generalObj.rzvy_rb_payment;
							if($(".rzvy_rb_avl_dt").is(':visible') && !$(".rzvy_rb_avl_dt").is(':hidden') && rb_payment=='Y'){
								$('.rzvy_pd_container').hide();
								$('.rzvy_lp_container').hide();
							}else if($(".rzvy_rb_avl_dt").is(':visible') && !$(".rzvy_rb_avl_dt").is(':hidden') && rb_payment=='N'){
								$('.rzvy_pd_container').show();
								$('.rzvy_lp_container').show();
							}else if(ress_rb=='' || ress_rb==undefined || ress_rb==null){
								$('.rzvy_pd_container').show();
								$('.rzvy_lp_container').show();
							}else if(!$(".rzvy_rb_avl_dt").is(':visible') || $(".rzvy_rb_avl_dt").is(':hidden')){
								$('.rzvy_pd_container').show();
								$('.rzvy_lp_container').show();
							}
			
							$.ajax({
								type: 'post',
								data: {
									'user': $(".rzvy-user-selection:checked").val(),
									'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
									'payment_method': $(".rzvy-payment-method-check:checked").val(),
									'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
									'refresh_cart_sidebar': 1
								},
								url: ajax_url + "rzvy_front_cart_ajax.php",
								success: function (response) {
									$("#rzvy_refresh_cart").html(response);
								}
							});
						}
					});		
				}					
			}				
		}			
	}
});

/** JS to show Nested Parent categories according parent category selection **/
$(document).on('click', ".rzvy-pcategories-selection-pcategories", function(){
	var ajax_url = generalObj.ajax_url;
	var id = $(this).data("id");
	var next_nprid = $(this).data("nprid");
	var curr_nprid = parseInt(next_nprid)-1;
	if(next_nprid==1){
		$('.rzvy-pc-row-1 .item').each(function(){		
			$(this).parent().removeClass("selected");
			$(this).removeClass("selected");
		});
	}
	$('.rzvy-npc-row').each(function(){
		var rid = $(this).data('rid');
		if(rid>=next_nprid){
			$(this).remove();
		}
		if(rid==curr_nprid){
			/* $(this).find('.item.selected').removeClass('selected');
			$(this).find('.owl-item.selected').removeClass('selected'); */
			$(this).find('.item').parent().removeClass('selected');
		}
	});			
	$("#rzvy_refresh_cart").html("<label>"+langObj.no_items_in_cart+"</label>");
	$("#rzvy_categories_html_content").html("");
	$("#rzvy_services_html_content").html("");
	$("#rzvy_multipleqty_addon_html_content").html("");
	$("#rzvy_singleqty_addon_html_content").html("");
	$(".rzvy_hide_calendar_before_staff_selection").hide();
	$(".rzvy_show_hide_sub_categories").hide();
	$(".rzvy_show_hide_services").hide();
	$(".rzvy_show_hide_addons").hide();
	$("#rzvy-staff-main").html("");
	$("#rzvy-staff-main").hide();
			
	$(".rzvy-npc-row-"+curr_nprid+" .item").removeClass("selected");
	$(".rzvy-npc-row-"+curr_nprid+" .rzvy-pcategories-selection").removeClass("list_active");
	$(".rzvy-npc-row-"+curr_nprid+" .rzvy-pcategories-selection-pcategories").removeClass("list_active");
	$("#rzvy-pcategories-selection-"+id).addClass("list_active");
	$(this).parent().parent().parent().addClass("selected");
	$(this).parent().parent().append(rzvy_loader);
		
	$.ajax({
		type: 'post',
		data: {
			'id': id,
			'pc_row': next_nprid,
			'get_nestedcat_by_pcid': 1
		},
		url: ajax_url + "rzvy_front_ajax.php",
		success: function (res) {
			$(".rzvy-loader").remove();			
			$(".rzvy-pcategory-container").append(res);
			$('html, body').animate({
				scrollTop: parseInt($(".rzvy-npc-row-"+next_nprid).offset().top)
			}, 800);
		}
	});
});

/** image upload js */
function rzvy_read_uploaded_file_url(input,utype) {
	var files = input.files[0];
	var done = function(url){
		if(utype=='G'){
			$('#rzvy_guest_image_url').val(url);
		}else{
			$('#rzvy_user_image_url').val(url);
		}
		
	};
	if(files){		
		if((files.size/1000) > 1000){
				swal(generalObj.opps, generalObj.maximum_file_upload_size_1_mb, "error");
			}else if(files.type =="image/jpeg" || files.type =="image/jpg" || files.type =="image/png"){
				
				var reader = new FileReader();
				reader.onload = function(e){
					done(e.target.result);
				};
				reader.readAsDataURL(files);				
			}else{
			swal(generalObj.opps, generalObj.please_select_a_valid_image_file, "error");
		}
	}
}
$(document).on('change', ".rzvy_user_image", function() {
	var usertypeval = $(this).data('utype');
    rzvy_read_uploaded_file_url(this,usertypeval);
});

$(document).on("change", "#rzvy_recurrence_booking_limit", function(){
	var ajax_url = generalObj.ajax_url;
	var recurrence_booking_limit = $("#rzvy_recurrence_booking_limit").val();
	var recurrence_type = $(".rzvy-frequently-discount-change:checked").val();
	var selected_date = $("#rzvy_time_slots_selection_date").val();
	var selected_time = $("#rzvy_time_slots_selection_starttime").val();
	
	if($(".rzvy_hide_calendar_before_staff_selection").is(':visible') && !$(".rzvy_hide_calendar_before_staff_selection").is(':hidden')){
		$('html, body').animate({
			scrollTop: parseInt($(".rzvy_hide_calendar_before_staff_selection").offset().top)
		}, 800);
	}else{
		if($(".rzvy-users-selection-div").is(':visible') && !$(".rzvy-users-selection-div").is(':hidden')){
			$('html, body').animate({
				scrollTop: parseInt($(".rzvy-users-selection-div").offset().top)
			}, 800);
		}
	}
	
	$.ajax({
		type: 'post',
		data: {
			'selected_date':selected_date,
			'selected_time':selected_time,
			'recurrence_type':recurrence_type,
			'recurrence_booking_limit':recurrence_booking_limit,
			'get_recurrence_detail': 1
		},
		url: ajax_url + "rzvy_front_ajax.php",
		success: function (ress_rb) {
			$('.rzvy_recurrence_dates_container').remove();
			$('.slot_refresh_div').after(ress_rb);
			
			var rb_payment = generalObj.rzvy_rb_payment;
			if($(".rzvy_rb_avl_dt").is(':visible') && !$(".rzvy_rb_avl_dt").is(':hidden') && rb_payment=='Y'){
				$('.rzvy_pd_container').hide();
				$('.rzvy_lp_container').hide();
			}else if($(".rzvy_rb_avl_dt").is(':visible') && !$(".rzvy_rb_avl_dt").is(':hidden') && rb_payment=='N'){
				$('.rzvy_pd_container').show();
				$('.rzvy_lp_container').show();
			}else if(ress_rb=='' || ress_rb==undefined || ress_rb==null){
				$('.rzvy_pd_container').show();
				$('.rzvy_lp_container').show();
			}else if(!$(".rzvy_rb_avl_dt").is(':visible') || $(".rzvy_rb_avl_dt").is(':hidden')){
				$('.rzvy_pd_container').show();
				$('.rzvy_lp_container').show();
			}
			
			$.ajax({
				type: 'post',
				data: {
					'user': $(".rzvy-user-selection:checked").val(),
					'use_lpoint': $(".rzvy-lpoint-control-input").prop("checked"),
					'payment_method': $(".rzvy-payment-method-check:checked").val(),
					'is_partial': $(".rzvy-partial-deposit-control-input").prop("checked"),
					'refresh_cart_sidebar': 1
				},
				url: ajax_url + "rzvy_front_cart_ajax.php",
				success: function (response) {
					$("#rzvy_refresh_cart").html(response);
				}
			});
		}
	});	
});
