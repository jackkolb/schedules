// buttons.js contains methods for user buttons (toggle, flip, etc)

// displays/hides the user settings
function toggleUserOptions() {
    let elem = document.getElementById('user-menu')
    let visibility = elem.style.display
    if (visibility == "block") {
        elem.style.display = "none"
    }
    else {
        elem.style.display = "block"
    }
}

// displays/hides the manager settings
function toggleManager() {
    let elem = document.getElementById('manager-menu')
    let visibility = elem.style.display
    if (visibility == "block") {
        elem.style.display = "none"
    }
    else {
        elem.style.display = "block"
    }
}