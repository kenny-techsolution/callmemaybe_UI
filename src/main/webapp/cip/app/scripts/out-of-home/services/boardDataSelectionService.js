angular.module('cip.outOfHome').service('boardDataSelection', function() {
	'use strict';

	this.isOpened = false;
	this.nameMap = {
		vendors: {
			clearChannel: 'Clear Channel'
		},
		groups: {
			attBillboards: 'att-billboards'
		}
	};
	this.vendors = {
		clearChannel: false
	};
	this.groups = {
		attBillboards: false
	};
	this.toggleOpenState = function() {
		this.isOpened = !this.isOpened;
	};
	this.getVendorsArray = function() {
		return this.getArray('vendors');
	};
	this.getGroupsArray = function() {
		return this.getArray('groups');
	};
	this.getArray = function(type) {
		if (!type) {
			return [];
		} else {
			var result = [];
			for (var item in this[type]) {
				if (this[type][item]) {
					result.push(this.nameMap[type][item]);
				}
			}
			return result;
		}
	};
	this.isAllSelected = function(type) {
		if (!type) {
			return false;
		} else {
			for (var item in this[type]) {
				if (!this[type][item]) {
					return false;
				}
			}
			return true;
		}
	};
	this.isNoneSelected = function() {
		var noneSelected = true;
		var types = ['vendors', 'groups'];
		for (var i = 0; i < types.length; i ++) {
			var type = types[i];
			for (var item in this[type]) {
				if (this[type][item]) {
					return false;
				}
			}
		}
		return true;
	};
});