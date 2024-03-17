const categoryList = document.getElementById('categoryList')

/* ****************************
    TABLE FUNCTIONS
**************************** */ 

// When a user clicks a button, this function sends a delete request to the server 
// and refreshes the table
async function handleDelete(ID)
{
  console.log(`/deleteCategories/` + ID)
  fetch(`/deleteCategories/` + ID, {method: 'DELETE' })
  .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    else
    {
      getCategories()
    }
  })
  .catch(error => {
      console.error('Error making DELETE request:', error);
  });

}

// Gets the categories list
async function getCategories(){
    fetch('/getCategories', {method: "GET"})
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
      
        // Add headers for the table
        categoryList.innerHTML = `<tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Delete</th>
        </tr>`

        // Insert the data into the table
        for (category of data){
    
            categoryList.innerHTML += `<tr> \
            <td> ${category.category_id} </td> \
            <td> ${category.category_name} </td> \
            <td><button type="button" id="delete-id${category.category_id}" class="delete-btn">Delete</button></td> \
            </tr>`
        }
        
      })
      .then(() => {
        // Add a delete button which corresponds to each row of the table
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async () => {
                // Get the ID from the button's ID
                var id = button.id.replace('delete-id', '');
                // Call a function to handle the delete operation with this ID
                await handleDelete(id);
            });
        });
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
}

/* ****************************
    RUNS CODE ON INITAL START UP
**************************** */ 

getCategories()