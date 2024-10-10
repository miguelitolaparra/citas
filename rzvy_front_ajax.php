<?php 
/* Include class files */
include(dirname(dirname(dirname(__FILE__)))."/constants.php");
include(dirname(dirname(dirname(__FILE__)))."/classes/class_frontend.php");
include(dirname(dirname(dirname(__FILE__)))."/classes/class_settings.php");
include(dirname(dirname(dirname(__FILE__)))."/classes/class_slots.php");
include(dirname(dirname(dirname(__FILE__)))."/classes/class_loyalty_points.php");

/* Create object of classes */
$obj_frontend = new rzvy_frontend();
$obj_frontend->conn = $conn;

$obj_settings = new rzvy_settings();
$obj_settings->conn = $conn;

$obj_slots = new rzvy_slots();
$obj_slots->conn = $conn;

$obj_lpoint = new rzvy_loyalty_points();
$obj_lpoint->conn = $conn;

if(isset($_SESSION['rzvy_staff_id'])){
	$obj_slots->staff_id = $_SESSION['rzvy_staff_id'];
}
$time_interval = $obj_settings->get_option('rzvy_timeslot_interval');
$rzvy_currency_symbol = $obj_settings->get_option('rzvy_currency_symbol');
$rzvy_currency_position = $obj_settings->get_option('rzvy_currency_position');
$rzvy_date_format = $obj_settings->get_option('rzvy_date_format');
$rzvy_time_format = $obj_settings->get_option('rzvy_time_format');
$advance_bookingtime = $obj_settings->get_option('rzvy_maximum_advance_booking_time');
$rzvy_location_selector_status = $obj_settings->get_option("rzvy_location_selector_status"); 
$rzvy_show_category_image = $obj_settings->get_option("rzvy_show_category_image"); 
$rzvy_show_service_image = $obj_settings->get_option("rzvy_show_service_image"); 
$rzvy_show_addon_image = $obj_settings->get_option("rzvy_show_addon_image"); 
$rzvy_show_staff_image = $obj_settings->get_option("rzvy_show_staff_image"); 
$rzvy_show_parentcategory_image = $obj_settings->get_option("rzvy_show_parentcategory_image"); 
$rzvy_services_listing_view = $obj_settings->get_option("rzvy_services_listing_view"); 
$rzvy_image_type = $obj_settings->get_option("rzvy_image_type"); 
$rzvy_price_display = $obj_settings->get_option("rzvy_price_display");
$rzvy_staff_order = $obj_settings->get_option("rzvy_staff_order");
$rzvy_nocarousel_sections = $obj_settings->get_option("rzvy_nocarousel_sections"); 
$rzvy_carousel_loop = $obj_settings->get_option("rzvy_carousel_loop"); 
$rzvy_nocarousel_section = array();
if($rzvy_nocarousel_sections!=''){
	$rzvy_nocarousel_section = explode(',',$rzvy_nocarousel_sections);
}
$rzvy_nocarouselsm_sections = $obj_settings->get_option("rzvy_nocarousel_sm_sections"); 
$rzvy_nocarouselsm_section = array();
if($rzvy_nocarouselsm_sections!=''){
	$rzvy_nocarouselsm_section = explode(',',$rzvy_nocarouselsm_sections);
}
$rzvyrounded = '';
if($rzvy_image_type=='rounded-circle'){
	$rzvyrounded = 'rounded';
}
$rzvyloop = 'false';
if($rzvy_carousel_loop=='Y'){
	$rzvyloop = 'true';
}



$insideContentAlignment = "text-center";
$rzvy_stepview_alignment = $obj_settings->get_option("rzvy_stepview_alignment"); 
if($rzvy_stepview_alignment == "center"){
	$alignmentClass = "justify-content-center";
	$labelAlignmentClass = "class='d-flex flex-wrap justify-content-center'";
	$labelAlignmentClassName = "d-flex flex-wrap justify-content-center";
	$inputAlignment = "text-center";
}else if($rzvy_stepview_alignment == "right"){
	$alignmentClass = "justify-content-end";
	$labelAlignmentClass = "class='d-flex flex-wrap justify-content-end'";
	$labelAlignmentClassName = "d-flex flex-wrap justify-content-end";
	$inputAlignment = "text-right";
}else{
	$alignmentClass = "";
	$labelAlignmentClass = "";
	$labelAlignmentClassName = "";
	$inputAlignment = "";
}


/* get services by category id ajax */
if(isset($_POST['get_services_by_cat_id'])){
	$obj_frontend->category_id = $_POST['id'];
	$all_services = $obj_frontend->get_services_by_cat_id();
	$nonlocation_services = 0;
	if(mysqli_num_rows($all_services)>0){
		$_SESSION['rzvy_cart_category_id'] = $_POST['id'];
		$_SESSION['rzvy_cart_items'] = array();
		$_SESSION['rzvy_cart_total_addon_duration'] = 0;
		$_SESSION['rzvy_cart_service_id'] = "";
		if($rzvy_services_listing_view == "L"){
			?><div class="rzvy-listview mb-3"><?php 
		} ?>
		 <div class="services <?php echo $rzvyrounded;?>">
              <div class="owl-carousel <?php if(in_array('rs',$rzvy_nocarousel_section)){ echo ' owl-carousel-without '; } if(in_array('rs',$rzvy_nocarouselsm_section)){ echo ' owl-carousel-sm-without '; } ?>" data-items="3" data-items-lg="3" data-items-md="2" data-items-sm="2" data-items-ssm="1" data-margin="24" data-dots="true" data-nav="true" autoplay="false"  autoplay="false" data-loop="<?php echo $rzvyloop; ?>">
		<?php 
		while($service = mysqli_fetch_array($all_services)){
			if(isset($service['locations']) && $service['locations']!='' && $rzvy_location_selector_status=='Y'){
				$service_locations = explode(',',$service['locations']);
				if(isset($_SESSION['rzvy_location_selector_zipcode']) && !in_array($_SESSION['rzvy_location_selector_zipcode'],$service_locations)){ $nonlocation_services++; continue; }
				
			}
			if($rzvy_services_listing_view == "L"){
				?>
				<div id="rzvy-services-radio-<?php echo $service["id"]; ?>" class="rzvy-listview-list my-1 rzvy-services-radio-change">
					<div class="rzvy-listview-list-data">
						<?php 
						if($rzvy_show_service_image == "Y"){
							?>
							<div class="rzvy-listview-list-image">
								<img style="width: inherit;" src="<?php if($service['image'] != "" && file_exists(dirname(dirname(dirname(__FILE__)))."/uploads/images/".$service['image'])){ echo SITE_URL."uploads/images/".$service['image']; }else{ echo SITE_URL."includes/images/noimage.png"; } ?>" />
							</div>
							<?php 
						}
						?>
						<div class="rzvy-listview-list-info px-1">
							<div class="rzvy-listview-list-title">
								<?php 
								echo $service['title']." ";
								if($service['duration']>0){
									?><span class="rzvy-listview-list-price"><i class="fa fa-clock-o"></i> <?php echo $service['duration']." Min."; ?></span><?php 
								}
								if($rzvy_price_display=='Y'){
								?><span class="rzvy-listview-list-price"><i class="fa fa-tag"></i> <?php 
									if($service['rate']>0){ 
										echo $obj_settings->rzvy_currency_position($rzvy_currency_symbol,$rzvy_currency_position,$service['rate']);
									}else{ 
										echo (isset($rzvy_translangArr['free']))?$rzvy_translangArr['free']:$rzvy_defaultlang['free']; 
								} ?></span><?php }?>
							</div>
							<div class="rzvy-listview-list-sub-info">
								<div><?php echo $service['description']; ?></div>
							</div>
						</div>
						<div class="rzvy-listview-list-badge-main">
							<?php if($service['badge']=="Y"){ ?>
								<div class="rzvy-listview-list-badge"><?php echo $service['badge_text']; ?></div>
							<?php } ?>
						</div>
					</div>
				</div>
				<?php 
			}else{
				$rzvy_freelabel= '';
				if(isset($rzvy_translangArr['free'])){ $rzvy_freelabel= $rzvy_translangArr['free']; }else{ $rzvy_freelabel= $rzvy_defaultlang['free']; }
				$service_price_display = 'N';				
				if($rzvy_price_display=='Y'){
					if($service['rate']>0){
						$service_price_display = 'Y';
					}elseif($service['rate']==0 && $rzvy_freelabel!=''){
						$service_price_display = 'Y';
					}
				}				
				?>
				<div class="item">
                  <figure>
					<?php $rzvyptclass = ''; if($rzvy_show_service_image == "Y"){ ?><img src="<?php if($service['image'] != "" && file_exists(dirname(dirname(dirname(__FILE__)))."/uploads/images/".$service['image'])){ echo SITE_URL."uploads/images/".$service['image']; }else{ echo SITE_URL."includes/images/noimage.png"; } ?>"><?php }else{ $rzvyptclass = 'rzvy-pt-figcaption'; } ?>
                    <figcaption class="<?php echo $rzvyptclass; ?>">
					<?php if($service['badge']=="Y"){ ?>
						<span class="tag"><?php echo $service['badge_text']; ?></span>
					<?php } ?>                   
                      <h3><?php echo ucwords($service["title"]); ?></h3>
                      <?php if($service['description']!=""){ ?>
						<p><?php if(strlen($service['description'])<=45){ echo $service['description']."..."; }else{ echo substr($service['description'], 0, 45)."..."; } ?></p>
					<?php } ?>
                      <div class="service-meta">
                        <?php if($service['duration']>0){ ?><span class="<?php echo ($service['rate']>0 && $service_price_display=='Y')?"pull-left":"text-center"; ?>"><i class="fa fa-clock-o"></i> <?php echo $service['duration']." Min."; ?></span><?php } if($service_price_display=='Y'){ ?><span class="<?php echo ($service['duration']>0)?"pull-right":"text-center"; ?>"><i class="fa fa-tag"></i> <?php if($service['rate']>0){ echo $obj_settings->rzvy_currency_position($rzvy_currency_symbol,$rzvy_currency_position,$service['rate']); }else{ echo $rzvy_freelabel; } ?></span><?php } ?>
                      </div>
                      <input type="radio" name="rzvy-services-radio" class="<?php echo $inputAlignment; ?> rzvy-services-radio-change" id="rzvy-services-radio-<?php echo $service["id"]; ?>" data-id="<?php echo $service["id"]; ?>">
					  <?php if($service['description']!=""){ ?>
						<a href="javascript:void(0);" class="read-more" data-bs-toggle="offcanvas" data-bs-target="#rzvy-view-service-modal-<?php echo $service['id']; ?>" aria-controls="<?php echo ucwords($service["title"]); ?>"><?php if(isset($rzvy_translangArr['read_more'])){ echo $rzvy_translangArr['read_more']; }else{ echo $rzvy_defaultlang['read_more']; } ?></a>
					  <?php } ?>
                    </figcaption>
                  </figure>
                </div>
				<?php 
			}
		} ?>
		</div>
	</div><?php 
	
	$obj_frontend->category_id = $_POST['id'];
	$all_services = $obj_frontend->get_services_by_cat_id();
	$nonlocation_services = 0;
	if(mysqli_num_rows($all_services)>0){
		while($service = mysqli_fetch_array($all_services)){
			if(isset($service['locations']) && $service['locations']!='' && $rzvy_location_selector_status=='Y'){
				$service_locations = explode(',',$service['locations']);
				if(isset($_SESSION['rzvy_location_selector_zipcode']) && !in_array($_SESSION['rzvy_location_selector_zipcode'],$service_locations)){ $nonlocation_services++; continue; }
				
			}
			if($service['description']==""){ continue; }
	?>
				<div class="offcanvas offcanvas-end" tabindex="-1" id="rzvy-view-service-modal-<?php echo $service["id"]; ?>">
				  <div class="offcanvas-header">
					<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
				  </div>
				  <div class="offcanvas-body">
					<?php 
					$service_image = $service['image'];
					if($service_image != '' && file_exists(dirname(dirname(dirname(__FILE__)))."/uploads/images/".$service_image)){
						$serviceimage = SITE_URL."uploads/images/".$service_image;
					}else{
						$serviceimage = SITE_URL."includes/images/noimage.png";
					}
					$otherdetailpart = "12";
					if($rzvy_show_service_image == "Y"){
						$otherdetailpart = "9";
						?>
						<div class="rzvy-image">
							<img src="<?php echo $serviceimage; ?>"/>
						</div>
						<?php
					}
					?>
					<h2><?php echo $service['title']; ?></h2>
					<p><?php echo ucfirst($service['description']); ?></p>
					<div class="service-meta">
						<?php if($rzvy_price_display=='Y'){ ?> <span><i class="fa fa-fw fa-money"></i>&nbsp;&nbsp;<strong><?php if(isset($rzvy_translangArr['rate_ad'])){ echo $rzvy_translangArr['rate_ad']; }else{ echo $rzvy_defaultlang['rate_ad']; } ?></strong>&nbsp;<?php echo $obj_settings->rzvy_currency_position($rzvy_currency_symbol,$rzvy_currency_position,$service['rate']); ?>	</span><?php } ?>
						<span><i class="fa fa-fw fa-clock-o"></i>&nbsp;&nbsp;<strong><?php if(isset($rzvy_translangArr['duration_ad'])){ echo $rzvy_translangArr['duration_ad']; }else{ echo $rzvy_defaultlang['duration_ad']; } ?></strong>&nbsp;<?php echo $service['duration']." Minutes"; ?></span>
						<span><i class="fa fa-fw fa-map-marker"></i>&nbsp;&nbsp;<strong><?php if(isset($rzvy_translangArr['service_locations'])){ echo $rzvy_translangArr['service_locations']; }else{ echo $rzvy_defaultlang['service_locations']; } ?> </strong>&nbsp;<?php if(isset($service['locations']) && $service['locations']!=''){ echo $service['locations']; }else{ if(isset($rzvy_translangArr['all_over'])){ echo $rzvy_translangArr['all_over']; }else{ echo $rzvy_defaultlang['all_over']; } } ?></span>	
					</div>
				  </div>
				</div>
				<?php 
			}	
		}
	
	
		if($nonlocation_services==mysqli_num_rows($all_services)){
			?>
			<h5 class="step-title"><?php if(isset($rzvy_translangArr['there_is_no_services_for_this_location'])){ echo $rzvy_translangArr['there_is_no_services_for_this_location']; }else{ echo $rzvy_defaultlang['there_is_no_services_for_this_location']; } ?></h5>
			<?php
		}
		if($rzvy_services_listing_view == "L"){
			?><div class="rzvy-listview mb-3"><?php 
		}
	}else{
		?>
		<h5 class="step-title"><?php if(isset($rzvy_translangArr['there_is_no_services_for_this_category'])){ echo $rzvy_translangArr['there_is_no_services_for_this_category']; }else{ echo $rzvy_defaultlang['there_is_no_services_for_this_category']; } ?></h5>
		<?php
	}
}

/* get addons by service id ajax */
else if(isset($_POST['get_multi_and_single_qty_addons_content'])){
	/*** multiple qty addons **/
	$obj_frontend->service_id = $_POST['id'];
	$readone_service = $obj_frontend->readone_service(); 
	$all_maddons = $obj_frontend->get_all_addons_by_service_id(); 
	/* $all_maddons = $obj_frontend->get_multiple_qty_addons_by_service_id();  */
	$maddons_count = mysqli_num_rows($all_maddons);
	
	$rzvy_booking_first_selection_as = $obj_settings->get_option("rzvy_booking_first_selection_as");
	if($rzvy_booking_first_selection_as == "allservices"){
		$_SESSION['rzvy_cart_category_id'] = $readone_service['cat_id'];
	}
	
	$_SESSION['rzvy_cart_service_id'] = $_POST['id'];
	$_SESSION['rzvy_cart_service_price'] = $readone_service['rate'];
	$subtotal = $readone_service['rate'];
	$rzvy_tax_status = $obj_settings->get_option('rzvy_tax_status');
	$rzvy_tax_type = $obj_settings->get_option('rzvy_tax_type');
	$rzvy_tax_value = $obj_settings->get_option('rzvy_tax_value');
	$rzvy_referral_discount_type = $obj_settings->get_option('rzvy_referral_discount_type');
	$rzvy_referral_discount_value = $obj_settings->get_option('rzvy_referral_discount_value');
			
	$obj_frontend->rzvy_cart_item_calculation($subtotal, $rzvy_tax_status, $rzvy_tax_type, $rzvy_tax_value, $rzvy_referral_discount_type, $rzvy_referral_discount_value);
	
	$_SESSION['rzvy_cart_items'] = array(); 
	$_SESSION['rzvy_cart_total_addon_duration'] = 0;
	if($maddons_count>0){ ?>
              
	<div id="rzvy_multipleqty_addon_html_content" class="rzvy_show_hide_addons pt-5 services <?php echo $alignmentClass; ?> <?php echo $rzvyrounded;?>">
		<div class="owl-carousel <?php if(in_array('sa',$rzvy_nocarousel_section)){ echo ' owl-carousel-without '; }  if(in_array('sa',$rzvy_nocarouselsm_section)){ echo ' owl-carousel-sm-without '; } ?>" data-items="3" data-items-lg="3" data-items-md="2" data-items-sm="2" data-items-ssm="1" data-margin="24" data-dots="true" data-nav="true"  autoplay="false"  autoplay="false" data-loop="<?php echo $rzvyloop; ?>">
			<?php 
			while($addon = mysqli_fetch_array($all_maddons)){ 
				$is_addonrequired = '';
				if($addon['required']=='Y' && $addon["multiple_qty"] == "Y"){
					$is_addonrequired = 'rzvy_required_multiqty rzvy_required';
				}
				if($addon['required']=='Y' && $addon["multiple_qty"] == "N"){
					$is_addonrequired = 'rzvy_required_singleqty rzvy_required';
				}
				
				$rzvy_freelabel= '';
				if(isset($rzvy_translangArr['free'])){ $rzvy_freelabel= $rzvy_translangArr['free']; }else{ $rzvy_freelabel= $rzvy_defaultlang['free']; }
				$addon_price_display = 'N';				
				if($rzvy_price_display=='Y'){
					if($addon['rate']>0){
						$addon_price_display = 'Y';
					}elseif($addon['rate']==0 && $rzvy_freelabel!=''){
						$addon_price_display = 'Y';
					}
				}
				
				?>
				<div class="item">
					<input id="rzvy-addon-card-mnl-<?php echo $addon['id']; ?>" type="hidden" value="<?php if($addon["multiple_qty"] == "N" || $addon["max_limit"] == 1){ echo "1"; }else{ echo $addon['min_limit']; } ?>" />
					<input id="rzvy-addon-card-ml-<?php echo $addon['id']; ?>" type="hidden" value="<?php if($addon["multiple_qty"] == "N" || $addon["max_limit"] == 1){ echo "1"; }else{ echo $addon['max_limit']; } ?>" />
                  <figure>
                    <?php $rzvyptclass = ''; if($rzvy_show_addon_image == "Y"){ ?><img src="<?php if($addon['image'] != "" && file_exists(dirname(dirname(dirname(__FILE__)))."/uploads/images/".$addon['image'])){ echo SITE_URL."uploads/images/".$addon['image']; }else{ echo SITE_URL."includes/images/noimage.png"; } ?>" class="<?php if($addon["multiple_qty"] == "Y" && $addon["max_limit"] > 1){ echo " rzvy_make_multipleqty_addon_card_selected"; } ?>" data-id="<?php echo $addon["id"]; ?>"><?php }else{ $rzvyptclass = 'rzvy-pt-figcaption'; } ?>
                    <figcaption class="<?php echo $rzvyptclass; ?>">
					  <?php if($addon['badge']=="Y"){ ?>
							<span class="tag <?php if($addon["multiple_qty"] == "Y" && $addon["max_limit"] > 1){ echo "rzvy_make_multipleqty_addon_card_selected"; } ?>" data-id="<?php echo $addon["id"]; ?>"><?php echo $addon['badge_text']; ?></span>
						<?php } ?>
                      <h3 <?php if($addon["multiple_qty"] == "Y" && $addon["max_limit"] > 1){ echo " rzvy_make_multipleqty_addon_card_selected"; } ?>><?php echo ucwords($addon["title"]); ?></h3>
                      <?php if($addon['description']!=""){ ?>
						<p class="<?php if($addon["multiple_qty"] == "Y" && $addon["max_limit"] > 1){ echo " rzvy_make_multipleqty_addon_card_selected"; } ?>" data-id="<?php echo $addon["id"]; ?>"><?php if(strlen($addon['description'])<=45){ echo $addon['description']."..."; }else{ echo substr($addon['description'], 0, 45)."..."; } ?></p>
					<?php } ?>
                      <div class="service-meta <?php if($addon["multiple_qty"] == "Y" && $addon["max_limit"] > 1){ echo " rzvy_make_multipleqty_addon_card_selected"; } ?>" data-id="<?php echo $addon["id"]; ?>">
                        <?php if($addon['duration']>0){ ?><span class="<?php echo ($addon['rate']>0 && $addon_price_display=='Y')?"pull-left":"text-center"; ?>"><i class="fa fa-clock-o"></i> <span class="rzvy_addon_duration_<?php echo $addon["id"]; ?>"><?php echo $addon['duration']." "; if(isset($rzvy_translangArr['min_dot'])){ echo $rzvy_translangArr['min_dot']; }else{ echo $rzvy_defaultlang['min_dot']; } ?></span></span><?php } if($addon_price_display=='Y'){ ?><span class="<?php echo ($addon['duration']>0)?"pull-right":"text-center"; ?>"><i class="fa fa-tag"></i> <span class="rzvy_addon_rate_<?php echo $addon["id"]; ?>"><?php if($addon['rate']>0){ echo $obj_settings->rzvy_currency_position($rzvy_currency_symbol,$rzvy_currency_position,$addon['rate']); }else{ echo $rzvy_freelabel; } ?></span></span><?php } ?>
                      </div>
                      <input type="checkbox" data-aid="<?php echo $addon["id"]; ?>" name="rzvy-addon-cb<?php echo $addon["id"]; ?>"  class="rzvy_addons_mltqty_cb <?php echo $inputAlignment.' '.$is_addonrequired; ?> 
						<?php if($addon["multiple_qty"] == "N" || $addon["max_limit"] == 1){ ?> rzvy-addon-card-singleqty-unit-selection
						<?php }else{ ?> rzvy-addon-card-multipleqty-unit-selection-<?php echo $addon["id"]; ?><?php } ?>" data-id="<?php echo $addon["id"]; ?>" <?php if($addon["multiple_qty"] == "N" || $addon["max_limit"] == 1){ ?> id="rzvy-addon-card-singleqty-unit-<?php echo $addon["id"]; ?>"<?php } ?>>
                      <?php if($addon["multiple_qty"] == "Y"){ ?>
					  <div class="quantity">
                       	<input class="form-control rzvy-addon-card-multipleqty-js-counter-value rzvy-addon-card-multipleqty-unit-<?php echo $addon['id']; ?>" type="number" data-id="<?php echo $addon['id']; ?>" value="0" disabled="disabled" tabindex="-1" min="0" max="10" required />
						
						<a href="javascript:void(0)"  id="rzvy-addon-card-multipleqty-minus-js-counter-btn-<?php echo $addon['id']; ?>" class="quantity-controler down rzvy-addon-card-multipleqty-js-counter-btn" data-action="minus" data-id="<?php echo $addon['id']; ?>"><i class="fa fa-minus"></i></a>
						
						<a href="javascript:void(0)"  class="quantity-controler up rzvy-addon-card-multipleqty-js-counter-btn" id="rzvy-addon-card-multipleqty-plus-js-counter-btn-<?php echo $addon['id']; ?>" data-action="plus" data-id="<?php echo $addon['id']; ?>"><i class="fa fa-plus"></i></a>
                      </div>
					  <?php } ?>
					  <?php if($addon['description']!=""){ ?>
						<a href="javascript:void(0);" class="read-more" data-bs-toggle="offcanvas" data-bs-target="#rzvy-view-addon-modal-<?php echo $addon['id']; ?>" aria-controls="<?php echo ucwords($addon["title"]); ?>"><?php if(isset($rzvy_translangArr['read_more'])){ echo $rzvy_translangArr['read_more']; }else{ echo $rzvy_defaultlang['read_more']; } ?></a>
					  <?php } ?>
                    </figcaption>
                  </figure>
                </div>
			<?php
			} 
			?>
		</div>
	</div>
	<?php }
	$obj_frontend->service_id = $_POST['id'];
	$all_maddons = $obj_frontend->get_all_addons_by_service_id(); 
	if($maddons_count>0){
		while($addon = mysqli_fetch_array($all_maddons)){
			if($addon['description']==""){ continue; }
			?>
			<div class="offcanvas offcanvas-end" tabindex="-1" id="rzvy-view-addon-modal-<?php echo $addon["id"]; ?>">
			  <div class="offcanvas-header">
				<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
			  </div>
			  <div class="offcanvas-body">
				<?php if($rzvy_show_addon_image == "Y"){ ?><img src="<?php if($addon['image'] != "" && file_exists(dirname(dirname(dirname(__FILE__)))."/uploads/images/".$addon['image'])){ echo SITE_URL."uploads/images/".$addon['image']; }else{ echo SITE_URL."includes/images/noimage.png"; } ?>"><?php } ?>
				
				<h2><?php echo $addon['title']; ?></h2>
				<p><?php echo ucfirst($addon['description']); ?></p>
				<div class="service-meta">
					<?php if($rzvy_price_display=='Y'){ ?><span><i class="fa fa-fw fa-money"></i>&nbsp;&nbsp;<strong><?php if(isset($rzvy_translangArr['rate_ad'])){ echo $rzvy_translangArr['rate_ad']; }else{ echo $rzvy_defaultlang['rate_ad']; } ?> </strong><?php  echo $obj_settings->rzvy_currency_position($rzvy_currency_symbol,$rzvy_currency_position,$addon['rate']); ?></span><?php } ?>
					
					<span><i class="fa fa-fw fa-clock-o"></i>&nbsp;&nbsp;<strong><?php if(isset($rzvy_translangArr['duration_ad'])){ echo $rzvy_translangArr['duration_ad']; }else{ echo $rzvy_defaultlang['duration_ad']; } ?> </strong><?php echo $addon['duration']." Minutes"; ?></span>
				</div>
			  </div>
			</div>
		<?php }
	}
	
}

/* get all frequently discount */
else if(isset($_POST['get_all_frequently_discount'])){
	$all_frequently_discount = $obj_frontend->get_all_frequently_discount(); 
	if(mysqli_num_rows($all_frequently_discount)>0){ 
		?>
		<div class="custom-controls">
            <div class="rzvy-container">
               <div class="row justify-content-center <?php echo $alignmentClass; ?>">
				<?php 
				while($fd_discount = mysqli_fetch_array($all_frequently_discount)){ 
					?>
					<div class="col-sm-6">
						<div class="form-check custom">
							<input type="radio" id="rzvy-frequently-discount-<?php echo $fd_discount['id']; ?>" name="rzvy-frequently-discount" class="rzvy-frequently-discount-change form-check-input" value="<?php echo $fd_discount['id']; ?>" />
							<label class="form-check-label" for="rzvy-frequently-discount-<?php echo $fd_discount['id']; ?>" <?php if($fd_discount['fd_description'] != ""){ echo ' data-toggle="tooltip" data-placement="bottom" title="'.$fd_discount['fd_description'].'"'; } ?>><?php if($fd_discount['fd_key']=="weekly"){ echo $fq_weekly_label; }else if($fd_discount['fd_key']=="bi weekly"){ echo $fq_biweekly_label; }else if($fd_discount['fd_key']=="monthly"){ echo $fq_monthly_label; }else{ echo $fq_one_time_label; } ?></label>
						</div>
					</div>
					<?php 
				} ?>
				</div>
			</div>
		</div>
		<?php 
	}else{
		$_SESSION['rzvy_cart_freqdiscount_id'] = "";
		$_SESSION['rzvy_cart_freqdiscount'] = 0;
		$_SESSION['rzvy_cart_freqdiscount_label'] = "";
		$_SESSION['rzvy_cart_freqdiscount_key'] = "";
	}
}

/* on change update frequently discount */
else if(isset($_POST['update_frequently_discount'])){
	$rzvy_tax_status = $obj_settings->get_option('rzvy_tax_status');
	$rzvy_tax_type = $obj_settings->get_option('rzvy_tax_type');
	$rzvy_tax_value = $obj_settings->get_option('rzvy_tax_value');
	$subtotal = $_SESSION['rzvy_cart_subtotal'];
	if($subtotal>0){
		$_SESSION['rzvy_cart_freqdiscount_id'] = $_POST["id"];
		$rzvy_referral_discount_type = $obj_settings->get_option('rzvy_referral_discount_type');
		$rzvy_referral_discount_value = $obj_settings->get_option('rzvy_referral_discount_value');
		$obj_frontend->rzvy_cart_item_calculation($subtotal, $rzvy_tax_status, $rzvy_tax_type, $rzvy_tax_value, $rzvy_referral_discount_type, $rzvy_referral_discount_value);
	}
}

/* Check and apply coupon ajax */
else if(isset($_POST['apply_coupon'])){
	$rzvy_tax_status = $obj_settings->get_option('rzvy_tax_status');
	$rzvy_tax_type = $obj_settings->get_option('rzvy_tax_type');
	$rzvy_tax_value = $obj_settings->get_option('rzvy_tax_value');
	$subtotal = $_SESSION['rzvy_cart_subtotal'];
	if($subtotal>0){			
		$rzvy_referral_discount_type = $obj_settings->get_option('rzvy_referral_discount_type');
		$rzvy_referral_discount_value = $obj_settings->get_option('rzvy_referral_discount_value');
		$couponuser = '';
		if(isset($_POST["coupon_user"]) && $_POST["coupon_user"]=='ec'){
			$couponuser = 'E';
		}elseif(isset($_POST["coupon_user"]) && $_POST["coupon_user"]=='nc'){
			$couponuser = 'N';
		}elseif(isset($_POST["coupon_user"]) && $_POST["coupon_user"]=='gc'){
			$couponuser = 'G';
		}
		
		if(isset($_POST["apply_input"])){
			$obj_frontend->coupon_id = $_POST["id"];
			$couponinfo =  $obj_frontend->get_coupon_id_by_couponcode();
		}else{
			$obj_frontend->coupon_id = $_POST['id'];
			$couponinfo = $obj_frontend->get_coupon_info_by_id();
		}	

		if($couponinfo!=''){			
			$couponcheck = '';
			$errorcheck = '';
			if($couponinfo['usage']=='M' && $couponuser!='' && (is_numeric(strpos($couponinfo['users'],'A')) || is_numeric(strpos($couponinfo['users'],$couponuser)))){
				$couponcheck = 'y';
			}elseif($couponinfo['usage']=='O' && $couponuser=='E' && (is_numeric(strpos($couponinfo['users'],'E')) || is_numeric(strpos($couponinfo['users'],'A')))){
				if(isset($_SESSION['customer_id']) && $_SESSION['customer_id']!=''){
					$obj_frontend->customer_id = $_SESSION['customer_id'];
					$obj_frontend->coupon_id = $couponinfo['id'];
					if($obj_frontend->check_available_coupon_of_existing_customer()=='not used'){
						$couponcheck = 'y';
					}else{
						$errorcheck = 'Y';
						if(isset($rzvy_translangArr['coupon_code_already_used'])){ echo $rzvy_translangArr['coupon_code_already_used']; }else{ echo $rzvy_defaultlang['coupon_code_already_used']; }
					}
				}else{
					$errorcheck = 'Y';
					if(isset($rzvy_translangArr['you_must_login_to_use_this_cc'])){ echo $rzvy_translangArr['you_must_login_to_use_this_cc']; }else{ echo $rzvy_defaultlang['you_must_login_to_use_this_cc']; }
				}					
			}elseif($couponinfo['usage']=='O' && $couponuser!='E' && (is_numeric(strpos($couponinfo['users'],$couponuser)) ||  is_numeric(strpos($couponinfo['users'],'A')) )){				
				$couponcheck = 'y';
			}
			if($couponcheck=='y'){
				$_SESSION['rzvy_cart_couponid'] = $couponinfo['id'];
				$obj_frontend->rzvy_cart_item_calculation($subtotal, $rzvy_tax_status, $rzvy_tax_type, $rzvy_tax_value, $rzvy_referral_discount_type, $rzvy_referral_discount_value);
				echo "available";
			}
			if($couponcheck=='' && $errorcheck==''){
				if(isset($rzvy_translangArr['invalid_coupon_code_you_not_allowed'])){ echo $rzvy_translangArr['invalid_coupon_code_you_not_allowed']; }else{ echo $rzvy_defaultlang['invalid_coupon_code_you_not_allowed']; }
			}				
		}else{
			if(isset($rzvy_translangArr['coupon_code_invalid_expired'])){ echo $rzvy_translangArr['coupon_code_invalid_expired']; }else{ echo $rzvy_defaultlang['coupon_code_invalid_expired']; }
		}	
	}else{
		if(isset($rzvy_translangArr['copuon_cannot_apply_to_empty_cart_value'])){ echo $rzvy_translangArr['copuon_cannot_apply_to_empty_cart_value']; }else{ echo $rzvy_defaultlang['copuon_cannot_apply_to_empty_cart_value']; }
	}
}

/* remove applied coupon ajax */
else if(isset($_POST['remove_applied_coupon'])){
	$rzvy_tax_status = $obj_settings->get_option('rzvy_tax_status');
	$rzvy_tax_type = $obj_settings->get_option('rzvy_tax_type');
	$rzvy_tax_value = $obj_settings->get_option('rzvy_tax_value');
	$subtotal = $_SESSION['rzvy_cart_subtotal'];
	if($subtotal>0){
		$_SESSION['rzvy_cart_couponid'] = "";
		$rzvy_referral_discount_type = $obj_settings->get_option('rzvy_referral_discount_type');
		$rzvy_referral_discount_value = $obj_settings->get_option('rzvy_referral_discount_value');
		$obj_frontend->rzvy_cart_item_calculation($subtotal, $rzvy_tax_status, $rzvy_tax_type, $rzvy_tax_value, $rzvy_referral_discount_type, $rzvy_referral_discount_value);
	}
}

/* add feedback ajax */
else if(isset($_POST['add_feedback'])){
	$rzvy_settings_timezone = $obj_settings->get_option("rzvy_timezone");
	$rzvy_server_timezone = date_default_timezone_get();
	$currDateTime_withTZ = $obj_settings->get_current_time_according_selected_timezone($rzvy_server_timezone,$rzvy_settings_timezone); 
	
	$obj_frontend->feedback_name = htmlentities($_POST['name']);
	$obj_frontend->feedback_email = trim(strip_tags(mysqli_real_escape_string($conn, $_POST['email'])));
	$obj_frontend->feedback_rating = $_POST['rating'];
	$obj_frontend->feedback_review = htmlentities($_POST['review']);
	$obj_frontend->feedback_review_datetime = date("Y-m-d H:i:s", $currDateTime_withTZ);
	$added = $obj_frontend->add_feedback(); 
	if($added){
		echo "added";
	}
}
/* Check feedback exist ajax */
else if(isset($_POST['check_feedback_exist'])){
	
	$obj_frontend->feedback_email = trim(strip_tags(mysqli_real_escape_string($conn, $_POST['email'])));
	$checkfeedback = $obj_frontend->check_feedback_exist(); 
	if(mysqli_num_rows($checkfeedback)>0){
		echo "exist";
	}
}
/* Get available slots ajax */
else if(isset($_POST['get_slots'])){ 
	$rzvy_settings_timezone = $obj_settings->get_option("rzvy_timezone");
	$rzvy_server_timezone = date_default_timezone_get();
	$currDateTime_withTZ = $obj_settings->get_current_time_according_selected_timezone($rzvy_server_timezone,$rzvy_settings_timezone); 

	$selected_date = date("Y-m-d", strtotime($_POST['selected_date']));
	$selected_date = date($selected_date, $currDateTime_withTZ);
	
	$isEndTime = false;
	
	$rzvy_hide_already_booked_slots_from_frontend_calendar = $obj_settings->get_option('rzvy_hide_already_booked_slots_from_frontend_calendar');
	$rzvy_minimum_advance_booking_time = $obj_settings->get_option('rzvy_minimum_advance_booking_time');
	$rzvy_maximum_advance_booking_time = $obj_settings->get_option('rzvy_maximum_advance_booking_time');

	/** check for maximum advance booking time **/
	$current_datetime = strtotime(date("Y-m-d H:i:s", $currDateTime_withTZ));
	$maximum_date = date("Y-m-d", strtotime('+'.$rzvy_maximum_advance_booking_time.' months', $current_datetime));
	$maximum_date = date($maximum_date, $currDateTime_withTZ);

	/** check for minimum advance booking time **/
	$minimum_date = date("Y-m-d H:i:s", strtotime("+".$rzvy_minimum_advance_booking_time." minutes", $current_datetime));  
	
	/** check for GC bookings START **/
	$gc_twowaysync_eventsArr = array();
	$rzvy_gc_status = $obj_settings->get_option('rzvy_gc_status');
	$rzvy_gc_twowaysync = $obj_settings->get_option('rzvy_gc_twowaysync');
	$rzvy_gc_clientid = $obj_settings->get_option('rzvy_gc_clientid');
	$rzvy_gc_clientsecret = $obj_settings->get_option('rzvy_gc_clientsecret');
	$rzvy_gc_accesstoken = $obj_settings->get_option('rzvy_gc_accesstoken');
	$rzvy_gc_accesstoken = base64_decode($rzvy_gc_accesstoken);
	
	if($rzvy_gc_status == "Y" && $rzvy_gc_twowaysync == "Y" && $rzvy_gc_clientid != "" && $rzvy_gc_clientsecret != "" && $rzvy_gc_accesstoken != ""){
		$getNewTime = new \DateTime('now', new DateTimeZone($rzvy_settings_timezone));
		$timezoneOffset = $getNewTime->format('P');
		
		include(dirname(dirname(dirname(__FILE__)))."/includes/google-calendar/vendor/autoload.php");
		$client = new Google_Client();
		$client->setScopes(Google_Service_Calendar::CALENDAR_EVENTS);
		$client->setClientId($rzvy_gc_clientid);
		$client->setClientSecret($rzvy_gc_clientsecret);
		$client->setAccessType('offline');
		$client->setPrompt('select_account consent');

		$accessToken = unserialize($rzvy_gc_accesstoken);
		$client->setAccessToken($accessToken);
		if ($client->isAccessTokenExpired()) {
			$newAccessToken = $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
			$obj_settings->update_option('rzvy_gc_accesstoken',base64_encode(serialize($newAccessToken)));
		}
		$service = new Google_Service_Calendar($client);

		$calendarId = (($obj_settings->get_option('rzvy_gc_calendarid')!= "")?$obj_settings->get_option('rzvy_gc_calendarid'):'primary');
		$optParams = array(
		  'orderBy' => 'startTime',
		  'singleEvents' => true,
		  'timeZone' => $rzvy_settings_timezone,
		  'timeMin' => $selected_date.'T00:00:00'.$timezoneOffset,
		  'timeMax' => $selected_date.'T23:59:59'.$timezoneOffset,
		);
		$results = $service->events->listEvents($calendarId, $optParams);
		$events = $results->getItems();

		if (!empty($events)) {
			foreach ($events as $event) {
				if(!isset($event->transparency) || (isset($event->transparency) && $event->transparency!='transparent')){			
					$EventStartTime = substr($event->start->dateTime, 0, 19);
					$EventEndTime = substr($event->end->dateTime, 0, 19);
					$gcEventArr = array();
					$gcEventArr['start'] = date("Y-m-d H:i", strtotime(str_replace("T"," ",$EventStartTime)));
					$gcEventArr['end'] = date("Y-m-d H:i", strtotime(str_replace("T"," ",$EventEndTime)));
					array_push($gc_twowaysync_eventsArr, $gcEventArr);
					array_push($obj_slots->endtime_arr, strtotime(str_replace("T"," ",$EventEndTime)));
				}
			}
		}
	}
	/** check for GC bookings END **/
	
	/** check for staff GC bookings START **/
	if($_SESSION['rzvy_staff_id']>0){
		$obj_settings->staff_id = $_SESSION['rzvy_staff_id'];
		$rzvy_gc_status = $obj_settings->get_staff_option('rzvy_gc_status');
		$rzvy_gc_twowaysync = $obj_settings->get_staff_option('rzvy_gc_twowaysync');
		$rzvy_gc_accesstoken = $obj_settings->get_staff_option('rzvy_gc_accesstoken');
		$rzvy_gc_accesstoken = base64_decode($rzvy_gc_accesstoken);
		
		if($rzvy_gc_status == "Y" && $rzvy_gc_twowaysync == "Y" && $rzvy_gc_clientid != "" && $rzvy_gc_clientsecret != "" && $rzvy_gc_accesstoken != ""){
			$getNewTime = new \DateTime('now', new DateTimeZone($rzvy_settings_timezone));
			$timezoneOffset = $getNewTime->format('P');
			
			include(dirname(dirname(dirname(__FILE__)))."/includes/google-calendar/vendor/autoload.php");
			$client = new Google_Client();
			$client->setScopes(Google_Service_Calendar::CALENDAR_EVENTS);
			$client->setClientId($rzvy_gc_clientid);
			$client->setClientSecret($rzvy_gc_clientsecret);
			$client->setAccessType('offline');
			$client->setPrompt('select_account consent');

			$accessToken = unserialize($rzvy_gc_accesstoken);
			$client->setAccessToken($accessToken);
			if ($client->isAccessTokenExpired()) {
				$newAccessToken = $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
				$obj_settings->update_staff_option('rzvy_gc_accesstoken',base64_encode(serialize($newAccessToken)));
			}
			$service = new Google_Service_Calendar($client);

			$calendarId = (($obj_settings->get_staff_option('rzvy_gc_calendarid')!= "")?$obj_settings->get_staff_option('rzvy_gc_calendarid'):'primary');
			$optParams = array(
			  'orderBy' => 'startTime',
			  'singleEvents' => true,
			  'timeZone' => $rzvy_settings_timezone,
			  'timeMin' => $selected_date.'T00:00:00'.$timezoneOffset,
			  'timeMax' => $selected_date.'T23:59:59'.$timezoneOffset,
			);
			$results = $service->events->listEvents($calendarId, $optParams);
			$events = $results->getItems();

			if (!empty($events)) {
				foreach ($events as $event) {
					if(!isset($event->transparency) || (isset($event->transparency) && $event->transparency!='transparent')){			
						$EventStartTime = substr($event->start->dateTime, 0, 19);
						$EventEndTime = substr($event->end->dateTime, 0, 19);
						$gcEventArr = array();
						$gcEventArr['start'] = date("Y-m-d H:i", strtotime(str_replace("T"," ",$EventStartTime)));
						$gcEventArr['end'] = date("Y-m-d H:i", strtotime(str_replace("T"," ",$EventEndTime)));
						array_push($obj_slots->endtime_arr, strtotime(str_replace("T"," ",$EventEndTime)));
						array_push($gc_twowaysync_eventsArr, $gcEventArr);
					}
				}
			}
		}
	}
	/** check for staff GC bookings END **/ 	
	
	$available_slots = $obj_slots->generate_available_slots_dropdown($time_interval, $rzvy_time_format, $selected_date, $advance_bookingtime, $currDateTime_withTZ, $isEndTime, $_SESSION['rzvy_cart_service_id'], $_SESSION['rzvy_cart_total_addon_duration']);
	
	$no_booking = $available_slots['no_booking'];
	if($available_slots['no_booking']<0){
		$no_booking = 0;
	}
	?>
	<div class="pt-1 pb-1 pl-4 pr-4 whitebox">
		<div class="row">
			<div class="col-md-12 rzvy-sm-box mb-1">
				<a href="javascript:void(0);" class="rzvy_back_to_calendar"><i class="fa fa-caret-up fa-2x"></i> <?php if(isset($rzvy_translangArr['reset_date'])){ echo $rzvy_translangArr['reset_date']; }else{ echo $rzvy_defaultlang['reset_date']; } ?></a>
				<a href="javascript:void(0);" class="rzvy_reset_slot_selection pull-right" data-day="<?php echo $selected_date; ?>"><i class="fa fa-refresh"></i> <?php if(isset($rzvy_translangArr['reset_slots'])){ echo $rzvy_translangArr['reset_slots']; }else{ echo $rzvy_defaultlang['reset_slots']; } ?></a>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12 rzvy-sm-box mb-2 text-center pt-3">
				<h6><i class="fa fa-calendar"></i> <?php echo date($rzvy_date_format, strtotime($selected_date)); ?></h6>
			</div>
		</div>
		<div class="row slot_refresh_div">
			<?php 
			/** maximum date check **/		
			if(strtotime($selected_date)>strtotime($maximum_date)){ 
				?>
				<div class="col-md-12 rzvy-sm-box rzvy_slot_new mb-2 text-center pt-3">
					<h6><?php if(isset($rzvy_translangArr['you_cannot_book_appointment_on'])){ echo $rzvy_translangArr['you_cannot_book_appointment_on']; }else{ echo $rzvy_defaultlang['you_cannot_book_appointment_on']; } ?> <?php echo date($rzvy_date_format, strtotime($selected_date)); ?>. <?php if(isset($rzvy_translangArr['our_maximum_advance_booking_period_is'])){ echo $rzvy_translangArr['our_maximum_advance_booking_period_is']; }else{ echo $rzvy_defaultlang['our_maximum_advance_booking_period_is']; } ?> <?php 
						if($rzvy_maximum_advance_booking_time == "1"){ echo "1 Month"; }
						else if($rzvy_maximum_advance_booking_time == "3"){ echo "3 Month"; }
						else if($rzvy_maximum_advance_booking_time == "6"){ echo "6 Month"; }
						else if($rzvy_maximum_advance_booking_time == "9"){ echo "9 Month"; }
						else if($rzvy_maximum_advance_booking_time == "12"){ echo "1 Year"; }
						else if($rzvy_maximum_advance_booking_time == "18"){ echo "1.5 Year"; }
						else if($rzvy_maximum_advance_booking_time == "24"){ echo "2 Year"; } 
					?>. <?php if(isset($rzvy_translangArr['so_you_can_book_appointment_till'])){ echo $rzvy_translangArr['so_you_can_book_appointment_till']; }else{ echo $rzvy_defaultlang['so_you_can_book_appointment_till']; } ?> <?php echo $maximum_date; ?></h6>
				</div>
				<?php 
			}
			/** time slots **/
			else if(isset($available_slots['slots']) && sizeof($available_slots['slots'])>0){
				$i = 1;
				$j = 0;
				foreach($available_slots['slots'] as $slot){
					$no_curr_boookings = $obj_slots->get_slot_bookings($selected_date." ".$slot,$_SESSION['rzvy_cart_service_id']);
					$bookings_blocks = $obj_slots->get_bookings_blocks($selected_date, $slot, $available_slots["serviceaddonduration"]);
					if(strtotime($selected_date." ".$slot)<strtotime($minimum_date)){
						continue;
					}else if(!$bookings_blocks){
						continue;
					}else{
						$booked_slot_exist = false;
						foreach($gc_twowaysync_eventsArr as $event){
							if(strtotime($event["start"]) <= strtotime($selected_date." ".$slot) && strtotime($event["end"]) > strtotime($selected_date." ".$slot)){
								$no_curr_boookings += 1;
							}
							if(strtotime($event["start"]) <= strtotime($selected_date." ".$slot) && strtotime($event["end"]) > strtotime($selected_date." ".$slot) && $no_booking==0){
								$booked_slot_exist = true;
								continue;
							} 
							if(strtotime($event["start"]) <= strtotime($selected_date." ".$slot) && strtotime($event["end"]) > strtotime($selected_date." ".$slot) && $no_booking!=0 && $no_curr_boookings>=$no_booking){
								$booked_slot_exist = true;
								continue;
							} 
						}
						
						$new_endtime_timestamp = strtotime("+".$available_slots["serv_timeinterval"]." minutes", strtotime($selected_date." ".$slot));
						$new_starttime_timestamp = strtotime($selected_date." ".$slot);
						
						foreach($available_slots['booked'] as $bslot){
							if($bslot["start_time"] <= strtotime($selected_date." ".$slot) && $bslot["end_time"] > strtotime($selected_date." ".$slot) && $no_booking==0){
								$booked_slot_exist = true;
								continue;
							}
							if($bslot["start_time"] <= strtotime($selected_date." ".$slot) && $bslot["end_time"] > strtotime($selected_date." ".$slot) && $no_booking!=0 && $no_curr_boookings>=$no_booking){
								$booked_slot_exist = true;
								continue;
							} 
							if($new_starttime_timestamp <= $bslot["start_time"] && $new_endtime_timestamp > $bslot["start_time"] && $no_booking==0){
								$booked_slot_exist = true;
								continue;
							}
							
							if($new_starttime_timestamp <= $bslot["start_time"] && $new_endtime_timestamp > $bslot["start_time"] && $no_booking!=0){
							    $no_curr_boookings = $no_curr_boookings+1;
							    if($no_curr_boookings>=$no_booking){
    								$booked_slot_exist = true;
    								continue;
							    }
							} 
							if($new_starttime_timestamp < $bslot["end_time"] && $new_endtime_timestamp > $bslot["end_time"] && $no_booking==0){
								$booked_slot_exist = true;
								continue;
							}
							
							if($new_starttime_timestamp < $bslot["end_time"] && $new_endtime_timestamp > $bslot["end_time"] && $no_booking!=0){
							    $no_curr_boookings = $no_curr_boookings+1;
							    if($no_curr_boookings>=$no_booking){
    								$booked_slot_exist = true;
    								continue;
							    }
							} 
						}
						
						if($booked_slot_exist && $rzvy_hide_already_booked_slots_from_frontend_calendar == "Y"){
							continue;
						}else if($booked_slot_exist && $rzvy_hide_already_booked_slots_from_frontend_calendar == "N" && $no_booking==0){ 
							$blockoff_exist = false;
							if(sizeof($available_slots['block_off'])>0){
								foreach($available_slots['block_off'] as $block_off){
									if((strtotime($selected_date." ".$block_off["start_time"]) <= strtotime($selected_date." ".$slot)) && (strtotime($selected_date." ".$block_off["end_time"]) > strtotime($selected_date." ".$slot))){
										$blockoff_exist = true;
										continue;
									} 
								}
							} 
							if($blockoff_exist){
								continue;
							} 
							?>
							<div class="col-md-3 rzvy-sm-box rzvy_slot_new">
								<div class="rzvy-styled-radio-second rzvy-styled-radio-disable form-check custom">
									<input type="radio" id="rzvy-booked-time-slot-<?php echo $i; ?>" name="rzvy-booked-time-slots" class="rzvy-styled-radio-disable"  disabled>
									<label for="rzvy-booked-time-slot-<?php echo $i; ?>" disabled><?php echo date($rzvy_time_format,strtotime($selected_date." ".$slot)); ?></label>
								</div>
							</div>
							<?php 
							$j++;
						}else if($booked_slot_exist && $rzvy_hide_already_booked_slots_from_frontend_calendar == "N" && $no_booking!=0 && $no_curr_boookings>=$no_booking){ 
							$blockoff_exist = false;
							if(sizeof($available_slots['block_off'])>0){
								foreach($available_slots['block_off'] as $block_off){
									if((strtotime($selected_date." ".$block_off["start_time"]) <= strtotime($selected_date." ".$slot)) && (strtotime($selected_date." ".$block_off["end_time"]) > strtotime($selected_date." ".$slot))){
										$blockoff_exist = true;
										continue;
									} 
								}
							} 
							if($blockoff_exist){
								continue;
							} 
							?>
							<div class="col-md-3 rzvy-sm-box rzvy_slot_new">
								<div class="rzvy-styled-radio-second rzvy-styled-radio-disable form-check custom">
									<input type="radio" id="rzvy-booked-time-slot-<?php echo $i; ?>" name="rzvy-booked-time-slots" class="rzvy-styled-radio-disable" disabled>
									<label for="rzvy-booked-time-slot-<?php echo $i; ?>" disabled><?php echo date($rzvy_time_format,strtotime($selected_date." ".$slot)); ?></label>
								</div>
							</div>
							<?php 
							$j++;
						}else{ 
							$blockoff_exist = false;
							if(sizeof($available_slots['block_off'])>0){
								foreach($available_slots['block_off'] as $block_off){
									if((strtotime($selected_date." ".$block_off["start_time"]) <= strtotime($selected_date." ".$slot)) && (strtotime($selected_date." ".$block_off["end_time"]) > strtotime($selected_date." ".$slot))){
										$blockoff_exist = true;
										continue;
									} 
								}
							} 
							if($blockoff_exist){
								continue;
							} 
							?>
							<div class="col-md-3 rzvy-sm-box rzvy_slot_new">
								<div class="rzvy-styled-radio rzvy-styled-radio-second form-check custom">
									<input type="radio" class="rzvy_time_slots_selection" id="rzvy-time-slot-<?php echo $i; ?>" name="rzvy-time-slots" value="<?php echo $slot; ?>">
									<label for="rzvy-time-slot-<?php echo $i; ?>"><?php echo date($rzvy_time_format, strtotime($selected_date." ".$slot)); ?></label>
								</div>
							</div>
							<?php 
							$j++;
						}
						$i++;
					}
				}
				if($j == 0){ 
					?>
					<div class="col-md-12 rzvy-sm-box rzvy_slot_new col-md-12 rzvy-sm-box mb-2 text-center pt-3">
						<h6><?php if(isset($rzvy_translangArr['none_of_slots_available_on'])){ echo $rzvy_translangArr['none_of_slots_available_on']; }else{ echo $rzvy_defaultlang['none_of_slots_available_on']; } ?> <?php echo date($rzvy_date_format, strtotime($selected_date)); ?></h6>
					</div>
					<?php 
				}
			}else{ 
				?>
				<div class="col-md-12 rzvy-sm-box rzvy_slot_new col-md-12 rzvy-sm-box mb-2 text-center pt-3">
					<h6><?php if(isset($rzvy_translangArr['none_of_slots_available_on'])){ echo $rzvy_translangArr['none_of_slots_available_on']; }else{ echo $rzvy_defaultlang['none_of_slots_available_on']; } ?> <?php echo date($rzvy_date_format, strtotime($selected_date)); ?></h6>
				</div>
				<?php 
			} 
			?>
		</div>
		<div class="rzvy-inline-calendar-container-boxshadow rzvy_selected_slot_detail pl-5 pr-5 pb-2 pt-3 mt-3 mb-3 text-center"></div>
	</div>
	<?php 
}

/* Endtime available slots ajax */
else if(isset($_POST['get_endtime_slots'])){ 
	$rzvy_settings_timezone = $obj_settings->get_option("rzvy_timezone");
	$rzvy_server_timezone = date_default_timezone_get();
	$currDateTime_withTZ = $obj_settings->get_current_time_according_selected_timezone($rzvy_server_timezone,$rzvy_settings_timezone); 

	$selected_date = date("Y-m-d", strtotime($_POST['selected_date']));
	$selected_date = date($selected_date, $currDateTime_withTZ);

	$isEndTime = true; 
	$available_slots = $obj_slots->generate_available_slots_dropdown($time_interval, $rzvy_time_format, $selected_date, $advance_bookingtime, $currDateTime_withTZ, $isEndTime, $_SESSION['rzvy_cart_service_id'], $_SESSION['rzvy_cart_total_addon_duration']);
	
	$no_booking = $available_slots['no_booking'];
	if($available_slots['no_booking']<0){
		$no_booking = 0;
	}
	
	
	$rzvy_hide_already_booked_slots_from_frontend_calendar = $obj_settings->get_option('rzvy_hide_already_booked_slots_from_frontend_calendar');
	$rzvy_minimum_advance_booking_time = $obj_settings->get_option('rzvy_minimum_advance_booking_time');
	$rzvy_maximum_advance_booking_time = $obj_settings->get_option('rzvy_maximum_advance_booking_time');
	
	/** check for maximum advance booking time **/
	$current_datetime = strtotime(date("Y-m-d H:i:s", $currDateTime_withTZ));
	$maximum_date = date("Y-m-d", strtotime('+'.$rzvy_maximum_advance_booking_time.' months', $current_datetime));
	$maximum_date = date($maximum_date, $currDateTime_withTZ);

	/** check for minimum advance booking time **/
	$minimum_date = date("Y-m-d H:i:s", strtotime("+".$rzvy_minimum_advance_booking_time." minutes", $current_datetime));  
	
	/** check for maximum end time slot limit **/
	$rzvy_maximum_endtimeslot_limit = $obj_settings->get_option('rzvy_maximum_endtimeslot_limit');
	$selected_slot_check = strtotime($selected_date." ".$_POST["selected_slot"]);
	$maximum_endslot_limit = date("Y-m-d H:i:s", strtotime("+".$rzvy_maximum_endtimeslot_limit." minutes", $selected_slot_check));  
	?>
	<div class="pt-1 pb-1 pl-4 pr-4 whitebox">
		<div class="row">
			<div class="col-md-12 rzvy-sm-box mb-1 text-center">
				<a href="javascript:void(0);" class="rzvy_back_to_calendar"><label><b><i class="fa fa-caret-up fa-3x"></i></b></label></a>
				<a href="javascript:void(0);" class="rzvy_reset_slot_selection pull-right" data-day="<?php echo $selected_date; ?>"><label><b><i class="fa fa-refresh"></i> <?php if(isset($rzvy_translangArr['reset'])){ echo $rzvy_translangArr['reset']; }else{ echo $rzvy_defaultlang['reset']; } ?></b></label></a>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12 rzvy-sm-box mb-3 text-center">
				<label><b><i class="fa fa-calendar"></i> <?php echo date($rzvy_date_format, strtotime($selected_date)); ?></b></label>
				<br/>
				<label><b><?php if(isset($rzvy_translangArr['from'])){ echo $rzvy_translangArr['from']; }else{ echo $rzvy_defaultlang['from']; } ?>: <i class="fa fa-clock-o"></i> <?php echo date($rzvy_time_format, strtotime($selected_date." ".$_POST["selected_slot"])); ?></b></label>
			</div>
		</div>
		<div class="row">
			<?php 
			/** maximum date check **/		
			if(strtotime($selected_date)>strtotime($maximum_date)){ 
				?>
				<div class="col-md-12 rzvy-sm-box rzvy_slot_new">
					<label><b>[ <?php if(isset($rzvy_translangArr['you_cannot_book_appointment_on'])){ echo $rzvy_translangArr['you_cannot_book_appointment_on']; }else{ echo $rzvy_defaultlang['you_cannot_book_appointment_on']; } ?> <?php echo date($rzvy_date_format, strtotime($selected_date)); ?>. <?php if(isset($rzvy_translangArr['our_maximum_advance_booking_period_is'])){ echo $rzvy_translangArr['our_maximum_advance_booking_period_is']; }else{ echo $rzvy_defaultlang['our_maximum_advance_booking_period_is']; } ?> <?php 
						if($rzvy_maximum_advance_booking_time == "1"){ echo "1 Month"; }
						else if($rzvy_maximum_advance_booking_time == "3"){ echo "3 Month"; }
						else if($rzvy_maximum_advance_booking_time == "6"){ echo "6 Month"; }
						else if($rzvy_maximum_advance_booking_time == "9"){ echo "9 Month"; }
						else if($rzvy_maximum_advance_booking_time == "12"){ echo "1 Year"; }
						else if($rzvy_maximum_advance_booking_time == "18"){ echo "1.5 Year"; }
						else if($rzvy_maximum_advance_booking_time == "24"){ echo "2 Year"; } 
					?>. <?php if(isset($rzvy_translangArr['so_you_can_book_appointment_till'])){ echo $rzvy_translangArr['so_you_can_book_appointment_till']; }else{ echo $rzvy_defaultlang['so_you_can_book_appointment_till']; } ?> <?php echo $maximum_date; ?>. ]</b></label>
				</div>
				<?php 
			}
			/** time slots **/
			else if(isset($available_slots['slots']) && sizeof($available_slots['slots'])>0){
				$i = 1;
				$j = 0;
				foreach($available_slots['slots'] as $slot){
					if(strtotime($selected_date." ".$slot)<strtotime($minimum_date)){
						continue;
					}else{
						if(strtotime($selected_date." ".$slot) <= strtotime($selected_date." ".$_POST["selected_slot"])){
							continue;
						}elseif(strtotime($selected_date." ".$slot) > strtotime($maximum_endslot_limit)){
							continue;
						}else{
							$booked_slot_exist = false;
							foreach($available_slots['booked'] as $bslot){
								if($bslot["start_time"] <= strtotime($selected_date." ".$slot) && $bslot["end_time"] > strtotime($selected_date." ".$slot)){
									$booked_slot_exist = true;
									continue;
								} 
							}
							if($booked_slot_exist){
								break;
							}else{ 
								$blockoff_exist = false;
								if(sizeof($available_slots['block_off'])>0){
									foreach($available_slots['block_off'] as $block_off){
										if((strtotime($selected_date." ".$block_off["start_time"]) <= strtotime($selected_date." ".$slot)) && (strtotime($selected_date." ".$block_off["end_time"]) > strtotime($selected_date." ".$slot))){
											$blockoff_exist = true;
											continue;
										} 
									}
								} 
								$no_curr_boookings = $obj_slots->get_slot_bookings($selected_date." ".$slot,$_SESSION['rzvy_cart_service_id']);
								if($no_booking!=0 && $no_curr_boookings>=$no_booking){
									continue;
								}
								if($blockoff_exist){
									break;
								} 
								?>
								<div class="col-md-3 rzvy-sm-box rzvy_slot_new">
									<div class="rzvy-styled-radio rzvy-styled-radio-second form-check">
										<input type="radio" class="rzvy_endtime_slots_selection" id="rzvy-time-slot-<?php echo $i; ?>" name="rzvy-time-slots" value="<?php echo $slot; ?>">
										<label for="rzvy-time-slot-<?php echo $i; ?>"><?php echo date($rzvy_time_format,strtotime($selected_date." ".$slot)); ?></label>
									</div>
								</div>
								<?php 
								$j++;
							}
						}
						$i++;
					}
				}
				if($j == 0){ 
					if(is_numeric($_SESSION['rzvy_cart_service_id']) && $_SESSION['rzvy_cart_service_id'] != "0"){
						$time_interval=$obj_slots->get_service_time_interval($_SESSION['rzvy_cart_service_id'],$time_interval);
					}
					$sdate_stime = strtotime($selected_date." ".$_POST["selected_slot"]);
					$sdate_etime = date("Y-m-d H:i:s", strtotime("+".$time_interval." minutes", $sdate_stime));
					$sdate_estime = date("H:i:s", strtotime($sdate_etime));
					$no_curr_boookings = $obj_slots->get_slot_bookings($sdate_etime,$_SESSION['rzvy_cart_service_id']);
					if($no_booking!=0 && $no_curr_boookings>=$no_booking){
						?>
						<div class="col-md-12 rzvy-sm-box rzvy_slot_new">
							<label><b>[ <?php if(isset($rzvy_translangArr['none_of_slots_available_on'])){ echo $rzvy_translangArr['none_of_slots_available_on']; }else{ echo $rzvy_defaultlang['none_of_slots_available_on']; } ?> <?php echo date($rzvy_date_format, strtotime($selected_date)); ?>. ]</b></label>
						</div>
						<?php
					}else{
						?>
						<div class="col-md-3 rzvy-sm-box rzvy_slot_new">
							<div class="rzvy-styled-radio rzvy-styled-radio-second">
								<input type="radio" class="rzvy_endtime_slots_selection" id="rzvy-time-slot-<?php echo $i; ?>" name="rzvy-time-slots" value="<?php echo $sdate_estime; ?>">
								<label for="rzvy-time-slot-<?php echo $i; ?>"><?php echo date($rzvy_time_format,strtotime($sdate_etime)); ?></label>
							</div>
						</div>
						<?php 
					}
				}
			}else{ 
				?>
				<div class="col-md-12 rzvy-sm-box rzvy_slot_new text-center">
					<h6> <?php if(isset($rzvy_translangArr['none_of_slots_available_on'])){ echo $rzvy_translangArr['none_of_slots_available_on']; }else{ echo $rzvy_defaultlang['none_of_slots_available_on']; } ?> <?php echo date($rzvy_date_format, strtotime($selected_date)); ?></h6>
				</div>
				<?php 
			} 
			?>
		</div>
	</div>
	<?php 
}

/* Add selected slot to session ajax */
else if(isset($_POST['add_selected_slot'])){ 
	$selected_startdatetime = date("Y-m-d H:i:s", strtotime($_POST['selected_date']." ".$_POST['selected_startslot']));
	$selected_enddatetime = date("Y-m-d H:i:s", strtotime($_POST['selected_date']." ".$_POST['selected_endslot']));
	$_SESSION['rzvy_cart_datetime'] = $selected_startdatetime;
	$_SESSION['rzvy_cart_end_datetime'] = $selected_enddatetime;
	
	$rzvy_cart_date = date($rzvy_date_format, strtotime($_SESSION['rzvy_cart_datetime'])); 
	$rzvy_cart_starttime = date($rzvy_time_format, strtotime($_SESSION['rzvy_cart_datetime'])); 
	$rzvy_cart_endtime = date($rzvy_time_format, strtotime($_SESSION['rzvy_cart_end_datetime'])); 
	echo '<span class="text-center"><b><i class="fa fa-calendar text-success"></i> '.$rzvy_cart_date." ".$rzvy_cart_starttime." to ".$rzvy_cart_endtime.'</b></span>';
}

/* Add selected slot to session ajax */
else if(isset($_POST['add_selected_slot_withendslot'])){ 
	if(is_numeric($_SESSION['rzvy_cart_service_id']) && $_SESSION['rzvy_cart_service_id'] != "0"){
		$time_interval=$obj_slots->get_service_time_interval($_SESSION['rzvy_cart_service_id'],$time_interval);
		if($_SESSION['rzvy_cart_total_addon_duration']>0){
			$time_interval = ($time_interval+$_SESSION['rzvy_cart_total_addon_duration']);
		}
	}
	$selected_startdatetime = date("Y-m-d H:i:s", strtotime($_POST['selected_date']." ".$_POST['selected_startslot']));
	$selected_enddatetime = date("Y-m-d H:i:s", strtotime("+".$time_interval." minutes", strtotime($selected_startdatetime)));
	$_SESSION['rzvy_cart_datetime'] = $selected_startdatetime;
	$_SESSION['rzvy_cart_end_datetime'] = $selected_enddatetime;
	
	$rzvy_cart_date = date($rzvy_date_format, strtotime($_SESSION['rzvy_cart_datetime'])); 
	$rzvy_cart_starttime = date($rzvy_time_format, strtotime($_SESSION['rzvy_cart_datetime'])); 
	$rzvy_cart_endtime = date($rzvy_time_format, strtotime($_SESSION['rzvy_cart_end_datetime'])); 
	echo '<span class="text-center"><b><i class="fa fa-calendar text-success"></i> '.$rzvy_cart_date." ".$rzvy_cart_starttime.'</b></span>';
}

/* Frontend login ajax */
else if(isset($_POST['front_login'])){ 
	$obj_frontend->email = trim(strip_tags(mysqli_real_escape_string($conn, $_POST['email'])));
	$obj_frontend->password = $_POST['password'];
	
	/* Function to check login details */
	$login_detail = $obj_frontend->login_process();
	
	$array = array();
	$array['status'] = "failed";
	if(is_array($login_detail)){
		$array['email'] = $login_detail['email'];
		$array['password'] = $login_detail['password'];
		$array['firstname'] = ucwords($login_detail['firstname']);
		$array['lastname'] = ucwords($login_detail['lastname']);
		$array['phone'] = $login_detail['phone'];
		$array['address'] = $login_detail['address'];
		$array['city'] = $login_detail['city'];
		$array['state'] = $login_detail['state'];
		$array['zip'] = $_SESSION['rzvy_location_selector_zipcode'];
		$array['country'] = $login_detail['country'];
		if($login_detail['dob']!=''){
			if($obj_settings->get_option('rzvy_birthdate_with_year') == "Y"){
				$array['dob'] = date("j F Y", strtotime($login_detail['dob']));
			}else{
				$array['dob'] = date("j F", strtotime($login_detail['dob']));
			}
		}
		$array['dob'] = '';
		$array['status'] = "success";
	}
	echo json_encode($array);
}

/* Frontend logout ajax */
else if(isset($_POST['front_logout'])){ 
	unset($_SESSION['staff_id']);
	unset($_SESSION['admin_id']);
	unset($_SESSION['customer_id']);
	unset($_SESSION['login_type']);
	$_SESSION['rzvy_lpoint_used'] = 0;
	$_SESSION['rzvy_cart_lpoint'] = 0;
	$_SESSION['rzvy_lpoint_total'] = 0;
	$_SESSION['rzvy_lpoint_left'] = 0;
	$_SESSION['rzvy_lpoint_price'] = 0;
	$_SESSION['rzvy_lpoint_value'] = 0;
	$_SESSION['rzvy_lpoint_checked'] = false;
	$_SESSION["rzvy_applied_ref_customer_id"] = "";
}
/* Get available coupons for customer ajax */
else if(isset($_POST['remove_applied_rcoupon'])){
	$_SESSION["rzvy_applied_ref_customer_id"] = '';
	$rzvy_tax_status = $obj_settings->get_option('rzvy_tax_status');
	$rzvy_tax_type = $obj_settings->get_option('rzvy_tax_type');
	$rzvy_tax_value = $obj_settings->get_option('rzvy_tax_value');
	$subtotal = $_SESSION['rzvy_cart_subtotal'];
	if($subtotal>0){
		$rzvy_referral_discount_type = $obj_settings->get_option('rzvy_referral_discount_type');
		$rzvy_referral_discount_value = $obj_settings->get_option('rzvy_referral_discount_value');
		$obj_frontend->rzvy_cart_item_calculation($subtotal, $rzvy_tax_status, $rzvy_tax_type, $rzvy_tax_value, $rzvy_referral_discount_type, $rzvy_referral_discount_value);
	}
}
/* Get available coupons for customer ajax */
else if(isset($_POST['get_available_rcoupons'])){
	$_SESSION["rzvy_applied_ref_customer_id"] = '';
	$rzvy_tax_status = $obj_settings->get_option('rzvy_tax_status');
	$rzvy_tax_type = $obj_settings->get_option('rzvy_tax_type');
	$rzvy_tax_value = $obj_settings->get_option('rzvy_tax_value');
	$subtotal = $_SESSION['rzvy_cart_subtotal'];
	if($subtotal>0){
		$rzvy_referral_discount_type = $obj_settings->get_option('rzvy_referral_discount_type');
		$rzvy_referral_discount_value = $obj_settings->get_option('rzvy_referral_discount_value');
		$obj_frontend->rzvy_cart_item_calculation($subtotal, $rzvy_tax_status, $rzvy_tax_type, $rzvy_tax_value, $rzvy_referral_discount_type, $rzvy_referral_discount_value);
	}
	if($obj_settings->get_option("rzvy_referral_discount_status") == "Y"){ 
		if(isset($_SESSION['customer_id'])){
			$available_rcoupons = $obj_frontend->get_all_referral_discount($_SESSION["customer_id"]);
			if(mysqli_num_rows($available_rcoupons)>0){  ?>
			<h2 class="fs-5 pt-3"><?php if(isset($rzvy_translangArr['select_a_referral_discount_coupon'])){ echo $rzvy_translangArr['select_a_referral_discount_coupon']; }else{ echo $rzvy_defaultlang['select_a_referral_discount_coupon']; } ?></h2>
			<div class="rzvy-table">
				<table class="table">
				  <thead>
					<tr>
					  <th><?php if(isset($rzvy_translangArr['coupon_value'])){ echo $rzvy_translangArr['coupon_value']; }else{ echo $rzvy_defaultlang['coupon_value']; } ?></th>
					  <th align="left"><?php if(isset($rzvy_translangArr['coupon_code'])){ echo $rzvy_translangArr['coupon_code']; }else{ echo $rzvy_defaultlang['coupon_code']; } ?></th>																  
					</tr>
				  </thead>
				  <tbody>
					<?php 
						while($coupon = mysqli_fetch_array($available_rcoupons)){ 
						?><tr>
							  <td>
								<div class="form-check">
								  <input class="form-check-input rzvy-rcoupon-radio" type="radio" id="rzvy-rcoupon-radio-<?php echo $coupon['id']; ?>" name="rzvy-rcoupon-radio" value="<?php echo $coupon['id']; ?>" data-promo="<?php echo $coupon['coupon']; ?>">
								  <label class="form-check-label" for="rzvy-rcoupon-radio-<?php echo $coupon['id']; ?>"><?php if($coupon['discount_type']=="flat"){ ?>
											<?php if(isset($rzvy_translangArr['flat'])){ echo $rzvy_translangArr['flat']; }else{ echo $rzvy_defaultlang['flat']; }   echo $obj_settings->rzvy_currency_position($rzvy_currency_symbol,$rzvy_currency_position,$coupon['discount']); 
											if(isset($rzvy_translangArr['off_on_your_purchase'])){ echo $rzvy_translangArr['off_on_your_purchase']; }else{ echo $rzvy_defaultlang['off_on_your_purchase']; }
											 }else{  echo $coupon['discount']; ?>% <?php if(isset($rzvy_translangArr['off_on_your_purchase'])){ echo $rzvy_translangArr['off_on_your_purchase']; }else{ echo $rzvy_defaultlang['off_on_your_purchase']; }  
											 } ?></label>
								</div>
							  </td>
							  <td align="left"><?php echo $coupon['coupon']; ?></td>				  
							</tr>																		
					<?php } ?>
				  </tbody>
				</table>
				<?php if($obj_settings->get_option("rzvy_referral_discount_status") == "Y"){ ?>
				<div class="mt-3 mb-1 valid-feedback rzvy_applied_referral_coupon_div_text <?php echo $inputAlignment; ?>">
					<span><i class="fa fa-gift"></i>&nbsp;&nbsp;<?php if(isset($rzvy_translangArr['applied_referral_discount_coupon'])){ echo $rzvy_translangArr['applied_referral_discount_coupon']; }else{ echo $rzvy_defaultlang['applied_referral_discount_coupon']; } ?>: <span class="fa-border rzvy_applied_referral_coupon_code"></span><a href="javascript:void(0)" class="rzvy_remove_applied_rcoupon" data-id=""><i class="fa fa-times-circle-o fa-lg"></i></a></span>
				</div>
				<?php } ?>												
			</div><?php  	
			} 
		}
	} 
}	
/* Get available coupons for customer ajax */
else if(isset($_POST['get_available_coupons'])){ 	
	$available_coupons = $obj_frontend->get_available_coupons(); 
	?>
	<h2 class="fs-5 pt-3"><?php if(isset($rzvy_translangArr['select_a_promo_offer'])){ echo $rzvy_translangArr['select_a_promo_offer']; }else{ echo $rzvy_defaultlang['coupon_code']; } ?>: <?php echo date($rzvy_date_format, strtotime($coupon['select_a_promo_offer'])); ?></h2>
	<div class="rzvy-table">
		<table class="table">
		  <thead>
			<tr>
			  <th><?php if(isset($rzvy_translangArr['coupon_value'])){ echo $rzvy_translangArr['coupon_value']; }else{ echo $rzvy_defaultlang['coupon_value']; } ?>: <?php echo date($rzvy_date_format, strtotime($coupon['coupon_value'])); ?></th>
			  <th align="left"><?php if(isset($rzvy_translangArr['coupon_code'])){ echo $rzvy_translangArr['coupon_code']; }else{ echo $rzvy_defaultlang['coupon_code']; } ?>: <?php echo date($rzvy_date_format, strtotime($coupon['coupon_code'])); ?></th>
			  <th align="left"><?php if(isset($rzvy_translangArr['expires'])){ echo $rzvy_translangArr['expires']; }else{ echo $rzvy_defaultlang['expires']; } ?>: <?php echo date($rzvy_date_format, strtotime($coupon['coupon_expiry'])); ?></th>
			</tr>
		  </thead>
		  <tbody>
			<tr>
			  <td>
				<div class="form-check">
				  <input class="form-check-input rzvy-coupon-radio" type="radio" id="rzvy-coupon-radio-<?php echo $coupon['id']; ?>" name="rzvy-coupon-radio" value="<?php echo $coupon['id']; ?>" data-promo="<?php echo $coupon['coupon_code']; ?>">
				  <label class="form-check-label" for="rzvy-coupon-radio-<?php echo $coupon['id']; ?>"><?php if($coupon['coupon_type']=="flat"){ ?>
							<?php if(isset($rzvy_translangArr['flat'])){ echo $rzvy_translangArr['flat']; }else{ echo $rzvy_defaultlang['flat']; }  echo $obj_settings->rzvy_currency_position($rzvy_currency_symbol,$rzvy_currency_position,$coupon['coupon_value']);
							if(isset($rzvy_translangArr['off_on_your_purchase'])){ echo $rzvy_translangArr['off_on_your_purchase']; }else{ echo $rzvy_defaultlang['off_on_your_purchase']; }
							 }else{  echo $coupon['coupon_value']; ?>% <?php if(isset($rzvy_translangArr['off_on_your_purchase'])){ echo $rzvy_translangArr['off_on_your_purchase']; }else{ echo $rzvy_defaultlang['off_on_your_purchase']; }  
							 } ?>
				</div>
			  </td>
			  <td align="left"><?php echo $coupon['coupon_code']; ?></td>
			  <td align="left"><?php echo date($rzvy_date_format, strtotime($coupon['coupon_expiry'])); ?></td>
			</tr>
		  </tbody>
		</table>
	  </div>
	<div class="row">
		<div class="col-md-12">
			<?php 
			$j = 0;
			while($coupon = mysqli_fetch_array($available_coupons)){ 
				if(isset($_SESSION['customer_id'])){
					$obj_frontend->customer_id = $_SESSION['customer_id'];
					$obj_frontend->coupon_id = $coupon['id'];
					$check_coupon = $obj_frontend->check_available_coupon_of_existing_customer();
					if($check_coupon=="used"){
						continue;
					}
				} 
				?>
				<div class="row rzvy-available-coupons-list <?php echo $inputAlignment; ?>">
					<input type="radio" class="rzvy-coupon-radio" id="rzvy-coupon-radio-<?php echo $coupon['id']; ?>" name="rzvy-coupon-radio" value="<?php echo $coupon['id']; ?>" data-promo="<?php echo $coupon['coupon_code']; ?>" />
					<label class="col-md-11 rzvy-coupon-radio-label" for="rzvy-coupon-radio-<?php echo $coupon['id']; ?>">
						<div class="rzvy-coupons-container-label">
							<?php if($coupon['coupon_type']=="flat"){ ?>
								<h6><b><?php if(isset($rzvy_translangArr['flat'])){ echo $rzvy_translangArr['flat']; }else{ echo $rzvy_defaultlang['flat']; } ?> <?php  echo $obj_settings->rzvy_currency_position($rzvy_currency_symbol,$rzvy_currency_position,$coupon['coupon_value']); ?> <?php if(isset($rzvy_translangArr['off_on_your_purchase'])){ echo $rzvy_translangArr['off_on_your_purchase']; }else{ echo $rzvy_defaultlang['off_on_your_purchase']; } ?></b></h6> 
							<?php }else{ ?>
								<h6><b><?php echo $coupon['coupon_value']; ?>% <?php if(isset($rzvy_translangArr['off_on_your_purchase'])){ echo $rzvy_translangArr['off_on_your_purchase']; }else{ echo $rzvy_defaultlang['off_on_your_purchase']; } ?></b></h6> 
							<?php } ?>
						</div>
						<div class="rzvy-coupons-container">
							<div><?php if(isset($rzvy_translangArr['use_promo_code'])){ echo $rzvy_translangArr['use_promo_code']; }else{ echo $rzvy_defaultlang['use_promo_code']; } ?>: <span class="rzvy-coupons-code-label"><?php echo $coupon['coupon_code']; ?></span></div>
							<div class="rzvy-coupons-code-expire-label"><?php if(isset($rzvy_translangArr['expires'])){ echo $rzvy_translangArr['expires']; }else{ echo $rzvy_defaultlang['expires']; } ?>: <?php echo date($rzvy_date_format, strtotime($coupon['coupon_expiry'])); ?></div>
						</div>
					</label>
				</div>
				<?php 
				$j++; 
			} 
						
			/** Referral discount coupon list start **/
			if($obj_settings->get_option("rzvy_referral_discount_status") == "Y"){ 
				if(isset($_SESSION['customer_id'])){
					$available_rcoupons = $obj_frontend->get_all_referral_discount($_SESSION["customer_id"]);
					if(mysqli_num_rows($available_rcoupons)>0){ 
						while($coupon = mysqli_fetch_array($available_rcoupons)){ 
							?>
							<div class="row rzvy-available-rcoupons-list">
								<input type="radio" class="rzvy-rcoupon-radio" id="rzvy-rcoupon-radio-<?php echo $coupon['id']; ?>" name="rzvy-rcoupon-radio" value="<?php echo $coupon['id']; ?>" data-promo="<?php echo $coupon['coupon']; ?>" />
								<label class="col-md-11 rzvy-rcoupon-radio-label" for="rzvy-rcoupon-radio-<?php echo $coupon['id']; ?>">
									<div class="rzvy-rcoupons-container-label">
										<?php if($coupon['discount_type']=="flat"){ ?>
											<h6><b><?php if(isset($rzvy_translangArr['flat'])){ echo $rzvy_translangArr['flat']; }else{ echo $rzvy_defaultlang['flat']; } ?> <?php echo $obj_settings->rzvy_currency_position($rzvy_currency_symbol,$rzvy_currency_position,$coupon['discount']); ?> <?php if(isset($rzvy_translangArr['off_on_your_purchase'])){ echo $rzvy_translangArr['off_on_your_purchase']; }else{ echo $rzvy_defaultlang['off_on_your_purchase']; } ?></b></h6> 
										<?php }else{ ?>
											<h6><b><?php echo $coupon['discount']; ?>% <?php if(isset($rzvy_translangArr['off_on_your_purchase'])){ echo $rzvy_translangArr['off_on_your_purchase']; }else{ echo $rzvy_defaultlang['off_on_your_purchase']; } ?></b></h6> 
										<?php } ?>
									</div>
									<div class="rzvy-rcoupons-container">
										<div><?php if(isset($rzvy_translangArr['use_referral_promo_code'])){ echo $rzvy_translangArr['use_referral_promo_code']; }else{ echo $rzvy_defaultlang['use_referral_promo_code']; } ?>: <span class="rzvy-rcoupons-code-label"><?php echo $coupon['coupon']; ?></span></div>
									</div>
								</label>
							</div>
							<?php 
							$j++; 
						} 
					} 
				}
			}
			/** Referral discount coupon list end **/
			?>
		</div>
	</div>
	<?php 
	if($j==0){ 
		@ob_clean(); ob_start();
		echo 'none_of_coupons_available';
		exit;
	} 
}

/** Check Referal code Ajax **/
else if(isset($_POST["apply_referral_code"])){
	$check_referral_code = $obj_frontend->check_referral_code($_POST["referral_code"]);
	if(mysqli_num_rows($check_referral_code)>0){
		$data = mysqli_fetch_array($check_referral_code); 
		if(isset($_SESSION["customer_id"])){
			if($data["id"] == $_SESSION["customer_id"]){
				$_SESSION['rzvy_ref_customer_id'] = "";
				$_SESSION["referralcode_applied"] = "O";
				$_SESSION["rzvy_applied_ref_customer_id"] = "";
				$_SESSION["rzvy_applied_refcode"] = "";
				echo "owncode";
			}else{
				/** check for first booking **/
				$check_referral_firstbooking = $obj_frontend->check_referral_firstbooking($_SESSION["customer_id"]);
				if(mysqli_num_rows($check_referral_firstbooking)==0){
					$check_guest_customer_referral_code_after_registered_customer = $obj_frontend->check_guest_customer_referral_code_after_registered_customer($_POST["email"], $_POST["referral_code"]);
					if(mysqli_num_rows($check_guest_customer_referral_code_after_registered_customer)==0){
						$_SESSION['rzvy_ref_customer_id'] = $data["id"];
						$_SESSION["referralcode_applied"] = "Y";
						$_SESSION["rzvy_applied_ref_customer_id"] = $_POST["referral_code"];
						$_SESSION["rzvy_applied_refcode"] = $_POST["referral_code"];
						echo "applied";
					}else{
						$_SESSION['rzvy_ref_customer_id'] = "";
						$_SESSION["referralcode_applied"] = "F";
						$_SESSION["rzvy_applied_ref_customer_id"] = "";
						$_SESSION["rzvy_applied_refcode"] = "";
						echo "onfirstbookingonly";
					}
				}else{
					$_SESSION['rzvy_ref_customer_id'] = "";
					$_SESSION["referralcode_applied"] = "F";
					$_SESSION["rzvy_applied_ref_customer_id"] = "";
					$_SESSION["rzvy_applied_refcode"] = "";
					echo "onfirstbookingonly";
				}
			}
		}else{
			if($_POST["user"] == "gc" && $_POST["gemail"] != ""){
				$check_guest_customer_referral_code = $obj_frontend->check_guest_customer_referral_code($_POST["gemail"], $_POST["referral_code"]);
				if(mysqli_num_rows($check_guest_customer_referral_code)==0){
					$_SESSION['rzvy_ref_customer_id'] = $data["id"];
					$_SESSION["referralcode_applied"] = "Y";
					$_SESSION["rzvy_applied_ref_customer_id"] = $_POST["referral_code"];
					$_SESSION["rzvy_applied_refcode"] = $_POST["referral_code"];
					echo "applied";
				}else{
					$_SESSION['rzvy_ref_customer_id'] = "";
					$_SESSION["referralcode_applied"] = "F";
					$_SESSION["rzvy_applied_ref_customer_id"] = "";
					$_SESSION["rzvy_applied_refcode"] = "";
					echo "onfirstbookingonly";
				}
			}else{
				$check_guest_customer_referral_code_after_registered_customer = $obj_frontend->check_guest_customer_referral_code_after_registered_customer($_POST["email"], $_POST["referral_code"]);
				if(mysqli_num_rows($check_guest_customer_referral_code_after_registered_customer)==0){
					$_SESSION['rzvy_ref_customer_id'] = $data["id"];
					$_SESSION["referralcode_applied"] = "Y";
					$_SESSION["rzvy_applied_ref_customer_id"] = $_POST["referral_code"];
					$_SESSION["rzvy_applied_refcode"] = $_POST["referral_code"];
					echo "applied";
				}else{
					$_SESSION['rzvy_ref_customer_id'] = "";
					$_SESSION["referralcode_applied"] = "F";
					$_SESSION["rzvy_applied_ref_customer_id"] = "";
					$_SESSION["rzvy_applied_refcode"] = "";
					echo "onfirstbookingonly";
				}
			}
		}
	}else{
		$_SESSION['rzvy_ref_customer_id'] = "";
		$_SESSION["referralcode_applied"] = "N";
		$_SESSION["rzvy_applied_ref_customer_id"] = "";
		$_SESSION["rzvy_applied_refcode"] = "";
		echo "notexist";
	}
}

/** Remove Referal code Ajax **/
else if(isset($_POST["remove_referral_code"])){
	$_SESSION['rzvy_ref_customer_id'] = "";
	$_SESSION["referralcode_applied"] = "N";
	$_SESSION["rzvy_applied_ref_customer_id"] = "";
	$_SESSION["rzvy_applied_refcode"] = "";
}

/* cart: apply referral discount coupon */
else if(isset($_POST['apply_referral_discount'])){
	$check_referral_coupon_code_exist = $obj_frontend->check_referral_coupon_code_exist($_SESSION["customer_id"], $_POST["ref_discount_coupon"]);
	if(mysqli_num_rows($check_referral_coupon_code_exist)>0){
		$discount_value = mysqli_fetch_array($check_referral_coupon_code_exist);
		if($discount_value["used"] == "N"){
			$subtotal = $_SESSION['rzvy_cart_subtotal'];
			if($subtotal>0){
				$_SESSION["rzvy_applied_ref_customer_id"] = $discount_value["id"];
				$rzvy_tax_status = $obj_settings->get_option('rzvy_tax_status');
				$rzvy_tax_type = $obj_settings->get_option('rzvy_tax_type');
				$rzvy_tax_value = $obj_settings->get_option('rzvy_tax_value');				

				$rzvy_referral_discount_type = $obj_settings->get_option('rzvy_referral_discount_type');
				$rzvy_referral_discount_value = $obj_settings->get_option('rzvy_referral_discount_value');
				$obj_frontend->rzvy_cart_item_calculation($subtotal, $rzvy_tax_status, $rzvy_tax_type, $rzvy_tax_value, $rzvy_referral_discount_type, $rzvy_referral_discount_value);
				echo "applied";
			}
		}else{
			echo "used";
		}
	}else{
		echo "notexist";
	}
}

/** Set selected language Ajax **/
else if(isset($_POST["set_selected_language"])){
	unset($_COOKIE["rzvy_language"]);
	$cookie_name = "rzvy_language";
	$cookie_value = $_POST["lang"];
	setcookie($cookie_name, $cookie_value, time() + (86400 * 30), "/");
}

/** Get staff according to service selection */
else if(isset($_POST["get_staff_according_service"])){
	$service_id = $_POST['id'];
	$staff_location_check = " and `s`.`locations`='alllocations'";
	
	if($rzvy_location_selector_status=='Y' && isset($_SESSION['rzvy_location_selector_zipcode']) && $_SESSION['rzvy_location_selector_zipcode']!=''){
		$staff_location_check = " and (`s`.`locations`='alllocations' OR `s`.`locations`='".$_SESSION['rzvy_location_selector_zipcode']."' OR `s`.`locations` like '%,".$_SESSION['rzvy_location_selector_zipcode']."' OR `s`.`locations` like '%,".$_SESSION['rzvy_location_selector_zipcode'].",%' OR `s`.`locations` like '".$_SESSION['rzvy_location_selector_zipcode'].",%')";
	}
	$getall_service_staffid = $obj_frontend->getall_service_staff($service_id,$rzvy_staff_order,$staff_location_check);
	$servicelinkedstaffs = 0;	
	if($getall_service_staffid){
		$servicelinkedstaffs = mysqli_num_rows($getall_service_staffid);
	}
	
	if($servicelinkedstaffs>0){ 
		?>
		<div class="step-item">
            <h2 class="step-title <?php echo $inputAlignment; ?>"><?php if(isset($rzvy_translangArr['choose_staff_member'])){ echo $rzvy_translangArr['choose_staff_member']; }else{ echo $rzvy_defaultlang['choose_staff_member']; } ?></h2>
		
			<?php if($servicelinkedstaffs>1){
					$rzvy_staffs_time_today = $obj_settings->get_option('rzvy_staffs_time_today');
					$rzvy_staffs_time_tomorrow = $obj_settings->get_option('rzvy_staffs_time_tomorrow');
					
					$rzvy_colmdclass = '12';
					if($rzvy_staffs_time_today=='Y' && $rzvy_staffs_time_tomorrow=='Y'){
						$rzvy_colmdclass = '6';
					}
					if($rzvy_staffs_time_today=='Y'){
					?>
				<div class="row">				
					<div class="col-md-<?php echo $rzvy_colmdclass;?> py-2">
						<div class="card rzvy_card_common  <?php echo $inputAlignment; ?> rzvy-staff-change rzvy-staff-change-tt" id="rzvy-staff-change-id-today" data-id="today" data-sdate="<?php echo date('Y-m-d');?>">
							<div class="card-body p-1 <?php echo $insideContentAlignment; ?>">
								<h5 class="card-text pb-2 pt-2"><?php if(isset($rzvy_translangArr['available_today'])){ echo $rzvy_translangArr['available_today']; }else{ echo $rzvy_defaultlang['available_today']; } ?></h5>
							</div>
						</div>
					</div>
			<?php
				if($rzvy_staffs_time_tomorrow!='Y'){ ?>
				</div>	
				<?php }
				}
				if($rzvy_staffs_time_tomorrow=='Y'){
					if($rzvy_staffs_time_today!='Y'){ ?>
					<div class="row">
					<?php } ?>
						<div class="col-md-<?php echo $rzvy_colmdclass;?> py-2">
							<div class="card rzvy_card_common  <?php echo $inputAlignment; ?> rzvy-staff-change rzvy-staff-change-tt" id="rzvy-staff-change-id-tomorrow" data-id="tomorrow" data-sdate="<?php echo date('Y-m-d',strtotime('+1 days'));?>">
								<div class="card-body p-1 <?php echo $insideContentAlignment; ?>">
									<h5 class="card-text pb-2 pt-2"><?php if(isset($rzvy_translangArr['available_tomorrow'])){ echo $rzvy_translangArr['available_tomorrow']; }else{ echo $rzvy_defaultlang['available_tomorrow']; } ?></h5>
								</div>
							</div>
						</div>
					</div>	
				<?php } 			
			} ?>
		
			<div class="services team <?php echo $alignmentClass; ?> <?php echo $rzvyrounded;?>">
					<div class="owl-carousel <?php if(in_array('ss',$rzvy_nocarousel_section)){ echo ' owl-carousel-without '; }  if(in_array('ss',$rzvy_nocarouselsm_section)){ echo ' owl-carousel-sm-without '; } ?>" data-items="3" data-items-lg="2" data-items-md="2" data-items-sm="2" data-items-ssm="1" data-margin="24" data-nav="true" data-dots="true"  autoplay="false" data-loop="<?php echo $rzvyloop; ?>">
		
			<?php 
			while($staffid = mysqli_fetch_array($getall_service_staffid)){
				$obj_settings->staff_id = $staffid["staff_id"];
				$show_staff_on_bookingform = $obj_settings->get_staff_option("show_staff_on_bookingform");
				if($show_staff_on_bookingform=='N'){ continue; }
				
				$staffdata = $obj_frontend->get_staff($staffid["staff_id"]);
				$staff_ratinginfo = $obj_frontend->get_staff_rating($staffid["staff_id"]);
				$staff_rating = $staff_ratinginfo['average_review'];
				$totalstaff_rating = $staff_ratinginfo['number_of_reviews'];
				$job_completed = $obj_frontend->get_staff_job_completed($staffid["staff_id"]);
				
				
				$show_ratings_on_booking_form = $obj_settings->get_staff_option("show_ratings_on_booking_form");
				$show_completed_jobs_on_booking_form = $obj_settings->get_staff_option("show_completed_jobs_on_booking_form");
				$show_email_on_booking_form = $obj_settings->get_staff_option("show_email_on_booking_form");
				$show_phone_on_booking_form = $obj_settings->get_staff_option("show_phone_on_booking_form");
				
				$reviewlabel = '';
				if(isset($rzvy_translangArr['reviews'])){ $reviewlabel =  $rzvy_translangArr['reviews']; }else{ $reviewlabel =  $rzvy_defaultlang['reviews']; }
				
				if($show_ratings_on_booking_form == "Y"){
					$ratings = "";
					$ratingsinfo = "";
					if($staff_rating>0){
						$filledcounter = 0;
						for($star_i=0;$star_i<$staff_rating;$star_i++){ 
							if($staff_rating <= $star_i.'.5' && round($staff_rating)>$star_i){
								$ratings .= '<i class="fa fa-star-half-o" aria-hidden="true"></i>';
							}else{
								$ratings .= '<i class="fa fa-star" aria-hidden="true"></i>';
							}	
							$filledcounter++;
						} 
						for($star_j=0;$star_j<(5-$filledcounter);$star_j++){ 
							$ratings .= '<i class="fa fa-star-o" aria-hidden="true"></i>';
						} 
					}else{ 
						$ratings .= '<i class="fa fa-star-o" aria-hidden="true"></i> <i class="fa fa-star-o" aria-hidden="true"></i> <i class="fa fa-star-o" aria-hidden="true"></i> <i class="fa fa-star-o" aria-hidden="true"></i> <i class="fa fa-star-o" aria-hidden="true"></i>';
					} 
					$ratingsinfo .= '<span class="rzvy_ratinginfo"><strong>'.$staff_rating.'</strong> ('.$totalstaff_rating.' '.$reviewlabel.')</span>';
				} 
				?>
				<div class="item">
                  <figure>
                    <?php $rzvyptclass = '';  if($rzvy_show_staff_image == "Y"){ ?><img src="<?php if($staffdata['image'] != "" && file_exists(dirname(dirname(dirname(__FILE__)))."/uploads/images/".$staffdata['image'])){ echo SITE_URL."uploads/images/".$staffdata['image']; }else{ echo SITE_URL."includes/images/noimage.png"; } ?>"><?php }else{ $rzvyptclass = 'rzvy-pt-figcaption'; } ?>
                    <figcaption class="<?php echo $rzvyptclass; ?>">
					  <?php if($staffdata['badge_text']!=""){ ?>
						<span class="tag"><?php echo $staffdata['badge_text']; ?></span>
					  <?php } ?>  
                      <h3><?php echo ucwords($staffdata["firstname"]." ".$staffdata["lastname"]); ?></h3>
                      <?php if($show_ratings_on_booking_form == "Y"){ ?><div class="rating">
                        <?php echo $ratings; ?>
                        <?php echo $ratingsinfo; ?>
                      </div><?php } ?>
                      <div class="service-meta">
                        <?php if($show_completed_jobs_on_booking_form == "Y"){ ?><span><i class="fa fa-fw fa-check-square-o" aria-hidden="true"></i> <?php if(isset($rzvy_translangArr['completed_jobs'])){ echo $rzvy_translangArr['completed_jobs']; }else{ echo $rzvy_defaultlang['completed_jobs']; } ?> : <?php echo $job_completed; ?></span><?php } ?>
                        <?php if($show_email_on_booking_form == "Y"){ ?><span><i class="fa fa-fw fa-envelope-o" aria-hidden="true"></i> <a href="mailto:<?php echo $staffdata["email"]; ?>"><?php echo $staffdata["email"]; ?></a></span><?php } ?>	
						<?php if($show_phone_on_booking_form == "Y"){ ?><span><i class="fa fa-fw fa-phone"></i> <?php echo $staffdata["phone"]; ?></span><?php } ?>
                      </div>
                      <input type="radio" name="rzvy-staff-radio" class="<?php echo $inputAlignment; ?> rzvy-staff-change" id="rzvy-staff-change-id-<?php echo $staffdata["id"]; ?>" data-id="<?php echo $staffdata["id"]; ?>">
                    </figcaption>
                  </figure>
                </div>
			<?php 
			} 
			?>
			</div>
		</div>
	</div>
		<?php 
	}
}

/** Set staff id in session on selection */
else if(isset($_POST["set_staff_according_service"])){ 
	$_SESSION['rzvy_staff_id'] = $_POST["id"];
}

else if(isset($_POST["check_cart_amount"])){ 
	$minmum_cart_value_to_pay = $obj_settings->get_option("rzvy_minmum_cart_value_to_pay");
	if($minmum_cart_value_to_pay>=0 && is_numeric($minmum_cart_value_to_pay)){
		/** Nothing to do here **/
	}else{
		$minmum_cart_value_to_pay = 0;
	}
	
	if($_SESSION['rzvy_cart_nettotal']>= $minmum_cart_value_to_pay){
		echo "sufficient";
	}else{
		if($_SESSION['rzvy_cart_subtotal']>= $minmum_cart_value_to_pay){
			echo "sufficient";
		}else{
			echo $minmum_cart_value_to_pay;
		}
	}
} 

/** Check Referal code Ajax **/
else if(isset($_POST["apply_loyalty_point"])){
	if(isset($_SESSION["login_type"])){ 
		if($_SESSION['login_type'] == "customer") { 
			$available_lpoints = $obj_lpoint->get_available_points_customer($_SESSION["customer_id"]);
			$lpoint_value = $obj_settings->get_option("rzvy_perbooking_loyalty_point_value");
			$calculatelp = ($available_lpoints*$lpoint_value);
			$calculatelp = number_format($calculatelp,2,".",'');
			$_SESSION['rzvy_lpoint_total'] = $available_lpoints;
			$_SESSION['rzvy_lpoint_price'] = $calculatelp;
			$_SESSION['rzvy_lpoint_value'] = $lpoint_value;
			$_SESSION['rzvy_lpoint_checked'] = $_POST['lpoint_check'];
		}else{
			$_SESSION['rzvy_lpoint_checked'] = false;
		}
	}else{
		$_SESSION['rzvy_lpoint_checked'] = false;
	}
}

else if(isset($_POST["get_subcat_by_pcid"])){
	$all_categories = $obj_frontend->get_all_categories_by_pcid($_POST['id']); 
	$i=0;
	$total_cat = mysqli_num_rows($all_categories);
	if($total_cat>0){
		?>
		<div class="services <?php echo $rzvyrounded;?>">
              <div class="owl-carousel <?php if(in_array('sc',$rzvy_nocarousel_section)){ echo ' owl-carousel-without '; }  if(in_array('sc',$rzvy_nocarouselsm_section)){ echo ' owl-carousel-sm-without '; } ?>" data-items="3" data-items-lg="2" data-items-md="2" data-items-sm="2" data-items-ssm="1" data-margin="24" data-dots="true" data-nav="true"  autoplay="false" data-loop="<?php echo $rzvyloop; ?>"><?php 
		while($category = mysqli_fetch_array($all_categories)){ 
			?>
			<div class="item">
                  <figure>
				  <?php $rzvyptclass = ''; if($rzvy_show_category_image == "Y"){ ?><img src="<?php if($category['image'] != "" && file_exists(dirname(dirname(dirname(__FILE__)))."/uploads/images/".$category['image'])){ echo SITE_URL."uploads/images/".$category['image']; }else{ echo SITE_URL."includes/images/noimage.png"; } ?>"><?php }else{ $rzvyptclass = 'rzvy-pt-figcaption'; } ?>
				<figcaption class="<?php echo $insideContentAlignment.' '.$rzvyptclass; ?>">
					<h3><?php echo ucwords($category["cat_name"]); ?></h3>
					<input type="radio" name="rzvy-categories-radio" class="<?php echo $inputAlignment; ?> rzvy-categories-radio-change" id="rzvy-categories-radio-<?php echo $category["id"]; ?>" data-id="<?php echo $category["id"]; ?>">
				</figcaption>
				</figure>
			</div>
			<?php
		} ?>
		</div>
	</div>
	<?php	
	}else{ 
		?>
		<h5 class="step-title">
			<?php if(isset($rzvy_translangArr['please_configure_first_services_from_admin_area'])){ echo $rzvy_translangArr['please_configure_first_services_from_admin_area']; }else{ echo $rzvy_defaultlang['please_configure_first_services_from_admin_area']; } ?>
		</h5>
		<?php 
	} 
}

else if(isset($_POST["on_pageload"])){
	$rzvy_parent_category = $obj_settings->get_option("rzvy_parent_category");
	$rzvy_booking_first_selection_as = $obj_settings->get_option("rzvy_booking_first_selection_as");
	
	if($rzvy_booking_first_selection_as != "allservices"){
		if($rzvy_parent_category == "Y"){
			if(isset($_POST['precid']) && $_POST['precid']!='' && $_POST['precid']>0){
				$obj_frontend->category_id = $_POST['precid'];
			}
			$all_categories = $obj_frontend->get_all_parent_categories(); 
			?>
			<div class="step-item <?php echo $alignmentClass; ?> rzvy-pcategory-container">
				<?php 
				$i=0;
				$total_cat = mysqli_num_rows($all_categories);
				if($total_cat>0){
					?>
					<div class="step-title <?php echo $inputAlignment; ?>">
						<?php if(isset($rzvy_translangArr['choose_category_of_your_service'])){ echo $rzvy_translangArr['choose_category_of_your_service']; }else{ echo $rzvy_defaultlang['choose_category_of_your_service']; } ?>
					</div>
					 <div class="services <?php echo $rzvyrounded;?> rzvy-pc-row-1">
						<div class="owl-carousel <?php if(in_array('pc',$rzvy_nocarousel_section)){ echo ' owl-carousel-without '; }  if(in_array('pc',$rzvy_nocarouselsm_section)){ echo ' owl-carousel-sm-without '; } ?>" data-items="3" data-items-lg="3" data-items-md="3" data-items-sm="1" data-items-ssm="1" data-margin="24" data-dots="true" data-nav="true"  autoplay="false" data-loop="<?php echo $rzvyloop; ?>">
						<?php 
						while($category = mysqli_fetch_array($all_categories)){ 
						
							$pitself = '';
							if($category['nested_of']=='' && $category['linked_subcat']==''){
								$pitself = '-pcategories';
							}
							?>
							<div class="item">
								<figure class="<?php echo $insideContentAlignment; ?>">
									<?php $rzvyptclass = ''; if($rzvy_show_parentcategory_image == "Y"){ ?><img src="<?php if($category['image'] != "" && file_exists(dirname(dirname(dirname(__FILE__)))."/uploads/images/".$category['image'])){ echo SITE_URL."uploads/images/".$category['image']; }else{ echo SITE_URL."includes/images/noimage.png"; } ?>"><?php }else{ $rzvyptclass = 'rzvy-pt-figcaption'; } ?>
									<figcaption class="<?php echo $insideContentAlignment.' '.$rzvyptclass; ?>">
									  <h3 class="<?php echo $insideContentAlignment; ?>"><?php echo ucwords($category["cat_name"]); ?></h3>
									  <input type="radio"  name="rzvy-pcategories-radio" class="rzvy-pcategories-selection<?php echo $pitself;?>" id="rzvy-pcategories-selection-<?php echo $category["id"]; ?>" data-id="<?php echo $category["id"]; ?>" data-nprid="1">						 
									</figcaption>
								 </figure>						
							</div>
							<?php 
						} ?></div></div><?php 						
				}else{ 
					?>
					<h5 class="step-title <?php echo $inputAlignment; ?>">
						<?php if(isset($rzvy_translangArr['please_configure_first_services_from_admin_area'])){ echo $rzvy_translangArr['please_configure_first_services_from_admin_area']; }else{ echo $rzvy_defaultlang['please_configure_first_services_from_admin_area']; } ?>
					</h5>
					<?php 
				} 
				?>
			</div>
			<div class="step-item <?php echo $alignmentClass; ?>  rzvy-company-services-blocks rzvy_show_hide_sub_categories">
				<h2 class="step-title <?php echo $inputAlignment; ?> rzvy_categories_html_content_scroll">
					<?php if(isset($rzvy_translangArr['what_type_of_service'])){ echo $rzvy_translangArr['what_type_of_service']; }else{ echo $rzvy_defaultlang['what_type_of_service']; } ?>
				</h2>
				<div id="rzvy_categories_html_content" class="<?php echo $alignmentClass; ?>">
					<!-- sub categories will go here -->
				</div>
			</div>
			<div class="step-item <?php echo $alignmentClass; ?> rzvy_show_hide_services">
				<h2 class="step-title <?php echo $inputAlignment; ?> ">
					<?php if(isset($rzvy_translangArr['tell_us_about_your_service'])){ echo $rzvy_translangArr['tell_us_about_your_service']; }else{ echo $rzvy_defaultlang['tell_us_about_your_service']; } ?>
				</h2>
			</div>
			<div class="rzvy-no-border-bottom rzvy-mb-minus2 rzvy_show_hide_services">
				<div id="rzvy_services_html_content" class="row <?php echo $alignmentClass; ?>">
					<!-- services will go here -->
				</div>
			</div>
			<?php 
		}else{
			?>
			<div class="step-item <?php echo $alignmentClass; ?> rzvy-company-services-blocks">
				<h2 class="step-title <?php echo $inputAlignment; ?> rzvy_categories_html_content_scroll">
					<?php if(isset($rzvy_translangArr['what_type_of_service'])){ echo $rzvy_translangArr['what_type_of_service']; }else{ echo $rzvy_defaultlang['what_type_of_service']; } ?>
				</h2>
				<div id="rzvy_categories_html_content" class="services <?php echo $rzvyrounded;?>">
					<div class="owl-carousel <?php if(in_array('sc',$rzvy_nocarousel_section)){ echo ' owl-carousel-without '; }  if(in_array('sc',$rzvy_nocarouselsm_section)){ echo ' owl-carousel-sm-without '; } ?>" data-items="3" data-items-lg="3" data-items-md="3" data-items-sm="1" data-items-ssm="1" data-margin="24" data-dots="true" data-nav="true"  autoplay="false" data-loop="<?php echo $rzvyloop; ?>">
					<?php 
					$all_categories = $obj_frontend->get_all_categories(); 
					$i=0;
					$total_cat = mysqli_num_rows($all_categories);
					if($total_cat>0){
						while($category = mysqli_fetch_array($all_categories)){ 
							?>
							<div class="item">
								<figure class="<?php echo $insideContentAlignment; ?>">
									<?php $rzvyptclass = ''; if($rzvy_show_category_image == "Y"){ ?><img src="<?php if($category['image'] != "" && file_exists(dirname(dirname(dirname(__FILE__)))."/uploads/images/".$category['image'])){ echo SITE_URL."uploads/images/".$category['image']; }else{ echo SITE_URL."includes/images/noimage.png"; } ?>"><?php }else{ $rzvyptclass = 'rzvy-pt-figcaption'; } ?>
									<figcaption class="<?php echo $insideContentAlignment.' '.$rzvyptclass; ?>">
									  <h3 class="<?php echo $insideContentAlignment; ?>"><?php echo ucwords($category["cat_name"]); ?></h3>
									  <input type="radio" name="rzvy-categories-radio"  class="rzvy-categories-radio-change" id="rzvy-categories-radio-<?php echo $category["id"]; ?>" data-id="<?php echo $category["id"]; ?>">	
									</figcaption>
								</figure>	
							</div>
							<?php
						} 
					}else{ 
						?>
						<div class="step-item <?php echo $alignmentClass; ?>">
							<h5 class="step-title <?php echo $inputAlignment; ?>">
								<?php if(isset($rzvy_translangArr['please_configure_first_services_from_admin_area'])){ echo $rzvy_translangArr['please_configure_first_services_from_admin_area']; }else{ echo $rzvy_defaultlang['please_configure_first_services_from_admin_area']; } ?>
							</h5>
						</div>
						<?php 
					} 
					?>
					</div>
				</div>
			</div>
			<div class="step-item <?php echo $alignmentClass; ?> rzvy_show_hide_services">
					<h2 class="step-title <?php echo $inputAlignment; ?>">
						<?php if(isset($rzvy_translangArr['tell_us_about_your_service'])){ echo $rzvy_translangArr['tell_us_about_your_service']; }else{ echo $rzvy_defaultlang['tell_us_about_your_service']; } ?>
					</h2>
			</div>
			<div class="<?php echo $alignmentClass; ?> rzvy_show_hide_services">
				<div id="rzvy_services_html_content" class="<?php echo $alignmentClass; ?>">
					<!-- services will go here -->
				</div>
			</div>
			<?php 
		}
	}else{
		?>									
		<div class="step-item <?php echo $alignmentClass; ?> rzvy_show_hide_services" style="display:block">
			<h2 class="step-title <?php echo $inputAlignment; ?>">
				<?php if(isset($rzvy_translangArr['tell_us_about_your_service'])){ echo $rzvy_translangArr['tell_us_about_your_service']; }else{ echo $rzvy_defaultlang['tell_us_about_your_service']; } ?>
			</h2>
		</div>
		<div class="rzvy-no-border-bottom rzvy-mb-minus2 rzvy_show_hide_services" style="display:block">
			<div id="rzvy_services_html_content" class="<?php if($rzvy_services_listing_view != "L"){ echo $alignmentClass; } ?>">
				<?php if($rzvy_services_listing_view == "L"){ ?>
				<div class="rzvy-listview mb-3">
				<?php } ?>
				<div class="services <?php echo $rzvyrounded;?>">
				<?php 
				$all_services = $obj_frontend->get_services_without_cat_id();
				$nonlocation_services = 0; 
				if(mysqli_num_rows($all_services)>0){					
					?>
					<div class="owl-carousel <?php if(in_array('rs',$rzvy_nocarousel_section)){ echo ' owl-carousel-without '; }  if(in_array('rs',$rzvy_nocarouselsm_section)){ echo ' owl-carousel-sm-without '; } ?>" data-items="3" data-items-lg="3" data-items-md="2" data-items-sm="2" data-items-ssm="1" data-margin="24" data-dots="true" data-nav="true"  autoplay="false" data-loop="<?php echo $rzvyloop; ?>"><?php 
					while($service = mysqli_fetch_array($all_services)){
						if(isset($service['locations']) && $service['locations']!='' && $rzvy_location_selector_status=='Y'){
							$service_locations = explode(',',$service['locations']);
							if(isset($_SESSION['rzvy_location_selector_zipcode']) && !in_array($_SESSION['rzvy_location_selector_zipcode'],$service_locations)){ $nonlocation_services++; continue; }
							
						}
						if($rzvy_services_listing_view == "L"){  
							?>
							<div id="rzvy-services-radio-<?php echo $service["id"]; ?>" class="rzvy-listview-list my-1 rzvy-services-radio-change" data-id="<?php echo $service["id"]; ?>">
								<div class="rzvy-listview-list-data">
									<?php 
									if($rzvy_show_service_image == "Y"){
										?>
										<div class="rzvy-listview-list-image">
											<img style="width: inherit;" src="<?php if($service['image'] != "" && file_exists(dirname(dirname(dirname(__FILE__)))."/uploads/images/".$service['image'])){ echo SITE_URL."uploads/images/".$service['image']; }else{ echo SITE_URL."includes/images/noimage.png"; } ?>" />
										</div>
										<?php 
									}
									?>
									<div class="rzvy-listview-list-info px-1">
										<div class="rzvy-listview-list-title">
											<?php 
											echo $service['title']." ";
											if($service['duration']>0){
												?><span class="rzvy-listview-list-price"><i class="fa fa-clock-o"></i> <?php echo $service['duration']." Min."; ?></span><?php 
											}
											if($rzvy_price_display=='Y'){ ?><span class="rzvy-listview-list-price"><i class="fa fa-tag"></i> <?php 
												if($service['rate']>0){ 
													echo $obj_settings->rzvy_currency_position($rzvy_currency_symbol,$rzvy_currency_position,$service['rate']);
												}else{ 
													echo (isset($rzvy_translangArr['free']))?$rzvy_translangArr['free']:$rzvy_defaultlang['free']; 
											} ?></span> <?php } ?>
										</div>
										<div class="rzvy-listview-list-sub-info">
											<div><?php echo $service['description']; ?></div>
										</div>
									</div>
									<div class="rzvy-listview-list-badge-main">
										<?php if($service['badge']=="Y"){ ?>
											<div class="rzvy-listview-list-badge"><?php echo $service['badge_text']; ?></div>
										<?php } ?>
									</div>
								</div>
							</div>
							<?php 
						} else {
							$rzvy_freelabel= '';
							if(isset($rzvy_translangArr['free'])){ $rzvy_freelabel= $rzvy_translangArr['free']; }else{ $rzvy_freelabel= $rzvy_defaultlang['free']; }
							$service_price_display = 'N';				
							if($rzvy_price_display=='Y'){
								if($service['rate']>0){
									$service_price_display = 'Y';
								}elseif($service['rate']==0 && $rzvy_freelabel!=''){
									$service_price_display = 'Y';
								}
							}	
							?>
							<div class="item">
								<figure>
									<?php $rzvyptclass = ''; if($rzvy_show_service_image == "Y"){ ?><img src="<?php if($service['image'] != "" && file_exists(dirname(dirname(dirname(__FILE__)))."/uploads/images/".$service['image'])){ echo SITE_URL."uploads/images/".$service['image']; }else{ echo SITE_URL."includes/images/noimage.png"; } ?>"><?php }else{ $rzvyptclass = 'rzvy-pt-figcaption'; } ?>	
									<figcaption class="<?php echo $rzvyptclass; ?>">
										<?php if($service['badge']=="Y"){ ?>
											<span class="tag"><?php echo $service['badge_text']; ?></span>
										<?php } ?>
										<h3><?php echo ucwords($service["title"]); ?></h3>
										<?php if($service['description']!=""){ ?>
											<p><?php if(strlen($service['description'])<=45){ echo $service['description']."..."; }else{ echo substr($service['description'], 0, 45)."..."; } ?></p>
										<?php } ?>
										<div class="service-meta">
											<?php if($service['duration']>0){ ?><span class="<?php echo ($service['rate']>0 && $service_price_display=='Y')?"pull-left":"text-center"; ?>"><i class="fa fa-clock-o"></i> <?php echo $service['duration']." Min."; ?></span><?php } if($service_price_display=='Y'){ ?><span class="<?php echo ($service['duration']>0)?"pull-right":"text-center"; ?>"><i class="fa fa-tag"></i> <?php if($service['rate']>0){ echo $obj_settings->rzvy_currency_position($rzvy_currency_symbol,$rzvy_currency_position,$service['rate']); }else{ echo $rzvy_freelabel; } ?></span><?php } ?>
										 </div>
										<input type="radio" name="rzvy-services-radio" class="rzvy-services-radio-change" id="rzvy-services-radio-<?php echo $service["id"]; ?>" data-id="<?php echo $service["id"]; ?>">
										<?php if($service['description']!=""){ ?>
											<a href="javascript:void(0);" class="read-more" data-bs-toggle="offcanvas" data-bs-target="#rzvy-view-service-modal-<?php echo $service['id']; ?>" aria-controls="<?php echo ucwords($service["title"]); ?>"><?php if(isset($rzvy_translangArr['read_more'])){ echo $rzvy_translangArr['read_more']; }else{ echo $rzvy_defaultlang['read_more']; } ?></a>
										<?php } ?>
									</figcaption>
								</figure>
							</div>
						<?php 
						}
					} ?>
					</div>					
					<?php 
					if($nonlocation_services==mysqli_num_rows($all_services)){
						?>
						<h5 class="step-title <?php echo $inputAlignment; ?>"><?php if(isset($rzvy_translangArr['there_is_no_services_for_this_location'])){ echo $rzvy_translangArr['there_is_no_services_for_this_location']; }else{ echo $rzvy_defaultlang['there_is_no_services_for_this_location']; } ?></h5>
						<?php
					}
				}else{
					?>
					<div class="step-item">
						<h5 class="step-title <?php echo $inputAlignment; ?>">
							<?php if(isset($rzvy_translangArr['there_is_no_services_for_this_business'])){ echo $rzvy_translangArr['there_is_no_services_for_this_business']; }else{ echo $rzvy_defaultlang['there_is_no_services_for_this_business']; } ?>
						</h5>
					</div>
					<?php
				}
				?>
				<?php if($rzvy_services_listing_view == "L"){ ?>
				</div>
				<?php } ?>
				</div>
			</div>
		</div>
		<?php
		$all_services = $obj_frontend->get_services_without_cat_id();
			$nonlocation_services = 0; 
			if(mysqli_num_rows($all_services)>0){
				while($service = mysqli_fetch_array($all_services)){
					if($service['description']==""){ continue; }
				?>
				<div class="offcanvas offcanvas-end" tabindex="-1" id="rzvy-view-service-modal-<?php echo $service["id"]; ?>">
				  <div class="offcanvas-header">
					<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
				  </div>
				  <div class="offcanvas-body">
					<?php 
					$service_image = $service['image'];
					if($service_image != '' && file_exists(dirname(dirname(dirname(__FILE__)))."/uploads/images/".$service_image)){
						$serviceimage = SITE_URL."uploads/images/".$service_image;
					}else{
						$serviceimage = SITE_URL."includes/images/noimage.png";
					}
					$otherdetailpart = "12";
					if($rzvy_show_service_image == "Y"){
						$otherdetailpart = "9";
						?>
						<div class="rzvy-image">
							<img src="<?php echo $serviceimage; ?>"/>
						</div>
						<?php
					}
					?>
					<h2><?php echo $service['title']; ?></h2>
					<p><?php echo ucfirst($service['description']); ?></p>
					<div class="service-meta">
						<?php if($rzvy_price_display=='Y'){ ?> <span><i class="fa fa-fw fa-money"></i>&nbsp;&nbsp;<strong><?php if(isset($rzvy_translangArr['rate_ad'])){ echo $rzvy_translangArr['rate_ad']; }else{ echo $rzvy_defaultlang['rate_ad']; } ?></strong>&nbsp;<?php echo $obj_settings->rzvy_currency_position($rzvy_currency_symbol,$rzvy_currency_position,$service['rate']); ?>	</span><?php } ?>
						<span><i class="fa fa-fw fa-clock-o"></i>&nbsp;&nbsp;<strong><?php if(isset($rzvy_translangArr['duration_ad'])){ echo $rzvy_translangArr['duration_ad']; }else{ echo $rzvy_defaultlang['duration_ad']; } ?></strong>&nbsp;<?php echo $service['duration']." Minutes"; ?></span>
						<span><i class="fa fa-fw fa-map-marker"></i>&nbsp;&nbsp;<strong><?php if(isset($rzvy_translangArr['service_locations'])){ echo $rzvy_translangArr['service_locations']; }else{ echo $rzvy_defaultlang['service_locations']; } ?> </strong>&nbsp;<?php if(isset($service['locations']) && $service['locations']!=''){ echo $service['locations']; }else{ if(isset($rzvy_translangArr['all_over'])){ echo $rzvy_translangArr['all_over']; }else{ echo $rzvy_defaultlang['all_over']; } } ?></span>	
					</div>
				  </div>
				</div>
				<?php 
			}	
		}
	} 
	?>
	
	<div class="rzvy_show_hide_addons pt-5">
		<div class="step-item">
				<h5 class="step-title <?php echo $inputAlignment; ?>"><?php if(isset($rzvy_translangArr['select_additional_services'])){ echo $rzvy_translangArr['select_additional_services']; }else{ echo $rzvy_defaultlang['select_additional_services']; } ?></h5>
		</div>
	</div>
	<div id="rzvy_multi_and_single_qty_addons_content">
		<!-- multipleqty & singleqty addons will go here -->
	</div>
	<?php 
}
/* Get available slots ajax */
else if(isset($_POST['get_slots_any_staff'])){ 
	$rzvy_settings_timezone = $obj_settings->get_option("rzvy_timezone");
	$rzvy_server_timezone = date_default_timezone_get();
	$currDateTime_withTZ = $obj_settings->get_current_time_according_selected_timezone($rzvy_server_timezone,$rzvy_settings_timezone); 

	$slotof = $_POST['slots_of'];
	$selected_date = date("Y-m-d",$currDateTime_withTZ);
	
	if(isset($rzvy_translangArr['no_free_slots_today'])){ $noslot_message = $rzvy_translangArr['no_free_slots_today']; }else{ $noslot_message = $rzvy_defaultlang['no_free_slots_today']; }
	
	if($slotof=='tomorrow'){
		$selected_date = date("Y-m-d", strtotime('+1 days',strtotime($selected_date)));
		if(isset($rzvy_translangArr['no_free_slots_tomorrow'])){ $noslot_message = $rzvy_translangArr['no_free_slots_tomorrow']; }else{ $noslot_message = $rzvy_defaultlang['no_free_slots_tomorrow']; }
	}
	
	$servicestaffs = array();
	foreach($_POST['staff_ids'] as $staffid){
		$isOffDay = $obj_slots->isDayOffCheck($selected_date,$_SESSION['rzvy_cart_service_id'], $staffid); 
		if($isOffDay){
			continue;
		}
		$servicestaffs[] = $staffid;
	}
	if(sizeof($servicestaffs)==0){ ?>
		<div class="pt-1 pb-1 pl-4 pr-4 col-md-12 whitebox">
			<div class="row">
				<div class="col-md-12 rzvy-sm-box mb-3 pt-3 text-center <?php echo $labelAlignmentClassName; ?>">
					<h6><i class="fa fa-calendar"></i> <?php echo date($rzvy_date_format, strtotime($selected_date)); ?></h6>
				</div>
			</div>
			<div class="col-md-12 rzvy-sm-box rzvy_slot_new text-center">
				<h6><?php echo $noslot_message; ?></h6>
			</div>
		</div><?php 	die();	
	}
	
	
	$rzvy_slotsof_css = '';
	$rzvy_staff_noneslot_count = 0;
	
	
	$rzvy_minimum_advance_booking_time = $obj_settings->get_option('rzvy_minimum_advance_booking_time');
	$rzvy_maximum_advance_booking_time = $obj_settings->get_option('rzvy_maximum_advance_booking_time');
	$rzvy_hide_already_booked_slots_from_frontend_calendar = $obj_settings->get_option('rzvy_hide_already_booked_slots_from_frontend_calendar');
	
	$rzvy_gc_status = $obj_settings->get_option('rzvy_gc_status');
	$rzvy_gc_twowaysync = $obj_settings->get_option('rzvy_gc_twowaysync');
	$rzvy_gc_clientid = $obj_settings->get_option('rzvy_gc_clientid');
	$rzvy_gc_clientsecret = $obj_settings->get_option('rzvy_gc_clientsecret');
	$rzvy_gc_accesstoken = $obj_settings->get_option('rzvy_gc_accesstoken');
	$rzvy_gc_accesstoken = base64_decode($rzvy_gc_accesstoken);
	
	/** check for GC bookings START **/
	$gc_twowaysync_eventsArr = array();
	if($rzvy_gc_status == "Y" && $rzvy_gc_twowaysync == "Y" && $rzvy_gc_clientid != "" && $rzvy_gc_clientsecret != "" && $rzvy_gc_accesstoken != ""){
		$getNewTime = new \DateTime('now', new DateTimeZone($rzvy_settings_timezone));
		$timezoneOffset = $getNewTime->format('P');
		
		include(dirname(dirname(dirname(__FILE__)))."/includes/google-calendar/vendor/autoload.php");
		$client = new Google_Client();
		$client->setScopes(Google_Service_Calendar::CALENDAR_EVENTS);
		$client->setClientId($rzvy_gc_clientid);
		$client->setClientSecret($rzvy_gc_clientsecret);
		$client->setAccessType('offline');
		$client->setPrompt('select_account consent');

		$accessToken = unserialize($rzvy_gc_accesstoken);
		$client->setAccessToken($accessToken);
		if ($client->isAccessTokenExpired()) {
			$newAccessToken = $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
			$obj_settings->update_option('rzvy_gc_accesstoken',base64_encode(serialize($newAccessToken)));
		}
		$service = new Google_Service_Calendar($client);

		$calendarId = (($obj_settings->get_option('rzvy_gc_calendarid')!= "")?$obj_settings->get_option('rzvy_gc_calendarid'):'primary');
		$optParams = array(
		  'orderBy' => 'startTime',
		  'singleEvents' => true,
		  'timeZone' => $rzvy_settings_timezone,
		  'timeMin' => $selected_date.'T00:00:00'.$timezoneOffset,
		  'timeMax' => $selected_date.'T23:59:59'.$timezoneOffset,
		);
		$results = $service->events->listEvents($calendarId, $optParams);
		$events = $results->getItems();

		if (!empty($events)) {
			foreach ($events as $event) {
				if(!isset($event->transparency) || (isset($event->transparency) && $event->transparency!='transparent')){			
					$EventStartTime = substr($event->start->dateTime, 0, 19);
					$EventEndTime = substr($event->end->dateTime, 0, 19);
					$gcEventArr = array();
					$gcEventArr['start'] = date("Y-m-d H:i", strtotime(str_replace("T"," ",$EventStartTime)));
					$gcEventArr['end'] = date("Y-m-d H:i", strtotime(str_replace("T"," ",$EventEndTime)));
					array_push($gc_twowaysync_eventsArr, $gcEventArr);
				}
			}
		}
	}
	/** check for GC bookings END **/
	
	
	?><div class="pt-1 pb-1 pl-4 pr-4 whitebox">
		<div class="row col-md-12">
			<div class="col-md-12 rzvy-sm-box mb-2 text-center pt-3">
				<h6><i class="fa fa-calendar"></i> <?php echo date($rzvy_date_format, strtotime($selected_date)); ?></h6>
			</div>
		</div>
	<?php
	foreach($servicestaffs as $staffid){		
		$obj_slots->staff_id = $staffid;
		$isEndTime = false;
		$available_slots = $obj_slots->generate_available_slots_dropdown($time_interval, $rzvy_time_format, $selected_date, $advance_bookingtime, $currDateTime_withTZ, $isEndTime, $_SESSION['rzvy_cart_service_id'], $_SESSION['rzvy_cart_total_addon_duration']);
		
		$no_booking = $available_slots['no_booking'];
		if($available_slots['no_booking']<0){
			$no_booking = 0;
		}

		/** check for maximum advance booking time **/
		$current_datetime = strtotime(date("Y-m-d H:i:s", $currDateTime_withTZ));

		/** check for minimum advance booking time **/
		$minimum_date = date("Y-m-d H:i:s", strtotime("+".$rzvy_minimum_advance_booking_time." minutes", $current_datetime));  
		
		
		/** check for staff GC bookings START **/
		$obj_settings->staff_id = $staffid;
		$rzvy_staff_nameinfo = $obj_settings->get_staff_name($staffid);
		
		if(mysqli_num_rows($rzvy_staff_nameinfo)>0){
			$staffinfovalue=mysqli_fetch_array($rzvy_staff_nameinfo);
			$rzvy_staff_name =  $staffinfovalue['firstname'].' '.$staffinfovalue['lastname'];
			
			if($staffinfovalue['image'] != "" && file_exists(dirname(dirname(dirname(__FILE__)))."/uploads/images/".$staffinfovalue['image'])){
				$rzvy_staff_image = SITE_URL."uploads/images/".$staffinfovalue['image']; 
			}else{ 
				$rzvy_staff_image = SITE_URL."includes/images/noimage.png";
			}
		}else{
			$rzvy_staff_name =  '';
			$rzvy_staff_image = SITE_URL."includes/images/noimage.png";
		}
		if($rzvy_show_staff_image == "Y"){
			$rzvy_staff_image = '<img src="'.$rzvy_staff_image.'" width="35px" height="35px">';
		}else{
			$rzvy_staff_image = '<i class="fa fa-user"></i>';
		}		
		
		$rzvy_gc_status = $obj_settings->get_staff_option('rzvy_gc_status');
		$rzvy_gc_twowaysync = $obj_settings->get_staff_option('rzvy_gc_twowaysync');
		$rzvy_gc_accesstoken = $obj_settings->get_staff_option('rzvy_gc_accesstoken');
		$rzvy_gc_accesstoken = base64_decode($rzvy_gc_accesstoken);
		
		if($rzvy_gc_status == "Y" && $rzvy_gc_twowaysync == "Y" && $rzvy_gc_clientid != "" && $rzvy_gc_clientsecret != "" && $rzvy_gc_accesstoken != ""){
			$getNewTime = new \DateTime('now', new DateTimeZone($rzvy_settings_timezone));
			$timezoneOffset = $getNewTime->format('P');
			
			include(dirname(dirname(dirname(__FILE__)))."/includes/google-calendar/vendor/autoload.php");
			$client = new Google_Client();
			$client->setScopes(Google_Service_Calendar::CALENDAR_EVENTS);
			$client->setClientId($rzvy_gc_clientid);
			$client->setClientSecret($rzvy_gc_clientsecret);
			$client->setAccessType('offline');
			$client->setPrompt('select_account consent');

			$accessToken = unserialize($rzvy_gc_accesstoken);
			$client->setAccessToken($accessToken);
			if ($client->isAccessTokenExpired()) {
				$newAccessToken = $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
				$obj_settings->update_staff_option('rzvy_gc_accesstoken',base64_encode(serialize($newAccessToken)));
			}
			$service = new Google_Service_Calendar($client);

			$calendarId = (($obj_settings->get_staff_option('rzvy_gc_calendarid')!= "")?$obj_settings->get_staff_option('rzvy_gc_calendarid'):'primary');
			$optParams = array(
			  'orderBy' => 'startTime',
			  'singleEvents' => true,
			  'timeZone' => $rzvy_settings_timezone,
			  'timeMin' => $selected_date.'T00:00:00'.$timezoneOffset,
			  'timeMax' => $selected_date.'T23:59:59'.$timezoneOffset,
			);
			$results = $service->events->listEvents($calendarId, $optParams);
			$events = $results->getItems();

			if (!empty($events)) {
				foreach ($events as $event) {
					if(!isset($event->transparency) || (isset($event->transparency) && $event->transparency!='transparent')){			
						$EventStartTime = substr($event->start->dateTime, 0, 19);
						$EventEndTime = substr($event->end->dateTime, 0, 19);
						$gcEventArr = array();
						$gcEventArr['start'] = date("Y-m-d H:i", strtotime(str_replace("T"," ",$EventStartTime)));
						$gcEventArr['end'] = date("Y-m-d H:i", strtotime(str_replace("T"," ",$EventEndTime)));
						array_push($gc_twowaysync_eventsArr, $gcEventArr);
					}
				}
			}
		}
		/** check for staff GC bookings END **/ 	
		?>
		<div class="row slot_refresh_div px-5 rzvy_staff_<?php echo $slotof.$staffid;?>">
			<div class="row col-md-12">
				<div class="col-md-12 rzvy-sm-box mb-1 py-2 <?php echo $inputAlignment;?>">
					<label><b><?php echo $rzvy_staff_image.' '.$rzvy_staff_name; ?></b></label>
				</div>
			</div>
				<?php 
				/** time slots **/
				if(isset($available_slots['slots']) && sizeof($available_slots['slots'])>0){
					$i = 1;
					$j = 0;
					foreach($available_slots['slots'] as $slot){
						$no_curr_boookings = $obj_slots->get_slot_bookings($selected_date." ".$slot,$_SESSION['rzvy_cart_service_id']);
						$bookings_blocks = $obj_slots->get_bookings_blocks($selected_date, $slot, $available_slots["serviceaddonduration"]);
						if(strtotime($selected_date." ".$slot)<strtotime($minimum_date)){
							continue;
						}else if(!$bookings_blocks){
							continue;
						}else{
							$booked_slot_exist = false;
							foreach($gc_twowaysync_eventsArr as $event){
								if(strtotime($event["start"]) <= strtotime($selected_date." ".$slot) && strtotime($event["end"]) > strtotime($selected_date." ".$slot)){
									$no_curr_boookings += 1;
								}
								if(strtotime($event["start"]) <= strtotime($selected_date." ".$slot) && strtotime($event["end"]) > strtotime($selected_date." ".$slot) && $no_booking==0){
									$booked_slot_exist = true;
									continue;
								} 
								if(strtotime($event["start"]) <= strtotime($selected_date." ".$slot) && strtotime($event["end"]) > strtotime($selected_date." ".$slot) && $no_booking!=0 && $no_curr_boookings>=$no_booking){
									$booked_slot_exist = true;
									continue;
								} 
							}
							
							$new_endtime_timestamp = strtotime("+".$available_slots["serv_timeinterval"]." minutes", strtotime($selected_date." ".$slot));
							$new_starttime_timestamp = strtotime($selected_date." ".$slot);
							
							foreach($available_slots['booked'] as $bslot){
								if($bslot["start_time"] <= strtotime($selected_date." ".$slot) && $bslot["end_time"] > strtotime($selected_date." ".$slot) && $no_booking==0){
									$booked_slot_exist = true;
									continue;
								}
								if($bslot["start_time"] <= strtotime($selected_date." ".$slot) && $bslot["end_time"] > strtotime($selected_date." ".$slot) && $no_booking!=0 && $no_curr_boookings>=$no_booking){
									$booked_slot_exist = true;
									continue;
								} 
								if($new_starttime_timestamp <= $bslot["start_time"] && $new_endtime_timestamp > $bslot["start_time"] && $no_booking==0){
									$booked_slot_exist = true;
									continue;
								}
								
								if($new_starttime_timestamp <= $bslot["start_time"] && $new_endtime_timestamp > $bslot["start_time"] && $no_booking!=0){
									$no_curr_boookings = $no_curr_boookings+1;
									if($no_curr_boookings>=$no_booking){
										$booked_slot_exist = true;
										continue;
									}
								} 
								if($new_starttime_timestamp < $bslot["end_time"] && $new_endtime_timestamp > $bslot["end_time"] && $no_booking==0){
									$booked_slot_exist = true;
									continue;
								}
								
								if($new_starttime_timestamp < $bslot["end_time"] && $new_endtime_timestamp > $bslot["end_time"] && $no_booking!=0){
									$no_curr_boookings = $no_curr_boookings+1;
									if($no_curr_boookings>=$no_booking){
										$booked_slot_exist = true;
										continue;
									}
								} 
							}
							
							if($booked_slot_exist && $rzvy_hide_already_booked_slots_from_frontend_calendar == "Y"){
								continue;
							}else if($booked_slot_exist && $rzvy_hide_already_booked_slots_from_frontend_calendar == "N" && $no_booking==0){ 
								$blockoff_exist = false;
								if(sizeof($available_slots['block_off'])>0){
									foreach($available_slots['block_off'] as $block_off){
										if((strtotime($selected_date." ".$block_off["start_time"]) <= strtotime($selected_date." ".$slot)) && (strtotime($selected_date." ".$block_off["end_time"]) > strtotime($selected_date." ".$slot))){
											$blockoff_exist = true;
											continue;
										} 
									}
								} 
								if($blockoff_exist){
									continue;
								} 
								$j++;
							}else if($booked_slot_exist && $rzvy_hide_already_booked_slots_from_frontend_calendar == "N" && $no_booking!=0 && $no_curr_boookings>=$no_booking){ 
								$blockoff_exist = false;
								if(sizeof($available_slots['block_off'])>0){
									foreach($available_slots['block_off'] as $block_off){
										if((strtotime($selected_date." ".$block_off["start_time"]) <= strtotime($selected_date." ".$slot)) && (strtotime($selected_date." ".$block_off["end_time"]) > strtotime($selected_date." ".$slot))){
											$blockoff_exist = true;
											continue;
										} 
									}
								} 
								if($blockoff_exist){
									continue;
								} 
								$j++;
							}else{ 
								$blockoff_exist = false;
								if(sizeof($available_slots['block_off'])>0){
									foreach($available_slots['block_off'] as $block_off){
										if((strtotime($selected_date." ".$block_off["start_time"]) <= strtotime($selected_date." ".$slot)) && (strtotime($selected_date." ".$block_off["end_time"]) > strtotime($selected_date." ".$slot))){
											$blockoff_exist = true;
											continue;
										} 
									}
								} 
								if($blockoff_exist){
									continue;
								} 
								?>
								<div class="col-md-3 rzvy-sm-box rzvy_slot_new">
									<div class="rzvy-styled-radio rzvy-styled-radio-second form-check custom">
										<input type="radio" class="rzvy_time_slots_selection rzvy_anystaff_selection" data-staffid="<?php echo $staffid;?>" id="rzvy-time-slot-<?php echo $i.$staffid; ?>" name="rzvy-time-slots" value="<?php echo $slot; ?>">
										<label for="rzvy-time-slot-<?php echo $i.$staffid; ?>"><?php echo date($rzvy_time_format, strtotime($selected_date." ".$slot)); ?></label>
									</div>
								</div>
								<?php 
								$j++;
							}
							$i++;
						}
					}
					if($j == 0){ 
						$rzvy_staff_noneslot_count++;
						$rzvy_slotsof_css .= '.rzvy_staff_'.$slotof.$staffid.'{display:none;}';
					}
				}else{ 
					$rzvy_staff_noneslot_count++;
					$rzvy_slotsof_css .= '.rzvy_staff_'.$slotof.$staffid.'{display:none;}';
				} 
				?>
			</div>
		<?php 
		}
	if($rzvy_staff_noneslot_count==sizeof($servicestaffs)){ ?>
		<div class="col-md-12 rzvy-sm-box rzvy_slot_new text-center">
			<h6><?php echo $noslot_message; ?></h6>
		</div>
	<?php }		
	?><style><?php echo $rzvy_slotsof_css; ?></style></div><?php
}
/** Set staff id in session on selection any slot */
else if(isset($_POST["set_staff_according_any"])){ 
	$_SESSION['rzvy_staff_id'] = $_POST["id"];
}
else if(isset($_POST["get_nestedcat_by_pcid"])){
	$pc_row = $_POST["pc_row"];
	$all_nested_pcategories = $obj_frontend->get_parent_nested_categories($_POST["id"]);
	$total_npcat = mysqli_num_rows($all_nested_pcategories);
	if($total_npcat>0){
		?>
		<div class="rzvy-npc-row rzvy-npc-row-<?php echo $pc_row; ?> pt-3" data-rid="<?php echo $pc_row; ?>">
			<div class="step-title <?php echo $inputAlignment; ?> p-0">
				<?php if(isset($rzvy_translangArr['nested_parent_category_label'.$pc_row])){ echo $rzvy_translangArr['nested_parent_category_label'.$pc_row]; }else{ if(isset($rzvy_defaultlang['nested_parent_category_label'.$pc_row])){ echo $rzvy_defaultlang['nested_parent_category_label'.$pc_row]; }else{ echo $rzvy_defaultlang['nested_parent_category_label5']; } } ?>
			</div>
			<div class="services <?php echo $rzvyrounded;?> p-0">
				<div class="owl-carousel <?php if(in_array('pc',$rzvy_nocarousel_section)){ echo ' owl-carousel-without '; }  if(in_array('pc',$rzvy_nocarouselsm_section)){ echo ' owl-carousel-sm-without '; } ?>" data-items="3" data-items-lg="3" data-items-md="3" data-items-sm="1" data-items-ssm="1" data-margin="24" data-dots="true" data-nav="true"  autoplay="false" data-loop="<?php echo $rzvyloop; ?>">
				<?php 
				while($npcategory = mysqli_fetch_array($all_nested_pcategories)){ 
				
					$pitself = '';
					if(($npcategory['nested_of']=='' && $npcategory['linked_subcat']=='') || ($npcategory['nested_of']!='' && $npcategory['linked_subcat']=='')){
						$pitself = '-pcategories';
					}
					?>
					<div class="item">
						<figure class="<?php echo $insideContentAlignment; ?>">
							<?php $rzvyptclass = ''; if($rzvy_show_parentcategory_image == "Y"){ ?><img src="<?php if($npcategory['image'] != "" && file_exists(dirname(dirname(dirname(__FILE__)))."/uploads/images/".$npcategory['image'])){ echo SITE_URL."uploads/images/".$npcategory['image']; }else{ echo SITE_URL."includes/images/noimage.png"; } ?>"><?php }else{ $rzvyptclass = 'rzvy-pt-figcaption'; } ?>
							<figcaption class="<?php echo $insideContentAlignment.' '.$rzvyptclass; ?>">
							  <h3 class="<?php echo $insideContentAlignment; ?>"><?php echo ucwords($npcategory["cat_name"]); ?></h3>
							  <input type="radio"  name="rzvy-pcategories-radio" class="rzvy-pcategories-selection<?php echo $pitself;?>" id="rzvy-pcategories-selection-<?php echo $npcategory["id"]; ?>" data-id="<?php echo $npcategory["id"]; ?>" data-nprid="<?php echo $pc_row+1; ?>">						 
							</figcaption>
						 </figure>						
					</div>
					<?php 
				} ?></div>
			</div>					
		</div><?php 						
	}else{ 
		?>
		<div class="rzvy-npc-row rzvy-npc-row-<?php echo $pc_row; ?> pt-3" data-rid="<?php echo $pc_row; ?>">
			<h5 class="step-title <?php echo $inputAlignment; ?> p-0">
				<?php if(isset($rzvy_translangArr['please_configure_first_services_from_admin_area'])){ echo $rzvy_translangArr['please_configure_first_services_from_admin_area']; }else{ echo $rzvy_defaultlang['please_configure_first_services_from_admin_area']; } ?>
			</h5>
		</div>
		<?php 
	}
}

/* Get available slots ajax */
else if(isset($_POST['get_recurrence_detail'])){ 
	
	if(!isset($_POST['recurrence_type']) || !isset($_POST['recurrence_booking_limit']) || !isset($_POST['selected_time']) || !isset($_POST['selected_date'])){
		if(isset($_SESSION['recurrence_dates'])){ unset($_SESSION['recurrence_dates']); }
		die();
	}
	if(isset($_POST['recurrence_type']) && $_POST['recurrence_type']==1){
		if(isset($_SESSION['recurrence_dates'])){ unset($_SESSION['recurrence_dates']); }
		die();
	}
	if(isset($_POST['selected_date']) && $_POST['selected_date']==''){
		if(isset($_SESSION['recurrence_dates'])){ unset($_SESSION['recurrence_dates']); }
		die();
	}
	if(isset($_POST['selected_time']) && $_POST['selected_time']==''){
		if(isset($_SESSION['recurrence_dates'])){ unset($_SESSION['recurrence_dates']); }
		die();
	}
	
	$recurrence_type = $_POST['recurrence_type'];
	$recurrence_booking_limit = $_POST['recurrence_booking_limit'];
	$selected_time = $_POST['selected_time'];
	$selected_date = $_POST['selected_date'];
	
	$dayinrement = '7 days';
	if($recurrence_type==2){
		$dayinrement = '7 days';	
	}
	if($recurrence_type==3){
		$dayinrement = '14 days';	
	}
	if($recurrence_type==4){
		$dayinrement = '1 months';	
	}
	
	
	$recurrence_dates_arr = array();
	$recurrence_date = $selected_date;
	for($rb_lp=1;$rb_lp<=$recurrence_booking_limit;$rb_lp++){
		$recurrence_dates_arr[] = date("Y-m-d", strtotime('+'.$dayinrement, strtotime($recurrence_date)));
		$recurrence_date = date("Y-m-d", strtotime('+'.$dayinrement, strtotime($recurrence_date)));
	}
	
	
	
	
	$rzvy_settings_timezone = $obj_settings->get_option("rzvy_timezone");
	$rzvy_server_timezone = date_default_timezone_get();
	$currDateTime_withTZ = $obj_settings->get_current_time_according_selected_timezone($rzvy_server_timezone,$rzvy_settings_timezone);
	
	
	$rzvy_hide_already_booked_slots_from_frontend_calendar = $obj_settings->get_option('rzvy_hide_already_booked_slots_from_frontend_calendar');
	$rzvy_minimum_advance_booking_time = $obj_settings->get_option('rzvy_minimum_advance_booking_time');
	$rzvy_maximum_advance_booking_time = $obj_settings->get_option('rzvy_maximum_advance_booking_time');

	/** check for maximum advance booking time **/
	$current_datetime = strtotime(date("Y-m-d H:i:s", $currDateTime_withTZ));
	$maximum_date = date("Y-m-d", strtotime('+'.$rzvy_maximum_advance_booking_time.' months', $current_datetime));
	$maximum_date = date($maximum_date, $currDateTime_withTZ);

	/** check for minimum advance booking time **/
	$minimum_date = date("Y-m-d H:i:s", strtotime("+".$rzvy_minimum_advance_booking_time." minutes", $current_datetime)); 
	
	
	$rzvy_gc_status = $obj_settings->get_option('rzvy_gc_status');
	$rzvy_gc_twowaysync = $obj_settings->get_option('rzvy_gc_twowaysync');
	$rzvy_gc_clientid = $obj_settings->get_option('rzvy_gc_clientid');
	$rzvy_gc_clientsecret = $obj_settings->get_option('rzvy_gc_clientsecret');
	$rzvy_gc_accesstoken = $obj_settings->get_option('rzvy_gc_accesstoken');
	$rzvy_gc_accesstoken = base64_decode($rzvy_gc_accesstoken);
	
	$recurrence_non_avl_dates = array();
	$recurrence_avl_dates = array();
	
	foreach($recurrence_dates_arr as $recurrence_date){
		$selected_date = date("Y-m-d", strtotime($recurrence_date));
		$selected_date = date($selected_date, $currDateTime_withTZ);
	
		$isEndTime = false;
		
		/** check for GC bookings START **/
		$gc_twowaysync_eventsArr = array();
		if($rzvy_gc_status == "Y" && $rzvy_gc_twowaysync == "Y" && $rzvy_gc_clientid != "" && $rzvy_gc_clientsecret != "" && $rzvy_gc_accesstoken != ""){
			$getNewTime = new \DateTime('now', new DateTimeZone($rzvy_settings_timezone));
			$timezoneOffset = $getNewTime->format('P');
			
			include(dirname(dirname(dirname(__FILE__)))."/includes/google-calendar/vendor/autoload.php");
			$client = new Google_Client();
			$client->setScopes(Google_Service_Calendar::CALENDAR_EVENTS);
			$client->setClientId($rzvy_gc_clientid);
			$client->setClientSecret($rzvy_gc_clientsecret);
			$client->setAccessType('offline');
			$client->setPrompt('select_account consent');

			$accessToken = unserialize($rzvy_gc_accesstoken);
			$client->setAccessToken($accessToken);
			if ($client->isAccessTokenExpired()) {
				$newAccessToken = $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
				$obj_settings->update_option('rzvy_gc_accesstoken',base64_encode(serialize($newAccessToken)));
			}
			$service = new Google_Service_Calendar($client);

			$calendarId = (($obj_settings->get_option('rzvy_gc_calendarid')!= "")?$obj_settings->get_option('rzvy_gc_calendarid'):'primary');
			$optParams = array(
			  'orderBy' => 'startTime',
			  'singleEvents' => true,
			  'timeZone' => $rzvy_settings_timezone,
			  'timeMin' => $selected_date.'T00:00:00'.$timezoneOffset,
			  'timeMax' => $selected_date.'T23:59:59'.$timezoneOffset,
			);
			$results = $service->events->listEvents($calendarId, $optParams);
			$events = $results->getItems();

			if (!empty($events)) {
				foreach ($events as $event) {
					if(!isset($event->transparency) || (isset($event->transparency) && $event->transparency!='transparent')){			
						$EventStartTime = substr($event->start->dateTime, 0, 19);
						$EventEndTime = substr($event->end->dateTime, 0, 19);
						$gcEventArr = array();
						$gcEventArr['start'] = date("Y-m-d H:i", strtotime(str_replace("T"," ",$EventStartTime)));
						$gcEventArr['end'] = date("Y-m-d H:i", strtotime(str_replace("T"," ",$EventEndTime)));
						array_push($gc_twowaysync_eventsArr, $gcEventArr);
						array_push($obj_slots->endtime_arr, strtotime(str_replace("T"," ",$EventEndTime)));
					}
				}
			}
		}
		/** check for GC bookings END **/
		
		/** check for staff GC bookings START **/
		if($_SESSION['rzvy_staff_id']>0){
			$obj_settings->staff_id = $_SESSION['rzvy_staff_id'];
			$rzvy_gc_status = $obj_settings->get_staff_option('rzvy_gc_status');
			$rzvy_gc_twowaysync = $obj_settings->get_staff_option('rzvy_gc_twowaysync');
			$rzvy_gc_accesstoken = $obj_settings->get_staff_option('rzvy_gc_accesstoken');
			$rzvy_gc_accesstoken = base64_decode($rzvy_gc_accesstoken);
			
			if($rzvy_gc_status == "Y" && $rzvy_gc_twowaysync == "Y" && $rzvy_gc_clientid != "" && $rzvy_gc_clientsecret != "" && $rzvy_gc_accesstoken != ""){
				$getNewTime = new \DateTime('now', new DateTimeZone($rzvy_settings_timezone));
				$timezoneOffset = $getNewTime->format('P');
				
				include(dirname(dirname(dirname(__FILE__)))."/includes/google-calendar/vendor/autoload.php");
				$client = new Google_Client();
				$client->setScopes(Google_Service_Calendar::CALENDAR_EVENTS);
				$client->setClientId($rzvy_gc_clientid);
				$client->setClientSecret($rzvy_gc_clientsecret);
				$client->setAccessType('offline');
				$client->setPrompt('select_account consent');

				$accessToken = unserialize($rzvy_gc_accesstoken);
				$client->setAccessToken($accessToken);
				if ($client->isAccessTokenExpired()) {
					$newAccessToken = $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
					$obj_settings->update_staff_option('rzvy_gc_accesstoken',base64_encode(serialize($newAccessToken)));
				}
				$service = new Google_Service_Calendar($client);

				$calendarId = (($obj_settings->get_staff_option('rzvy_gc_calendarid')!= "")?$obj_settings->get_staff_option('rzvy_gc_calendarid'):'primary');
				$optParams = array(
				  'orderBy' => 'startTime',
				  'singleEvents' => true,
				  'timeZone' => $rzvy_settings_timezone,
				  'timeMin' => $selected_date.'T00:00:00'.$timezoneOffset,
				  'timeMax' => $selected_date.'T23:59:59'.$timezoneOffset,
				);
				$results = $service->events->listEvents($calendarId, $optParams);
				$events = $results->getItems();

				if (!empty($events)) {
					foreach ($events as $event) {
						if(!isset($event->transparency) || (isset($event->transparency) && $event->transparency!='transparent')){			
							$EventStartTime = substr($event->start->dateTime, 0, 19);
							$EventEndTime = substr($event->end->dateTime, 0, 19);
							$gcEventArr = array();
							$gcEventArr['start'] = date("Y-m-d H:i", strtotime(str_replace("T"," ",$EventStartTime)));
							$gcEventArr['end'] = date("Y-m-d H:i", strtotime(str_replace("T"," ",$EventEndTime)));
							array_push($obj_slots->endtime_arr, strtotime(str_replace("T"," ",$EventEndTime)));
							array_push($gc_twowaysync_eventsArr, $gcEventArr);
						}
					}
				}
			}
		}
		/** check for staff GC bookings END **/ 
		
		if(strtotime($selected_date)>strtotime($maximum_date)){ 
			$recurrence_non_avl_dates[] = $selected_date.' '.$selected_time;
		}else{
			$available_slots = $obj_slots->generate_available_slots_dropdown($time_interval, $rzvy_time_format, $selected_date, $advance_bookingtime, $currDateTime_withTZ, $isEndTime, $_SESSION['rzvy_cart_service_id'], $_SESSION['rzvy_cart_total_addon_duration']);
			
			$no_booking = $available_slots['no_booking'];
			if($available_slots['no_booking']<0){
				$no_booking = 0;
			}
			if(isset($available_slots['slots']) && sizeof($available_slots['slots'])>0){
				$available_slots['slots'] = array($selected_time);
				$i = 1;
				$j = 0;
				foreach($available_slots['slots'] as $slot){
					$no_curr_boookings = $obj_slots->get_slot_bookings($selected_date." ".$slot,$_SESSION['rzvy_cart_service_id']);
					$bookings_blocks = $obj_slots->get_bookings_blocks($selected_date, $slot, $available_slots["serviceaddonduration"]);
					if(strtotime($selected_date." ".$slot)<strtotime($minimum_date)){
						continue;
					}else if(!$bookings_blocks){
						continue;
					}else{
						$booked_slot_exist = false;
						foreach($gc_twowaysync_eventsArr as $event){
							if(strtotime($event["start"]) <= strtotime($selected_date." ".$slot) && strtotime($event["end"]) > strtotime($selected_date." ".$slot)){
								$no_curr_boookings += 1;
							}
							if(strtotime($event["start"]) <= strtotime($selected_date." ".$slot) && strtotime($event["end"]) > strtotime($selected_date." ".$slot) && $no_booking==0){
								$booked_slot_exist = true;
								continue;
							} 
							if(strtotime($event["start"]) <= strtotime($selected_date." ".$slot) && strtotime($event["end"]) > strtotime($selected_date." ".$slot) && $no_booking!=0 && $no_curr_boookings>=$no_booking){
								$booked_slot_exist = true;
								continue;
							} 
						}
						
						$new_endtime_timestamp = strtotime("+".$available_slots["serv_timeinterval"]." minutes", strtotime($selected_date." ".$slot));
						$new_starttime_timestamp = strtotime($selected_date." ".$slot);
						
						foreach($available_slots['booked'] as $bslot){
							if($bslot["start_time"] <= strtotime($selected_date." ".$slot) && $bslot["end_time"] > strtotime($selected_date." ".$slot) && $no_booking==0){
								$booked_slot_exist = true;
								continue;
							}
							if($bslot["start_time"] <= strtotime($selected_date." ".$slot) && $bslot["end_time"] > strtotime($selected_date." ".$slot) && $no_booking!=0 && $no_curr_boookings>=$no_booking){
								$booked_slot_exist = true;
								continue;
							} 
							if($new_starttime_timestamp <= $bslot["start_time"] && $new_endtime_timestamp > $bslot["start_time"] && $no_booking==0){
								$booked_slot_exist = true;
								continue;
							}
							
							if($new_starttime_timestamp <= $bslot["start_time"] && $new_endtime_timestamp > $bslot["start_time"] && $no_booking!=0){
							    $no_curr_boookings = $no_curr_boookings+1;
							    if($no_curr_boookings>=$no_booking){
    								$booked_slot_exist = true;
    								continue;
							    }
							} 
							if($new_starttime_timestamp < $bslot["end_time"] && $new_endtime_timestamp > $bslot["end_time"] && $no_booking==0){
								$booked_slot_exist = true;
								continue;
							}
							
							if($new_starttime_timestamp < $bslot["end_time"] && $new_endtime_timestamp > $bslot["end_time"] && $no_booking!=0){
							    $no_curr_boookings = $no_curr_boookings+1;
							    if($no_curr_boookings>=$no_booking){
    								$booked_slot_exist = true;
    								continue;
							    }
							} 
						}
						
						if($booked_slot_exist && $rzvy_hide_already_booked_slots_from_frontend_calendar == "Y"){
							continue;
						}else if($booked_slot_exist && $rzvy_hide_already_booked_slots_from_frontend_calendar == "N" && $no_booking==0){ 
							$blockoff_exist = false;
							if(sizeof($available_slots['block_off'])>0){
								foreach($available_slots['block_off'] as $block_off){
									if((strtotime($selected_date." ".$block_off["start_time"]) <= strtotime($selected_date." ".$slot)) && (strtotime($selected_date." ".$block_off["end_time"]) > strtotime($selected_date." ".$slot))){
										$blockoff_exist = true;
										continue;
									} 
								}
							} 
							if($blockoff_exist){
								continue;
							} 
							$recurrence_non_avl_dates[] = $selected_date.' '.$selected_time;
							$j++;
						}else if($booked_slot_exist && $rzvy_hide_already_booked_slots_from_frontend_calendar == "N" && $no_booking!=0 && $no_curr_boookings>=$no_booking){ 
							$blockoff_exist = false;
							if(sizeof($available_slots['block_off'])>0){
								foreach($available_slots['block_off'] as $block_off){
									if((strtotime($selected_date." ".$block_off["start_time"]) <= strtotime($selected_date." ".$slot)) && (strtotime($selected_date." ".$block_off["end_time"]) > strtotime($selected_date." ".$slot))){
										$blockoff_exist = true;
										continue;
									} 
								}
							} 
							if($blockoff_exist){
								continue;
							} 
							$recurrence_non_avl_dates[] = $selected_date.' '.$selected_time;
							$j++;
						}else{ 
							$blockoff_exist = false;
							if(sizeof($available_slots['block_off'])>0){
								foreach($available_slots['block_off'] as $block_off){
									if((strtotime($selected_date." ".$block_off["start_time"]) <= strtotime($selected_date." ".$slot)) && (strtotime($selected_date." ".$block_off["end_time"]) > strtotime($selected_date." ".$slot))){
										$blockoff_exist = true;
										continue;
									} 
								}
							} 
							if($blockoff_exist){
								continue;
							} 
							$recurrence_avl_dates[] = $selected_date.' '.$selected_time;
							$j++;
						}
						$i++;
					}
				}
				if($j == 0){
					$recurrence_non_avl_dates[] = $selected_date.' '.$selected_time;
				}
			}else{
				$recurrence_non_avl_dates[] = $selected_date.' '.$selected_time;
			}			
		}		
	}
	sort($recurrence_avl_dates);
	$_SESSION['recurrence_dates'] = $recurrence_avl_dates;
	?>
	<div class="rzvy_recurrence_dates_container">
		<div class="rzvy-inline-calendar-container-boxshadow pl-5 pr-5 pb-2 pt-3 mt-3 mb-3 text-center"><?php 
			if(sizeof($recurrence_avl_dates)>0){			?>
				<span class="text-center rzvy_rb_avl_dt"><b><i class="fa fa-calendar text-success"></i> <?php if(isset($rzvy_translangArr['recurrence_bookings_available_dates'])){ echo $rzvy_translangArr['recurrence_bookings_available_dates']; }else{ echo $rzvy_defaultlang['recurrence_bookings_available_dates']; } ?></b></span><br/>
				<?php
				foreach($recurrence_avl_dates as $recurrence_avl_date){
					?><span class="text-center"><b><i class="fa fa-calendar text-success"></i> <?php echo date($rzvy_date_format, strtotime($recurrence_avl_date)); ?></b></span><br/><?php 
				} 
			}
			if(sizeof($recurrence_non_avl_dates)>0){			?>
				<br/><span class="text-center"><b><i class="fa fa-calendar text-danger"></i> <?php if(isset($rzvy_translangArr['recurrence_bookings_nonavailable_dates'])){ echo $rzvy_translangArr['recurrence_bookings_nonavailable_dates']; }else{ echo $rzvy_defaultlang['recurrence_bookings_nonavailable_dates']; } ?></b></span><br/>
				<?php
				foreach($recurrence_non_avl_dates as $recurrence_non_avl_date){
					?><span class="text-center"><b><i class="fa fa-calendar text-danger"></i> <?php echo date($rzvy_date_format, strtotime($recurrence_non_avl_date)); ?></b></span><br/><?php 
				} ?>
				<span class="text-center"><p class="text-info p-3"><?php if(isset($rzvy_translangArr['recurrence_booking_note'])){ echo $rzvy_translangArr['recurrence_booking_note']; }else{ echo $rzvy_defaultlang['recurrence_booking_note']; } ?></b></span><br/><?php 
			} ?>
				
		</div>	
	</div><?php 	
}
