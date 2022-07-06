<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

if (isset($model->data['data'], $model->data['data']['id'])) {
  $id_parent = $model->data['data']['id'];
}
if (empty($id_parent)) {
  $id_parent = null;
}
//$id_parent = $model->hasData("data", true) ? ($model->data["data"]["id"] ?? null) : null ;
$id_list = $model->inc->options->fromCode("list", "bookmark", "appui");
$my_list = $model->inc->pref->getByOption($id_list);
$cfg = $model->inc->pref->getClassCfg();
$tmp = $model->inc->pref->getBits($my_list['id'], $id_parent);

foreach($tmp as &$t) {
  $t['numChildren'] = $model->db->count($cfg['tables']['user_options_bits'], [
    $cfg['arch']['user_options_bits']['id_parent'] => $t['id']
  ]);
}
unset($t);

return [
  "data" => $tmp
];

