<?php
/**
 * What is my purpose?
 *
 **/

/** @var bbn\Mvc\Model $model */
use bbn\X;

if ($model->hasData("id")) {
  $bit = $model->inc->pref->getBit($model->data['id']);
  $model->inc->pref->updateBit($model->data['id'], [
    'count' => $bit['count'] + 1,
  ], true);
  // dump to know where we are in the count
  //X::ddump($bit);
  header("Location:" . $bit['url']);
}