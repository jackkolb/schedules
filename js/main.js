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
	tr.append(td)
	for (let col = 0; col < days.length; col++) {
		let cell = createScheduleCell(row, col)
		tr.append(cell)
	}
	return tr
}

function createScheduleCell(r, c) {
	let td = document.createElement('td')
	td.innerHTML = "("+r+","+c+")"

	td.addEventListener("mouseover", (event) => {
		console.log(event.target)
	})
	return td
}

function fillTable(table, hours, days) {
	let titleRow = createTitleRow(days)
	table.append(titleRow)
	for (let row = 0; row < hours.length; row++) {
		let hourRow = createHourRow(row, hours[row], days)
		table.append(hourRow)
	}
}

function main(table) {
	let elemOnMousedown = null
	let elemOnMouseover = null
	let selectionType = null
	
	//const aggregateTable = document.getElementById('table-display')
	//const toggleCells = document.getElementsByClassName('cell')
	//const aggregateCells = document.getElementsByClassName('cell-display')
	let selectedCells = []

	const hours = ['12:00', '12:30', ' 1:00', ' 1:30', '2:00', '2:30', '3:00']
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

	fillTable(table, hours, days)
}

const scheduleTable = document.getElementById('schedule-table')
main(scheduleTable)

let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = () => {
	if (this.readyState == 4 && this.status == 200) {
		console.log("request!")
	}
}

const FIREBASE_URL = "http://10.28.92.95/org/data/?id=1"
xhttp.open('GET', FIREBASE_URL, true)
xhttp.send() // send request to the server