window.onload=main;

function main()
{

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