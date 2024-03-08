-- These are some Database Manipulation queries for a partially implemented Project Website 
-- using the bsg database.
-- Your submission should contain ALL the queries required to implement ALL the
-- functionalities listed in the Project Specs.

/*
    Grocery Categories
*/

-- List Grocery Categories
SELECT category_id, category_name FROM Grocery_Categories;

-- Delete Grocery Category
DELETE FROM Grocery_Categories WHERE category_id = :categoryIDTableInput;

-- Create Grocery Category
INSERT INTO Grocery_Categories (category_name)
VALUES
    (
        :categoryNameInput
    );

/*
    Groceries
*/

-- Create Grocery
INSERT INTO Groceries (grocery_name, grocery_category, expiration_date)
VALUES
    (
        :groceryNameInput,
        (SELECT category_id FROM Grocery_Categories WHERE category_name = :groceryCategoryNameInput),
        :expirationDateInput
    );

-- List Grocery
SELECT g.grocery_id, g.grocery_name, g.expiration_date, g.remaining, gc.category_name FROM Groceries g 
INNER JOIN Grocery_Categories gc ON category_id = g.grocery_category;

-- Delete Grocery
DELETE FROM Groceries WHERE grocery_id = :groceryIDTableInput;

-- Update Grocery
UPDATE Groceries SET grocery_name = :groceryNameInput, 
grocery_category = :categoryIDSelection, -- Drop down of avaliable categories --
expiration_date = :expirationDateInput,
remaining = :remainingInput
WHERE grocery_id = :groceryIDSelection;

/* 
    Owners
*/

-- Create Owner
INSERT INTO Owners (fname, lname, email)
VALUES
    (
        :fnameInput,
        :lnameInput,
        :emailInput
    );

-- List Owner
SELECT owner_id, fname, lname, email FROM Owners;

-- Delete Owner
DELETE FROM Owners WHERE owner_id = :ownerIDTableInput;

/* 
    Activity Logs
*/

-- Create Activity Log
INSERT INTO Activity_Logs (activity_name, description, owner_id)
VALUES
    (
        :activityNameInput,
        :descriptionInput,
        :ownerIDSelection
    );

-- List Activity Log
SELECT al.activity_id, al.activity_name, al.description, CONCAT(Owners.fname," ", Owners.lname) AS name FROM Activity_Logs al
LEFT JOIN Owners ON al.owner_id = Owners.owner_id;

-- Delete Activity Logs
DELETE FROM Activity_Logs WHERE activity_id = :activityIDTableInput;

-- Update Grocery
UPDATE Activity_Logs SET activity_name = :activity_name, 
description = :descriptionInput,
owner_id = :ownerIDSelection -- Drop down of avaliable categories --
WHERE activity_id = :activityIDSelection;

/* 
    Grocery Owners (intersection table)
*/

-- List Grocery Owners
SELECT groceries_owners_id, Groceries.grocery_name,  CONCAT(Owners.fname," ", Owners.lname) AS owner_name FROM Groceries_Owners
LEFT JOIN Owners ON Groceries_Owners.owner_id = Owners.owner_id
LEFT JOIN Groceries ON Groceries_Owners.grocery_id = Groceries.grocery_id;

-- Insert Grocery Owners (Supposed to go alonside create grocery and update grocery)
INSERT INTO Groceries_Owners (grocery_id, owner_id)
VALUES
    (
        -- If a user is inserting a grocery this is going to be defaulted to the recently created grocery
        :selectedGroceryID,
        :selectedOwnerID
    );

/* 
    Grocery Activity Log (intersection table)
*/
-- List Activity_Log_Groceries
SELECT activity_logs_groceries_id, Activity_Logs.activity_name, Groceries.grocery_name FROM Activity_Log_Groceries
LEFT JOIN Activity_Logs ON Activity_Log_Groceries.activity_id = Activity_Logs.activity_id
LEFT JOIN Groceries ON Activity_Log_Groceries.grocery_id = Groceries.grocery_id;

-- Insert 
INSERT INTO Activity_Logs_Groceries (activity_id, grocery_id)
VALUES
    (
        -- If a user is inserting an activity this is going to be defaulted to the recently created activity
        :selectedActivityID,
        :selectedGroceryID
    );

-- Deletes for Intersection Tables implemented with deleting the respective entities they are for using CASCADE

/*
    Drop down lists
*/

-- Get All Avaliable Owners

SELECT owner_id, fname, lname, email FROM Owners; --> <option value="${owner_id}">${fname} ${lname}</option> for each one

-- Get All Avaliable Grocery Categories

SELECT category_id, category_name FROM Grocery_Categories; --> <option value="${category_id}">${category_name}</option> for each one

-- Get All Avaliable Groceries

SELECT grocery_id, grocery_name FROM Groceries; --> <option value="${grocery_id}">${grocery_name}</option> for each one



