window.onload=main;

var _msgbox;

function main()
{
    _msgbox=document.querySelector("#messages");

    setevents();
    getupdateMsgs();
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

        shoutSend(namebar.value,msgbar.value,(data)=>{
            updateMsgs(data.data.reverse());
        });

        localStorage.setItem("currentname",namebar.value);
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
    _msgbox.scrollTo(0,_msgbox.scrollHeight);
}