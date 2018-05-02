window.onload=main;

function main()
{

}

function posttest(body)
{
    var r=new XMLHttpRequest();
    r.open("POST","events.php");

    r.onreadystatechange=()=>{
        if (r.readyState==4)
        {
            console.log(r.response);
        }
    };

    r.setRequestHeader("Content-type","text/plain");
    r.send(body);
}

function gettest()
{
    var r=new XMLHttpRequest();
    r.open("GET","events.php");

    r.onreadystatechange=()=>{
        if (r.readyState==4)
        {
            console.log(r.response);
            console.log(JSON.parse(r.response));
        }
    };

    r.send();
}