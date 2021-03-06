window.onload=main;

var _filelist;

var _fileinputs;
var _inputcounter;

/* sortmode:
   0:name,1:size,2:type,3:modtime
   order:
   0:descending,1:ascending*/
var _sortstate={sortmode:0,order:0};

var _currentsortcol;

function main()
{
    _filelist=document.querySelector(".file-list span");
    _fileinputs=document.querySelector(".file-inputs");
    _inputcounter=document.querySelector(".filecount");

    updatefilelist();
    setupuploadzone();
    setupsorts();
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

    r.setRequestHeader("sortstate",JSON.stringify(_sortstate));
    r.send();
}

function updatefilelist()
{
    getfilelist((data)=>{
        // console.log(data);

        _filelist.innerHTML="";
        for (var x=0,l=data.length;x<l;x++)
        {
            _filelist.appendChild(genfilelistentry(data[x]));
        }
    });
}

function deleteid(id,callback)
{
    var r=new XMLHttpRequest();
    r.open("POST","webp2.php");

    // r.onreadystatechange=()=>{
    //     if (r.readyState==4)
    //     {
    //         try
    //         {
    //             callback(JSON.parse(r.response));
    //         }

    //         catch (err)
    //         {
    //             console.log(r.response);
    //         }
    //     }
    // };

    r.setRequestHeader("method","delete");
    r.send(id);
}

//give it single data entry from filelist
function genfilelistentry(data)
{
    var res=document.createElement("div");

    data.modtime=new Date(data.modtime*1000);
    data.modtime=`${data.modtime.toISOString().slice(0,10)} ${data.modtime.toTimeString().slice(0,8)}`;

    // res.innerHTML=`<dl><dt>${data.name}</dt><dd>${data.size}</dd><dd class="type">${data.type}</dd><dd class="mod-time">${data.modtime}</dd><dd class="delete"><span>delete</span></dd></dl>`;
    res.innerHTML=`<a href="webp2.php?fileget=${data.id}"><dl><dt>${data.name}</dt><dd>${data.size}</dd><dd class="type">${data.type}</dd><dd class="mod-time">${data.modtime}</dd><dd class="delete"><span>delete</span></dd></dl></a>`;

    var deletebutton=res.firstChild.querySelector(".delete span");

    deletebutton.fileid=data.id;

    deletebutton.addEventListener("click",(e)=>{
        e.preventDefault();

        deleteid(e.currentTarget.fileid);

        _filelist.removeChild(e.currentTarget.parentElement.parentElement.parentElement);
    });

    return res.firstChild;
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
        var liveinputs=[];

        var uploadform=new FormData();
        for (var x=0;x<inputs.length;x++)
        {
            if (!inputs[x].value)
            {
                continue;
            }

            uploadform.append(`file${x}`,inputs[x].files[0]);
            liveinputs.push(inputs[x]);
        }

        uploadformdata(uploadform,(res)=>{
            console.log(res);

            _inputcounter.innerText=`${inputs.length-liveinputs.length}/5`;

            for (var x=0;x<res.length;x++)
            {
                liveinputs[x].insertAdjacentHTML("afterend",genuploadstatus(res[x],liveinputs[x].files[0].name));
                _fileinputs.removeChild(liveinputs[x]);
            }

            updatefilelist();
        });
    });
}

function genuploadstatus(response,filename="")
{
    if (filename.length>15)
    {
        filename=filename.slice(0,15)+"...";
    }

    var statusstring;
    var statusclass;
    switch (response.status)
    {
        case "uploaded":
            statusstring=`${filename} uploaded.`;
            statusclass="succ";
            break;

        case "invalidtype":
            statusstring=`${filename} type is not allowed`;
            statusclass="fail";
            break;

        case "invalidsize":
            statusstring=`${filename} is an invalid size`;
            statusclass="fail";
            break;

        default:
            statusstring=`(${filename}) unknown status.`;
            statusclass="fail";
    }

    return `<div class="upload-statusbox ${statusclass}">${statusstring}</div>`;
}

function setupsorts()
{
    var tablelabel=document.querySelector(".table-label");

    _currentsortcol=tablelabel.children[0];
    for (var x=0;x<4;x++)
    {
        tablelabel.children[x].sortstate=x;

        tablelabel.children[x].addEventListener("click",(e)=>{
            if (_sortstate.sortmode==e.currentTarget.sortstate)
            {
                if (_sortstate.order>0)
                {
                    _sortstate.order=0;
                    tablelabel.classList.remove("orderup");
                }

                else
                {
                    _sortstate.order=1;
                    tablelabel.classList.add("orderup");
                }
            }

            _sortstate.sortmode=e.currentTarget.sortstate;

            _currentsortcol.classList.remove("selected");
            e.currentTarget.classList.add("selected");
            _currentsortcol=e.currentTarget;

            updatefilelist();
        });
    }
}