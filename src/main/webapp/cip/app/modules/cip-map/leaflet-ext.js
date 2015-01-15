
(function (window, document, undefined) {


    L.PolyLabel = L.Path.extend({
        initialize: function (latlng, radius, text,shape, options) {
            L.Path.prototype.initialize.call(this, options);
            this.shape = shape;
            this._latlng = latlng;
            this._mRadius = radius;
            this._text=text;
            this._width=this.options.widthR;
        },

        options: {fill: true, fillColor: 'white', color: 'black', weight: '1.5px', fillOpacity: 1,widthR: 4 },

        projectLatlngs: function () {
            if (L.Path.CANVAS) return;
            var equatorLength = 40075017, hLength = equatorLength * Math.cos(L.LatLng.DEG_TO_RAD * this._latlng.lat);

            var lngSpan = (this._mRadius / hLength) * 360,
                latlng2 = new L.LatLng(this._latlng.lat, this._latlng.lng - lngSpan, true),
                point2 = this._map.latLngToLayerPoint(latlng2);

            this._point = this._map.latLngToLayerPoint(this._latlng);
            this._radius = Math.round(this._point.x - point2.x);
            if(this._radius>40)this._radius=40;
        },

        getPathString: function () {

            if(this._checkIfEmpty())
                {
                    this._container.style.visibility='hidden';
                    return;
                }else
                {

                    this._container.style.visibility='visible';
            }

        },

        setOpacity: function (opacity) {


            if (this._container) {
                L.DomUtil.setOpacity(this._container, opacity);
                this.redraw();

            }
            return this;
        },

        _initPath: function () {
            if(this._text)
            {
                L.Path.prototype._initPath.call(this);

                    this._textLabel = this._createElement('text');
                    this._rect = this._createElement('rect');
                    this._container.appendChild(this._rect);
                    this._container.appendChild(this._textLabel);

                    this._rect.setAttribute("class", this.options.bgClass);
                    this._textLabel.setAttribute("text-anchor","middle");
                    this._textLabel.textContent=this._text;
                    this._textLabel.setAttribute("x",0);
                    var h=12, w=this._width*12;
                    this._textLabel.setAttribute("y",3);
                    this._textLabel.setAttribute("class",this.options.fClass);
                    this._rect.setAttribute("x",-w/2);
                    this._rect.setAttribute("y",-h/2);
                    this._rect.setAttribute("height",h);
                    this._rect.setAttribute("width",w);





            }
        },

        updateSize: function(size){

            if (this._container){
                   if (!size){
                       size=this._radius/12.0;
                   }
                    this._container.setAttribute("transform","translate("+this._point.x+","+this._point.y+"),scale("+size+","+size+")");
                    try{
                        var textWidth =this._textLabel.getBBox().width +5;
                        this._rect.setAttribute("width",textWidth);
                        this._rect.setAttribute("x",- textWidth/2);
                    }  catch(e){

                    }

            }
        },


        _updatePath:function(){
            if (this.shape){
                this.shape._updateLabelSize();
            }
        },

        _checkIfEmpty: function () {

            if (L.Path.CANVAS) return true;
            var vp = this._map._pathViewport, r = this._radius, p = this._point;
            return p.x - r > vp.max.x || p.y - r > vp.max.y || p.x + r < vp.min.x || p.y + r < vp.min.y || r>100.0 || r<4.0;
        }
    });




    L.Label = L.Class.extend({

        includes: L.Mixin.Events,

        options: {
            className: '',
            clickable: false,
            direction: 'left',
            noHide: false,
            offset: [0, -15],
            opacity: 1,
            zoomAnimation: true
        },

        initialize: function (options, source) {
            L.setOptions(this, options);

            this._source = source;
            this._animated = L.Browser.any3d && this.options.zoomAnimation;
            this._isOpen = false;
        },

        onAdd: function (map) {
            this._map = map;
            if (this._source instanceof L.Marker){
                this._pane =  map._panes.markerPane;
            }else if(this._source instanceof L.Path){
                this._pane =  map._panes.overlayPane;
            }else{
                this._pane =  map._panes.popupPane;
            }

            if (!this._container) {
                this._initLayout();
            }

            this._pane.appendChild(this._container);

            this._initInteraction();

            this._update();



            map
                .on('moveend', this._onMoveEnd, this)
                .on('viewreset', this._onViewReset, this);

            if (this._animated) {
                map.on('zoomanim', this._zoomAnimation, this);
            }

            if (L.Browser.touch && !this.options.noHide) {
                L.DomEvent.on(this._container, 'click', this.close, this);
            }
        },

        onRemove: function (map) {
            this._pane.removeChild(this._container);

            map.off({
                zoomanim: this._zoomAnimation,
                moveend: this._onMoveEnd,
                viewreset: this._onViewReset
            }, this);

            this._removeInteraction();

            this._map = null;
        },

        setLatLng: function (latlng) {
            this._latlng = L.latLng(latlng);
            if (this._map) {
                this._updatePosition();
            }
            return this;
        },

        setContent: function (content) {
            // Backup previous content and store new content
            this._previousContent = this._content;
            this._content = content;

            this._updateContent();

            return this;
        },

        close: function () {
            var map = this._map;

            if (map) {
                if (L.Browser.touch && !this.options.noHide) {
                    L.DomEvent.off(this._container, 'click', this.close);
                }

                map.removeLayer(this);
            }
        },

        updateZIndex: function (zIndex) {
            this._zIndex = zIndex;

            if (this._container && this._zIndex) {
                this._container.style.zIndex = zIndex;
            }
        },

        setOpacity: function (opacity) {


            if (this._container) {
                L.DomUtil.setOpacity(self._container, opacity);
                this.redraw();
            }


        },

        _initLayout: function () {
            this._container = L.DomUtil.create('div', 'leaflet-label ' + this.options.className + ' leaflet-zoom-animated');
            this.updateZIndex(this._zIndex);
        },

        _update: function () {
            if (!this._map) { return; }

            this._container.style.visibility = 'hidden';

            this._updateContent();
            this._updatePosition();

            this._container.style.visibility = '';
        },

        _updateContent: function () {
            if (!this._content || !this._map || this._prevContent === this._content) {
                return;
            }

            if (typeof this._content === 'string' || typeof this._content === 'number') {
                this._container.innerHTML = this._content;

                this._prevContent = this._content;

                this._labelWidth = this._container.offsetWidth;
            }
        },

        _updatePosition: function () {
            var pos = this._map.latLngToLayerPoint(this._latlng);

            this._setPosition(pos);
        },

        _setPosition: function (pos) {

            var map = this._map,
                container = this._container,
                centerPoint = map.latLngToContainerPoint(map.getCenter()),
                labelPoint = map.layerPointToContainerPoint(pos),
                direction = this.options.direction,
                labelWidth = this._labelWidth,
                offset = L.point(this.options.offset);

            // position to the right (right or auto & needs to)
            if (direction === 'right' || direction === 'auto' && labelPoint.x < centerPoint.x) {
                L.DomUtil.addClass(container, 'leaflet-label-right');
                L.DomUtil.removeClass(container, 'leaflet-label-left');

                pos = pos.add(offset);
            } else { // position to the left
                L.DomUtil.addClass(container, 'leaflet-label-left');
                L.DomUtil.removeClass(container, 'leaflet-label-right');

                pos = pos.add(L.point(- labelWidth/2, offset.y));
            }

            L.DomUtil.setPosition(container, pos);
        },

        _zoomAnimation: function (opt) {
            var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();

            this._setPosition(pos);
        },

        _onMoveEnd: function () {
                this._updatePosition();

        },

        _onViewReset: function (e) {
            /* if map resets hard, we must update the label */
            if (e && e.hard) {
                this._update();
            }
        },

        _initInteraction: function () {
            if (!this.options.clickable) { return; }

            var container = this._container,
                events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu'];

            L.DomUtil.addClass(container, 'leaflet-clickable');
            L.DomEvent.on(container, 'click', this._onMouseClick, this);

            for (var i = 0; i < events.length; i++) {
                L.DomEvent.on(container, events[i], this._fireMouseEvent, this);
            }
        },

        _removeInteraction: function () {
            if (!this.options.clickable) { return; }

            var container = this._container,
                events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu'];

            L.DomUtil.removeClass(container, 'leaflet-clickable');
            L.DomEvent.off(container, 'click', this._onMouseClick, this);

            for (var i = 0; i < events.length; i++) {
                L.DomEvent.off(container, events[i], this._fireMouseEvent, this);
            }
        },

        _onMouseClick: function (e) {
            if (this.hasEventListeners(e.type)) {
                L.DomEvent.stopPropagation(e);
            }

            this.fire(e.type, {
                originalEvent: e
            });
        },

        _fireMouseEvent: function (e) {
            this.fire(e.type, {
                originalEvent: e
            });

            // TODO proper custom event propagation
            // this line will always be called if marker is in a FeatureGroup
            if (e.type === 'contextmenu' && this.hasEventListeners(e.type)) {
                L.DomEvent.preventDefault(e);
            }
            if (e.type !== 'mousedown') {
                L.DomEvent.stopPropagation(e);
            } else {
                L.DomEvent.preventDefault(e);
            }
        }
    });


// This object is a mixin for L.Marker and L.CircleMarker. We declare it here as both need to include the contents.
    L.BaseMarkerMethods = {
        showLabel: function () {
            if (this.label && this._map) {
                this.label.setLatLng(this._latlng);
                this._map.showLabel(this.label);
            }

            return this;
        },

        hideLabel: function () {
            if (this.label) {
                this.label.close();
            }
            return this;
        },

        setLabelNoHide: function (noHide) {
            if (this._labelNoHide === noHide) {
                return;
            }

            this._labelNoHide = noHide;

            if (noHide) {
                this._removeLabelRevealHandlers();
                this.showLabel();
            } else {
                this._addLabelRevealHandlers();
                this.hideLabel();
            }
        },

        bindLabel: function (content, options) {


            this.label = new L.divIcon({html: content})


            return this;
        },

        unbindLabel: function () {
            if (this.label) {
                this.hideLabel();

                this.label = null;

                if (this._hasLabelHandlers) {
                    if (!this._labelNoHide) {
                        this._removeLabelRevealHandlers();
                    }

                    this
                        .off('remove', this.hideLabel, this)
                        .off('move', this._moveLabel, this)
                        .off('add', this._onMarkerAdd, this);
                }

                this._hasLabelHandlers = false;
            }
            return this;
        },

        updateLabelContent: function (content) {
            if (this.label) {
                this.label.setContent(content);
            }
        },

        getLabel: function () {
            return this.label;
        },

        _onMarkerAdd: function () {
            if (this._labelNoHide) {
                this.showLabel();
            }
        },

        _addLabelRevealHandlers: function () {
            this
                .on('mouseover', this.showLabel, this)
                .on('mouseout', this.hideLabel, this);

            if (L.Browser.touch) {
                this.on('click', this.showLabel, this);
            }
        },

        _removeLabelRevealHandlers: function () {
            this
                .off('mouseover', this.showLabel, this)
                .off('mouseout', this.hideLabel, this);

            if (L.Browser.touch) {
                this.off('click', this.showLabel, this);
            }
        },

        _moveLabel: function (e) {
            this.label.setLatLng(e.latlng);
        }
    };

// Add in an option to icon that is used to set where the label anchor is
    L.Icon.Default.mergeOptions({
        labelAnchor: new L.Point(9, -20)
    });

// Have to do this since Leaflet is loaded before this plugin and initializes
// L.Marker.options.icon therefore missing our mixin above.
    L.Marker.mergeOptions({
        icon: new L.Icon.Default()
    });

    L.Marker.include(L.BaseMarkerMethods);
    L.Marker.include({
        _originalUpdateZIndex: L.Marker.prototype._updateZIndex,

        _updateZIndex: function (offset) {
            var zIndex = this._zIndex + offset;

            this._originalUpdateZIndex(offset);

            if (this.label) {
                this.label.updateZIndex(zIndex);
            }
        },

        _originalSetOpacity: L.Marker.prototype.setOpacity,

        setOpacity: function (opacity, labelHasSemiTransparency) {
            this.options.labelHasSemiTransparency = labelHasSemiTransparency;

            this._originalSetOpacity(opacity);
        },

        _originalUpdateOpacity: L.Marker.prototype._updateOpacity,

        _updateOpacity: function () {
            var absoluteOpacity = this.options.opacity === 0 ? 0 : 1;

            this._originalUpdateOpacity();

            if (this.label) {

                this.label.setOpacity(this.options.labelHasSemiTransparency ? this.options.opacity : absoluteOpacity);
            }
        },

        _originalSetLatLng: L.Marker.prototype.setLatLng,

        setLatLng: function (latlng) {
            if (this.label && !this._labelNoHide) {
                this.hideLabel();
            }

            return this._originalSetLatLng(latlng);
        }
    });

    L.Path.include({
        bindLabel: function (content, options) {
            if (!this.label || this.label.options !== options) {

                var center =  this.getBounds().getCenter();
                this.label = new L.PolyLabel(this.getBounds().getCenter(),options.size*1000,content,this,options)
            }

            return this;
        },

        _originalOnAdd: L.Path.prototype.onAdd,

        onAdd: function(map){

            this._originalOnAdd(map);

            if(map && this.label){
                map.showLabel(this.label);
                var absoluteOpacity = this.options.fillOpacity === 0 ? 0 : 1;
                this._updateLabelSize();
                this.label.setOpacity(absoluteOpacity);

            }
        },


        unbindLabel: function () {
            if (this.label) {
                this._hideLabel();
                this.label = null;

            }
            return this;
        },

        updateLabelContent: function (content) {
            if (this.label) {
                this.label.setContent(content);
            }
        },


        _original_UpdatePath: L.Path.prototype._updatePath,
        _updatePath: function () {
            this._original_UpdatePath();
            this._updateLabelSize();




        },
        _updateLabelSize:function(){
            if (this.label){
                var size=3;
                try{
                    size = this._path.getBBox().width/50;
                    if(size>2.5){
                        size=2.5;
                    }
                }catch(e){

                }
                this.label.updateSize(size);
            }
        },
        _moveLabel: function (e) {
            this.label.setLatLng(e.latlng);
        },

        _hideLabel: function () {
            if(this._map && this.label) {
                this._map.removeLabel(this.label);
            }
        },



        _originalUpdateStyle: L.Path.prototype._updateStyle,

        _updateStyle: function () {


            this._originalUpdateStyle();
            var absoluteOpacity = this.options.fillOpacity === 0 ? 0 : 1;

            if (this.label) {

                this.label.setOpacity(absoluteOpacity);

            }
        }


    });
    L.Map.include({
        showLabel: function (label) {

            var layer = this.addLayer(label);
            label.bringToFront();
            return layer;
        },
        removeLabel: function (label) {

            return this.removeLayer(label);
        }
    });
    L.Polygon.include({

        _originalInitEvents: L.Polygon.prototype._initEvents,
        _initEvents: function (onOff) {
            this._originalInitEvents(onOff);
            if (!L.DomEvent) { return; }

            onOff = onOff || 'on';

           if(this.options.droppable){
                L.DomEvent[onOff](this._container, 'dragover', this._dragOver, this._container);
                L.DomEvent[onOff](this._container, 'dragenter', this._dragEnter, this._container);
                L.DomEvent[onOff](this._container, 'dragleave', this._dragLeave, this._container);
                L.DomEvent[onOff](this._container, 'drop', this._drop, this);
           }

        },
        _dragOver:function (e) {
            e.dataTransfer.dropEffect = 'move';
            // allows us to drop
            if (e.preventDefault) e.preventDefault();
            this.classList.add('over');
            return false;
        },

        _dragEnter:function (e) {
            this.classList.add('over');
            return false;
        },
        _dragLeave:function (e) {
            this.classList.remove('over');
            return false;
        },
        _drop:function (event) {
            // Stops some browsers from redirecting.

            if (event.stopPropagation) event.stopPropagation();

            this._container.classList.remove('over');


            this.fire('drop', {originalEvent: event ,parentLayer:this});
            // call the drop passed drop function

            return false;
        }
    });

    L.FeatureGroup.include({
        // TODO: remove this when AOP is supported in Leaflet, need this as we cannot put code in removeLayer()
        clearLayers: function () {
            this.unbindLabel();
            this.eachLayer(this.removeLayer, this);
            return this;
        },
        _originalRemoveLayer: L.FeatureGroup.prototype.removeLayer,
        removeLayer: function (layer) {
            this._originalRemoveLayer(layer);
            this.unbindLabel();
        },

        bindLabel: function (content, options) {
            return this.invoke('bindLabel', content, options);
        },

        unbindLabel: function () {
            return this.invoke('unbindLabel');
        },

        updateLabelContent: function (content) {
            this.invoke('updateLabelContent', content);
        }
    });



}(this, document));
