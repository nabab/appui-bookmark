<?php
/**
 * What is my purpose?
 *
 **/

/** @var bbn\Mvc\Model $model */

use bbn\X;

$res = ['success' => false];

if ($model->data['id']) {
  $model->inc->pref->deleteBit($model->data['id']);
  $res['success'] = true;
}

return $res;