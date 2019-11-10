let xhttp = new XMLHttpRequest();
const FIREBASE_URL = "http://scheduler-cutiehack.herokuapp.com"
const scheduleTable = document.getElementById('schedule-table')
let orgData = null
let schedulesDictonary = {}
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

function main(table) {
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

        let scheduleList = JSON.parse(orgData.users[USER_ID].schedule);
        console.log(scheduleList)
        for (let i=0; i<cells.length; i++) {
            cell = cells[i]
            let state = cell.getAttribute('data-state')
            scheduleList[i] = Number(state)
            cell.innerHTML = state
        }

        let jsonSchedule = JSON.stringify(scheduleList)
        let jsonString = 'id='+ ORG_ID + '&action=update_user_schedule' +
            '&user_id='+USER_ID + '&schedule='+jsonSchedule
        sendData('POST', FIREBASE_URL+'/update', jsonString)

        selectedCells = []
        elemOnMousedown = null
        selectionType = null

        function refresh() { location.reload() }
        
    })
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
    let userArray = new Array(cells.length).fill(0);
    for (let i = 0; i < cells.length; i++) {
        userArray[i] = new Array();
    }

    for (let user in users) {
        let userScheduleArray = JSON.parse(users[user].schedule)
        for (let i = 0; i < userScheduleArray.length; i++) {
            if (userScheduleArray[i] == 1 && (tag == "all" || users[user].tags.includes(tag)) ) {
                totalScheduleArray[i] += 1
                userArray[i].push(user)
            }
        }
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].setAttribute('data-ids', userArray[i])
    }

}

xhttp.onload = () => {
    if (xhttp.status == 200) {
    }
    orgData = JSON.parse(xhttp.response)
    let users = orgData.users

    main(scheduleTable)

    populateTags(users, tags_select, orgData.tags)

    totalScheduleArray = new Array(cells.length).fill(0);

    populateUserTagCheckboxes(orgData)
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
    for (let i = 0; i < cells.length; i++) {
        let number = totalScheduleArray[i]
        
        let proportion = (number/totalUsers)
        let scale = 255 - Math.round(proportion * 255)
        let color = rgbToHex(scale) + rgbToHex(scale) + rgbToHex(255)
        cells[i].style = "background-color: #" + color + ";"
        cells[i].innerHTML = (number > 0 ? number : "")
    }
    document.getElementById('org-textbox-manager').value = orgData.name
}



requestSchedules()