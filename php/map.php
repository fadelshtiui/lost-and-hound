<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    
    $host = 'localhost';
    $dbname = 'lostqzyx_dogs';
    $user = 'lostqzyx_fadel';
    $password = 'GRHNCbVx?,UU';
    $ds = "mysql:host={$host};dbname={$dbname};charset=utf8";
    
    try {
    	$db = new PDO($ds, $user, $password);
    	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    
    catch(PDOException $ex) {
    	header("Content-type: text/plain");
    	print "Can not connect to the database. Please try again later.\n";
    	print "Error details: $ex \n";
    	die();
    }
    
    $json = $db->query("SELECT * FROM dogs");
    $dogs = array();
    
    foreach($json as $column) {
    	array_push($dogs, $column[1]);
    	array_push($dogs, $column[2]);
    	array_push($dogs, $column[3]);
    	array_push($dogs, $column[4]);
    	array_push($dogs, $column[5]);
    	array_push($dogs, $column[6]);
    	array_push($dogs, $column[7]);
    	array_push($dogs, $column[8]);
    	array_push($dogs, $column[9]);
    	array_push($dogs, $column[10]);
    }
    
    header('Content-type: application/json');
    print json_encode($dogs);
?>