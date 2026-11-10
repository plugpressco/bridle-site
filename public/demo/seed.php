<?php
/**
 * Bridle demo seed for WordPress Playground: one business, docs, an inbox
 * with real-looking mail and agent drafts, Chat on, Pro's pages ready.
 */
require_once '/wordpress/wp-load.php';
wp_set_current_user( 1 );

use Bridle\Services\Settings;

// The business: Fernleaf, a made-up maker of a photo gallery plugin.
update_option( 'blogname', 'Fernleaf' );
update_option( 'blogdescription', 'Photo galleries for WordPress' );
update_option( 'bridle_onboarding_done', true );
Settings::update_many(
	[
		'business_name'      => 'Fernleaf',
		'agent_instructions' => "We sell Fernleaf Gallery Pro: $49 a year for 1 site, $99 for 5 sites. Every plan includes a year of updates and support. Refunds within 30 days, handled by a person.",
		'chat_enabled'       => true,
		'chat_greeting'      => 'Hi! Ask me anything about Fernleaf Gallery. A person can take over any time.',
	]
);

// Help docs (Bridle KB) in categories, and a pricing page.
$docs = [
	[ 'Getting started', 'Install Fernleaf Gallery', 'Upload the plugin under Plugins → Add New, activate it, then add a Gallery block to any page. Your first gallery is ready in a minute.' ],
	[ 'Getting started', 'Use it on a staging site', 'Staging and local sites don\'t count against your licence. Activate your key on staging as often as you like; only live sites count.' ],
	[ 'Getting started', 'Move to a new site', 'To move your galleries, go to Fernleaf → Tools → Export, download the file, then import it on the new site under Tools → Import. Deactivate the licence on the old site first.' ],
	[ 'Troubleshooting', 'Gallery not showing on Safari', 'If a gallery is blank on Safari 17, clear your cache plugin and turn off "Lazy load images" under Fernleaf → Performance. Version 3.4.2 fixes this for good.' ],
	[ 'Troubleshooting', 'Images look blurry', 'Turn on "Retina images" under Fernleaf → Performance, then regenerate thumbnails once. New uploads are sharp right away.' ],
	[ 'Billing', 'Updates and support', 'Every Fernleaf Gallery Pro plan includes a year of updates and support. Renew any time from your account to keep getting updates. Your galleries keep working if you don\'t renew.' ],
	[ 'Billing', 'Refunds', 'You can get a full refund within 30 days of buying. Write to us and a person handles it, usually the same day.' ],
];
foreach ( $docs as [ $cat, $title, $body ] ) {
	$post_type = post_type_exists( 'docs' ) ? 'docs' : 'page';
	$id        = wp_insert_post( [ 'post_type' => $post_type, 'post_status' => 'publish', 'post_title' => $title, 'post_excerpt' => $body, 'post_content' => '<!-- wp:paragraph --><p>' . esc_html( $body ) . '</p><!-- /wp:paragraph -->' ] );
	if ( 'docs' === $post_type && taxonomy_exists( 'docs_category' ) ) {
		wp_set_object_terms( $id, $cat, 'docs_category' );
	}
}
wp_insert_post( [ 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'Pricing', 'post_content' => '<!-- wp:paragraph --><p>Fernleaf Gallery Pro costs $49 a year for 1 site and $99 a year for 5 sites. Every plan includes a year of updates and support.</p><!-- /wp:paragraph -->' ] );

// An inbox, the way the app makes one (the relay is stubbed).
$request = new WP_REST_Request( 'POST', '/bridle/v1/inboxes' );
$request->set_header( 'content-type', 'application/json' );
$request->set_body( wp_json_encode( [ 'display_name' => 'Support', 'email_address' => 'support@fernleaf.co' ] ) );
$inbox = rest_do_request( $request )->get_data();
$inbox = ( new Bridle\Models\Inbox() )->get_by_id( (int) ( $inbox['id'] ?? 0 ) );
Bridle\Services\InboxAiSettings::update( (int) $inbox->id, [ 'agent_mode' => 'draft' ] );
Settings::update_many( [ 'chat_inbox_id' => (int) $inbox->id ] );

// Customer mail, through the real webhook.
$mail = [
	[ 'Maya Chen', 'maya.chen@gmail.com', 'Gallery is blank on Safari 17', "Hi, the gallery on my homepage is blank in Safari 17 but fine in Chrome. Any idea?\n\nMaya" ],
	[ 'Lucas Moreau', 'lucas@moreaustudio.fr', 'Can I use it on a staging site?', "Hello! Does my 1-site licence also work on my staging site?\n\nThanks, Lucas" ],
	[ 'Ben Turner', 'ben@turnerbikes.com', 'Do updates come with Pro?', "Hey, if I buy Pro, do I get updates, and for how long?\n\nBen" ],
	[ 'Sofia Rossi', 'sofia@rossiceramics.it', 'Third time asking, my shop is down', "This is the third time I'm writing. Since your last update my shop page shows a white screen and I'm losing sales. Fix it today or I want my money back.\n\nSofia" ],
	[ 'Jonas Berg', 'jonas@bergphoto.se', 'Refund for order 2187', "I bought the 5-site plan by mistake. Can I get a refund for order 2187?\n\nJonas" ],
	[ 'Amara Okoye', 'amara@okoyedesign.com', 'Moving galleries to a new site', "We're moving to a new WordPress site. How do I bring my galleries over?\n\nAmara" ],
	[ 'Stripe', 'receipts@stripe.com', 'Your receipt from Fernleaf #2041', 'Receipt #2041. Amount paid: $49.00.' ],
];
$i = 0;
foreach ( $mail as [ $name, $email, $subject, $text ] ) {
	$i++;
	$req = new WP_REST_Request( 'POST', '/bridle/v1/inbound-email' );
	$req->set_header( 'content-type', 'application/json' );
	$req->set_header( 'X-Bridle-Auth', $inbox->webhook_secret );
	$req->set_body(
		wp_json_encode(
			[
				'to'         => $inbox->forwarding_address,
				'from'       => $email,
				'from_name'  => $name,
				'subject'    => $subject,
				'text'       => $text,
				'html'       => wpautop( esc_html( $text ) ),
				'message_id' => "<demo-{$i}@example.com>",
			] + ( 'receipts@stripe.com' === $email ? [ 'precedence' => 'bulk', 'auto_submitted' => 'auto-generated', 'list_unsubscribe' => 'https://stripe.com/unsubscribe' ] : [] )
		)
	);
	rest_do_request( $req );
}

// The agent drafts now rather than in the background.
global $wpdb;
foreach ( $wpdb->get_col( "SELECT id FROM {$wpdb->prefix}bridle_conversations WHERE status = 'active' AND is_automated = 0" ) as $id ) {
	Bridle\Services\AgentService::draft( (int) $id );
}

// An upset customer always waits for a person. The stand-in AI can't judge
// mood, so mark Sofia's email the way a real model would.
$sofia = (int) $wpdb->get_var( $wpdb->prepare( "SELECT c.id FROM {$wpdb->prefix}bridle_conversations c JOIN {$wpdb->prefix}bridle_customers u ON u.id = c.customer_id WHERE u.email = %s", 'sofia@rossiceramics.it' ) );
if ( $sofia ) {
	Bridle\Services\AgentService::store_draft(
		$sofia,
		'<p>Hi Sofia, I’m so sorry about your shop page. I’m looking at it now and will write back within the hour.</p>',
		[ 'source' => 'agent', 'verified' => true, 'confidence' => 'low', 'needs_human_reason' => 'Upset customer. Wants a fix today or a refund.', 'flags' => [ 'upset' ], 'grounded_in' => [] ]
	);
}

// Spread the mail over the morning, so the inbox shows real times.
$order = [ 'maya.chen@gmail.com' => 12, 'sofia@rossiceramics.it' => 38, 'lucas@moreaustudio.fr' => 64, 'ben@turnerbikes.com' => 97, 'jonas@bergphoto.se' => 131, 'amara@okoyedesign.com' => 176, 'receipts@stripe.com' => 205 ];
foreach ( $order as $email => $minutes ) {
	$when = gmdate( 'Y-m-d H:i:s', time() - $minutes * 60 );
	$cid  = (int) $wpdb->get_var( $wpdb->prepare( "SELECT c.id FROM {$wpdb->prefix}bridle_conversations c JOIN {$wpdb->prefix}bridle_customers u ON u.id = c.customer_id WHERE u.email = %s", $email ) );
	if ( $cid ) {
		$wpdb->update( "{$wpdb->prefix}bridle_conversations", [ 'created_at' => $when, 'last_activity_at' => $when ], [ 'id' => $cid ] );
		$wpdb->update( "{$wpdb->prefix}bridle_threads", [ 'created_at' => $when ], [ 'conversation_id' => $cid ] );
	}
}

echo "seeded\n";
