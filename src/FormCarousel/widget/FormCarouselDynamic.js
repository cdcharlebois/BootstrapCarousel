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

        /* @override */
        update: function (obj, callback) {
            callback();
        },

        /* @override */
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
                .then(this._finishCarouselSetup.bind(this))
                .catch(this._hideCarousel.bind(this));

            // SYNCHRONOUS
            // mx.data.action({
            //     params: {
            //         actionname: this.mfGetNews
            //     },
            //     callback: function (res) {
            //         this.objects = res;
            //         if (res.length == 0) {
            //             console.warn("No objects were returned. Hiding carousel.");
            //             this.domNode.style.display = "none";
            //         }
            //         this._syncBuildCarousel(callback);
            //     }.bind(this),
            //     error: function (err) {
            //         console.warn(err);
            //         this.domNode.style.display = "none";
            //         if (callback) { callback(); }
            //     }.bind(this)
            // })



            if (callback) { callback(); }
        },

        _syncBuildCarousel: function (callback) {
            this._syncSetupCarouselItemNodes();
            this._syncLoadForms(callback);
        },

        _syncSetupCarouselItemNodes: function () {
            var i, carouselItem, listIndicator, templateCarousel, listItem = '',
                indicators = '';
            var objects = this.objects;
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
        },

        _syncLoadForms: function (callback) {
            var objects = this.objects;
            for (var i = 0; i < objects.length; i++) {
                var ctx = new mendix.lib.MxContext();
                ctx.setContext(objects[i]);
                mx.ui.openForm(this.formName, {
                    context: ctx,
                    location: "node",
                    domNode: document.getElementById('CID' + this.id + '-' + i),
                    callback: function (form) {
                        this._openForms.push(form);
                        this._checkReady(this._syncFinishCarouselSetup, callback);
                    }.bind(this)
                })
            }
        },

        _checkReady: function (callback1, callback2) {
            if (this._openForms.length === this.objects.length) {
                callback1(callback2);
            }
        },

        _syncFinishCarouselSetup: function (callback) {
            if (this.enablescroll) {
                $(this.domNode).find('.carousel').carousel({
                    interval: this.scrollspeed,
                    swipe: 30,
                    wrap: this.wrap
                })
            } else {
                $(this.domNode).find('.carousel').carousel({
                    interval: false,
                    swipe: 30,
                    wrap: this.wrap
                })
            }
            if (callback) { callback() };
        },

        _finishCarouselSetup: function () {
            return new Promise(function (resolve) {
                if (this.enablescroll) {
                    $(this.domNode).find('.carousel').carousel({
                        interval: this.scrollspeed,
                        swipe: 30,
                        wrap: this.wrap
                    })
                } else {
                    $(this.domNode).find('.carousel').carousel({
                        interval: false,
                        swipe: 30,
                        wrap: this.wrap
                    })
                }
                resolve();
            }.bind(this));
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
                // var sequence = Promise.resolve();
                var i = 0;
                var formsPromises = objects.map(function (obj) {
                    return new Promise(function (iResolve, iReject) {
                        var ctx = new mendix.lib.MxContext();
                        ctx.setTrackObject(obj);
                        mx.ui.openForm(this.formName, {
                            context: ctx,
                            location: "node",
                            domNode: document.getElementById('CID' + this.id + '-' + i),
                            callback: function (form) {
                                this._openForms.push(form);
                                iResolve();
                            },
                            error: function (err) {
                                iReject(err)
                            }
                        }, this)
                        i++;
                    }.bind(this));
                }.bind(this))
                // formsPromises.forEach(function (promise) {
                //     sequence = sequence.then(promise);
                // });
                // for (var i = 0; i < objects.length; i++) {
                //     var ctx = new mendix.lib.MxContext();
                //     ctx.setContext(objects[i]);
                //     mx.ui.openForm(this.formName, {
                //         context: ctx,
                //         location: "node",
                //         domNode: document.getElementById('CID' + this.id + '-' + i),
                //         callback: function (form) {
                //             form.reload();
                //         }.bind(this)
                //     })
                // }
                // sequence.then(resolve);
                Promise.all(formsPromises).then(resolve).catch(reject);
                // resolve();

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
                resolve();
            }.bind(this));
        }
    })
});

require(['FormCarousel/widget/FormCarouselDynamic'], function () {
    'use strict';
});
