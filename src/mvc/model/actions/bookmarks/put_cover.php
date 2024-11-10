<?php
/**
 * What is my purpose?
 *
 **/

/** @var bbn\Mvc\Model $model */

use bbn\X;

$res = ['success' => false];

if ($model->data['id']) {
  $model->inc->pref->updateBit($model->data['id'], [
    'cover' => $model->data['cover'] ?? null,
  ], true);
  $res['success'] = true;
}

return $res;