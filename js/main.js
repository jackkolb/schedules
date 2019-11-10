let xhttp = new XMLHttpRequest();
console.log(xhttp)
const FIREBASE_URL = "http://scheduler-cutiehack.herokuapp.com"
const ORG_ID = "1"
const USER_ID = "1"
//"http://10.28.92.95:/org_data?id=1"

let elemOnMousedown = null
let elemOnMouseover = null
let selectionType = null
let selectedCells = []
let cells = []

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
    td.innerHTML = "("+row+","+col+")"
    td.classList.add('schedule-cell')
    td.classList.add('no-user-select')

    td.setAttribute('data-state', 0)
    td.setAttribute('data-row', row)
    td.setAttribute('data-col', col)

    td.addEventListener("mousedown", cellOnMousedown)

    td.addEventListener("mouseover", (event) => {
        elemOnMouseover = event.target
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
    console.log(elemOnMousedown)
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
        }

        let scheduleList = []
        for (let cell of cells) {
            let state = cell.getAttribute('data-state')
            scheduleList.push(Number(state))
        }

        let jsonSchedule = JSON.stringify(scheduleList)
        let jsonData = {
            'id': ORG_ID,
            'action': "update_user_schedule",
            'user_id': USER_ID,
            'schedule': jsonSchedule
        }
        //sendData('GET', FIREBASE_URL+'/update?id='+ORG_ID+"&action=update_user_schedule&user_id="+USER_ID+"&schedule="+jsonSchedule)
        sendData('POST', FIREBASE_URL+'/update', jsonData)

        selectedCells = []
        elemOnMousedown = null
        selectionType = null

        console.log(jsonSchedule)
        console.log(jsonData)
    })
}

const scheduleTable = document.getElementById('schedule-table')
main(scheduleTable)

function sendData(method, url, jsonData) {
    xhttp.open(method, url)
    xhttp.send(jsonData)
}


xhttp.onreadystatechange = () => {
    if (xhttp.status == 200) {
        console.log(xhttp.response)
    }
}


xhttp.open('GET', FIREBASE_URL+"/org_data?id=1", true)
xhttp.send() // send request to the server
