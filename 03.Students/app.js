import { html, render } from 'https://unpkg.com/lit-html?module';


document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    let [firstName, lastname, facultyNumber, grade] = [...formData.values()]

    await postData(firstName, lastname, facultyNumber, grade)
    await getData()

    e.target.reset()
})

async function postData(firstName, lastname, facultyNumber, grade) {
    if (typeof firstName === 'string' && typeof lastname === 'string' && Number(facultyNumber) && Number(grade))
        return await fetch('http://localhost:3030/jsonstore/collections/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastname, facultyNumber, grade })
        })
}

async function getData() {
    const url = 'http://localhost:3030/jsonstore/collections/students'
    const response = await fetch(url)
    const data = await response.json()
    const values = Object.values(data)

    const tbody = document.querySelector('#results tbody')
    const template = (student) => html`
    <tr>
        <th>${student.firstName}</th>
        <th>${student.lastname}</th>
        <th>${student.facultyNumber}</th>
        <th>${student.grade}</th>
    </tr>`;

    render(values.map(student => template(student)), tbody)
}
