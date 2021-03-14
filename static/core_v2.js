const { freeze } = require("core-js/fn/object");

var link = "";
var session = '-NoSession-';

function LinkClick(e) {
    e.preventDefault(); // Browser don't go to this page literally

    link = document.window.pathname;
    RunLoading(ParseLink(Link)) // Running process of loading new page
}

function ParseLink(href) {
    var props = href.split('/')
    if (props.length > 1) {
        props.shift();
    }
    return props;   
}

function RunLoading(props) {
    if (props.length > 1) {
        SendRequest('main', null)
    }
    
    switch (props[1]) {

        case "app": LoadAdminApp(props);
        case "text": LoadText(props[1]);
        case "internal": SendData(props);
    }
}

function LoadAdminApp(props) {
    SendData(props[1], null)
}

function uncorrectPassword() {
    document.getElementsById('#body').innerHTML = '<h2 class="psw-inc">Password is incorrect. Check again later</h2>' + document.getElementById();
}

function LoadText(props) {
    
}

function GetInfoJSON() {
if (first_param == 'app' || second_param == null)
     var result = {
        session: session
    };
}

function SendRequest(first_param, second_param) {
    var xhr = new XMLHttpRequest()
    if (first_param == 'text') xhr.open('GET', '/' + first_param, true);
    else if (first_param == 'text' || second_param != null) xhr.open('GET', '/' + first_param + '/' + second_param, true);
    else if (first_param == 'static') xhr.open('GET', second_param, true);
    else {
        alert("Something went wrong. Please, try again later.");
        console.log(xhr.status + ": " + xhr.statusText);
    }
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return; 

        if (xhr.status == 200)
            if (first_param == 'static') LoadData(first_param, second_param, xhr.responseText)
            else preprocessJSONData(first_param, second_param, xhr.responseText);
            
    };
    

}

function SendData(first_param, second_param) {
    var xhr = new XMLHttpRequest()

    if (first_param == 'app' || second_param == null) xhr.open('POST','/' + first_param, true);
    else if (first_param == 'internal' || second_param == 'login') xhr.open('POST', '/' + first_param + '/' + second_param);
    else if (first_param == 'internal' || second_param == 'addtext') xhr.open('POST', '/' + first_param + '/' + second_param);
    else {
        alert('Something went wrong. Please, try again later.');
        console.log(xhr.status + ":" + xhr.statusText);
    }

    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(GetInfoJSON()));
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return; 

        if (xhr.status == 200) 
            preprocessJSONData(first_param, second_param, xhr.responseText);
            
    };
    
}   

function preprocessJSONData(first_param, second_param, returnedData) {
    if (first_param == 'internal' || second_param == 'login') {
        var data = returnedData.toJSON();
        try {
            var problem = data["problem"];
            if (problem == "invalid_session") {
                session = "-NoSession-";
                SendData(first_param, second_param);
            }

            else if (problem == "login_failed") {
                if (data['reason'] == "psswrd-incorrect") uncorrectPassword();
            }
        }
        catch (err) {}
        
        if (data["is_logged_in"] == false) {
            try {
                session = data['new_session']
                SendData(first_param, second_param)
            }
            catch (err) {}
            
        }
        
    }
    else if (first_param == 'internal' || second_param == 'addtext') {
        var data = returnedData.toJSON();
        try {
            var problem = data["problem"]
            if (problem == "invalid_session") {
                session = '-NoSession-';
                SendData(first_param, second_param)
            }
        }

        catch (err) {}

        if (data['status'] == 'scs') {
            SendRequest('static', 'success.html')
        }
        
    }

    else if (first_param == 'app' || second_param == null) {
        var data = returnedData.toJSON()

        try {
            var problem = data["problem"];
            if (problem == "invalid_session") {
                session = "-NoSession-";
                SendData(first_param, second_param);
            }
        }
        
        catch (err) {}

        if (data['is_logged_in'] == true) {
            RunLoading(ParseLink(data['admin_page']))
        }
        
        else if (data['is_logged_in'] == false) {
            RunLoading(ParseLink(data['login_page']))
        }
    }
}

function LoadData(first_param, second_param, response) {
    
}