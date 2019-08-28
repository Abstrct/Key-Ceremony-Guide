var timer_system_status = null;
var timer_TrueRNG = null;


$(document).ready(function() {
    //set initial state.

    $('.nes-checkbox').change(function() {
	    if(this.id == 'entropy_checkbox_dice') {
	        if(this.checked) {
	        	$('#entropy_dice_field').removeAttr('disabled');
    	        $('#entropy_dice_field').attr('value','');
    	        
    	        $('entropy_checkbox_dice').prop('checked',true);
    	        
        	} else {
    	        $('#entropy_dice_field').attr('disabled', 'disabled');
    	        $('#entropy_dice_field').attr('value','ex: 1 3 1 1 3 2 4 5...');
        	}
        } else if (this.id == 'entropy_checkbox_cards') {
	        if(this.checked) {
	        	$('#entropy_cards_field').removeAttr('disabled');
	        	$('#entropy_cards_field').attr('value','');
	        	
        	} else {
    	        $('#entropy_cards_field').attr('disabled', 'disabled');
    	        $('#entropy_cards_field').attr('value','ex: KC 4S 8C 9H 10D...');
        	}
        } else if (this.id == 'entropy_checkbox_system_status') {
	        if(this.checked) {
	        	$('#progress_cpu').removeClass('is-pattern');
	        	
	        	$('#progress_ram').removeClass('is-pattern');
	        	
	        	$('#progress_net').removeClass('is-pattern');
	        	
	        	timer_system_status = setInterval("system_status()", 2000);
	        	
        	} else {
    	        $('#progress_cpu').addClass('is-pattern');
    	        
    	        $('#progress_ram').addClass('is-pattern');
    	        
    	        $('#progress_net').addClass('is-pattern');
    	        
    	        clearInterval(timer_system_status);
        	}
	    } else if (this.id == 'entropy_checkbox_TrueRNG') {  
	        if(this.checked) {
	        	$('#entropy_TrueRNG_field').removeAttr('disabled');
	        	
	        	timer_TrueRNG = setInterval("TrueRNG()",2000);
	        	
        	} else {
    	        $('#entropy_TrueRNG_field').attr('disabled', 'disabled');
    	        
    	        clearInterval(timer_TrueRNG);
    	        
        	}		    
		}    
    });
});


function system_status(){
	if ($('input[name=entropy_system_status_type]:checked').val() == 'Optimistic') {
	    $('#progress_cpu').attr('value',Math.random() * Math.floor(99));
	    $('#progress_cpu_value').html(zeroPad(Math.round($('#progress_cpu').val()),2));
	
	    $('#progress_ram').attr('value',Math.random() * Math.floor(99));
	    $('#progress_ram_value').html(zeroPad(Math.round($('#progress_ram').val()),2));
	    
	    $('#progress_net').attr('value',Math.random() * Math.floor(99));
	    $('#progress_net_value').html(zeroPad(Math.round($('#progress_net').val()),2));
	} else {
	    $('#progress_cpu').attr('value',Math.random() * Math.floor(100));
	    $('#progress_cpu_value').html(zeroPad(Math.round($('#progress_cpu').val()),2));
	
	    $('#progress_ram').attr('value',Math.random() * Math.floor(10));
	    $('#progress_ram_value').html(zeroPad(Math.round($('#progress_ram').val()),2));
	    
	    $('#progress_net').attr('value',Math.random() * Math.floor(0));
	    $('#progress_net_value').html(zeroPad(Math.round($('#progress_net').val()),2));		
	}
}

function TrueRNG(){
	// Stop judging me...
	$('#entropy_TrueRNG_field').attr('value',
		Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(16).match(/.{2}/g).join(' ') 
		+ ' ' 
		+ Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(16).match(/.{2}/g).join(' ') 
		+ ' ' 
		+ Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(16).match(/.{2}/g).join(' '));
}

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}