`use strict`;

// Buttons
const BTN_newBook = document.getElementById("btn__new__book");
const WIN_modal = document.getElementById("win__modal");
const BTN_createBook = document.getElementById("BTN__create");
const BTN_delete = document.getElementById("BTN__DEL");
const BTN_close = document.getElementById("BTN__close");
const BTN_default = document.getElementById("BTN__default");

const $Name = document.getElementById("name");
const $Author = document.getElementById("author");
const $Pages = document.getElementById("pages");
const $Read = document.getElementById("read");
const $newBook = document.querySelector(".new--book");

const $library = document.getElementById("container__lib");

const $statRead = document.getElementById("books__read");
const $statTotal = document.getElementById("books__total");

let myLibrary = [];
BTN_newBook.addEventListener("click", toggleModalWindow);
BTN_createBook.addEventListener(`click`, newBook);
BTN_delete.addEventListener("click", deleteData);
BTN_close.addEventListener("click", toggleModalWindow);
BTN_default.addEventListener("click", defaultListings);

myStorage = window.localStorage;

function defaultListings() {
  //Sample settings
  if (confirm("Delete all current data and load a sample dataset?")) {
    clearLocalStorage();
    myLibrary = [];

    myLibrary.push(new book("Hop On Pop", "Dr Seuss", 8, false));
    myLibrary.push(
      new book(
        "A complete recantation of why JJ Abrams is a complete liar",
        "Sir Arthur Longbottom",
        223,
        false
      )
    );
    myLibrary.push(new book("1984", "George Orwell", 1982, false));
    myLibrary.push(new book("A Brave New World", "Aldous Huxley", 435, false));
    myLibrary.push(
      new book("The Great Gatsby", "F. Scott Fitzgerald", 223, true)
    );
    myLibrary.push(new book("Ulysses", "James Joyce", 1041, false));
    myLibrary.push(new book("The Hobbit", "JRR Tolkien", 223, false));
    myLibrary.push(
      new book(
        "A Curiously long winded retelling of the escapades and buffoonery of one Sir Arthur Longbottom",
        "J.J. Abrams",
        4,
        true
      )
    );
    setLocalStorage();
    printLibrary();
  }
}

//
function toggleModalWindow() {
  WIN_modal.classList.toggle("hidden");
}

class book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = Date.now() + Math.floor(Math.random() * 100);
  }
}

function newBook() {
  const tempTitle = $Name.value;
  const tempAuthor = $Author.value;
  const tempPages = $Pages.value;
  const tempRead = $Read.checked;
  const tempBook = new book(tempTitle, tempAuthor, tempPages, tempRead);
  console.log(tempBook);
  myLibrary.push(tempBook);
  toggleModalWindow();
  setLocalStorage();
  printLibrary();
}

function setLocalStorage() {
  myStorage.setItem(`myLibrary`, JSON.stringify(myLibrary));
}

function loadLocalStorage() {
  if (myStorage.getItem("myLibrary")) {
    myLibrary = JSON.parse(myStorage.getItem(`myLibrary`));
  } else {
    myLibrary = [];
  }
}

function clearLocalStorage() {
  localStorage.clear();
}

function clearPrint() {
  let clearThese = document.querySelectorAll(".bookID");
  for (i of clearThese) {
    $library.firstElementChild.remove();
  }
}

function findBook(id) {
  for (i of myLibrary) {
    if (id == i.id) return myLibrary.indexOf(i);
  }
}

function deleteBook() {
  let thisbook = findBook(this.id);
  if (confirm(`Do you really want to Delete "${myLibrary[thisbook].title}"?`)) {
    myLibrary.splice(thisbook, 1);
    setLocalStorage();
    printLibrary();
  }
}

function setRead(id) {
  let thisbook = myLibrary[findBook(this.id)];
  console.log(thisbook);
  if (thisbook.read === true) {
    if (confirm("Did you really unread this book?")) thisbook.read = false;
  } else thisbook.read = true;
  setLocalStorage();
  printLibrary();
}

function createBookDiv() {}

function printLibrary() {
  loadLocalStorage();
  console.log(myLibrary);
  clearPrint();

  for (i of myLibrary) {
    const createDiv = document.createElement("div");
    createDiv.className = "bookID";
    if (i.read === true) createDiv.classList.add("book--read");
    const createTitle = document.createElement("h3");
    const createAuthor = document.createElement("h4");
    const createPages = document.createElement("h4");
    const createRead = document.createElement("button");
    const createbuttonDiv = document.createElement("div");
    const createHeadingDiv = document.createElement("div");
    createHeadingDiv.className = "book--deets";
    createbuttonDiv.className = "button--container";
    $library.prepend(createDiv);
    createRead.classList = `tag ${i.read ? "tag--read" : ""}`;
    createRead.innerHTML = i.read ? "Read" : "Unread";
    createTitle.innerHTML = i.title;
    createAuthor.innerHTML = `by ${i.author}`;
    createPages.innerHTML = `${i.pages} pages`;
    createRead.id = i.id;
    createDiv.append(createHeadingDiv, createbuttonDiv);
    createHeadingDiv.append(createTitle, createAuthor, createPages);
    const createDeleteButton = document.createElement("button");
    createDeleteButton.className = "btn--del";
    createDeleteButton.innerHTML = "Delete";
    createDeleteButton.id = i.id;
    createbuttonDiv.append(createRead, createDeleteButton);
  }
  const delButtons = document.querySelectorAll(".btn--del");
  delButtons.forEach((i) => i.addEventListener("click", deleteBook));
  const readButtons = document.querySelectorAll(".tag");
  readButtons.forEach((i) => i.addEventListener("click", setRead));

  printSideBar();
}

function deleteData() {
  if (confirm("Delete All Local Storage?")) {
    clearLocalStorage();
    printLibrary();
  }
}

function printSideBar() {
  //Stats Screen
  let statRead = 0;
  for (i of myLibrary) {
    if (i.read === true) statRead += 1;
  }
  $statRead.innerHTML = statRead;
  $statTotal.innerHTML = myLibrary.length;
}

printLibrary();
