<?php
/*
if ( !empty($model->data['text']) ){
  $success = false;
  $file = BBN_DATA_PATH.'bookmarks.json';
  if ( !empty(file_exists($file)) ){
    $bookmarks = json_decode(file_get_contents($file), true);
    if ( ( $parent = $model->data['parent'] ) && ( $idx = $model->data['idx'] ) ){
      
      
      foreach ( $bookmarks as $key => $val ){
        if ( ($val['text'] === $parent) && ($model->data['new_type'] === 'folder' ) ){
          $bookmarks[$key]['items'][] = [
            'text' => $model->data['text'],
            'type' => $model->data['new_type'],
            'items' => []
          ];
        }
        die(var_dump($bookmarks[$key]));
      }
    }
    else {
      $bookmarks[] = [
      'text' => $model->data['text'],
      'type' => $model->data['new_type'],
      'items' => []
    ];
    }
  }
  else { 
    $bookmarks = [
      'text' => $model->data['text'],
      'type' => 'folder',
      'items' => []
    ];
    

  }
  $success = file_put_contents($file, Json_encode($bookmarks));
  return [
    'success' => $success,
    'bookmarks' => json_decode(file_get_contents($file))
  ];
}
*/
/**
 * What is my purpose?
 *
 **/

/** @var $model \bbn\Mvc\Model*/
use bbn\X;

$id_list = $model->inc->options->fromCode("list", "bookmark", "appui");
$res = ["success" => false];
$parent = false;


if (!$my_list) {
  $model->inc->pref->add($id_list, []);
  $my_list = $model->inc->pref->getByOption($id_list);
}

$tree = $my_list ? $model->inc->pref->getTree($my_list['id']) : false;

if ($tree['items'] || $tree['id']) {

  $res['id_bit'] = $model->inc->pref->addBit($my_list['id'], [
    'text' => $model->data['title'],
    'id_parent' => $model->data['id_parent'] ?: null
  ]);
  if ($res['id_bit']) {
    $res['success'] = true;
  }
}

return $res;