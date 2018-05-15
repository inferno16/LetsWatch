<?php

session_start();

$conn = mysqli_connect("127.0.0.1", "root", "", "letswatch");
if (isset($_POST['submit'])) {


$name = mysqli_real_escape_string($conn, 'tom');
$pwd = mysqli_real_escape_string($conn, 'asd');

//error handlers

//check for empty fields

if (empty($name) || empty($pwd) ){

   header("Location: ../index.php?entry=empty");
   exit();

} else {

    // check if input characters are valid

    if (!preg_match("/^[a-zA-Z]*$/", $name) || !preg_match("/^[a-zA-Z]*$/", $pwd))  {

        header("Location: ../index.php?entry=invalid-entry");
        exit();

    } else {

        $sql = "SELECT * FROM users WHERE user_name='$name' AND user_pwd='$pwd'";
        $result = mysqli_query($conn, $sql);
        $resultCheck = mysqli_num_rows($result);

        if ($resultCheck < 1) {

            header("Location: ../index.php?login=error");
            exit();

        } else {
            if ($row = mysqli_fetch_assoc($result)) {
                $_SESSION['u_name'] = $row['user_name'];
                $_SESSION['u_pwd'] = $row['user_pwd'];

                if ($name == 'tom') {
                    die('tom');
                    header("Location: ../admin.php?login=success");
                    exit;

                } elseif ($name == 'dick') {
                    header("Location: ../page_one.php?login=success");
                    exit;    

                } elseif ($name == 'harry') {
                    header("Location: ../page_two.php?login=success");
                    exit;

                } elseif ($name == 'joe') {
                    header("Location: ../page_three.php?login=success");
                    exit;

                } elseif ($name == 'bloggs') {
                    header("Location: ../page_four.php?login=success");
                    exit;

                } else {
                    die('not tom');
                    header("Location: ../HOME.php?login=success");
                    exit;
                }
            }
        }            
    }
}

} else {
//header("Location: ../index.php");
//exit();
}
?>

<form action="" method="POST">
    
</form>