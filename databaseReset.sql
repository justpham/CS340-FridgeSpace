/*
    Source this file to restart the database
*/

SET foreign_key_checks = 1;

-- Deleting the Groceries_Owners table
DROP TABLE IF EXISTS Groceries_Owners;

-- Deleting the Activity_Logs_Groceries table
DROP TABLE IF EXISTS Activity_Logs_Groceries;

-- Deleting the Groceries table
DROP TABLE IF EXISTS Groceries;

-- Deleting the Grocery_Categories table
DROP TABLE IF EXISTS Grocery_Categories;

-- Deleting the Activity_Logs table
DROP TABLE IF EXISTS Activity_Logs;

-- Deleting the Owners table
DROP TABLE IF EXISTS Owners;






