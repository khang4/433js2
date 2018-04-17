window.onload=main;

function main()
{

}

function testget()
{
    var r=new XMLHttpRequest();
    r.open("GET","http://swe.umbc.edu/~khang4/433js2/javascript/p2/server/shout.php");

    r.onreadystatechange=()=>{
        if (r.readyState==4)
        {
            console.log(r.response);
        }
    };

    r.send();
}