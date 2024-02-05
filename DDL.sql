
/*
    Main Entity Tables
*/

CREATE OR REPLACE TABLE Groceries (
    --Attributes--
    grocery_id          int not NULL UNIQUE AUTO_INCREMENT,       
    grocery_name        varchar(255) not NULL,
    grocery_category    int not NULL,
    expiration_date     date NULL,
    remaining:          tinyint(1) not NULL DEFAULT Yes,

    --Constraints--
    PRIMARY KEY (grocery_id),
    FOREIGN KEY (grocery_category) REFERENCES Grocery_Categories(category_id)
);

CREATE OR REPLACE TABLE Grocery_Categories (
    --Attributes--
    category_id         int not NULL UNIQUE AUTO_INCREMENT,
    category_name       varchar(255);

    --Constraints
    PRIMARY KEY (category_id)
);

CREATE OR REPLACE TABLE Owners (
    --Attributes--
    owner_id            int not NULL UNIQUE AUTO_INCREMENT,
    owner_name          varchar(255) not NULL,
    email               varchar(255) not NULL,

    --Constraints--
    PRIMARY KEY (owner_id)
);

CREATE OR REPLACE TABLE Activity_Logs (
    --Attributes--
    activity_id         int not NULL UNIQUE AUTO_INCREMENT,
    activity_name       varchar(255) not NULL,
    description         TEXT NULL,
    owner_id            int not NULL,

    --Constraints--
    PRIMARY KEY (activity_id),
    FOREIGN KEY (owner_id) REFERENCES Owners(owner_id)

);

/*
    Intersection Tables
*/

CREATE OR REPLACE TABLE Groceries_Owners
(
    --Attributes--
    groceries_owners_id int not NULL UNIQUE AUTO_INCREMENT,
    grocery_id          int not NULL,
    owner_id            int not NULL,

    --Constraints--
    PRIMARY KEY (groceries_owners_id)
    FOREIGN KEY (grocery_id) REFERENCES Groceries(grocery_id)
    FOREIGN KEY (owner_id) REFERENCES Owners(owner_id)
);

CREATE OR REPLACE TABLE Activity_Logs_Groceries
(
    --Attributes--
    activity_logs_groceries_id  int not NULL UNIQUE AUTO_INCREMENT,
    grocery_id                  int not NULL,
    activity_id                 int not NULL,

    --Constraints--
    PRIMARY KEY (groceries_owners_id)
    FOREIGN KEY (grocery_id) REFERENCES Groceries(grocery_id)
    FOREIGN KEY (activity_id) REFERENCES Activity_Logs(activity_id)
);

/*
    Example Data
*/

INSERT INTO Grocery_Categories
    (
        category_name
    )
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


INSERT INTO Groceries
    (
        grocery_name,
        grocery_category,
        expiration_date,
    )
VALUES
    (
        "Rolled Oats",
        SELECT category_id FROM Grocery_Categories WHERE category_name = "Breakfast Items",
        NULL
    ),
    (
        "Greek Yogurt",
        SELECT category_id FROM Grocery_Categories WHERE category_name = "Dairy",
        2024-02-14
    ),
    (
        "Almond Milk",
        SELECT category_id FROM Grocery_Categories WHERE category_name = "Breakfast Items",
        2024-03-01
    ),
    (
        "Honey",
        SELECT category_id FROM Grocery_Categories WHERE category_name = "Condiments",
        NULL
    );

INSERT INTO Owners
    (
        owner_name,
        email
    )
VALUES
    (
        "Justin Pham",
        "phamjus@oregonstate.edu"
    ),
    (
        "Thuy Duyen Doan",
        "doant@oregonstate.edu"
    ),
    (
        "Bean",
        "mydoglol2014@gmail.com"
    );


INSERT INTO Activity_Logs
    (
        activity_name,
        description,
        owner_id
    )
VALUES
    (
        "Justin Added Groceries",
        "Items Added: Rolled Oats, Greek Yogurt. Greek Yogurt for me (Justin) but Rolled Oats for Everybody",
        SELECT owner_id FROM Owners WHERE owner_name = "Justin Pham"
    ),
    (
        "Duyen Added Groceries",
        "Items Added: Honey. Everybody will be able to use it",
        SELECT owner_id FROM Owners WHERE owner_name = "Thuy Duyen Doan"
    ),
    (
        "Justin Used 4 Groceries",
        "Made 4 jars of overnight oats for myself only. please do not eat",
        SELECT owner_id FROM Owners WHERE owner_name = "Justin Pham"
    );

INSERT INTO Groceries_Owners (
    grocery_id,
    owner_id
)
VALUES
(
    SELECT grocery_id FROM Groceries WHERE grocery_name="Rolled Oats",
    SELECT owner_id FROM Owners WHERE owner_name="Thuy Duyen Doan"
),
(
    SELECT grocery_id FROM Groceries WHERE grocery_name="Rolled Oats",
    SELECT owner_id FROM Owners WHERE owner_name="Justin Pham"
),
(
    SELECT grocery_id FROM Groceries WHERE grocery_name="Rolled Oats",
    SELECT owner_id FROM Owners WHERE owner_name="Bean"
),
(
    SELECT grocery_id FROM Groceries WHERE grocery_name="Greek Yogurt",
    SELECT owner_id FROM Owners WHERE owner_name="Justin Pham"
),
(
    SELECT grocery_id FROM Groceries WHERE grocery_name="Honey",
    SELECT owner_id FROM Owners WHERE owner_name="Justin Pham"
),
(
    SELECT grocery_id FROM Groceries WHERE grocery_name="Honey",
    SELECT owner_id FROM Owners WHERE owner_name="Thuy Duyen Doan"
),
(
    SELECT grocery_id FROM Groceries WHERE grocery_name="Honey",
    SELECT owner_id FROM Owners WHERE owner_name="Bean"
),
(
    SELECT grocery_id FROM Groceries WHERE grocery_name="Almond Milk",
    SELECT owner_id FROM Owners WHERE owner_name="Justin Pham"
),
(
    SELECT grocery_id FROM Groceries WHERE grocery_name="Almond Milk",
    SELECT owner_id FROM Owners WHERE owner_name="Thuy Duyen Doan"
);

INSERT INTO Activity_Logs_Groceries
(
    grocery_id,
    activity_id
)
VALUES
(
    SELECT grocery_id FROM Groceries WHERE grocery_name = "Rolled Oats",
    SELECT activity_id FROM Activity_Logs WHERE Activity_name = "Justin Added Groceries"
),
(
    SELECT grocery_id FROM Groceries WHERE grocery_name = "Greek Yogurt",
    SELECT activity_id FROM Activity_Logs WHERE Activity_name = "Justin Added Groceries"
),
(
    SELECT grocery_id FROM Groceries WHERE grocery_name = "Honey",
    SELECT activity_id FROM Activity_Logs WHERE Activity_name = "Duyen Added Groceries"
),
(
    SELECT grocery_id FROM Groceries WHERE grocery_name = "Rolled Oats",
    SELECT activity_id FROM Activity_Logs WHERE Activity_name = "Justin Used 4 Groceries"
),
(
    SELECT grocery_id FROM Groceries WHERE grocery_name = "Greek Yogurt",
    SELECT activity_id FROM Activity_Logs WHERE Activity_name = "Justin Used 4 Groceries"
),
(
    SELECT grocery_id FROM Groceries WHERE grocery_name = "Honey",
    SELECT activity_id FROM Activity_Logs WHERE Activity_name = "Justin Used 4 Groceries"
),
(
    SELECT grocery_id FROM Groceries WHERE grocery_name = "Almond Milk",
    SELECT activity_id FROM Activity_Logs WHERE Activity_name = "Justin Used 4 Groceries"
);