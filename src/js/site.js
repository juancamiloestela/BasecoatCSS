;(function(){


	// handle forms page hero button
	var funnyMessages = [
		'Ouch!',
		'You like that huh!?',
		'Push it! Push it!',
		'Legend says that if you push the download button on a full moon, you will get a raise in the next 3 to 6 months... just sayin...',
		'Stop playing, get your forms done!'
	];

	$('.form-funny-button').on('click', function(e){
		e.preventDefault();
		var i = Math.floor(Math.random() * funnyMessages.length);
		alert(funnyMessages[i]);
	});

	Peekjs.onOpenRight(function(){
		$('.side-nav a').sequence({
			offset: 30,
			properties: {
				transform: 'none'
			}
		});
	});

	Peekjs.onCloseRight(function(){
		$('.side-nav a').removeAttr('style');
	});
})();