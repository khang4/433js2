<?php
$lat = $_GET['lat'];
$long = $_GET['long'];
$radius= (int) $_GET['rad'];
if($radius > 10000){
	$radius = 10000;
}
$curl =
curl_init("https://en.wikipedia.org/w/api.php?action=query&prop=coordinates|pageimages|pageterms|info|extracts&colimit=100&piprop=thumbnail&pithumbsize=144&pilimit=50&wbptterms=description&generator=geosearch&ggscoord=${lat}|${long}&ggsradius=${radius}&ggslimit=100&ggsprop=type&format=json&inprop=url&exchars=150&explaintext&exsectionformat=plain&exintro");
curl_setopt($curl, CURLOPT_USERAGENT, 'UMBC_CMSC_433_Project/1.0 (https://www.csee.umbc.edu/~bwilk1/433/; bwilk1@umbc.edu)');
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$data = curl_exec($curl);
echo $data;
curl_close($curl);
exit();
