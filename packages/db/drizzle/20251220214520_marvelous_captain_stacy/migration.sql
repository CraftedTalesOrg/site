CREATE TABLE `categories` (
	`id` text PRIMARY KEY,
	`name` text(100) NOT NULL UNIQUE,
	`slug` text(100) NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY,
	`username` text(255) NOT NULL UNIQUE,
	`bio` text,
	`avatar_id` text,
	`roles` text DEFAULT '[]' NOT NULL,
	`email` text(255) NOT NULL UNIQUE,
	`email_verified` integer DEFAULT 0 NOT NULL,
	`password` text,
	`two_factor_enabled` integer DEFAULT 0 NOT NULL,
	`two_factor_secret` text,
	`enabled` integer DEFAULT 1 NOT NULL,
	`deleted` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	CONSTRAINT `fk_users_avatar_id_media_id_fk` FOREIGN KEY (`avatar_id`) REFERENCES `media`(`id`)
);
--> statement-breakpoint
CREATE TABLE `mod_categories` (
	`id` text PRIMARY KEY,
	`mod_id` text NOT NULL,
	`category_id` text NOT NULL,
	CONSTRAINT `fk_mod_categories_mod_id_mods_id_fk` FOREIGN KEY (`mod_id`) REFERENCES `mods`(`id`) ON DELETE cascade,
	CONSTRAINT `fk_mod_categories_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `mods` (
	`id` text PRIMARY KEY,
	`slug` text(255) NOT NULL UNIQUE,
	`name` text(255) NOT NULL,
	`icon_id` text,
	`summary` text NOT NULL,
	`description` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`visibility` text DEFAULT 'public' NOT NULL,
	`approved` integer DEFAULT 0 NOT NULL,
	`license` text(100) NOT NULL,
	`license_url` text,
	`issue_tracker_url` text,
	`source_code_url` text,
	`wiki_url` text,
	`discord_invite_url` text,
	`donation_urls` text,
	`downloads` integer DEFAULT 0 NOT NULL,
	`likes` integer DEFAULT 0 NOT NULL,
	`owner_id` text NOT NULL,
	`enabled` integer DEFAULT 1 NOT NULL,
	`deleted` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	CONSTRAINT `fk_mods_icon_id_media_id_fk` FOREIGN KEY (`icon_id`) REFERENCES `media`(`id`),
	CONSTRAINT `fk_mods_owner_id_users_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `mod_versions` (
	`id` text PRIMARY KEY,
	`mod_id` text NOT NULL,
	`name` text(100) NOT NULL,
	`game_versions` text DEFAULT '[]' NOT NULL,
	`channel` text DEFAULT 'release' NOT NULL,
	`url` text NOT NULL,
	`size` integer NOT NULL,
	`changelog` text DEFAULT '' NOT NULL,
	`downloads` integer DEFAULT 0 NOT NULL,
	`enabled` integer DEFAULT 1 NOT NULL,
	`deleted` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`published_at` integer,
	CONSTRAINT `fk_mod_versions_mod_id_mods_id_fk` FOREIGN KEY (`mod_id`) REFERENCES `mods`(`id`) ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY,
	`filename` text NOT NULL,
	`url` text NOT NULL,
	`size` integer NOT NULL,
	`mime_type` text NOT NULL,
	`width` integer,
	`height` integer,
	`enabled` integer DEFAULT 1 NOT NULL,
	`deleted` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `mod_likes` (
	`id` text PRIMARY KEY,
	`mod_id` text NOT NULL,
	`user_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	CONSTRAINT `fk_mod_likes_mod_id_mods_id_fk` FOREIGN KEY (`mod_id`) REFERENCES `mods`(`id`) ON DELETE cascade,
	CONSTRAINT `fk_mod_likes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` text PRIMARY KEY,
	`reporter_id` text,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`reason` text(100) NOT NULL,
	`description` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`reviewed_by` text,
	`resolution` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	CONSTRAINT `fk_reports_reporter_id_users_id_fk` FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON DELETE set null,
	CONSTRAINT `fk_reports_reviewed_by_users_id_fk` FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON DELETE set null
);
