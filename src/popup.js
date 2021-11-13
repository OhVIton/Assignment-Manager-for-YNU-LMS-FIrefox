(async () => {
    setTextLanguage()
    injectAssignmentTable()

})()


function setTextLanguage() {
    let LANGUAGE = getLanguage()
    if (LANGUAGE == 'English') {
        SUBJECT_TXT = 'Lecture'
        ASSIGNMENT_FOR_THIS_LECTURE_TXT = 'Assignments'
        ASSIGNMENT_TXT = 'Assignment'
        DEADLINE_TXT = 'DEADLINE'
        SHOW_TXT = '表示'
    } else {
        SUBJECT_TXT = 'Lecture'
        ASSIGNMENT_FOR_THIS_LECTURE_TXT = '課題'
        ASSIGNMENT_TXT = '課題名'
        DEADLINE_TXT = '提出期限'
        SHOW_TXT = '表示'
    }
}

function getLanguage() {
    return '日本語'
}


async function loadFromStorage() {
    let assignments = []
    let getAssignment = browser.storage.sync.get(null)
    getAssignment.then((data) => {
        for (const assignment of Object.values(data)) {
            assignments.push(assignment)
        }
    })
}

function injectAssignmentTable() {
    const DISPLAY_LIMIT_DAYS = 21

    let listBlockElem = document.createElement('div')
    listBlockElem.id = 'list_block'

    let tableElem = document.createElement('table')
    tableElem.border = '0'
    tableElem.cellPadding = '0'
    tableElem.cellSpacing = '0'
    tableElem.className = 'cs_table2'

    let tbody = document.createElement('tbody')
    let columns = document.createElement('tr')
    columns.innerHTML = `
        <th width="20%">${SUBJECT_TXT}</th>
        <th width="37%">${ASSIGNMENT_TXT}</th>
        <th width="10%">${DEADLINE_TXT}</th>
        <th width="10%">${SHOW_TXT}</th>
    `

    tbody.appendChild(columns)


    let getAssignment = browser.storage.local.get(null)
    getAssignment.then((data) => {
        let assignments = Object.values(data)
        assignments.sort((a, b) => new Date(a['due']) - new Date(b['due']))

        for (const assignment of assignments) {
            let daysLeft = (new Date(assignment['due']) - new Date()) / 86400000
            if (daysLeft > DISPLAY_LIMIT_DAYS)
                continue

            // subject, name, due, show
            let record = document.createElement('tr')
            
            //subject
            let subjectColumn = document.createElement('td')

            let subjectElem = document.createElement('p')
            console.log(assignment)
            subjectElem.innerText = getLanguage() == 'English' ? assignment['subject_en'] : assignment['subject_ja']

            subjectColumn.appendChild(subjectElem)

            // name
            let nameColumn = document.createElement('td')

            let nameElem = document.createElement('p')
            nameElem.innerText = assignment.name

            nameColumn.appendChild(nameElem)

            // due
            let dueColumn = document.createElement('td')
            dueColumn.align = 'center'
            dueColumn.innerText = new Date(assignment.due).toLocaleDateString()

            // show
            let showColumn = document.createElement('td')
            showColumn.align = 'center'
            
            let showCheckbox = document.createElement('input')
            showCheckbox.checked = assignment['isVisible']
            showCheckbox.type = 'checkbox'
            showCheckbox.addEventListener('change', () => {
                assignment['isVisible'] = showCheckbox.checked
                var keypair = {}
                keypair[assignment['id']] = assignment
                browser.storage.local.set(keypair)
            })
            showColumn.appendChild(showCheckbox)


            record.appendChild(subjectColumn)
            record.appendChild(nameColumn)
            record.appendChild(dueColumn)
            record.appendChild(showColumn)

            tbody.append(record)
        }
    })

    tableElem.appendChild(tbody)
    listBlockElem.appendChild(tableElem)
    listBlockElem.style = 'margin-bottom: 10px; box-sizing: border-box; width: 600px; height: 300px; overflow-y: auto'
    
    document.body.appendChild(listBlockElem)
}