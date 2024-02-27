const activityLogList = document.getElementById('activityLogList')

async function getActivityLogs() {
    fetch('/getActivityLogs', {method: "GET"})
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {

        activityLogList.innerHTML = `tr>
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
            <td><button type="button" id="delete-id${activityLog.activity_id}">Delete</button></td> \
            </tr>`
        }
        
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
}

getActivityLogs()