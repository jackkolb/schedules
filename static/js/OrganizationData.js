class OrganizationData {
    constructor() {
        this.name = null
        this.tags = null
        this.users = null
    }

    update(data) {
        this.name = data.name || null
        this.tags = data.tags || null
        this.users = data.users || null
    }

    getName() {
        return this.name || null
    }

    getTagNameById(tagId) {
        return (this.tags && this.tags[tagId] && this.tags[tagId].name) ? this.tags[tagId].name : null
    }

    getTagVisibleById(tagId) {
        return (this.tags && this.tags[tagId] && this.tags[tagId].visible) ? this.tags[tagId].visible : null
    }

    getTagIdByName(tagName) {
        for (let id in this.tags) {
            if (this.tags[id].name === tagName)
                return id
        }
        return null
    }

    getTagNames() {
        let tagNames = []
        for (let id in this.tags) {
            if (this.tags[id].name) {
                tagNames.push(this.tags[id].name)
            }
        }
        return tagNames
    }

    getUserNameById(userId) {
        return (this.users && this.users[userId] && this.users[userId].name) ? this.users[userId].name : null
    }

    getUserIdByName(userName) {
        for (let id in this.users) {
            if (this.users[id].name === userName)
                return id
        }
        return null
    }

    getUserNames() {
        let userNames = []
        for (let id in this.users) {
            if (this.users[id].name) {
                userNames.push(this.users[id].name)
            }
        }
        return userNames
    }

    getUserScheduleById(userId) {
        if (this.users && this.users[userId] && this.users[userId].schedule) {
            try {
                return JSON.parse(this.users[userId].schedule)
            } catch (error) {
                console.error(""+error)
            }
        }
        return null
    }

    getArraySchedule() {
        //let schedules = []
        let arraySchedule = new Array(105)
        console.log(arraySchedule)
        for (let id in this.users) {
            arraySchedule[i] = new Array()
            let schedule = this.getUserScheduleById(id)
            for (let i = 0; i < schedule.length; i++) {
                if (schedule[i] === 1) {
                    arraySchedule[i].push(id)
                }
            }
            //schedules.push(schedule)
        }
        // if (schedules.length < 1 || schedules[0] === null) {
        //     return null
        // }
        
        // for (let i = 0; i < arraySchedule.length; i++) {
        //     arraySchedule[i] = new Array()
        //     for (let schedule of schedules) {
        //         if (schedule[i] === 1) {
        //             arraySchedule[i].push("A")
        //         }
        //     }
        // }
        return arraySchedule
    }

    // getArraySchedule() {
    //     let schedules = []

    //     for (let id in this.users) {
    //         let schedule = this.getUserScheduleById(id)
    //         schedules.push(schedule)
    //     }
    //     if (schedules.length < 1 || schedules[0] === null) {
    //         return null
    //     }
    //     let arraySchedule = Array(schedules[0].length).fill(0)
    //     for (let i = 0; i < arraySchedule.length; i++) {
    //         arraySchedule[i] = new Array()
    //         for (let schedule of schedules) {
    //             if (schedule[i] === 1) {
    //                 arraySchedule[i].push("A")
    //             }
    //         }
    //     }
    //     return arraySchedule
    // }

    getSumSchedule() {
        let schedules = []
        for (let id in this.users) {
            let schedule = this.getUserScheduleById(id)
            schedules.push(schedule)
        }
        if (schedules.length < 1 || schedules[0] === null) {
            return null
        }
        let sumSchedule = Array(schedules[0].length).fill(0)
        for (let row = schedules.length-1; row >= 0 ; row--) {
            if (schedules[row] === null) {
                return null
            }
            for (let col = schedules[row].length-1; col >= 0; col--) {
                sumSchedule[col] += schedules[row][col]
            }
        }
        return sumSchedule
    }
}

const organizationData = new OrganizationData()