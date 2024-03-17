
const intersectionTable = document.getElementById('intersectionTable')

async function getGroceryActivityLog(){
    fetch('/getGroceryActivityLog', {method: "GET"})
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {

        intersectionTable.innerHTML = `<tr>
            <th>Grocery Activity Log ID</th>
            <th>Activity Log Name</th>
            <th>Grocery Name</th>
        </tr>`

        for (relationship of data){
    
            intersectionTable.innerHTML += `<tr> \
            <td> ${relationship.activity_logs_groceries_id} </td> \
            <td> ${relationship.activity_name} </td> \
            <td> ${relationship.grocery_name} </td> \
            </tr>`
        }

      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
}

getGroceryActivityLog()