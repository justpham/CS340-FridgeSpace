
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


