const categoryList = document.getElementById('categoryList')

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

async function getCategories(){
    fetch('/getCategories', {method: "GET"})
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {

        categoryList.innerHTML = `<tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Delete</th>
        </tr>`

        console.log(data)

        for (category of data){
    
            categoryList.innerHTML += `<tr> \
            <td> ${category.category_id} </td> \
            <td> ${category.category_name} </td> \
            <td><button type="button" id="delete-id${category.category_id}" class="delete-btn">Delete</button></td> \
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

getCategories()