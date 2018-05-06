window.onload=main;

var _filelist;

function main()
{
    _filelist=document.querySelector(".file-list");

    updatefilelist();
}

function testupload()
{
    var r=new XMLHttpRequest();
    r.open("POST","webp2.php");

    r.onreadystatechange=()=>{
        if (r.readyState==4)
        {
            console.log(r.response);
        }
    };

    var userfiles=document.querySelectorAll(".upload-zone .user-file");
    var uploadform=new FormData();
    for (var x=0;x<userfiles.length;x++)
    {
        if (userfiles[x].files[0])
        {
            uploadform.append(`file${x}`,userfiles[x].files[0]);
        }
    }

    r.send(uploadform);
}

function getfilelist(callback)
{
    var r=new XMLHttpRequest();
    r.open("GET","webp2.php");

    r.onreadystatechange=()=>{
        if (r.readyState==4)
        {
            callback(JSON.parse(r.response));
        }
    };

    r.send();
}

function updatefilelist()
{
    getfilelist((data)=>{
        console.log(data);

        for (var x=0,l=data.length;x<l;x++)
        {
            _filelist.appendChild(genfilelistentry(data[x]));
        }
    });
}

//give it single data entry from filelist
function genfilelistentry(data)
{
    var res=document.createElement("div");

    data.modtime=new Date(data.modtime*1000);
    data.modtime=`${data.modtime.toISOString().slice(0,10)} ${data.modtime.toTimeString().slice(0,8)}`;

    res.innerHTML=`<dl><dt>${data.name}</dt><dd>${data.size}</dd><dd class="type">${data.type}</dd><dd class="mod-time">${data.modtime}</dd><dd class="delete"><span>delete</span></dd></dl>`;
    return res.firstElementChild;
}