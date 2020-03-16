<?php

$uploadedFile = $_FILES['uploadedFile'];
$uploadPath = $_SERVER['DOCUMENT_ROOT'].'/uploader/upload/'.basename($uploadedFile["name"]);

$result = move_uploaded_file($uploadedFile['tmp_name'],  $uploadPath);

$uploadedFile['result'] = $result;
$uploadedFile['uploadPath'] = $uploadPath;

echo json_encode($uploadedFile);