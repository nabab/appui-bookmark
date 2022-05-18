<?php
/** @var $model \bbn\Mvc\Model */

$limit = isset($model->data['limit']) && is_int($model->data['limit']) ? $model->data['limit'] : 5;
$start = isset($model->data['start']) && is_int($model->data['start']) ? $model->data['start'] : 0;
$type = $model->inc->options->fromCode('personal', 'types', 'note', 'appui');
$note = new \bbn\Appui\Note($model->db);
$obs = new bbn\Appui\Observer($model->db);
$res = [
  'id_type' => $type,
  'items' => $note->getByType($type, $model->inc->user->getId(), $limit, $start),
  'limit' => $limit,
  'start' => $start,
  'total' => $note->countByType($type, $model->inc->user->getId())
];
if ( $id_obs = $obs->add([
  'request' => "
    SELECT MAX(creation)
    FROM bbn_notes_versions
    JOIN bbn_notes
      ON bbn_notes_versions.id_note = bbn_notes.id
      AND bbn_notes.active = 1
    WHERE bbn_notes.id_type = ?
      AND bbn_notes.creator = ?
    LIMIT 1",
  'params' => [$type, $model->inc->user->getId()],
  'public' => false,
  'name' => _('Personal notes')
]) ){
  $res['observer'] = [
    'id' => $id_obs,
    'value' => $obs->getResult($id_obs)
  ];
}

return $res;
