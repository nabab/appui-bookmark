<?php
/**
   * What is my purpose?
   *
   **/

/** @var $model \bbn\Mvc\Model*/
use bbn\X;

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

  $bits = $model->db->rselectAll(
    [
      'table' => $cfg['tables']['user_options_bits'],
      'fields' => [
        $f['id'],
        $f['id_option'],
        $f['num'],
        $f['text'],
        $f['cfg'],
        "clicked" => "IFNULL (JSON_EXTRACT($f[cfg], 'clicked'), 0)"
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
    ]
  );
  $num = $model->db->count(
    [
      'table' => $cfg['tables']['user_options_bits'],
      'where' => [
        'conditions' => $where
      ]
    ]
  );
  return [
    'data' => $bits,
    'total' => $num,
    'last' => $model->db->last(),
    'id_option' => $user_option['id']
    /*'parents' => $parents,
  'allId' => $all_id,
  'data' => $tree*/
  ];
}