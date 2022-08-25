const formBooks = document.querySelector("#book-form");
const tableBody = document.querySelector("#book-list");

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class LocalS {
  static addToStorage(bookObj) {
    let books = JSON.parse(localStorage.getItem("books"));
    if (books === null) {
      books = [];
    }
    books.push(bookObj);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static chargebooks() {
    let books = JSON.parse(localStorage.getItem("books"));
    if (books !== null) {
      for (let book of books) {
        UI.addToList(book);
      }
    }
  }

  static removebooks(isbn) {
    let books = JSON.parse(localStorage.getItem("books"));
    if (books !== null) {
      const newbooks = books.filter((book) => {
        return book.isbn !== isbn;
      });
      localStorage.setItem("books", JSON.stringify(newbooks));
    }
  }
}

class UI {
  static addToList({ title, author, isbn }) {
    const bookListRow = document.createElement("tr");

    bookListRow.innerHTML = `
    <td>${title}</td>
    <td>${author}</td>
    <td>${isbn}</td>
    <td><a href="#" class="delete">x</a></td>
    `;

    tableBody.append(bookListRow);
  }

  static removeFromList(row) {
    row.remove();
    this.showAlert("Book removed", "success");
  }

  static showAlert(msg, type) {
    let alert = document.createElement("p");
    alert.classList.add(type);
    alert.append(msg);
    formBooks.prepend(alert);
    setTimeout(() => {
      this.removeAlert(alert);
    }, 2000);
  }

  static removeAlert(alert) {
    alert.remove();
  }
}

formBooks.addEventListener("submit", (e) => {
  e.preventDefault();
  const formElements = formBooks.elements;
  if (
    formElements.title.value === "" ||
    formElements.author.value === "" ||
    formElements.isbn.value === ""
  ) {
    UI.showAlert("All fields must be written", "error");
  } else {
    const book = new Book(
      formElements.title.value,
      formElements.author.value,
      formElements.isbn.value
    );

    UI.addToList(book);
    UI.showAlert("Book added", "success");
    LocalS.addToStorage(book);

    formElements.title.value = "";
    formElements.author.value = "";
    formElements.isbn.value = "";
  }
});

tableBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    UI.removeFromList(e.target.parentElement.parentElement);
    LocalS.removebooks(
      e.target.parentElement.parentElement.children[2].innerText
    );
  }
});

LocalS.chargebooks();
