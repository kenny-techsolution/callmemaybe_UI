// this is the .10 version of AngularJS Bootstrap datepicker
// date picker as implemented in OOH is not compatible with the .11 version
// TODO:  make OOH datepicker implementation work with .11+ then delete this file

angular.module("template/datepicker/popup-mod.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/datepicker/popup-mod.html",
	    "<ul class=\"dropdown-menu\" ng-style=\"{display: (isOpen && 'block') || 'none', top: position.top+'px', left: position.left+'px'}\">\n" +
	    "	<li ng-transclude></li>\n" +
	    "	<li ng-show=\"showButtonBar\" style=\"padding:10px 9px 2px\">\n" +
	    "		<span class=\"btn-group\">\n" +
	    "			<button type=\"button\" class=\"btn btn-sm btn-info\" ng-click=\"today()\">{{currentText}}</button>\n" +
	    "			<button type=\"button\" class=\"btn btn-sm btn-default\" ng-click=\"showWeeks = ! showWeeks\" ng-class=\"{active: showWeeks}\">{{toggleWeeksText}}</button>\n" +
	    "			<button type=\"button\" class=\"btn btn-sm btn-danger\" ng-click=\"clear()\">{{clearText}}</button>\n" +
	    "		</span>\n" +
	    "		<button type=\"button\" class=\"btn btn-sm btn-success pull-right\" ng-click=\"isOpen = false\">{{closeText}}</button>\n" +
	    "	</li>\n" +
	    "</ul>\n" +
	    "");
}]);

angular.module("template/datepicker/datepicker-mod.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/datepicker/datepicker-mod.html",
	    "<table>\n" +
	    "  <thead>\n" +
	    "    <tr>\n" +
	    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
	    "      <th colspan=\"{{rows[0].length - 2 + showWeekNumbers}}\"><button type=\"button\" class=\"btn btn-default btn-sm btn-block\" ng-click=\"toggleMode()\"><strong>{{title}}</strong></button></th>\n" +
	    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
	    "    </tr>\n" +
	    "    <tr ng-show=\"labels.length > 0\" class=\"h6\">\n" +
	    "      <th ng-show=\"showWeekNumbers\" class=\"text-center\">#</th>\n" +
	    "      <th ng-repeat=\"label in labels\" class=\"text-center\">{{label}}</th>\n" +
	    "    </tr>\n" +
	    "  </thead>\n" +
	    "  <tbody>\n" +
	    "    <tr ng-repeat=\"row in rows\">\n" +
	    "      <td ng-show=\"showWeekNumbers\" class=\"text-center\"><em>{{ getWeekNumber(row) }}</em></td>\n" +
	    "      <td ng-repeat=\"dt in row\" class=\"text-center\">\n" +
	    "        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default btn-sm\" ng-class=\"{'btn-info': dt.selected}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\"><span ng-class=\"{'text-muted': dt.secondary}\">{{dt.label}}</span></button>\n" +
	    "      </td>\n" +
	    "    </tr>\n" +
	    "  </tbody>\n" +
	    "</table>\n" +
	    "");
	}]);



angular.module('ui.att.positionMod', [])
/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
  .factory('$positionMod', ['$document', '$window', function ($document, $window) {

    function getStyle(el, cssprop) {
      if (el.currentStyle) { //IE
        return el.currentStyle[cssprop];
      } else if ($window.getComputedStyle) {
        return $window.getComputedStyle(el)[cssprop];
      }
      // finally try and get inline style
      return el.style[cssprop];
    }

    /**
     * Checks if a given element is statically positioned
     * @param element - raw DOM element
     */
    function isStaticPositioned(element) {
      return (getStyle(element, "position") || 'static' ) === 'static';
    }

    /**
     * returns the closest, non-statically positioned parentOffset of a given element
     * @param element
     */
    var parentOffsetEl = function (element) {
      var docDomEl = $document[0];
      var offsetParent = element.offsetParent || docDomEl;
      while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docDomEl;
    };

    return {
      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/
       */
      position: function (element) {
        var elBCR = this.offset(element);
        var offsetParentBCR = { top: 0, left: 0 };
        var offsetParentEl = parentOffsetEl(element[0]);
        if (offsetParentEl != $document[0]) {
          offsetParentBCR = this.offset(angular.element(offsetParentEl));
          offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
          offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }

        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: elBCR.top - offsetParentBCR.top,
          left: elBCR.left - offsetParentBCR.left
        };
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/
       */
      offset: function (element) {
        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: boundingClientRect.top + ($window.pageYOffset || $document[0].body.scrollTop || $document[0].documentElement.scrollTop),
          left: boundingClientRect.left + ($window.pageXOffset || $document[0].body.scrollLeft  || $document[0].documentElement.scrollLeft)
        };
      }
    };
  }]);


angular.module('ui.att.datePickerMod', ['ui.att.positionMod', 'template/datepicker/popup-mod.html', 'template/datepicker/datepicker-mod.html'])
	.constant('datepickerConfigMod', {
	  dayFormat: 'dd',
	  monthFormat: 'MMMM',
	  yearFormat: 'yyyy',
	  dayHeaderFormat: 'EEE',
	  dayTitleFormat: 'MMMM yyyy',
	  monthTitleFormat: 'yyyy',
	  showWeeks: true,
	  startingDay: 0,
	  yearRange: 20,
	  minDate: null,
	  maxDate: null
	})
	
	.constant('datepickerPopupConfigMod', {
	  dateFormat: 'yyyy-MM-dd',
	  currentText: 'Today',
	  toggleWeeksText: 'Weeks',
	  clearText: 'Clear',
	  closeText: 'Done',
	  closeOnDateSelection: true,
	  appendToBody: false,
	  showButtonBar: true
	})
	
	.controller('DatepickerControllerMod', ['$scope', '$attrs', 'dateFilter', 'datepickerConfigMod', function($scope, $attrs, dateFilter, dtConfig) {
	  var format = {
	    day:        getValue($attrs.dayFormat,        dtConfig.dayFormat),
	    month:      getValue($attrs.monthFormat,      dtConfig.monthFormat),
	    year:       getValue($attrs.yearFormat,       dtConfig.yearFormat),
	    dayHeader:  getValue($attrs.dayHeaderFormat,  dtConfig.dayHeaderFormat),
	    dayTitle:   getValue($attrs.dayTitleFormat,   dtConfig.dayTitleFormat),
	    monthTitle: getValue($attrs.monthTitleFormat, dtConfig.monthTitleFormat)
	  },
	  startingDay = getValue($attrs.startingDay,      dtConfig.startingDay),
	  yearRange =   getValue($attrs.yearRange,        dtConfig.yearRange);
	
	  this.minDate = dtConfig.minDate ? new Date(dtConfig.minDate) : null;
	  this.maxDate = dtConfig.maxDate ? new Date(dtConfig.maxDate) : null;
	
	  function getValue(value, defaultValue) {
	    return angular.isDefined(value) ? $scope.$parent.$eval(value) : defaultValue;
	  }
	
	  function getDaysInMonth( year, month ) {
	    return new Date(year, month, 0).getDate();
	  }
	
	  function getDates(startDate, n) {
	    var dates = new Array(n);
	    var current = startDate, i = 0;
	    while (i < n) {
	      dates[i++] = new Date(current);
	      current.setDate( current.getDate() + 1 );
	    }
	    return dates;
	  }
	
	  function makeDate(date, format, isSelected, isSecondary) {
	    return { date: date, label: dateFilter(date, format), selected: !!isSelected, secondary: !!isSecondary };
	  }
	
	  this.modes = [
	    {
	      name: 'day',
	      getVisibleDates: function(date, selected) {
	        var year = date.getFullYear(), month = date.getMonth(), firstDayOfMonth = new Date(year, month, 1);
	        var difference = startingDay - firstDayOfMonth.getDay(),
	        numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : - difference,
	        firstDate = new Date(firstDayOfMonth), numDates = 0;
	
	        if ( numDisplayedFromPreviousMonth > 0 ) {
	          firstDate.setDate( - numDisplayedFromPreviousMonth + 1 );
	          numDates += numDisplayedFromPreviousMonth; // Previous
	        }
	        numDates += getDaysInMonth(year, month + 1); // Current
	        numDates += (7 - numDates % 7) % 7; // Next
	
	        var days = getDates(firstDate, numDates), labels = new Array(7);
	        for (var i = 0; i < numDates; i ++) {
	          var dt = new Date(days[i]);
	          days[i] = makeDate(dt, format.day, (selected && selected.getDate() === dt.getDate() && selected.getMonth() === dt.getMonth() && selected.getFullYear() === dt.getFullYear()), dt.getMonth() !== month);
	        }
	        for (var j = 0; j < 7; j++) {
	          labels[j] = dateFilter(days[j].date, format.dayHeader);
	        }
	        return { objects: days, title: dateFilter(date, format.dayTitle), labels: labels };
	      },
	      compare: function(date1, date2) {
	        return (new Date( date1.getFullYear(), date1.getMonth(), date1.getDate() ) - new Date( date2.getFullYear(), date2.getMonth(), date2.getDate() ) );
	      },
	      split: 7,
	      step: { months: 1 }
	    },
	    {
	      name: 'month',
	      getVisibleDates: function(date, selected) {
	        var months = new Array(12), year = date.getFullYear();
	        for ( var i = 0; i < 12; i++ ) {
	          var dt = new Date(year, i, 1);
	          months[i] = makeDate(dt, format.month, (selected && selected.getMonth() === i && selected.getFullYear() === year));
	        }
	        return { objects: months, title: dateFilter(date, format.monthTitle) };
	      },
	      compare: function(date1, date2) {
	        return new Date( date1.getFullYear(), date1.getMonth() ) - new Date( date2.getFullYear(), date2.getMonth() );
	      },
	      split: 3,
	      step: { years: 1 }
	    },
	    {
	      name: 'year',
	      getVisibleDates: function(date, selected) {
	        var years = new Array(yearRange), year = date.getFullYear(), startYear = parseInt((year - 1) / yearRange, 10) * yearRange + 1;
	        for ( var i = 0; i < yearRange; i++ ) {
	          var dt = new Date(startYear + i, 0, 1);
	          years[i] = makeDate(dt, format.year, (selected && selected.getFullYear() === dt.getFullYear()));
	        }
	        return { objects: years, title: [years[0].label, years[yearRange - 1].label].join(' - ') };
	      },
	      compare: function(date1, date2) {
	        return date1.getFullYear() - date2.getFullYear();
	      },
	      split: 5,
	      step: { years: yearRange }
	    }
	  ];
	
	  this.isDisabled = function(date, mode) {
	    var currentMode = this.modes[mode || 0];
	    return ((this.minDate && currentMode.compare(date, this.minDate) < 0) || (this.maxDate && currentMode.compare(date, this.maxDate) > 0) || ($scope.dateDisabled && $scope.dateDisabled({date: date, mode: currentMode.name})));
	  };
	}])
	
	.directive( 'datepickerMod', ['dateFilter', '$parse', 'datepickerConfigMod', '$log', function (dateFilter, $parse, datepickerConfig, $log) {
	  return {
	    restrict: 'EA',
	    replace: true,
	    templateUrl: 'template/datepicker/datepicker-mod.html',
	    scope: {
	      dateDisabled: '&'
	    },
	    require: ['datepickerMod', '?^ngModel'],
	    controller: 'DatepickerControllerMod',
	    link: function(scope, element, attrs, ctrls) {
	      var datepickerCtrl = ctrls[0], ngModel = ctrls[1];
	
	      if (!ngModel) {
	        return; // do nothing if no ng-model
	      }
	
	      // Configuration parameters
	      var mode = 0, selected = new Date(), showWeeks = datepickerConfig.showWeeks;
	
	      if (attrs.showWeeks) {
	        scope.$parent.$watch($parse(attrs.showWeeks), function(value) {
	          showWeeks = !! value;
	          updateShowWeekNumbers();
	        });
	      } else {
	        updateShowWeekNumbers();
	      }
	
	      if (attrs.min) {
	        scope.$parent.$watch($parse(attrs.min), function(value) {
	          datepickerCtrl.minDate = value ? new Date(value) : null;
	          refill();
	        });
	      }
	      if (attrs.max) {
	        scope.$parent.$watch($parse(attrs.max), function(value) {
	          datepickerCtrl.maxDate = value ? new Date(value) : null;
	          refill();
	        });
	      }
	
	      function updateShowWeekNumbers() {
	        scope.showWeekNumbers = mode === 0 && showWeeks;
	      }
	
	      // Split array into smaller arrays
	      function split(arr, size) {
	        var arrays = [];
	        while (arr.length > 0) {
	          arrays.push(arr.splice(0, size));
	        }
	        return arrays;
	      }
	
	      function refill( updateSelected ) {
	        var date = null, valid = true;
	
	        if ( ngModel.$modelValue ) {
	          date = new Date( ngModel.$modelValue );
	
	          if ( isNaN(date) ) {
	            valid = false;
	            $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
	          } else if ( updateSelected ) {
	            selected = date;
	          }
	        }
	        ngModel.$setValidity('date', valid);
	
	        var currentMode = datepickerCtrl.modes[mode], data = currentMode.getVisibleDates(selected, date);
	        angular.forEach(data.objects, function(obj) {
	          obj.disabled = datepickerCtrl.isDisabled(obj.date, mode);
	        });
	
	        ngModel.$setValidity('date-disabled', (!date || !datepickerCtrl.isDisabled(date)));
	
	        scope.rows = split(data.objects, currentMode.split);
	        scope.labels = data.labels || [];
	        scope.title = data.title;
	      }
	
	      function setMode(value) {
	        mode = value;
	        updateShowWeekNumbers();
	        refill();
	      }
	
	      ngModel.$render = function() {
	        refill( true );
	      };
	
	      scope.select = function( date ) {
	        if ( mode === 0 ) {
	          var dt = ngModel.$modelValue ? new Date( ngModel.$modelValue ) : new Date(0, 0, 0, 0, 0, 0, 0);
	          dt.setFullYear( date.getFullYear(), date.getMonth(), date.getDate() );
	          ngModel.$setViewValue( dt );
	          refill( true );
	        } else {
	          selected = date;
	          setMode( mode - 1 );
	        }
	      };
	      scope.move = function(direction) {
	        var step = datepickerCtrl.modes[mode].step;
	        selected.setMonth( selected.getMonth() + direction * (step.months || 0) );
	        selected.setFullYear( selected.getFullYear() + direction * (step.years || 0) );
	        refill();
	      };
	      scope.toggleMode = function() {
	        setMode( (mode + 1) % datepickerCtrl.modes.length );
	      };
	      scope.getWeekNumber = function(row) {
	        return ( mode === 0 && scope.showWeekNumbers && row.length === 7 ) ? getISO8601WeekNumber(row[0].date) : null;
	      };
	
	      function getISO8601WeekNumber(date) {
	        var checkDate = new Date(date);
	        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
	        var time = checkDate.getTime();
	        checkDate.setMonth(0); // Compare with Jan 1
	        checkDate.setDate(1);
	        return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
	      }
	    }
	  };
	}])
	

	.directive('datepickerPopupMod', ['$compile', '$parse', '$document', '$positionMod', 'dateFilter', 'datepickerPopupConfigMod', 'datepickerConfigMod',
	function ($compile, $parse, $document, $positionMod, dateFilter, datepickerPopupConfigMod, datepickerConfigMod) {
	  return {
	    restrict: 'EA',
	    require: 'ngModel',
	    link: function(originalScope, element, attrs, ngModel) {
	      var scope = originalScope.$new(), // create a child scope so we are not polluting original one
	          dateFormat,
	          closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? originalScope.$eval(attrs.closeOnDateSelection) : datepickerPopupConfigMod.closeOnDateSelection,
	          appendToBody = angular.isDefined(attrs.datepickerAppendToBody) ? originalScope.$eval(attrs.datepickerAppendToBody) : datepickerPopupConfigMod.appendToBody;

	      attrs.$observe('datepickerPopupMod', function(value) {
	          dateFormat = value || datepickerPopupConfigMod.dateFormat;
	          ngModel.$render();
	      });

	      scope.showButtonBar = angular.isDefined(attrs.showButtonBar) ? originalScope.$eval(attrs.showButtonBar) : datepickerPopupConfigMod.showButtonBar;

	      originalScope.$on('$destroy', function() {
	        $popup.remove();
	        scope.$destroy();
	      });

	      attrs.$observe('currentText', function(text) {
	        scope.currentText = angular.isDefined(text) ? text : datepickerPopupConfigMod.currentText;
	      });
	      attrs.$observe('toggleWeeksText', function(text) {
	        scope.toggleWeeksText = angular.isDefined(text) ? text : datepickerPopupConfigMod.toggleWeeksText;
	      });
	      attrs.$observe('clearText', function(text) {
	        scope.clearText = angular.isDefined(text) ? text : datepickerPopupConfigMod.clearText;
	      });
	      attrs.$observe('closeText', function(text) {
	        scope.closeText = angular.isDefined(text) ? text : datepickerPopupConfigMod.closeText;
	      });

	      var getIsOpen, setIsOpen;
	      if ( attrs.isOpen ) {
	        getIsOpen = $parse(attrs.isOpen);
	        setIsOpen = getIsOpen.assign;

	        originalScope.$watch(getIsOpen, function updateOpen(value) {
	          scope.isOpen = !! value;
	        });
	      }
	      scope.isOpen = getIsOpen ? getIsOpen(originalScope) : false; // Initial state

	      function setOpen( value ) {
	        if (setIsOpen) {
	          setIsOpen(originalScope, !!value);
	        } else {
	          scope.isOpen = !!value;
	        }
	      }

	      var documentClickBind = function(event) {
	        if (scope.isOpen && event.target !== element[0]) {
	          scope.$apply(function() {
	            setOpen(false);
	          });
	        }
	      };

	      var elementFocusBind = function() {
	        scope.$apply(function() {
	          setOpen( true );
	        });
	      };

	      // popup element used to display calendar
	      var popupEl = angular.element('<div datepicker-popup-wrap-mod><div datepicker-mod></div></div>');
	      popupEl.attr({
	        'ng-model': 'date',
	        'ng-change': 'dateSelection()'
	      });
	      var datepickerEl = angular.element(popupEl.children()[0]),
	          datepickerOptions = {};
	      if (attrs.datepickerOptions) {
	        datepickerOptions = originalScope.$eval(attrs.datepickerOptions);
	        datepickerEl.attr(angular.extend({}, datepickerOptions));
	      }

	      // TODO: reverse from dateFilter string to Date object
	      function parseDate(viewValue) {
	        if (!viewValue) {
	          ngModel.$setValidity('date', true);
	          return null;
	        } else if (angular.isDate(viewValue)) {
	          ngModel.$setValidity('date', true);
	          return viewValue;
	        } else if (angular.isString(viewValue)) {
	          var date = new Date(viewValue);
	          if (isNaN(date)) {
	            ngModel.$setValidity('date', false);
	            return undefined;
	          } else {
	            ngModel.$setValidity('date', true);
	            return date;
	          }
	        } else {
	          ngModel.$setValidity('date', false);
	          return undefined;
	        }
	      }
	      ngModel.$parsers.unshift(parseDate);

	      // Inner change
	      scope.dateSelection = function(dt) {
	        if (angular.isDefined(dt)) {
	          scope.date = dt;
	        }
	        ngModel.$setViewValue(scope.date);
	        ngModel.$render();

	        if (closeOnDateSelection) {
	          setOpen( false );
	        }
	      };

	      element.bind('input change keyup', function() {
	        scope.$apply(function() {
	          scope.date = ngModel.$modelValue;
	        });
	      });

	      // Outter change
	      ngModel.$render = function() {
	        var date = ngModel.$viewValue ? dateFilter(ngModel.$viewValue, dateFormat) : '';
	        element.val(date);
	        scope.date = ngModel.$modelValue;
	      };

	      function addWatchableAttribute(attribute, scopeProperty, datepickerAttribute) {
	        if (attribute) {
	          originalScope.$watch($parse(attribute), function(value){
	            scope[scopeProperty] = value;
	          });
	          datepickerEl.attr(datepickerAttribute || scopeProperty, scopeProperty);
	        }
	      }
	      addWatchableAttribute(attrs.min, 'min');
	      addWatchableAttribute(attrs.max, 'max');
	      if (attrs.showWeeks) {
	        addWatchableAttribute(attrs.showWeeks, 'showWeeks', 'show-weeks');
	      } else {
	        scope.showWeeks = 'show-weeks' in datepickerOptions ? datepickerOptions['show-weeks'] : datepickerConfigMod.showWeeks;
	        datepickerEl.attr('show-weeks', 'showWeeks');
	      }
	      if (attrs.dateDisabled) {
	        datepickerEl.attr('date-disabled', attrs.dateDisabled);
	      }

	      function updatePosition() {
	        scope.position = appendToBody ? $positionMod.offset(element) : $positionMod.position(element);
	        scope.position.top = scope.position.top + element.prop('offsetHeight');
	      }

	      var documentBindingInitialized = false, elementFocusInitialized = false;
	      scope.$watch('isOpen', function(value) {
	        if (value) {
	          updatePosition();
	          $document.bind('click', documentClickBind);
	          if(elementFocusInitialized) {
	            element.unbind('focus', elementFocusBind);
	          }
	          element[0].focus();
	          documentBindingInitialized = true;
	        } else {
	          if(documentBindingInitialized) {
	            $document.unbind('click', documentClickBind);
	          }
	          element.bind('focus', elementFocusBind);
	          elementFocusInitialized = true;
	        }

	        if ( setIsOpen ) {
	          setIsOpen(originalScope, value);
	        }
	      });

	      scope.today = function() {
	        scope.dateSelection(new Date());
	      };
	      scope.clear = function() {
	        scope.dateSelection(null);
	      };

	      var $popup = $compile(popupEl)(scope);
	      if ( appendToBody ) {
	        $document.find('body').append($popup);
	      } else {
	        element.after($popup);
	      }
	    }
	  };
	}])
	.directive('datepickerPopupWrapMod', function() {
	  return {
	    restrict:'EA',
	    replace: true,
	    transclude: true,
	    templateUrl: 'template/datepicker/popup-mod.html',
	    link:function (scope, element, attrs) {
	      element.bind('click', function(event) {
	        event.preventDefault();
	        event.stopPropagation();
	      });
	    }
	  };
});


