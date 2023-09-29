const nav = document.querySelector('.nav');
const main = document.querySelector('.main');

const navHeight = nav.offsetHeight;
main.style.marginTop = `${navHeight / 16}rem`;

// Nav movable adds a box-shadow and removes the bottom border from the nav

window.addEventListener('scroll', () => {
    if (window.scrollY > 1) {
        nav.classList.add('nav-movable');
    } else {
        nav.classList.remove('nav-movable');
    }
});

const container = document.querySelector('.container');
const btnView = document.querySelector('.btn-view');

// Toggle fixed width list display

btnView.addEventListener('click', () => {
    container.classList.toggle('container-narrow');
});

// Make notes larger based on content

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

const btnNewNote = document.querySelector('.btn-new-note');
const btnClose = document.querySelector('.btn-close');
const newNote = document.querySelector('.new-note');


btnNewNote.addEventListener('click', () => {
    console.log('test');
    newNote.showModal();
});

btnClose.addEventListener('click', () => {
    newNote.close();
});
