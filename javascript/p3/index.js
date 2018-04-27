window.onload=main;

var _map;

function main()
{
    _map=L.map("mapid").setView([51.505, -0.09], 13);

    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiaG15a2FuYWUiLCJhIjoiY2pnaWVlZWtrMDBvdzMzcXU3NTh1dzZqOSJ9.uC6teVGtYf5YkPCgrFB9oQ'
    }).addTo(_map);
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
            data=data.query.pages;
            if (!data)
            {
                return;
            }

            if (_currentmarkers)
            {
                _map.removeLayer(_currentmarkers);
            }

            _currentmarkers=L.layerGroup().addTo(_map);

            for (var x in data)
            {
                L.marker([data[x].coordinates[0].lat,data[x].coordinates[0].lon]).addTo(_currentmarkers);
            }
        }
    );
}