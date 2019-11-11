let xhttp = new XMLHttpRequest();
const FIREBASE_URL = "http://scheduler-cutiehack.herokuapp.com"

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

let tags_select = document.getElementById('tags-select')
let manager_menu = document.getElementById('manager-menu')

let tag_textbox_manager = document.getElementById('tag-textbox-manager')
let tag_submit_manager = document.getElementById('tag-submit-manager')

function main() {
    const hourList = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', ' 1:00', ' 1:30', '2:00', '2:30', '3:00']
    const dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const userScheduleList = JSON.parse(orgData.users[USER_ID].schedule)

    const table = createScheduleTable("schedule-table", hourList, dayList, userScheduleList)
    const scheduleContainer = document.getElementById('schedule-container')
    scheduleContainer.append(table)

    cells = document.getElementsByClassName('schedule-cell')

    document.addEventListener("mouseover", onMouseAction)
    document.addEventListener("mousedown", onMouseAction)
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

function convertToHTML(data) {
    let ul = document.createElement('ul')

    let li_name = document.createElement('li')
    li_name.innerHTML = "name: " + data.name
    ul.append(li_name)

    let li_tags = document.createElement('li')
    li_tags.innerHTML = "tags"
    ul.append(li_tags)

    let ul_tags = createTagsHTML(data.tags)
    li_tags.append(ul_tags)

    


    let li_users = document.createElement('li')
    li_users.innerHTML = "users"
    ul.append(li_users)

    let ul_users = createUsersHTML(data.users)
    li_users.append(ul_users)

    return ul
}

function createUsersHTML(dict) {
    let ul = document.createElement('ul')
    Object.keys(dict).forEach((key) => {
        let li = document.createElement('li')
        li.innerHTML = key //dict[key].name
        ul.append(li)

        let ul_key = document.createElement('ul')
        
        let li_name = document.createElement('li')
        li_name.innerHTML = "name: " + dict[key].name
        ul_key.append(li_name)

        let li_password = document.createElement('li')
        li_password.innerHTML = "password: " + dict[key].password
        ul_key.append(li_password)

        let li_schedule = document.createElement('li')
        li_schedule.innerHTML = "schedule: "

        let span = document.createElement('span')
        span.style = "font-size: 10px;"
        span.innerHTML = dict[key].schedule
        li_schedule.append(span)
        ul_key.append(li_schedule)

        li.append(ul_key)
    })
    return ul
}

function createTagsHTML(dict) {
    let ul = document.createElement('ul')

    Object.keys(dict).forEach((key) => {
        let li = document.createElement('li')
        li.innerHTML = key
        ul.append(li)

        let ul_key = document.createElement('ul')
        

        let li_name = document.createElement('li')
        li_name.innerHTML = "name: " + dict[key].name
        ul_key.append(li_name)

        let li_visible = document.createElement('li')
        li_visible.innerHTML = "visible: " + dict[key].visible
        ul_key.append(li_visible)

        li.append(ul_key)
    })
    return ul
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

    console.log(orgData)

    const div = document.getElementById('debug-container')
    div.append(convertToHTML(orgData))
}



requestSchedules()