/**
 * Adapted from
 * boxlayout.js v1.0.0
 * http://www.codrops.com
 * Replaced jquery with vanilla js
 * http://youmightnotneedjquery.com/
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Codrops
 * http://www.codrops.com
 *
 */
(function() {
	"use strict";

	var $main = document.getElementById("main"),
		$side = document.getElementById("side"),
		$expandSide = document.getElementById("expand-side"),
		$shrinkSide = document.getElementById("shrink-side"),
		$sections = children($main, "section"),
		$container = document.getElementsByClassName("container")[0],
		transEndEventNames = {
			"WebkitTransition" : "webkitTransitionEnd",
			"MozTransition" : "transitionend",
			"OTransition" : "oTransitionEnd",
			"msTransition" : "MSTransitionEnd",
			"transition" : "transitionend"
		},
		// detecting transition end event name using Modernizr
		transEndEventName = transEndEventNames[ Modernizr.prefixed("transition") ],
		supportTransitions = Modernizr.csstransitions;

	function initEvents() {
		[].forEach.call($sections, function(sectionsEl) {
			var $section = sectionsEl;
			var opt = {};
			// expand the clicked section and scale down the others
			$section.addEventListener("click", function(event) {
				if (!$section.getAttribute("open")) {
					$section.setAttribute("open", true);
					addClass($section, "expand");
					addClass($section, "expand-top");
					addClass($main, "expand-item");
				}
			});

			var $iconClose = $section.querySelector("span.icon-close");
			$iconClose.addEventListener("click", function(event) {
				// close the expanded section and scale up the others
				$section.removeAttribute("open");
				removeClass($section, "expand");
				$section.addEventListener(transEndEventName, function(event) {
					console.log("adding transEndEventName");
					if (!matches(event.target, "section")) {
						return false;
					}
					this.removeEventListener(transEndEventName, function() {
						removeClass(this, "expand-top");
						restoreScrollPos(opt);
					});
				});
				if(!supportTransitions) {
					removeClass($section, "expand-top");
				}
				removeClass($main, "expand-item");
				// Prevent section onclick handler being called
				event.stopPropagation();
			});
		});

		$expandSide.addEventListener("click", toggleSide);
		$shrinkSide.addEventListener("click", toggleSide);
	}

	function addClass(el, className) {
		if (el.classList) {
		  el.classList.add(className);
		}
		else {
		  el.className += " " + className;
		}
	}

	function removeClass(el, className) {
		if (el.classList) {
		  el.classList.remove(className);
		}
		else {
		  el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	}

	function children(el, nodeType) {
		var children = [];
		var child;
		for (var i = el.children.length; i--;) {
		  // Skip comment nodes on IE8
		  child = el.children[i];
		  if (child.nodeType != 8 && child.nodeName.toLowerCase() == nodeType)
		    children.unshift(el.children[i]);
		}
		return children;
	}

	function toggleClass(el, className) {
		if (el.classList) {
		  el.classList.toggle(className);
		} else {
		  var classes = el.className.split(' ');
		  var existingIndex = classes.indexOf(className);

		  if (existingIndex >= 0)
		    classes.splice(existingIndex, 1);
		  else
		    classes.push(className);

		  el.className = classes.join(' ');
		}
	}

	function toggleSide() {
		toggleClass($side, "expand");
	}

	function matches(el, selector) {
	  return (el.matches ||
	  	el.matchesSelector ||
	  	el.msMatchesSelector ||
	  	el.mozMatchesSelector ||
	  	el.webkitMatchesSelector ||
	  	el.oMatchesSelector).call(el, selector);
	};

	initEvents();

})();