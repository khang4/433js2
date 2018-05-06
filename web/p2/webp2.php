<?php
    $filelistpath="../../../../cs433/read-write/p2/filelist.json";

    if ($_SERVER["REQUEST_METHOD"]=="GET")
    {
        $filelist=json_decode(@file_get_contents($filelistpath,true));

        if ($filelist==NULL)
        {
            $filelist=array();
        }

        if (array_key_exists("HTTP_SORTSTATE",$_SERVER))
        {
            $sortstate=json_decode($_SERVER["HTTP_SORTSTATE"]);

            if ($sortstate!=NULL)
            {
                switch ($sortstate->sortmode)
                {
                    case 0:
                    usort($filelist,"alphabetisename");
                    break;

                    case 1:
                    usort($filelist,"sortsize");
                    break;

                    case 2:
                    usort($filelist,"alphabetisetype");
                    break;

                    case 3:
                    usort($filelist,"sortmodtime");
                    break;
                }

                if ($sortstate->order==1)
                {
                    $filelist=array_reverse($filelist);
                }
            }
        }

        echo json_encode($filelist);
    }

    else if ($_SERVER["REQUEST_METHOD"]=="POST")
    {
        if ($_SERVER["HTTP_METHOD"]=="upload")
        {
            $filelist=json_decode(@file_get_contents($filelistpath,true));

            if ($filelist==NULL)
            {
                $filelist=array();
            }

            $finfo=finfo_open(FILEINFO_MIME_TYPE);
            $resultsarray=array();
            foreach ($_FILES as $file)
            {
                $realfiletype=finfo_file($finfo,$file["tmp_name"]);
                $typeconvertfiletype=typeconvert($realfiletype);
                if ($file["size"]>500000)
                {
                    $resultsarray[]=array(
                        "status"=>"invalidsize"
                    );
                    continue;
                }

                if ($typeconvertfiletype=="unsupported")
                {
                    $resultsarray[]=array(
                        "status"=>"invalidtype",
                        "type"=>$realfiletype
                    );
                    continue;
                }

                $modtime=filemtime($file["tmp_name"]);
                $filelist[]=array(
                    "name"=>$file["name"],
                    "size"=>humansize($file["size"]),
                    "asize"=>$file["size"],
                    "type"=>typeconvert($realfiletype),
                    "modtime"=>$modtime,
                    "id"=>hash("md5",$file["name"].$modtime.$file["size"]) //this is a bad hash but whatever
                );

                $resultsarray[]=array(
                    "status"=>"uploaded"
                );
            }

            file_put_contents($filelistpath,json_encode($filelist),LOCK_EX);

            echo json_encode($resultsarray);
        }

        else
        {
            echo json_encode(array(
                "status"=>"bad post method header"
            ));
        }
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

    function alphabetisename($file1,$file2)
    {
        return strcmp($file1->name,$file2->name);
    }

    function alphabetisetype($file1,$file2)
    {
        return strcmp($file1->type,$file2->type);
    }

    function sortsize($file1,$file2)
    {
        return $file1->asize-$file2->asize;
    }

    function sortmodtime($file1,$file2)
    {
        return $file1->modtime-$file2->modtime;
    }
?>