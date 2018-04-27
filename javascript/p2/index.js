window.onload=main;

var _msgbox;

function main()
{
    _msgbox=document.querySelector("#messages");

    setevents();
    getupdateMsgs();

    setInterval(()=>{
        getupdateMsgs();
    },15000);
}

function setevents()
{
    var namebar=document.querySelector("#name");
    var msgbar=document.querySelector("#message");

    var currentname=localStorage.getItem("currentname");
    if (currentname)
    {
        namebar.value=currentname;
    }

    document.querySelector(".clear-bt").addEventListener("click",(e)=>{
        e.preventDefault();

        msgbar.value="";

        msgbar.focus();
    });

    document.querySelector(".submit-bt").addEventListener("click",(e)=>{
        e.preventDefault();

        if (namebar.value=="" || msgbar.value=="")
        {
            namebar.focus();
            return;
        }

        if (checkValidMsg(namebar.value,msgbar.value))
        {
            shoutSend(namebar.value,msgbar.value,(data)=>{
                updateMsgs(data.data.reverse());
            });

            localStorage.setItem("currentname",namebar.value);
        }

        msgbar.value="";

        msgbar.focus();
    });
}

//callback(object)
function getMsgs(callback)
{
    var r=new XMLHttpRequest();
    r.open("GET","server/shout.php");

    r.onreadystatechange=()=>{
        if (r.readyState==4)
        {
            callback(JSON.parse(r.response));
        }
    };

    r.send();
}

//given name/msg and a callback, posts the message
//callback(object)
function shoutSend(name,msg,callback)
{
    var r=new XMLHttpRequest();
    r.open("POST","server/shout.php");

    r.onreadystatechange=()=>{
        if (r.readyState==4)
        {
            callback(JSON.parse(r.response));
        }
    };

    r.setRequestHeader("Content-type","application/x-www-form-urlencoded")
    r.send(`name=${encodeURI(name)}&message=${encodeURI(msg)}`);
}

//given a single message object, make html
function genMsg(msgdata)
{
    return `<div class="shout"><span class="timestamp">[${msgdata.time}]</span> <span class="name">${msgdata.name}</span>: <span>${msgdata.message}</span></div>`;
}

//get then update msg
function getupdateMsgs()
{
    getMsgs((msgs)=>{
        console.log(msgs);
        updateMsgs(msgs.data.reverse());

        setTimeout(()=>{
            console.log(_msgbox.scrollHeight);
            _msgbox.scrollTo(0,_msgbox.scrollHeight);
        },5);
    });
}

//given array of msg data, update the msg box
function updateMsgs(msgs)
{
    var msghtml="";
    for (var x=0,l=msgs.length;x<l;x++)
    {
        msghtml+=genMsg(msgs[x]);
    }

    _msgbox.innerHTML=msghtml;

    setTimeout(()=>{
        console.log(_msgbox.scrollHeight);
        _msgbox.scrollTo(0,_msgbox.scrollHeight);
    },5);
}

function checkValidMsg(name,msg)
{
    if (name.match(/\w|[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/) && msg.match(/\w|[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/))
    {
        return 1;
    }

    return 0;
}