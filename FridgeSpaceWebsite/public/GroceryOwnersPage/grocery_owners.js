
const intersectionTable = document.getElementById('intersectionTable')


/* ****************************
    TABLE FUNCTIONS
**************************** */ 

// Gets all M:M relationships between Owners and Groceries
async function getGroceryOwners(){
  fetch('/getGroceryOwners', {method: "GET"})
  .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {

      intersectionTable.innerHTML = `<tr>
          <th>Grocery Owners ID</th>
          <th>Grocery Name</th>
          <th>Owner Name</th>
      </tr>`

      for (relationship of data){
  
          intersectionTable.innerHTML += `<tr> \
          <td> ${relationship.groceries_owners_id} </td> \
          <td> ${relationship.grocery_name} </td> \
          <td> ${relationship.owner_name} </td> \
          </tr>`
      }

    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

/* ****************************
    RUNS CODE ON INITAL START UP
**************************** */ 

getGroceryOwners()