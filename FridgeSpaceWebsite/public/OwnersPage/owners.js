const ownerList = document.getElementById('ownerList')

/* ****************************
    TABLE FUNCTIONS
**************************** */ 

// When a user clicks a button, this function sends a delete request to the server 
// and refreshes the table
async function handleDelete(ID)
{
  fetch(`/deleteOwners/` + ID, {method: 'DELETE' })
  .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    else
    {
      getOwners()
    }
  })
  .catch(error => {
      console.error('Error making DELETE request:', error);
  });

}

// Gets the owners using a get request
async function getOwners(){
    fetch('/getOwners', {method: "GET"})
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        
        // Add headers for the table
        ownerList.innerHTML = `<tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Delete</th>
        </tr>`
      
        // Insert the data into the table
        for (owner of data){
            ownerList.innerHTML += `<tr> \
            <td> ${owner.owner_id} </td> \
            <td> ${owner.fname} ${owner.lname}</td> \
            <td> ${owner.email} </td> \
            <td><button type="button" id="delete-id${owner.owner_id}" class="delete-btn">Delete</button></td> \
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

getOwners()