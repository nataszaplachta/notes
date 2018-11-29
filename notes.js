document.addEventListener('DOMContentLoaded', appStart)

let notes = []
// notes.toString = function() {
//     return JSON.stringify(this)
// }

let notesContainer
let btnNewNote

/**
 * Punkt startowy aplikacji, startuje po załadowaniu struktury DOM
 */
function appStart() {
    notesContainer = document.querySelector('#notes')
    btnNewNote = document.querySelector('#new-note-add')
    btnNewNote.addEventListener('click', newNote)
    getSavedNotes()
    showNotes()
}

/**
 * Pobiera notatki z localStorage i wpisuje do tablicy notes
 */
function getSavedNotes() {
    notes = JSON.parse(localStorage.getItem('notes')) || []
    sortNotes()
}
function sortNotes() {
    notes.sort((n1, n2) => {
        return n2.id - n1.id
    })
}
/**
 * Wyświetla notatki z tablicy notes w html-u
 */
function showNotes() {
    notes.forEach(note => {
        addNoteToNotesContainer(note)
    })
}

function addNoteToNotesContainer(note, firstNote = false) {
    // wrzuć notatkę na stronę
    const noteDiv = document.createElement('div')
    noteDiv.classList.add('note')
    noteDiv.id = `note-${note.id}`
    const d = new Date(note.id)


    noteDiv.innerHTML = `
         <div class='note-title'>${note.title}</div>
         <div class='note-content'>${note.content}</div>
         <div class='note-date'>${d.toLocaleDateString()} ${d.toLocaleTimeString()}</div>
         <div class='note-menu'>
            <i class='far fa-trash-alt' id='n${note.id}'></i>
            <i class="fas fa-thumbtack" id = "p${note.id}"></i>
         </div>
     `


    if (!firstNote) {
        notesContainer.appendChild(noteDiv)
    }
    else {
        const firstChildId = notes[0].id
        const firstNote = document.querySelector(`#note-${firstChildId}`)
        notesContainer.insertBefore(noteDiv, firstNote)
    }
    // obsługa usuwania notatki - kliknięcie w krzyżyk
    document.querySelector(`#n${note.id}`).addEventListener('click', () => {
        usunNotatke(note.id)
    })

    document.querySelector(`#p${note.id}`).addEventListener('click', () => {
        pinNote(note.id)
    })
}

function usunNotatke(id) {
    const idx = notes.findIndex(note => {
        return id == note.id
    })
    notes.splice(idx, 1)
    const noteDivToDelete = document.querySelector(`#note-${id}`)
    notesContainer.removeChild(noteDivToDelete)
    saveNotesToLocalStorage()
}

function pinNote(id) {
    const idx = notes.findIndex(note => {
        return id == note.id
    })
    const noteToPin = document.querySelector(`#note-${id}`)
    const firstChildId = notes[0].id
    const firstNote = document.querySelector(`#note-${firstChildId}`)
    notesContainer.insertBefore(noteToPin, firstNote)
}

function newNote() {
    // dodaj nową notatkę do tablicy notatek
    // pobierz tytuł
    const title = document.querySelector('#new-note-name').value
    // pobierz treść
    const content = document.querySelector('#new-note-content').value
    // utwórz notatkę
    const n = new Note(title, content)
    // zapisz w tablicy notatek
    notes.push(n)
    // zapisz w localStorage
    saveNotesToLocalStorage()
    // wyświetl notatkę
    addNoteToNotesContainer(n, true)
}
function saveNotesToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notes))
}

/**
 * Konstruktor notatki
 * 
 * @param {string} title    Tytuł notatki
 * @param {string} content  Treść notatki
 */
function Note(title = '', content = '') {
    this.title = title
    this.content = content
    this.id = Date.now()
}