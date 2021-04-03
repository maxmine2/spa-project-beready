var link = "";
var session = '-NoSession-';

InitLinks();

function LinkClick(link) {
    RunLoading(ParseLink(link)) // Running process of loading new page
}

function InitLinks()
{
    links = document.getElementsByClassName("link-internal");

    for (var i = 0; i < links.length; i++)
    {
        links[i].addEventListener("click", function(e){
            e.preventDefault();
            console.log(e.target);
            LinkClick(e.target.getAttribute('href'));
            return false;
        })
    }
}

function ParseLink(href) {
    var props = href.split('/')
    if (props.length > 1) {
        props.shift();
    }
    return props;   
}

function RunLoading(props) {
    console.log('geg');
    if (props.length == 0) {
        SendRequest('main', null)   
    }
    console.log(props);
    console.log('calling switch');
    switch (props[0]) {
        case "app": {
            console.log('calling LoadAdminApp');
            LoadAdminApp(props);
            break;}
        case "text":
            if (props.length == 1) LoadText(props[0], null);
            else LoadText(props[0], props[1]);
            break;
        case "internal": 
            SendData(props[0], props[1]);
            break;
        case "static": {
            console.warn('It is not that I want.')
            SendRequest(props[0], props[1])};
            break;
    }
    console.warn('gjaj');
    
}

function LoadAdminApp(props) {
    console.log('Loading through SendData()');
    SendData(props[0], null);
}

function uncorrectPassword() {
    document.getElementsById('body').innerHTML = '<h2 class="psw-inc">Password is incorrect. Check again later</h2>' + document.getElementById();
}

function LoadText(first_param, second_param) {
    if (first_param == 'text') {
        SendRequest(first_param, second_param)
    }
    else {
        SendData(first_param, second_param)
    }
}

function GetInfoJSON(first_param, second_param) {
    if (first_param == 'app' && second_param == null)
        var result = {
            session: session
        };
    else if (first_param == 'internal' && second_param == 'addtext')
        var result = {
            session: session,
            text_name: document.getElementById('new-text-name').value.replace('&', ''),
            text: {
                title: document.getElementById('new-text-title').value.replace('&', ''),
                text: document.getElementById('new-text-text').value.replace('&', ''),
                js: document.getElementById('new-text-js').value.replace('&', '')
            }
        }

    else if (first_param == 'internal' && second_param == 'login')
        var result = {
            session: session,
            psswrd: document.getElementById('login-passw').value
        }
    alert(['Info:', first_param, second_param, JSON.stringify(result)].join(' '));

    return result;
}

function SendRequest(first_param, second_param) {
    var xhr = new XMLHttpRequest()
    console.info(first_param, second_param);
    console.warn(second_param != null);
    if (first_param == 'text' && second_param != null) xhr.open('GET', '/' + first_param + '/' + second_param, true);
    else if (first_param == 'text' && second_param == null) xhr.open('GET', '/' + first_param, true);
    else if (first_param == 'static') xhr.open('GET', '/static/' + second_param, true);
    else {
        alert("Something went wrong. Please, try again later4.");
        console.log(xhr.status + ": " + xhr.statusText);
        console.log(first_param, " ", second_param);
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
    console.info(first_param, second_param)
    if (first_param == 'app' && second_param == null) xhr.open('POST','/' + first_param, true);
    else if (first_param == 'internal' && second_param == 'login') xhr.open('POST', '/' + first_param + '/' + second_param);
    else if (first_param == 'internal' && second_param == 'addtext') xhr.open('POST', '/' + first_param + '/' + second_param);
    else {
        alert('Something went wrong. Please, try again later.');
        console.log(xhr.status + ":" + xhr.statusText);
    }

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send('json=' + JSON.stringify(GetInfoJSON(first_param, second_param)));
    console.log('xhr')
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return; 
        console.log(xhr.status)
        if (xhr.status == 200){
            preprocessJSONData(first_param, second_param, xhr.responseText);
        }            
    };
    
}   

function preprocessJSONData(first_param, second_param, returnedData) {
    alert('Returned data is ' + returnedData);
    alert('Second param is ' + second_param);
    var data = JSON.parse(returnedData);
    if (first_param == 'internal' && second_param == 'login') {
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
        else if (data['is_logged_in']) {
            console.warn(JSON.stringify(data));
            RunLoading(ParseLink(data['app_page']));
        }
        
    }
    else if (first_param == 'internal' && second_param == 'addtext') {
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

    else if (first_param == 'app' && second_param == null) {

        try {
            var problem = data["problem"];
            if (problem == "invalid_session") {
                session = "-NoSession-";
                SendData(first_param, second_param);
            }
        }
        
        catch (err) {}

        if (data['is_logged_in']) {
            RunLoading(ParseLink(data['app_page']));
        }
        
        else if (data['is_logged_in'] == false) {
            RunLoading(ParseLink(data['login_page']));
        }
    }

    else if (first_param == 'static') {
        LoadData(first_param, second_param, returnedData)
    }

    else if (first_param == 'text' && second_param != null) {
        let data = JSON.parse(returnedData);
        RunLoading(ParseLink(data['title']));
        RunLoading(ParseLink(data['text']));
        RunLoading(ParseLink(data['js']));
    }

    else if (first_param == 'text') {
        var info = "<div class='texts'>\n";
        alert(data['texts']);
        if (data["texts"] != '') 
            for (var i = 0; i < data["texts"].length; i++) {
                var d = data["texts"][i];
                alert("d is {d}, data is " + JSON.stringify(data))
                info += "<div class='inline-block'>\n<a class='link link-internal' href='/text/" + d['id'] + "'>" + d["title"] + "</a>" + "</div>\n";
            }
        else {
            console.warn('notexts');
            info += "<h4 class='notexts'>No texts here</h4>";
        }
        info += '</div>';
        LoadData(first_param, second_param, info);
    }
}

function LoadData(first_param, second_param, response) {
    alert(second_param);
    console.log(response);
    console.log(second_param);
    if (first_param == 'text' && second_param == null) {
        document.getElementById('header').innerHTML = "<div class='header-container header-animation'>\n<h1 class='header-h1 header-animation'>All Texts</h1>\n</div>";
        document.getElementById('main').innerHTML = response;
        InitLinks();
    }
    else if (first_param == 'static' && second_param.slice(-3) == '.js') {
        document.getElementById('jscode').innerHTML = response;
        InitLinks();
    }
    else if (first_param == 'static' && second_param.slice(0, 6) == 'title_') {
        console.log('static title');
        document.getElementById('header').innerHTML = response;
        InitLinks();
    }
    else if (first_param == 'static' && second_param.slice(0, 5) == 'text_') {
        console.log('static text')
        document.getElementById('main').innerHTML = response;
        InitLinks();
    }
    else if (first_param == 'static' && second_param == 'app.html') {
        document.getElementById('main').innerHTML = response;
        document.getElementById('header').innerHTML = "<div class='header-container header-animation'>\n<h1 class='header-h1 header-animation'>Add Text</h1>\n</div>";
        InitLinks();
    }
    else if (first_param == 'static' && second_param == 'login.html') {
        document.getElementById("main").innerHTML = response;
        document.getElementById('header').innerHTML = "<div class='header-container header-animation'>\n<h1 class='header-h1 header-animation'>Log in to get access to texts</h1>\n</div>";
        InitLinks();
    }
    else if (first_param == 'static' && second_param == 'success.html') {
        document.getElementById('main').innerHTML = response;
        document.getElementById('header').innerHTML = "<div class='header-container header-animation'>\n<h1 class='header-h1 header-animation'>Success</h1></div>";
        InitLinks();
    }
    else {
        alert('Something went wrong. Try reload this page.');
        console.warn([first_param, second_param, response].join(' '));
    }
    
}