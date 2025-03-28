<?php
/**
   * What is my purpose?
   *
   **/

/** @var bbn\Mvc\Model $model */
use bbn\X;

$id_list = $model->inc->options->fromCode("list", "bookmark", "appui");
//$id_cat = $model->inc->options->fromCode("cat", "bookmark", "appui");
$tree = $model->getCachedModel("./data/bookmarks", [], 3600);
$parents[] = [
  'text' => 'None',
  'value' => ''
];
$all_id = [];

$mapper = function ($ar) use (&$parents, &$mapper) {
  foreach ($ar as $a) {
    if (empty($a['url'])) {
      $parents[] = [
        'text' => $a['text'],
        'value' => $a['id']
      ];
      if (!empty($a['items'])) {
        $mapper($a['items']);
      }
    }
  }
};

$map = function ($ar) use (&$all_id, &$map) {
  foreach($ar as $a) {
    $all_id[] = [
      'text' => $a['text'],
      'value' => $a['id'],
      'img' => $a['cover'] ?? null
    ];

    if (!empty($a['items'])) {
      $map($a['items']);
    }
  }
};

$map($tree['items'] ?? []);
$mapper($tree['items'] ?? []);

return [
  'parents' => $parents,
  'allId' => $all_id,
  'data' => $tree && $tree['items'] ? $tree['items'] : []
];