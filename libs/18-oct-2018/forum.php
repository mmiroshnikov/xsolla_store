<?php

// require __DIR__ . '/vendor/autoload.php';

// if (!isset ($_GET['sso']) || !isset ($_GET['sig']) || !isset($_)) {
//     header('Location: https://yourworlds.com' );
// }

// $sig = hash_hmac('SHA256', $_GET['sso'], '1234567890');

// if(!($sig == $_GET['sig'])) {
//     header('Location: https://yourworlds.com' );
// }

// setcookie('forum_sig', $sig);
// setcookie('forum_sso', $_GET['sso']);

// $sso = base64_decode($_GET['sso']);
// //echo $sso;
// //parse_str($sso, $get_array);
// //print_r($get_array['nonce']);
// //$qs = "nonce={$get_array['nonce']}&email=".urlencode($email)."&name=".urlencode($email);

header('Location: https://ywforum.trydiscourse.com/session/sso' );