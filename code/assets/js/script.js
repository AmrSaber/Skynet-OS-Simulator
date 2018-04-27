$(function() {

	setInterval(function() {
		var time = new Date(),
			hours = time.getHours(),
			minutes = time.getMinutes();

		if (minutes < 10 ) {
			minutes = "0" + minutes;
		}

		if (hours >= 12) {
			hours = hours - 12;
			$('.nav .right .am-pm').text('PM');
		}

		else {
			$('.nav .right .am-pm').text('AM');
		}


		$('.nav .right .time').text(hours + ':' + minutes);

	},1000);

	var height = $(window).height() - $('.nav').height();
	$('.luncher').height(1000);
	$('.desktop').height(1000);


});


