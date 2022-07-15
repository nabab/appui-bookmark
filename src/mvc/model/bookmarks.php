<?php
/**
   * What is my purpose?
   *
   **/

/** @var $model \bbn\Mvc\Model*/
use bbn\X;
use bbn\Appui\Grid;

if ($model->hasData('limit')) {
  $id_list = $model->inc->options->fromCode("list", "bookmark", "appui");
  $cfg = $model->inc->pref->getClassCfg();
  $f = $cfg['arch']['user_options_bits'];
  $user_option = $model->inc->pref->getByOption($id_list);
  $where = [[
    'field' => $f['id_user_option'],
    'value' => $user_option['id']
  ], [
    'field' => 'JSON_UNQUOTE(JSON_EXTRACT('.$f['cfg'].', \'$.url\'))',
    'operator' => "isnotnull"
  ]];
  $grid = new Grid($model->db, $model->data, [
    'table' => $cfg['tables']['user_options_bits'],
    'fields' => [
      $f['id'],
      $f['id_option'],
      $f['num'],
      $f['text'],
      'cover' => 'IFNULL (JSON_UNQUOTE(JSON_EXTRACT('.$f['cfg'].', \'$.cover\')), \'\')',
      'description' => 'IFNULL (JSON_UNQUOTE(JSON_EXTRACT('.$f['cfg'].', \'$.description\')), \'\')',
      'url' => 'IFNULL (JSON_UNQUOTE(JSON_EXTRACT('.$f['cfg'].', \'$.url\')), \'\')',
      'id_screenshot' => 'IFNULL (JSON_UNQUOTE(JSON_EXTRACT('.$f['cfg'].', \'$.id_screenshot\')), \'\')',
      'screenshot_path' => 'IFNULL (JSON_UNQUOTE(JSON_EXTRACT('.$f['cfg'].', \'$.screenshot_path\')), \'\')',
      "clicked" => 'IFNULL (JSON_UNQUOTE(JSON_EXTRACT('.$f['cfg'].', \'$.clicked\')), 0)'
    ],
    'where' => [
      'conditions' => $where
    ],
    'order' => [[
      'field' => "clicked",
      'dir' => 'DESC'
    ]],
    'start' => $model->data['start'],
    'limit' => $model->data['limit']
  ]);
  return $grid->getDataTable();
}