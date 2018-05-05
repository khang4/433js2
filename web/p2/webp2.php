<?php
    $filelistpath="../../../../cs433/read-write/p2/filelist.json";

    if ($_SERVER["REQUEST_METHOD"]=="GET")
    {
        $filelist=json_decode(@file_get_contents($filelistpath,true));

        if ($filelist==NULL)
        {
            $filelist=array();
        }

        echo json_encode($filelist);
    }

    else if ($_SERVER["REQUEST_METHOD"]=="POST")
    {
        $filelist=json_decode(@file_get_contents($filelistpath,true));

        if ($filelist==NULL)
        {
            $filelist=array();
        }

        $finfo=finfo_open(FILEINFO_MIME_TYPE);
        foreach ($_FILES as $file)
        {
            $realfiletype=finfo_file($finfo,$file["tmp_name"]);
            $typeconvertfiletype=typeconvert($realfiletype);
            if ($file["size"]>500000)
            {
                echo json_encode(array(
                    "status"=>"invalidsize"
                ));
                return;
            }

            if ($typeconvertfiletype=="unsupported")
            {
                echo json_encode(array(
                    "status"=>"invalidtype",
                    "type"=>$realfiletype
                ));
                return;
            }

            $filelist[]=array(
                "name"=>$file["name"],
                "size"=>humansize($file["size"]),
                "type"=>typeconvert($realfiletype),
                "modtime"=>filemtime($file["tmp_name"])
            );
        }

        file_put_contents($filelistpath,json_encode($filelist),LOCK_EX);

        echo json_encode(array(
            "status"=>"uploaded"
        ));
    }

    //based on something i read online
    function humansize($size)
    {
        $units=array("B","kB","MB","GB","TB","PB","EB","ZB","YB");
        $i = 0;

        while (($size/1024)>.9)
        {
            $size=$size/1024;
            $i++;
        }

        return round($size,2).$units[$i];
    }

    function typeconvert($type)
    {
        switch ($type)
        {
            case "image/png":
                return "png";

            case "image/gif":
                return "gif";

            case "image/jpeg":
            case "image/jpg":
                return "jpeg";

            case "text/plain":
                return "text";

            case "text/html":
                return "html";
        }

        return "unsupported";
    }
?>