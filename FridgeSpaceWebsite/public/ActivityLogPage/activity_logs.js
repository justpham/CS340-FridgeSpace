const activityLogList = document.getElementById('activityLogList')
const ownership = document.getElementsByName('ownership')
const groceries = document.getElementsByName('groceries')
const activityIDSelect = document.getElementById('select_update_al')

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
async function getActivityLogs() {
    fetch('/getActivityLogs', {method: "GET"})
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {

        activityLogList.innerHTML = `<tr>
            <th>ID</th>
            <th>Activity Name</th>
            <th>Description</th>
            <th>Owner Name</th>
            <th>Delete</th>
        </tr>`

        console.log(data)

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


getActivityLogs()
populateGroceries()
populateOwners()
populateActivityLogIDs()