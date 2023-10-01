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
    // console.log(DATABASE);
    displayNotes();
});

const noteModal = document.querySelector('.note-modal');
const btnNewNote = document.querySelector('.btn-new-note');
const btnSave = document.querySelector('.btn-save');
const btnCancel = document.querySelector('.btn-cancel');

/**
 * Main button functionalities.
*/

btnNewNote.addEventListener('click', () => {
    resetNote();
    noteModal.showModal();
});

btnCancel.addEventListener('click', () => {
    noteModal.close();
});

btnSave.addEventListener('click', () => {
    createNewNote();
    updateLocalStorage(DATABASE);
    noteModal.close();
});

const displayNotes = () => {
    DATABASE.forEach(item => {
        createNoteElement(item.id, item.title, item.content);
        displayAlert('notes loaded', 'success');
    });
};

/**
 * Creates a new note, and pushes the info into `DATABASE`.
 * Also checks and validates the text content.
*/

const noteModalHeader = document.querySelector('.note-modal__header');
const noteModalTitle = document.querySelector('.note-modal__title');
const noteModalContent = document.querySelector('.note-modal__content');
const createNewNote = () => {
    const noteId = new Date().getTime();
    let noteTitle = validateContent(noteModalTitle.innerText);
    let noteContent = validateContent(noteModalContent.innerText);
    // console.log(noteContent);

    if (noteContent) {
        createNoteElement(noteId, noteTitle, noteContent);

        let noteInfo = {
            id: noteId,
            title: noteTitle,
            content: noteContent
        }

        DATABASE.push(noteInfo);
        // console.log(DATABASE);
    } else {
        displayAlert('please enter a valid note', 'danger');
    }
};

/**
 * Creates a note element. (`div` with a class of `note` and
 * a unique `data-id`). Based on content, also checks whether
 * the note created should be large. Along with that, adds
 * delete and edit functionality to each note.
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
    displayAlert('note created', 'success');
    deleteNote(element);
    element.addEventListener('click', () => {
        editNote(element);
    });
};

/**
 * Edits a note.
*/

const editNote = element => {
    // console.log(element);
    noteModal.showModal();
    noteModalHeader.textContent = 'edit note';
    noteModalTitle.innerText = element.querySelector('.note__title').innerText;
    noteModalContent.innerText = element.querySelector('.note__content').innerText;
    btnSave.addEventListener('click', () => {
        removeFromLocalStorage(element);
        container.removeChild(element); // not the best practice
        // but who cares lol everything works
        // will fix in a future version
        displayAlert('note edited', 'success');
    });
};

/**
 * Deletes a note.
*/

const deleteNote = element => {
    const deleteBtn = element.querySelector('.note__delete-btn');
    deleteBtn.addEventListener('click', e => {
        e.stopPropagation(); // so that pressing the delete button does not
        // fire off the edit event listener which is on the whole card
        container.removeChild(element);
        removeFromLocalStorage(element);
        displayAlert('note deleted', 'danger');
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
 * <----- Utility Functions ----->
 *
 * 01. Validates characters that have been input by changing to their
 * escape variants. Correctly gauge the number of line breaks in the
 * content. Also correctly assigns non-breaking spaces based on the content.
 * 02. Resets `new-note` info.
 * 03. Changes note size based on content by toggling the `note-large` class.
 * --> Note size is changed by identifying the pixel at the bottom
 * of the text container and it's parent.
*/

// 01
const validateContent = text => {
    text = text.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/\n{2}/g, "\n") // correctly gauge number of new-line chars
        .replace(/\n/g, "<br>");

    // replace two or more spaces with a space and
    // the rest with non-breaking spaces
    text = text.replace(/\s{2,}/g, match => {
        const len = match.length;
        const breaks = '&nbsp;'.repeat(len - 1);
        return ' ' + breaks;
    });

    return text;
};

// 02
const resetNote = () => {
    noteModalHeader.textContent = 'new note';
    noteModalTitle.textContent = '';
    noteModalContent.textContent = '';
};

// 03
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
 * 04. Animate the gradient angle of the `title` for a cool effect.
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

// 04
const title = document.querySelector('.title');
let angle = title.style.getPropertyValue('--angle');
const changeColor = setInterval(() => {
    angle++;
    title.style.setProperty('--angle', `${angle}deg`);
}, 40);
