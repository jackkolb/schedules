// table.js manages updating, drawing, and refreshing the schedule table

// fillTable creates the table
function fillTable(table, hours, days) {
    let titleRow = createTitleRow(days)
    table.append(titleRow)
    for (let row = 0; row < hours.length; row++) {
        let hourRow = createHourRow(row, hours[row], days)
        table.append(hourRow)
    }
}

// createTitleRow creates the header row (day of the week)
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

// createHourRow creates the header column (time of day)
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
