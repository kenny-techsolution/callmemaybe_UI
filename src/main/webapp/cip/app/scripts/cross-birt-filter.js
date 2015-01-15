var CrossBIRTFilter = CrossBIRTFilter || (function ($) {
    var version = "0.9.6";

    var DEFAULT_WIDGET_OPTIONS = {width: 350, height: 255};
    var DEFAULT_DATA_FILE_NAME = "CIP-VA-DataObject";

    var _dataServiceURL = null;
    var _errorCallback = null;
    var _filterCallback = null;

    var _widgets = {};
    var _filters = {};
    var _dataFiles = [];

    var angularElements = {};

    var exposeAngularElements = function(overLay, ENV){
        angularElements.overLay = overLay;
        angularElements.ENV = ENV;
    };

    var initialize = function (path, options, user, pass, context, callback, errorCallback, filterCallback) {
        var settings = options;
        settings.__masterpage = false;
        actuate.load("viewer");

        var reqOps = new actuate.RequestOptions();
        reqOps.setRepositoryType(actuate.RequestOptions.REPOSITORY_ENCYCLOPEDIA);
        reqOps.setCustomParameters(settings.customParameters);

        changeDefaultFileNameByContext(context);
        _dataServiceURL = settings.dataServiceURL;
        _errorCallback = errorCallback;
        _filterCallback = filterCallback;

        actuate.initialize(path, reqOps, user, pass, function () {
            if (callback)
                callback();
        }, _errorCallback);
    };

    var reset = function (context, errorCallback, filterCallback) {

        $.each(_widgets, function (i, widget) {
            var containerId = widget.viewer._._helper.container.id;
            actuate.viewer.impl.Viewer._viewersMap.remove(containerId);
            widget.viewer = null;
            var id = widget.id;
            widget = null;
            delete _widgets[id];
            $("#" + containerId).html(null);
        });

        changeDefaultFileNameByContext(context);

        _widgets = {};
        _filters = {};
        _dataFiles = [];

        if (errorCallback)
            _errorCallback = errorCallback;
        if (filterCallback)
            _filterCallback = filterCallback;

    };

    var changeDefaultFileNameByContext = function (context) {
        DEFAULT_DATA_FILE_NAME = "CIP-" + context + "-DataObject";
    };

    var setDataFile = function (parameters, callback) {
        if (typeof parameters === "string")
            parameters = JSON.parse(parameters);

        var dataFile = _findDataFile(parameters);
        if (dataFile) {
            // if already current just return
            if (dataFile.isCurrent) {
                if (callback)
                    callback();
                return;
            }

            _setCurrentDataFile(parameters);
            _applyFilters(null);
            if (callback)
                callback();

        } else {
            angularElements.overLay.setShow(true);
            $.post(_dataServiceURL,
                    parameters,
                    function (data) {
                        angularElements.overLay.setShow(false, 'data');
                        if (data.status) {

                            //TODO: With new servlet, this is where we check for job status, and loop until no longer running/pending
                            _dataFiles.push({parameters: parameters, dataFileName: data.dataFileName});
                            _setCurrentDataFile(parameters);
                            _applyFilters(null);
                            if (callback)
                                callback();

                        } else {
                            if (_errorCallback)
                                _errorCallback(null, data.failureMessage);
                        }
                    },
                    "json")
                    .fail(function () {
                        angularElements.overLay.setShow(false,'data');
                        if (_errorCallback)
                            _errorCallback(null, "Failure while communicating with data service.");
                    });
        }
    };

    var _findDataFile = function (parameters) {
        var sLoc = parameters.locations;
        for (var i = 0; i < _dataFiles.length; i++) {
            var dLoc = _dataFiles[i].parameters.locations;
            if (dLoc === sLoc) {
                 return _dataFiles[i];
            }
        }
        return null;
    };

    var _setCurrentDataFile = function (parameters) {
        $.each(_dataFiles, function (i, dataFile) {
            dataFile.isCurrent = false;
        });

        var dataFile = _findDataFile(parameters);
        if (dataFile)
            dataFile.isCurrent = true;
        return dataFile;
    };

    var createWidget = function (containerId, name, options, callback, errorCallback) {
        var settings = $.extend({}, DEFAULT_WIDGET_OPTIONS, options);

        var uiConfig = new actuate.viewer.UIConfig();
        var panel = new actuate.viewer.ScrollPanel();
        panel.setMouseScrollingEnabled(false);
        panel.setPanInOutEnabled(false);
        uiConfig.setContentPanel(panel);

        var viewer = new actuate.Viewer(containerId, uiConfig);
        viewer.setReportName(name);

        viewer.setContentMargin(0);
        viewer.setWidth(settings.width);
        viewer.setHeight(settings.height);

        var uiOpts = new actuate.viewer.UIOptions();
        uiOpts.enableToolBar(false);
        uiOpts.enableMainMenu(false);
        uiOpts.enableToolbarContextMenu(false);
        viewer.setUIOptions(uiOpts);

        errorCallback = errorCallback || _errorCallback;
        if (errorCallback)
            viewer.registerEventHandler(actuate.viewer.EventConstants.ON_EXCEPTION, errorCallback);

        var parameters = settings.parameters || {};

        _widgets[viewer.getId()] = {
            id: viewer.getId(),
            viewer: viewer,
            reportName: name,
            key: settings.key,
            distributed: settings.distributed,
            parameters: parameters
        };

        parameters = _getWidgetParameters(parameters, viewer.getId());
        viewer.setParameters(parameters);
        viewer.submit(function () {
            if (callback)
                callback();
        });

        return _widgets[viewer.getId()];
    };

    var deleteWidget = function (source) {
        var widget = getWidget(source);

        if (!widget.id)
            return;

        var hasFilters = _containsFilterValues(widget.key);
        _clearFilter(widget.key);

        //HACK: This uses private members of the Actuate viewer object. Need to be aware when Actuate platform changes are made.  Should have a viewer.destroy() command.
        var containerId = widget.viewer._._helper.container.id;
        actuate.viewer.impl.Viewer._viewersMap.remove(containerId);
        widget.viewer = null;
        var id = widget.id;
        widget = null;
        delete _widgets[id];
        $("#" + containerId).html(null);

        if (hasFilters)
            _applyFilters(null);
    };

    var clearWidgetFilter = function (source) {
        var widget = getWidget(source);

        if (widget.id) {
            _clearFilter(widget.key);
            _applyFilters(source);
        }

        return getWidgetInfo(widget);
    };

    var clearAllFilters = function () {
        var filterCount = 0;
        $.each(_filters, function () {
            filterCount++;
        });
        if (filterCount == 0) {
            if (_filterCallback)
                _filterCallback(_filters);
            return;
        }

        $.each(_filters, function (fi, filter) {
            _clearFilter(filter.key);
        });
        _applyFilters(null);
    };

    var _clearFilter = function (key) {
        if (_filters[key]) {
            if (_filters[key].distributed) {
                $.each(_filters[key].values, function (i, value) {
                    value.enabled = false;
                });
            } else {
                _filters[key].values = [];
            }
        }
    };

    var toggleFilter = function (value, source) {
        var widget = getWidget(source);

        if (widget.id) {
            if (widget.key && value !== null)
                _toggleFilter(widget.key, value, widget.distributed);

            _applyFilters(widget);
        }

        return getWidgetInfo(widget);
    };

    var _toggleFilter = function (key, value, distributed) {

        if (_filters[key]) {
            _filters[key].distributed = distributed;

            if (distributed) {

                var filterValues = $.grep(_filters[key].values, function (filterValue) {
                    return filterValue.column == value;
                });

                if (filterValues.length === 0)
                    _filters[key].values.push({column: value, enabled: true});
                else
                    filterValues[0].enabled = !filterValues[0].enabled;

            } else {

                var i = 0, found = false;
                for (; i < _filters[key].values.length; i++) {
                    if (_filters[key].values[i] === value) {
                        found = true;
                        break;
                    }
                }

                if (found)
                    _filters[key].values.splice(i, 1);
                else
                    _filters[key].values.push(value);
            }

        } else {

            if (distributed) {
                _filters[key] = {key: key, values: [
                    {column: value, enabled: true}
                ], distributed: true};
            } else {
                _filters[key] = {key: key, values: [value]};
            }
        }
    };

    var _applyFilters = function (source) {
        var sourceWidget = getWidget(source);
        var widgets = {};
        var widgetKeys = [];
        $.each(_widgets, function (i, widget) {
            if (widget.id != sourceWidget.id) {
                widgets[widget.id] = widget;
                widgetKeys.push(widget.id);
            }
        });

        var count = 0;
        var applyNextFilter = function() {
            var widget = widgets[widgetKeys[count]];
            var parameters = _getWidgetParameters(widget.parameters, widget);
            widget.viewer.setParameters(parameters);

            widget.viewer.submit(function () {
                count ++;
                if (count < widgetKeys.length) {
                    applyNextFilter();
                } else if (count === widgetKeys.length) {
                    if (_filterCallback) {
                        _filterCallback(_filters);
                    }
                }
            });
        };
        applyNextFilter();
    };

    var _getWidgetParameters = function (parameters, source) {
        parameters.dataFileName = _getCurrentDataFileName();
        parameters.filterExpr = _getFilterExpression(source);
        return parameters;
    };

    var _getCurrentDataFileName = function () {
        for (var i = 0; i < _dataFiles.length; i++) {
            if (_dataFiles[i].isCurrent)
                return _dataFiles[i].dataFileName;
        }
        return DEFAULT_DATA_FILE_NAME;
    };

    var _getFilterExpression = function (source) {
        var widget = getWidget(source);
        var filters = {};
        $.each(_filters, function (i, filter) {
            if (filter.key != widget.key)
                filters[filter.key] = filter;
        });

        var expr = "";

        var outerAdded = false;
        $.each(filters, function (fi, filter) {

            if (!_containsFilterValues(filter.key))
                return;

            if (outerAdded)
                expr += "&&";
            outerAdded = true;

            expr += "(";

            if (filter.distributed) {
                var added = false;
                $.each(filter.values, function (vi, value) {
                    if (value.enabled) {
                        if (added) {
                            expr += "||";
                        }
                        expr += "(dataSetRow[\"" + value.column + "\"]>0)";
                        added = true;
                    }
                });

            } else {
                $.each(filter.values, function (vi, value) {
                    if (vi > 0)
                        expr += "||";
                    expr += "(dataSetRow[\"" + filter.key + "\"]==\"" + value + "\")";
                });
            }

            expr += ")";

        });

        return expr;
    };

    var _containsFilterValues = function (key) {
        if (_filters[key]) {
            if (_filters[key].distributed) {
                for (var i = 0; i < _filters[key].values.length; i ++) {
                    if (_filters[key].values[i].enabled) {
                        return true;
                    }
                }
            } else {
                return (_filters[key].values.length > 0);
            }
        }
        return false;
    };

    var getWidget = function (source) {
        if (source) {
            source = source.id || source;
            if (_widgets[source]) {
                return _widgets[source];
            } else {
                var viewer = actuate.getViewer(source);
                if (viewer && _widgets[viewer.getId()])
                    return _widgets[viewer.getId()];
            }
        }

        return {id: null};
    };

    var getWidgetInfo = function (source) {
        var widgetInfo = {filter: {values: []}};

        var widget = getWidget(source);
        if (widget.id) {
            widgetInfo.id = widget.id;
            if (_filters[widget.key])
                widgetInfo.filter = _filters[widget.key];
        }

        return widgetInfo
    };

    return {
        exposeAngularElements: exposeAngularElements,
        initialize: initialize,
        reset: reset,
        setDataFile: setDataFile,
        createWidget: createWidget,
        deleteWidget: deleteWidget,

        clearWidgetFilter: clearWidgetFilter,
        clearAllFilters: clearAllFilters,
        toggleFilter: toggleFilter,

        getWidget: getWidget,
        getWidgetInfo: getWidgetInfo,

        version: version
    };
})($);
