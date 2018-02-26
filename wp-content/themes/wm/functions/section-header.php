<?php
function sectionHeader($text, $linkText = null) {
  if($text) {
    ob_start(); ?>
    <div class="section-header">
      <span class="text"><?php echo $text ?></span>
      <a href="#"><?php echo $linkText ?></a>
    </div>
    <?php
    echo ob_get_clean();
  }
}
?>
