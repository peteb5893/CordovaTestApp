/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        

    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');

        // Global variables
        var mp3 = '/sounds/siren.mp3';
        var media;
        var localStorage = window.localStorage;
        var databaseRecordId = 0;
        var _api_url = "http://10.1.1.52:3000/readings"; // peter's api
        //var _api_url = "http://10.1.1.12:85/api/values"; // david's api

        if (localStorage.getItem("lastDatabaseRecordId") === null) {
            localStorage.setItem("lastDatabaseRecordId",JSON.stringify(databaseRecordId));
            console.log("Set lastDatabaseRecordId = " + databaseRecordId);
        }else{
            databaseRecordId = parseInt(JSON.parse(localStorage.getItem("lastDatabaseRecordId")));
        }                      

        // Add event listeners here in onDeviceReady
        document.addEventListener("offline", onOffline, false);
        document.addEventListener("online", onOnline, false);

        document.getElementById("runBackgroundTask").addEventListener("click",runBackgroundTask);

        document.getElementById("getJson").addEventListener("click",getJSON);
        document.getElementById("postJson").addEventListener("click",postJSON);
        document.getElementById("putJson").addEventListener("click",putJSON);
        document.getElementById("patchJson").addEventListener("click",patchJSON);
        // document.getElementById("deleteJson").addEventListener("click",deleteJSON);

        document.getElementById("openBrowser").addEventListener("click", openBrowser);
        document.getElementById("getJSONData").addEventListener("click",getJSONData);
        document.getElementById("showDeviceInfo").addEventListener("click",showDeviceInfo);
        document.getElementById("playSound").addEventListener("click",playSound);
        document.getElementById("stopSound").addEventListener("click",stopSound);
        document.getElementById("dialogAlert").addEventListener("click", dialogAlert);
        document.getElementById("dialogConfirm").addEventListener("click", dialogConfirm);
        document.getElementById("dialogPrompt").addEventListener("click", dialogPrompt);
        document.getElementById("dialogBeep").addEventListener("click", dialogBeep);    
        document.getElementById("getPosition").addEventListener("click", getPosition);
        document.getElementById("watchPosition").addEventListener("click", watchPosition);  
        document.getElementById("getLanguage").addEventListener("click", getLanguage);
        document.getElementById("getLocaleName").addEventListener("click", getLocaleName);
        document.getElementById("getDate").addEventListener("click", getDate);
        document.getElementById("getCurrency").addEventListener("click", getCurrency);
        document.getElementById("setLocalStorage").addEventListener("click", setLocalStorage); 
        document.getElementById("showLocalStorage").addEventListener("click", showLocalStorage); 
        document.getElementById("getLocalStorageByKey").addEventListener ("click", getLocalStorageByKey);  
        document.getElementById("networkInfo").addEventListener("click", networkInfo);
        document.getElementById("vibration").addEventListener("click", vibration);
        document.getElementById("vibrationPattern").addEventListener("click", vibrationPattern);
        
        // for processes running in background
        cordova.plugins.backgroundMode.enable();
        console.log("Cordova BackgroundMode Enabled: " + cordova.plugins.backgroundMode.isActive());
        cordova.plugins.backgroundMode.on('enable', runBackgroundTask());

        // check local notifications permissions
        cordova.plugins.notification.local.hasPermission(function (granted) {
            console.log('Permission granted: ' + granted);
        });

        // Write functions here

        function setLocalStorage() { 
           alert("Store data in LocalStorage" + 
                  "\nfirstname: John," + 
                  "\nsurname: Smith," + 
                  "\ncompany: Matrix Inc," +
                  "\ntelephone: 01234567890," + 
                  "\nemail: johnsmith@matrixinc.com"); 
           localStorage.setItem("name", "John"); 
           localStorage.setItem("surname", "Smith");  
           localStorage.setItem("company", "Matrix Inc");  
           localStorage.setItem("telephone", "01234567890");  
           localStorage.setItem("email", "johnsmith@matrixinc.com");  
        } 

        function showLocalStorage() { 
           
           alert("Store data in LocalStorage" + 
                  "\nfirstname: " + localStorage.getItem("name") +"," + 
                  "\nsurname: " + localStorage.getItem("surname") +"," + 
                  "\ncompany: " + localStorage.getItem("company") +"," +
                  "\ntelephone: " + localStorage.getItem("telephone") +"," + 
                  "\nemail: " + localStorage.getItem("email"));

           console.log(localStorage.getItem("name")); 
           console.log(localStorage.getItem("surname")); 
           console.log(localStorage.getItem("company")); 
           console.log(localStorage.getItem("telephone")); 
           console.log(localStorage.getItem("email")); 
        }   

        function removeCompanyFromLocalStorage() {
           alert("Removed company from local storage");
            localStorage.removeItem("company");
        }

        function getLocalStorageByKey() {
           alert("Get local storage by key (0) / first in the list. key 0 = " + localStorage.key(0));
           console.log(localStorage.key(0));
        }

        
        // https://www.tutorialspoint.com/cordova/cordova_inappbrowser.htm
        function openBrowser() {
           var url = 'https://cordova.apache.org';
           var target = '_blank';
           var options = "location = yes"
           var ref = cordova.InAppBrowser.open(url, target, options);
           
           ref.addEventListener('loadstart', loadstartCallback);
           ref.addEventListener('loadstop', loadstopCallback);
           ref.addEventListener('loadloaderror', loaderrorCallback);
           ref.addEventListener('exit', exitCallback);

           function loadstartCallback(event) {
              console.log('Loading started: '  + event.url)
           }

           function loadstopCallback(event) {
              console.log('Loading finished: ' + event.url)
           }

           function loaderrorCallback(error) {
              console.log('Loading error: ' + error.message)
           }

           function exitCallback() {
              console.log('Browser is closed...')
           }
        }

        function showDeviceInfo() {
            console.log("Cordova: " + device.cordova);
            console.log("Model: " + device.model);
            console.log("Platform: " + device.platform);
            console.log("UUID: " + device.uuid);
            console.log("Version: " + device.version);
            console.log("Manufacturer: " + device.manufacturer);
            console.log("isVirtual: " + device.isVirtual);
            console.log("Serial: " + device.Serial);

        }


        // https://www.tutorialspoint.com/cordova/cordova_media.htm
        function playSound() {
            // source: http://www.freesfx.co.uk/rx2/mp3s/5/16928_1461333031.mp3

            media = new Media(mp3, function() {
                console.log('[media] Success');
            }, function(err) {
                console.log('[media error]', err);  
            }, function(s) {
                /*
                Media.MEDIA_NONE = 0;
                Media.MEDIA_STARTING = 1;
                Media.MEDIA_RUNNING = 2;
                Media.MEDIA_PAUSED = 3;
                Media.MEDIA_STOPPED = 4;
                */
                console.log('[media status]', s);       
            });

            setTimeout(function() {
                console.log('[media] Duration is '+media.getDuration());
            },100);

            media.play();
        }

        function stopSound() {
            media.stop();
        }


        function httpGetAsync(theUrl, callback)
        {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function() { 
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                    callback(xmlHttp.responseText);
            }
            xmlHttp.open("GET", theUrl, true); // true for asynchronous 
            xmlHttp.send(null);
        }

        function httpPostAsync(theUrl,params,callback)
        {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("POST", theUrl, true); // true for asynchronous             

            //Send the proper header information along with the request
            xmlHttp.setRequestHeader("Content-type", "application/json");

            xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
            }

            xmlHttp.send(params);
        }

        // show notification
        function showNotification(){            
            console.log("Show Notification");
            cordova.plugins.notification.local.schedule({
                title: 'My first notification',
                text: 'Thats pretty easy...'
            });
        }

        // for when app is in background or closed completely ( after 10 seconds)
        function runBackgroundTask(){
            setTimeout(function(){
                console.log("background task run at " + new Date().toUTCString());
                showNotification();
                // postJSON();
                // console.log("should have updated the db.json file from the background");
            },30000);
            console.log("background task will run 30 seconds from now " + new Date().toUTCString());
        }




        //======== JSON Methods =============
        function getJSON(){
            console.log("GET");

            var api_url = _api_url; 
            httpGetAsync(api_url,function(resp){
                console.log(resp);
                console.log("data returned successfully");
            })
        }

        function postJSON(){
            console.log("POST"); 
            var api_url = _api_url;            
            if (localStorage.getItem("lastDatabaseRecordId") === null) {
                localStorage.setItem("lastDatabaseRecordId",JSON.stringify(databaseRecordId));
                console.log("Set lastDatabaseRecordId = " + databaseRecordId);
            }else{
                databaseRecordId = parseInt(JSON.parse(localStorage.getItem("lastDatabaseRecordId")));
            } 
            var newId = databaseRecordId.toString();            
            var params = {
                "id": newId,
                "meter_serial_no": newId,
                "import_read": "import_read_value_"+newId,
                "export_value":"export_value_"+newId,
                "account_balance": Math.floor(Math.random() * 100).toString() + "." + Math.floor(Math.random() * 100).toString(),
                "extraction_datetime" : new Date().toUTCString()
            }
            httpPostAsync(api_url,JSON.stringify(params),function(resp){
                console.log(resp);                                
            })
            console.log(JSON.stringify(params));
            console.log("data posted successfully");
            databaseRecordId++;
            localStorage.setItem("lastDatabaseRecordId",databaseRecordId);           
        }

        function patchJSON(){
            console.log("PATCH");         
        }

        function putJSON(){
            console.log("PUT");            
        }

        function deleteJSON(){
            console.log("DELETE");            
        }

        // =================================
        function getJSONData() {
            
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://localhost:3000/employees');
            xhr.onload = function() {
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                }
                else {
                    console.log('Request failed.  Returned status of ' + xhr.status);
                }
            };
            xhr.send();
        }

        function dialogAlert() {
           var message = "I am Alert Dialog!";
           var title = "ALERT";
           var buttonName = "Alert Button";
           navigator.notification.alert(message, alertCallback, title, buttonName);
           
           function alertCallback() {
              console.log("Alert is Dismissed!");
           }
        }

        function dialogConfirm() {
           var message = "Am I Confirm Dialog?";
           var title = "CONFIRM";
           var buttonLabels = "YES,NO";
           navigator.notification.confirm(message, confirmCallback, title, buttonLabels);

           function confirmCallback(buttonIndex) {
              console.log("You clicked " + buttonIndex + " button!");
           }  
        }

        function dialogPrompt() {
           var message = "Am I Prompt Dialog?";
           var title = "PROMPT";
           var buttonLabels = ["YES","NO"];
           var defaultText = "Default"
           navigator.notification.prompt(message, promptCallback, 
              title, buttonLabels, defaultText);

           function promptCallback(result) {
              console.log("You clicked " + result.buttonIndex + " button! \n" + 
                 "You entered " +  result.input1);
           }
        }

        function dialogBeep() {
           var times = 1;
           navigator.notification.beep(times);
        }

        function getPosition() {
           var options = {
              enableHighAccuracy: true,
              maximumAge: 3600000
           }
           var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

           function onSuccess(position) {
              alert('Latitude: '          + position.coords.latitude          + '\n' +
                 'Longitude: '         + position.coords.longitude         + '\n' +
                 'Altitude: '          + position.coords.altitude          + '\n' +
                 'Accuracy: '          + position.coords.accuracy          + '\n' +
                 'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                 'Heading: '           + position.coords.heading           + '\n' +
                 'Speed: '             + position.coords.speed             + '\n' +
                 'Timestamp: '         + position.timestamp                + '\n');
           };

           function onError(error) {
              alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
           }
        }

        function watchPosition() {
           var options = {
              maximumAge: 3600000,
              timeout: 3000,
              enableHighAccuracy: true,
           }
           var watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);

           function onSuccess(position) {
              alert('Latitude: '          + position.coords.latitude          + '\n' +
                 'Longitude: '         + position.coords.longitude         + '\n' +
                 'Altitude: '          + position.coords.altitude          + '\n' +
                 'Accuracy: '          + position.coords.accuracy          + '\n' +
                 'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                 'Heading: '           + position.coords.heading           + '\n' +
                 'Speed: '             + position.coords.speed             + '\n' +
                 'Timestamp: '         + position.timestamp                + '\n');
           };

           function onError(error) {
              alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
           }
        }

        function getLanguage() {
           navigator.globalization.getPreferredLanguage(onSuccess, onError);

           function onSuccess(language) {
              alert('language: ' + language.value + '\n');
           }

           function onError(){
              alert('Error getting language');
           }
        }

        function getLocaleName() {
           navigator.globalization.getLocaleName(onSuccess, onError);

           function onSuccess(locale) {
              alert('locale: ' + locale.value);
           }

           function onError(){
              alert('Error getting locale');
           }
        }

        function getDate() {
           var date = new Date();

           var options = {
              formatLength:'short',
              selector:'date and time'
           }
           navigator.globalization.dateToString(date, onSuccess, onError, options);

           function onSuccess(date) {
              alert('date: ' + date.value);
           }

           function onError(){
              alert('Error getting dateString');
           }
        }

        function getCurrency() {
           var currencyCode = 'EUR';
           navigator.globalization.getCurrencyPattern(currencyCode, onSuccess, onError);

           function onSuccess(pattern) {
              alert('pattern: '  + pattern.pattern  + '\n' +
                 'code: '     + pattern.code     + '\n' +
                 'fraction: ' + pattern.fraction + '\n' +
                 'rounding: ' + pattern.rounding + '\n' +
                 'decimal: '  + pattern.decimal  + '\n' +
                 'grouping: ' + pattern.grouping);
           }

           function onError(){
              alert('Error getting pattern');
           }
        }

        function networkInfo() {
           var networkState = navigator.connection.type;
           var states = {};
            
           states[Connection.UNKNOWN]  = 'Unknown connection';
           states[Connection.ETHERNET] = 'Ethernet connection';
           states[Connection.WIFI]     = 'WiFi connection';
           states[Connection.CELL_2G]  = 'Cell 2G connection';
           states[Connection.CELL_3G]  = 'Cell 3G connection';
           states[Connection.CELL_4G]  = 'Cell 4G connection';
           states[Connection.CELL]     = 'Cell generic connection';
           states[Connection.NONE]     = 'No network connection';

           alert('Connection type: ' + states[networkState]);
        }

        function onOffline() {
           alert('You are now offline!');
        }

        function onOnline() {
           alert('You are now online!');
        }

        function vibration() {
           var time = 3000;
           navigator.vibrate(time);
        }

        function vibrationPattern() {
           var pattern = [1000, 1000, 1000, 1000];
           navigator.vibrate(pattern);
        }

        // end of deviceReady
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();