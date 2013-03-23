var modal = (
	function() {
		var method = {},
			$overlay,
			$modal,
			$content,
			$close;

		// Center the modal in the viewport
		method.center = function () {
			var top, left;

			top = Math.max($(window).height() - $modal.outerHeight(), 0) / 2;
			left = Math.max($(window).width() - $modal.outerWidth(), 0) / 2;

			$modal.css({
				top:top + $(window).scrollTop(), 
				left:left + $(window).scrollLeft()
			});
		};

		// Open the modal
		method.open = function (settings) {
			$content.empty().append(settings.content);

			$modal.css({
				width: settings.width || 'auto', 
				height: settings.height || 'auto'
			});

			method.center();

			$(window).bind('resize.modal', method.center);
			$modal.show();
			$overlay.show();
		};

		// Close the modal
		method.close = function () {
			$modal.hide();
			$overlay.hide();
			$content.empty();
			$(window).unbind('resize.modal');
			oMM.reset();
		};

		$overlay = $('<div id="overlay"></div>');
		$modal = $('<div id="modal"><div id="timer-display-canvas"></div></div>');
		$content = $('<div id="content"></div>');
		$close = $('<a id="close" href="#">close</a>');

		$modal.hide();
		$overlay.hide();
		$modal.append($content, $close);

		$(document).ready(function(){
			$('body').append($overlay, $modal);
		});

		$close.click(function(e){
			e.preventDefault();
			method.close();
		});

		return method;
	}());

if ( typeof Array.isArray !== 'function' ) {
	Array.isArray = function( arr ) {
		return Object.prototype.toString.call( arr ) === '[object Array]';
	};
}


function EventTarget(){
	this._listeners = {};
}

EventTarget.prototype = {

	constructor: EventTarget,

	addListener: function(type, listener){
		if (typeof this._listeners[type] == "undefined"){
			this._listeners[type] = [];
		}

		this._listeners[type].push(listener);
	},

	fire: function(event){
		if (typeof event == "string"){
			event = { type: event };
		}
		if (!event.target){
			event.target = this;
		}

		if (!event.type){  //falsy
			throw new Error("Event object missing 'type' property.");
		}

		if (this._listeners[event.type] instanceof Array){
			var listeners = this._listeners[event.type];
			for (var i=0, len=listeners.length; i < len; i++){
				listeners[i].call(this, event);
			}
		}
	},

	removeListener: function(type, listener){
		if (this._listeners[type] instanceof Array){
			var listeners = this._listeners[type];
			for (var i=0, len=listeners.length; i < len; i++){
				if (listeners[i] === listener){
					listeners.splice(i, 1);
					break;
				}
			}
		}
	}
};
