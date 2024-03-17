const ownerList = document.getElementById('ownerList')

async function handleDelete(ID)
{
  console.log(`/deleteOwners/` + ID)
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

async function getOwners(){
    fetch('/getOwners', {method: "GET"})
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {

        ownerList.innerHTML = `<tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Delete</th>
        </tr>`

        console.log(data)


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

getOwners()