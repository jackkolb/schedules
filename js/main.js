let elemOnMousedown = null
let elemOnMouseover = null
let selectionType = null
let selectedCells = []

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

function createCell(row, col) {
	let td = document.createElement('td')
	td.innerHTML = "("+row+","+col+")"
	td.classList.add('schedule-cell')
	td.classList.add('no-user-select')

	td.setAttribute('data-state', 0)
	td.setAttribute('data-row', row)
	td.setAttribute('data-col', col)

	td.addEventListener("mousedown", (event) => {
		elemOnMousedown = event.target
	})

	td.addEventListener("mouseover", (event) => {
		elemOnMouseover = event.target
	})
	return td
}

function paintMouseoverCells(event) {
	console.log("\nelemOnMousedown")
	console.log(elemOnMousedown)

	console.log("elemOnMouseover")
	console.log(elemOnMouseover)

	if (!elemOnMousedown) {
		return;
	}

	const mouseDownRow = elemOnMousedown.getAttribute('data-row')
    const mouseDownCol = elemOnMousedown.getAttribute('data-col')
    const mouseOverRow = elemOnMouseover.getAttribute('data-row')
    const mouseOverCol = elemOnMouseover.getAttribute('data-col')

	const highRow = Math.max(mouseDownRow, mouseOverRow)
    const lowRow  = Math.min(mouseDownRow, mouseOverRow)
    const highCol = Math.max(mouseDownCol, mouseOverCol)
    const lowCol  = Math.min(mouseDownCol, mouseOverCol)

	let cells = document.getElementsByClassName('schedule-cell')
	let selectedCells = []

	for (let cell of cells) {
		const state = cell.getAttribute('data-state')
		const row = cell.getAttribute('data-row')
		const col = cell.getAttribute('data-col')

		if (row >= lowRow && row <= highRow && col >= lowCol && col <= highCol) {
			selectedCells.push(cell)
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

	document.addEventListener("mouseover", paintMouseoverCells)
	document.addEventListener("mousedown", paintMouseoverCells)
}

const scheduleTable = document.getElementById('schedule-table')
main(scheduleTable)

// let xhttp = new XMLHttpRequest();
// xhttp.onreadystatechange = () => {
// 	if (this.readyState == 4 && this.status == 200) {
// 		console.log("request!")
// 	}
// }

// const FIREBASE_URL = "htt10.28.92.95/org/data/?id=1"
// xhttp.open('GET', FIREBASE_URL, true)
// xhttp.send() # send request to the server