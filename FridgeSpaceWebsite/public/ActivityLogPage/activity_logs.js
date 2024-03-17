const activityLogList = document.getElementById('activityLogList')
const ownership = document.getElementsByName('ownership')
const groceries = document.getElementsByName('groceries')
const activityIDSelect = document.getElementById('select_update_al')

/* ****************************
    TABLE FUNCTIONS
**************************** */ 

// When a user clicks a button, this function sends a delete request to the server 
// and refreshes the table
async function handleDelete(ID)
{
  console.log(`/deleteActivityLog/` + ID)
  fetch(`/deleteActivityLog/` + ID, {method: 'DELETE' })
  .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    else
    {
      getActivityLogs()
    }
  })
  .catch(error => {
      console.error('Error making DELETE request:', error);
  });

}

// Gets all the activity logs
async function getActivityLogs() {
    fetch('/getActivityLogs', {method: "GET"})
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {

        // Add headers for the table
        activityLogList.innerHTML = `<tr>
            <th>ID</th>
            <th>Activity Name</th>
            <th>Description</th>
            <th>Owner Name</th>
            <th>Delete</th>
        </tr>`

        // Insert the data into the table
        for (activityLog of data){
    
            if (activityLog.name == null)
            {
                var owner = ""
            }
            else
            {
                var owner = activityLog.name
            }
    
            activityLogList.innerHTML += `<tr> \
            <td> ${activityLog.activity_id} </td> \
            <td> ${activityLog.activity_name} </td> \
            <td> ${activityLog.description} </td> \
            <td> ${owner} </td> \
            <td><button type="button" id="delete-id${activityLog.activity_id}" class="delete-btn">Delete</button></td> \
            </tr>`
        }
        
      })
      .then(() => {
        // Add a delete button which corresponds to each row of the table
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async () => {
                // Get the ID from the button's ID
                var ID = button.id.replace('delete-id', '');
                // Call a function to handle the delete operation with this ID
                await handleDelete(ID);
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

// Gets all avaliable owners and their ids
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

// Gets all avaliable groceries and their ids
async function populateGroceries(){
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
          groceries[0].innerHTML += value
          groceries[1].innerHTML += value
      }

    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

// Gets all avaliable activity logs and their ids
async function populateActivityLogIDs(){
  fetch('/getActivityIDs', {method: "GET"})
  .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      for (activity of data)
      {
          var value = `<option value="${activity.activity_id}">${activity.activity_name} (ID:${activity.activity_id})</option>`
          activityIDSelect.innerHTML += value
      }

    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

/* ****************************
    RUNS CODE ON INITAL START UP
**************************** */ 

getActivityLogs()
populateGroceries()
populateOwners()
populateActivityLogIDs()