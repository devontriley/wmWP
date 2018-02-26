<?php // Template Name: Home ?>

<?php get_header(); ?>

<?php include(dirname(__FILE__).'./../components/hero.php'); ?>

<?php display_articles('Top Articles', $postType, 5); ?>

<?php get_footer(); ?>
