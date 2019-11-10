let xhttp = new XMLHttpRequest();
console.log(xhttp)
const FIREBASE_URL = "http://scheduler-cutiehack.herokuapp.com"
const ORG_ID = {{ org_name }}
const USER_ID = {{ user_id }}
let schedulesReceived = null
let schedulesDictonary = {}
//"http://10.28.92.95:/org_data?id=1"
let totalScheduleArray = []
let userArray = []

let elemOnMousedown = null
let elemOnMouseover = null
let selectionType = null
let selectedCells = []
let cells = []

let cell_info = document.getElementById('cell-info')
let tags_select = document.getElementById('tags-select')
let manager_menu = document.getElementById('manager-menu')

let tag_textbox_manager = document.getElementById('tag-textbox-manager')
let tag_submit_manager = document.getElementById('tag-submit-manager')

function fillTable(table, hours, days) {
    let titleRow = createTitleRow(days)
    table.append(titleRow)
    for (let row = 0; row < hours.length; row++) {
        let hourRow = createHourRow(row, hours[row], days)
        table.append(hourRow)
    }
}

function createTitleRow(days) {
    let tr = document.createElement('tr')
    let th = document.createElement('th')
    tr.append(th)
    for (let day of days) {
        let th = document.createElement('th')
        th.innerHTML = day.substring(0,3)
        tr.append(th)
    }
    return tr
}

function createHourRow(row, hour, days) {
    let tr = document.createElement('tr')
    let td = document.createElement('td')
    td.innerHTML = hour
    td.classList.add('no-user-select')
    tr.append(td)
    for (let col = 0; col < days.length; col++) {
        let cell = createCell(row, col)
        tr.append(cell)
    }
    return tr
}

function cellOnMousedown (event) {
    elemOnMousedown = event.target

    const state = event.target.getAttribute('data-state')
    if (Number(state) === 1) {
    setCell(event.target, 0)
        selectionType = 0
    } else if (Number(state) === 0) {
        setCell(event.target, 1)
        selectionType = 1
    }
    selectedCells.push(event.target)
}

function createCell(row, col) {
    let td = document.createElement('td')
    //td.innerHTML = "("+row+","+col+")"
    td.classList.add('schedule-cell')
    td.classList.add('no-user-select')

    td.setAttribute('data-state', 0)
    td.setAttribute('data-row', row)
    td.setAttribute('data-col', col)

    td.addEventListener("mousedown", cellOnMousedown)

    td.addEventListener("mouseover", (event) => {
        if (schedulesReceived) {
            elemOnMouseover = event.target

            let users = schedulesReceived.users

            let listString = event.target.getAttribute('data-ids')
           //listString = event.target.innerHTML


            let array = listString.split(",")

             cell_info.innerHTML = ""
            for (let user in array) {
                 cell_info.innerHTML += users[user].name + ", "
            }
        }
           
        
    })
    return td
}

function setCell(elem, state) {
    elem.setAttribute('data-state', state)
    //elem.innerHTML = state
    paintCell(elem, state)
}

function paintCell(elem, state) {
    if (Number(state) === 1) {
        elem.classList.remove('cell-red')
        elem.classList.add('cell-green')
    } else if (Number(state) === 0) {
    elem.classList.remove('cell-green')
    elem.classList.add('cell-red')
    } else {
        console.error('Invalid state')
    }
}

function paintMouseoverCells(event) {
    if (elemOnMousedown) {
        const mouseDownRow = elemOnMousedown.getAttribute('data-row')
        const mouseDownCol = elemOnMousedown.getAttribute('data-col')
        const mouseOverRow = elemOnMouseover.getAttribute('data-row')
        const mouseOverCol = elemOnMouseover.getAttribute('data-col')

        const highRow = Math.max(mouseDownRow, mouseOverRow)
        const lowRow  = Math.min(mouseDownRow, mouseOverRow)
        const highCol = Math.max(mouseDownCol, mouseOverCol)
        const lowCol  = Math.min(mouseDownCol, mouseOverCol)

        selectedCells = []
        for (let cell of cells) {
            const state = cell.getAttribute('data-state')
            const row = cell.getAttribute('data-row')
            const col = cell.getAttribute('data-col')

            if (row >= lowRow && row <= highRow && col >= lowCol && col <= highCol) {
                selectedCells.push(cell)
                paintCell(cell, selectionType)

            } else {
                paintCell(cell, state)
            }
            cell.classList.remove("selected")
        }

        for (let cell of selectedCells) {
            cell.classList.add("selected")
        }
    }
}




function main(table) {
    //const aggregateTable = document.getElementById('table-display')
    //const toggleCells = document.getElementsByClassName('cell')
    //const aggregateCells = document.getElementsByClassName('cell-display')
    

    const hours = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', ' 1:00', ' 1:30', '2:00', '2:30', '3:00']
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    fillTable(table, hours, days)
    cells = document.getElementsByClassName('schedule-cell')

    

    document.addEventListener("mouseover", paintMouseoverCells)
    document.addEventListener("mousedown", paintMouseoverCells)
    document.addEventListener("mouseup", (event) => {
        for (let cell of selectedCells) {
            setCell(cell, selectionType)
            cell.classList.remove("selected")
        }

        let scheduleList = []
        for (let cell of cells) {
            let state = cell.getAttribute('data-state')
            scheduleList.push(Number(state))
            //cell.innerHTML = state
        }

        let jsonSchedule = JSON.stringify(scheduleList)
        console.log(scheduleList)
        let jsonString = 
            'id='+ ORG_ID + 
            '&action='+'update_user_schedule' +
            '&user_id='+USER_ID +
            '&schedule='+jsonSchedule
        sendData('POST', FIREBASE_URL+'/update', jsonString)

        selectedCells = []
        elemOnMousedown = null
        selectionType = null

        function refresh() {
            location.reload()
        }

        setTimeout(refresh, 100)
        
    })
}

const scheduleTable = document.getElementById('schedule-table')
main(scheduleTable)

function sendData(method, url, jsonString) {
    var url = FIREBASE_URL + "/update"
    var params = jsonString//"name=orggggggg&action=add_org";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);

    console.log("sendData")
    return;


    // xhttp.open(method, url)
    // //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // xhttp.send(jsonData)
    // console.log(jsonData)
}


function requestSchedules() {
    const url = FIREBASE_URL+'/org_data?id='+ORG_ID
    xhttp.open('GET', url, true)
    xhttp.send()
}

function populateTags(users, selectElem, userTags) {
    Object.keys(userTags).forEach(function(key) {
        let option = document.createElement('option')
        option.value = key
        option.innerHTML = userTags[key].name
        option.onclick = (event) => {
            let value = event.target.value
            populateScheduleGrid(users, value)
            console.log(event.target)
        }
        selectElem.append(option)
    })
}

function toggleUserOptions() {

    let elem = document.getElementById('user-menu')
    let visibility = elem.style.display
    if (visibility == "block")
        elem.style.display = "none"
    else
        elem.style.display = "block"
}


function toggleManager() {

    let elem = document.getElementById('manager-menu')
    let visibility = elem.style.display
    if (visibility == "block")
        elem.style.display = "none"
    else
        elem.style.display = "block"
}

function changeOrganizationName() {
    let name = document.getElementById('org-textbox-manager').value
    let jsonString = 
            'id='+ ORG_ID + 
            '&action='+'change_org_name' +
            '&name='+name
        sendData('POST', FIREBASE_URL+'/update', jsonString)
    // let jsonData = {
    //     'id' : ORG_ID,
    //     'action' : "change_org_name",
    //     'name' : name
    // }
    // sendData('POST', FIREBASE_URL+'/update', jsonData)
}

function addTag() {
    let name = document.getElementById('tag-textbox-manager').value

    let jsonString = 
        'id='+ ORG_ID + 
        '&action='+'add_tag' +
        '&tag='+name
    sendData('POST', FIREBASE_URL+'/update', jsonString)

    // let jsonData = {
    //     'id' : ORG_ID,
    //     'action' : "add_tag",
    //     'tag' : name
    // }
    // sendData('POST', FIREBASE_URL+'/update', jsonData)
}

function populateUserTagCheckboxes(schedules) {
    // <input id="tag-checkbox-0" type="checkbox" /> TAG_1</input><br/>
    let tags = schedules.tags
    let checkboxesElem = document.getElementById('user-tags')
    for (let tag in tags) {
        let input = document.createElement('input')
        let label = document.createElement('label')
        let br = document.createElement('br')
        input.id = "tag-checkbox-" + tag
        input.type = "checkbox"

        label.innerHTML = tags[tag].name

        checkboxesElem.append(input)
        checkboxesElem.append(label)
        checkboxesElem.append(br)
    }
    
}

function populateScheduleGrid(users, tag="all") {
    // Populating the arrays [105]
    userArray = new Array(cells.length).fill(0);
    for (let i = 0; i < cells.length; i++) {
        userArray[i] = new Array();
    }
    console.log(tag)
    for (let user in users) {
        let userScheduleArray = JSON.parse(users[user].schedule)
        for (let i = 0; i < userScheduleArray.length; i++) {
            if (userScheduleArray[i] == 1 && (tag == "all" || users[user].tags.includes(tag)) ) {
                totalScheduleArray[i] += 1
                userArray[i].push(user)
            }
        }
    }


    //console.log(userArray)

    for (let i = 0; i < cells.length; i++) {
        cells[i].setAttribute('data-ids', userArray[i])
    }

}

xhttp.onload = () => {
    if (xhttp.status == 200) {
        //console.log(xhttp.response)
    }

    schedulesReceived = JSON.parse(xhttp.response)
    let users = schedulesReceived.users

    populateTags(users, tags_select, schedulesReceived.tags)

    
    totalScheduleArray = new Array(cells.length).fill(0);

    // Initializing the userArray that contains [[userId , ...], ...]
    userArray = new Array(cells.length).fill(0);
    for (let i = 0; i < cells.length; i++) {
        userArray[i] = new Array();
    }

    populateUserTagCheckboxes(schedulesReceived)
   
    populateScheduleGrid(users)

    
    let rgbToHex = function (rgb) {
        let hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    };
    

    //let totalUsers = Math.max(...totalScheduleArray)
    let totalUsers = Object.keys(users).length
    console.log(users)
    for (let i = 0; i < cells.length; i++) {
        let number = totalScheduleArray[i]
        
        let proportion = (number/totalUsers)
        let scale = 255 - Math.round(proportion * 255)
        let color = rgbToHex(scale) + rgbToHex(scale) + rgbToHex(255)
        cells[i].style = "background-color: #" + color + ";"
        cells[i].innerHTML = (number > 0 ? number : "")
    }
//    cells[0].style = "background-color: red;"


    document.getElementById('org-textbox-manager').value = schedulesReceived.name
}

requestSchedules()

// xhttp.open('GET', FIREBASE_URL+"/org_data?id=1", true)
// xhttp.send() // send request to the server
