class OrganizationData {
    constructor() {
        this.name = null
        this.tags = null
        this.users = null
    }

    update(data) {
        this.name = data.name
        this.tags = data.tags
        this.users = data.users
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
                tagName.push(this.tags[id].name)
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
                userNames.push(this.tags[id].name)
            }
        }
        return userNames
    }

    getUserScheduleById(userId) {
        if (this.users && this.users[userId] && this.users[userId].schedule) {
            try {
                return JSON.parse(schedule)
            } catch (error) {
                console.error(""+error)
            }
        }
        return null
    }
}