// table.js manages updating, drawing, and refreshing the schedule table


function colorCells() {
    let totalUsers = Object.keys(users).length
    for (let i = 0; i < cells.length; i++) {
        let number = totalScheduleArray[i]
        
        let proportion = (number/totalUsers)
        let scale = 255 - Math.round(proportion * 255)
        let color = rgbToHex(scale) + rgbToHex(scale) + rgbToHex(255)
        cells[i].style = "background-color: #" + color + ";"
        cells[i].innerHTML = number //(number > 0 ? number : "")
    }
}

function onMouseAction(event) {
    if (elemOnMousedown === null || elemOnMouseover === null) return;
    selectedCells = selectCells(elemOnMousedown, elemOnMouseover, cells)
}

/*
    selectCells()
    Get the (row,col) of the mousedown cell and the (row,col) of the mouseover cell to create a "bounding box". 
    The mousedown cell and all cells within this bounding box have their 'data-state' changed.
    The new state is the opposite of the mousedown cell's previous state.
    arguments:
        cellMousedown: HTML element <td>
        cellMouseover: HTML element <td>
        cellList: list of HTML elements <td>
    return:
        selectedCellList: list of HTML elements <td>
*/
function selectCells(cellMousedown, cellMouseover, cellList) {
    const [rowMousedown, colMousedown] = [cellMousedown.getAttribute('data-row'), cellMousedown.getAttribute('data-col')]
    const [rowMouseover, colMouseover] = [cellMouseover.getAttribute('data-row'), cellMouseover.getAttribute('data-col')]
    const [rowMin, colMin] = [Math.min(rowMousedown, rowMouseover), Math.min(colMousedown, colMouseover)]
    const [rowMax, colMax] = [Math.max(rowMousedown, rowMouseover), Math.max(colMousedown, colMouseover)]
    const selectedCellList = []
    for (let i = 0; i < cellList.length; i++) {
        cellList[i].classList.remove("selected")
        const [row, col] = [cellList[i].getAttribute('data-row'), cellList[i].getAttribute('data-col')]
        const insideBoundingBox = (row >= rowMin && row <= rowMax) && (col >= colMin && col <= colMax)
        if (insideBoundingBox) {
            selectedCellList.push(cellList[i])
            cellList[i].classList.add("selected")
            //paintCell(cellList[i], selectionType)
        } else {
            //const state = cellList[i].getAttribute('data-state')
            //paintCell(cellList[i], state)
        }
    }
    return selectedCellList
}

function populateScheduleGrid(users, tag="all") {
    let userArray = new Array(cells.length).fill(0);
    for (let i = 0; i < cells.length; i++) {
        userArray[i] = new Array();
    }
    totalScheduleArray = new Array(cells.length).fill(0);
    for (user in users) {
        let userScheduleArray = JSON.parse(users[user].schedule)
        for (let i = 0; i < userScheduleArray.length && i < userArray.length; i++) {
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

/*
    createScheduleTable()
    Returns a <table> containing rows for each half hour of the day
    and columns for the hours and each day of the week.
    arguments:
        id: string
        hourList: list of strings
        dayList: list of strings
        userScheduleList: list of ints (0 or 1)
    return:
        HTML element <table>
*/
function createScheduleTable(id, hourList, dayList, userScheduleList) {
    const table = document.createElement('table')
    table.id = id
    const titleRow = createTitleRow(dayList)
    table.append(titleRow)
    for (let row = 0; row < hourList.length; row++) {
        const hour = hourList[row]
        const columns = dayList.length
        const hourRow = createHourRow(row, hour, columns, userScheduleList)
        table.append(hourRow)
    }
    return table
}

/*
    createTitleRow()
    Returns a <tr> containing a blank cell and each day of the week.
    arguments:
        dayList: list of strings
    return:
        HTML element <tr>
*/
function createTitleRow(dayList) {
    const tr = document.createElement('tr')
    const th = document.createElement('th')
    tr.append(th)
    for (let i = 0; i < dayList.length; i++) {
        let th = document.createElement('th')
        th.innerHTML = dayList[i].substring(0,3)
        tr.append(th)
    }
    return tr
}

/*
    createHourRow()
    Returns a <tr> containing cells for the hour and cells for each day of the week.
    arguments:
        row: int
        hour: string
        columns: int
        states: list of ints (0 or 1)
    return:
        HTML element <tr>
*/
function createHourRow(row, hour, columns, userScheduleList) {
    const tr = document.createElement('tr')
    const td = document.createElement('td')
    td.innerHTML = hour
    td.classList.add('no-user-select')
    tr.append(td)
    for (let col = 0; col < columns; col++) {
        const index = columns * row + col
        const cell = createCell(row, col, userScheduleList[index])
        tr.append(cell)
    }
    return tr
}

/*
    createCell()
    Returns a <td> containing some information and event listeners.
    arguments:
        row: integer
        col: integer
        state: integer
    return:
        HTML element <td>
*/
function createCell(row, col, state) {
    let td = document.createElement('td')
    td.classList.add('schedule-cell')
    td.classList.add('no-user-select')

    td.setAttribute('data-state', state)
    td.setAttribute('data-row', row)
    td.setAttribute('data-col', col)

    td.addEventListener("mousedown", cellOnMousedown)
    td.addEventListener("mouseover", cellOnMouseover)
    td.addEventListener("mouseup", cellOnMouseup)
    
    return td
}

function cellOnMouseover(event) {
    if (orgData) {
        elemOnMouseover = event.target
        const userIdList = elemOnMouseover.getAttribute('data-ids').split(",")
        updateMouseoverTooltip('cell-info', userIdList, orgData.users)
    }
}

/*
    updateMouseoverTooltip()
    Updates the innerHTML of the tooltip based on the given userIdList and usersDictonary.
    arguments:
        tooltipId: string
        userIdList: list of strings
        usersDictionary: dictionary (each item in userIdList must be a key)
            key: string
            value: dictionary (must contain "name" key)
    return:
        undefined
*/
function updateMouseoverTooltip(tooltipId, userIdList, usersDictionary) {
    const tooltip = document.getElementById(tooltipId)
    tooltip.innerHTML = ""
    let concatenatedNames = ""
    for (let userId in userIdList) {
         concatenatedNames += usersDictionary[userId].name + ", "
         let div = document.createElement('button')
         div.innerHTML = usersDictionary[userId].name
         tooltip.append(div)
    }
    //tooltip.innerHTML = concatenatedNames
}

function cellOnMousedown (event) {
    elemOnMousedown = event.target
    selectionType = toggleState(event.target)
    selectedCells.push(event.target)
}

/*
    toggleState()
    Toggle and return the given element's data-state (0 or 1)
    arguments:
        elem: HTML element <td>
    return:
        integer
*/
function toggleState(elem) {
    const state = elem.getAttribute('data-state')
    const newState = Number(state) === 1 ? 0 : 1
    elem.setAttribute('data-state', newState)
    return newState
}

function cellOnMouseup (event) {
    for (let i = selectedCells.length-1; i >= 0; i--) {
        selectedCells[i].setAttribute('data-state', selectionType)
        selectedCells[i].classList.remove("selected")
    }

    let scheduleList = JSON.parse(orgData.users[USER_ID].schedule);
    for (let i=0; i<cells.length; i++) {
        cell = cells[i]
        let state = cell.getAttribute('data-state')
        scheduleList[i] = Number(state)
        cell.innerHTML = state
    }

    let jsonSchedule = JSON.stringify(scheduleList)
    let jsonString = 'id='+ ORG_ID + '&action=update_user_schedule' +
        '&user_id='+USER_ID + '&schedule='+jsonSchedule
    selectedCells = []
    elemOnMousedown = null
    selectionType = null

    function submit() {
        sendData('POST', FIREBASE_URL+'/update', jsonString)
    }
    submit(() => refreshData())
}

// converts an RGB value to a hex value (0-255)
function rgbToHex(rgb) {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};
