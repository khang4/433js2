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
    r.open("GET","https://swe.umbc.edu/~khang4/433js2/javascript/p2/server/shout.php");

    r.onreadystatechange=()=>{
        if (r.readyState==4)
        {
            console.log(r.response);
        }
    };

    r.send();
}

function genMsg(msgdata)
{
    return `<div class="shout"><span class="timestamp">[${msgdata.time}]</span><span class="name">${msgdata.name}</span>:<span>${msgdata.message}</span></div>`;
}