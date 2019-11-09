let table = document.getElementById('schedule-table')
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
let times = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00']

console.log(table)


let tr_top = document.createElement('tr')
let blank = document.createElement('th')
tr_top.appendChild(blank)
for (let day of days) {
	let th = document.createElement('th')
	th.innerHTML = day
	tr_top.appendChild(th)
}
table.append(tr_top)


for (let time of times) {
	let tr = document.createElement('tr')

	let td_time = document.createElement('td')
	td_time.innerHTML = time
	tr.appendChild(td_time)
	for (let day of days) {
		let td = document.createElement('td')
		td.innerHTML = "*"
		tr.appendChild(td)

		td.addEventListener("mouseover", (event) => {
			console.log(event.target.innerHTML)
		})

	}
	table.appendChild(tr)
	console.log(time)
}

let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = () => {
	if (this.readyState == 4 && this.status == 200) {
		console.log("request!")
	}
}
const FIREBASE_URL = "http://10.28.92.95/org/data/?id=1"
xhttp.open('GET', FIREBASE_URL, true)
xhttp.send() // send request to the server
