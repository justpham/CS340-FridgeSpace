const categoryList = document.getElementById('categoryList')

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
            <td><button type="button" id="delete-id${category.category_id}">Delete</button></td> \
            </tr>`
        }
        
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
}

getCategories()