function register(e){ren_track=predictionio(e,{})}function event(e,n,t){"undefined"==typeof ren_track?console.log("tracker not registered"):"buy"===e?(console.log("buying "+n+" "+t),ren_track.buy({uid:n,iid:t},function(){})):"view"===e?(console.log("viewing "+n+" "+t),ren_track.view({uid:n,iid:t},function(){})):console.log("undefined event_name")}var predictionio=function(e,n){function t(e,n){var t=new Date,i=o(t)+"T"+r(t)+a(t),s={event:e,entityType:"user",entityId:n.uid+"",targetEntityType:"item",targetEntityId:n.iid+"",eventTime:i};return console.log(s),s}function r(e){var n=e.getHours(),t=e.getMinutes(),r=e.getSeconds(),o=e.getMilliseconds();n=10>n?"0"+n:n,t=10>t?"0"+t:t,r=10>r?"0"+r:r,o=10>o?"00"+o:100>o?"0"+o:o;var i=n+":"+t+":"+r+"."+o;return i}function o(e){var n=e.getFullYear(),t=e.getMonth()+1,r=e.getDate();t=10>t?"0"+t:t,r=10>r?"0"+r:r;var o=n+"-"+t+"-"+r;return o}function i(e,n){for(var t=""+e;t.length<n;)t="0"+t;return t}function a(e){var n=(new Date).getTimezoneOffset();return n=(0>n?"+":"-")+i(parseInt(Math.abs(n/60)),2)+":"+i(Math.abs(n%60),2)}var s,u={},c="http://localhost:8082/",f="events";if(!e)throw new Error("An app key is required to use the API.");s=e,"undefined"!=typeof n&&"undefined"!=typeof n.host&&(c=n.host);var d=function(e,n,t,r){var o=new XMLHttpRequest;if("undefined"!=typeof r?o.onreadystatechange=function(){if(4==o.readyState&&2==Math.floor(o.status/100)){var e=JSON.parse(o.responseText);r(e)}}:o.onreadystatechange=function(){if(4==o.readyState&&2==Math.floor(o.status/100)){var e=JSON.parse(o.responseText);console.log(e)}},"GET"===n)console.log("not implemented yet");else{if("POST"!==n)throw new Error("Invalid HTTP method: ".concat(n));var i=c.concat(e,"?","accessKey="+s);o.open(n,i),o.setRequestHeader("Content-type","application/json"),o.send(JSON.stringify(t))}},g=function(e,n,t){for(var r=[],o=0;o<n.length;o++)"undefined"==typeof e[n[o]]&&r.push(n[o]);if(r.length>0){var i=r.join(", ");throw new Error("The following required parameters for ".concat(t," are missing: ",i))}};return u.buy=function(e,n){g(e,["uid","iid"],"buy");var r=t("buy",e);d(f.concat(".json"),"POST",r,n)},u.view=function(e,n){g(e,["uid","iid"],"buy");var r=t("view",e);d(f.concat(".json"),"POST",r,n)},u},ren_track;window.ren=window.ren||function(){(ren.q=ren.q||[]).push(arguments)};var qq=window.ren.q;window.ren=function(){if("exec"===arguments[0])for(var e=0;e<qq.length;e++){console.log("command "+e+" "+qq[e][0]);var n=qq[e];"register"==n[0]?register(n[1]):event(n[0],n[1],n[2])}else"register"==arguments[0]?register(arguments[1]):event(arguments[0],arguments[1],arguments[2])},ren("exec");