describe('httpInterceptor', function() {
	'use strict';

	var interceptor;
	beforeEach(module('cip'));

	beforeEach(module(function($provide) {
		  $provide.constant('ENV', {
			  name: 'prod'
		  });
	}));
	
	beforeEach(inject(function(_httpInterceptor_) {
		interceptor = _httpInterceptor_;
	}));

	it('should proxy /cip-services calls', function() {
		var config = {
				url: '/cip-services/test'
		}
		config = interceptor.request(config);
		expect(config.url).toEqual('/cip-auth/proxy?target=/cip-services/test');
	});
	
	it('should proxy /geo-service calls', function() {
		var config = {
				url: '/geo-service/test'
		}
		config = interceptor.request(config);
		expect(config.url).toEqual('/cip-auth/proxy?target=/geo-service/test'); 
	});
	
	it('should encode querystring params when proxying calls', function() {
		var config = {
				url: '/geo-service/test?first=1&second=2'
		}
		config = interceptor.request(config);
		expect(config.url).toEqual('/cip-auth/proxy?target=/geo-service/test?first%3D1%26second%3D2'); 
	});
	
	it('should not proxy other calls', function() {
		var config = {
				url: '/ramen.com/test'
		}
		config = interceptor.request(config);
		expect(config.url).toEqual('/ramen.com/test'); 
	});
	
	it('should not encode querystring params for nonproxied calls', function() {
		var config = {
				url: '/ramen.com/test?first=1&second=2'
		}
		config = interceptor.request(config);
		expect(config.url).toEqual('/ramen.com/test?first=1&second=2'); 
	});
	
});