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
  $where = [
    'logic' => 'AND',
    'conditions' => [[
      'field' => $f['id_user_option'],
      'value' => $user_option['id']
    ], [
      'field' => 'url',
      'operator' => "isnotempty"
    ]]
  ];
  if (!empty($model->data['data']['filter'])) {
    $cond = [
      'logic' => 'OR',
      'conditions' => [[
        'field' => 'text',
        'operator' => "contains",
        'value' => $model->data['data']['filter']
      ], [
        'field' => 'url',
        'operator' => "contains",
        'value' => $model->data['data']['filter']
      ]]
    ];
    array_push($where['conditions'], $cond);
  }
  $grid = new Grid($model->db, $model->data, [
    'table' => $cfg['tables']['user_options_bits'],
    'fields' => [
      $f['id'],
      $f['id_option'],
      $f['num'],
      $f['text'],
      'cover' => 'IFNULL (JSON_UNQUOTE(JSON_EXTRACT('.$f['cfg'].', \'$.cover\')), \'\')',
      //'description' => 'IFNULL (JSON_UNQUOTE(JSON_EXTRACT('.$f['cfg'].', \'$.description\')), \'\')',
      'url' => 'IFNULL (JSON_UNQUOTE(JSON_EXTRACT('.$f['cfg'].', \'$.url\')), \'\')',
      'id_screenshot' => 'IFNULL (JSON_UNQUOTE(JSON_EXTRACT('.$f['cfg'].', \'$.id_screenshot\')), \'\')',
      'screenshot_path' => 'IFNULL (JSON_UNQUOTE(JSON_EXTRACT('.$f['cfg'].', \'$.screenshot_path\')), \'\')',
      "clicked" => 'IFNULL (JSON_UNQUOTE(JSON_EXTRACT('.$f['cfg'].', \'$.clicked\')), 0)'
    ],
    'where' => $where,
    'order' => [[
      'field' => "clicked",
      'dir' => 'DESC'
    ]]
  ]);
  return $grid->getDatatable(true);
}