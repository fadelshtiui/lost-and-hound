<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    if(isset($_POST["lat"]) && isset($_POST["lon"]) && isset($_POST["color"]) && isset($_POST["size"]) 
        && isset($_POST["spots"]) && isset($_POST["collar"]) && isset($_POST["silhouette"]) && isset($_POST["email"]) && isset($_POST["phone"])) {
            
        $lat = $_POST["lat"];
        $lon = $_POST["lon"];
        $color = trim($_POST["color"]);
        $size = trim($_POST["size"]);
        $spots = $_POST["spots"];
        $collar = $_POST["collar"];
        $silhouette = trim($_POST["silhouette"]);
        $email = trim($_POST["email"]);
        if ($email == "") {
            $email = "Not Provided";
        }
        $phone = trim($_POST["phone"]);
        if ($phone == "") {
            $phone = "Not Provided";
        }
             
        $host = 'localhost';
        $dbname = 'lostqzyx_dogs';
        $user = 'lostqzyx_fadel';
        $password = 'GRHNCbVx?,UU';
        $ds = "mysql:host={$host};dbname={$dbname};charset=utf8";

        try {
           $db = new PDO($ds, $user, $password);
           $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        catch (PDOException $ex) {
           header("Content-type: text/plain");
           print "Can not connect to the database. Please try again later.\n";
           print "Error details: $ex \n";
           die();
        }

        $sql = "INSERT INTO dogs (id, lat, lon, color, size, spots, collar, silhouette, email, phone, timestamp) VALUES (:id, :lat, :lon, :color, :size, :spots, :collar, :silhouette, :email, :phone, :timestamp);";
        date_default_timezone_set('America/Los_Angeles');
        $time = date('m-d-y H:i:s');
        $stmt = $db->prepare($sql);
        $params = array("id" => uniqid(), "lat" => $lat, "lon" => $lon, "color" => $color, "size" => $size, "spots" => $spots, "collar" => $collar, "silhouette" => $silhouette, "email" => $email, "phone" => $phone, "timestamp" => $time);
        $stmt->execute($params);
    }

?>
