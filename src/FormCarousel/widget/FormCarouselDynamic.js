define([
    'dojo/_base/declare',
    "FormCarousel/widget/FormCarousel",
    'FormCarousel/widget/lib/jquery-1.11.2.min',
    'FormCarousel/widget/lib/bootstrap.min',
    'FormCarousel/widget/lib/carousel-swipe',
], function (declare, base, jq, boostrap, swipe) {

    var $ = jq.noConflict(true);

    return declare('FormCarousel.widget.FormCarouselDynamic', [base], {
        main: null,
        mfGetNews: null,
        formName: null,

        _loadData: function (callback) {
            var templateCarousel = '';

            if (this.controls) {
                this.templateCarousel = dojo.cache('FormCarousel.widget.templates', 'FormCarousel.html');
            } else {
                this.templateCarousel = dojo.cache('FormCarousel.widget.templates', 'FormCarouselNoControls.html');
            }

            // start of object loop
            this._getObjects(templateCarousel)
                .then(this._setupCarouselItemNodes.bind(this))
                .then(this._loadForms.bind(this))
                .catch(this._hideCarousel.bind(this));


            // for (i = 0; i < this.carouselForms.length; i++) {
            //     mx.ui.openForm(this.carouselForms[i].formName, {
            //         context: this.mxcontext,
            //         location: "node",
            //         domNode: document.getElementById('CID' + this.id + '-' + i),
            //         callback: lang.hitch(this, function (form) {
            //             this._openForms.push(form);
            //             this._checkReady();
            //         })
            //     });
            // }

            if (callback) { callback(); }
        },

        _setupCarouselItemNodes: function (objects) {
            return new Promise(function (resolve, reject) {
                var i, carouselItem, listIndicator, templateCarousel, listItem = '',
                    indicators = '';
                for (i = 0; i < objects.length; i++) {
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
                var templateCarousel = this.templateCarousel;
                templateCarousel = templateCarousel.split('{{carouselClass}}').join(this.carouselClass);
                templateCarousel = templateCarousel.split('{{list}}').join(indicators);
                templateCarousel = templateCarousel.split('{{showdots}}').join(this.listicons ? '' : 'style="display: none;"');
                templateCarousel = templateCarousel.split('{{items}}').join(listItem);
                templateCarousel = templateCarousel.split('{{carouselID}}').join('CID' + this.id === '' ? 'widgetCarousel' : 'CID' + this.id);
                //templateCarousel = templateCarousel.split('{{interval}}').join( this.enablescroll ? this.scollspeed : false);
                $(this.domNode).html(templateCarousel);
                resolve(objects);
            }.bind(this));
        },

        _loadForms: function (objects) {
            return new Promise(function (resolve, reject) {
                for (var i = 0; i < objects.length; i++) {
                    var ctx = new mendix.lib.MxContext();
                    ctx.setContext(objects[i]);
                    mx.ui.openForm(this.formName, {
                        context: ctx,
                        location: "node",
                        domNode: document.getElementById('CID' + this.id + '-' + i),
                        callback: function (form) {
                            form.reload();
                        }.bind(this)
                    })
                }
                resolve();

            }.bind(this))
        },

        _getObjects: function () {
            return new Promise(function (resolve, reject) {
                mx.data.action({
                    params: {
                        actionname: this.mfGetNews
                    },
                    callback: function (res) {
                        if (res && res.length > 0) {
                            this.objects = res;
                            resolve(res)
                        } else {
                            reject("No objects were found. Hiding the carousel.")
                        }

                    }.bind(this),
                    error: function (err) { reject(err) }.bind(this)
                })
            }.bind(this))
        },

        _hideCarousel: function (err) {
            return new Promise(function (resolve) {
                console.warn(err);
                this.domNode.style.display = "none";
            }.bind(this));
        }
    })
});

require(['FormCarousel/widget/FormCarouselDynamic'], function () {
    'use strict';
});
