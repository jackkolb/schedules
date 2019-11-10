/*
	This file contains a class Test that will test other functions
*/

class Test {
	constructor() {
		this.pass = "."
		this.fail = "F"
		this.error = "E"
	}

	test_createScheduleTable() {
		let t1 = createScheduleTable("id001", ["h1","h2"], ["d1","d2"], [0,1,0,1])
		let t2 = createScheduleTable("id001", ["h1"], ["d1"], [0])
		let t3 = createScheduleTable("", [], [], [])

		return t1.children.length === 3 ? this.pass : this.fail
	}
	test_createTitleRow() {
		let t1 = createTitleRow(["d1, d2"])
		let t2 = createTitleRow(["d1"])
		let t3 = createTitleRow([])
		return t1.children.length === 2 ? this.pass : this.fail
	}

	test_createCell() {
		let t1 = createCell(0,0,0)
		return t1.getAttribute('data-state') === "0" ? this.pass : this.fail
	}

	test() {
		console.log("==== Running tests ====")
		//console.log("'.' is pass, 'F' is fail, 'E' is error")
		let results = "Results "
		results += this.test_createScheduleTable()
		results += this.test_createTitleRow()
		results += this.test_createCell()
		console.log(results)
	}
}

const test = new Test()
test.test()