/*Main Page*/

	/*Background Blur*/

/**
 * Cache
 */
var $content = $('main .content')
  , $aboutContent = $('#About .content')
  , $blur    = $('main .overlay')
  , $aboutBlur = $('#About .overlay')
  , $menu    = $('.cd-menu-trigger')
  , $typed   = $('.type-wrap')
  , wHeight  = $(window).height();

$(window).on('resize', function(){
  wHeight = $(window).height();
});

/**
 * requestAnimationFrame Shim 
 */
window.requestAnimFrame = (function()
{
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

/**
 * Scroller
 */
function Scroller()
{
  this.latestKnownScrollY = 0;
  this.ticking            = false;
}

Scroller.prototype = {
  /**
   * Initialize
   */
  init: function() {
    window.addEventListener('scroll', this.onScroll.bind(this), false);
  },

  /**
   * Capture Scroll
   */
  onScroll: function() {
    this.latestKnownScrollY = window.scrollY;
    this.requestTick();
  },

  /**
   * Request a Tick
   */
  requestTick: function() {
    if( !this.ticking ) {
      window.requestAnimFrame(this.update.bind(this));
    }
    this.ticking = true;
  },

  /**
   * Update.
   */
  update: function() {
    var currentScrollY = this.latestKnownScrollY;
    this.ticking       = false;
    
    /**
     * Do The Dirty Work Here
     */
    var slowScroll = currentScrollY / 4
      , blurScroll = currentScrollY * 2;
    
    $content.css({
      'transform'         : 'translateY(-' + slowScroll + 'px)',
      '-moz-transform'    : 'translateY(-' + slowScroll + 'px)',
      '-webkit-transform' : 'translateY(-' + slowScroll + 'px)'
    });

    $aboutContent.css({
      'transform'         : 'translateY(-' + slowScroll + 'px)',
      '-moz-transform'    : 'translateY(-' + slowScroll + 'px)',
      '-webkit-transform' : 'translateY(-' + slowScroll + 'px)'	
    })
    /*Main Page Blur*/
    $blur.css({
      'opacity' : blurScroll / wHeight 
    });
     /*Menu Icon Blur*/
    $menu.css({
    	'opacity' : 1 - blurScroll / wHeight
    });
    /*Main Page Typed Intro Blur*/
    $typed.css({
    	'opacity' : 1 - blurScroll / wHeight
    });
    /*About Me Blur In*/
     $aboutBlur.css({
      'opacity' :    (wHeight-currentScrollY) / (blurScroll-slowScroll)
    });
     /*About Me Blur Out*/
     if (currentScrollY >= (1.1 * wHeight)){
     	$aboutBlur.css({
     		'opacity': 1.3 - ((wHeight) / (currentScrollY))
     	});
     }
  }
};

/**
 * Attach!
 */
var scroller = new Scroller();  
scroller.init();



	/*Typing*/

!function($){

	"use strict";

	var Typed = function(el, options){

		// chosen element to manipulate text
		this.el = $(el);
		// options
		this.options = $.extend({}, $.fn.typed.defaults, options);

		// text content of element
		this.text = this.el.text();

		// typing speed
		this.typeSpeed = this.options.typeSpeed;

		// amount of time to wait before backspacing
		this.backDelay = this.options.backDelay;

		// input strings of text
		this.strings = this.options.strings;

		// character number position of current string
		this.strPos = 0;

		// current array position
		this.arrayPos = 0;

		// current string based on current values[] array position
		this.string = this.strings[this.arrayPos];

		// number to stop backspacing on.
		// default 0, can change depending on how many chars
		// you want to remove at the time
		this.stopNum = 0;

		// Looping logic
		this.loop = this.options.loop;
		this.loopCount = this.options.loopCount;
		this.curLoop = 1;
		if (this.loop === false){
			// number in which to stop going through array
			// set to strings[] array (length - 1) to stop deleting after last string is typed
			this.stopArray = this.strings.length-1;
		}
		else{
			this.stopArray = this.strings.length;
		}

		// All systems go!
		this.init();
		this.build();
	}

		Typed.prototype =  {

			constructor: Typed

			, init: function(){
				// begin the loop w/ first current string (global self.string)
				// current string will be passed as an argument each time after this
				this.typewrite(this.string, this.strPos);
			}

			, build: function(){
				this.el.after("<span id=\"typed-cursor\">|</span>");
			}

			// pass current string state to each function
			, typewrite: function(curString, curStrPos){

				// varying values for setTimeout during typing
				// can't be global since number changes each time loop is executed
				var humanize = Math.round(Math.random() * (100 - 30)) + this.typeSpeed;
				var self = this;

				// ------------- optional ------------- //
				// backpaces a certain string faster
				// ------------------------------------ //
				// if (self.arrayPos == 1){
				// 	self.backDelay = 50;
				// }
				// else{ self.backDelay = 500; }

				// containg entire typing function in a timeout
				setTimeout(function() {

					// make sure array position is less than array length
					if (self.arrayPos < self.strings.length){

						// start typing each new char into existing string
						// curString is function arg
						self.el.text(self.text + curString.substr(0, curStrPos));

						// check if current character number is the string's length
						// and if the current array position is less than the stopping point
						// if so, backspace after backDelay setting
						if (curStrPos > curString.length && self.arrayPos < self.stopArray){
							clearTimeout(clear);
							var clear = setTimeout(function(){
								self.backspace(curString, curStrPos);
							}, self.backDelay);
						}

						// else, keep typing
						else{
							// add characters one by one
							curStrPos++;
							// loop the function
							self.typewrite(curString, curStrPos);
							// if the array position is at the stopping position
							// finish code, on to next task
							if (self.loop === false){
								if (self.arrayPos === self.stopArray && curStrPos === curString.length){
									// animation that occurs on the last typed string
									// fires callback function
									var clear = self.options.callback();
									clearTimeout(clear);
								}
							}
						}
					}
					// if the array position is greater than array length
					// and looping is active, reset array pos and start over.
					else if (self.loop === true && self.loopCount === false){
						self.arrayPos = 0;
						self.init();
					}
						else if(self.loopCount !== false && self.curLoop < self.loopCount){
							self.arrayPos = 0;
							self.curLoop = self.curLoop+1;
							self.init();
						}

				// humanized value for typing
				}, humanize);

			}

			, backspace: function(curString, curStrPos){

				// varying values for setTimeout during typing
				// can't be global since number changes each time loop is executed
				var humanize = Math.round(Math.random() * (100 - 30)) + this.typeSpeed;
				var self = this;

				setTimeout(function() {

					// ----- this part is optional ----- //
					// check string array position
					// on the first string, only delete one word
					// the stopNum actually represents the amount of chars to
					// keep in the current string. In my case it's 14.
					 if (self.arrayPos == 1, 2, 3, 4){
						self.stopNum = 22;
					 }
					//every other time, delete the whole typed string
					 //else{
						//self.stopNum = 0;
					 //}

					// ----- continue important stuff ----- //
					// replace text with current text + typed characters
					self.el.text(self.text + curString.substr(0, curStrPos));

					// if the number (id of character in current string) is
					// less than the stop number, keep going
					if (curStrPos > self.stopNum){
						// subtract characters one by one
						curStrPos--;
						// loop the function
						self.backspace(curString, curStrPos);
					}
					// if the stop number has been reached, increase
					// array position to next string
					else if (curStrPos <= self.stopNum){
						clearTimeout(clear);
						var clear = self.arrayPos = self.arrayPos+1;
						// must pass new array position in this instance
						// instead of using global arrayPos
						self.typewrite(self.strings[self.arrayPos], curStrPos);
					}

				// humanized value for typing
				}, humanize);

			}

		}

	$.fn.typed = function (option) {
	    return this.each(function () {
	      var $this = $(this)
	        , data = $this.data('typed')
	        , options = typeof option == 'object' && option
	      if (!data) $this.data('typed', (data = new Typed(this, options)))
	      if (typeof option == 'string') data[option]()
	    });
	}

	$.fn.typed.defaults = {
		strings: ["I code things that are fast", "I code things that are responsive", "I code things that are beautiful", "HI code things that are interactive"],
		// typing and backspacing speed
		typeSpeed: 0,
		// time before backspacing
		backDelay: 500,
		// loop
		loop: false,
		// false = infinite
		loopCount: false,
		// ending callback function
		callback: function(){ null }
	}


}(window.jQuery);


$(function(){

		$("#typed").typed({
			strings: ["< Justin Williams />","I code things that are fast", "I code things that are responsive", "I code things that are beautiful", "< Justin Williams />"],
			typeSpeed: 30,
 			backDelay: 500,
			loop: false,
			// defaults to false for infinite loop
			loopCount: false,
			callback: function(){ foo(); }
		});

		function foo(){ console.log("Callback"); }

	});


/*About Me Card Social Icons*/
$(document).ready(function() {
  $('i').hide();
})

$(window).load(function() {
  $('i').show();

  var twitterPos = $('#twitter').position();
  var githubPos = $('#github').position();
  var stackPos = $('#stack').position();
  var linkedinPos = $('#linkedin').position();
  var codePos = $('#code').position();
  var plusPos = $('#plus').position();
  var mailPos = $('#mail').position();
  var imgPos = $('.me').position();
  
  $('i').css({
    position: 'absolute',
    zIndex: '1',
    top: imgPos.top + 100,
    left: '47%'
  });
  
  setTimeout(function() {
    $('#twitter').animate({
      top: twitterPos.top + 10,
      left: twitterPos.left - 10
    }, 500);
  }, 250);
  
  setTimeout(function() {
    $('#twitter').animate({
      top: twitterPos.top,
      left: twitterPos.left
    }, 250);
    
    $('#github').animate({
      top: githubPos.top + 10,
      left: githubPos.left - 6
    }, 500);
  }, 500);
  
  setTimeout(function() {
    $('#github').animate({
      top: githubPos.top,
      left: githubPos.left
    }, 250);

    
    $('#linkedin').animate({
      top: linkedinPos.top + 10,
      left: linkedinPos.left
    }, 500);
  }, 1000);
  
  setTimeout(function() {
    $('#linkedin').animate({
      top: linkedinPos.top,
      left: linkedinPos.left
    }, 250);
    
    $('#mail').animate({
      top: mailPos.top + 10,
      left: mailPos.left + 10
    }, 500);
  }, 1750);
  
  setTimeout(function() {
    $('#mail').animate({
      top: mailPos.top,
      left: mailPos.left
    }, 250);
  }, 2000);
  
});

$(window).resize(function() {
    if(this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function() {
        $(this).trigger('resizeEnd');
    }, 500);
});
/*Window Resize*/
$(window).bind('resizeEnd', function() {
    //do something, window hasn't changed size in 500ms

    $('i').show();

  var twitterPos = $('#twitter').position();
  var githubPos = $('#github').position();
  var stackPos = $('#stack').position();
  var linkedinPos = $('#linkedin').position();
  var codePos = $('#code').position();
  var plusPos = $('#plus').position();
  var mailPos = $('#mail').position();
  var imgPosNew = $('.me').position();
  
  $('i').css({
    position: 'absolute',
    zIndex: '1',
    top: imgPosNew.top + 100,
    left: '47%'
  });
  
  setTimeout(function() {
    $('#twitter').animate({
      top: twitterPos.top + 10,
      left: twitterPos.left - 10
    }, 500);
  }, 250);
  
  setTimeout(function() {
    $('#twitter').animate({
      top: twitterPos.top,
      left: twitterPos.left
    }, 250);
    
    $('#github').animate({
      top: githubPos.top + 10,
      left: githubPos.left - 6
    }, 500);
  }, 500);
  
  setTimeout(function() {
    $('#github').animate({
      top: githubPos.top,
      left: githubPos.left
    }, 250);

    
    $('#linkedin').animate({
      top: linkedinPos.top + 10,
      left: linkedinPos.left
    }, 500);
  }, 1000);
  
  setTimeout(function() {
    $('#linkedin').animate({
      top: linkedinPos.top,
      left: linkedinPos.left
    }, 250);
    
    $('#mail').animate({
      top: mailPos.top + 10,
      left: mailPos.left + 10
    }, 500);
  }, 1750);
  
  setTimeout(function() {
    $('#mail').animate({
      top: mailPos.top,
      left: mailPos.left
    }, 250);
  }, 2000);
  
});
