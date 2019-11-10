function sendData(method, url, jsonString) {
    var url = FIREBASE_URL + "/update"
    var params = jsonString;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);
}


function requestSchedules() {
    const url = FIREBASE_URL+'/org_data?id='+ORG_ID
    xhttp.open('GET', url, true)
    xhttp.send()
}

function refreshData() {
    req = new XMLHttpRequest();
    req.open('GET', FIREBASE_URL+'/org_data?id='+ORG_ID, true)
    req.send()
    req.onload = () => {
        orgData = JSON.parse(xhttp.response)
        users = orgData.users
        populateTags(users, tags_select, orgData.tags)
        populateUserTagCheckboxes(orgData)
        populateScheduleGrid(users)    
        colorCells();
        document.getElementById('org-textbox-manager').value = orgData.name
    }
    console.log("data refreshed")
}

function changeOrganizationName() {
    let name = document.getElementById('org-textbox-manager').value
    let jsonString = 
            'id='+ ORG_ID + 
            '&action='+'change_org_name' +
            '&name='+name
        sendData('POST', FIREBASE_URL+'/update', jsonString)
}

function addTag() {
    let name = document.getElementById('tag-textbox-manager').value

    let jsonString = 
        'id='+ ORG_ID + 
        '&action='+'add_tag' +
        '&tag='+name
    sendData('POST', FIREBASE_URL+'/update', jsonString)
}