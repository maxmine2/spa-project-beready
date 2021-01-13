var links = null;

var loaded = null;

var session = "-NoSession-";

var data =
{
    title: "",
    body: "",
    jscode:"",
};

var page = 
{
    title: document.getElementById("title"),
    body: document.getElementById("body")
}

OnLoad();

function OnLoad()
{
    var href = window.location.pathname;
    LinkClick(href);
}

function InitializeLinks()
{
    links= document.getElementsByClassName("link-internal");

    for (var i = 0; i < links.length; i++)
    {
        links[i].addEventListener("click", function(e){
            e.preventDefault();
            LinkClick(e.targer.getAttribute("href"));
            return false;
        })
    }
}

function LinkClick(href)
{
    var props = href.split("/");

    switch (props[1])
    {
        case "app": {
            SendRequest('/app', -1);
            break;
        }


        case "text": {
            if (props.length < 4) SendRequest('/text', -1);
            else if (props.length == 4) SendRequest('/text', props[3]);
            break;
        }

        case "internal": {
            if (props[2] == 'addtext') SendData('addtext');
            if (props[2] == 'login') SendData('login');
        }
    }
}

function SendRequest(query, param)
{
    var xhr = new XMLHttpRequest();
    if (param == -1) xhr.open('GET', query, true)
    else xhr.open('GET', query + '/' + param)

    xhr.onreadystatechange = function() 
    {
        if (xhr.readyState != 4) return;

        loaded = true;

        if (xhr.Status == 200)
            if (query == 'text' || param == -1) preprocessJSONData('texts', xhr.responseText, link, -1)
            else if (query == 'text') preprocessJSONData('text', xhr.responseText, link, param)
            else if (query == 'app') preprocessJSONData('app', xhr.responseText, link, -1)
            
            else if (query == 'static') LoadData(param, xhr.responseText, link)
        else 
        {
            alert("Loading error! Please, go to the main page and try again later.");
            console.log(xhr.status + ":" + xhr.statusText);
        }
    }

    loaded = false;

    setTimeout(ShowLoading, 2000);
    xhr.send();
}

function preprocessJSONData(request_category, response, link, param)
{
    var readydata = JSON.parse(response);
    if (request_category == 'texts') {
        body = "<h1>All texts</h1>\n"
        for (var i = 0; i < readydata.length; i++) body += "<a href='/text/" + readydata["text" + i][id] + "' class='link link-internal'><p class='text-regular'>Text "+ readydata["text" + i][id] + "</p><p class='text-title'> "
    }
        
}