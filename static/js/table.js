// table.js manages updating, drawing, and refreshing the schedule table
//let cell_counter = -1;

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
    console.log("Colored cells")
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

function populateScheduleGrid(users, tag="all") {
    // Populating the arrays [105]
    let userArray = new Array(cells.length).fill(0);
    for (let i = 0; i < cells.length; i++) {
        userArray[i] = new Array();
    }

    totalScheduleArray = new Array(cells.length).fill(0);
    for (user in users) {
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
    td.addEventListener("mouseup", cellOnMouseUp)
    td.addEventListener("mouseover", cellOnMouseover)
    return td
}

function cellOnMouseover(event) {
    if (orgData) {
        elemOnMouseover = event.target

        let users = orgData.users
        let listString = event.target.getAttribute('data-ids')
        let array = listString.split(",")

        cell_info.innerHTML = ""
        for (let user in array) {
             cell_info.innerHTML += users[user].name + ", "
        }
    }
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

function cellOnMouseUp (event) {
    for (let cell of selectedCells) {
        setCell(cell, selectionType)
        cell.classList.remove("selected")
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

function setCell(elem, state) {
    elem.setAttribute('data-state', state)
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
        console.log(elem)
        console.error('Invalid state ' + state)
    }
}

// converts an RGB value to a hex value (0-255)
function rgbToHex(rgb) {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};
