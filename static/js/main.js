let xhttp = new XMLHttpRequest();
const FIREBASE_URL = "http://scheduler-cutiehack.herokuapp.com"
const scheduleContainer = document.getElementById('schedule-container')
let orgData = null
let users = null
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

function main() {
    const hours = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', ' 1:00', ' 1:30', '2:00', '2:30', '3:00']
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const stateList = JSON.parse(orgData.users[USER_ID].schedule)
    let table = createScheduleTable("schedule-table", hours, days, stateList)
    scheduleContainer.append(table)

    cells = document.getElementsByClassName('schedule-cell')

    document.addEventListener("mouseover", paintMouseoverCells)
    document.addEventListener("mousedown", paintMouseoverCells)
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

xhttp.onload = () => {
    if (xhttp.status == 200) {
    }
    orgData = JSON.parse(xhttp.response)
    users = orgData.users

    main()

    populateTags(users, tags_select, orgData.tags)

    totalScheduleArray = new Array(cells.length).fill(0);

    populateUserTagCheckboxes(orgData)
    populateScheduleGrid(users)    
    colorCells();
    document.getElementById('org-textbox-manager').value = orgData.name
}



requestSchedules()