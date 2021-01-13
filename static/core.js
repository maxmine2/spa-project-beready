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
            SendRequest('/app');
            break;
        }

        case "text": {
            if (props.length < 4) SendRequest('/text', -1);
            else if (props.length == 4) SendRequest('/text', props[3]);
            break;
        }

        case "internal": {
            if (props[2] == 'admin') SendData('admin',);
        }
    }
}