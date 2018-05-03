<?php
    $eventdatafilepath="../../../../cs433/read-write/events.json";

    if ($_SERVER['REQUEST_METHOD']=='GET')
    {
        $data=json_decode(@file_get_contents($eventdatafilepath,true));

        if ($data==NULL)
        {
            $data=array();
        }

        echo json_encode($data);
    }

    else if ($_SERVER['REQUEST_METHOD']=='POST')
    {
        $originalpost=file_get_contents('php://input');
        $postdata=json_decode($originalpost);

        if ($postdata==NULL)
        {
            $postdata=array(
                "result"=>false,
                "message"=>"json error",
                "originaldata"=>$originalpost
            );

            echo json_encode($postdata);
            file_put_contents("../../../../cs433/read-write/error.txt",$originalpost,LOCK_EX);
            return;
        }

        if ($postdata->action=="create")
        {
            $data=json_decode(@file_get_contents($eventdatafilepath,true));

            if ($data==NULL)
            {
                $data=array();
            }

            unset($postdata->action);
            $postdata->id=hash('md5',$postdata->title.$postdata->start.$postdata->end);

            $data[]=$postdata;

            file_put_contents($eventdatafilepath,json_encode($data),LOCK_EX);

            echo json_encode(array(
                "result"=>true
            ));
        }

        else if ($postdata->action=="delete")
        {
            $data=json_decode(@file_get_contents($eventdatafilepath,true));

            for ($x=0;$x<count($data);$x++)
            {
                if ($data[$x]->id==$postdata->id)
                {
                    unset($data[$x]);
                    break;
                }
            }

            file_put_contents($eventdatafilepath,json_encode(array_values($data)),LOCK_EX);

            echo json_encode(array(
                "result"=>true
            ));
        }

        else
        {
            echo json_encode(array(
                "result"=>false,
                "message"=>"action not recognised"
            ));
        }
    }
?>