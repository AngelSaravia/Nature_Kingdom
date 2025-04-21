CREATE DATABASE  IF NOT EXISTS `zoo` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `zoo`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: zoombase-t15.mysql.database.azure.com    Database: zoo
-- ------------------------------------------------------
-- Server version	8.0.40-azure

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alerts`
--

DROP TABLE IF EXISTS `alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alerts` (
  `alert_id` int NOT NULL AUTO_INCREMENT,
  `receiver_id` int DEFAULT NULL,
  `alert_message` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `status` enum('active','resolved') DEFAULT 'active',
  `resolved_at` datetime DEFAULT NULL,
  PRIMARY KEY (`alert_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `alerts_ibfk_1` FOREIGN KEY (`receiver_id`) REFERENCES `employees` (`Employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alerts`
--

LOCK TABLES `alerts` WRITE;
/*!40000 ALTER TABLE `alerts` DISABLE KEYS */;
INSERT INTO `alerts` VALUES (17,9,'Alert: Stock for product \"Safari Hat\" is low. Only 1 items left.','2025-04-09 01:37:40','resolved','2025-04-09 01:37:41'),(18,9,'Notice: Stock for product \"Safari Hat\" was replenished to 5 units.','2025-04-09 01:37:41','resolved',NULL),(19,9,'Alert: Stock for product \"Safari Hat\" is low. Only 1 items left.','2025-04-09 01:37:43','resolved','2025-04-09 01:37:44'),(20,9,'Notice: Stock for product \"Safari Hat\" was replenished to 5 units.','2025-04-09 01:37:44','resolved',NULL),(21,9,'Alert: Stock for product \"Safari Hat\" is low. Only 1 items left.','2025-04-01 09:00:00','resolved','2025-04-01 09:01:00'),(22,9,'Notice: Stock for product \"Safari Hat\" was replenished to 5 units.','2025-04-01 09:01:30','resolved',NULL),(23,9,'Alert: Stock for product \"Zoo Plush Elephant\" is low. Only 2 items left.','2025-04-02 10:00:00','resolved','2025-04-02 10:01:00'),(24,9,'Notice: Stock for product \"Zoo Plush Elephant\" was replenished to 9 units.','2025-04-02 10:01:30','resolved',NULL),(25,9,'Alert: Stock for product \"Lion Plush\" is low. Only 1 items left.','2025-04-03 11:00:00','resolved','2025-04-03 11:01:00'),(26,9,'Notice: Stock for product \"Lion Plush\" was replenished to 7 units.','2025-04-03 11:01:30','resolved',NULL),(27,9,'Alert: Stock for product \"Animal Encyclopedia\" is low. Only 3 items left.','2025-04-04 12:00:00','resolved','2025-04-04 12:01:00'),(28,9,'Notice: Stock for product \"Animal Encyclopedia\" was replenished to 9 units.','2025-04-04 12:01:30','resolved',NULL),(29,9,'Alert: Stock for product \"Zoo Plush Elephant\" is low. Only 0 items left.','2025-04-11 21:36:50','resolved','2025-04-11 21:37:56'),(30,9,'Notice: Stock for product \"Zoo Plush Elephant\" was replenished to 20 units.','2025-04-11 21:37:56','resolved',NULL),(31,9,'Alert: Stock for product \"Zoo Keychain Set\" is low. Only 0 items left.','2025-04-11 21:38:01','resolved','2025-04-11 21:38:05'),(32,9,'Notice: Stock for product \"Zoo Keychain Set\" was replenished to 4 units.','2025-04-11 21:38:05','resolved',NULL),(33,9,'Alert: Stock for product \"Zoo Plush Elephant\" is low. Only 0 items left.','2025-04-12 19:14:41','resolved','2025-04-12 19:14:49'),(34,9,'Notice: Stock for product \"Zoo Plush Elephant\" was replenished to 6 units.','2025-04-12 19:14:49','resolved',NULL),(35,9,'Alert: Stock for product \"Zoo Plush Elephant\" is low. Only 2 items left.','2025-04-12 20:37:17','resolved','2025-04-15 03:32:01'),(39,7,'Animal \"NemoC\" (ID: 74) requires attention. Status: CRITICAL','2025-04-14 01:07:56','resolved','2025-04-14 01:08:16'),(40,7,'Animal \"Milo\" (ID: 48) requires attention. Status: CRITICAL','2025-04-14 01:09:56','resolved','2025-04-14 01:09:58'),(41,7,'Animal \"Milo\" (ID: 48) requires attention. Status: CRITICAL','2025-04-14 01:10:09','resolved','2025-04-14 01:10:18'),(42,7,'Animal \"Blizzard\" (ID: 65) requires attention. Status: CRITICAL','2025-04-14 01:11:27','resolved','2025-04-14 01:11:30'),(43,7,'Animal \"Simba\" (ID: 69) requires attention. Status: CRITICAL','2025-04-14 01:11:31','resolved','2025-04-14 01:11:32'),(44,7,'Animal \"RoyP\" (ID: 78) requires attention. Status: CRITICAL','2025-04-14 01:11:36','resolved','2025-04-14 01:11:40'),(45,7,'Animal \"Blizzard\" (ID: 65) requires attention. Status: CRITICAL','2025-04-14 01:12:03','resolved','2025-04-14 02:47:18'),(46,7,'Animal \"Rango\" (ID: 53) requires attention. Status: CRITICAL','2025-04-14 01:25:55','resolved','2025-04-14 19:35:02'),(47,7,'Animal \"Snap\" (ID: 59) requires attention. Status: CRITICAL','2025-04-14 02:13:21','resolved','2025-04-15 03:29:22'),(48,7,'Animal \"Simba\" (ID: 69) requires attention. Status: CRITICAL','2025-04-14 04:19:15','resolved','2025-04-19 06:30:21'),(49,7,'Animal \"Rango\" (ID: 53) requires attention. Status: CRITICAL','2025-04-14 19:35:09','resolved','2025-04-14 22:20:28'),(50,7,'Animal \"Dusty\" (ID: 50) requires attention. Status: CRITICAL','2025-04-14 19:36:35','resolved','2025-04-14 19:57:03'),(51,9,'Alert: Stock for product \"Animal Encyclopedia\" is low. Only 0 items left.','2025-04-14 19:43:02','resolved','2025-04-14 19:43:40'),(52,9,'Notice: Stock for product \"Animal Encyclopedia\" was replenished to 4 units.','2025-04-14 19:43:40','resolved',NULL),(53,7,'Animal \"Dusty\" (ID: 50) requires attention. Status: CRITICAL','2025-04-14 19:57:07','resolved','2025-04-14 19:57:28'),(54,7,'Animal \"Dusty\" (ID: 50) requires attention. Status: CRITICAL','2025-04-14 22:24:15','resolved','2025-04-15 03:28:23'),(55,9,'Alert: Stock for product \"Safari Hat\" is low. Only 0 items left.','2025-04-14 22:27:19','resolved','2025-04-15 03:37:50'),(56,7,'Animal \"Rosie\" (ID: 55) requires attention. Status: CRITICAL','2025-04-15 03:22:06','resolved','2025-04-15 03:28:48'),(57,7,'Animal \"Pinkie\" (ID: 57) requires attention. Status: CRITICAL','2025-04-15 03:22:13','resolved','2025-04-15 03:28:50'),(58,7,'Animal \"JewelP\" (ID: 79) requires attention. Status: CRITICAL','2025-04-15 03:22:22','resolved','2025-04-15 04:22:37'),(59,7,'Animal \"Pinkie\" (ID: 57) requires attention. Status: CRITICAL','2025-04-15 03:29:02','resolved','2025-04-15 03:29:03'),(60,7,'Animal \"Pinkie\" (ID: 57) requires attention. Status: CRITICAL','2025-04-15 03:29:10','resolved','2025-04-15 03:29:11'),(61,7,'Animal \"Pinkie\" (ID: 57) requires attention. Status: CRITICAL','2025-04-15 03:29:52','resolved','2025-04-15 03:29:54'),(62,9,'Notice: Stock for product \"Zoo Plush Elephant\" was replenished to 5 units.','2025-04-15 03:32:01','resolved',NULL),(63,9,'Alert: Stock for product \"Zoo Keychain Set\" is low. Only 1 items left.','2025-04-15 03:32:09','resolved','2025-04-15 03:38:26'),(64,9,'Alert: Stock for product \"Zoo T-Shirt\" is low. Only 0 items left.','2025-04-15 03:32:24','resolved','2025-04-15 03:38:34'),(65,9,'Notice: Stock for product \"Safari Hat\" was replenished to 5 units.','2025-04-15 03:37:50','resolved',NULL),(66,9,'Alert: Stock for product \"Animal Encyclopedia\" is low. Only 0 items left.','2025-04-15 03:38:00','resolved','2025-04-15 03:38:05'),(67,9,'Notice: Stock for product \"Animal Encyclopedia\" was replenished to 4 units.','2025-04-15 03:38:05','resolved',NULL),(68,9,'Notice: Stock for product \"Zoo Keychain Set\" was replenished to 10 units.','2025-04-15 03:38:26','resolved',NULL),(69,9,'Notice: Stock for product \"Zoo T-Shirt\" was replenished to 4 units.','2025-04-15 03:38:34','resolved',NULL),(70,7,'Animal \"RoyP\" (ID: 78) requires attention. Status: CRITICAL','2025-04-15 04:22:47','resolved','2025-04-15 04:25:00'),(71,7,'Animal \"NemoC\" (ID: 74) requires attention. Status: CRITICAL','2025-04-15 06:01:35','resolved','2025-04-19 06:30:21'),(72,7,'Animal \"DoryC\" (ID: 75) requires attention. Status: CRITICAL','2025-04-15 06:02:51','resolved','2025-04-19 06:30:20'),(73,7,'Animal \"Rosie\" (ID: 55) requires attention. Status: CRITICAL','2025-04-15 07:58:52','resolved','2025-04-15 21:40:16'),(74,7,'Animal \"Snap\" (ID: 59) requires attention. Status: CRITICAL','2025-04-15 09:24:47','resolved','2025-04-16 05:30:20'),(75,7,'Animal \"Chomp\" (ID: 60) requires attention. Status: CRITICAL','2025-04-15 09:43:09','resolved','2025-04-19 06:30:21'),(76,7,'Animal \"Coralita\" (ID: 56) requires attention. Status: CRITICAL','2025-04-15 10:54:54','resolved','2025-04-16 05:31:23'),(77,7,'Animal \"NalaL\" (ID: 70) requires attention. Status: CRITICAL','2025-04-15 10:58:17','resolved','2025-04-15 21:47:18'),(78,9,'Alert: Stock for product \"Lion Plush\" is low. Only 2 items left.','2025-04-15 11:35:06','resolved','2025-04-15 11:35:20'),(79,9,'Notice: Stock for product \"Lion Plush\" was replenished to 5 units.','2025-04-15 11:35:20','resolved',NULL),(80,9,'Alert: Stock for product \"Lion Plush\" is low. Only 0 items left.','2025-04-15 19:21:48','resolved','2025-04-15 22:25:35'),(81,9,'Alert: Stock for product \"Animal Encyclopedia\" is low. Only 0 items left.','2025-04-15 19:21:57','resolved','2025-04-15 22:25:24'),(82,9,'Alert: Stock for product \"Zoo Plush Elephant\" is low. Only 1 items left.','2025-04-15 22:23:26','resolved','2025-04-15 22:24:50'),(83,9,'Notice: Stock for product \"Zoo Plush Elephant\" was replenished to 70 units.','2025-04-15 22:24:50','resolved',NULL),(84,9,'Notice: Stock for product \"Animal Encyclopedia\" was replenished to 10 units.','2025-04-15 22:25:24','resolved',NULL),(85,9,'Notice: Stock for product \"Lion Plush\" was replenished to 10 units.','2025-04-15 22:25:35','resolved',NULL),(86,9,'Alert: Stock for product \"Zoo Plush Elephant\" is low. Only 0 items left.','2025-04-16 01:05:13','resolved','2025-04-16 08:01:45'),(87,7,'Animal \"Dusty\" (ID: 50) requires attention. Status: CRITICAL','2025-04-16 03:14:56','resolved','2025-04-16 03:15:02'),(88,7,'Animal \"Rosie\" (ID: 55) requires attention. Status: CRITICAL','2025-04-16 05:37:57','resolved','2025-04-16 11:53:57'),(89,9,'Alert: Stock for product \"Lion Plush\" is low. Only 2 items left.','2025-04-16 07:56:47','resolved','2025-04-16 08:01:42'),(90,9,'Notice: Stock for product \"Zoo Keychain Set\" was replenished to 10 units.','2025-04-16 08:01:41','resolved',NULL),(91,9,'Notice: Stock for product \"Lion Plush\" was replenished to 10 units.','2025-04-16 08:01:42','resolved',NULL),(92,9,'Notice: Stock for product \"Zoo Plush Elephant\" was replenished to 10 units.','2025-04-16 08:01:45','resolved',NULL),(93,9,'Alert: Stock for product \"Zoo Plush Elephant\" is low. Only 0 items left.','2025-04-16 08:01:52','resolved','2025-04-16 19:49:52'),(94,9,'Alert: Stock for product \"Zoo Keychain Set\" is low. Only 2 items left.','2025-04-16 08:01:54','resolved','2025-04-16 22:34:50'),(95,9,'Alert: Stock for product \"Lion Plush\" is low. Only 3 items left.','2025-04-16 08:01:56','resolved','2025-04-17 22:26:53'),(96,7,'Animal \"Rango\" (ID: 53) requires attention. Status: CRITICAL','2025-04-16 19:45:27','resolved','2025-04-16 22:34:00'),(97,7,'Animal \"Charlie\" (ID: 45) requires attention. Status: CRITICAL','2025-04-16 19:47:15','resolved','2025-04-16 19:47:39'),(98,9,'Notice: Stock for product \"Zoo Plush Elephant\" was replenished to 6 units.','2025-04-16 19:49:52','resolved',NULL),(99,9,'Notice: Stock for product \"Zoo Keychain Set\" was replenished to 10 units.','2025-04-16 22:34:50','resolved',NULL),(100,9,'Alert: Stock for product \"Zoo Plush Elephant\" is low. Only 4 items left.','2025-04-17 22:12:46','resolved','2025-04-17 22:26:37'),(101,7,'Animal \"Dusty\" (ID: 50) requires attention. Status: CRITICAL','2025-04-17 22:18:25','resolved','2025-04-17 22:20:52'),(102,7,'Animal \"Spike\" (ID: 51) requires attention. Status: CRITICAL','2025-04-17 22:19:25','resolved','2025-04-19 06:30:55'),(103,7,'Animal \"Scorch\" (ID: 52) requires attention. Status: CRITICAL','2025-04-17 22:19:29','resolved','2025-04-19 06:30:54'),(104,9,'Notice: Stock for product \"Zoo Plush Elephant\" was replenished to 7 units.','2025-04-17 22:26:37','resolved',NULL),(105,9,'Alert: Stock for product \"Animal Encyclopedia\" is low. Only 0 items left.','2025-04-17 22:26:45','resolved','2025-04-19 13:43:29'),(106,9,'Notice: Stock for product \"Lion Plush\" was replenished to 6 units.','2025-04-17 22:26:53','resolved',NULL),(107,7,'Animal \"Charlie\" (ID: 45) requires attention. Status: CRITICAL','2025-04-19 06:28:07','resolved','2025-04-19 06:30:53'),(108,7,'Animal \"Charlie\" (ID: 45) requires attention. Status: CRITICAL','2025-04-19 07:45:18','resolved','2025-04-19 08:06:59'),(109,7,'Animal \"Rango\" (ID: 53) requires attention. Status: CRITICAL','2025-04-19 08:08:29','resolved','2025-04-19 13:32:47'),(110,7,'Animal \"Leo\" (ID: 54) requires attention. Status: CRITICAL','2025-04-19 08:08:33','resolved','2025-04-19 13:38:56'),(111,7,'Animal \"Rosie\" (ID: 55) requires attention. Status: CRITICAL','2025-04-19 08:30:50','active',NULL),(112,7,'Animal \"Rango\" (ID: 53) requires attention. Status: CRITICAL','2025-04-19 10:16:58','resolved','2025-04-19 15:10:29'),(113,7,'Animal \"Snap\" (ID: 59) requires attention. Status: CRITICAL','2025-04-19 13:37:44','active',NULL),(114,7,'Animal \"Blizzard\" (ID: 65) requires attention. Status: CRITICAL','2025-04-19 13:37:51','active',NULL),(115,9,'Notice: Stock for product \"Animal Encyclopedia\" was replenished to 11 units.','2025-04-19 13:43:29','resolved',NULL),(116,9,'Alert: Stock for product \"Animal Encyclopedia\" is low. Only 2 items left.','2025-04-19 13:43:38','resolved','2025-04-19 14:40:13'),(117,7,'Animal \"Coralita\" (ID: 56) requires attention. Status: CRITICAL','2025-04-19 15:04:35','active',NULL),(118,9,'Notice: Stock for product \"Animal Encyclopedia\" was replenished to 5 units.','2025-04-19 15:29:27','resolved',NULL),(119,9,'Alert: Stock for product \"Zoo Keychain Set\" is low. Only 1 items left.','2025-04-19 15:29:34','resolved','2025-04-20 04:17:23'),(120,7,'Animal \"Leo\" (ID: 54) requires attention. Status: CRITICAL','2025-04-19 15:30:14','resolved','2025-04-20 04:49:03'),(121,9,'Alert: Stock for product \"Safari Hat\" is low. Only 4 items left.','2025-04-20 02:27:36','resolved','2025-04-20 04:17:19'),(122,9,'Alert: Stock for product \"Animal Encyclopedia\" is low. Only 3 items left.','2025-04-20 02:27:36','resolved','2025-04-20 05:37:16'),(123,9,'Alert: Stock for product \"Lion Plush\" is low. Only 4 items left.','2025-04-20 02:27:36','resolved','2025-04-20 04:17:26'),(124,9,'Alert: Stock for product \"Zoo Plush Elephant\" is low. Only 3 items left.','2025-04-20 02:28:52','resolved','2025-04-20 04:17:14'),(125,9,'Notice: Stock for product \"Zoo Plush Elephant\" was replenished to 5 units.','2025-04-20 04:17:14','resolved',NULL),(126,9,'Notice: Stock for product \"Safari Hat\" was replenished to 12 units.','2025-04-20 04:17:19','resolved',NULL),(127,9,'Notice: Stock for product \"Zoo Keychain Set\" was replenished to 6 units.','2025-04-20 04:17:23','resolved',NULL),(128,9,'Notice: Stock for product \"Lion Plush\" was replenished to 14 units.','2025-04-20 04:17:26','resolved',NULL),(129,9,'Notice: Stock for product \"Animal Encyclopedia\" was replenished to 5 units.','2025-04-20 05:37:16','resolved',NULL),(130,9,'Alert: Stock for product \"Zoo T-Shirt\" is low. Only 1 items left.','2025-04-20 05:37:57','active',NULL),(131,9,'Alert: Stock for product \"Simba plushy\" is low. Only 0 items left.','2025-04-20 18:10:09','resolved','2025-04-20 18:12:40'),(132,9,'Notice: Stock for product \"Simba plushy\" was replenished to 20 units.','2025-04-20 18:12:40','resolved',NULL);
/*!40000 ALTER TABLE `alerts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `animals`
--

DROP TABLE IF EXISTS `animals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animals` (
  `animal_id` int NOT NULL AUTO_INCREMENT,
  `enclosure_id` int NOT NULL,
  `date_of_birth` date NOT NULL,
  `animal_name` varchar(200) NOT NULL,
  `health_status` enum('HEALTHY','NEEDS CARE','CRITICAL') NOT NULL,
  `animal_type` enum('Mammal','Bird','Reptile','Amphibian','Fish','Invertebrate') NOT NULL,
  `species` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`animal_id`),
  UNIQUE KEY `animal_name` (`animal_name`),
  KEY `enclosure_id` (`enclosure_id`),
  CONSTRAINT `animals_ibfk_1` FOREIGN KEY (`enclosure_id`) REFERENCES `enclosures` (`enclosure_id`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animals`
--

LOCK TABLES `animals` WRITE;
/*!40000 ALTER TABLE `animals` DISABLE KEYS */;
INSERT INTO `animals` VALUES (45,1,'2018-05-12','Charlie','HEALTHY','Mammal','Capuchin Monkey'),(46,1,'2020-03-22','Luna','HEALTHY','Mammal','Howler Monkey'),(47,1,'2019-11-10','Zeke','HEALTHY','Mammal','Squirrel Monkey'),(48,2,'2019-07-19','Milo','HEALTHY','Mammal','Tamarin'),(49,2,'2021-01-11','Nina','HEALTHY','Mammal','Sloth'),(50,3,'2017-08-03','Dusty','HEALTHY','Reptile','Horned Lizard'),(51,3,'2019-10-14','Spike','HEALTHY','Reptile','Desert Iguana'),(52,3,'2020-05-28','Scorch','HEALTHY','Reptile','Uromastyx'),(53,4,'2020-06-21','Rango','HEALTHY','Reptile','Green Iguana'),(54,4,'2022-02-17','Leo','HEALTHY','Reptile','Leopard Gecko'),(55,5,'2016-04-04','Rosie','CRITICAL','Bird','Flamingo'),(56,5,'2018-12-25','Coralita','CRITICAL','Bird','Flamingo'),(57,5,'2020-07-30','Pinkie','HEALTHY','Bird','Flamingo'),(58,5,'2021-03-03','Featherly','HEALTHY','Bird','Flamingo'),(59,6,'2015-09-29','Snap','CRITICAL','Reptile','Nile Crocodile'),(60,6,'2016-12-10','Chomp','HEALTHY','Reptile','Nile Crocodile'),(61,7,'2021-11-09','Waddles','HEALTHY','Bird','Emperor Penguin'),(62,7,'2022-05-03','Pebble','HEALTHY','Bird','Emperor Penguin'),(63,7,'2023-01-15','Flipper','HEALTHY','Bird','Emperor Penguin'),(64,7,'2023-07-19','IceyP','HEALTHY','Bird','Emperor Penguin'),(65,8,'2014-01-01','Blizzard','CRITICAL','Mammal','Polar Bear'),(66,9,'2019-08-08','Stripes','HEALTHY','Mammal','Plains Zebra'),(67,9,'2020-09-15','Zara','HEALTHY','Mammal','Plains Zebra'),(68,9,'2021-12-22','Bolt','HEALTHY','Mammal','Plains Zebra'),(69,10,'2016-06-06','Simba','HEALTHY','Mammal','African Lion'),(70,10,'2018-05-20','NalaL','HEALTHY','Mammal','African Lion'),(71,11,'2018-03-03','FinnS','NEEDS CARE','Fish','Blacktip Reef Shark'),(72,11,'2019-04-12','RazorS','HEALTHY','Fish','Blacktip Reef Shark'),(73,11,'2020-07-07','JawsS','HEALTHY','Fish','Blacktip Reef Shark'),(74,12,'2021-06-30','NemoC','HEALTHY','Fish','Clownfish'),(75,12,'2021-07-05','DoryC','HEALTHY','Fish','Blue Tang'),(76,12,'2020-11-11','CoralC','HEALTHY','Fish','Royal Gramma'),(77,12,'2021-09-14','GillC','HEALTHY','Fish','Moorish Idol'),(78,13,'2017-10-20','RoyP','HEALTHY','Bird','Indian Peacock'),(79,13,'2018-11-01','JewelP','HEALTHY','Bird','Indian Peacock'),(80,13,'2020-02-15','NovaP','HEALTHY','Bird','Indian Peacock'),(81,14,'2023-01-01','BuzzI','HEALTHY','Invertebrate','Leafcutter Ant'),(82,14,'2022-08-12','CreeperI','HEALTHY','Invertebrate','Praying Mantis'),(83,14,'2021-04-04','SwirlI','HEALTHY','Invertebrate','Butterfly'),(84,14,'2022-11-30','CrawlerI','HEALTHY','Invertebrate','Stick Insect'),(85,15,'2020-10-10','SilkS','HEALTHY','Invertebrate','Tarantula'),(86,15,'2019-02-22','VenomS','HEALTHY','Invertebrate','Black Widow'),(87,15,'2021-05-17','ShadowS','HEALTHY','Invertebrate','Trapdoor Spider'),(88,7,'2022-10-12','Tux','HEALTHY','Bird','Emperor Penguin'),(89,7,'2023-02-14','Snowball','HEALTHY','Bird','Emperor Penguin'),(90,7,'2021-12-01','Frosty','HEALTHY','Bird','Emperor Penguin'),(91,7,'2020-09-27','Glider','HEALTHY','Bird','Emperor Penguin');
/*!40000 ALTER TABLE `animals` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`ajnguye3`@`%`*/ /*!50003 TRIGGER `trg_animal_insert` AFTER INSERT ON `animals` FOR EACH ROW BEGIN
    UPDATE Enclosures
    SET current_capacity = current_capacity + 1
    WHERE enclosure_id = NEW.enclosure_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`ajnguye3`@`%`*/ /*!50003 TRIGGER `trg_animal_update` AFTER UPDATE ON `animals` FOR EACH ROW BEGIN
    IF NEW.enclosure_id != OLD.enclosure_id THEN
        UPDATE Enclosures
        SET current_capacity = current_capacity - 1
        WHERE enclosure_id = OLD.enclosure_id;

        UPDATE Enclosures
        SET current_capacity = current_capacity + 1
        WHERE enclosure_id = NEW.enclosure_id;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`ajnguye3`@`%`*/ /*!50003 TRIGGER `resolve_health_alert` AFTER UPDATE ON `animals` FOR EACH ROW BEGIN
   IF NEW.health_status = 'HEALTHY' 
      AND OLD.health_status IN ('NEEDS CARE', 'CRITICAL') THEN

     UPDATE alerts
     JOIN managers_type ON managers_type.type_of_manager = 'Veterinarian'
     SET alerts.status = 'resolved',
         alerts.resolved_at = NOW(),
         alerts.receiver_id = managers_type.manager_id
     WHERE alerts.alert_message = CONCAT(
         'Animal "', OLD.animal_name, 
         '" (ID: ', OLD.animal_id, 
         ') requires attention. Status: ', OLD.health_status
     )
     AND alerts.status = 'active';

   END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`ajnguye3`@`%`*/ /*!50003 TRIGGER `health_status_alert` AFTER UPDATE ON `animals` FOR EACH ROW BEGIN
   IF NEW.health_status = 'CRITICAL' 
      AND NEW.health_status != OLD.health_status THEN

     INSERT INTO alerts (
       receiver_id, 
       alert_message, 
       created_at, 
       status
     )
     SELECT 
       manager_id,
       CONCAT('Animal "', NEW.animal_name, '" (ID: ', NEW.animal_id, ') requires attention. Status: ', NEW.health_status),
       NOW(),
       'active'
     FROM managers_type
     WHERE type_of_manager = 'Veterinarian';

   END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`ajnguye3`@`%`*/ /*!50003 TRIGGER `trg_animal_delete` AFTER DELETE ON `animals` FOR EACH ROW BEGIN
    UPDATE Enclosures
    SET current_capacity = current_capacity - 1
    WHERE enclosure_id = OLD.enclosure_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `attractions`
--

DROP TABLE IF EXISTS `attractions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attractions` (
  `attraction_id` int NOT NULL AUTO_INCREMENT,
  `exhibit_id` int DEFAULT NULL,
  `operator_id` int DEFAULT NULL,
  `name` varchar(30) DEFAULT NULL,
  `location` varchar(200) NOT NULL,
  `capacity` int NOT NULL,
  `status` enum('active','inactive','under_maintenance') DEFAULT 'active',
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`attraction_id`),
  UNIQUE KEY `name` (`name`),
  KEY `exhibit_id` (`exhibit_id`),
  KEY `operator_id` (`operator_id`),
  CONSTRAINT `attractions_ibfk_1` FOREIGN KEY (`exhibit_id`) REFERENCES `exhibits` (`exhibit_id`),
  CONSTRAINT `attractions_ibfk_2` FOREIGN KEY (`exhibit_id`) REFERENCES `exhibits` (`exhibit_id`),
  CONSTRAINT `attractions_ibfk_3` FOREIGN KEY (`operator_id`) REFERENCES `employees` (`Employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attractions`
--

LOCK TABLES `attractions` WRITE;
/*!40000 ALTER TABLE `attractions` DISABLE KEYS */;
/*!40000 ALTER TABLE `attractions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `department_id` int NOT NULL AUTO_INCREMENT,
  `Manager_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(100) NOT NULL,
  `role` enum('Zookeeper','Veterinarian','Maintenance','Guest_Services','Administrator','Operator','Restaurant_Services') NOT NULL,
  PRIMARY KEY (`department_id`),
  UNIQUE KEY `name` (`name`),
  KEY `Manager_id` (`Manager_id`),
  CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`Manager_id`) REFERENCES `employees` (`Employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,3,'Animal Care','Responsible for taking care of animals and their well-being.','North Wing','Zookeeper'),(2,9,'Veterinary Services','Provides medical care to zoo animals.','Medical Center','Veterinarian'),(3,3,'Maintenance','Handles zoo infrastructure, repairs, and general maintenance.','Operations Building','Maintenance'),(4,5,'Guest Services','Manages visitor interactions, ticketing, and customer support.','Main Entrance','Guest_Services'),(5,1,'Administration','Oversees zoo operations, policies, and human resources.','Administrative Office','Administrator'),(6,5,'Operations','Coordinates logistics and daily operations of the zoo.','Operations HQ','Operator'),(7,5,'Restaurant Services','Manages food service and dining areas in the zoo.','Food Court','Restaurant_Services');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_shift_records`
--

DROP TABLE IF EXISTS `employee_shift_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_shift_records` (
  `record_id` int NOT NULL AUTO_INCREMENT,
  `clock_in` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `clock_out` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `employee_id` int NOT NULL,
  PRIMARY KEY (`record_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `employee_shift_records_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`Employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=210 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_shift_records`
--

LOCK TABLES `employee_shift_records` WRITE;
/*!40000 ALTER TABLE `employee_shift_records` DISABLE KEYS */;
INSERT INTO `employee_shift_records` VALUES (1,'2025-03-27 09:30:15','2025-03-27 18:00:04',3),(2,'2025-03-30 09:00:02','2025-03-30 19:05:20',3),(9,'2025-04-12 11:04:10','2025-04-12 11:04:11',33),(10,'2025-04-12 11:04:30','2025-04-12 11:04:31',33),(11,'2025-04-12 11:04:32','2025-04-13 00:41:21',33),(12,'2025-04-12 11:08:27','2025-04-12 11:08:28',15),(13,'2025-04-12 11:08:49','2025-04-12 11:08:50',26),(14,'2025-04-12 11:09:23','2025-04-12 11:09:24',7),(15,'2025-04-12 11:10:22','2025-04-12 11:10:22',7),(18,'2025-04-12 11:10:48','2025-04-12 11:10:48',23),(23,'2025-04-12 11:10:53','2025-04-12 11:10:54',23),(24,'2025-04-12 11:11:11','2025-04-12 11:11:12',23),(25,'2025-04-12 11:11:26','2025-04-12 11:11:27',23),(26,'2025-04-12 11:11:27','2025-04-12 11:11:28',23),(27,'2025-04-12 11:11:29','2025-04-12 11:11:29',23),(28,'2025-04-12 11:11:29','2025-04-12 11:11:53',23),(29,'2025-04-12 11:11:54','2025-04-12 11:11:54',23),(30,'2025-04-12 11:11:57','2025-04-12 11:11:58',23),(31,'2025-04-12 12:00:04','2025-04-12 12:00:05',26),(32,'2025-04-12 17:51:01','2025-04-12 17:51:10',24),(33,'2025-04-12 17:51:32','2025-04-12 17:54:55',24),(34,'2025-04-12 18:37:39','2025-04-12 18:37:45',105),(40,'2025-04-12 21:12:11','2025-04-12 21:12:12',9),(41,'2025-04-12 21:12:13','2025-04-12 21:12:13',9),(42,'2025-04-12 21:21:46','2025-04-12 21:23:06',26),(43,'2025-04-01 08:00:00','2025-04-01 16:00:00',1),(44,'2025-04-01 09:00:00','2025-04-01 17:00:00',2),(45,'2025-04-01 08:30:00','2025-04-01 16:30:00',3),(46,'2025-04-01 07:00:00','2025-04-01 15:00:00',4),(47,'2025-04-01 09:30:00','2025-04-01 17:30:00',5),(48,'2025-04-02 08:00:00','2025-04-02 16:00:00',6),(49,'2025-04-02 09:00:00','2025-04-02 17:00:00',7),(50,'2025-04-02 08:30:00','2025-04-02 16:30:00',8),(51,'2025-04-02 07:00:00','2025-04-02 15:00:00',9),(52,'2025-04-02 09:30:00','2025-04-02 17:30:00',10),(53,'2025-04-03 08:00:00','2025-04-03 16:00:00',11),(54,'2025-04-03 09:00:00','2025-04-03 17:00:00',12),(55,'2025-04-03 08:30:00','2025-04-03 16:30:00',13),(56,'2025-04-03 07:00:00','2025-04-03 15:00:00',14),(57,'2025-04-03 09:30:00','2025-04-03 17:30:00',15),(58,'2025-04-04 08:00:00','2025-04-04 16:00:00',18),(59,'2025-04-04 09:00:00','2025-04-04 17:00:00',23),(60,'2025-04-04 08:30:00','2025-04-04 16:30:00',24),(61,'2025-04-04 07:00:00','2025-04-04 15:00:00',25),(62,'2025-04-04 09:30:00','2025-04-04 17:30:00',26),(63,'2025-04-05 08:00:00','2025-04-05 16:00:00',27),(64,'2025-04-05 09:00:00','2025-04-05 17:00:00',28),(65,'2025-04-05 08:30:00','2025-04-05 16:30:00',29),(66,'2025-04-05 07:00:00','2025-04-05 15:00:00',30),(67,'2025-04-05 09:30:00','2025-04-05 17:30:00',31),(68,'2025-04-06 08:00:00','2025-04-06 16:00:00',32),(69,'2025-04-06 09:00:00','2025-04-06 17:00:00',33),(70,'2025-04-06 08:30:00','2025-04-06 16:30:00',34),(71,'2025-04-06 07:00:00','2025-04-06 15:00:00',101),(72,'2025-04-06 09:30:00','2025-04-06 17:30:00',102),(73,'2025-04-07 08:00:00','2025-04-07 16:00:00',103),(74,'2025-04-07 09:00:00','2025-04-07 17:00:00',104),(75,'2025-04-07 08:30:00','2025-04-07 16:30:00',105),(76,'2025-04-07 07:00:00','2025-04-07 15:00:00',106),(77,'2025-04-07 09:30:00','2025-04-07 17:30:00',107),(78,'2025-04-07 08:00:00','2025-04-07 16:00:00',108),(79,'2025-04-01 08:00:00','2025-04-01 16:00:00',1),(80,'2025-04-02 08:15:00','2025-04-02 16:15:00',1),(81,'2025-04-03 07:45:00','2025-04-03 15:45:00',1),(82,'2025-04-04 08:30:00','2025-04-04 16:30:00',1),(83,'2025-04-05 08:00:00','2025-04-05 16:00:00',1),(84,'2025-04-01 09:00:00','2025-04-01 17:00:00',2),(85,'2025-04-02 08:45:00','2025-04-02 16:45:00',2),(86,'2025-04-03 09:15:00','2025-04-03 17:15:00',2),(87,'2025-04-04 09:00:00','2025-04-04 17:00:00',2),(88,'2025-04-05 08:30:00','2025-04-05 16:30:00',2),(89,'2025-04-01 08:30:00','2025-04-01 16:30:00',7),(90,'2025-04-02 09:00:00','2025-04-02 17:00:00',7),(91,'2025-04-03 08:45:00','2025-04-03 16:45:00',7),(92,'2025-04-04 08:30:00','2025-04-04 16:30:00',7),(93,'2025-04-05 09:00:00','2025-04-05 17:00:00',7),(94,'2025-04-01 07:30:00','2025-04-01 15:30:00',26),(95,'2025-04-02 08:00:00','2025-04-02 16:00:00',26),(96,'2025-04-03 07:45:00','2025-04-03 15:45:00',26),(97,'2025-04-04 08:15:00','2025-04-04 16:15:00',26),(98,'2025-04-05 08:30:00','2025-04-05 16:30:00',26),(99,'2025-04-01 07:45:00','2025-04-01 15:45:00',105),(100,'2025-04-02 08:15:00','2025-04-02 16:15:00',105),(101,'2025-04-03 07:30:00','2025-04-03 15:30:00',105),(102,'2025-04-04 08:00:00','2025-04-04 16:00:00',105),(103,'2025-04-05 08:30:00','2025-04-05 16:30:00',105),(104,'2025-04-01 08:00:00','2025-04-01 16:00:00',101),(105,'2025-04-02 08:30:00','2025-04-02 16:30:00',101),(106,'2025-04-03 09:00:00','2025-04-03 17:00:00',101),(107,'2025-04-04 08:15:00','2025-04-04 16:15:00',101),(108,'2025-04-05 08:45:00','2025-04-05 16:45:00',101),(109,'2025-04-01 08:30:00','2025-04-01 16:30:00',102),(110,'2025-04-02 09:00:00','2025-04-02 17:00:00',102),(111,'2025-04-03 08:15:00','2025-04-03 16:15:00',102),(112,'2025-04-04 08:45:00','2025-04-04 16:45:00',102),(113,'2025-04-05 09:00:00','2025-04-05 17:00:00',102),(114,'2025-04-01 07:45:00','2025-04-01 15:45:00',103),(115,'2025-04-02 08:00:00','2025-04-02 16:00:00',103),(116,'2025-04-03 07:30:00','2025-04-03 15:30:00',103),(117,'2025-04-04 08:15:00','2025-04-04 16:15:00',103),(118,'2025-04-05 07:45:00','2025-04-05 15:45:00',103),(119,'2025-04-01 08:15:00','2025-04-01 16:15:00',104),(120,'2025-04-02 08:30:00','2025-04-02 16:30:00',104),(121,'2025-04-03 09:00:00','2025-04-03 17:00:00',104),(122,'2025-04-04 08:45:00','2025-04-04 16:45:00',104),(123,'2025-04-05 09:15:00','2025-04-05 17:15:00',104),(124,'2025-04-01 07:45:00','2025-04-01 15:45:00',105),(125,'2025-04-02 08:15:00','2025-04-02 16:15:00',105),(126,'2025-04-03 07:30:00','2025-04-03 15:30:00',105),(127,'2025-04-04 08:00:00','2025-04-04 16:00:00',105),(128,'2025-04-05 08:30:00','2025-04-05 16:30:00',105),(129,'2025-04-01 08:00:00','2025-04-01 16:00:00',106),(130,'2025-04-02 08:30:00','2025-04-02 16:30:00',106),(131,'2025-04-03 09:00:00','2025-04-03 17:00:00',106),(132,'2025-04-04 08:15:00','2025-04-04 16:15:00',106),(133,'2025-04-05 09:00:00','2025-04-05 17:00:00',106),(134,'2025-04-01 08:45:00','2025-04-01 16:45:00',107),(135,'2025-04-02 09:15:00','2025-04-02 17:15:00',107),(136,'2025-04-03 08:00:00','2025-04-03 16:00:00',107),(137,'2025-04-04 08:30:00','2025-04-04 16:30:00',107),(138,'2025-04-05 09:00:00','2025-04-05 17:00:00',107),(139,'2025-04-01 07:30:00','2025-04-01 15:30:00',108),(140,'2025-04-02 08:00:00','2025-04-02 16:00:00',108),(141,'2025-04-03 07:45:00','2025-04-03 15:45:00',108),(142,'2025-04-04 08:15:00','2025-04-04 16:15:00',108),(143,'2025-04-05 07:30:00','2025-04-05 15:30:00',108),(144,'2025-04-01 08:15:00','2025-04-01 16:15:00',13),(145,'2025-04-02 08:30:00','2025-04-02 16:30:00',13),(146,'2025-04-03 09:00:00','2025-04-03 17:00:00',13),(147,'2025-04-04 08:45:00','2025-04-04 16:45:00',13),(148,'2025-04-05 09:00:00','2025-04-05 17:00:00',13),(149,'2025-04-01 09:00:00','2025-04-01 17:00:00',34),(150,'2025-04-02 08:30:00','2025-04-02 16:30:00',34),(151,'2025-04-03 09:15:00','2025-04-03 17:15:00',34),(152,'2025-04-04 08:45:00','2025-04-04 16:45:00',34),(153,'2025-04-05 08:00:00','2025-04-05 16:00:00',34),(154,'2025-04-01 08:30:00','2025-04-01 16:30:00',33),(155,'2025-04-02 09:00:00','2025-04-02 17:00:00',33),(156,'2025-04-03 08:15:00','2025-04-03 16:15:00',33),(157,'2025-04-04 08:30:00','2025-04-04 16:30:00',33),(158,'2025-04-05 09:00:00','2025-04-05 17:00:00',33),(159,'2025-04-01 07:30:00','2025-04-01 15:30:00',32),(160,'2025-04-02 08:00:00','2025-04-02 16:00:00',32),(161,'2025-04-03 08:45:00','2025-04-03 16:45:00',32),(162,'2025-04-04 07:45:00','2025-04-04 15:45:00',32),(163,'2025-04-05 08:30:00','2025-04-05 16:30:00',32),(164,'2025-04-01 08:00:00','2025-04-01 16:00:00',34),(165,'2025-04-02 09:00:00','2025-04-02 17:00:00',34),(166,'2025-04-03 08:15:00','2025-04-03 16:15:00',34),(167,'2025-04-04 08:45:00','2025-04-04 16:45:00',34),(168,'2025-04-05 09:00:00','2025-04-05 17:00:00',34),(169,'2025-04-01 06:15:00','2025-04-01 14:45:00',23),(170,'2025-04-03 07:30:00','2025-04-03 15:00:00',23),(171,'2025-04-01 06:45:00','2025-04-01 15:15:00',24),(172,'2025-04-04 07:00:00','2025-04-04 15:30:00',24),(173,'2025-04-02 06:30:00','2025-04-02 14:45:00',25),(174,'2025-04-04 07:45:00','2025-04-04 16:00:00',25),(175,'2025-04-01 07:00:00','2025-04-01 15:30:00',103),(176,'2025-04-03 06:30:00','2025-04-03 15:00:00',103),(177,'2025-04-01 06:15:00','2025-04-01 14:45:00',104),(178,'2025-04-02 07:00:00','2025-04-02 15:30:00',104),(179,'2025-04-01 08:00:00','2025-04-01 16:00:00',105),(180,'2025-04-03 07:30:00','2025-04-03 16:00:00',105),(181,'2025-04-01 07:45:00','2025-04-01 16:15:00',106),(182,'2025-04-02 08:30:00','2025-04-02 16:30:00',106),(183,'2025-04-01 10:00:00','2025-04-01 18:00:00',107),(184,'2025-04-03 11:30:00','2025-04-03 19:30:00',107),(185,'2025-04-01 09:15:00','2025-04-01 17:15:00',108),(186,'2025-04-02 10:00:00','2025-04-02 18:00:00',108),(187,'2025-04-12 23:54:21','2025-04-12 23:54:25',15),(188,'2025-04-13 00:41:21',NULL,33),(189,'2025-04-13 01:03:51','2025-04-13 01:03:52',1),(190,'2025-04-13 21:11:18','2025-04-13 23:23:59',26),(191,'2025-04-14 19:37:37','2025-04-14 19:37:42',24),(192,'2025-04-14 19:57:43','2025-04-14 19:57:45',26),(193,'2025-04-14 22:21:23','2025-04-14 22:21:25',26),(194,'2025-04-15 00:06:56','2025-04-15 00:06:59',1),(195,'2025-04-15 00:07:08','2025-04-15 00:08:38',1),(196,'2025-04-15 03:01:33','2025-04-15 03:01:43',15),(197,'2025-04-15 03:32:36','2025-04-15 03:34:48',32),(198,'2025-04-15 03:35:04','2025-04-15 03:35:05',32),(199,'2025-04-15 03:35:05','2025-04-15 03:35:05',32),(200,'2025-04-15 03:35:06','2025-04-15 03:35:09',32),(201,'2025-04-15 03:38:53','2025-04-15 03:38:53',9),(202,'2025-04-15 03:38:53',NULL,9),(203,'2025-04-15 03:38:54','2025-04-15 03:38:54',9),(204,'2025-04-15 04:13:08','2025-04-15 04:13:11',15),(205,'2025-04-16 19:41:34','2025-04-16 19:41:35',15),(206,'2025-04-17 22:19:33','2025-04-17 22:19:47',24),(207,'2025-04-17 22:23:04','2025-04-17 22:23:08',26),(208,'2025-04-19 10:20:07','2025-04-19 10:20:07',15),(209,'2025-04-19 15:10:38','2025-04-19 15:10:44',7);
/*!40000 ALTER TABLE `employee_shift_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `Employee_id` int NOT NULL AUTO_INCREMENT,
  `Manager_id` int DEFAULT NULL,
  `first_name` varchar(30) NOT NULL,
  `Minit_name` varchar(30) DEFAULT NULL,
  `last_name` varchar(30) NOT NULL,
  `salary` int NOT NULL,
  `gender` enum('male','female','other','prefer not to say') NOT NULL,
  `street_address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `department_id` int NOT NULL,
  `date_of_birth` date NOT NULL,
  `email` varchar(255) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `role` enum('admin','manager','staff','zookeeper','veterinarian','operator','giftshop') DEFAULT NULL,
  PRIMARY KEY (`Employee_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `user_name` (`user_name`),
  UNIQUE KEY `password` (`password`),
  KEY `Manager_id` (`Manager_id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`Manager_id`) REFERENCES `employees` (`Employee_id`),
  CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,NULL,'Maria','J','Rodriguez',95000,'female','123 Wildlife Way','San Diego','TX','92101','USA',1,'1980-05-15','mrodriguez@manager.naturekingdom.com','mrodriguez','MariaRodriguez2023!','1231231231','manager'),(2,1,'Robert','T','Chen',8000,'male','456 Safari Lane','San Diego','CA','92102','USA',1,'1985-08-22','rchen@manager.naturekingdom.com','rchen','RobertChen2023!','1231231232','manager'),(3,1,'Sarah','L','Thompson',82000,'female','789 Primate Path','San Diego','CA','92103','USA',2,'1982-03-10','sthompson@manager.naturekingdom.com','sthompson','SarahThompson2023!',NULL,'manager'),(4,3,'James','A','Washington',75000,'male','101 Elephant Walk','San Diego','CA','92104','USA',2,'1990-11-28','jwashington@staff.naturekingdom.com','jwashington','JamesWashington2023!',NULL,'staff'),(5,1,'Lakshmi','P','Patel',78000,'female','202 Reptile Road','San Diego','CA','92105','USA',3,'1988-07-04','lpatel@manager.naturekingdom.com','lpatel','LakshmiPatel2023!',NULL,'manager'),(6,5,'Miguel',NULL,'Sanchez',72000,'male','303 Aquarium Avenue','San Diego','CA','92106','USA',3,'1992-09-17','msanchez@staff.naturekingdom.com','msanchez','MiguelSanchez2023!',NULL,'staff'),(7,1,'Latisha','J','Brown',77000,'female','404 Conservation Court','San Diego','CA','92107','USA',4,'1983-12-05','lbrown@manager.naturekingdom.com','lbrown','LatishaBrown2023!',NULL,'manager'),(8,7,'David','K','Okafor',69000,'male','505 Habitat Highway','San Diego','CA','92108','USA',4,'1991-04-30','dokafor@staff.naturekingdom.com','dokafor','DavidOkafor2023!',NULL,'staff'),(9,1,'Emma','M','Wilson',71000,'female','606 Penguin Place','San Diego','CA','92109','USA',5,'1986-06-18','ewilson@manager.naturekingdom.com','ewilson','EmmaWilson2023!',NULL,'manager'),(10,9,'Carlos','A','Mendez',68000,'male','707 Rainforest Row','San Diego','CA','92110','USA',5,'1993-02-14','cmendez@staff.naturekingdom.com','cmendez','CarlosMendez2023!',NULL,'staff'),(11,3,'Aisha','T','Mbeki',74000,'female','808 Bird Boulevard','San Diego','CA','92111','USA',2,'1984-10-08','ambeki@staff.naturekingdom.com','ambeki','AishaMbeki2023!',NULL,'staff'),(12,5,'John','R','Smith',66000,'male','909 Giraffe Gardens','San Diego','CA','92112','USA',3,'1994-01-23','jsmith@staff.naturekingdom.com','jsmith','JohnSmith2023!',NULL,'staff'),(13,7,'Fatima','H','Al-Farsi',73000,'female','1010 Zebra Zone','San Diego','CA','92113','USA',4,'1981-09-12','falfarsi@staff.naturekingdom.com','falfarsi','FatimaAlFarsi2023!',NULL,'staff'),(14,9,'Luis','G','Garcia',67000,'male','1111 Monkey Mile','San Diego','CA','92114','USA',5,'1989-05-07','lgarcia@staff.naturekingdom.com','lgarcia','LuisGarcia2023!',NULL,'staff'),(15,1,'Mei','L','Zhang',70000,'female','1212 Panda Path','San Diego','CA','92115','USA',1,'1987-11-19','mzhang@admin.naturekingdom.com','mzhang','MeiZhang2023!',NULL,'admin'),(18,1,'James','D ','Gran',15000,'male','123 Stillbrook','Houston','Texas','12345','United States',1,'2002-12-07','jgran@admin.naturekingdom.com','JGran','Test123.','1234567890','admin'),(23,5,'Lena','B','Torres',67000,'female','1717 Savannah Road','San Diego','CA','92120','USA',3,'1991-02-11','ltorres@zookeeper.naturekingdom.com','ltorres','LenaTorres2023!','5551102200','zookeeper'),(24,5,'Marco','T','DeLeon',66000,'male','1818 Jungle Ave','San Diego','CA','92121','USA',3,'1988-07-30','mdeleon@zookeeper.naturekingdom.com','mdeleon','MarcoDeLeon2023!','5552203300','zookeeper'),(25,5,'Kayla','R','Ngoma',69000,'female','1919 Oasis Lane','San Diego','CA','92122','USA',3,'1993-05-27','kngoma@zookeeper.naturekingdom.com','kngoma','KaylaNgoma2023!','5553304400','zookeeper'),(26,7,'Ethan','C','Baker',75000,'male','2020 MedVet Blvd','San Diego','CA','92123','USA',4,'1984-01-14','ebaker@veterinarian.naturekingdom.com','ebaker','EthanBaker2023!','5554405500','veterinarian'),(27,7,'Priya','L','Ramesh',74000,'female','2121 AnimalCare Pkwy','San Diego','CA','92124','USA',4,'1989-11-08','pramesh@veterinarian.naturekingdom.com','pramesh','PriyaRamesh2023!','5555506600','veterinarian'),(28,7,'Jonas','D','Kim',76000,'male','2222 Wellness Way','San Diego','CA','92125','USA',4,'1990-04-01','jkim@veterinarian.naturekingdom.com','jkim','JonasKim2023!','5556607700','veterinarian'),(29,1,'Tasha','E','Williams',56000,'female','2323 Radio Rd','San Diego','CA','92126','USA',1,'1995-06-12','twilliams@operator.naturekingdom.com','twilliams','TashaWilliams2023!','5557708800','operator'),(30,1,'Samuel','G','Lee',57000,'male','2424 Comm Center','San Diego','CA','92127','USA',1,'1992-03-18','slee@operator.naturekingdom.com','slee','SamuelLee2023!','5558809900','operator'),(31,1,'Natalie','M','Clarkson',55000,'female','2525 Ops Lane','San Diego','CA','92128','USA',1,'1997-01-05','nclarkson@operator.naturekingdom.com','nclarkson','NatalieClarkson2023!','5559901010','operator'),(32,9,'Andre','J','Diaz',46000,'male','1616 Souvenir St','San Diego','CA','92119','USA',6,'1998-11-03','adiaz@giftshop.naturekingdom.com','adiaz','AndreDiaz2023!','5556541230','giftshop'),(33,9,'Ruby','S','Moreno',47000,'female','2626 Trinket Trail','San Diego','CA','92129','USA',6,'1994-09-22','rmoreno@giftshop.naturekingdom.com','rmoreno','RubyMoreno2023!','5553214567','giftshop'),(34,9,'Logan','H','Scott',45000,'male','2727 Merch Blvd','San Diego','CA','92130','USA',6,'1996-12-14','lscott@giftshop.naturekingdom.com','lscott','LoganScott2023!','5557891234','giftshop'),(101,3,'Julian','M','Vargas',64000,'male','421 Lemur Lane','Orlando','FL','32801','USA',3,'1990-05-23','jvargas@zookeeper.naturekingdom.com','jvargas','JulianV2023!','5551103001','zookeeper'),(102,3,'Anita','L','Reyes',65000,'female','532 Canopy Court','Gainesville','FL','32601','USA',3,'1989-11-10','areyes@zookeeper.naturekingdom.com','areyes','AnitaR2023!','5551103002','zookeeper'),(103,5,'Noah','J','Singh',65500,'male','77 Desert Path','Las Vegas','NV','89101','USA',3,'1991-08-17','nsingh@zookeeper.naturekingdom.com','nsingh','NoahS2023!','5551103003','zookeeper'),(104,5,'Priya','S','Mehta',65800,'female','19 Lizard Ridge','Tucson','AZ','85701','USA',3,'1992-12-30','pmehta@zookeeper.naturekingdom.com','pmehta','PriyaM2023!','5551103004','zookeeper'),(105,7,'Carlos','D','Ramirez',66200,'male','66 Flamingo Dr','San Antonio','TX','78201','USA',3,'1990-03-14','cramirez@zookeeper.naturekingdom.com','cramirez','CarlosR2023!','5551103005','zookeeper'),(106,7,'Maya','T','Nguyen',66400,'female','101 Croc Trail','Houston','TX','77001','USA',3,'1993-07-02','mnguyen@zookeeper.naturekingdom.com','mnguyen','MayaN2023!','5551103006','zookeeper'),(107,9,'Elijah','K','Bennett',66800,'male','88 Penguin Pl','Seattle','WA','98101','USA',3,'1988-04-25','ebennett@zookeeper.naturekingdom.com','ebennett','ElijahB2023!','5551103007','zookeeper'),(108,9,'Zara','N','Ali',67000,'female','55 Polar Way','Portland','OR','97201','USA',3,'1994-01-19','zali@zookeeper.naturekingdom.com','zali','ZaraA2023!','5551103008','zookeeper'),(109,9,'Yesenia',NULL,'Rodriguez',9,'other','221B Baker Street','Houston','Texas','88888','United States',2,'2002-12-01','Swifiety231@gmail.com','Yes123','Mike231','4828483828',NULL),(112,3,'Mike',NULL,'Jones',90000,'other','4714 Orchard Creek Ln','Houston','Texas','88888','United States',3,'1999-12-30','austinguyenj@gmail.com','Mickey321','Password231.','4828483828',NULL);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enclosures`
--

DROP TABLE IF EXISTS `enclosures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enclosures` (
  `enclosure_id` int NOT NULL AUTO_INCREMENT,
  `exhibit_id` int NOT NULL,
  `name` varchar(30) NOT NULL,
  `capacity` int NOT NULL DEFAULT '0',
  `location` varchar(200) DEFAULT NULL,
  `temp_control` tinyint(1) NOT NULL,
  `Manager_id` int DEFAULT NULL,
  `opens_at` time DEFAULT NULL,
  `closes_at` time DEFAULT NULL,
  `current_capacity` int NOT NULL,
  `status` enum('active','inactive','under_maintenance') DEFAULT NULL,
  PRIMARY KEY (`enclosure_id`),
  UNIQUE KEY `name` (`name`),
  KEY `exhibit_id` (`exhibit_id`),
  KEY `Manager_id` (`Manager_id`),
  CONSTRAINT `enclosures_ibfk_1` FOREIGN KEY (`exhibit_id`) REFERENCES `exhibits` (`exhibit_id`),
  CONSTRAINT `enclosures_ibfk_2` FOREIGN KEY (`Manager_id`) REFERENCES `employees` (`Manager_id`),
  CONSTRAINT `enclosures_chk_1` CHECK (((`capacity` < 100) and (`capacity` >= 0)))
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enclosures`
--

LOCK TABLES `enclosures` WRITE;
/*!40000 ALTER TABLE `enclosures` DISABLE KEYS */;
INSERT INTO `enclosures` VALUES (1,1,'Monkey Grove',12,'East Wing, L2 - Zone A',1,3,'10:00:00','18:00:00',3,'active'),(2,1,'Canopy Habitat',8,'East Wing, L2 - Zone B',1,3,'10:00:00','18:00:00',2,'active'),(3,2,'Dune Den',10,'South Wing, C1',0,5,'09:30:00','16:30:00',3,'under_maintenance'),(4,2,'Lizard Ledge',6,'South Wing, C2',1,5,'09:30:00','16:30:00',2,'active'),(5,3,'Flamingo Flats',15,'West Wing, L1 - Wetlands A',1,7,'08:00:00','17:30:00',4,'active'),(6,3,'Croc Cove',4,'West Wing, L1 - Wetlands B',1,7,'08:00:00','17:30:00',2,'active'),(7,4,'Penguin Point',20,'North Wing, Ice Zone A',1,9,'11:00:00','16:00:00',7,'inactive'),(8,4,'Polar Peak',5,'North Wing, Ice Zone B',1,9,'11:00:00','16:00:00',1,'inactive'),(9,5,'Zebra Zone',10,'North Wing, Zone A1',0,3,'09:00:00','17:00:00',3,'active'),(10,5,'Lion Lookout',4,'North Wing, Zone A2',0,3,'09:00:00','17:00:00',2,'active'),(11,6,'Shark Shoal',6,'East Wing, Lower Tank 1',1,5,'10:00:00','19:00:00',3,'active'),(12,6,'Coral Reef Dome',10,'East Wing, Lower Tank 2',1,5,'10:00:00','19:00:00',4,'active'),(13,7,'Peacock Pavilion',12,'South Wing, B1',0,7,'09:00:00','17:00:00',4,'active'),(14,8,'Insectarium',30,'West Wing, Insect Hall A',1,9,'10:30:00','15:30:00',4,'active'),(15,8,'Spider Sector',8,'West Wing, Insect Hall B',1,9,'10:30:00','15:30:00',3,'active'),(19,1,'help',20,'home',0,5,'09:18:00','21:18:00',0,'active');
/*!40000 ALTER TABLE `enclosures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `eventID` int NOT NULL AUTO_INCREMENT,
  `eventName` varchar(255) NOT NULL,
  `description` text,
  `eventDate` datetime NOT NULL,
  `duration` time DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `capacity` int DEFAULT NULL,
  `price` decimal(8,2) DEFAULT '0.00',
  `managerID` int DEFAULT NULL,
  `eventType` enum('Educational','Entertainment','Seasonal','Workshops','Fundraising','Animal Interaction','Corporate') NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`eventID`),
  KEY `managerID` (`managerID`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`managerID`) REFERENCES `employees` (`Employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Grand Opening','Grand Opening for the Nature Kingdom Zoo! discounted flat entrance fee!','2025-04-21 00:00:00','23:59:59','Main Entrance',600,20.00,1,'Corporate','2025-04-01 02:29:23'),(3,'Uma\'s presentation','Group 15 is presenting the Nature Kingdom Project!!!','2025-04-23 22:54:00','00:15:00','UH',30,0.00,1,'Educational','2025-04-15 03:02:24'),(7,'New Baby Cougar Born','New cougar is being born in the morning!!!!','2025-04-17 05:20:00','12:00:00','Main Square',120,0.00,15,'Educational','2025-04-15 10:22:58');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exhibits`
--

DROP TABLE IF EXISTS `exhibits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exhibits` (
  `exhibit_id` int NOT NULL AUTO_INCREMENT,
  `manager_id` int DEFAULT NULL,
  `habitat_type` enum('Savanna','Rainforest','Desert','Wetlands','Arctic','Aquatic','Grassland','Bug House') DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `name` enum('Feather Fiesta','Creepy Crawlies','Tundra Treasures','Sunlit Savanna','Rainforest Rumble','Willowing Wetlands','Desert Mirage','Underwater Utopia') DEFAULT NULL,
  `opens_at` time DEFAULT NULL,
  `closes_at` time DEFAULT NULL,
  `description` text,
  `status` enum('active','inactive','under_maintenance') DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`exhibit_id`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `exhibits_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`Manager_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exhibits`
--

LOCK TABLES `exhibits` WRITE;
/*!40000 ALTER TABLE `exhibits` DISABLE KEYS */;
INSERT INTO `exhibits` VALUES (1,3,'Rainforest','East Wing, Level 2','Rainforest Rumble','10:00:00','18:00:00','A lush, tropical habitat with monkeys, toucans, and sloths.','active','https://unsplash.com/photos/green-ferns-_qZ0us4az20'),(2,5,'Desert','South Wing, Zone C','Desert Mirage','09:30:00','16:30:00','Home to camels, meerkats, and desert reptiles.','under_maintenance','https://unsplash.com/photos/indian-cameleers-camel-driver-bedouin-with-camel-silhouettes-in-sand-dunes-of-thar-desert-on-sunset-caravan-in-rajasthan-travel-tourism-background-safari-adventure-jaisalmer-rajasthan-india-qR8SHi6M_Dk'),(3,7,'Wetlands','West Wing, Level 1','Willowing Wetlands','08:00:00','17:30:00','A serene environment with flamingos, crocodiles, and amphibians.','active','https://unsplash.com/photos/gray-cane-bird-standing-in-body-of-water-c17nUw6HIFc'),(4,9,'Arctic','North Wing, Ice Zone','Tundra Treasures','11:00:00','16:00:00','Chilly habitat showcasing penguins, polar bears, and arctic foxes.','inactive','https://unsplash.com/photos/two-polar-bears-are-sitting-in-the-snow-FWQYmMLzdvY'),(5,3,'Savanna','North Wing, Zone A','Sunlit Savanna','09:00:00','17:00:00','A vast open-air exhibit featuring giraffes, zebras, and lions.','active','https://unsplash.com/photos/lion-on-brown-grass-field-during-daytime-vu0gvM5he8o'),(6,5,'Aquatic','East Wing, Lower Level','Underwater Utopia','10:00:00','19:00:00','An immersive aquarium with sharks, rays, and tropical fish.','active','https://unsplash.com/photos/school-of-fish-in-water-OgfijkTkYNo'),(7,7,'Grassland','South Wing, Zone B','Feather Fiesta','09:00:00','17:00:00','A colorful bird paradise with parrots, peacocks, and cranes.','active','https://unsplash.com/photos/blue-yellow-and-orange-macaw-vzVWYIr6F8U'),(8,9,'Bug House','West Wing, Insect Hall','Creepy Crawlies','10:30:00','15:30:00','An exhibit of fascinating insects including beetles, spiders, and butterflies.','active','https://unsplash.com/photos/macro-photography-of-red-ants-v9wN8wCPLHY');
/*!40000 ALTER TABLE `exhibits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feed_schedules`
--

DROP TABLE IF EXISTS `feed_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feed_schedules` (
  `schedule_id` int NOT NULL AUTO_INCREMENT,
  `animal_id` int NOT NULL,
  `enclosure_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `health_status` enum('HEALTHY','NEEDS CARE','CRITICAL') NOT NULL,
  `summary` text,
  PRIMARY KEY (`schedule_id`),
  KEY `animal_id` (`animal_id`),
  KEY `enclosure_id` (`enclosure_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `feed_schedules_ibfk_1` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`animal_id`),
  CONSTRAINT `feed_schedules_ibfk_2` FOREIGN KEY (`enclosure_id`) REFERENCES `enclosures` (`enclosure_id`),
  CONSTRAINT `feed_schedules_ibfk_3` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`Employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feed_schedules`
--

LOCK TABLES `feed_schedules` WRITE;
/*!40000 ALTER TABLE `feed_schedules` DISABLE KEYS */;
INSERT INTO `feed_schedules` VALUES (29,45,1,101,'2025-04-14 09:30:00','HEALTHY','Charlie was active and ate all his food. No concerns noted.'),(30,46,1,101,'2025-04-14 09:45:00','HEALTHY','Luna was playful during feeding. Normal appetite observed.'),(31,47,1,102,'2025-04-14 10:00:00','HEALTHY','Zeke interacted well with enrichment items. Good appetite.'),(32,66,9,102,'2025-04-14 11:30:00','HEALTHY','Stripes consumed regular portion. Coat looks healthy.'),(33,67,9,101,'2025-04-14 11:45:00','HEALTHY','Zara was energetic and had normal appetite.'),(34,68,9,102,'2025-04-14 12:00:00','HEALTHY','Bolt ate well. No issues observed.'),(35,69,10,101,'2025-04-14 14:00:00','CRITICAL','Simba refused food. Continued monitoring health closely.'),(36,70,10,102,'2025-04-14 14:15:00','NEEDS CARE','NalaL had decreased appetite. Alerting veterinarian for follow-up.'),(37,50,3,103,'2025-04-14 10:30:00','HEALTHY','Dusty active during feeding. Consumed all insects.'),(38,51,3,103,'2025-04-14 10:45:00','HEALTHY','Spike basking normally. Ate regular portion.'),(39,52,3,104,'2025-04-14 11:00:00','HEALTHY','Scorch enthusiastic during feeding time.'),(40,53,4,104,'2025-04-14 13:00:00','HEALTHY','Rango very active. Consumed leafy greens eagerly.'),(41,54,4,103,'2025-04-14 13:15:00','HEALTHY','Leo alert and active. Eating normally.'),(42,71,11,104,'2025-04-14 16:00:00','HEALTHY','FinnS eating normally. Swimming pattern normal.'),(43,72,11,103,'2025-04-14 16:15:00','HEALTHY','RazorS consumed regular portion of fish.'),(44,73,11,104,'2025-04-14 16:30:00','HEALTHY','JawsS showing normal feeding behavior.'),(45,74,12,103,'2025-04-14 17:30:00','HEALTHY','NemoC active around the anemone. Good appetite.'),(46,75,12,104,'2025-04-14 17:45:00','HEALTHY','DoryC swimming normally and ate well.'),(47,76,12,103,'2025-04-14 18:00:00','HEALTHY','CoralC displayed vibrant colors. Normal appetite.'),(48,77,12,104,'2025-04-14 18:15:00','HEALTHY','GillC interacted well with other fish. Good feeding response.'),(49,55,5,105,'2025-04-14 08:30:00','HEALTHY','Rosie standing on one leg as usual. Consumed all food.'),(50,56,5,105,'2025-04-14 08:45:00','HEALTHY','Coralita displaying normal feeding behavior in shallow water.'),(51,57,5,106,'2025-04-14 09:00:00','HEALTHY','Pinkie mingling well with the flock. Good appetite.'),(52,58,5,106,'2025-04-14 09:15:00','HEALTHY','Featherly plumage looks vibrant. Eating well.'),(53,59,6,105,'2025-04-14 12:00:00','HEALTHY','Snap consumed whole chicken. Normal basking behavior.'),(54,60,6,106,'2025-04-14 12:15:00','HEALTHY','Chomp ate well. No concerns noted.'),(55,78,13,105,'2025-04-14 15:00:00','HEALTHY','RoyP displaying feathers. Consumed mixed grain.'),(56,79,13,106,'2025-04-14 15:15:00','HEALTHY','JewelP interacting well with others. Normal appetite.'),(57,80,13,105,'2025-04-14 15:30:00','HEALTHY','NovaP feathers in excellent condition. Eating regularly.'),(58,61,7,107,'2025-04-14 11:30:00','HEALTHY','Waddles swimming actively. Ate all fish provided.'),(59,62,7,107,'2025-04-14 11:45:00','HEALTHY','Pebble socializing well with group. Normal appetite.'),(60,63,7,108,'2025-04-14 12:00:00','HEALTHY','Flipper porpoising behavior observed. Eating well.'),(61,64,7,108,'2025-04-14 12:15:00','HEALTHY','IceyP molting process continues. Appetite normal.'),(62,88,7,107,'2025-04-14 12:30:00','HEALTHY','Tux demonstrating normal feeding patterns.'),(63,89,7,108,'2025-04-14 12:45:00','HEALTHY','Snowball very active during feeding. No issues.'),(64,90,7,107,'2025-04-14 13:00:00','HEALTHY','Frosty bonding well with other penguins. Good appetite.'),(65,91,7,108,'2025-04-14 13:15:00','HEALTHY','Glider ate eagerly. Swimming pattern normal.'),(66,65,8,107,'2025-04-14 14:30:00','HEALTHY','Blizzard consumed entire fish portion. Normal behavior.'),(67,81,14,108,'2025-04-14 10:45:00','HEALTHY','BuzzI colony activity normal. Fresh leaves provided.'),(68,82,14,107,'2025-04-14 11:00:00','HEALTHY','CreeperI captured crickets successfully.'),(69,83,14,108,'2025-04-14 11:15:00','HEALTHY','SwirlI nectar feeding station refreshed. Normal activity.'),(70,84,14,107,'2025-04-14 11:30:00','HEALTHY','CrawlerI consuming fresh foliage. No issues noted.'),(71,85,15,108,'2025-04-14 14:00:00','HEALTHY','SilkS successfully fed live cricket. Normal behavior.'),(72,86,15,107,'2025-04-14 14:15:00','HEALTHY','VenomS web maintenance observed. Ate small insect.'),(73,87,15,108,'2025-04-14 14:30:00','HEALTHY','ShadowS ambush behavior normal. Feeding successful.'),(74,45,1,23,'2025-04-15 09:30:00','HEALTHY','Charlie very energetic this morning. Ate full portion.'),(75,46,1,23,'2025-04-15 09:45:00','HEALTHY','Luna interacting well with enrichment toys. Good appetite.'),(76,53,4,24,'2025-04-15 10:30:00','HEALTHY','Rango showing excellent basking behavior. Eating well.'),(77,54,4,24,'2025-04-15 10:45:00','HEALTHY','Leo active during daylight hours. Consumed insects.'),(78,55,5,25,'2025-04-15 08:30:00','HEALTHY','Rosie filter feeding effectively. Good stance and mobility.'),(79,59,6,25,'2025-04-15 12:00:00','HEALTHY','Snap accepting food directly from tongs. Normal behavior.'),(80,45,1,101,'2025-04-15 06:07:00','HEALTHY','Gave monkey 3 bananas'),(81,55,5,105,'2025-04-15 11:49:00','NEEDS CARE','Gave her fly larvae , other insects'),(82,58,5,105,'2025-04-15 12:57:00','HEALTHY','Featherly ate 3 pounds of worms '),(83,55,5,105,'2025-04-15 12:59:00','CRITICAL','Rosie didnt eat the food that was given'),(84,55,5,105,'2025-04-15 12:59:00','CRITICAL','Rosie didnt eat the food that was given'),(85,56,5,105,'2025-04-15 13:05:00','NEEDS CARE','Coralita seems to not be eating properly due to wing being injured.'),(86,56,5,105,'2025-04-15 14:14:00','NEEDS CARE','Fed the animal worms '),(87,59,6,105,'2025-04-15 14:23:00','HEALTHY','Feed Snap 5 pounds or rabbit meat. He seems healthy'),(88,59,6,105,'2025-04-15 14:25:00','CRITICAL','Snap got sick from the food. :('),(89,55,5,105,'2025-04-16 10:38:00','CRITICAL','Rosie\'s beak looked weird.'),(90,50,3,24,'2025-04-18 03:18:00','CRITICAL','Doesnt want to eat worms'),(91,71,11,24,'2025-04-19 18:50:00','HEALTHY','Ate'),(92,56,5,105,'2025-04-19 20:05:00','CRITICAL','Ate worms');
/*!40000 ALTER TABLE `feed_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gift_shop`
--

DROP TABLE IF EXISTS `gift_shop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gift_shop` (
  `shop_id` int NOT NULL AUTO_INCREMENT,
  `manager_id` int NOT NULL,
  `name` varchar(200) NOT NULL,
  `location` varchar(200) NOT NULL,
  PRIMARY KEY (`shop_id`),
  UNIQUE KEY `name` (`name`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `gift_shop_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`Employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gift_shop`
--

LOCK TABLES `gift_shop` WRITE;
/*!40000 ALTER TABLE `gift_shop` DISABLE KEYS */;
INSERT INTO `gift_shop` VALUES (1,9,'Wild Treasures','Main Plaza');
/*!40000 ALTER TABLE `gift_shop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance`
--

DROP TABLE IF EXISTS `maintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance` (
  `maintenance_id` int NOT NULL AUTO_INCREMENT,
  `enclosure_id` int NOT NULL,
  `exhibit_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `duties_completed` tinyint(1) NOT NULL,
  `estimated_start` datetime NOT NULL,
  `estimated_end` datetime NOT NULL,
  PRIMARY KEY (`maintenance_id`),
  KEY `enclosure_id` (`enclosure_id`),
  KEY `exhibit_id` (`exhibit_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `maintenance_ibfk_1` FOREIGN KEY (`enclosure_id`) REFERENCES `enclosures` (`enclosure_id`),
  CONSTRAINT `maintenance_ibfk_2` FOREIGN KEY (`exhibit_id`) REFERENCES `exhibits` (`exhibit_id`),
  CONSTRAINT `maintenance_ibfk_3` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`Employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance`
--

LOCK TABLES `maintenance` WRITE;
/*!40000 ALTER TABLE `maintenance` DISABLE KEYS */;
/*!40000 ALTER TABLE `maintenance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `managers_type`
--

DROP TABLE IF EXISTS `managers_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `managers_type` (
  `manager_id` int NOT NULL,
  `type_of_manager` enum('Veterinarian','Giftshop','General') DEFAULT 'General',
  PRIMARY KEY (`manager_id`),
  UNIQUE KEY `manager_id` (`manager_id`,`type_of_manager`),
  CONSTRAINT `managers_type_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`Employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `managers_type`
--

LOCK TABLES `managers_type` WRITE;
/*!40000 ALTER TABLE `managers_type` DISABLE KEYS */;
INSERT INTO `managers_type` VALUES (1,'General'),(7,'Veterinarian'),(9,'Giftshop');
/*!40000 ALTER TABLE `managers_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medical_records`
--

DROP TABLE IF EXISTS `medical_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_records` (
  `record_id` int NOT NULL AUTO_INCREMENT,
  `animal_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `enclosure_id` int NOT NULL,
  `location` varchar(200) NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `record_type` enum('Medication','Surgery','Disease','Vaccination','Injury','Checkup','Dental','Post-Mortem','Other') DEFAULT NULL,
  `diagnosis` text,
  `treatment` text,
  `followup` date DEFAULT NULL,
  `additional` text,
  PRIMARY KEY (`record_id`),
  KEY `animal_id` (`animal_id`),
  KEY `employee_id` (`employee_id`),
  KEY `enclosure_id` (`enclosure_id`),
  CONSTRAINT `medical_records_ibfk_1` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`animal_id`),
  CONSTRAINT `medical_records_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`Employee_id`),
  CONSTRAINT `medical_records_ibfk_3` FOREIGN KEY (`enclosure_id`) REFERENCES `enclosures` (`enclosure_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_records`
--

LOCK TABLES `medical_records` WRITE;
/*!40000 ALTER TABLE `medical_records` DISABLE KEYS */;
INSERT INTO `medical_records` VALUES (9,69,26,10,'Lion Lookout Medical Bay','2025-04-14 00:00:00','Disease','Infection responding to treatment but animal remains weak, fever reduced','Continuing antibiotic treatment, reducing anti-inflammatory dosage, maintaining nutritional support','2025-04-16','Moved from critical to serious condition. Beginning to show interest in surroundings but still refusing solid food.Need to be seen.'),(10,70,26,10,'Lion Lookout Medical Bay','2025-04-12 14:30:00','Disease','Mild respiratory infection, decreased appetite','Oral antibiotics (Amoxicillin 10mg/kg BID), vitamin supplements','2025-04-16','Likely secondary infection from stress due to primary lion\'s illness. Maintaining close observation.'),(11,65,26,8,'Polar Peak Examination Room','2025-03-25 08:45:00','Checkup','Annual health assessment. No abnormalities detected. Healthy coat and teeth.','Routine vaccinations updated, blood samples collected for baseline values','2026-03-25','Excellent physical condition for age. Weight: 486kg. Slightly worn tooth enamel but within normal limits for age.'),(12,45,26,1,'Primate Health Center','2025-03-10 00:00:00','Injury','Minor laceration on left forearm, likely from branch interaction','Wound cleaned and treated with topical antibiotic. ','2025-03-13','Injury is minor. Animal is maintaining normal behavior and social interactions.'),(13,66,26,9,'Savanna Mobile Unit','2025-02-15 11:00:00','Vaccination','Annual vaccination assessment. No abnormalities detected.','Administered Equine encephalomyelitis and tetanus vaccines','2026-02-15','Slight localized swelling at injection site. Normal reaction. Overall health excellent.'),(14,51,27,3,'Herpetology Ward','2025-03-05 10:30:00','Disease','Foreign body obstruction in digestive tract. X-rays confirmed small stone ingestion.','Surgical removal of foreign body under general anesthesia (Isoflurane). IV fluids administered during recovery.','2025-03-08','Surgery successful. Object removed without complications. Animal recovering well in isolation habitat with increased temperature gradient.'),(15,51,27,3,'Dune Den Medical Bay','2025-03-08 09:45:00','Surgery','Post-operative assessment. Incision healing well. Normal behavior returning.','Antibiotic course continued (Baytril 5mg/kg). Increased hydration. Soft food diet.','2025-03-12','Recovery progressing as expected. Animal beginning to bask normally. Offering favorite food items to encourage eating.'),(16,51,27,3,'Dune Den Medical Bay','2025-03-12 10:00:00','Surgery','Post-operative follow-up. Incision fully healed. Normal appetite returned.','Discontinued antibiotics. Returned to regular diet.',NULL,'Full recovery achieved. Returned to normal enrichment activities.'),(17,71,27,11,'Aquatic Veterinary Center','2025-04-01 14:20:00','Injury','Routine health assessment. Minor abrasion on dorsal fin.','Antimicrobial treatment added to quarantine tank. 15-minute immersion treatment daily for 5 days.','2025-04-06','Abrasion likely from interaction with tank decoration. Environmental enrichment items repositioned.'),(18,72,27,11,'Aquatic Veterinary Center','2025-04-01 15:00:00','Checkup','Routine health assessment. Excellent condition. No abnormalities detected.','None required.','2025-10-01','Perfect bill of health. Swimming patterns normal. Excellent feeding response.'),(19,73,27,11,'Aquatic Veterinary Center','2025-04-01 15:45:00','Checkup','Routine health assessment. Minor clouding in left eye.','Topical antibiotic eye drops administered via directed water stream during feeding.','2025-04-08','Clouding appears to be minor irritation rather than infection. Monitoring closely.'),(21,75,27,12,'Marine Laboratory','2025-03-25 00:00:00','Disease','Fin rot successfully treated. New fin growth visible.','Return to main exhibition tank. Continued checking on fish.','2025-04-15','Complete recovery expected. Water quality parameters in main tank adjusted to optimize health.'),(22,59,27,6,'Wetlands Veterinary Unit','2025-02-20 09:00:00','Dental','Fractured posterior tooth with minor gum inflammation.','Tooth extraction under anesthesia. Antiseptic mouth rinse applied.','2025-02-27','Procedure performed without complications. Animal recovered well from anesthesia. Soft food diet recommended for 7 days.'),(23,59,27,6,'Wetlands Veterinary Unit','2025-02-27 09:30:00','Dental','Extraction site healing well. No signs of infection.','None required.',NULL,'Recovery complete. Returned to normal diet. Behavior normal.'),(24,63,28,7,'Arctic Care Unit','2025-03-15 13:00:00','Disease','Suspected aspergillosis. Respiratory distress, lethargy.','Initiated antifungal treatment (Itraconazole 10mg/kg). Supplemental oxygen provided.','2025-03-17','Preliminary diagnosis based on symptoms and environment. Sent samples for culture to confirm. Isolated from colony.'),(25,63,28,7,'Arctic Care Unit','2025-03-17 13:30:00','Disease','Confirmed aspergillosis from culture results.','Continued antifungal treatment. Added nebulization therapy with Amphotericin B.','2025-03-20','Responding well to treatment. Respiratory rate improving. Increasing food intake.'),(26,63,28,7,'Arctic Care Unit','2025-03-20 14:00:00','Disease','Significant improvement in respiratory function. Energy levels returning to normal.','Continued oral antifungal medication. Discontinued nebulization.','2025-03-27','Recovery progressing well. Maintaining in isolation for complete course of medication.'),(27,63,28,7,'Arctic Care Unit','2025-03-27 13:45:00','Disease','Recovery complete. Normal respiratory function restored.','Discontinued antifungal medication. Return to colony approved.',NULL,'Full recovery achieved. Environment in penguin habitat evaluated for fungal spore control.'),(28,61,28,7,'Arctic Care Unit','2025-03-15 14:30:00','Checkup','Preventative examination due to colony exposure to aspergillosis case. No symptoms detected.','Prophylactic low-dose antifungal for high-risk individuals sharing habitat.','2025-03-22','No signs of infection. Good precautionary measure given the contagious nature of the detected pathogen.'),(29,62,28,7,'Arctic Care Unit','2025-03-15 15:00:00','Checkup','Preventative examination. No symptoms of aspergillosis.','Prophylactic low-dose antifungal treatment.','2025-03-22','No signs of infection. Will continue monitoring colony closely.'),(30,78,28,13,'Avian Health Center','2025-04-05 10:00:00','Checkup','Annual health assessment. Mild feather plucking on right wing.','Topical anti-itch treatment. Environmental enrichment increased.','2025-04-12','Plucking likely due to seasonal molting stress. Behavior otherwise normal.'),(31,79,28,13,'Avian Health Center','2025-04-05 10:45:00','Checkup','Annual health assessment. No abnormalities detected.','Avian polyomavirus vaccine administered.','2026-04-05','Excellent condition. Weight and vitals within normal parameters.'),(32,80,28,13,'Avian Health Center','2025-04-05 11:30:00','Checkup','Annual health assessment. Mild weight loss noted since previous checkup.','Dietary supplements added to feed. Increased protein content in diet.','2025-04-19','Weight loss is 5% from previous year. Not critical but warrants monitoring and nutritional intervention.'),(35,85,28,15,'Invertebrate Hospital','2025-04-03 16:00:00','Checkup','Pre-molt assessment for tarantula. Reduced appetite noted in preparation for molt.','Increased humidity in habitat. Removed food items to prevent stress during molt.','2025-04-17','Natural molting process beginning. Isolation area prepared with appropriate moisture levels.'),(36,85,28,15,'Invertebrate Hospital','2025-04-17 16:30:00','Other','Successful completion of molt. New exoskeleton hardening appropriately.','Reintroduced small prey items. Maintained elevated humidity.',NULL,'Molt completed without complications. New exoskeleton developing proper coloration.'),(37,83,28,14,'Entomology Lab','2025-04-08 14:00:00','Post-Mortem','Natural end of lifespan for butterfly. No signs of disease or injury.','None. Specimen preserved for educational collection.',NULL,'Normal lifespan for species. Habitat conditions optimal. No concerns for remaining population.'),(38,55,28,5,'Wetlands Clinic','2025-03-01 00:00:00','Disease','Had a rash','Wound cleaned and closed with two sutures under local anesthesia. ','2025-03-08','Injury likely from interaction with sharp shell in habitat. '),(39,55,28,5,'Wetlands Clinic','2025-03-08 00:00:00','Surgery','Sutures intact. Wound healing well with no signs of infection.','Topical antibiotic reapplied. \nAdded new rash ointment','2025-04-15','Recovery progressing normally. Animal weight-bearing on affected leg without difficulty.');
/*!40000 ALTER TABLE `medical_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `memberships`
--

DROP TABLE IF EXISTS `memberships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `memberships` (
  `membership_id` int NOT NULL AUTO_INCREMENT,
  `visitor_id` int NOT NULL,
  `max_guests` int DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`membership_id`),
  KEY `memberships_ibfk_1` (`visitor_id`),
  CONSTRAINT `memberships_ibfk_1` FOREIGN KEY (`visitor_id`) REFERENCES `visitors` (`visitor_id`) ON DELETE CASCADE,
  CONSTRAINT `memberships_chk_1` CHECK (((`max_guests` >= 0) and (`max_guests` <= 4)))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `memberships`
--

LOCK TABLES `memberships` WRITE;
/*!40000 ALTER TABLE `memberships` DISABLE KEYS */;
INSERT INTO `memberships` VALUES (3,14,4,'2025-04-01 21:52:00','2026-04-01'),(6,16,2,'2025-04-03 17:22:00','2025-04-30'),(9,39,4,'2025-04-19 00:41:56','2026-04-19');
/*!40000 ALTER TABLE `memberships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` decimal(6,2) DEFAULT NULL,
  `total_amount` decimal(6,2) DEFAULT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `product_id` (`product_id`),
  KEY `order_items_ibfk_1` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (29,23,1,1,24.99,24.99),(30,23,5,1,22.99,22.99),(31,24,1,1,24.99,24.99),(32,24,5,1,22.99,22.99),(35,26,4,1,12.99,12.99),(36,27,1,1,24.99,24.99),(37,27,5,2,22.99,45.98),(38,27,3,1,29.99,29.99),(39,28,2,1,19.99,19.99),(40,28,4,1,12.99,12.99),(41,29,6,1,18.99,18.99),(42,30,4,1,12.99,12.99),(43,31,2,2,19.99,39.98),(44,32,1,1,24.99,24.99),(45,33,2,1,19.99,19.99),(46,33,3,2,29.99,59.98),(47,34,4,3,12.99,38.97),(48,35,2,1,19.99,19.99),(49,36,1,2,24.99,49.98),(50,36,5,1,22.99,22.99),(51,37,3,2,29.99,59.98),(52,38,6,1,18.99,18.99),(53,39,5,1,22.99,22.99),(54,40,2,1,19.99,19.99),(55,40,4,1,12.99,12.99),(58,43,1,1,24.99,24.99),(59,43,5,1,22.99,22.99),(60,44,3,3,29.99,89.97),(62,46,2,1,19.99,19.99),(63,46,3,2,29.99,59.98),(64,47,4,2,12.99,25.98),(65,48,5,1,22.99,22.99),(66,49,1,1,24.99,24.99),(67,49,3,1,29.99,29.99),(68,50,10,2,29.00,58.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`ajnguye3`@`%`*/ /*!50003 TRIGGER `after_order_item_insert` AFTER INSERT ON `order_items` FOR EACH ROW BEGIN
    UPDATE products
    SET amount_stock = amount_stock - NEW.quantity
    WHERE product_id = NEW.product_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `visitor_id` int DEFAULT NULL,
  `shop_id` int DEFAULT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `total_amount` decimal(8,2) DEFAULT NULL,
  `payment_status` enum('pending','completed','failed') DEFAULT 'pending',
  PRIMARY KEY (`order_id`),
  KEY `shop_id` (`shop_id`),
  KEY `orders_ibfk_1` (`visitor_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`visitor_id`) REFERENCES `visitors` (`visitor_id`) ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`shop_id`) REFERENCES `gift_shop` (`shop_id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (23,16,1,'2025-04-15 02:50:00',47.98,'pending'),(24,22,1,'2025-04-17 14:35:11',47.98,'pending'),(26,13,1,'2025-04-09 11:00:00',12.99,'completed'),(27,27,1,'2025-04-12 12:15:00',100.96,'pending'),(28,24,1,'2025-04-16 13:00:00',32.98,'failed'),(29,29,1,'2025-04-18 14:30:00',18.99,'completed'),(30,25,1,'2025-03-22 10:12:00',12.99,'completed'),(31,14,1,'2025-03-24 16:45:00',39.98,'completed'),(32,22,1,'2025-03-25 13:30:00',24.99,'failed'),(33,15,1,'2025-03-26 09:20:00',79.97,'completed'),(34,21,1,'2025-03-28 18:00:00',38.97,'pending'),(35,45,1,'2025-03-30 14:30:00',19.99,'completed'),(36,26,1,'2025-04-01 12:50:00',72.97,'completed'),(37,16,1,'2025-04-02 17:40:00',59.98,'failed'),(38,18,1,'2025-04-03 11:11:00',18.99,'completed'),(39,39,1,'2025-04-04 16:30:00',22.99,'completed'),(40,40,1,'2025-04-05 10:05:00',32.98,'pending'),(43,13,1,'2025-04-09 11:35:00',47.98,'completed'),(44,29,1,'2025-04-10 16:20:00',89.97,'completed'),(46,24,1,'2025-04-13 18:35:00',79.97,'completed'),(47,25,1,'2025-04-14 14:30:00',25.98,'completed'),(48,22,1,'2025-04-15 16:10:00',22.99,'pending'),(49,15,1,'2025-04-18 13:00:00',54.98,'completed'),(50,50,1,'2025-04-21 00:14:28',58.00,'pending');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT NULL,
  `name` varchar(30) NOT NULL,
  `price` decimal(5,2) NOT NULL,
  `amount_stock` int DEFAULT NULL,
  `buy_limit` int NOT NULL,
  `category` varchar(50) NOT NULL,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `name` (`name`),
  KEY `shop_id` (`shop_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `gift_shop` (`shop_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'Zoo Plush Elephant',24.99,6,2,'plush'),(2,1,'Safari Hat',19.99,12,100,'clothing'),(3,1,'Animal Encyclopedia',29.99,5,100,'books'),(4,1,'Zoo Keychain Set',12.99,6,100,'souvenirs'),(5,1,'Lion Plush',22.99,14,100,'plush'),(6,1,'Zoo T-Shirt',18.99,1,100,'clothing'),(10,1,'Simba plushy',29.00,18,2,'plush');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`ajnguye3`@`%`*/ /*!50003 TRIGGER `stock_alert_after_update` AFTER UPDATE ON `products` FOR EACH ROW BEGIN
     IF NEW.amount_stock <= 4 AND OLD.amount_stock > 4 THEN
         INSERT INTO alerts (receiver_id, alert_message, created_at, status)
         VALUES (
             (SELECT manager_id FROM gift_shop WHERE shop_id = NEW.shop_id LIMIT 1),
             CONCAT('Alert: Stock for product "', NEW.name, '" is low. Only ', NEW.amount_stock, ' items left.'),
             NOW(),
             'active'
         );
     END IF;
 END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`ajnguye3`@`%`*/ /*!50003 TRIGGER `stock_resolved_after_update` AFTER UPDATE ON `products` FOR EACH ROW BEGIN
     IF OLD.amount_stock <= 4 AND NEW.amount_stock > 4 THEN
         -- Mark the previous alert as resolved
         UPDATE alerts
         SET status = 'resolved', resolved_at = NOW()
         WHERE alert_message LIKE CONCAT('%', OLD.name, '%')
         AND status = 'active';
 
         -- Optionally, add a new alert that stock was replenished
         INSERT INTO alerts (receiver_id, alert_message, created_at, status)
         VALUES (
             (SELECT manager_id FROM gift_shop WHERE shop_id = NEW.shop_id LIMIT 1),
             CONCAT('Notice: Stock for product "', NEW.name, '" was replenished to ', NEW.amount_stock, ' units.'),
             NOW(),
             'resolved'
         );
     END IF;
 END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `restaurants`
--

DROP TABLE IF EXISTS `restaurants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurants` (
  `restaurant_id` int NOT NULL AUTO_INCREMENT,
  `manager_id` int NOT NULL,
  `name` varchar(30) NOT NULL DEFAULT 'Jungle Safari Cafe',
  `location` varchar(100) NOT NULL DEFAULT 'Safari',
  `operating_hours` datetime NOT NULL,
  `capacity` int NOT NULL,
  `contact_number` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`restaurant_id`),
  UNIQUE KEY `name` (`name`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `restaurants_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`Employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurants`
--

LOCK TABLES `restaurants` WRITE;
/*!40000 ALTER TABLE `restaurants` DISABLE KEYS */;
/*!40000 ALTER TABLE `restaurants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `visitor_id` int NOT NULL,
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `price` decimal(5,2) NOT NULL,
  `ticket_type` enum('child','adult','senior','group','member') DEFAULT NULL,
  `purchase_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  KEY `tickets_ibfk_1` (`visitor_id`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`visitor_id`) REFERENCES `visitors` (`visitor_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (11,14,'2025-04-01 08:07:31','2025-04-02 08:07:31',24.99,'adult','2025-04-01 08:07:31'),(12,14,'2025-04-01 08:07:31','2025-04-02 08:07:31',24.99,'adult','2025-04-01 08:07:31'),(13,14,'2025-04-01 11:52:55','2025-04-02 11:52:55',34.98,'child','2025-04-01 11:52:55'),(14,14,'2025-04-01 11:52:55','2025-04-02 11:52:55',34.98,'child','2025-04-01 11:52:55'),(15,14,'2025-04-01 11:52:55','2025-04-02 11:52:55',34.98,'senior','2025-04-01 11:52:55'),(16,14,'2025-04-01 11:52:55','2025-04-02 11:52:55',34.98,'senior','2025-04-01 11:52:55'),(17,14,'2025-04-01 11:53:20','2025-04-02 11:53:20',0.00,'member','2025-04-01 11:53:20'),(18,14,'2025-04-01 11:53:20','2025-04-02 11:53:20',0.00,'member','2025-04-01 11:53:20'),(21,16,'2025-04-15 02:48:59','2025-04-16 02:48:59',24.99,'adult','2025-04-15 02:48:59'),(22,16,'2025-04-15 02:48:59','2025-04-16 02:48:59',24.99,'adult','2025-04-15 02:48:59'),(28,22,'2025-04-18 00:00:00','2025-04-19 00:00:00',14.99,'child','2025-04-17 14:33:22'),(47,39,'2025-04-21 00:00:00','2025-04-22 00:00:00',24.99,'adult','2025-04-19 00:42:25'),(48,39,'2025-04-21 00:00:00','2025-04-22 00:00:00',24.99,'adult','2025-04-19 00:42:25'),(49,39,'2025-04-21 00:00:00','2025-04-22 00:00:00',24.99,'adult','2025-04-19 00:42:25'),(50,39,'2025-04-21 00:00:00','2025-04-22 00:00:00',14.99,'child','2025-04-19 00:42:25'),(51,39,'2025-04-21 00:00:00','2025-04-22 00:00:00',19.99,'senior','2025-04-19 00:42:25'),(52,39,'2025-04-21 00:00:00','2025-04-22 00:00:00',19.99,'senior','2025-04-19 00:42:25');
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visitors`
--

DROP TABLE IF EXISTS `visitors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visitors` (
  `visitor_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(30) NOT NULL,
  `Minit_name` varchar(30) DEFAULT NULL,
  `last_name` varchar(30) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(10) NOT NULL,
  `date_of_birth` date NOT NULL,
  `first_login` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `gender` enum('male','female','other','prefer not to say') DEFAULT NULL,
  `street_address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `zipcode` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'customer',
  PRIMARY KEY (`visitor_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `user_name` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitors`
--

LOCK TABLES `visitors` WRITE;
/*!40000 ALTER TABLE `visitors` DISABLE KEYS */;
INSERT INTO `visitors` VALUES (13,'Yeni',NULL,'K','lemony','ookuku@cougarnet.uh.edu','$2b$10$xfqrKKTOp9Pb9mq3dK4rjuH1Pz65jyYtv72D7ISON4L2ISPQAyKA2','1234567891','2003-07-19','2025-03-31 23:17:09','2025-04-19 10:19:54','female','uni houston','Houston','TX','77407','United States','customer'),(14,'test','test','test','test1','test@example.com','$2b$10$Nym3EISa7bPAgCHg9TpVnefUrvRL/S0vxhwypLSo5fil5e2uCXZMm','1234567890','2004-12-31','2025-04-01 04:34:46','2025-04-15 03:11:39','prefer not to say','123 address creek','Houston','Texas','12345','United States','customer'),(15,'Jamie','L','Carte','jamie_c23','jamiecarter@example.net','$2b$10$/unscmpWpCPTeO.4C7ne1u3LQ9yeuWA9.6TuBhtub96bgx3yyEUXq','3467893210','1995-03-11','2025-04-08 16:55:34','2025-04-15 03:10:47','female','221B Baker Street','Dallas','Texas','75201','United States','customer'),(16,'Yesenia','Emily','Rodriguez','Yesenia231','Taylor425@gmail.com','Thebestwoman231.','8848284828','2002-04-29','2025-04-15 02:47:38','2025-04-15 03:09:52','female','123 UH','houston','texas','49929','United States','customer'),(18,'dahrail','','cooks','waz9pluz10','dahrail@ex.com','$2b$10$x06IEUuui1ik58pIrN5UCemow4jYKvNtQRs7gStSvETYDzsczRi0S','7133250666','2024-11-02','2025-04-16 19:34:02','2025-04-16 19:34:02','male','University of Houston','Houston','Texas','77065','United States','customer'),(21,'Mike','','Jones','Mickey001','bassp894@gmail.com','$2b$10$x7pDJI2QjKoacQi/eO7QQ.NDno1IfHIv8WoWeiZqB79xkWm3rP9Ne','1234567891','2004-12-22','2025-04-16 19:37:23','2025-04-16 19:37:23','male','asfdfada','asdfaf','fadsfsaf','47377','asfafsd','customer'),(22,'Mike','','Jones','Izan231','ThebestClass231@gmail.com','$2b$10$Et5jkpwijRQyPCH4VE96yOQC1NCCwTg8hyvbMqjydn8SmBehs7zeK','1234567809','1999-12-01','2025-04-17 14:29:40','2025-04-17 14:31:32','male','Umas class','Houston','Texas','79539','United States','customer'),(24,'Bahar','','Abdi','babdi04','babdi@cougarnet.uh.edu','$2b$10$Cyq0z9FDLJTb6c2z6A/HXeMPxVwzrNe5NZrzaE2lg6VaqfSVfZ3bG','8328328328','2004-05-09','2025-04-18 08:45:28','2025-04-18 08:45:28','female','1507 Kincross Court','Katy','TX','77450','United States','customer'),(25,'Mike','','Brown','bassprofisher231','Mikejones231@gmail.com','$2b$10$jBLodaEqYu/NKwOWeJ5t/eVU.n/DQ4Vzf6tisXg/xBnCXrZhO52dS','1234567890','2001-12-13','2025-04-18 18:46:31','2025-04-18 18:46:31','male','ashf','afsd','sdfs','88888','asdfasf','customer'),(26,'Austin','','Jones','Mickey0012','mm231454510@gmail.com','$2b$10$Ap09YDiA8oRtWXjRH2wYIO1REfSiOjaYJD9gdXfBRdkUfzcPQBCTy','1234567890','2004-12-02','2025-04-18 19:21:52','2025-04-18 19:21:52','male','fajsfd','ljkjk','ljlkj','99999','fasfsf','customer'),(27,'Mike','','Jones','Clearlight15','bass894@gmail.com','$2b$10$q1Fd3kDllSU/zg4jAQPOouhpxciSlMdwqTul1NIJcz7Y5T08frt4.','8328403241','2001-12-02','2025-04-18 20:07:20','2025-04-18 20:07:20','male','asdfasfd','Houston','TX','88888','United States','customer'),(29,'Austin','','Rodriguez','Mickey00123','austinnj@gmail.com','$2b$10$bg6UNAI/Owdq7oSq/KbBRO.USDeCgKbi/na9eqt03pyh4ngkE4AkO','1234567890','2003-12-02','2025-04-18 20:44:43','2025-04-18 20:44:43','male','jasflff','dsafads','dsaf','48382','sdfasdf','customer'),(39,'test','','user','testuser','test@e.com','$2b$10$ceGeLd2aNhCaUwEAinJp1el1byZ76SqiLTk.xeJl11NjLESz3sPN.','1231231234','2003-01-02','2025-04-19 00:40:59','2025-04-19 00:40:59','male','123 lane','Houston','TX','12345','USA','customer'),(40,'Two','','Bruh','tttt','example@gmail.com','$2b$10$cwDJOyfluIJjARGjuCoJyeGaA.ebXgWGffU2YUGJh8fjRMHvUDBm6','1234567890','2002-02-02','2025-04-19 05:51:00','2025-04-19 05:51:00','female','1111 bruh','houston','tx','77089','United States','customer'),(45,'L','A','R','warrior713','Mikejones713@gmail.com','$2b$10$22w.Eo6F9/kJs9U3LrHbPOiIKsWpywZ06qoghpHnU2oOq4B3lLgV.','7138322810','1999-05-09','2025-04-19 22:06:37','2025-04-19 22:06:37','male','3499 evergreen','houston','Texas','77087','United States','customer'),(47,'testy','','input','test','test@email.com','$2b$10$aowjJCcv.FMEdk5jnkJY5.v2C0TRKfCB4YmauWjJB1gT16QYtkvkm','1234567890','2002-02-02','2025-04-20 08:21:23','2025-04-20 08:21:23','female','123 test street','richmond','texas','77406','United States','customer'),(50,'John','','Doe','johndoe','JohnDoe123@gmail.com','$2b$10$ejmlBjJG3sDhxUqvlgY/XOsZLY9JziWFc9U2MQVZipnvT8yjvZKqS','1234567890','2002-12-20','2025-04-20 21:16:55','2025-04-21 01:07:50','male','sdfasfsdf','safafsdaf','afsdfa','12345','United States','customer');
/*!40000 ALTER TABLE `visitors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `volunteer_shift_records`
--

DROP TABLE IF EXISTS `volunteer_shift_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `volunteer_shift_records` (
  `record_id` int NOT NULL AUTO_INCREMENT,
  `clock_in` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `clock_out` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `volunteer_id` int DEFAULT NULL,
  PRIMARY KEY (`record_id`),
  KEY `volunteer_id` (`volunteer_id`),
  CONSTRAINT `volunteer_shift_records_ibfk_1` FOREIGN KEY (`record_id`) REFERENCES `volunteers` (`volunteer_id`),
  CONSTRAINT `volunteer_shift_records_ibfk_2` FOREIGN KEY (`volunteer_id`) REFERENCES `volunteers` (`volunteer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `volunteer_shift_records`
--

LOCK TABLES `volunteer_shift_records` WRITE;
/*!40000 ALTER TABLE `volunteer_shift_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `volunteer_shift_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `volunteers`
--

DROP TABLE IF EXISTS `volunteers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `volunteers` (
  `volunteer_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `middle_name` varchar(30) DEFAULT NULL,
  `gender` enum('male','female','other','prefer not to say') NOT NULL,
  `street_address` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `zip_code` varchar(20) NOT NULL,
  `country` varchar(100) NOT NULL,
  `start_shift` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_shift` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `exhibit_id` int DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  PRIMARY KEY (`volunteer_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `user_name` (`user_name`),
  KEY `exhibit_id` (`exhibit_id`),
  CONSTRAINT `volunteers_ibfk_1` FOREIGN KEY (`exhibit_id`) REFERENCES `exhibits` (`exhibit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `volunteers`
--

LOCK TABLES `volunteers` WRITE;
/*!40000 ALTER TABLE `volunteers` DISABLE KEYS */;
/*!40000 ALTER TABLE `volunteers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-20 21:14:40
