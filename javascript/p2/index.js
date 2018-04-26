window.onload=main;

function main()
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
            console.log("hey");
            namebar.focus();
            return;
        }

        localStorage.setItem("currentname",namebar.value);
        msgbar.value="";

        msgbar.focus();
    });
}

function testget()
{
    var r=new XMLHttpRequest();
    r.open("GET","server/shout.php");

    r.onreadystatechange=()=>{
        if (r.readyState==4)
        {
            console.log(r.response);
        }
    };

    r.send();
}

function shoutSend(name,msg)
{
    var r=new XMLHttpRequest();
    r.open("POST","server/shout.php");

    r.onreadystatechange=()=>{
        if (r.readyState==4)
        {
            console.log(r.response);
        }
    };

    // console.log(`name=${encodeURI(name)}&message=${encodeURI(msg)}`);
    r.setRequestHeader("Content-type","application/x-www-form-urlencoded")
    // r.send("name=Samir&message=Oh%20no!%20Not%20again!%20Why%20does%20it%20say%20paper%20jam%20when%20there%20is%20no%20paper%20jam%3F!!");
    r.send(`name=${encodeURI(name)}&message=${encodeURI(msg)}`);
}

function genMsg(msgdata)
{
    return `<div class="shout"><span class="timestamp">[${msgdata.time}]</span><span class="name">${msgdata.name}</span>:<span>${msgdata.message}</span></div>`;
}