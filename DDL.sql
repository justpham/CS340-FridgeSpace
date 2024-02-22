/*
    Main Entity Tables
*/

CREATE TABLE IF NOT EXISTS Grocery_Categories (
    -- Attributes --
    category_id         INT NOT NULL AUTO_INCREMENT UNIQUE,
    category_name       VARCHAR(255) NOT NULL,
    -- Constraints --
    PRIMARY KEY (category_id)
);

CREATE TABLE IF NOT EXISTS Groceries (
    -- Attributes --
    grocery_id          INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    grocery_name        VARCHAR(255) NOT NULL,
    grocery_category    INT NOT NULL, 
    expiration_date     DATE NULL,
    remaining           TINYINT(1) NOT NULL DEFAULT 1, -- Assuming 'Yes' is meant to indicate remaining
    -- Constraints --
    FOREIGN KEY (grocery_category) REFERENCES Grocery_Categories(category_id)
);

-- Create or Replace the Owners table --
CREATE TABLE IF NOT EXISTS Owners (
    -- Attributes --
    owner_id            INT NOT NULL AUTO_INCREMENT UNIQUE,
    fname               VARCHAR(255) NOT NULL,
    lname               VARCHAR(255) NOT NULL,
    email               VARCHAR(255) NOT NULL,
    -- Constraints --
    PRIMARY KEY (owner_id)
);

-- Create or Replace the Activity_Logs table --
CREATE TABLE IF NOT EXISTS Activity_Logs (
    -- Attributes --
    activity_id         INT NOT NULL AUTO_INCREMENT UNIQUE,
    activity_name       VARCHAR(255) NOT NULL,
    description         LONGTEXT NULL,
    owner_id            INT NULL,
    -- Constraints --
    PRIMARY KEY (activity_id),
    FOREIGN KEY (owner_id) REFERENCES Owners(owner_id)
);

/*
    Intersection Tables
*/

CREATE TABLE IF NOT EXISTS Groceries_Owners (
    -- Attributes --
    groceries_owners_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    grocery_id          INT NOT NULL,
    owner_id            INT NOT NULL,
    -- Constraints --
    PRIMARY KEY (groceries_owners_id),
    FOREIGN KEY (grocery_id) REFERENCES Groceries(grocery_id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES Owners(owner_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Activity_Logs_Groceries (
    -- Attributes --
    activity_logs_groceries_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    grocery_id                 INT NOT NULL,
    activity_id                INT NOT NULL,
    -- Constraints --
    PRIMARY KEY (activity_logs_groceries_id),
    FOREIGN KEY (grocery_id) REFERENCES Groceries(grocery_id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES Activity_Logs(activity_id) ON DELETE CASCADE
);

/*
    Example Data
*/

-- Insert into Grocery_Categories table --
INSERT INTO Grocery_Categories (category_name)
VALUES
    ("Dairy"),
    ("Meat"),
    ("Vegetables"),
    ("Fruits"),
    ("Beverages"),
    ("Snacks"),
    ("Condiments"),
    ("Leftovers"),
    ("Baked Goods"),
    ("Breakfast Items"),
    ("Baking Ingredients"),
    ("Sauces"),
    ("Spices"),
    ("Others");

-- Insert into Groceries table --
INSERT INTO Groceries (grocery_name, grocery_category, expiration_date)
VALUES
    ("Rolled Oats", (SELECT category_id FROM Grocery_Categories WHERE category_name = "Breakfast Items"), NULL),
    ("Greek Yogurt", (SELECT category_id FROM Grocery_Categories WHERE category_name = "Dairy"), '2024-02-14'),
    ("Almond Milk", (SELECT category_id FROM Grocery_Categories WHERE category_name = "Breakfast Items"), '2024-03-01'),
    ("Honey", (SELECT category_id FROM Grocery_Categories WHERE category_name = "Condiments"), NULL);

-- Insert into Owners table --
INSERT INTO Owners (fname, lname, email)
VALUES
    ("Justin", "Pham", "phamjus@oregonstate.edu"),
    ("Thuy Duyen", "Doan", "doant@oregonstate.edu"),
    ("Bean", "Dog", "mydoglol2014@gmail.com");

-- Insert into Activity_Logs table --
INSERT INTO Activity_Logs (activity_name, description, owner_id)
VALUES
    ("Justin Added Groceries", "Items Added: Rolled Oats, Greek Yogurt. Greek Yogurt for me (Justin) but Rolled Oats for Everybody", (SELECT owner_id FROM Owners WHERE fname = "Justin" AND lname = "Pham")),
    ("Duyen Added Groceries", "Items Added: Honey. Everybody will be able to use it", (SELECT owner_id FROM Owners WHERE fname = "Thuy Duyen" AND lname = "Doan")),
    ("Justin Used 4 Groceries", "Made 4 jars of overnight oats for myself only. please do not eat", (SELECT owner_id FROM Owners WHERE fname = "Justin" AND lname = "Pham"));

-- Insert into Groceries_Owners table --
INSERT INTO Groceries_Owners (grocery_id, owner_id)
VALUES
    ((SELECT grocery_id FROM Groceries WHERE grocery_name="Rolled Oats"), (SELECT owner_id FROM Owners WHERE fname="Thuy Duyen" AND lname = "Doan")),
    ((SELECT grocery_id FROM Groceries WHERE grocery_name="Rolled Oats"), (SELECT owner_id FROM Owners WHERE fname="Justin" AND lname = "Pham")),
    ((SELECT grocery_id FROM Groceries WHERE grocery_name="Rolled Oats"), (SELECT owner_id FROM Owners WHERE fname="Bean" AND lname = "Dog")),
    ((SELECT grocery_id FROM Groceries WHERE grocery_name="Greek Yogurt"), (SELECT owner_id FROM Owners WHERE fname="Justin" AND lname = "Pham")),
    ((SELECT grocery_id FROM Groceries WHERE grocery_name="Honey"), (SELECT owner_id FROM Owners WHERE fname="Justin" AND lname = "Pham")),
    ((SELECT grocery_id FROM Groceries WHERE grocery_name="Honey"), (SELECT owner_id FROM Owners WHERE fname="Thuy Duyen" AND lname = " Doan")),
    ((SELECT grocery_id FROM Groceries WHERE grocery_name="Honey"), (SELECT owner_id FROM Owners WHERE fname="Bean" AND lname = "Dog")),
    ((SELECT grocery_id FROM Groceries WHERE grocery_name="Almond Milk"), (SELECT owner_id FROM Owners WHERE fname="Justin" AND lname = " Pham")),
    ((SELECT grocery_id FROM Groceries WHERE grocery_name="Almond Milk"), (SELECT owner_id FROM Owners WHERE fname="Thuy Duyen" AND lname = " Doan"));

-- Insert into Activity_Logs_Groceries table --
INSERT INTO Activity_Logs_Groceries (grocery_id, activity_id)
VALUES
    ((SELECT grocery_id FROM Groceries WHERE grocery_name = "Rolled Oats"), (SELECT activity_id FROM Activity_Logs WHERE activity_name = "Justin Added Groceries")),
    ((SELECT grocery_id FROM Groceries WHERE grocery_name = "Greek Yogurt"), (SELECT activity_id FROM Activity_Logs WHERE activity_name = "Justin Added Groceries")),
    ((SELECT grocery_id FROM Groceries WHERE grocery_name = "Honey"), (SELECT activity_id FROM Activity_Logs WHERE activity_name = "Duyen Added Groceries")),
    ((SELECT grocery_id FROM Groceries WHERE grocery_name = "Rolled Oats"), (SELECT activity_id FROM Activity_Logs WHERE activity_name = "Justin Used 4 Groceries")),
    ((SELECT grocery_id FROM Groceries WHERE grocery_name = "Greek Yogurt"), (SELECT activity_id FROM Activity_Logs WHERE activity_name = "Justin Used 4 Groceries")),
    ((SELECT grocery_id FROM Groceries WHERE grocery_name = "Honey"), (SELECT activity_id FROM Activity_Logs WHERE activity_name = "Justin Used 4 Groceries")),
    ((SELECT grocery_id FROM Groceries WHERE grocery_name = "Almond Milk"), (SELECT activity_id FROM Activity_Logs WHERE activity_name = "Justin Used 4 Groceries"));