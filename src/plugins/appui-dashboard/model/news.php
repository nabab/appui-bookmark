<?php
/** @var $model \bbn\Mvc\Model */
$limit = isset($model->data['limit']) && is_int($model->data['limit']) ? $model->data['limit'] : 5;
$start = isset($model->data['start']) && is_int($model->data['start']) ? $model->data['start'] : 0;
$type_note = $model->inc->options->fromCode('news', 'types', 'note', 'appui');
$type_event = $model->inc->options->fromCode('NEWS', 'evenements');

$grid = new \bbn\Appui\Grid($model->db, $model->data, [
  'table' => 'bbn_notes',
  'fields' => [
    'versions.id_note',
    'versions.version',
    'versions.title',
    'versions.content',
    'versions.id_user',
    'versions.creation',
    'bbn_events.start',
    'bbn_events.end'
  ],
  'join' => [[
    'table' => 'bbn_notes_events',
    'on' => [
      'conditions' => [[
        'field' =>  'bbn_notes_events.id_note',
        'operator' => '=',
        'exp' => 'bbn_notes.id'
      ]]
    ]
  ], [
    'table' => 'bbn_events',
    'on' => [
      'conditions' => [[
        'field' => 'bbn_events.id_type',
        'value' => $model->inc->options->fromCode('NEWS', 'evenements')
      ], [
        'field' => 'bbn_events.id',
        'exp' => 'bbn_notes_events.id_event'
      ], [
        'field' => 'bbn_events.start',
        'operator' => '<=',
        'exp' => 'NOW()'
      ], [
        'logic' => 'OR',
        'conditions' => [[
          'field' => 'bbn_events.end',
          'operator' => '>=',
          'exp' => 'NOW()'
        ], [
          'field' => 'bbn_events.end',
          'operator' => 'isnull'
        ]]
      ]]
    ]
  ], [
    'table' => 'bbn_notes_versions',
    'type' => 'left',
    'alias' => 'versions',
    'on' => [
      'conditions' => [[
        'field' => 'bbn_notes.id',
        'exp' => 'versions.id_note'
      ], [
        'field' => 'latest',
        'value' => 1
      ]]
    ]
  ]],
  'where' => [
    'conditions' => [[
      'field' => 'bbn_notes.id_type',
      'value' => $type_note
    ], [
      'field' => 'bbn_notes.active',
      'value' => 1
    ]]
  ],
  'group_by' => 'bbn_notes.id',
  'order' => [[
    'field' => 'versions.version',
    'dir' => 'DESC'
  ], [
    'field' => 'versions.creation',
    'dir' => 'DESC'
  ]],
  'limit' => $limit,
  'start' => $start,
  'observer' => [
    'request' => "
      SELECT MAX(creation)
      FROM bbn_notes_versions
      JOIN bbn_notes
        ON bbn_notes_versions.id_note = bbn_notes.id
        AND bbn_notes.active = 1
      WHERE bbn_notes.id_type = ?
      LIMIT 1",
    'params' => [$type_note],
    'public' => true,
    'name' => _('News')
  ]
]);
if ( $grid->check() ){
  $d = $grid->getDatatable();
  if ( isset($d['data']) ){
    $d['items'] = $d['data'];
    unset($d['data']);
  }
  $d['id_type'] = $model->inc->options->fromCode('news', 'types', 'note', 'appui');
  return $d;
}
return [];