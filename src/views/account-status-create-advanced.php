<?php
?><div class="tiny-account-status wide" id="tiny-account-status" data-state="missing">
	<div class="create">
		<h4>
		<?php
			esc_html_e( 'Register new account', 'tiny-compress-images' );
		?>
		</h4>

		<p class="introduction" class="description">
		<?php
			esc_html_e(
				'Create your API key on the Tinify website to start optimizing images.',
				'tiny-compress-images'
			);
			?>
		</p>

		<?php
			// MVP: key creation happens on the Tinify-hosted signup page (captcha
			// lives there). We hand it a nonce-protected callback URL that points
			// back to this settings page; after signup site-next redirects to it
			// with an `api_key` query parameter, which we store as the API key.
			// Pointing at the local site-next dev server for testing.
			$callback   = add_query_arg(
				'_tiny_nonce',
				wp_create_nonce( self::CALLBACK_NONCE ),
				$this->get_absolute_url()
			);
			$create_url = 'http://localhost/signup/app?callback=' . rawurlencode( $callback );
		?>
		<a class="button button-primary" href="<?php echo esc_url( $create_url ); ?>" rel="noopener">
			<?php esc_html_e( 'Register Account', 'tiny-compress-images' ); ?>
		</a>
	</div>

	<div class="update">
		<h4>
		<?php
			esc_html_e( 'Already have an account?', 'tiny-compress-images' );
		?>
		</h4>

		<p class="introduction">
		<?php
			$link = sprintf(
				'<a href="https://tinypng.com/dashboard/api" target="_blank">%s</a>',
				esc_html__( 'API dashboard', 'tiny-compress-images' )
			);
			echo wp_kses_post(
				sprintf(
					/* translators: %s: link saying API dashboard */
					__( 'Enter your API key. Go to your %s to retrieve it.', 'tiny-compress-images' ),
					$link
				)
			);
			?>
		</p>

		<input type="text" id="<?php echo esc_attr( self::get_prefixed_name( 'api_key' ) ); ?>"
			name="<?php echo esc_attr( self::get_prefixed_name( 'api_key' ) ); ?>">

		<p class="message"></p>

		<button class="button button-primary" data-tiny-action="update-key">
			<?php esc_html_e( 'Save', 'tiny-compress-images' ); ?>
		</button>
	</div>
</div>
