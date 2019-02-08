/*jslint white: true, nomen: true, plusplus: true */
/*global mx, mxui, mendix, dojo, require, console, define, module, jQuery, document */
/**

	FormCarousel
	========================

	@file      : FormCarousel.js
	@version   : 1.0
	@author    : ...
	@date      : 29 June 2016
	@copyright : Mendix Technology BV
	@license   : Apache License, Version 2.0, January 2004

	Documentation
    ========================
	Describe your widget here.

*/

define([
	'dojo/_base/declare', 'mxui/widget/_WidgetBase', 'dijit/_TemplatedMixin',
	'mxui/dom', 'dojo/_base/lang', 'dojo/text', 'dojo/html', 'dojo/_base/event',
	'FormCarousel/widget/lib/jquery-1.11.2.min',
	'FormCarousel/widget/lib/bootstrap.min',
	'FormCarousel/widget/lib/carousel-swipe',
	'dojo/text!FormCarousel/widget/templates/FormCarousel.html'
], function (declare, _WidgetBase, _TemplatedMixin, dom, lang, text, html, event, jquery, bootstrap, touchy, widgetTemplate) {
	'use strict';

	var $ = jquery.noConflict(true);

	// Declare widget.
	return declare('FormCarousel.widget.FormCarousel', [_WidgetBase, _TemplatedMixin], {

		// _TemplatedMixin will create our dom node using this HTML template.
		templateString: widgetTemplate,

		carouselForms: null,
		wrap: true,
		hasContext: false,

        /**
         * Internal variables.
         * === === === === === === === =
         */
		_wgtNode: null,
		_contextGuid: null,
		_contextObj: null,
		_handle: null,
		// Extra variables
		_extraContentDiv: null,
		_openForms: null,

		// Template path
		// templatePath: require.toUrl('FormCarousel/widget/templates/FormCarousel.html'),


        /**
         * Mendix Widget methods.
         * ======================
         */

		// PostCreate is fired after the properties of the widget are set.
		postCreate: function () {
			console.log('FormCarousel - postCreate');
			this._openForms = [];

			if (!this.hasContext) {
				this._loadData();
			}
		},

		update: function (obj, callback) {
			console.log(this.id + ".update");
			// Setup events

			if (this.hasContext) {
				this._loadData(callback);
			} else {
				callback();
			}
		},

        /**
         * Interaction widget methods.
         * ======================
         */
		_loadData: function (callback) {
			var i, carouselItem, listIndicator, templateCarousel, listItem = '',
				indicators = '',
				path;

			if (this.controls) {
				templateCarousel = dojo.cache('FormCarousel.widget.templates', 'FormCarousel.html');
			} else {
				templateCarousel = dojo.cache('FormCarousel.widget.templates', 'FormCarouselNoControls.html');
			}

			for (i = 0; i < this.carouselForms.length; i++) {
				listIndicator = dojo.cache('FormCarousel.widget.templates', 'listIndicators.html');
				//setup List
				listIndicator = listIndicator.split('{{counter}}').join(i);
				listIndicator = listIndicator.split('{{active}}').join(i === 0 ? 'active' : '');

				if (i === 0) {
					indicators = listIndicator;
				} else {
					indicators += "\n";
					indicators += listIndicator;
				}


				carouselItem = dojo.cache('FormCarousel.widget.templates', 'item.html');
				//setup carouselItem
				carouselItem = carouselItem.split('{{first}}').join(i === 0 ? ' active' : '');
				carouselItem = carouselItem.split('{{itemIdentifier}}').join('CID' + this.id + '-' + i);

				if (i === 0) {
					listItem = carouselItem;
				} else {
					indicators += "\n";
					listItem += carouselItem;
				}

			}

			templateCarousel = templateCarousel.split('{{carouselClass}}').join(this.carouselClass);
			templateCarousel = templateCarousel.split('{{list}}').join(indicators);
			templateCarousel = templateCarousel.split('{{showdots}}').join(this.listicons ? '' : 'style="display: none;"');
			templateCarousel = templateCarousel.split('{{items}}').join(listItem);
			templateCarousel = templateCarousel.split('{{carouselID}}').join('CID' + this.id === '' ? 'widgetCarousel' : 'CID' + this.id);
			//templateCarousel = templateCarousel.split('{{interval}}').join( this.enablescroll ? this.scollspeed : false);
			$(this.domNode).html(templateCarousel);

			//run in a separate loop after the main HTML is inserted into the dom
			for (i = 0; i < this.carouselForms.length; i++) {
				mx.ui.openForm(this.carouselForms[i].formName, {
					context: this.mxcontext,
					location: "node",
					domNode: document.getElementById('CID' + this.id + '-' + i),
					callback: lang.hitch(this, function (form) {
						this._openForms.push(form);
						this._checkReady();
					})
				});
			}

			if (callback) { callback(); }
		},

		_checkReady: function () {
			if (this._openForms.length === this.carouselForms.length) {
				var self = this;
				if (this.enablescroll) {
					$(document).ready(function () {
						$('.carousel').carousel({
							interval: this.scrollspeed,
							swipe: 30,
							wrap: self.wrap
						});
					});
				} else {
					$(document).ready(function () {
						$('.carousel').carousel({
							interval: false,
							swipe: 30,
							wrap: self.wrap
						});
					});
				}
			}
		},

		uninitialize: function () {
			var i;
			// Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
			for (i = 0; i < this._openForms.length; i++) {
				this._openForms[i].destroy();
			}
			// $(this.domNode).find('.carousel').carousel('dispose');
		}
	});
});

require(['FormCarousel/widget/FormCarousel'], function () {
	'use strict';
});
