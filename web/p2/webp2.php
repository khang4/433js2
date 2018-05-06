<?php
    $filelistpath="../../../../cs433/read-write/p2/filelist.json";

    if ($_SERVER["REQUEST_METHOD"]=="GET")
    {
        $filelist=json_decode(@file_get_contents($filelistpath,true));

        if ($filelist==NULL)
        {
            $filelist=array();
        }

        usort($filelist,"alphabetise",0);

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
                    "size"=>$file["size"],
                    "hsize"=>humansize($file["size"]),
                    "type"=>typeconvert($realfiletype),
                    "modtime"=>$modtime,
                    "id"=>hash("md5",$file["name"].$modtime)
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

    //alphabetise by name (set field=0) or type (>1)
    function alphabetise($file1,$file2,$field=0)
    {
        if ($field==0)
        {
            return strcmp($file1->name,$file2->name);
        }

        else
        {
            return strcmp($file1->type,$file2->type);
        }
    }

    //sort by size (0) or modtime (>1)
    function sortnumber($file1,$file2,$field=0)
    {
        if ($field==0)
        {
            return $file1->size-$file2->size;
        }

        else
        {
            return $file1->modtime-$file2->modtime;
        }
    }
?>