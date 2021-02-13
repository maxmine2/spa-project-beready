var links = null;

var loaded = null;

var session = "-NoSession-";

var data =
{
    title: "",
    body: "",
    link: "",
    jscode:""
};

var page = 
{
    title: document.getElementById("title"),
    body: document.getElementById("body"),
    jscode: document.getElementById("jscode")
}



OnLoad();

function OnLoad()
{
    var href = window.location.pathname;
    InitializeLinks();
    LinkClick(href);
}

function InitializeLinks()
{
    links=document.getElementsByClassName("link-internal");

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
        for (var i = 0; i < readydata.length; i++) body += "<div class=''><a href='/text/" + readydata["text" + i]["id"] + "' class='link link-internal link-text'><p class='text-regular'>Text "+ readydata["text" + i]["id"] + ".</p><p class='texts-text-title'> " + readydata["text" + i]["text"] + "</p></a></div>"
        data = {
            title: 'All texts — BeReady',
            body: body,
            link: link,
            jscode: "",
        }
        UpdatePage();
    }
    else if (request_category == 'text') {
        SendRequest(request_category['title'].split('/')[1], request_category['title'].split('/')[2]);
        SendRequest(request_category['text'].split('/')[1], request_category['text'].split('/')[2]);
        SendRequest(request_category['js'].split('/')[1], request_category['js'].split('/')[2]);
    }

    else if (request_category == 'app') {
        SendRequest()
    }

}

function LoadData(param, response, link)
{
    if (param.substr(0, 4) == 'titl') data.title = response
    else if (param.substr(0, 4) == 'text') data.text = response
    else if (param.substr(length(param) - 4) == '.js') data.jscode = response;
    data.link = link;
    UpdatePage();
}

function UpdatePage()
{
    page.title.innerText = data.title;
    page.body.innerHTML = data.body;
    page.jscode.innerText = data.jscode;

    document.title = data.title;
    window.history.pushState(data.body, data.title, data.link);

    InitializeLinks();
    
}