<?php
	include 'db_helper.php';

	function listCategories() {
		$dbQuery = sprintf("SELECT * FROM categories");
		$result = getDBResultsArray($dbQuery);
		header("Content-type: application/json");
		echo json_encode($result);
	}
?>
