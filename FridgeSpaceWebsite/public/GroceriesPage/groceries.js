
const groceryList = document.getElementById('groceryList')
const categories = document.getElementsByName('category')
const groceryIDSelect = document.getElementById('grocery_id_select')
const ownership = document.getElementsByName('ownership')
const createGrocery = document.getElementById('create-grocery')

/* ****************************
    TABLE FUNCTIONS
**************************** */ 

// When a user clicks a button, this function sends a delete request to the server 
// and refreshes the table
async function handleDelete(groceryID)
{
  fetch(`/deleteGroceries/` + groceryID, {method: 'DELETE' })
  .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    else
    {
      getGroceries()
    }
  })
  .catch(error => {
      console.error('Error making DELETE request:', error);
  });

}

// Gets the groceries List
async function getGroceries() {
    fetch('/getGroceries', {method: "GET"})
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {

        // Add headers for the table
        groceryList.innerHTML = `<tr>
            <th>ID</th>
            <th>Grocery Name</th>
            <th>Expiration Date</th>
            <th>Remaining</th>
            <th>Category</th>
            <th>Delete</th>
        </tr>`

        // Insert the data into the table
        for (grocery of data){
    
            if (grocery.expiration_date == null)
            {
                var expDate = ""
            }
            else
            {
                var expDate = grocery.expiration_date.substring(0,10)
            }
    
            groceryList.innerHTML += `<tr> \
            <td> ${grocery.grocery_id} </td> \
            <td> ${grocery.grocery_name} </td> \
            <td> ${expDate} </td> \
            <td> ${grocery.remaining} </td> \
            <td> ${grocery.category_name} </td> \
            <td><button type="button" id="delete-id${grocery.grocery_id}" class="delete-btn">Delete</button></td> \
            </tr>`
        }
        
      })
      .then(() => {
        // Add a delete button which corresponds to each row of the table
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async () => {
                // Get the grocery ID from the button's ID
                var groceryId = button.id.replace('delete-id', '');
                // Call a function to handle the delete operation with this ID
                await handleDelete(groceryId);
            });
        });
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
}

/* ****************************
    POPULATES DROP DOWN MENUS
**************************** */ 

// Gets all avaliable categories and their ids
async function populateCategory(){
    fetch('/getCategories', {method: "GET"})
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        
        for (category of data)
        {
            var value = `<option value="${category.category_id}">${category.category_name}</option>`
            categories[0].innerHTML += value
            categories[1].innerHTML += value
        }

      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
}

// Gets all avaliable groceries and their ids
async function populateGroceryIDs(){
    fetch('/getGroceryIDs', {method: "GET"})
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        for (grocery of data)
        {
            var value = `<option value="${grocery.grocery_id}">${grocery.grocery_name} (ID:${grocery.grocery_id})</option>`
            groceryIDSelect.innerHTML += value
        }

      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
}

// Gets all owners and their ids
async function populateOwners(){
    fetch('/getOwners', {method: "GET"})
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        for (owner of data)
        {
            var value = `<option value="${owner.owner_id}">${owner.fname} ${owner.lname}</option>`
            ownership[0].innerHTML += value
            ownership[1].innerHTML += value
        }

      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
}

/* ****************************
    RUNS CODE ON INITAL START UP
**************************** */ 

getGroceries();
populateCategory();
populateGroceryIDs();
populateOwners();
