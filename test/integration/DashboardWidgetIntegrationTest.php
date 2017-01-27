<?php

require_once dirname( __FILE__ ) . '/IntegrationTestCase.php';

class DashboardWidgetIntegrationTest extends IntegrationTestCase {
	public function set_up() {
		parent::set_up();
		$this->visit( '/wp-admin/index.php' );
	}

	public function tear_down() {
		parent::tear_down();
		clear_settings();
		clear_uploads();
	}

	public function test_should_show_widget_without_images() {
		$element = $this->find(
			'#tinypng_dashboard_widget #no-images-uploaded p'
		);

		$this->assertEquals(
			'You don\'t seem to have uploaded any JPEG or PNG images yet.',
			$element->getText()
		);
	}


	public function test_should_show_widget_without_optimized_images() {
		$this->upload_media( 'test/fixtures/input-example.jpg' );
		$element = $this->find(
			'#tinypng_dashboard_widget #widget-not-optimized p'
		);

		$this->assertEquals(
			'Hi Admin, you haven’t compressed any images in your media library. If you like you can to optimize your whole library in one go with the bulk optimization page.',
			$element->getText()
		);
	}

	public function test_should_show_widget_with_some_images_optimized() {
		$this->upload_media( 'test/fixtures/input-example.jpg' );
		$this->set_api_key( 'JPG123' );
		$this->upload_media( 'test/fixtures/input-example.jpg' );
		$this->visit( '/wp-admin/index.php' );

		$element = $this->find(
			'#tinypng_dashboard_widget #widget-half-optimized p'
		);

		$this->assertEquals(
			'Hi Admin, you are doing good. With your current settings you can still optimize 4 image sizes from your 2 uploaded JPEG and PNG images. Start the bulk optimization to optimize the remainder of your library.',
			$element->getText()
		);
	}

	public function test_should_show_widget_with_all_images_optimized() {
		$this->set_api_key( 'JPG123' );
		$this->upload_media( 'test/fixtures/input-example.jpg' );
		$this->visit( '/wp-admin/index.php' );

		$element = $this->find(
			'#tinypng_dashboard_widget #widget-full-optimized p'
		);

		$this->assertEquals(
			'Hi Admin, great job! Your entire library is optimized!',
			$element->getText()
		);
	}
}
