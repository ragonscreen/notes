/**
 * <----- Main Functionality ----->
*/
let DATABASE = [];

/**
 * Displays notes on initial load.
*/

document.addEventListener('DOMContentLoaded', () => {
    const items = getLocalStorage('notes');
    items.forEach(item => {
        DATABASE.push(item);
    });
    console.log(DATABASE);
    displayNotes();
});

const newNote = document.querySelector('.new-note');
const btnNewNote = document.querySelector('.btn-new-note');
const btnSave = document.querySelector('.btn-save');
const btnCancel = document.querySelector('.btn-cancel');

/**
 * Main button functionalities.
*/

btnNewNote.addEventListener('click', () => {
    resetNote();
    newNote.showModal();
});

btnCancel.addEventListener('click', () => {
    newNote.close();
});

btnSave.addEventListener('click', () => {
    createNewNote();
    updateLocalStorage(DATABASE);
    displayAlert('note created', 'success');
    newNote.close();
});

const displayNotes = () => {
    DATABASE.forEach(item => {
        createNoteElement(item.id, item.title, item.content);
    });
};

/**
 * Creates a new note, and pushes the info into `DATABASE`.
 * Also checks and replaces whether some special characters
 * have been input, in which case, it replaces them with their
 * escaped variants.
*/

const newNoteTitle = document.querySelector('.new-note__title');
const newNoteContent = document.querySelector('.new-note__content');
const createNewNote = () => {
    const noteId = new Date().getTime();
    let noteTitle = escapeChars(newNoteTitle.innerText);
    let noteContent = escapeChars(newNoteContent.innerText);
    console.log(noteContent);

    if (noteContent) {
        createNoteElement(noteId, noteTitle, noteContent);

        let noteInfo = {
            id: noteId,
            title: noteTitle,
            content: noteContent
        }

        DATABASE.push(noteInfo);
        console.log(DATABASE);
    }
};

/**
 * Creates a note element. (`div` with a class of `note` and
 * a unique `data-id`). Based on content, also checks whether
 * the note created should be large.
*/

const container = document.querySelector('.container');
const createNoteElement = (id, title, content) => {
    const element = document.createElement('div');
    element.classList.add('note');
    const elementId = document.createAttribute('data-id');
    elementId.value = id;
    element.setAttributeNode(elementId);
    const noteHtml =
        `<h2 class="note__title">${title}</h2>
        <p class="note__content">${content}</p>
        <button class="note__delete-btn">
            <i class="fa-regular fa-trash-can"></i>
        </button>`;
    element.innerHTML = noteHtml;
    container.prepend(element);
    const elementContent = element.querySelector('.note__content');
    checkNoteLength(elementContent);
    deleteNote(element);
};

/**
 * Delete functionality
*/

const deleteNote = element => {
    const deleteBtn = element.querySelector('.note__delete-btn');
    deleteBtn.addEventListener('click', () => {
        container.removeChild(element);
        console.log(element.dataset.id);
        removeFromLocalStorage(element);

        // updateLocalStorage(items);
    });
};

/**
 * Displays an alert with custom text. Adds a class to the
 * alert box based on the type of alert (info, success, danger).
*/

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
 * <----- Local Storage ----->
 *
 * 01. Get notes from localStorage.
 * 02. Update localStorage.
 * 03. Delete note from localStorage.
*/

// 01
const getLocalStorage = key => {
    return localStorage.getItem(key)
        ? JSON.parse(localStorage.getItem(key))
        : [];
};

// 02
const updateLocalStorage = value => {
    localStorage.setItem('notes', JSON.stringify(value));
};

// 03
const removeFromLocalStorage = element => {
    let items = getLocalStorage('notes');
    items = items.filter(item => item.id != element.dataset.id);
    updateLocalStorage(items);
};

/**
 * <----- Utility ----->
 *
 * 01. Replace characters with their escape variants.
 * 02. Replace escaped characters with their regular variants.
 * 03. Reset `new-note` info.
 * 04. Change note size based on content by toggling the `note-large` class.
 * --> Note size is changed by identifying the pixel at the bottom
 * of the text container and it's parent.
*/

// 01
const escapeChars = text => {
    return text.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

// 02
const unescapeChars = text => {
    return text.replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, "\"")
        .replace(/&#39;/g, "\'")
        .replace(/&amp;/g, "&");
};

// 03
const resetNote = () => {
    newNoteTitle.textContent = '';
    newNoteContent.textContent = '';
};

// 04
const checkNoteLength = element => {
    // 36 here is a bit of a magic number, for some reason the
    // bottom of the element shows up as higher up than expected
    const parent = element.parentElement;
    return element.getBoundingClientRect().bottom + 36 > parent.getBoundingClientRect().bottom
        ? parent.classList.add('note-large')
        : parent.classList.remove('note-large');
};

/**
 * <----- Secondary ----->
 *
 * 01. Add a `margin-top` to `main` based on the height of `nav`.
 * 02. Add the `nav-movable` class to `nav`. This adds a `box-shadow`
 * and removes the `border-bottom` by making it transparent.
 * 03. Toggle fixed width list display by toggling the
 * `container-narrow` class on `.container`.
*/

// 01
const nav = document.querySelector('.nav');
const main = document.querySelector('.main');
const navHeight = nav.offsetHeight;
main.style.marginTop = `${navHeight / 16}rem`;

// 02
window.addEventListener('scroll', () => {
    return window.scrollY > 1
        ? nav.classList.add('nav-movable')
        : nav.classList.remove('nav-movable');
});

// 03
const btnView = document.querySelector('.btn-view');
btnView.addEventListener('click', () => {
    container.classList.toggle('container-narrow');
});
