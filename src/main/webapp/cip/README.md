#Big Data Actuate


##How to Install
1. cd to project directory
1. Run `npm install -g yo` to install yeoman
	* note: if this fails remove the -g option and re-run
1. Run `npm install` to install required node modules
1. To get [Bower](http://bower.io) working on the Intranet run:
	* Mac: `git config --global url."https://".insteadOf git://`
	* PC: `git config url."https://".insteadOf git://` 
1. Run `bower install` to install the required bower components
1. Run `grunt bower-install` to link necessary bower components in the html
1. Run `grunt serve` to spin up the server
1. Run `grunt test` to run any necessary unit tests


## Adding new packages with [Bower](http://bower.io)

When adding new packages with bower it's important that you use the `--save` flag like so: 

`bower install jquery --save`

Doing so will upate the `bower.json` file automatically for you.

Once you have ran `bower install [package_name] --save`, execute:

1. Run `bower install`
1. Run `grunt bower-install` to automatically update the app/index.html file with any script dependencies. Pay attention to any errors this command produces as you may have to add the script dependancy manually.

##Builds
1. LOCAL:
	* grunt serve
	* automatically launches site - http://127.0.0.1:9000/#/
	* To use CSP global login you need to use - http://localhost.att.com:9000/#/
1. QTS - DEV:
	* grunt serve:qtsDev
	* Creates war file
	* unminimized and uncompressed js/css/html
1. PRODUCTION:
	* grunt serve:prod
	* Creates war file
	* minimized and compressed js/css/html

##Hosting
* DEV:
	* win-moreev5loob/CIPBigDataActuateDev
	* 135.37.76.218
* QA
	* win-4cflb5ih76d/CIPBigDataActuateQA
	* 135.37.52.170
	
##CipMap service
* DEV
    * 172.16.4.231:8079

##Map FTP to folder
###In Windows 8:

1. In file explorer, right click "My Computer" and click "Add Network Location"
1. Internet or network address: ftp://IP_ADDRESS_OF_SERVER
1. Uncheck "Log on anonymously", change user name to your ATTUID
1. Name the share what you want
1. Click finish