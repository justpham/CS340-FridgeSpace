const ownerList = document.getElementById('ownerList')

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
            <td><button type="button" id="delete-id${owner.owner_id}">Delete</button></td> \
            </tr>`
        }
        
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
}

getOwners()