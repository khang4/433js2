window.onload=main;

var _filelist;

var _fileinputs;
var _inputcounter;

function main()
{
    _filelist=document.querySelector(".file-list");
    _fileinputs=document.querySelector(".file-inputs");
    _inputcounter=document.querySelector(".filecount");

    updatefilelist();
    setupuploadzone();
}

//give it form data of files, callback(object response) from serverside
function uploadformdata(formdata,callback)
{
    var r=new XMLHttpRequest();
    r.open("POST","webp2.php");

    r.onreadystatechange=()=>{
        if (r.readyState==4)
        {
            try
            {
                callback(JSON.parse(r.response));
            }

            catch (err)
            {
                console.log(r.response);
            }
        }
    };

    r.setRequestHeader("method","upload");
    r.send(formdata);
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
        // console.log(data);

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


function setupuploadzone()
{
    document.querySelector(".actual.add-file").addEventListener("click",(e)=>{
        var inputs=_fileinputs.querySelectorAll("input");

        var foundempty=0;
        for (var x=0;x<inputs.length;x++)
        {
            if (!inputs[x].value)
            {
                //if already found an empty input, delete all other empty inputs
                if (foundempty>0)
                {
                    _fileinputs.removeChild(inputs[x]);
                }

                foundempty++;
            }
        }

        if (inputs.length>=5 && foundempty==0)
        {
            foundempty=1;
        }

        _inputcounter.innerText=`${(inputs.length+1)-foundempty}/5`;

        if (inputs.length>=5)
        {
            return;
        }

        //if have not found an empty input, add it
        if (!foundempty)
        {
            _fileinputs.insertAdjacentHTML("beforeend",`<input class="user-file" type="file">`);
        }
    });

    document.querySelector(".upload-button").addEventListener("click",(e)=>{
        var inputs=_fileinputs.querySelectorAll("input");

        var uploadform=new FormData();
        for (var x=0;x<inputs.length;x++)
        {
            if (!inputs[x].value)
            {
                continue;
            }

            uploadform.append(`file${x}`,inputs[x].files[0]);
        }

        uploadformdata(uploadform,(res)=>{
            console.log(res);
        });
    });
}