/*
 Navicat Premium Data Transfer

 Source Server         : wsl-mysql
 Source Server Type    : MySQL
 Source Server Version : 80035 (8.0.35-0ubuntu0.22.04.1)
 Source Host           : 172.27.32.14:3306
 Source Schema         : userDB

 Target Server Type    : MySQL
 Target Server Version : 80035 (8.0.35-0ubuntu0.22.04.1)
 File Encoding         : 65001

 Date: 06/12/2023 10:34:38
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for trip
-- ----------------------------
DROP TABLE IF EXISTS `trip`;
CREATE TABLE `trip`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `riderID` int NOT NULL,
  `driverID` int NOT NULL,
  `day` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `departure` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `arrival` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `riderID`(`riderID` ASC) USING BTREE,
  INDEX `driverID`(`driverID` ASC) USING BTREE,
  CONSTRAINT `driverID` FOREIGN KEY (`driverID`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `riderID` FOREIGN KEY (`riderID`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of trip
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'test', 'test', 'testtesttest', 'Driver');
INSERT INTO `user` VALUES (3, 'test1', 'test1', 'test1', 'Rider');

SET FOREIGN_KEY_CHECKS = 1;
