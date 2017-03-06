/**
JavaScript library for interacting with the PredictionIO API.
Returns a PredictionIO API client object for an app.

@param {string} app_key - The app key for the PredictionIO application.
@param {Object} options - Key-value pairs for options.
                          Currently only supports the 'host' key (the address of the API server).
                          Default for 'host' is 'http://localhost:8000/'.
@returns {Object} client - Client object that can be used to interact with the API server.
*/
var predictionio = function (app_key, options) {

  /**
  @namespace client
  @desc
  {@link client.buy buy(user_info, item_info, callback)} </br>
  */

  var client = {}, // All public methods will be available from the returned client object.
    APP_KEY,
    HOST = 'http://localhost:8082/',
    EVENTS_ENDPOINT = 'events';

  if (!app_key) {
      throw new Error('An app key is required to use the API.');
  }
  APP_KEY = app_key;
  if ( (typeof options !== 'undefined') && (typeof options.host !== 'undefined') ) {
    HOST = options.host; // TODO: Provided host must end in a slash
  }

  /**
  (Helper) Makes an AJAX request to the specified endpoint, with the given method and data,
  and then calls the callback on the server's response if the request was successful.

  @private
  */
  var make_request = function (url, method, data, callback) {

    var encode_data = function (obj) {
      var str = [];
      for(var p in obj)
        if (obj.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        console.log(APP_KEY);
      str.push("accessKey=" + APP_KEY);
      return str.join("&");
    };

    var request = new XMLHttpRequest();

    if (typeof callback !== 'undefined') {
      request.onreadystatechange = function () {
        if(request.readyState == 4 && Math.floor(request.status/100) == 2) {
          var response_obj = JSON.parse(request.responseText);
          callback(response_obj);
        }
        // Better way to check for success?
      };
    } else {
      request.onreadystatechange = function () {
        if(request.readyState == 4 && Math.floor(request.status/100) == 2) {
          var response_obj = JSON.parse(request.responseText);
          console.log(response_obj);
        }
        // Better way to check for success?
      };
    };

    if (method === "GET") {
      console.log("not implemented yet")
    }
    else if (method === "POST") {
      var final_url = HOST.concat(url, "?", "accessKey=" + APP_KEY);
      request.open(method, final_url);
      request.setRequestHeader("Content-type", "application/json");
      request.send(JSON.stringify(data));
    }
    else {
      throw new Error("Invalid HTTP method: ".concat(method));
    }
  };

  /**
  (Helper) Throws an error unless all the required params in the given array are
  defined in the given object.

  @private
  */
  var check_required_params = function (object, required_params, method_name) {
    var missing_params = [];
    for (var i = 0; i < required_params.length; i++) {
      if (typeof object[required_params[i]] === 'undefined') {
        missing_params.push(required_params[i]);
      }
    }
    if (missing_params.length > 0) {
      var missing_string = missing_params.join(', ');
      throw new Error("The following required parameters for ".concat(method_name, " are missing: ", missing_string));
    }
  };

  /**
  Attempts to add a user, specified by the user_info JSON object, to the PredictionIO
  database, then calls a callback function on the server's response if the request
  is successful.

  @method buy
  @memberof client

  @param {Object} user_info - Key-value information about the user to be added. </br>
      Requires: </br>
      - pio_uid: the id of the user to be added. Should be unique. If this id is already
        in use, the old record will be overwritten. </br> </br>

      Optional: </br>
      - pio_latlng: Latitude and longitude for action in comma-separated doubles, e.g. 12.34,5.67. </br>
      - pio_inactive: status of item, 'true' or 'false'. </br>
      Other keys without the prefix 'pio' will be stored with the user. </br>
  @param {function} callback - Callback function to be called when server's response
      is received. Response is a plain object with properties.
  */
  client.buy = function (user_info, callback) {
    check_required_params(user_info, ['uid', 'iid'], 'buy');

    var params = generateParam("buy", user_info);

    // Check the user_info for illegal keys, etc?
    make_request(EVENTS_ENDPOINT.concat('.json'), 'POST', params, callback);
  };

  client.view = function (user_info, callback) {
    check_required_params(user_info, ['uid', 'iid'], 'buy');

    var params = generateParam("view", user_info);

    // Check the user_info for illegal keys, etc?
    make_request(EVENTS_ENDPOINT.concat('.json'), 'POST', params, callback);
  };

  function generateParam(request_name, user_info){
    var date = new Date();
    var date_string = getDate(date) + 'T' + getTime(date) + getTimezone(date);

    var params = {
      "event" : request_name,
      "entityType" : "user",
      "entityId" : user_info['uid'] + '',
      "targetEntityType" : "item",
      "targetEntityId" : user_info['iid'] + '',
      "eventTime" : date_string
    }

    console.log(params);

    return params;
  }

  function getTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var millis = date.getMilliseconds();
    hours = hours < 10 ? '0'+ hours : hours;
    minutes = minutes < 10 ? '0'+ minutes : minutes;
    seconds = seconds < 10 ? '0'+ seconds : seconds;
    millis = millis < 10 ? '00' + millis : (millis < 100 ? '0' + millis : millis);
    var strTime = hours + ':' + minutes + ':' + seconds + '.' + millis;
    return strTime;
  }

  function getDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = month < 10 ? '0'+ month : month;
    day = day < 10 ? '0'+ day : day;
    var strDate = year + '-' + month + '-' + day;
    return strDate;
  }

  function pad(number, length){
      var str = "" + number;
      while (str.length < length) {
          str = '0'+str;
      }
      return str;
  }

  function getTimezone(date){
    var offset = new Date().getTimezoneOffset()
    offset = ((offset<0? '+':'-')+ // Note the reversed sign!
              pad(parseInt(Math.abs(offset/60)), 2)+
              ':'+
              pad(Math.abs(offset%60), 2));
    return offset;
  }

  return client;
}

var ren_track;

function register(accessKey) {
  ren_track = predictionio(accessKey, {});
}

function event(event_name, uid, iid){
  if (typeof ren_track === 'undefined') {
    console.log("tracker not registered")
  } else {
    if(event_name === "buy"){
      console.log("buying " + uid + " " + iid);
      ren_track.buy({"uid":uid, "iid":iid}, function(){});
    } else if (event_name === "view"){
      console.log("viewing " + uid + " " + iid);
      ren_track.view({"uid":uid, "iid":iid}, function(){});
    } else {
      console.log("undefined event_name");
    }
  }
}

window.ren = window.ren || function() {
        (ren.q = ren.q || []).push(arguments);
      };

var qq = window.ren.q;

window.ren = function() {
  if(arguments[0] === "exec"){
    for (var i = 0; i < qq.length; i++) {
      console.log("command " + i + " " + qq[i][0]);
      var comd = qq[i];
      if(comd[0] == "register"){
        register(comd[1]);
      } else {
        event(comd[0], comd[1], comd[2]);
      }
    }
  } else{
    if(arguments[0] == "register"){
      register(arguments[1]);
    } else {
      event(arguments[0], arguments[1], arguments[2]);
    }
  }
}

ren("exec");