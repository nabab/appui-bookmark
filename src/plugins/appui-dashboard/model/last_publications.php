<?php
/**
 * What is my purpose?
 *
 **/

/** @var $model \bbn\Mvc\Model*/

use bbn\Appui\Cms;

$cms = new Cms($model->db);


return $cms->getLatest($model->data['limit'] ?? 10, $model->data['start'] ?? 0);
