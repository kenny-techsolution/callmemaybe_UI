"use strict";

 angular.module("config", ["ngCookies","ngResource","ngSanitize","ngRoute","ui.bootstrap","ui.att"])
.constant("ENV", {
  "debug": ${grunt.debug},
  "authenticateAPI": {
    "endpoints": {
      "login": "/auth",
      "logout": "/url",
      "users": "/users",
      "accounts": "/accounts"
    }
  },
  "iportalConfig": {
    "baseUrl": "${grunt.actuate.server}",
    "username": "${grunt.actuate.username}",
    "password": "${grunt.actuate.password}"
  },
  "cipMapAPI": {
    "endpoints": {
      "getLayersByBounds": "/geo-service/layers/bounding?layer=",
      "getLayerById": "/geo-service/layers/",
      "getLayerNames": "/geo-service/layers/names?layer="
    }
  },
  "poiAPI": {
    "endpoints": {
      "getPoisByBBox": "/geo-service/pois/bounding?neLat="
    }
  },
  "coroplethAPI": {
    "endpoints": {
      "byGroup": "/geo-service/zipPop/group/",
      "byId": "/geo-service/zipPop/poi/"
    }
  },
  "defaultFenceId": ${grunt.defaultFenceId},
  "name": "${grunt.envName}",
  "envDomainUrl": "${grunt.envDomainUrl}",
  "envDomain.tguard": "${envDomain.tguard}",
  "envDomain.cspDev": "${envDomain.cspDev}",
  "envDomain.cspLive": "${envDomain.cspLive}"
})
.constant("USER_ROLES", {
  "user": "ACCOUNT_USER",
  "admin": "ACCOUNT_ADMIN",
  "super": "ACCOUNT_SUPER_USER"
});