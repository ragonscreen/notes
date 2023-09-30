/**
 * <----- Main Functionality ----->
*/
const DATABASE = [];

const btnNewNote = document.querySelector('.btn-new-note');
const newNote = document.querySelector('.new-note');
const btnSave = document.querySelector('.btn-save');
const btnCancel = document.querySelector('.btn-cancel');

btnNewNote.addEventListener('click', () => {
    newNote.showModal();
});

btnCancel.addEventListener('click', () => {
    newNote.close();
});

const container = document.querySelector('.container');

// const displayNotes = (id, title, content) => {


//     container.appendChild(element);
// }


btnSave.addEventListener('click', () => {
    createNewNote()
    resetNote();
    newNote.close();
});


const newNoteTitle = document.querySelector('.new-note__title');
const newNoteContent = document.querySelector('.new-note__content');

const createNewNote = () => {
    const noteId = new Date().getTime();
    let noteTitle = '';
    let noteContent = '';

    noteTitle = newNoteTitle.innerText;
    noteContent = newNoteContent.innerText;

    let noteInfo = {
        id: noteId,
        title: noteTitle,
        content: noteContent
    }

    DATABASE.push(noteInfo);
    createNoteElement(noteId, noteTitle, noteContent);
    console.log(DATABASE);

    resetNote();
};

const resetNote = () => {
    newNoteTitle.textContent = '';
    newNoteContent.textContent = '';
}

// DATABASE.forEach(note => {
//     displayNotes(note.id, note.title, note.content);
// });

const createNoteElement = (id, title, content) => {
    const element = document.createElement('div');
    element.classList.add('note');
    const elementId = document.createAttribute('data-id');
    elementId.value = id;
    element.setAttributeNode(elementId);
    const noteHtml =
        `<h2 class="note__title">${title}</h2>
        <p class="note__content">${content}</p>`;
    element.innerHTML = noteHtml;
    container.prepend(element);
}


document.addEventListener('DOMContentLoaded', () => {
    console.log(DATABASE);
});




// Display alert

const alertBox = document.querySelector('.alert');
const displayAlert = (text, action) => {
    alertBox.textContent = text;
    alertBox.classList.remove('alert-success', 'alert-info', 'alert-danger');
    alertBox.classList.add('alert-visible', `alert-${action}`);

    setTimeout(() => {
        alertBox.classList.remove('alert-visible');
    }, 2000);
};

/**
 * <----- General Improvements ----->
 *
 * 01. Add a `margin-top` to `main` based on the height of `nav`.
 *
 * 02. Add the `nav-movable` class to `nav`.
 * >> `nav-movable` adds a `box-shadow` and removes the `border-bottom`
 * by making it transparent.
 *
 * 03. Toggle fixed width list display by toggling the
 * `container-narrow` class on `.container`.
 *
 * 04. Change note size based on content by toggling the `note-large` class.
 * >> Note size is changed by identifying the pixel at the bottom
 * of the text container and it's parent.
 *
*/

// 01
const nav = document.querySelector('.nav');
const main = document.querySelector('.main');
const navHeight = nav.offsetHeight;
main.style.marginTop = `${navHeight / 16}rem`;

// 02
window.addEventListener('scroll', () => {
    if (window.scrollY > 1) {
        nav.classList.add('nav-movable');
    } else {
        nav.classList.remove('nav-movable');
    }
});

// 03
const btnView = document.querySelector('.btn-view');
btnView.addEventListener('click', () => {
    container.classList.toggle('container-narrow');
});

// 04
const testElement = document.querySelector('.testing');
const noteContents = document.querySelectorAll('.note__content');
noteContents.forEach(noteContent => {
    // 36 here is a bit of a magic number, for some reason the bottom of the element shows up as higher up than expected
    if (noteContent.getBoundingClientRect().bottom + 36 > noteContent.parentElement.getBoundingClientRect().bottom) {
        noteContent.parentElement.classList.add('note-large');
    } else {
        noteContent.parentElement.classList.remove('note-large');
    }
});
