<?php
    if ($_SERVER['REQUEST_METHOD']=='GET')
    {
        $data=json_decode(@file_get_contents("..\..\..\..\cs433\read-write\events.json",true));

        if ($data==NULL)
        {
            $data=array();
        }

        echo json_encode($data);
    }

    else if ($_SERVER['REQUEST_METHOD']=='POST')
    {
        $postdata=json_decode(file_get_contents('php://input'));

        if ($postdata==NULL)
        {
            $postdata=array("result"=>"false","message"=>"json error");
        }

        echo json_encode($postdata);
    }
?>