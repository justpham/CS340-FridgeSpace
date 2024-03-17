
/*
 * 
 *    SERVER + DATABASE SETUP
 *    Copied from Activity 2 - Connect Webapp to Database on Feburary 22, 2024 (https://canvas.oregonstate.edu/courses/1946034/assignments/9456203)
 * 
 */

// Express
var express = require('express');
const bodyParser = require('body-parser')   
const fs = require('fs');
const path = require('path');
var app     = express();            
const PORT = 3000
var db = require('./db-connector'); 


app.use(express.static("FridgeSpaceWebsite/public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/*
 * 
 *    HELPER FUNCTIONS
 * 
 */
 
function formatExpirationDate(rawDate) {
    const dateObj = new Date(rawDate);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/*
 * 
 *    GROCERIES SECTION
 * 
 */

app.get('/getGroceries', function(req, res){

    const query1 = "SELECT g.grocery_id, g.grocery_name, g.expiration_date, g.remaining, gc.category_name FROM Groceries g INNER JOIN Grocery_Categories gc ON category_id = g.grocery_category;"
   
    // GETS INFORMATION ABOUT ALL GROCERY ITEMS
    db.pool.query(query1, function (err, results, fields) {
        res.status(200).send(JSON.stringify(results))
    })

})

app.post('/createGroceries', function(req, res){

    // Gets req.body information from the client 
    const groceryName = req.body.grocery_name;
    const category = req.body.category;
    const ownership = req.body.ownership;

    // Since the expiration can be an optional value, handle for null
    var expirationDate
    if (req.body.expiration_date == null)
    {
        expirationDate = req.body.expiration_date
    }
    else
    {
        expirationDate = formatExpirationDate(req.body.expiration_date);
    }

    const query1 = `INSERT INTO Groceries (grocery_name, grocery_category, expiration_date)
    VALUES
        (
            '${groceryName}',
            '${category}',
            '${expirationDate}'
        );`
    
    
    db.pool.query(query1, function (err, results, fields) {
        console.log("Query 1: ", err, results, fields)

        // For each owner for the added grocery, add it to the intersection table
        // (SELECT MAX(grocery_id) AS max_id FROM Groceries) represents the 
        // most recently added grocery
        for (owner of ownership)
        {
            var query2 = `INSERT INTO Groceries_Owners (grocery_id, owner_id)
            VALUES
                (
                    -- If a user is inserting a grocery this is going to be defaulted to the recently created grocery
                   (SELECT MAX(grocery_id) AS max_id FROM Groceries),
                    '${owner}'
                );`
            db.pool.query(query2, function (err, results, fields) {
            })
        }
    })

    res.status(200).redirect('/groceries.html')
})

app.post('/updateGroceries', function(req, res){
    
    // Get from req.body
    const { grocery_id_select, grocery_name, category, ownership, expiration_date, remaining } = req.body;

    // Handle optional input for null
    var expirationDate, query1
    if (req.body.expiration_date == null)
    {
        expirationDate = req.body.expiration_date

        // UPDATE query (handles null)
        query1 = `UPDATE Groceries SET grocery_name = '${grocery_name}', 
        grocery_category = ${category}, -- Drop down of avaliable categories --
        expiration_date = NULL,
        remaining = ${remaining}
        WHERE grocery_id = ${grocery_id_select};`
    }
    else
    {
        expirationDate = formatExpirationDate(req.body.expiration_date);

        // UPDATE query
        query1 = `UPDATE Groceries SET grocery_name = '${grocery_name}', 
        grocery_category = ${category}, -- Drop down of avaliable categories --
        expiration_date = '${expirationDate.substring(0,10)}',
        remaining = ${remaining}
        WHERE grocery_id = ${grocery_id_select};`
    }


    // Deletes all existing M:M relationships for that grocery so that the updated list of owners can be added to the intersection table
    const query2 = `DELETE FROM Groceries_Owners WHERE grocery_id = ${grocery_id_select}`

    db.pool.query(query1, function (err, results, fields) {
        console.log(err, results, fields)
        db.pool.query(query2, function (err, results, fields){
            for (owner of ownership){

                var query3 = `INSERT INTO Groceries_Owners (grocery_id, owner_id)
                VALUES
                    (
                        -- If a user is inserting a grocery this is going to be defaulted to the recently created grocery
                       '${grocery_id_select}',
                        '${owner}'
                    );`

                db.pool.query(query3, function (err, results, fields){
                })
            }
        })
    })

    res.status(200).redirect('/groceries.html')

})

app.delete('/deleteGroceries/:id', function(req, res){

    // Gets id from the parameters
    const id = parseInt(req.params.id)

    const query1 =  `DELETE FROM Groceries WHERE grocery_id = ${id}` 

    db.pool.query(query1, function (err, results, fields) {
        if (err) {
            // Handle error
            res.status(500).send('Error deleting grocery item');
            return
        }
        else
        {
            res.sendStatus(200)
        }
    })
})

/*
 * 
 *    GROCERIES CATEGORIES SECTION
 * 
 */

// This function is also used to get the dropdown list
app.get('/getCategories', function(req, res){

    const query1 = "SELECT category_id, category_name FROM Grocery_Categories;"
   
    db.pool.query(query1, function (err, results, fields) {
        res.status(200).send(JSON.stringify(results))
    })

})

app.post('/createCategories', function(req, res){

    // Gets category name from the req.body
    const category_name = req.body.category_name;

    const query1 = `INSERT INTO Grocery_Categories (category_name)
    VALUES
        (
            '${category_name}'
        );`
    
    
    db.pool.query(query1, function (err, results, fields) {
        res.status(200).redirect('/grocery_categories.html')
    })

})

app.delete('/deleteCategories/:id', function(req, res){

    // Gets id from the parameters
    const id = parseInt(req.params.id)

    const query1 =  `DELETE FROM Grocery_Categories WHERE category_id = ${id}` 

    db.pool.query(query1, function (err, results, fields) {
        if (err) {
            // Handle error
            res.status(500).send('Error deleting grocery item');
            return
        }
        else
        {
            res.sendStatus(200)
        }
    })
})

/*
 * 
 *    OWNERS SECTION
 * 
 */

// This function is also used to get the dropdown list
app.get('/getOwners', function(req, res){

    const query1 = "SELECT owner_id, fname, lname, email FROM Owners;"
   
    db.pool.query(query1, function (err, results, fields) {
        res.status(200).send(JSON.stringify(results))
    })

})

app.post('/createOwners', function(req, res){

    // Get form req.body
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;

    const query1 = `INSERT INTO Owners (fname, lname, email)
    VALUES
        (
            '${fname}',
            '${lname}',
            '${email}'
        );`
    
    
    db.pool.query(query1, function (err, results, fields) {
        res.status(200).redirect('/owners.html')
    })

})

app.delete('/deleteOwners/:id', function(req, res){

    // Gets id from the parameters
    const id = parseInt(req.params.id)

    const query1 =  `DELETE FROM Owners WHERE owner_id = ${id}` 

    db.pool.query(query1, function (err, results, fields) {
        if (err) {
            // Handle error
            res.status(500).send('Error deleting grocery item');
            return
        }
        else
        {
            res.sendStatus(200)
        }
    })
})

/*
 * 
 *    ACTIVITY LOG SECTION
 * 
 */

app.get('/getActivityLogs', function(req, res) {

    const query1 = `SELECT al.activity_id, al.activity_name, al.description, CONCAT(Owners.fname," ", Owners.lname) AS name FROM Activity_Logs al
    LEFT JOIN Owners ON al.owner_id = Owners.owner_id;`

    db.pool.query(query1, function(err, results, fields) {
        res.status(200).send(JSON.stringify(results))
    })
})

app.post('/createActivityLog', function(req, res){

    // Get from req.body
    var { activity_name, description, ownership, groceries } = req.body

    // Handle for null values
    var owners
    if (ownership == '' || ownership == null){
        owners = "NULL"
    }
    else {
        owners = `'${ownership}'`
    }

    console.log(activity_name, description, owners, groceries)

    // Use groceries for intersection table
    const query1 = `INSERT INTO Activity_Logs (activity_name, description, owner_id)
    VALUES
        (
            '${activity_name}',
            '${description}',
            ${owners}
        );`

    db.pool.query(query1, function (err, results, fields) {

        // For each grocery, make a relationship in the activity log grocery intersection table
        // (SELECT MAX(activity_id) AS max_id FROM Activity_Logs) represents the most recently added activity_log
        for (grocery of groceries) {
            
            var query2 = `INSERT INTO Activity_Logs_Groceries (activity_id, grocery_id)
            VALUES
                (
                    -- If a user is inserting an activity this is going to be defaulted to the recently created activity
                    (SELECT MAX(activity_id) AS max_id FROM Activity_Logs),
                    '${grocery}'
                );
            `
            db.pool.query(query2, function (err, results, fields) {
            })
        }
    })

    res.status(200).redirect('/activity_logs.html')

})

app.delete('/deleteActivityLog/:id', function(req, res){

    // Gets id from the parameters
    const id = parseInt(req.params.id)

    const query1 =  `DELETE FROM Activity_Logs WHERE activity_id = ${id};` 

    db.pool.query(query1, function (err, results, fields) {
        if (err) {
            // Handle error
            res.status(500).send('Error deleting grocery item');
            return
        }
        else
        {
            res.sendStatus(200)
        }
    })
})

app.post('/updateActivityLogs', function(req, res){
    
    // Get from req.body
    var { select_update_al, activity_name, description, ownership, groceries } = req.body

    // UPDATE 
    const query1 = `UPDATE Activity_Logs SET activity_name = '${activity_name}', 
        description = '${description}',
        owner_id = '${ownership}'
        WHERE activity_id = '${select_update_al}'`

    // DELETE FROM Groceries_Owners so that M:M relationship can be re-inserted into the intersection table
    const query2 = `DELETE FROM Activity_Logs_Groceries WHERE activity_id = ${select_update_al}`

    db.pool.query(query1, function (err, results, fields) {
        console.log(err)
        db.pool.query(query2, function (err, results, fields){
            console.log(err)

            for (grocery of groceries){

                var query3 = `INSERT INTO Activity_Logs_Groceries (activity_id, grocery_id)
                VALUES
                    (
                        -- If a user is inserting an activity this is going to be defaulted to the recently created activity
                        '${select_update_al}',
                        '${grocery}'
                    );`

                db.pool.query(query3, function (err, results, fields){
                    console.log(err)

                })
            }
        })
    })

    res.status(200).redirect('/activity_logs.html')

})



/*
 * 
 *    GROCERIES OWNERS SECTION
 * 
 */

app.get('/getGroceryOwners', function(req, res){

    const query1 = `SELECT groceries_owners_id, Groceries.grocery_name,  CONCAT(Owners.fname," ", Owners.lname) AS owner_name FROM Groceries_Owners
    LEFT JOIN Owners ON Groceries_Owners.owner_id = Owners.owner_id
    LEFT JOIN Groceries ON Groceries_Owners.grocery_id = Groceries.grocery_id;`

    db.pool.query(query1, function (err, results, fields) {
        res.status(200).send(JSON.stringify(results))
    })
})

/*
 * 
 *    GROCERY ACTIVITY LOG SECTION
 * 
 */

app.get('/getGroceryActivityLog', function(req, res){

    const query1 = `SELECT activity_logs_groceries_id, Activity_Logs.activity_name, Groceries.grocery_name FROM Activity_Logs_Groceries
    LEFT JOIN Activity_Logs ON Activity_Logs_Groceries.activity_id = Activity_Logs.activity_id
    LEFT JOIN Groceries ON Activity_Logs_Groceries.grocery_id = Groceries.grocery_id;`

    db.pool.query(query1, function (err, results, fields) {
        res.status(200).send(JSON.stringify(results))
    })
})

/*
 * 
 *    DROP DOWN AND MISC SECTION
 * 
 */

app.get('/getGroceryIDs', function(req, res){

    const query1 = "SELECT grocery_id, grocery_name FROM Groceries;"
   
    db.pool.query(query1, function (err, results, fields) {
        res.status(200).send(JSON.stringify(results))
    })

})

app.get('/getActivityIDs', function(req, res){

    const query1 = "SELECT activity_id, activity_name FROM Activity_Logs;"
   
    db.pool.query(query1, function (err, results, fields) {
        res.status(200).send(JSON.stringify(results))
    })

})


/*
 * 
 *    LISTENER
 *    Copied from Activity 2 - Connect Webapp to Database on Feburary 22, 2024 (https://canvas.oregonstate.edu/courses/1946034/assignments/9456203)
 * 
 */

app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});