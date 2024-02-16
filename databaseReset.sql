/*
    Source this file to restart the database
*/

SET foreign_key_checks = 0;

-- Deleting the Grocery_Categories table
DROP TABLE IF EXISTS Grocery_Categories;

-- Deleting the Groceries table
DROP TABLE IF EXISTS Groceries;

-- Deleting the Activity_Logs table
DROP TABLE IF EXISTS Activity_Logs;

-- Deleting the Owners table
DROP TABLE IF EXISTS Owners;

-- Deleting the Activity_Logs_Groceries table
DROP TABLE IF EXISTS Activity_Logs_Groceries;

-- Deleting the Groceries_Owners table
DROP TABLE IF EXISTS Groceries_Owners;

SOURCE DDL.sql;

SHOW TABLES;

SELECT * FROM Groceries;

SELECT * FROM Owners;

SELECT * FROM Activity_Logs;

SELECT * FROM Grocery_Categories;

SELECT * From Grocery