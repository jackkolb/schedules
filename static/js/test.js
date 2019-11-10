/*
	This file contains a class Test that will test other functions
*/

class Test {
	

	test_createScheduleTable() {
		let t1 = createScheduleTable("id001", ["h1","h2"], ["d1","d2"], [0,1,0,1])
		let t2 = createScheduleTable("id001", ["h1"], ["d1"], [0])
		let t3 = createScheduleTable("", [], [], [])
		console.log(t1)
		console.log(t2)
		console.log(t3)
	}
	test_createTitleRow() {
		let tr1 = createTitleRow(["d1, d2"])
		let tr2 = createTitleRow(["d1"])
		let tr3 = createTitleRow([])
		console.log(tr1)
		console.log(tr2)
		console.log(tr3)
	}

	test_createCell() {
		let td1 = createCell(0,0,0)
		console.log(td1)
	}

	test() {
		
		this.test_createScheduleTable()
		this.test_createTitleRow()
		this.test_createCell()
	}
}

let test = new Test()
test.test()