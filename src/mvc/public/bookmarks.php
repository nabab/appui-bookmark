<?php

/** @var $ctrl \bbn\Mvc\Controller */

use bbn\X;

if (!empty($ctrl->post['limit'])) {
  $ctrl->action();
} else {
  $ctrl->setIcon("nf nf-fa-star");
  $ctrl->setColor("#2597F0", "white");
  $ctrl->combo(_('My bookmarks'));
}