/* Carrd Site JS | carrd.co | License: MIT */

(function() {

	// Main.
		var	on = addEventListener,
			off = removeEventListener,
			$ = function(q) { return document.querySelector(q) },
			$$ = function(q) { return document.querySelectorAll(q) },
			$body = document.body,
			$inner = $('.inner'),
			client = (function() {
		
				var o = {
						browser: 'other',
						browserVersion: 0,
						os: 'other',
						osVersion: 0,
						mobile: false,
						canUse: null,
						flags: {
							lsdUnits: false,
						},
					},
					ua = navigator.userAgent,
					a, i;
		
				// browser, browserVersion.
					a = [
						[
							'firefox',
							/Firefox\/([0-9\.]+)/
						],
						[
							'edge',
							/Edge\/([0-9\.]+)/
						],
						[
							'safari',
							/Version\/([0-9\.]+).+Safari/
						],
						[
							'chrome',
							/Chrome\/([0-9\.]+)/
						],
						[
							'chrome',
							/CriOS\/([0-9\.]+)/
						],
						[
							'ie',
							/Trident\/.+rv:([0-9]+)/
						]
					];
		
					for (i=0; i < a.length; i++) {
		
						if (ua.match(a[i][1])) {
		
							o.browser = a[i][0];
							o.browserVersion = parseFloat(RegExp.$1);
		
							break;
		
						}
		
					}
		
				// os, osVersion.
					a = [
						[
							'ios',
							/([0-9_]+) like Mac OS X/,
							function(v) { return v.replace('_', '.').replace('_', ''); }
						],
						[
							'ios',
							/CPU like Mac OS X/,
							function(v) { return 0 }
						],
						[
							'ios',
							/iPad; CPU/,
							function(v) { return 0 }
						],
						[
							'android',
							/Android ([0-9\.]+)/,
							null
						],
						[
							'mac',
							/Macintosh.+Mac OS X ([0-9_]+)/,
							function(v) { return v.replace('_', '.').replace('_', ''); }
						],
						[
							'windows',
							/Windows NT ([0-9\.]+)/,
							null
						],
						[
							'undefined',
							/Undefined/,
							null
						]
					];
		
					for (i=0; i < a.length; i++) {
		
						if (ua.match(a[i][1])) {
		
							o.os = a[i][0];
							o.osVersion = parseFloat( a[i][2] ? (a[i][2])(RegExp.$1) : RegExp.$1 );
		
							break;
		
						}
		
					}
		
					// Hack: Detect iPads running iPadOS.
						if (o.os == 'mac'
						&&	('ontouchstart' in window)
						&&	(
		
							// 12.9"
								(screen.width == 1024 && screen.height == 1366)
							// 10.2"
								||	(screen.width == 834 && screen.height == 1112)
							// 9.7"
								||	(screen.width == 810 && screen.height == 1080)
							// Legacy
								||	(screen.width == 768 && screen.height == 1024)
		
						))
							o.os = 'ios';
		
				// mobile.
					o.mobile = (o.os == 'android' || o.os == 'ios');
		
				// canUse.
					var _canUse = document.createElement('div');
		
					o.canUse = function(property, value) {
		
						var style;
		
						// Get style.
							style = _canUse.style;
		
						// Property doesn't exist? Can't use it.
							if (!(property in style))
								return false;
		
						// Value provided?
							if (typeof value !== 'undefined') {
		
								// Assign value.
									style[property] = value;
		
								// Value is empty? Can't use it.
									if (style[property] == '')
										return false;
		
							}
		
						return true;
		
					};
		
				// flags.
					o.flags.lsdUnits = o.canUse('width', '100dvw');
		
				return o;
		
			}()),
			trigger = function(t) {
				dispatchEvent(new Event(t));
			},
			cssRules = function(selectorText) {
		
				var ss = document.styleSheets,
					a = [],
					f = function(s) {
		
						var r = s.cssRules,
							i;
		
						for (i=0; i < r.length; i++) {
		
							if (r[i] instanceof CSSMediaRule && matchMedia(r[i].conditionText).matches)
								(f)(r[i]);
							else if (r[i] instanceof CSSStyleRule && r[i].selectorText == selectorText)
								a.push(r[i]);
		
						}
		
					},
					x, i;
		
				for (i=0; i < ss.length; i++)
					f(ss[i]);
		
				return a;
		
			},
			thisHash = function() {
		
				var h = location.hash ? location.hash.substring(1) : null,
					a;
		
				// Null? Bail.
					if (!h)
						return null;
		
				// Query string? Move before hash.
					if (h.match(/\?/)) {
		
						// Split from hash.
							a = h.split('?');
							h = a[0];
		
						// Update hash.
							history.replaceState(undefined, undefined, '#' + h);
		
						// Update search.
							window.location.search = a[1];
		
					}
		
				// Prefix with "x" if not a letter.
					if (h.length > 0
					&&	!h.match(/^[a-zA-Z]/))
						h = 'x' + h;
		
				// Convert to lowercase.
					if (typeof h == 'string')
						h = h.toLowerCase();
		
				return h;
		
			},
			scrollToElement = function(e, style, duration) {
		
				var y, cy, dy,
					start, easing, offset, f;
		
				// Element.
		
					// No element? Assume top of page.
						if (!e)
							y = 0;
		
					// Otherwise ...
						else {
		
							offset = (e.dataset.scrollOffset ? parseInt(e.dataset.scrollOffset) : 0) * parseFloat(getComputedStyle(document.documentElement).fontSize);
		
							switch (e.dataset.scrollBehavior ? e.dataset.scrollBehavior : 'default') {
		
								case 'default':
								default:
		
									y = e.offsetTop + offset;
		
									break;
		
								case 'center':
		
									if (e.offsetHeight < window.innerHeight)
										y = e.offsetTop - ((window.innerHeight - e.offsetHeight) / 2) + offset;
									else
										y = e.offsetTop - offset;
		
									break;
		
								case 'previous':
		
									if (e.previousElementSibling)
										y = e.previousElementSibling.offsetTop + e.previousElementSibling.offsetHeight + offset;
									else
										y = e.offsetTop + offset;
		
									break;
		
							}
		
						}
		
				// Style.
					if (!style)
						style = 'smooth';
		
				// Duration.
					if (!duration)
						duration = 750;
		
				// Instant? Just scroll.
					if (style == 'instant') {
		
						window.scrollTo(0, y);
						return;
		
					}
		
				// Get start, current Y.
					start = Date.now();
					cy = window.scrollY;
					dy = y - cy;
		
				// Set easing.
					switch (style) {
		
						case 'linear':
							easing = function (t) { return t };
							break;
		
						case 'smooth':
							easing = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 };
							break;
		
					}
		
				// Scroll.
					f = function() {
		
						var t = Date.now() - start;
		
						// Hit duration? Scroll to y and finish.
							if (t >= duration)
								window.scroll(0, y);
		
						// Otherwise ...
							else {
		
								// Scroll.
									window.scroll(0, cy + (dy * easing(t / duration)));
		
								// Repeat.
									requestAnimationFrame(f);
		
							}
		
					};
		
					f();
		
			},
			scrollToTop = function() {
		
				// Scroll to top.
					scrollToElement(null);
		
			},
			loadElements = function(parent) {
		
				var a, e, x, i;
		
				// IFRAMEs.
		
					// Get list of unloaded IFRAMEs.
						a = parent.querySelectorAll('iframe[data-src]:not([data-src=""])');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Load.
								a[i].contentWindow.location.replace(a[i].dataset.src);
		
							// Save initial src.
								a[i].dataset.initialSrc = a[i].dataset.src;
		
							// Mark as loaded.
								a[i].dataset.src = '';
		
						}
		
				// Video.
		
					// Get list of videos (autoplay).
						a = parent.querySelectorAll('video[autoplay]');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Play if paused.
								if (a[i].paused)
									a[i].play();
		
						}
		
				// Autofocus.
		
					// Get first element with data-autofocus attribute.
						e = parent.querySelector('[data-autofocus="1"]');
		
					// Determine type.
						x = e ? e.tagName : null;
		
						switch (x) {
		
							case 'FORM':
		
								// Get first input.
									e = e.querySelector('.field input, .field select, .field textarea');
		
								// Found? Focus.
									if (e)
										e.focus();
		
								break;
		
							default:
								break;
		
						}
		
				// Deferred script tags.
		
					// Get list of deferred script tags.
						a = parent.querySelectorAll('deferred-script');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Create replacement script tag.
								x = document.createElement('script');
		
							// Set deferred data attribute (so we can unload this element later).
								x.setAttribute('data-deferred', '');
		
							// Set "src" attribute (if present).
								if (a[i].getAttribute('src'))
									x.setAttribute('src', a[i].getAttribute('src'));
		
							// Set text content (if present).
								if (a[i].textContent)
									x.textContent = a[i].textContent;
		
							// Replace.
								a[i].replaceWith(x);
		
						}
		
			},
			unloadElements = function(parent) {
		
				var a, e, x, i;
		
				// IFRAMEs.
		
					// Get list of loaded IFRAMEs.
						a = parent.querySelectorAll('iframe[data-src=""]');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Don't unload? Skip.
								if (a[i].dataset.srcUnload === '0')
									continue;
		
							// Mark as unloaded.
		
								// IFRAME was previously loaded by loadElements()? Use initialSrc.
									if ('initialSrc' in a[i].dataset)
										a[i].dataset.src = a[i].dataset.initialSrc;
		
								// Otherwise, just use src.
									else
										a[i].dataset.src = a[i].src;
		
							// Unload.
								a[i].contentWindow.location.replace('about:blank');
		
						}
		
				// Video.
		
					// Get list of videos.
						a = parent.querySelectorAll('video');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Pause if playing.
								if (!a[i].paused)
									a[i].pause();
		
						}
		
				// Autofocus.
		
					// Get focused element.
						e = $(':focus');
		
					// Found? Blur.
						if (e)
							e.blur();
		
				// Deferred script tags.
				// NOTE: Disabled for now. May want to bring this back later.
				/*
		
					// Get list of (previously deferred) script tags.
						a = parent.querySelectorAll('script[data-deferred]');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Create replacement deferred-script tag.
								x = document.createElement('deferred-script');
		
							// Set "src" attribute (if present).
								if (a[i].getAttribute('src'))
									x.setAttribute('src', a[i].getAttribute('src'));
		
							// Set text content (if present).
								if (a[i].textContent)
									x.textContent = a[i].textContent;
		
							// Replace.
								a[i].replaceWith(x);
		
						}
		
				*/
		
			};
		
			// Expose scrollToElement.
				window._scrollToTop = scrollToTop;
	
	// Load elements.
		// Load elements (if needed).
			loadElements(document.body);
	
	// Scroll points.
		(function() {
		
			var	scrollPointParent = function(target) {
		
					var inner;
		
					inner = $('#main > .inner');
		
					while (target && target.parentElement != inner)
						target = target.parentElement;
		
					return target;
		
				},
				scrollPointSpeed = function(scrollPoint) {
		
					let x = parseInt(scrollPoint.dataset.scrollSpeed);
		
					switch (x) {
		
						case 5:
							return 250;
		
						case 4:
							return 500;
		
						case 3:
							return 750;
		
						case 2:
							return 1000;
		
						case 1:
							return 1250;
		
						default:
							break;
		
					}
		
					return 750;
		
				},
				doNextScrollPoint = function(event) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find next scroll point.
						while (e && e.nextElementSibling) {
		
							e = e.nextElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
								break;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doPreviousScrollPoint = function(e) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find previous scroll point.
						while (e && e.previousElementSibling) {
		
							e = e.previousElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
								break;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doFirstScrollPoint = function(e) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find first scroll point.
						while (e && e.previousElementSibling) {
		
							e = e.previousElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doLastScrollPoint = function(e) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find last scroll point.
						while (e && e.nextElementSibling) {
		
							e = e.nextElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				};
		
			// Expose doNextScrollPoint, doPreviousScrollPoint, doFirstScrollPoint, doLastScrollPoint.
				window._nextScrollPoint = doNextScrollPoint;
				window._previousScrollPoint = doPreviousScrollPoint;
				window._firstScrollPoint = doFirstScrollPoint;
				window._lastScrollPoint = doLastScrollPoint;
		
			// Override exposed scrollToTop.
				window._scrollToTop = function() {
		
					// Scroll to top.
						scrollToElement(null);
		
					// Scroll point active?
						if (window.location.hash) {
		
							// Reset hash (via new state).
								history.pushState(null, null, '.');
		
						}
		
				};
		
			// Initialize.
		
				// Set scroll restoration to manual.
					if ('scrollRestoration' in history)
						history.scrollRestoration = 'manual';
		
				// Load event.
					on('load', function() {
		
						var initialScrollPoint, h;
		
						// Determine target.
							h = thisHash();
		
							// Contains invalid characters? Might be a third-party hashbang, so ignore it.
								if (h
								&&	!h.match(/^[a-zA-Z0-9\-]+$/))
									h = null;
		
							// Scroll point.
								initialScrollPoint = $('[data-scroll-id="' + h + '"]');
		
						// Scroll to scroll point (if applicable).
							if (initialScrollPoint)
								scrollToElement(initialScrollPoint, 'instant');
		
					});
		
			// Hashchange event.
				on('hashchange', function(event) {
		
					var scrollPoint, h, pos;
		
					// Determine target.
						h = thisHash();
		
						// Contains invalid characters? Might be a third-party hashbang, so ignore it.
							if (h
							&&	!h.match(/^[a-zA-Z0-9\-]+$/))
								return false;
		
						// Scroll point.
							scrollPoint = $('[data-scroll-id="' + h + '"]');
		
					// Scroll to scroll point (if applicable).
						if (scrollPoint)
							scrollToElement(scrollPoint, 'smooth', scrollPointSpeed(scrollPoint));
		
					// Otherwise, just scroll to top.
						else
							scrollToElement(null);
		
					// Bail.
						return false;
		
				});
		
				// Hack: Allow hashchange to trigger on click even if the target's href matches the current hash.
					on('click', function(event) {
		
						var t = event.target,
							tagName = t.tagName.toUpperCase(),
							scrollPoint;
		
						// Find real target.
							switch (tagName) {
		
								case 'IMG':
								case 'SVG':
								case 'USE':
								case 'U':
								case 'STRONG':
								case 'EM':
								case 'CODE':
								case 'S':
								case 'MARK':
								case 'SPAN':
		
									// Find ancestor anchor tag.
										while ( !!(t = t.parentElement) )
											if (t.tagName == 'A')
												break;
		
									// Not found? Bail.
										if (!t)
											return;
		
									break;
		
								default:
									break;
		
							}
		
						// Target is an anchor *and* its href is a hash?
							if (t.tagName == 'A'
							&&	t.getAttribute('href') !== null
							&&	t.getAttribute('href').substr(0, 1) == '#') {
		
								// Hash matches an invisible scroll point?
									if (!!(scrollPoint = $('[data-scroll-id="' + t.hash.substr(1) + '"][data-scroll-invisible="1"]'))) {
		
										// Prevent default.
											event.preventDefault();
		
										// Scroll to element.
											scrollToElement(scrollPoint, 'smooth', scrollPointSpeed(scrollPoint));
		
									}
		
								// Hash matches the current hash?
									else if (t.hash == window.location.hash) {
		
										// Prevent default.
											event.preventDefault();
		
										// Replace state with '#'.
											history.replaceState(undefined, undefined, '#');
		
										// Replace location with target hash.
											location.replace(t.hash);
		
									}
		
							}
		
					});
		
		})();
	
	// Browser hacks.
		// Init.
			var style, sheet, rule;
		
			// Create <style> element.
				style = document.createElement('style');
				style.appendChild(document.createTextNode(''));
				document.head.appendChild(style);
		
			// Get sheet.
				sheet = style.sheet;
		
		// Mobile.
			if (client.mobile) {
		
				// Prevent overscrolling on Safari/other mobile browsers.
				// 'vh' units don't factor in the heights of various browser UI elements so our page ends up being
				// a lot taller than it needs to be (resulting in overscroll and issues with vertical centering).
					(function() {
		
						// Lsd units available?
							if (client.flags.lsdUnits) {
		
								document.documentElement.style.setProperty('--viewport-height', '100svh');
								document.documentElement.style.setProperty('--background-height', '100lvh');
		
							}
		
						// Otherwise, use innerHeight hack.
							else {
		
								var f = function() {
									document.documentElement.style.setProperty('--viewport-height', window.innerHeight + 'px');
									document.documentElement.style.setProperty('--background-height', (window.innerHeight + 250) + 'px');
								};
		
								on('load', f);
								on('orientationchange', function() {
		
									// Update after brief delay.
										setTimeout(function() {
											(f)();
										}, 100);
		
								});
		
							}
		
					})();
		
			}
		
		// Android.
			if (client.os == 'android') {
		
				// Prevent background "jump" when address bar shrinks.
				// Specifically, this fix forces the background pseudoelement to a fixed height based on the physical
				// screen size instead of relying on "vh" (which is subject to change when the scrollbar shrinks/grows).
					(function() {
		
						// Insert and get rule.
							sheet.insertRule('body::after { }', 0);
							rule = sheet.cssRules[0];
		
						// Event.
							var f = function() {
								rule.style.cssText = 'height: ' + (Math.max(screen.width, screen.height)) + 'px';
							};
		
							on('load', f);
							on('orientationchange', f);
							on('touchmove', f);
		
					})();
		
				// Apply "is-touch" class to body.
					$body.classList.add('is-touch');
		
			}
		
		// iOS.
			else if (client.os == 'ios') {
		
				// <=11: Prevent white bar below background when address bar shrinks.
				// For some reason, simply forcing GPU acceleration on the background pseudoelement fixes this.
					if (client.osVersion <= 11)
						(function() {
		
							// Insert and get rule.
								sheet.insertRule('body::after { }', 0);
								rule = sheet.cssRules[0];
		
							// Set rule.
								rule.style.cssText = '-webkit-transform: scale(1.0)';
		
						})();
		
				// <=11: Prevent white bar below background when form inputs are focused.
				// Fixed-position elements seem to lose their fixed-ness when this happens, which is a problem
				// because our backgrounds fall into this category.
					if (client.osVersion <= 11)
						(function() {
		
							// Insert and get rule.
								sheet.insertRule('body.ios-focus-fix::before { }', 0);
								rule = sheet.cssRules[0];
		
							// Set rule.
								rule.style.cssText = 'height: calc(100% + 60px)';
		
							// Add event listeners.
								on('focus', function(event) {
									$body.classList.add('ios-focus-fix');
								}, true);
		
								on('blur', function(event) {
									$body.classList.remove('ios-focus-fix');
								}, true);
		
						})();
		
				// Apply "is-touch" class to body.
					$body.classList.add('is-touch');
		
			}
	
	// Visibility.
		(function() {
		
			var	elements = $$('[data-visibility]');
		
			// Initialize elements.
				elements.forEach(function(e) {
		
					var	p = e.parentElement,
						state = false,
						nextSibling = null,
						ne, query;
		
					// Determine next element.
						for (ne = e.nextSibling; ne; ne = ne.nextSibling) {
		
							// Not a node? Skip.
								if (ne.nodeType != 1)
									continue;
		
							// No visibility setting? Found our next element so bail.
								if (!ne.dataset.visibility)
									break;
		
						}
		
					// Determine media query at which to hide element.
						switch (e.dataset.visibility) {
		
							case 'mobile':
								query = '(min-width: 737px)';
								break;
		
							case 'desktop':
								query = '(max-width: 736px)';
								break;
		
							default:
								return;
		
						}
		
					// Create handler.
						f = function() {
		
							// Matches media query?
								if (window.matchMedia(query).matches) {
		
									// Hasn't been applied yet?
										if (!state) {
		
											// Mark as applied.
												state = true;
		
											// Hide element (= remove from DOM).
												p.removeChild(e);
		
										}
		
								}
		
							// Otherwise ...
								else {
		
									// Previously applied?
										if (state) {
		
											// Unmark as applied.
												state = false;
		
											// Show element (= reinsert before next element).
												p.insertBefore(e, ne);
		
										}
		
								}
		
						};
		
					// Add event listeners.
						on('resize', f);
						on('orientationchange', f);
						on('load', f);
						on('fullscreenchange', f);
		
				});
		
		})();
	
	// Variables.
		var variables = {
		
			/**
			 * "New" status.
			 * @var {int}
			 */
			STATUS_NEW: 0,
		
			/**
			 * "Ready" status.
			 * @var {int}
			 */
			STATUS_READY: 1,
		
			/**
			 * "Rendered" status.
			 * @var {int}
			 */
			STATUS_RENDERED: 2,
		
			/**
			 * Cache.
			 * @var {object}
			 */
			cache: {},
		
			/**
			 * Handlers.
			 * @var {object}
			 */
			handlers: {
		
				/**
				 * Anchors.
				 * @var {object}
				 */
				anchors: {
		
					/**
					 * Initializes a set of variables within an element.
					 * @param {object} e Element.
					 */
					init: function(e) {
						variables.handlers.init(e, 'a', [ 'href' ]);
					},
		
					/**
					 * Renders a variable within an element.
					 * @param {object} e Element.
					 * @param {string} name Variable name.
					 * @param {string} value Variable value.
					 */
					render: function(e, name, value) {
						variables.handlers.render(e, 'a', [ 'href' ], name, value);
					},
		
					/**
					 * Resets all variables within an element.
					 * @param {object} e Element.
					 */
					reset: function(e) {
						variables.handlers.reset(e, 'a', [ 'href' ]);
					},
		
				},
		
				/**
				 * Images.
				 * @var {object}
				 */
				images: {
		
					/**
					 * Initializes a set of variables within an element.
					 * @param {object} e Element.
					 */
					init: function(e) {
						variables.handlers.init(e, 'img', [ 'alt' ]);
					},
		
					/**
					 * Renders a variable within an element.
					 * @param {object} e Element.
					 * @param {string} name Variable name.
					 * @param {string} value Variable value.
					 */
					render: function(e, name, value) {
						variables.handlers.render(e, 'img', [ 'alt' ], name, value);
					},
		
					/**
					 * Resets all variables within an element.
					 * @param {object} e Element.
					 */
					reset: function(e) {
						variables.handlers.reset(e, 'img', [ 'alt' ]);
					},
		
				},
		
				/**
				 * Inputs.
				 * @var {object}
				 */
				inputs: {
		
					/**
					 * Initializes a set of variables within an element.
					 * @param {object} e Element.
					 */
					init: function(e) {
						variables.handlers.init(e, 'input, textarea', [ 'placeholder', 'value' ]);
					},
		
					/**
					 * Renders a variable within an element.
					 * @param {object} e Element.
					 * @param {string} name Variable name.
					 * @param {string} value Variable value.
					 */
					render: function(e, name, value) {
						variables.handlers.render(e, 'input, textarea', [ 'placeholder', 'value' ], name, value);
					},
		
					/**
					 * Resets all variables within an element.
					 * @param {object} e Element.
					 */
					reset: function(e) {
						variables.handlers.reset(e, 'input, textarea', [ 'placeholder', 'value' ]);
					},
		
				},
		
				/**
				 * Text.
				 * @var {object}
				 */
				text: {
		
					/**
					 * Initializes a set of variables within an element.
					 * @param {object} e Element.
					 */
					init: function(e) {
		
						var	s, i, r, w;
		
						// Text node?
							if (e.nodeType == Node.TEXT_NODE) {
		
								// Get node value.
									s = e.nodeValue;
		
								// Node doesn't contain variables? Bail.
									if (!variables.hasVariables(s))
										return;
		
								// Convert to <var-item>.
									s = s.replace(
										variables.regex,
										function(x, name, fallback) {
											return '<var-item name="' + variables.escapeHtml(name) + '"' + (fallback !== undefined ? 'fallback="' + variables.escapeHtml(fallback.substr(1)) + '"' : '') + '></var-item>';
										}
									);
		
								// Update.
		
									// Create wrapper.
										w = document.createElement('var-wrapper');
		
									// Populate with processed text.
									// This converts our processed text into a series of new text and element nodes.
										w.innerHTML = s;
		
									// Replace original element with wrapper.
										e.replaceWith(w);
		
									// Step through wrapper's children.
										while (w.childNodes.length > 0) {
		
											// Move child after wrapper.
												w.parentNode.insertBefore(
													w.childNodes[0],
													w
												);
		
										}
		
									// Remove wrapper (now that it's no longer needed).
										w.parentNode.removeChild(w);
		
							}
		
						// Otherwise ...
							else if (e.nodeType == Node.ELEMENT_NODE) {
		
								// Step through child nodes.
									for (i = 0; i < e.childNodes.length; i++) {
		
										// Initialize.
											this.init(e.childNodes[i]);
		
									}
		
							}
		
					},
		
					/**
					 * Renders a variable within an element.
					 * @param {object} e Element.
					 * @param {string} name Variable name.
					 * @param {string} value Variable value.
					 */
					render: function(e, name, value) {
		
						// Step through var items.
							e.querySelectorAll('var-item[name="' + name + '"]').forEach(function(varItem) {
		
								var v;
		
								// Empty value?
									if (value == '') {
		
										// Has fallback? Use it.
											if (varItem.hasAttribute('fallback'))
												v = varItem.getAttribute('fallback');
		
										// Otherwise, use empty string.
											else
												v = '';
		
									}
		
								// Otherwise, use as-is.
									else
										v = value;
		
								// Update value.
									varItem.innerText = v;
		
							});
		
					},
		
					/**
					 * Resets all variables within an element.
					 * @param {object} e Element.
					 */
					reset: function(e) {
		
						// Step through var items.
							e.querySelectorAll('var-item').forEach(function(varItem) {
		
								var v;
		
								// Has fallback? Use it.
									if (varItem.hasAttribute('fallback'))
										v = varItem.getAttribute('fallback');
		
								// Otherwise, use empty string.
									else
										v = '';
		
								// Update value.
									varItem.innerText = v;
		
							});
		
		
					},
		
				},
		
				/**
				 * "Init" helper.
				 * @param {object} e Element.
				 * @param {string} selector Selector.
				 * @param {array} attributes Attributes.
				 */
				init: function(e, selector, attributes) {
		
					// Step through matching items.
						e.querySelectorAll(selector).forEach(function(x) {
		
							// Step through attributes.
								attributes.forEach(function(attribute) {
		
									// Has attribute? Store it.
										if (x.hasAttribute(attribute))
											x['_' + attribute] = x.getAttribute(attribute);
		
								});
		
						});
		
				},
		
				/**
				 * "Render" helper.
				 * @param {object} e Element.
				 * @param {string} selector Selector.
				 * @param {array} attributes Attributes.
				 * @param {string} name Name.
				 * @param {string} value Value.
				 */
				render: function(e, selector, attributes, name, value) {
		
					// Step through matching items.
						e.querySelectorAll(selector).forEach(function(x) {
		
							// Step through attributes.
								attributes.forEach(function(attribute) {
		
									// Has stored attribute? Expand variable.
										if (('_' + attribute) in x)
											x.setAttribute(attribute, variables.expandVariable(x.getAttribute(attribute), name, value));
		
								});
		
						});
		
				},
		
				/**
				 * "Reset" helper.
				 * @param {object} e Element.
				 * @param {string} selector Selector.
				 * @param {array} attributes Attributes.
				 */
				reset: function(e, selector, attributes) {
		
					// Step through matching items.
						e.querySelectorAll(selector).forEach(function(x) {
		
							// Step through attributes.
								attributes.forEach(function(attribute) {
		
									// Has stored atribute? Reset it.
										if (('_' + attribute) in x)
											x.setAttribute(attribute, x['_' + attribute]);
		
								});
		
						});
		
				},
		
				/**
				 * Runs a handler.
				 * @param {string} name Name.
				 * @param {object} e Element.
				 * @param {string} arg1 Arg1.
				 * @param {string} arg2 Arg2.
				 */
				run: function(name, e, arg1, arg2) {
		
					// Text.
						(this.text[name])(e, arg1, arg2);
		
					// Anchors.
						(this.anchors[name])(e, arg1, arg2);
		
					// Images.
						if (e.classList.contains('image')
						||	e.classList.contains('gallery')
						||	e.classList.contains('slideshow'))
							(this.images[name])(e, arg1, arg2);
		
					// Inputs.
						if (e.tagName == 'FORM')
							(this.inputs[name])(e, arg1, arg2);
		
				},
		
			},
		
			/**
			 * Regex.
			 * @var {RegExp}
			 */
			regex: new RegExp('\{\{([a-zA-Z0-9\\_\\-\\.]+)(\|[^\}]*)?\}\}', 'g'),
		
			/**
			 * Sources.
			 * @var {object}
			 */
			sources: {},
		
			/**
			 * URL params.
			 * @var {URLSearchParams}
			 */
			urlParams: null,
		
			/**
			 * Gets a previously cached variable value (or generates it with a handler if it isn't already cached).
			 * @param {string} source Source.
			 * @param {string} key Key.
			 * @param {function} handler Handler.
			 * @return {mixed} Value.
			 */
			cacheValue: function(source, key, handler) {
		
				// Source doesn't exist yet? Create it.
					if (!(source in this.cache))
						this.cache[source] = {};
		
				// Key doesn't exist yet? Generate it.
					if (!(key in this.cache[source]))
						this.cache[source][key] = String(handler(key));
		
				return this.cache[source][key];
		
			},
		
			/**
			 * Escapes HTML in a string.
			 * @param {string} s String.
			 * @return {string} Escaped string.
			 */
			escapeHtml: function(s) {
		
				// Blank, null, or undefined? Return blank string.
					if (s === ''
					||	s === null
					||	s === undefined)
						return '';
		
				// Escape HTML characters.
					var a = {
						'&': '&amp;',
						'<': '&lt;',
						'>': '&gt;',
						'"': '&quot;',
						"'": '&#39;',
					};
		
					s = s.replace(/[&<>"']/g, function(x) {
						return a[x];
					});
		
				return s;
		
			},
		
			/**
			 * Expands a variable within a string
			 * @param {string} s String.
			 * @param {string} name Name.
			 * @param {string} value Value.
			 * @return {string} String.
			 */
			expandVariable: function(s, name, value) {
		
				// Invalid variable name? Bail.
					if (!name.match(/^[a-zA-Z0-9\_\-\.]+$/))
						return s;
		
				// Build regexp.
					var r = new RegExp('\{\{' + name.replace('.', '\.') + '(\|[^\}]*)?\}\}', 'g');
		
				// Undefined string? Reset to empty.
					if (s === undefined
					||	s === null)
						s = '';
		
				// Non-empty value? Replace entire variable.
					if (value !== '') {
		
						s = s.replace(
							r,
							this.escapeHtml(value)
						);
		
					}
		
				// Otherwise, use fallback.
					else {
		
						s = s.replace(
							r,
							function(s, x) {
		
								if (x === undefined)
									return '';
		
								return x.substr(1);
		
							}
						);
		
					}
		
				return s;
		
			},
		
			/**
			 * Expands a variable string relative to a specific element.
			 * @param {object} e Element.
			 * @param {string} s String.
			 * @return {string} Expanded string.
			 */
			expandVariableString: function(e, s) {
		
				var a, name, value;
		
				// Parse 'variables' data value.
					if (!('variables' in e.dataset))
						return s;
		
					a = e.dataset.variables.split(' ');
		
				// Step through variables.
					for (name of a) {
		
						// Get value.
							value = this.value(name);
		
						// Expand variable.
							s = this.expandVariable(s, name, value);
		
					}
		
				return s;
		
			},
		
			/**
			 * Determines if a string has at least one {{source.name|fallback}} variable.
			 * @param {string} s String.
			 * @return {bool} True if yes, false if no.
			 */
			hasVariables: function(s) {
				return !!s.match(/\{\{[^\}]+\}\}/);
			},
		
			/**
			 * Flattens a list of values.
			 * @param {string} prefix Prefix.
			 * @param {object} values Values.
			 * @return {object} Flattened values.
			 */
			flattenValues: function(prefix, values) {
		
				var output = {},
					a, k, j;
		
				// Step through values.
					for (k in values) {
		
						// Object or array?
							if (typeof values[k] == 'object') {
		
								// Flatten children.
									a = this.flattenValues(k + '_', values[k]);
		
								// Add children to output.
									for (j in a)
										output[prefix + j] = a[j];
		
							}
		
						// Anything else ...
							else {
		
								// Add to output.
									output[prefix + k] = String(values[k]);
		
							}
		
					}
		
				return output;
		
			},
		
			/**
			 * Imports a list of values as variables.
			 * @param {string} source Source.
			 * @param {object} values Values.
			 */
			import: function(source, values) {
		
				var a, k;
		
				// Source doesn't exist yet? Create it.
					if (!(source in this.sources))
						this.sources[source] = {};
		
				// Flatten values.
					a = this.flattenValues('', values);
		
				// Step through flattened values.
					for (k in a) {
		
						// Add value to source.
							this.sources[source][k] = a[k];
		
						// Refresh effected elements.
							this.refreshSelector('[data-variables~="' + source + '.' + k + '"]');
		
					}
		
			},
		
			/**
			 * Initializes variables.
			 * @param {string} selector Selector.
			 */
			init: function(selector) {
		
				// Get URL params.
					this.urlParams = new URLSearchParams(window.location.search);
		
				// Selector provided? Render it.
					if (selector)
						this.renderSelector(selector);
		
			},
		
			/**
			 * Purges a cached source or key.
			 * @param {string} source Source.
			 * @param {string} key Optional key.
			 */
			purge: function(source, key) {
		
				// Source doesn't exist? Bail.
					if (!(source in this.cache))
						return;
		
				// Key provided?
					if (typeof key !== 'undefined') {
		
						// Key exists? Purge it.
							if (key in this.cache[source][key])
								delete this.cache[source][key];
		
					}
		
				// Otherwise, purge entire source.
					else
						delete this.cache[source];
		
			},
		
			/**
			 * Renders variables on a given element.
			 * @param {object} e Element.
			 */
			render: function(e) {
		
				var	_this = this,
					type, names, name, value, status,
					x;
		
				// Determine status.
					status = this.status(e);
		
				// Already rendered? Bail.
					if (status == this.STATUS_RENDERED)
						return;
		
				// New?
					if (status == this.STATUS_NEW) {
		
						// Run "init" handler.
							this.handlers.run('init', e);
		
						// Set status to "ready".
							this.status(e, this.STATUS_READY);
		
					}
		
				// Get list of variable names to render.
					names = e.dataset.variables.split(' ');
		
				// Step through variable names.
					for (name of names) {
		
						// Get value.
							value = this.value(name);
		
						// Run "render" handler.
							this.handlers.run('render', e, name, value);
		
					}
		
				// Set status to "rendered".
					this.status(e, this.STATUS_RENDERED);
		
			},
		
			/**
			 * Renders variables on all elements matching a given selector.
			 * @param {string} selector Selector.
			 */
			renderSelector: function(selector) {
		
				var	_this = this,
					ee = $$(selector);
		
				// At least one element found?
					if (ee.length > 0) {
		
						// Step through elements.
							ee.forEach(function(e) {
		
								// Render.
									_this.render(e);
		
							});
		
					}
		
			},
		
			/**
			 * Refreshes variables on a given element.
			 * @param {object} e Element.
			 */
			refresh: function(e) {
		
				// Reset.
					this.reset(e);
		
				// Render.
					this.render(e);
		
			},
		
			/**
			 * Refreshes variables on all elements matching a given selector.
			 * @param {string} selector Selector.
			 */
			refreshSelector: function(selector) {
		
				var	_this = this,
					ee = $$(selector);
		
				// At least one element found?
					if (ee.length > 0) {
		
						// Step through elements.
							ee.forEach(function(e) {
		
								// Refresh.
									_this.refresh(e);
		
							});
		
					}
		
			},
		
			/**
			 * Resets variables on a given element.
			 * @param {object} e Element.
			 */
			reset: function(e) {
		
				var	_this = this,
					status;
		
				// Determine status.
					status = this.status(e);
		
				// Already ready? Bail.
					if (status == this.STATUS_READY)
						return;
		
				// Run "reset" handler.
					this.handlers.run('reset', e);
		
				// Set status to ready.
					this.status(e, this.STATUS_READY);
		
			},
		
			/**
			 * Resets variables on all elements matching a given selector.
			 * @param {string} selector Selector.
			 */
			resetSelector: function(selector) {
		
				var	_this = this,
					ee = $$(selector);
		
				// At least one element found?
					if (ee.length > 0) {
		
						// Step through elements.
							ee.forEach(function(e) {
		
								// Reset.
									_this.reset(e);
		
							});
		
					}
		
			},
		
			/**
			 * Gets or sets an element's variable status.
			 * @param {object} e Element.
			 * @param {int} status Optional status.
			 */
			status: function(e, status) {
		
				// Status provided? Update.
					if (typeof status != 'undefined')
						e._variablesStatus = status;
		
				// No status? Return "new".
					if (!('_variablesStatus' in e))
						return this.STATUS_NEW;
		
				return e._variablesStatus;
		
			},
		
			/**
			 * Gets a variable value.
			 * @param {string} name Name.
			 * @return {mixed} Value.
			 */
			value: function(name) {
		
				var	_this = this,
					value = '',
					source, key, value,
					a;
		
				try {
		
					// Split name into source, key.
						a = name.split('.', 2);
		
						if (a.length != 2)
							throw 'Invalid name.';
		
						source = a[0];
						key = a[1];
		
					// Determine source.
						switch (a[0]) {
		
							case 'url':
		
								value = this.cacheValue(source, key, function(key) {
		
									// URL parameter exists? Use it.
										if (_this.urlParams.has(key))
											return _this.urlParams.get(key);
		
									return '';
		
								});
		
								break;
		
							case 'client':
		
								value = this.cacheValue(source, key, function(key) {
		
									switch (key) {
		
										case 'timestamp':
											return Math.round(Date.now() / 1000);
		
										case 'time':
											return (new Date()).toLocaleTimeString([], { timeStyle: 'short' });
		
										case 'fulltime':
											return (new Date()).toLocaleTimeString([], { timeStyle: 'medium' });
		
										case 'date':
											return (new Date()).toLocaleDateString([], { dateStyle: 'short' });
		
										case 'fulldate':
											return (new Date()).toLocaleDateString([], { dateStyle: 'long' });
		
										case 'utc_timestamp':
											return Math.round(Date.now() / 1000);
		
										case 'utc_time':
											return (new Date()).toLocaleTimeString([], { timeZone: 'UTC', timeStyle: 'short' });
		
										case 'utc_fulltime':
											return (new Date()).toLocaleTimeString([], { timeZone: 'UTC', timeStyle: 'medium' });
		
										case 'utc_date':
											return (new Date()).toLocaleDateString([], { timeZone: 'UTC', dateStyle: 'short' });
		
										case 'utc_fulldate':
											return (new Date()).toLocaleDateString([], { timeZone: 'UTC', dateStyle: 'long' });
		
										default:
											break;
		
									}
		
									return '';
		
								});
		
								break;
		
							default:
		
								// Both source and key exists? Get value.
									if (source in _this.sources
									&&	key in _this.sources[source])
										value = _this.sources[source][key];
		
								break;
		
						}
		
				}
				catch {
		
					// Do nothing.
		
				}
		
				return value;
		
			},
		
		};
		
		// Initialize.
			variables.init('[data-variables]');

})();