<?php

global $image_directory;

if( is_front_page() ) {

  $header = 'home';
  $subheader = 'subheader';
  $image = $image_directory.'/home_banner.jpg';

} else {

  $header = get_field('header') || 'test';
  $subheader = get_field('subheader') || 'test2';
  $image = get_field('image') || 'test3';

}

?>

<div class="hero">
  <div class="image">
    <img src="<?php echo $image ?>" />
  </div>
  <header>
    <h1><?php echo $header ?></h1>
    <p><?php echo $subheader ?></p>
    <?php button('Sign Up', '#'); ?>
  </header>
</div>
