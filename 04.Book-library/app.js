import { html, render } from 'https://unpkg.com/lit-html?module';

document.getElementById('loadBooks').addEventListener('click', getData)
document.getElementById('submitForm').addEventListener('submit', postData)

async function getData() {
    const response = await fetch('http://localhost:3030/jsonstore/collections/books')
    const data = await response.json()
    const values = Object.values(data)

    const template = (books) => html`
        <tr>
            <td>${books.title}</td>
            <td>${books.author}</td>
            <td id=${books._id}>
                <button @click=${editBtn}>Edit</button>
                <button @click=${deleteBtn}>Delete</button>
            </td>
        </tr>
    `
    const tbody = document.querySelector('table tbody')
    render(values.map(book => template(book)), tbody)
}

async function deleteBtn(event) {
    const id = event.target.parentElement.id;

    if (confirm('Are you sure you want to delete?')) {
        await fetch('http://localhost:3030/jsonstore/collections/books/' + id, {
            method: 'delete'
        })
    }

    getData()
}

function editBtn(event) {
    const id = event.target.parentElement.id;

    const form = document.getElementById('submitForm');
    const editForm = document.getElementById('editForm');

    form.style.display = 'none';
    editForm.style.display = 'block';

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(editForm);
        const [title, author] = [...formData.values()];

        await fetch('http://localhost:3030/jsonstore/collections/books/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author })
        })

        editForm.reset();
        getData();
    });
}

async function postData(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const [title, author] = Array.from(formData.values())

    await fetch('http://localhost:3030/jsonstore/collections/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author })
    });

    getData()
}