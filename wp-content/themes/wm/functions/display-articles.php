<?php

function display_articles($header, $postType = 'post', $count = 5) {
  $args = array(
    'posts_per_page' => $count,
    'post_type' => $postType
  );

  $displayArticles = new WP_Query($args);

  if($displayArticles) {

    $outpput = '';
    $output .= '<div class="articles">';
    foreach($displayArticles as $article) {
      print_r($article);
      //include(dirname(__FILE__).'./../components/article-thumb.php');
    }
    $output .= '</div>';
  }

}

?>
