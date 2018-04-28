window.onload=main;

var _map;
var _sidebararticles;
var _currentopenarticle;

function main()
{
    _sidebararticles=document.querySelector(".articles");
    // _map=L.map("mapid").setView([51.505, -0.09], 13);
    _map=L.map("mapid").setView([57.22685714755715,18.37497711181641],12);

    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiaG15a2FuYWUiLCJhIjoiY2pnaWVlZWtrMDBvdzMzcXU3NTh1dzZqOSJ9.uC6teVGtYf5YkPCgrFB9oQ'
    }).addTo(_map);

    _map.on("zoom",(e)=>{
        getcurrentviewinfo();
    });

    _map.on("moveend",(e)=>{
        getcurrentviewinfo();
    });

    getcurrentviewinfo();
}

function getwiki(lat,long,rad,callback)
{
    var r=new XMLHttpRequest();
    r.open("GET",`server/wiki.php?lat=${lat}&long=${long}&rad=${rad}`);

    r.onreadystatechange=()=>{
        if (r.readyState==4)
        {
            callback(JSON.parse(r.response));
        }
    };

    r.send();
}

var _currentmarkers;
function getcurrentviewinfo()
{
    var centre=_map.getCenter();
    getwiki(
        centre.lat,
        centre.lng,
        _map.distance(_map.getBounds()._northEast,centre),
        (data)=>{
            if (_currentmarkers)
            {
                var markers=_currentmarkers._layers;

                for (var x in markers)
                {
                    _sidebararticles.removeChild(markers[x].article);
                }

                _map.removeLayer(_currentmarkers);
                _currentmarkers=null;
            }

            if (!(data.query && data.query.pages))
            {
                console.log("no articles");
                console.log(data);
                return;
            }

            data=data.query.pages;

            _currentmarkers=L.featureGroup().addTo(_map);

            var newmarker;
            var newarticle;
            for (var x in data)
            {
                if (!data[x].thumbnail)
                {
                    data[x].thumbnail={source:null};
                }

                if (!data[x].extract)
                {
                    data[x].extract="";
                }

                newmarker=L.marker([data[x].coordinates[0].lat,data[x].coordinates[0].lon])
                    .bindPopup(genpopup(data[x].canonicalurl,data[x].title,data[x].thumbnail.source)).addTo(_currentmarkers);

                newarticle=genarticleelement(data[x].canonicalurl,data[x].title,data[x].extract);

                newmarker.article=newarticle;

                _sidebararticles.insertAdjacentElement("beforeend",newarticle);
            }

            _currentmarkers.on("click",(e)=>{
                if (_currentopenarticle)
                {
                    _currentopenarticle.classList.remove("selected");
                }

                e.layer.article.classList.add("selected");

                _currentopenarticle=e.layer.article;
                _currentopenarticle.scrollIntoView();
            });
        }
    );
}

function genpopup(link,name,img)
{
    if (!img)
    {
        img="";
    }

    else
    {
        img=`<img src="${img}"></div>`;
    }

    //from popup-gen.html
    return `<div class="popup"><a href="${link}" target="_blank">${name}</a>${img}`;
}

// function genarticle(link,title,info)
// {
//     //from article-gen.html
//     return `<div class="article collapse"><h3 class="title">${title}</h3><div class="info">${info}</div><a href="${link}" target="_blank">wikipedia article</a></div>`;
// }

function genarticleelement(link,title,info)
{
    var res=document.createElement("div");
    res.innerHTML=`<div class="article"><h3 class="title">${title}</h3><div class="info">${info}</div><a href="${link}" target="_blank">wikipedia article</a></div>`;

    return res.firstChild;
}