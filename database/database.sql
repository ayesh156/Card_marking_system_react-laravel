-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.29 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for card_marking_system
CREATE DATABASE IF NOT EXISTS `card_marking_system` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `card_marking_system`;

-- Dumping structure for table card_marking_system.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_name` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table card_marking_system.categories: ~2 rows (approximately)
INSERT INTO `categories` (`id`, `category_name`, `created_at`, `updated_at`) VALUES
	(1, 'Spoken', '2025-04-28 13:39:14', '2025-04-28 13:39:15'),
	(2, 'Theory', '2025-04-28 13:39:25', '2025-04-28 13:39:26'),
	(3, 'Paper', '2025-04-28 14:35:50', '2025-04-28 14:35:50'),
	(4, 'Group', '2025-05-01 09:12:31', '2025-05-01 09:12:32');

-- Dumping structure for table card_marking_system.classes
CREATE TABLE IF NOT EXISTS `classes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `class_name` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table card_marking_system.classes: ~3 rows (approximately)
INSERT INTO `classes` (`id`, `class_name`, `updated_at`, `created_at`) VALUES
	(1, 'English', '2025-04-28 13:39:01', '2025-04-28 13:39:02'),
	(2, 'Scholarship', '2025-04-28 14:29:22', '2025-04-28 14:29:23'),
	(3, 'Mathematics', '2025-04-28 14:29:04', '2025-04-28 14:29:05');

-- Dumping structure for table card_marking_system.days
CREATE TABLE IF NOT EXISTS `days` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `day_name` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table card_marking_system.days: ~7 rows (approximately)
INSERT INTO `days` (`id`, `day_name`, `created_at`, `updated_at`) VALUES
	(1, 'Monday', '2025-04-08 13:15:06', '2025-04-08 13:15:07'),
	(2, 'Tuesday', '2025-04-08 13:15:14', '2025-04-08 13:15:15'),
	(3, 'Wednesday', '2025-04-08 13:15:37', '2025-04-08 13:15:38'),
	(4, 'Thursday', '2025-04-08 13:15:47', '2025-04-08 13:15:48'),
	(5, 'Friday', '2025-04-08 13:16:11', '2025-04-08 13:16:12'),
	(6, 'Saturday', '2025-04-08 13:16:28', '2025-04-08 13:16:29'),
	(7, 'Sunday', '2025-04-08 13:17:09', '2025-04-08 13:17:10');

-- Dumping structure for table card_marking_system.grades
CREATE TABLE IF NOT EXISTS `grades` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `grade_name` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table card_marking_system.grades: ~12 rows (approximately)
INSERT INTO `grades` (`id`, `grade_name`, `updated_at`, `created_at`) VALUES
	(1, 'Grade 1', '2025-04-28 14:21:55', '2025-04-28 14:21:55'),
	(2, 'Grade 2', '2025-04-28 14:22:02', '2025-04-28 14:22:02'),
	(3, 'Grade 3', '2025-04-28 14:34:28', '2025-04-28 14:34:29'),
	(4, 'Grade 4', '2025-04-28 17:21:13', '2025-04-28 17:21:14'),
	(5, 'Grade 5', '2025-04-28 17:21:25', '2025-04-28 17:21:25'),
	(6, 'Grade 6', '2025-04-28 17:21:31', '2025-04-28 17:21:32'),
	(7, 'Grade 7', '2025-04-28 17:21:38', '2025-04-28 17:21:39'),
	(8, 'Grade 8', '2025-04-28 17:21:45', '2025-04-28 17:21:45'),
	(9, 'Grade 9', '2025-04-28 17:21:51', '2025-04-28 17:21:52'),
	(10, 'Grade 10', '2025-04-28 17:21:59', '2025-04-28 17:22:00'),
	(11, 'Grade 11', '2025-04-28 17:22:06', '2025-04-28 17:22:06'),
	(19, 'Nursery', '2025-04-28 13:39:36', '2025-04-28 13:39:36');

-- Dumping structure for table card_marking_system.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table card_marking_system.migrations: ~8 rows (approximately)
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(5, '2025_03_01_075325_create_months_table', 5),
	(6, '2025_03_01_075335_create_years_table', 5),
	(27, '2025_04_08_112801_create_students_table', 7),
	(30, '2025_04_08_130648_create_days_table', 9),
	(31, '2025_04_08_111714_create_classes_table', 10),
	(35, '2025_04_08_120337_create_student_reports_table', 11),
	(38, '2025_04_24_182755_create_users_table', 12),
	(39, '2025_04_28_195636_create_sessions_table', 13);

-- Dumping structure for table card_marking_system.months
CREATE TABLE IF NOT EXISTS `months` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `month` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table card_marking_system.months: ~12 rows (approximately)
INSERT INTO `months` (`id`, `month`, `created_at`, `updated_at`) VALUES
	(1, 'January', '2025-03-01 11:15:42', '2025-03-01 11:15:43'),
	(2, 'February', '2025-03-01 11:15:51', '2025-03-01 11:15:52'),
	(3, 'March', '2025-03-01 11:16:00', '2025-03-01 11:16:01'),
	(4, 'April', '2025-04-02 08:53:20', '2025-04-02 08:53:20'),
	(5, 'May', '2025-04-25 09:59:52', '2025-04-25 09:59:53'),
	(6, 'June', '2025-04-25 11:00:00', '2025-04-25 11:00:00'),
	(7, 'July', '2025-04-25 11:00:00', '2025-04-25 11:00:00'),
	(8, 'August', '2025-04-25 11:00:00', '2025-04-25 11:00:00'),
	(9, 'September', '2025-04-25 11:00:00', '2025-04-25 11:00:00'),
	(10, 'October', '2025-04-25 11:00:00', '2025-04-25 11:00:00'),
	(11, 'November', '2025-04-25 11:00:00', '2025-04-25 11:00:00'),
	(12, 'December', '2025-04-25 11:00:00', '2025-04-25 11:00:00');

-- Dumping structure for table card_marking_system.students
CREATE TABLE IF NOT EXISTS `students` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sno` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address1` text COLLATE utf8mb4_unicode_ci,
  `address2` text COLLATE utf8mb4_unicode_ci,
  `school` text COLLATE utf8mb4_unicode_ci,
  `g_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `g_mobile` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `g_whatsapp` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `students_sno_unique` (`sno`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table card_marking_system.students: ~9 rows (approximately)
INSERT INTO `students` (`id`, `sno`, `name`, `address1`, `address2`, `school`, `g_name`, `g_mobile`, `g_whatsapp`, `gender`, `dob`, `created_at`, `updated_at`) VALUES
	(13, '0001', 'Eshara2', 'Ellawela2', 'Kamburupitiya2', 'Narandeniya2', 'Nilantha2', '0783233760', '0783233760', 'female', '2001-03-03', '2025-04-04 23:28:54', '2025-05-02 09:40:46'),
	(14, '0002', 'Thisara', NULL, NULL, NULL, NULL, NULL, '0783233760', 'male', NULL, '2025-04-11 23:30:11', '2025-04-25 15:27:26'),
	(15, '0003', 'Thathsara', NULL, NULL, NULL, NULL, NULL, '0771900253', 'male', NULL, '2024-04-21 23:30:57', '2025-04-21 23:30:57'),
	(16, '0004', 'Ayesh', 'Diddenipotha', 'Makandura', 'Narandeniya', 'Shriyani', '0761066698', '0771900253', 'male', '2001-02-28', '2025-04-14 23:31:18', '2025-04-21 23:31:18'),
	(17, '2300', 'Dinesh', NULL, NULL, NULL, NULL, NULL, '0712345682', 'female', NULL, '2025-04-25 09:52:15', '2025-04-25 09:52:15'),
	(18, '2312', 'Thissa', NULL, NULL, NULL, NULL, NULL, '0712345682', 'male', NULL, '2025-04-25 10:39:43', '2025-04-25 10:39:43'),
	(19, '2311', 'Sadiru', NULL, NULL, NULL, NULL, NULL, '0712345688', 'male', NULL, '2025-04-25 15:28:13', '2025-04-25 16:39:37'),
	(22, '0005', 'Sanduni Wasana', '18 Post, Makandura.', NULL, 'Narandeniya', 'Kumara', '0783233760', '0783233760', 'female', '2001-02-05', '2025-05-01 16:31:07', '2025-05-01 16:31:07'),
	(23, '0006', 'Sana', 'Rukmalgahahena, Diddenipotha, Makandura.', NULL, 'Narandeniya', 'Chathura', '0712345683', '0783233760', 'female', '2001-05-02', '2025-05-02 09:39:34', '2025-05-02 09:39:34'),
	(24, '0007', 'Tharindu Lakshan', 'Rukmalgahahena, Diddenipotha, Makandura.', NULL, 'Narandeniya', 'Chathura2', '0761066697', '0712345652', 'male', '2001-05-03', '2025-05-03 04:29:14', '2025-05-03 05:19:13'),
	(25, '0008', 'Dilshan Samesh', 'Rukmalgahahena, Diddenipotha, Makandura.', 'Kamburupitiya', 'Narandeniya', 'NIlantha', '0712345678', '0761066699', 'male', '2001-05-06', '2025-05-06 16:18:07', '2025-05-06 16:18:07'),
	(28, '0009', 'Sandeepa Deshan', NULL, NULL, NULL, NULL, NULL, '0783233760', 'male', '2001-05-22', '2025-05-08 12:21:50', '2025-05-08 12:21:50'),
	(29, '2324', 'Sandun Dilshan', NULL, NULL, NULL, NULL, NULL, '0717522706', 'male', '2001-05-01', '2025-05-08 12:23:16', '2025-05-08 12:23:16');

-- Dumping structure for table card_marking_system.students_has_tuitions
CREATE TABLE IF NOT EXISTS `students_has_tuitions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `tuition_id` bigint unsigned NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_students_has_tuitions_students1_idx` (`student_id`),
  KEY `fk_students_has_tuitions_tuitions1_idx` (`tuition_id`),
  CONSTRAINT `fk_students_has_tuitions_students1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `fk_students_has_tuitions_tuitions1` FOREIGN KEY (`tuition_id`) REFERENCES `tuitions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table card_marking_system.students_has_tuitions: ~15 rows (approximately)
INSERT INTO `students_has_tuitions` (`id`, `student_id`, `tuition_id`, `status`, `created_at`, `updated_at`) VALUES
	(1, 13, 25, 1, '2025-04-28 13:45:17', '2025-05-01 15:23:35'),
	(2, 14, 25, 1, '2025-05-01 11:11:00', '2025-05-01 11:11:01'),
	(3, 15, 25, 0, '2025-05-01 11:36:39', '2025-05-01 11:36:39'),
	(4, 13, 14, 1, '2025-05-01 11:52:24', '2025-05-02 09:54:16'),
	(5, 16, 25, 0, '2025-05-01 13:18:46', '2025-05-01 15:24:07'),
	(6, 23, 25, 1, '2025-03-02 09:39:34', '2025-05-07 16:53:31'),
	(7, 23, 14, 1, '2025-05-02 09:53:56', '2025-05-02 09:53:56'),
	(8, 22, 8, 0, '2025-05-02 09:55:15', '2025-05-02 09:55:15'),
	(9, 24, 1, 0, '2025-01-02 04:29:15', '2025-05-03 10:58:55'),
	(10, 23, 8, 0, '2025-05-03 07:02:00', '2025-05-03 07:02:00'),
	(11, 23, 9, 0, '2025-05-03 07:08:39', '2025-05-03 07:08:39'),
	(12, 13, 11, 1, '2025-05-03 07:50:31', '2025-05-03 07:50:31'),
	(13, 25, 21, 1, '2025-05-06 16:18:07', '2025-05-06 16:18:07'),
	(14, 22, 1, 1, '2025-05-08 07:40:07', '2025-05-08 07:40:07'),
	(15, 17, 20, 1, '2025-05-08 08:46:48', '2025-05-08 08:46:48'),
	(16, 28, 1, 1, '2025-05-08 12:21:50', '2025-05-08 12:21:50'),
	(17, 29, 1, 1, '2025-05-08 12:23:16', '2025-05-08 12:23:16'),
	(18, 25, 15, 1, '2025-05-08 13:07:17', '2025-05-08 13:07:17');

-- Dumping structure for table card_marking_system.student_reports
CREATE TABLE IF NOT EXISTS `student_reports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `tuition_id` bigint unsigned NOT NULL,
  `month_id` bigint unsigned NOT NULL,
  `year_id` bigint unsigned NOT NULL,
  `week1` tinyint(1) NOT NULL DEFAULT '0',
  `week2` tinyint(1) NOT NULL DEFAULT '0',
  `week3` tinyint(1) NOT NULL DEFAULT '0',
  `week4` tinyint(1) NOT NULL DEFAULT '0',
  `week5` tinyint(1) NOT NULL DEFAULT '0',
  `paid` tinyint(1) NOT NULL DEFAULT '0',
  `reminder_week3` tinyint(1) DEFAULT '0',
  `reminder_week4` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_reports_student_id_foreign` (`student_id`),
  KEY `student_reports_month_id_foreign` (`month_id`),
  KEY `student_reports_year_id_foreign` (`year_id`),
  KEY `fk_student_reports_tuitions1_idx` (`tuition_id`),
  CONSTRAINT `fk_student_reports_tuitions1` FOREIGN KEY (`tuition_id`) REFERENCES `tuitions` (`id`),
  CONSTRAINT `student_reports_month_id_foreign` FOREIGN KEY (`month_id`) REFERENCES `months` (`id`) ON DELETE CASCADE,
  CONSTRAINT `student_reports_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `student_reports_year_id_foreign` FOREIGN KEY (`year_id`) REFERENCES `years` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table card_marking_system.student_reports: ~11 rows (approximately)
INSERT INTO `student_reports` (`id`, `student_id`, `tuition_id`, `month_id`, `year_id`, `week1`, `week2`, `week3`, `week4`, `week5`, `paid`, `reminder_week3`, `reminder_week4`, `created_at`, `updated_at`) VALUES
	(1, 14, 25, 5, 1, 1, 1, 0, 0, 0, 0, 1, 1, '2025-04-25 01:59:42', '2025-05-08 13:03:13'),
	(2, 13, 25, 5, 1, 1, 1, 1, 0, 0, 0, 1, 1, '2025-04-25 02:55:25', '2025-05-08 13:03:13'),
	(3, 15, 25, 5, 1, 1, 1, 0, 0, 1, 0, 1, 1, '2025-04-25 02:55:49', '2025-05-08 12:46:23'),
	(11, 16, 25, 5, 1, 0, 0, 0, 1, 1, 1, 0, 0, '2025-05-01 15:00:31', '2025-05-01 15:11:09'),
	(12, 13, 14, 5, 1, 0, 1, 0, 0, 0, 1, 0, 0, '2025-05-01 15:02:26', '2025-05-01 15:02:40'),
	(13, 22, 8, 5, 1, 1, 1, 0, 0, 0, 0, 0, 0, '2025-05-02 09:56:03', '2025-05-02 09:56:55'),
	(14, 23, 14, 5, 1, 0, 0, 0, 0, 0, 1, 0, 0, '2025-05-02 09:57:25', '2025-05-02 09:57:25'),
	(15, 13, 25, 4, 1, 1, 1, 0, 0, 0, 0, 0, 0, '2025-05-02 17:27:34', '2025-05-02 17:27:35'),
	(17, 13, 1, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, '2025-02-03 10:50:04', '2025-05-03 10:50:04'),
	(18, 25, 21, 5, 1, 1, 0, 1, 0, 0, 0, 0, 0, '2025-05-06 16:18:15', '2025-05-06 16:18:32'),
	(19, 22, 1, 5, 1, 0, 0, 1, 0, 0, 0, 0, 0, '2025-05-08 07:41:20', '2025-05-08 08:46:30'),
	(20, 29, 1, 5, 1, 0, 1, 0, 0, 0, 0, 0, 0, '2025-05-08 12:23:58', '2025-05-08 12:23:58'),
	(21, 28, 1, 5, 1, 0, 1, 0, 0, 0, 0, 0, 0, '2025-05-08 12:24:00', '2025-05-08 12:24:00');

-- Dumping structure for table card_marking_system.tuitions
CREATE TABLE IF NOT EXISTS `tuitions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `day_id` bigint unsigned NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  `class_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tuitions_days1_idx` (`day_id`),
  KEY `fk_tuitions_categories1_idx` (`category_id`),
  KEY `fk_tuitions_classes1_idx` (`class_id`),
  CONSTRAINT `fk_tuitions_categories1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `fk_tuitions_classes1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  CONSTRAINT `fk_tuitions_days1` FOREIGN KEY (`day_id`) REFERENCES `days` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table card_marking_system.tuitions: ~30 rows (approximately)
INSERT INTO `tuitions` (`id`, `day_id`, `category_id`, `class_id`, `created_at`, `updated_at`) VALUES
	(1, 7, 2, 1, '2025-04-28 13:40:25', '2025-05-03 04:54:06'),
	(2, 1, 1, 1, '2025-04-28 13:42:45', '2025-05-03 04:54:32'),
	(3, 6, 4, 1, '2025-04-28 14:40:05', '2025-05-03 04:57:20'),
	(4, 3, 1, 1, '2025-04-28 16:47:55', '2025-05-03 04:54:44'),
	(5, 1, 4, 1, '2025-04-28 16:51:42', '2025-05-03 04:55:22'),
	(6, 4, 2, 2, '2025-04-28 16:52:40', '2025-04-28 16:52:41'),
	(7, 4, 2, 2, '2025-04-28 17:04:31', '2025-04-28 17:04:32'),
	(8, 5, 1, 1, '2025-05-01 09:02:17', '2025-05-02 14:23:26'),
	(9, 3, 1, 1, '2025-05-01 09:09:27', '2025-05-01 09:09:27'),
	(10, 5, 2, 2, '2025-05-01 09:17:35', '2025-05-01 09:17:37'),
	(11, 2, 3, 2, '2025-05-01 09:20:30', '2025-05-01 09:20:31'),
	(12, 7, 3, 2, '2025-05-01 09:21:11', '2025-05-01 09:21:12'),
	(13, 4, 3, 2, '2025-05-01 09:21:56', '2025-05-01 09:21:56'),
	(14, 4, 2, 3, '2025-05-01 09:27:42', '2025-05-01 09:27:42'),
	(15, 3, 2, 3, '2025-05-01 09:28:21', '2025-05-01 09:28:21'),
	(16, 6, 2, 3, '2025-05-01 09:30:51', '2025-05-01 09:30:52'),
	(17, 1, 2, 3, '2025-05-01 09:31:48', '2025-05-01 09:31:48'),
	(18, 2, 2, 3, '2025-05-01 09:33:05', '2025-05-01 09:33:06'),
	(19, 6, 2, 3, '2025-05-01 09:33:38', '2025-05-01 09:33:39'),
	(20, 6, 2, 1, '2025-05-01 09:36:19', '2025-05-03 04:58:54'),
	(21, 6, 2, 1, '2025-05-01 09:36:58', '2025-05-03 05:02:25'),
	(22, 6, 2, 1, '2025-05-01 09:37:34', '2025-05-01 09:37:34'),
	(23, 6, 2, 1, '2025-05-01 09:38:29', '2025-05-03 05:02:56'),
	(24, 6, 2, 1, '2025-05-01 09:39:15', '2025-05-01 09:39:15'),
	(25, 7, 2, 1, '2025-05-01 09:40:03', '2025-05-03 05:03:15'),
	(26, 2, 2, 1, '2025-05-01 09:40:47', '2025-05-03 05:03:29'),
	(27, 5, 2, 1, '2025-05-01 09:41:19', '2025-05-03 05:03:41'),
	(28, 7, 2, 1, '2025-05-01 09:41:57', '2025-05-03 05:03:51'),
	(29, 4, 2, 1, '2025-05-01 09:42:38', '2025-05-01 09:42:39'),
	(30, 3, 2, 1, '2025-05-01 09:43:09', '2025-05-03 05:04:12');

-- Dumping structure for table card_marking_system.tuitions_has_grades
CREATE TABLE IF NOT EXISTS `tuitions_has_grades` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `tuition_id` bigint unsigned NOT NULL,
  `grade_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tuitions_has_grades_grades1_idx` (`grade_id`),
  KEY `fk_tuitions_has_grades_tuitions1_idx` (`tuition_id`),
  CONSTRAINT `fk_tuitions_has_grades_grades1` FOREIGN KEY (`grade_id`) REFERENCES `grades` (`id`),
  CONSTRAINT `fk_tuitions_has_grades_tuitions1` FOREIGN KEY (`tuition_id`) REFERENCES `tuitions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table card_marking_system.tuitions_has_grades: ~35 rows (approximately)
INSERT INTO `tuitions_has_grades` (`id`, `tuition_id`, `grade_id`, `created_at`, `updated_at`) VALUES
	(1, 2, 2, '2025-05-01 09:06:23', '2025-05-01 09:06:24'),
	(2, 2, 3, '2025-05-01 09:06:42', '2025-05-01 09:06:43'),
	(3, 4, 4, '2025-05-01 09:07:41', '2025-05-01 09:07:41'),
	(4, 4, 5, '2025-05-01 09:07:59', '2025-05-01 09:08:00'),
	(5, 8, 8, '2025-05-01 09:08:42', '2025-05-01 09:08:43'),
	(6, 8, 9, '2025-05-01 09:08:53', '2025-05-01 09:08:53'),
	(7, 8, 10, '2025-05-01 09:09:05', '2025-05-01 09:09:06'),
	(8, 9, 10, '2025-05-01 09:09:50', '2025-05-01 09:09:50'),
	(9, 9, 11, '2025-05-01 09:10:02', '2025-05-01 09:10:03'),
	(10, 1, 19, '2025-05-01 09:47:53', '2025-05-01 09:47:54'),
	(11, 3, 9, '2025-05-01 09:47:54', '2025-05-01 09:47:55'),
	(12, 5, 1, '2025-05-01 09:14:29', '2025-05-01 09:14:30'),
	(13, 6, 3, '2025-05-01 09:15:28', '2025-05-01 09:15:28'),
	(14, 7, 4, '2025-05-01 09:16:45', '2025-05-01 09:16:46'),
	(15, 10, 5, '2025-05-01 09:17:59', '2025-05-01 09:17:59'),
	(16, 11, 3, '2025-05-01 09:20:48', '2025-05-01 09:20:48'),
	(17, 12, 4, '2025-05-01 09:21:41', '2025-05-01 09:21:42'),
	(18, 13, 5, '2025-05-01 09:22:23', '2025-05-01 09:22:24'),
	(19, 14, 6, '2025-05-01 09:28:01', '2025-05-01 09:28:01'),
	(20, 15, 7, '2025-05-01 09:29:00', '2025-05-01 09:29:00'),
	(21, 16, 8, '2025-05-01 09:31:13', '2025-05-01 09:31:14'),
	(22, 17, 9, '2025-05-01 09:32:17', '2025-05-01 09:32:18'),
	(23, 18, 10, '2025-05-01 09:33:19', '2025-05-01 09:33:19'),
	(24, 19, 11, '2025-05-01 09:34:01', '2025-05-01 09:34:01'),
	(25, 20, 1, '2025-05-01 09:36:38', '2025-05-01 09:36:39'),
	(26, 21, 2, '2025-05-01 09:37:12', '2025-05-01 09:37:13'),
	(28, 22, 3, '2025-05-01 09:37:55', '2025-05-01 09:37:56'),
	(29, 23, 4, '2025-05-01 09:38:56', '2025-05-01 09:38:57'),
	(30, 24, 5, '2025-05-01 09:39:32', '2025-05-01 09:39:33'),
	(31, 25, 6, '2025-05-01 09:40:21', '2025-05-01 09:40:22'),
	(32, 26, 7, '2025-05-01 09:40:59', '2025-05-01 09:40:59'),
	(33, 27, 8, '2025-05-01 09:41:37', '2025-05-01 09:41:38'),
	(34, 28, 9, '2025-05-01 09:42:11', '2025-05-01 09:42:12'),
	(35, 29, 10, '2025-05-01 09:42:52', '2025-05-01 09:42:53'),
	(36, 30, 11, '2025-05-01 09:43:27', '2025-05-01 09:43:28'),
	(102, 8, 11, '2025-05-03 05:08:06', '2025-05-03 05:08:06');

-- Dumping structure for table card_marking_system.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `before_payment_week3` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `before_payment_week4` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `after_payment_template` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `mode` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_path` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table card_marking_system.users: ~0 rows (approximately)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `before_payment_week3`, `before_payment_week4`, `after_payment_template`, `status`, `mode`, `image_path`, `created_at`, `updated_at`) VALUES
	(1, 'ZYNERGY', 'zynergyedu@gmail.com', '1234', 'before_pay_week3', 'before_pay_message', 'after_payment_en', 1, 'D', 'uploads/users/zynergy_485784.jpeg', '2025-04-24 13:32:25', '2025-05-06 16:16:17'),
	(2, 'ADMIN', 'admin@gmail.com', NULL, NULL, NULL, NULL, 1, 'D', 'uploads/users/zynergy_485784.jpeg', '2025-05-06 12:08:29', '2025-05-06 16:16:15');

-- Dumping structure for table card_marking_system.years
CREATE TABLE IF NOT EXISTS `years` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `year` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table card_marking_system.years: ~2 rows (approximately)
INSERT INTO `years` (`id`, `year`, `created_at`, `updated_at`) VALUES
	(1, 2025, '2025-03-01 10:44:13', '2025-03-01 10:44:15'),
	(2, 2026, '2025-03-01 10:44:25', '2025-03-01 10:44:25'),
	(3, 2027, '2025-03-01 07:14:48', '2025-03-01 07:14:48');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
