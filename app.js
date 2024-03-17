
/*
    SERVER + DATABASE SETUP
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
    TEMPLATE
*/

/*
    FUNCTIONS
*/
async function executeSqlFile(filename) {
    try {
        // Read the SQL file
        const filePath = path.join(__dirname, filename);
        var sql = fs.readFileSync(filePath, 'utf8').toString().split(';');

        sql.pop()

        // Execute the SQL query
        for (query of sql){
            console.log(query)
            await db.pool.query(query + ";", function(err, results, fields){
                if (err){
                    throw err
                }
            });
        }
        
        
        console.log('SQL file executed successfully:', filename);
    } catch (error) {
        console.error('Error executing SQL file:', error.message);
    }
}
 
function formatExpirationDate(rawDate) {
    const dateObj = new Date(rawDate);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
 
/*
*
    ROUTES
*
*/
app.put('/resetDatabase', async function(req, res){
    try{
        //const filename1 = "databaseReset.sql"
        const filename2 = "DDL.sql"

        //await executeSqlFile(filename1)
        await executeSqlFile(filename2)
    
        res.status(200).send("Database Reset Successfully")
    }
    catch (error)
    {
        res.status(500).send(error)
    }

})

/*
    GROCERIES SECTION
*/

app.get('/getGroceries', function(req, res){

    const query1 = "SELECT g.grocery_id, g.grocery_name, g.expiration_date, g.remaining, gc.category_name FROM Groceries g INNER JOIN Grocery_Categories gc ON category_id = g.grocery_category;"
   
    // GETS INFORMATION ABOUT ALL GROCERY ITEMS

    db.pool.query(query1, function (err, results, fields) {
        res.status(200).send(JSON.stringify(results))
    })

})

app.post('/createGroceries', function(req, res){

    const groceryName = req.body.grocery_name;
    const category = req.body.category;
    const ownership = req.body.ownership;
    var expirationDate
    if (req.body.expiration_date == null)
    {
        expirationDate = req.body.expiration_date
    }
    else
    {
        expirationDate = formatExpirationDate(req.body.expiration_date);
    }

    console.log(expirationDate)

    const query1 = `INSERT INTO Groceries (grocery_name, grocery_category, expiration_date)
    VALUES
        (
            '${groceryName}',
            '${category}',
            '${expirationDate}'
        );`
    
    
    db.pool.query(query1, function (err, results, fields) {
        console.log("Query 1: ", err, results, fields)

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
    
    const { grocery_id_select, grocery_name, category, ownership, expiration_date, remaining } = req.body;

    var expirationDate
    if (req.body.expiration_date == null)
    {
        expirationDate = req.body.expiration_date
    }
    else
    {
        expirationDate = formatExpirationDate(req.body.expiration_date);
    }

    // UPDATE 
    const query1 = `UPDATE Groceries SET grocery_name = '${grocery_name}', 
    grocery_category = ${category}, -- Drop down of avaliable categories --
    expiration_date = '${expirationDate.substring(0,10)}',
    remaining = ${remaining}
    WHERE grocery_id = ${grocery_id_select};`

    console.log(expirationDate.substring(0,10))

    // DELETE FROM Groceries_Owners
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
    GROCERIES CATEGORIES SECTION
*/

// This function is also used to get the dropdown list
app.get('/getCategories', function(req, res){

    const query1 = "SELECT category_id, category_name FROM Grocery_Categories;"
   
    db.pool.query(query1, function (err, results, fields) {
        res.status(200).send(JSON.stringify(results))
    })

})

app.post('/createCategories', function(req, res){

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
    OWNERS SECTION
*/

// This function is also used to get the dropdown list
app.get('/getOwners', function(req, res){

    const query1 = "SELECT owner_id, fname, lname, email FROM Owners;"
   
    db.pool.query(query1, function (err, results, fields) {
        res.status(200).send(JSON.stringify(results))
    })

})

app.post('/createOwners', function(req, res){

    console.log(req.body)

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
    ACTIVITY LOG SECTION
*/

app.get('/getActivityLogs', function(req, res) {

    const query1 = `SELECT al.activity_id, al.activity_name, al.description, CONCAT(Owners.fname," ", Owners.lname) AS name FROM Activity_Logs al
    LEFT JOIN Owners ON al.owner_id = Owners.owner_id;`

    db.pool.query(query1, function(err, results, fields) {
        res.status(200).send(JSON.stringify(results))
    })
})

app.post('/createActivityLog', function(req, res){

    var { activity_name, description, ownership, groceries } = req.body

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
    
    var { select_update_al, activity_name, description, ownership, groceries } = req.body

    // UPDATE 
    const query1 = `UPDATE Activity_Logs SET activity_name = '${activity_name}', 
        description = '${description}',
        owner_id = '${ownership}'
        WHERE activity_id = '${select_update_al}'`

    // DELETE FROM Groceries_Owners
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
    GROCERY OWNERS SECTION
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
    GROCERY ACTIVITY LOG SECTION
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
    DROP DOWN AND MISC SECTION
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
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});