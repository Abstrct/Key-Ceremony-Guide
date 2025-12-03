
const bip32 = require('bip32');
const bip39 = require('bip39');
const shajs = require('sha.js');
const sss = require('secrets.js');

var combined_entropy = '';
var current_seed = '';

var timer_system_status = null;
var timer_TrueRNG = null;
var timer_date = null;

var shares = null;

var understandable = 0;

$(document).ready(function() {
	$('#button_generate').click(function(){

		current_seed = '';
		
		if ($('#entropy_checkbox_dice').is(':checked')) {

			current_seed = current_seed + $('#entropy_dice_field').val().toString(16);

		}
		
		if ($('#entropy_checkbox_cards').is(':checked')) {
			
			current_seed = ((current_seed == '') ? '' : current_seed + ' ')

			current_seed = current_seed + $('#entropy_cards_field').val().toString(16);
			
		} 
		
		if ($('#entropy_checkbox_date').is(':checked')) {
			
			current_seed = ((current_seed == '') ? '' : current_seed + ' ')

			current_seed = current_seed + $('#entropy_date_field').val().toString(16);
			
		} 

		if ($('#entropy_checkbox_system_status').is(':checked')) {

			current_seed = ((current_seed == '') ? '' : current_seed + ' ')
			
			current_seed = current_seed + $('#progress_cpu_value').html().toString(16);
			
			current_seed = current_seed + ' ' + $('#progress_ram_value').html().toString(16);
			
			current_seed = current_seed + ' ' + $('#progress_net_value').html().toString(16);
			
		} 
		
		if ($('#entropy_checkbox_TrueRNG').is(':checked')) {
			
			current_seed = ((current_seed == '') ? '' : current_seed + ' ')
			current_seed = current_seed + $('#entropy_TrueRNG_field').val().toString(16);
			
		}	
		
		combined_entropy = shajs('sha256').update(current_seed).digest('hex');
		
		displayResults();

	});
	
	$('#button_split').click(function(){
	
		shares = sss.share(combined_entropy, 3, 2 );
		
		$('#splitarea_field_0').html(shares.slice(0).data);
		$('#splitarea_field_1').html(shares.slice(1));
		$('#splitarea_field_2').html(shares.slice(2));
		
		// NEXT build the combine button 

	});

	$('#button_combine').click(function(){
			
	
		if ($('#splitarea_field_0').html() != ''){
			shares[0] = $('#splitarea_field_0').html()
		}
		
		if ($('#splitarea_field_1').html() != ''){
			shares[1] = $('#splitarea_field_1').html() 
		}
		
		if ($('#splitarea_field_2').html() != ''){
			shares[2] = $('#splitarea_field_2').html() 
		}

				
		var combined = sss.combine( shares );
	
		
		console.log(combined)
		
		// NEXT build the combine button 

	});

	
	$('.nes-checkbox').change(function() {
	    if(this.id == 'entropy_checkbox_dice') {
	        if(this.checked) {
	        	$('#entropy_dice_field').prop('disabled', false);
    	        $('#entropy_dice_field').prop('value','');
    	        
        	} else {
    	        $('#entropy_dice_field').prop('disabled', true);
    	        $('#entropy_dice_field').prop('value','ex: 1 3 1 1 3 2 4 5...');
        	}
        } else if (this.id == 'entropy_checkbox_cards') {
	        if(this.checked) {
	        	$('#entropy_cards_field').prop('disabled', false);
	        	$('#entropy_cards_field').prop('value','');
	        	
        	} else {
    	        $('#entropy_cards_field').prop('disabled', true);
    	        $('#entropy_cards_field').prop('value','ex: KC 4S 8C 9H 10D...');
        	}
		} else if (this.id == 'entropy_checkbox_date') {
			if(this.checked) {
				$('#entropy_date_field').prop('disabled', false);
				$('#entropy_date_field').prop('value','');

				timer_date = setInterval(get_Date, 2000);

			} else {
				$('#entropy_date_field').prop('disabled', true);
				$('#entropy_date_field').prop('value','ex: 2025-12-03 10:30');

				clearInterval(timer_date);
			}
        } else if (this.id == 'entropy_checkbox_system_status') {
	        if(this.checked) {
	        	$('#progress_cpu').removeClass('is-pattern');
	        	
	        	$('#progress_ram').removeClass('is-pattern');
	        	
	        	$('#progress_net').removeClass('is-pattern');
	        	
	        	timer_system_status = setInterval(get_system_status, 2000);
	        	
        	} else {
    	        $('#progress_cpu').addClass('is-pattern');
    	        
    	        $('#progress_ram').addClass('is-pattern');
    	        
    	        $('#progress_net').addClass('is-pattern');
    	        
    	        clearInterval(timer_system_status);
        	}
	    } else if (this.id == 'entropy_checkbox_TrueRNG') {  
	        if(this.checked) {
	        	$('#entropy_TrueRNG_field').prop('disabled', false);
	        	
	        	timer_TrueRNG = setInterval(get_TrueRNG,2000);
	        	
        	} else {
    	        $('#entropy_TrueRNG_field').prop('disabled', true);
    	        
    	        clearInterval(timer_TrueRNG);
    	        
        	}		    
		}    
    });
    
    $('input[name=result_display_type]').change(function(){ 
	    $('.result_display_type').removeClass('is-primary');
	    $('#results_display_type_' + this.value + '_value').addClass('is-primary');

		displayResults();
	});
	
	
	// Troll
	$('#button_understand').click(function(){

		if (understandable > 10) {
			$('#understood').html('(lol, this is staying)');
		} else {
			$('#understood').html('');			
		}
		
		understandable = (understandable + 1 ) % 13;
		
	});

});

function generatePrivateKey(seed) {
	seedHex = Buffer.alloc(64,seed.toString(16))

	let n = bip32.fromSeed(seedHex)

	return n.toBase58()
}

function generatePublicKey(seed) {
	seedHex = Buffer.alloc(64,seed.toString(16))

	let n = bip32.fromSeed(seedHex)

	return n.neutered().toBase58()
}

function generateMnemonic(seed) {
	const mnemonic = bip39.entropyToMnemonic(seed)

	return mnemonic;
}

function displayResults() {
	
	results = ''; 
	
	if ($('input[name=result_display_type]:checked').val() == 'Entropy' ) {
		results = current_seed;
		
	} else if ($('input[name=result_display_type]:checked').val() == 'Seed' ) {
		results = combined_entropy;
		
	} else if ($('input[name=result_display_type]:checked').val() == 'Words' ) {
		results = generateMnemonic(combined_entropy.toString(16));	
		
	} else if ($('input[name=result_display_type]:checked').val() == 'xpriv' ) {
		results = generatePrivateKey(combined_entropy);	
		
	} else if ($('input[name=result_display_type]:checked').val() == 'xpub' ) {
		results = generatePublicKey(combined_entropy);	

	} else if ($('input[name=result_display_type]:checked').val() == 'Hide' ) {
		results = 'hidden'
	}	
		
	$('#textarea_field').html(results);   
	
}

get_system_status = function system_status(){
	if ($('input[name=entropy_system_status_type]:checked').val() == 'Optimistic') {
	    $('#progress_cpu').attr('value',Math.random() * Math.floor(99));
	    $('#progress_cpu_value').html(zeroPad(Math.round($('#progress_cpu').val()),2));
	
	    $('#progress_ram').attr('value',Math.random() * Math.floor(99));
	    $('#progress_ram_value').html(zeroPad(Math.round($('#progress_ram').val()),2));
	    
	    $('#progress_net').attr('value',Math.random() * Math.floor(99));
	    $('#progress_net_value').html(zeroPad(Math.round($('#progress_net').val()),2));
	} else {
	    $('#progress_cpu').attr('value',Math.random() * Math.floor(20) + 70);
	    $('#progress_cpu_value').html(zeroPad(Math.round($('#progress_cpu').val()),2));
	
	    $('#progress_ram').attr('value',Math.random() * Math.floor(5) + 5);
	    $('#progress_ram_value').html(zeroPad(Math.round($('#progress_ram').val()),2));
	    
	    $('#progress_net').attr('value',Math.random() * Math.floor(0));
	    $('#progress_net_value').html(zeroPad(Math.round($('#progress_net').val()),2));		
	}
}

get_TrueRNG = function TrueRNG(){
	// Stop judging me...
	$('#entropy_TrueRNG_field').attr('value',
		Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(16).match(/.{2}/g).join(' ') 
		+ ' ' 
		+ Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(16).match(/.{2}/g).join(' ') 
		+ ' ' 
		+ Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(16).match(/.{2}/g).join(' '));
}

get_Date = function NowDate(){
	// Stop judging me...
	var now = new Date();
	var year = now.getFullYear();
	var month = zeroPad(now.getMonth() + 1, 2);
	var day = zeroPad(now.getDate(), 2);
	var hours = zeroPad(now.getHours(), 2);
	var minutes = zeroPad(now.getMinutes(), 2);
	
	$('#entropy_date_field').attr('value', year + '-' + month + '-' + day + ' ' + hours + ':' + minutes);
}

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

