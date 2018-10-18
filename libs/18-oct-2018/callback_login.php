<?php

require __DIR__ . '/vendor/autoload.php';
use \Firebase\JWT\JWT;


if (!isset ($_GET['sso']) || !isset ($_GET['sig']) || !isset($_COOKIE['xsolla_login_token'])) {
    header('Location: https://yourworlds.com' );
}

$sso = $_GET['sso'];



$sig = hash_hmac('SHA256', $sso, '123tafsdfawerertgw');

if(!($sig == $_GET['sig'])) {
    header('Location: https://yourworlds.com' );
}

$jwt = $_COOKIE['xsolla_login_token'];

$key = "yAAcfuSyzzXapXcYZNpoYayuYAilAmdc5CZQ0a8EctWiDyhZTXxDJgeOXk5dEYTG";


try {
    $decoded = JWT::decode($jwt, $key, array('HS256'));
} catch (Firebase\JWT\SignatureInvalidException $e) {
    header('Location: https://yourworlds.com' );
}

$sso = base64_decode($sso);

parse_str($sso, $get_array);



$qs = "nonce={$get_array['nonce']}&email=".urlencode($decoded->email)."&name=".urlencode($decoded->email)."&external_id=".urlencode($decoded->email);
$payload = base64_encode($qs);
$sig = hash_hmac('SHA256', $payload, '123tafsdfawerertgw');
$payload = urlencode($payload);

$base_url = "https://ywforum.trydiscourse.com/session/sso_login";
$url = "{$base_url}?sso=$payload&sig=$sig";


//echo urlencode($decoded->email);
header("Location: $url");


//print_r($qs);
//print_r($decoded->email);