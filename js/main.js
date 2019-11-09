let elemOnMousedown = null
let elemOnMouseover = null
let selectionType = null

const table = document.getElementById('table-clickable')
const aggregateTable = document.getElementById('table-display')
const toggleCells = document.getElementsByClassName('cell')
const aggregateCells = document.getElementsByClassName('cell-display')
let selectedCells = []

const hours = ['12:00', '12:30', ' 1:00', ' 1:30', '2:00', '2:30', '3:00']
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']


let tr_top = document.createElement('tr')
let blank = document.createElement('th')
tr_top.appendChild(blank)
for (let day of days) {
	let th = document.createElement('th')
	th.innerHTML = day
	tr_top.appendChild(th)
}
table.append(tr_top)


for (let hour of hours) {
	let tr = document.createElement('tr')

	let td_time = document.createElement('td')
	td_time.innerHTML = hour
	tr.appendChild(td_time)
	for (let day of days) {
		let td = document.createElement('td') // create cell
		td.classList.add('schedule-cell')
		td.innerHTML = "*"
		tr.appendChild(td)

		td.addEventListener("mouseover", (event) => {
			
		})

		td.addEventListener("mousedown", (event) => {
			elemMousedown = event.target
			console.log(event.target)
		})

	}
	table.appendChild(tr)
}
