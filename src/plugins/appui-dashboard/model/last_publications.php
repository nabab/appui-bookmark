<?php
/**
 * What is my purpose?
 *
 **/

/** @var bbn\Mvc\Model $model */

use bbn\Appui\Cms;

$cms = new Cms($model->db);


return $cms->getLatest($model->data['limit'] ?? 10, $model->data['start'] ?? 0);
