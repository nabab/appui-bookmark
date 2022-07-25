<?php
/**
 * What is my purpose?
 *
 **/

/** @var $model \bbn\Mvc\Model*/

use bbn\X;

$res = ['success' => false];

if ($model->hasData('ids')) {
  $res = 0;
  foreach($model->data['ids'] as $id) {
    $res += (int)$model->inc->pref->deleteBit($id);
  }
  $res['success'] = $res;
}
elseif ($model->hasData('id')) {
  $model->inc->pref->deleteBit($model->data['id']);
  $res['success'] = true;
}

return $res;