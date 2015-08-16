/*global*/

(function($){
'use strict';

	window.ContactMe = (function(){

		var $envelope = $('.envelope'),
			$openEnvelopeButton = $envelope.find('.send'),
			$body = $envelope.find('.body'),
			$cancelButtons = $envelope.find('.cancel'),
			$form = $envelope.find('form').remove();

		function resetEnvelope(){
			$envelope.removeClass().addClass('envelope ready');
			/// clear form
		}

		function cancelMessage(e){
			closeEnvelope();
			return false;
		}

		function openEnvelope(callback){
			if ($envelope.find('form').length === 0){
				$body.after($form);
			}

			$envelope.removeClass('ready').addClass('open');
			setTimeout(function(){
				$envelope.addClass('out');
				setTimeout(function(){
					if (typeof callback === 'function'){
						callback();
					}
				},800);
			},500);
		}

		function closeEnvelope(callback){
			$envelope.removeClass('out');
			setTimeout(function(){
				$envelope.removeClass('open');
				setTimeout(function(){
					if (typeof callback === 'function'){
						callback();
					}else{
						$envelope.addClass('ready');
					}
				},500);
			},400);
		}

		function sendMessage(e){
			e.preventDefault();

			closeEnvelope(function(){
				$envelope.addClass('sending');

				setTimeout(function(){
					$envelope.addClass('sent');
					setTimeout(function(){
						resetEnvelope();
					},5000);
				},1000);
			});
		}

		function setListeners(){
			$openEnvelopeButton.bind(Device.events.CLICK, openEnvelope);
			$form.bind('submit', sendMessage);
			$cancelButtons.bind(Device.events.CLICK, cancelMessage);
		}

		(function init(){
			setListeners();
			$envelope.addClass('ready');
		})();

		return {

		};

	})();

}(jQuery || $));