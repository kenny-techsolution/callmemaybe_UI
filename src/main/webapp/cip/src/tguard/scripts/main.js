$(document).ready(function(){
	var $loginForm = $('#user-login'),
		$username = $('#username'),
		$rememberMe = $('#remember-me'),
		loginForm = document.getElementById('user-login'),
		userErrorDiv = document.getElementById('username-error'),
		passwordErrorDiv = document.getElementById('password-error'),
		isRememberMe = readCookie('rememberMe'),
		isFormValid = false,
		errorMessage = {
			usernameMissing: 'username is required.',
			passwordMissing: 'password required.'
		},
		cspEnviroments = {
			'/Users/bdcoe/Documents/work/repos/codecloud/cip-actuate/src/tguard/login.html': 'test/cip',
			'/dev/cip/': 'https://webtest.csp.att.com/envisionlabsdev/cip',
			'/qa/cip/': 'https://webtest.csp.att.com/envisionlabsqa/cip',
			'/uat/cip/': 'https://webtest.csp.att.com/envisionlabsuat/cip',
			'/demo/cip/': 'https://webtest.csp.att.com/envisionlabsdemo/cip',
			'/': 'https://www.e-access.att.com/envisionlabs'
		},
		cspLink = location.pathname.slice(-1) === '/' ? 
			cspEnviroments[location.pathname] : cspEnviroments[location.pathname + '/'];

	//TODO: first position in array is the 'local' link testing only
	$('#csp-enviroment').attr('href', cspLink);

	if(isRememberMe){
		$username.val(isRememberMe);
		$rememberMe.attr('checked', 'checked');
	}

	$loginForm.on('submit', function(evt){
		var loginInputs = loginForm.getElementsByTagName('input');

		for(var i = 0; loginInputs.length > i; i++){
			var input = loginInputs[i],
				errorDiv = input.type === 'text' ? userErrorDiv : passwordErrorDiv; 

			if(input.getAttribute('required')){
				isFormValid = loginForm.checkValidity();

				if(!isFormValid){
					if(input.validity.valueMissing){
						errorDiv.className = 'error-container';
						errorDiv.children[0].innerHTML = input.type === 'text' ? errorMessage.usernameMissing : errorMessage.passwordMissing;
					} else {
						errorDiv.className = 'error-container hide';
					}
				} else {
					if(input.type === 'text'){
						userErrorDiv.className = 'error-container hide';	
					} else if(input.type === 'password'){
						passwordErrorDiv.className = 'error-container hide';
					}
				}
			}
		}

		if($rememberMe.is(':checked')){
			createCookie('rememberMe', $username.val(), 30);
		} else {
			if(isRememberMe){
				clearCookie('rememberMe');
			}
		}

		return isFormValid;
	});
});


function createCookie(name, value, days){
	var date,
		expires;

	if(days){
		date = new Date();

		date.setTime(date.getTime() + (days*24*60*60*1000));
		expires = '; expires=' + date.toGMTString();
	} else {
		expires = '';
	}
	
	document.cookie = name + '=' + value + expires + '; path=/';
}

function readCookie(name){
	var name = name + '=',
		cookieArray = document.cookie.split(';'),
		i;

	for(i=0; i < cookieArray.length; i++){
		var cookie = cookieArray[i];

		while(cookie.charAt(0)==' '){
			cookie = cookie.substring(1, cookie.length);
		}
		if (cookie.indexOf(name) == 0){
			return cookie.substring(name.length, cookie.length);
		}
	}

	return null;
}

function clearCookie(name){
	return createCookie(name, '', -1);
}