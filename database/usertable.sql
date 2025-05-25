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

-- Dumping structure for table card_marking_system.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `before_payment_week3` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `before_payment_week4` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `after_payment_template` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `after_payment_nursery_template` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `after_payment_grade1_template` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `after_payment_grade2_template` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `after_payment_grade3_template` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `after_payment_grade4_template` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `after_payment_grade5_template` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `after_payment_grade6_template` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `after_payment_grade7_template` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `after_payment_grade8_template` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `after_payment_grade9_template` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `after_payment_grade10_template` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `after_payment_grade11_template` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `after_payment_spoken_template` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `mode` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_path` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table card_marking_system.users: ~2 rows (approximately)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `before_payment_week3`, `before_payment_week4`, `after_payment_template`, `after_payment_nursery_template`, `after_payment_grade1_template`, `after_payment_grade2_template`, `after_payment_grade3_template`, `after_payment_grade4_template`, `after_payment_grade5_template`, `after_payment_grade6_template`, `after_payment_grade7_template`, `after_payment_grade8_template`, `after_payment_grade9_template`, `after_payment_grade10_template`, `after_payment_grade11_template`, `after_payment_spoken_template`, `status`, `mode`, `image_path`, `created_at`, `updated_at`) VALUES
	(1, 'ZYNERGY', 'zynergyedu@gmail.com', '1234', 'payweek3', 'payweek4', 'after_pay_sin', 'pay0', 'pay1', 'pay2', 'pay3', 'pay4', 'pay5', 'pay06', 'pay7', 'pay8', 'pay9', 'pay10', 'pay11', 'paysp', 1, 'D', 'uploads/users/zynergy_814500.jpeg', '2025-04-24 13:32:25', '2025-05-21 15:12:57'),
	(2, 'ADMIN', 'admin@gmail.com', 'admin1234', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'D', 'uploads/users/zynergy_485784.jpeg', '2025-05-06 12:08:29', '2025-05-06 16:16:15');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
