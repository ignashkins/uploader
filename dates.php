<?php

$d = strtotime("+1 day");
$start_week = strtotime("last monday midnight",$d);
$end_week = strtotime("next friday",$d);
$start = date("Y-m-d",$start_week);
$end = date("Y-m-d",$end_week);
echo ($start." - ".$end);