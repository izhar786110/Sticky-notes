const createdNotes = [];
const deletedNotes = [];

const textarea = document.querySelector("textarea");

const form = document.querySelector("form");
const color = document.querySelector("input");
const fragment = document.createDocumentFragment();
let notesContainer = document.querySelector(".note-container");
const undoButton = document.querySelector(".undo-button");

if (deletedNotes.length === 0) {
  undoButton.disabled = true;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newNote = {
    text: textarea.value,
    color: color.value,
    timeStamp: new Date().toLocaleString(),
    position: Date.now(),
  };

  createdNotes.push(newNote);
  displayNotes();

  textarea.value = "";
  textarea.focus();
});

function displayNotes() {
  notesContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();

  createdNotes.forEach((note) => {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");

    const text = document.createElement("p");
    text.classList.add("text");
    text.textContent = note.text;

    noteDiv.style.backgroundColor = note.color;

    const timeStamp = document.createElement("span");
    timeStamp.classList.add("time-stamp");
    timeStamp.innerText = note.timeStamp;
    
    const close = document.createElement("span");
    close.classList.add("fa-solid", "fa-xmark", "close");
    close.addEventListener("click", (e) => {
      undoButton.disabled = false;
      const toDeleteNoteIndex = createdNotes.findIndex((n) => {
        return n.position === note.position;
      });
      deletedNotes.push(...createdNotes.splice(toDeleteNoteIndex, 1));
      displayNotes();
    });
    const edit = document.createElement("span");
    edit.classList.add("edit", "fa-solid", "fa-pen-to-square");

    let editableInput = document.createElement("textarea");
    editableInput.value = note.text;

    editableInput.style.display = "none";

    noteDiv.append(editableInput);

    edit.addEventListener("click", (e) => {
      if (editableInput.style.display === "none") {
        editableInput.style.display = "block";
        editableInput.focus();
        text.style.display = "none";
      } else {
        console.log(note);
        note.text = editableInput.value;
        text.innerText = editableInput.value;
        editableInput.style.display = "none";
        text.style.display = "block";
      }
    });
    noteDiv.append(text, timeStamp, close, edit);
    fragment.append(noteDiv);
  });

  notesContainer.append(fragment);
}

undoButton.addEventListener("click", (e) => {
  if (deletedNotes.length > 0) {
    const lastDeleted = deletedNotes.pop();
    createdNotes.push(lastDeleted);
    createdNotes.sort((a, b) => {
      return a.position - b.position;
    });
  }
  displayNotes();
});