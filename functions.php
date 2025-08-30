<?php
/**
 * Life on Mars Theme functions and definitions
 *
 * @package Life_on_Mars
 * @since 1.1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Register block styles
 */
function life_on_mars_register_block_styles() {
	// Register custom image styles
	register_block_style(
		'core/image',
		array(
			'name'  => 'rounded-corners',
			'label' => __( 'Rounded Corners', 'life-on-mars' ),
		)
	);

	// Register paragraph data style
	register_block_style(
		'core/paragraph',
		array(
			'name'  => 'is-data',
			'label' => __( 'Data Style', 'life-on-mars' ),
		)
	);
}
add_action( 'init', 'life_on_mars_register_block_styles' );

/**
 * Enqueue theme assets with better organization
 */
function life_on_mars_enqueue_theme_assets() {
	$theme_version = wp_get_theme()->get('Version');
	
	// Core theme toggle styles (button appearance)
	wp_enqueue_style(
		'life-on-mars-theme-toggle',
		get_theme_file_uri('assets/css/theme-toggle.css'),
		array(),
		$theme_version
	);
	
	// Smooth transitions for theme switching
	wp_enqueue_style(
		'life-on-mars-theme-transitions',
		get_theme_file_uri('assets/css/theme-transitions.css'),
		array('life-on-mars-theme-toggle'),
		$theme_version
	);
	
	// Dark theme color mappings
	wp_enqueue_style(
		'life-on-mars-flexoki-dark',
		get_theme_file_uri('assets/css/flexoki-dark.css'),
		array('life-on-mars-theme-transitions'),
		$theme_version
	);
	
	// Theme toggle functionality
	wp_enqueue_script(
		'life-on-mars-theme-toggle',
		get_theme_file_uri('assets/js/theme-toggle.js'),
		array(),
		$theme_version,
		true // Load in footer
	);
}
add_action('wp_enqueue_scripts', 'life_on_mars_enqueue_theme_assets');

/**
 * Add early theme initialization (critical CSS)
 */
function life_on_mars_early_theme_init() {
	$inline_script = get_theme_file_path('assets/js/theme-toggle-inline.js');
	if (file_exists($inline_script)) {
		echo '<script>' . file_get_contents($inline_script) . '</script>';
	}
}
add_action('wp_head', 'life_on_mars_early_theme_init', 0);

/**
 * Add preload hints for critical theme assets
 */
function life_on_mars_preload_critical_assets() {
	// Preload critical theme CSS for faster loading
	echo '<link rel="preload" href="' . get_theme_file_uri('assets/css/theme-toggle.css') . '" as="style">';
	echo '<link rel="preload" href="' . get_theme_file_uri('assets/css/theme-transitions.css') . '" as="style">';
	
	// Preload critical fonts
	echo '<link rel="preload" href="' . get_theme_file_uri('assets/fonts/Inter-VariableFont.woff2') . '" as="font" type="font/woff2" crossorigin>';
}
add_action('wp_head', 'life_on_mars_preload_critical_assets', 1);