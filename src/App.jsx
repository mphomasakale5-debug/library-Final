import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // =========================
  // LOGIN
  // =========================
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  // =========================
  // DATA
  // =========================
  const [books, setBooks] = useState(
    JSON.parse(localStorage.getItem("books")) || []
  );

  const [members, setMembers] = useState(
    JSON.parse(localStorage.getItem("members")) || []
  );

  const [borrows, setBorrows] = useState(
    JSON.parse(localStorage.getItem("borrows")) || []
  );

  const [returns, setReturns] = useState(
    JSON.parse(localStorage.getItem("returns")) || []
  );

  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem("transactions")) || []
  );

  // =========================
  // PAGE
  // =========================
  const [page, setPage] = useState("dashboard");

  // =========================
  // BOOK FORM
  // =========================
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookGenre, setBookGenre] = useState("");
  const [bookISBN, setBookISBN] = useState("");
  const [bookQuantity, setBookQuantity] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [bookSearch, setBookSearch] = useState("");

  // =========================
  // MEMBER FORM
  // =========================
  const [memberID, setMemberID] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [editingMember, setEditingMember] = useState(null);
  const [memberSearch, setMemberSearch] = useState("");

  // =========================
  // BORROW FORM
  // =========================
  const [borrowID, setBorrowID] = useState("");
  const [borrowMember, setBorrowMember] = useState("");
  const [borrowBook, setBorrowBook] = useState("");
  const [borrowDate, setBorrowDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  // =========================
  // RETURN FORM
  // =========================
  const [returnID, setReturnID] = useState("");
  const [returnBorrow, setReturnBorrow] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // =========================
  // TRANSACTION FORM
  // =========================
  const [transactionID, setTransactionID] = useState("");
  const [transactionBook, setTransactionBook] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [transactionQuantity, setTransactionQuantity] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  // =========================
  // SAVE DATA
  // =========================
  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem("members", JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem("borrows", JSON.stringify(borrows));
  }, [borrows]);

  useEffect(() => {
    localStorage.setItem("returns", JSON.stringify(returns));
  }, [returns]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // =========================
  // LOGIN
  // =========================
  function login(e) {
    e.preventDefault();

    if (
      username.trim() === "" ||
      password.trim() === "" ||
      role === ""
    ) {
      alert("Please enter username, password and select a role.");
      return;
    }

    setLoggedIn(true);

    if (role === "User") {
      setPage("books");
    } else {
      setPage("dashboard");
    }
  }

  function logout() {
    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setRole("");
    setPage("dashboard");
  }

  // =========================
  // DASHBOARD
  // =========================
  const totalBooks = books.length;
  const totalMembers = members.length;
  const borrowedBooks = borrows.length;

  const availableBooks = books.reduce(
    (total, book) => total + Number(book.stock || 0),
    0
  );

  const overdueBooks = borrows.filter((borrow) => {
    if (!borrow.dueDate) return false;

    const today = new Date();
    const due = new Date(borrow.dueDate);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return due < today;
  }).length;

  // =========================
  // BOOKS
  // =========================
  function clearBookForm() {
    setBookTitle("");
    setBookAuthor("");
    setBookGenre("");
    setBookISBN("");
    setBookQuantity("");
    setEditingBook(null);
  }

  function addBook(e) {
    e.preventDefault();

    if (
      bookTitle.trim() === "" ||
      bookAuthor.trim() === "" ||
      bookGenre.trim() === "" ||
      bookISBN.trim() === "" ||
      bookQuantity === ""
    ) {
      alert("Please fill in all book information.");
      return;
    }

    if (
      books.some(
        (book) =>
          book.isbn.toLowerCase() ===
          bookISBN.trim().toLowerCase()
      )
    ) {
      alert("A book with this ISBN already exists.");
      return;
    }

    const newBook = {
      title: bookTitle.trim(),
      author: bookAuthor.trim(),
      genre: bookGenre.trim(),
      isbn: bookISBN.trim(),
      stock: Number(bookQuantity),
    };

    setBooks([...books, newBook]);

    clearBookForm();

    alert("Book added successfully!");
  }

  function startEditBook(index) {
    const book = books[index];

    setBookTitle(book.title);
    setBookAuthor(book.author);
    setBookGenre(book.genre);
    setBookISBN(book.isbn);
    setBookQuantity(book.stock);
    setEditingBook(index);
  }

  function updateBook(e) {
    e.preventDefault();

    if (editingBook === null) return;

    const updatedBooks = [...books];

    updatedBooks[editingBook] = {
      title: bookTitle.trim(),
      author: bookAuthor.trim(),
      genre: bookGenre.trim(),
      isbn: bookISBN.trim(),
      stock: Number(bookQuantity),
    };

    setBooks(updatedBooks);
    clearBookForm();

    alert("Book updated successfully!");
  }

  function deleteBook(index) {
    if (window.confirm("Are you sure you want to delete this book?")) {
      const updatedBooks = [...books];
      updatedBooks.splice(index, 1);
      setBooks(updatedBooks);
    }
  }

  // =========================
  // MEMBERS
  // =========================
  function clearMemberForm() {
    setMemberID("");
    setMemberName("");
    setMemberRole("");
    setEditingMember(null);
  }

  function addMember(e) {
    e.preventDefault();

    if (
      memberID.trim() === "" ||
      memberName.trim() === "" ||
      memberRole === ""
    ) {
      alert("Please fill in all user information.");
      return;
    }

    if (members.some((member) => member.id === memberID.trim())) {
      alert("This Membership ID already exists.");
      return;
    }

    const newMember = {
      id: memberID.trim(),
      name: memberName.trim(),
      role: memberRole,
    };

    setMembers([...members, newMember]);

    clearMemberForm();

    alert("User added successfully!");
  }

  function startEditMember(index) {
    const member = members[index];

    setMemberID(member.id);
    setMemberName(member.name);
    setMemberRole(member.role);
    setEditingMember(index);
  }

  function updateMember(e) {
    e.preventDefault();

    if (editingMember === null) return;

    const updatedMembers = [...members];

    updatedMembers[editingMember] = {
      id: memberID.trim(),
      name: memberName.trim(),
      role: memberRole,
    };

    setMembers(updatedMembers);
    clearMemberForm();

    alert("User updated successfully!");
  }

  function deleteMember(index) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedMembers = [...members];
      updatedMembers.splice(index, 1);
      setMembers(updatedMembers);
    }
  }

  // =========================
  // BORROW
  // =========================
  function addBorrow(e) {
    e.preventDefault();

    if (
      borrowID.trim() === "" ||
      borrowMember === "" ||
      borrowBook === "" ||
      borrowDate === "" ||
      dueDate === ""
    ) {
      alert("Please fill in all borrow information.");
      return;
    }

    if (borrows.some((borrow) => borrow.id === borrowID.trim())) {
      alert("This Borrow ID already exists.");
      return;
    }

    const bookIndex = books.findIndex(
      (book) => book.isbn === borrowBook
    );

    if (bookIndex === -1) {
      alert("Book not found.");
      return;
    }

    if (Number(books[bookIndex].stock) <= 0) {
      alert("This book is out of stock.");
      return;
    }

    const updatedBooks = [...books];

    updatedBooks[bookIndex] = {
      ...updatedBooks[bookIndex],
      stock: Number(updatedBooks[bookIndex].stock) - 1,
    };

    const newBorrow = {
      id: borrowID.trim(),
      memberID: borrowMember,
      bookISBN: borrowBook,
      borrowDate: borrowDate,
      dueDate: dueDate,
    };

    setBooks(updatedBooks);
    setBorrows([...borrows, newBorrow]);

    setBorrowID("");
    setBorrowMember("");
    setBorrowBook("");
    setBorrowDate("");
    setDueDate("");

    alert("Book borrowed successfully!");
  }

  function deleteBorrow(index) {
    if (
      window.confirm(
        "Are you sure you want to delete this borrow record?"
      )
    ) {
      const updatedBorrows = [...borrows];
      updatedBorrows.splice(index, 1);
      setBorrows(updatedBorrows);
    }
  }

  function getBorrowStatus(date) {
    const today = new Date();
    const due = new Date(date);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    if (due < today) return "Overdue";
    if (due.getTime() === today.getTime()) return "Due Today";

    return "On Time";
  }

  // =========================
  // RETURNS
  // =========================
  function addReturn(e) {
    e.preventDefault();

    if (
      returnID.trim() === "" ||
      returnBorrow === "" ||
      returnDate === ""
    ) {
      alert("Please fill in all return information.");
      return;
    }

    if (returns.some((item) => item.id === returnID.trim())) {
      alert("This Return ID already exists.");
      return;
    }

    const borrowIndex = borrows.findIndex(
      (borrow) => borrow.id === returnBorrow
    );

    if (borrowIndex === -1) {
      alert("Borrow record not found.");
      return;
    }

    const borrow = borrows[borrowIndex];

    const newReturn = {
      id: returnID.trim(),
      borrowID: borrow.id,
      memberID: borrow.memberID,
      bookISBN: borrow.bookISBN,
      returnDate: returnDate,
    };

    const bookIndex = books.findIndex(
      (book) => book.isbn === borrow.bookISBN
    );

    const updatedBooks = [...books];

    if (bookIndex !== -1) {
      updatedBooks[bookIndex] = {
        ...updatedBooks[bookIndex],
        stock: Number(updatedBooks[bookIndex].stock) + 1,
      };
    }

    const updatedBorrows = [...borrows];
    updatedBorrows.splice(borrowIndex, 1);

    setReturns([...returns, newReturn]);
    setBorrows(updatedBorrows);
    setBooks(updatedBooks);

    setReturnID("");
    setReturnBorrow("");
    setReturnDate("");

    alert("Book returned successfully!");
  }

  function deleteReturn(index) {
    if (
      window.confirm(
        "Are you sure you want to delete this return record?"
      )
    ) {
      const updatedReturns = [...returns];
      updatedReturns.splice(index, 1);
      setReturns(updatedReturns);
    }
  }

  // =========================
  // TRANSACTIONS
  // =========================
  function addTransaction(e) {
    e.preventDefault();

    if (
      transactionID.trim() === "" ||
      transactionBook === "" ||
      transactionType === "" ||
      transactionQuantity === "" ||
      transactionDate === ""
    ) {
      alert("Please fill in all transaction information.");
      return;
    }

    if (
      transactions.some(
        (transaction) =>
          transaction.id === transactionID.trim()
      )
    ) {
      alert("This Transaction ID already exists.");
      return;
    }

    const quantity = Number(transactionQuantity);

    if (quantity <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }

    const bookIndex = books.findIndex(
      (book) => book.isbn === transactionBook
    );

    if (bookIndex === -1) {
      alert("Book not found.");
      return;
    }

    const updatedBooks = [...books];

    if (transactionType === "deduct") {
      if (
        Number(updatedBooks[bookIndex].stock) < quantity
      ) {
        alert("Not enough stock available.");
        return;
      }

      updatedBooks[bookIndex] = {
        ...updatedBooks[bookIndex],
        stock:
          Number(updatedBooks[bookIndex].stock) - quantity,
      };
    } else {
      updatedBooks[bookIndex] = {
        ...updatedBooks[bookIndex],
        stock:
          Number(updatedBooks[bookIndex].stock) + quantity,
      };
    }

    const newTransaction = {
      id: transactionID.trim(),
      bookISBN: transactionBook,
      type: transactionType,
      quantity: quantity,
      date: transactionDate,
    };

    setBooks(updatedBooks);
    setTransactions([...transactions, newTransaction]);

    setTransactionID("");
    setTransactionBook("");
    setTransactionType("");
    setTransactionQuantity("");
    setTransactionDate("");

    alert("Stock transaction recorded successfully!");
  }

  // =========================
  // FILTERS
  // =========================
  const filteredBooks = books.filter((book) => {
    const text =
      `${book.title} ${book.author} ${book.genre} ${book.isbn}`.toLowerCase();

    return text.includes(bookSearch.toLowerCase());
  });

  const filteredMembers = members.filter((member) => {
    const text =
      `${member.id} ${member.name} ${member.role}`.toLowerCase();

    return text.includes(memberSearch.toLowerCase());
  });

  // =========================
  // LOGIN PAGE
  // =========================
  if (!loggedIn) {
    return (
      <div id="app">
        <div id="loginPage">
          <h1>Community Library</h1>
          <h2>Management System</h2>

          <form onSubmit={login}>
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label>Role</label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Librarian">Librarian</option>
              <option value="User">User</option>
            </select>

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN SYSTEM
  // =========================
  return (
    <div id="app">
      <div className="page">

        <h1>Community Library Dashboard</h1>

        <p className="welcome">
          Welcome to the Community Library Management System
        </p>

        <div className="navigation">

          {role !== "User" && (
            <button onClick={() => setPage("dashboard")}>
              Dashboard
            </button>
          )}

          <button onClick={() => setPage("books")}>
            Books
          </button>

          {role === "Admin" && (
            <button onClick={() => setPage("members")}>
              Users
            </button>
          )}

          {(role === "Admin" || role === "Librarian") && (
            <>
              <button onClick={() => setPage("borrow")}>
                Borrow Books
              </button>

              <button onClick={() => setPage("returns")}>
                Returns
              </button>

              <button onClick={() => setPage("transactions")}>
                Transactions
              </button>
            </>
          )}

          <button onClick={logout}>
            Logout
          </button>

        </div>

        {/* ================= DASHBOARD ================= */}

        {page === "dashboard" && role !== "User" && (
          <section className="librarySection">

            <div className="stats">

              <div className="statCard">
                <h3>Total Books</h3>
                <p>{totalBooks}</p>
              </div>

              <div className="statCard">
                <h3>Total Members</h3>
                <p>{totalMembers}</p>
              </div>

              <div className="statCard">
                <h3>Borrowed Books</h3>
                <p>{borrowedBooks}</p>
              </div>

              <div className="statCard">
                <h3>Available Books</h3>
                <p>{availableBooks}</p>
              </div>

              <div className="statCard">
                <h3>Overdue Books</h3>
                <p>{overdueBooks}</p>
              </div>

            </div>

            <h2>Current Book Availability</h2>

            <table>
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Available Copies</th>
                </tr>
              </thead>

              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      No books available yet.
                    </td>
                  </tr>
                ) : (
                  books.map((book, index) => (
                    <tr
                      key={index}
                      className={
                        Number(book.stock) <= 1
                          ? "lowStock"
                          : ""
                      }
                    >
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.isbn}</td>
                      <td>{book.stock}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

          </section>
        )}

        {/* ================= BOOKS ================= */}

        {page === "books" && (
          <section className="librarySection">

            <h2>Book Management</h2>

            {role !== "User" && (
              <form
                className="libraryForm"
                onSubmit={
                  editingBook === null
                    ? addBook
                    : updateBook
                }
              >

                <input
                  type="text"
                  placeholder="Book Title"
                  value={bookTitle}
                  onChange={(e) =>
                    setBookTitle(e.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="Author"
                  value={bookAuthor}
                  onChange={(e) =>
                    setBookAuthor(e.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="Genre"
                  value={bookGenre}
                  onChange={(e) =>
                    setBookGenre(e.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="ISBN"
                  value={bookISBN}
                  onChange={(e) =>
                    setBookISBN(e.target.value)
                  }
                />

                <input
                  type="number"
                  placeholder="Initial Quantity"
                  value={bookQuantity}
                  onChange={(e) =>
                    setBookQuantity(e.target.value)
                  }
                />

                <button type="submit">
                  {editingBook === null
                    ? "Add Book"
                    : "Update Book"}
                </button>

                {editingBook !== null && (
                  <button
                    type="button"
                    onClick={clearBookForm}
                  >
                    Cancel
                  </button>
                )}

              </form>
            )}

            <input
              className="searchBox"
              type="text"
              placeholder="Search books..."
              value={bookSearch}
              onChange={(e) =>
                setBookSearch(e.target.value)
              }
            />

            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>ISBN</th>
                  <th>Stock</th>
                  {role !== "User" && <th>Actions</th>}
                </tr>
              </thead>

              <tbody>
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      No books found.
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book) => {

                    const realIndex =
                      books.findIndex(
                        (item) =>
                          item.isbn === book.isbn
                      );

                    return (
                      <tr
                        key={book.isbn}
                        className={
                          Number(book.stock) <= 1
                            ? "lowStock"
                            : ""
                        }
                      >
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.genre}</td>
                        <td>{book.isbn}</td>
                        <td>{book.stock}</td>

                        {role !== "User" && (
                          <td>
                            <button
                              onClick={() =>
                                startEditBook(realIndex)
                              }
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                deleteBook(realIndex)
                              }
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

          </section>
        )}

        {/* ================= USERS ================= */}

        {page === "members" && role === "Admin" && (
          <section className="librarySection">

            <h2>User Management</h2>

            <form
              className="libraryForm"
              onSubmit={
                editingMember === null
                  ? addMember
                  : updateMember
              }
            >

              <input
                type="text"
                placeholder="Membership ID"
                value={memberID}
                onChange={(e) =>
                  setMemberID(e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Name"
                value={memberName}
                onChange={(e) =>
                  setMemberName(e.target.value)
                }
              />

              <select
                value={memberRole}
                onChange={(e) =>
                  setMemberRole(e.target.value)
                }
              >
                <option value="">
                  Select Role
                </option>

                <option value="Student">
                  Student
                </option>

                <option value="Librarian">
                  Librarian
                </option>

                <option value="Admin">
                  Admin
                </option>
              </select>

              <button type="submit">
                {editingMember === null
                  ? "Add User"
                  : "Update User"}
              </button>

              {editingMember !== null && (
                <button
                  type="button"
                  onClick={clearMemberForm}
                >
                  Cancel
                </button>
              )}

            </form>

            <input
              className="searchBox"
              type="text"
              placeholder="Search users..."
              value={memberSearch}
              onChange={(e) =>
                setMemberSearch(e.target.value)
              }
            />

            <table>
              <thead>
                <tr>
                  <th>Membership ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => {

                    const realIndex =
                      members.findIndex(
                        (item) =>
                          item.id === member.id
                      );

                    return (
                      <tr key={member.id}>
                        <td>{member.id}</td>

                        <td>{member.name}</td>

                        <td>{member.role}</td>

                        <td>
                          <button
                            onClick={() =>
                              startEditMember(realIndex)
                            }
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteMember(realIndex)
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

          </section>
        )}

        {/* ================= BORROW ================= */}

        {page === "borrow" &&
          (role === "Admin" || role === "Librarian") && (
          <section className="librarySection">

            <h2>Borrow Books</h2>

            <form
              className="libraryForm"
              onSubmit={addBorrow}
            >

              <input
                type="text"
                placeholder="Borrow ID"
                value={borrowID}
                onChange={(e) =>
                  setBorrowID(e.target.value)
                }
              />

              <select
                value={borrowMember}
                onChange={(e) =>
                  setBorrowMember(e.target.value)
                }
              >
                <option value="">
                  Select User
                </option>

                {members.map((member) => (
                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {member.name} - {member.id}
                  </option>
                ))}
              </select>

              <select
                value={borrowBook}
                onChange={(e) =>
                  setBorrowBook(e.target.value)
                }
              >
                <option value="">
                  Select Book
                </option>

                {books
                  .filter(
                    (book) =>
                      Number(book.stock) > 0
                  )
                  .map((book) => (
                    <option
                      key={book.isbn}
                      value={book.isbn}
                    >
                      {book.title} - Available:{" "}
                      {book.stock}
                    </option>
                  ))}
              </select>

              <label>Borrow Date</label>

              <input
                type="date"
                value={borrowDate}
                onChange={(e) =>
                  setBorrowDate(e.target.value)
                }
              />

              <label>Due Date</label>

              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
              />

              <button type="submit">
                Borrow Book
              </button>

            </form>

            <table>
              <thead>
                <tr>
                  <th>Borrow ID</th>
                  <th>User</th>
                  <th>Book</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {borrows.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      No borrow records.
                    </td>
                  </tr>
                ) : (
                  borrows.map((borrow, index) => {

                    const member =
                      members.find(
                        (item) =>
                          item.id ===
                          borrow.memberID
                      );

                    const book =
                      books.find(
                        (item) =>
                          item.isbn ===
                          borrow.bookISBN
                      );

                    return (
                      <tr key={borrow.id}>
                        <td>{borrow.id}</td>

                        <td>
                          {member
                            ? member.name
                            : "Unknown User"}
                        </td>

                        <td>
                          {book
                            ? book.title
                            : "Unknown Book"}
                        </td>

                        <td>{borrow.borrowDate}</td>

                        <td>{borrow.dueDate}</td>

                        <td>
                          {getBorrowStatus(
                            borrow.dueDate
                          )}
                        </td>

                        <td>
                          <button
                            onClick={() =>
                              deleteBorrow(index)
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

          </section>
        )}

        {/* ================= RETURNS ================= */}

        {page === "returns" &&
          (role === "Admin" || role === "Librarian") && (
          <section className="librarySection">

            <h2>Returns</h2>

            <form
              className="libraryForm"
              onSubmit={addReturn}
            >

              <input
                type="text"
                placeholder="Return ID"
                value={returnID}
                onChange={(e) =>
                  setReturnID(e.target.value)
                }
              />

              <select
                value={returnBorrow}
                onChange={(e) =>
                  setReturnBorrow(e.target.value)
                }
              >
                <option value="">
                  Select Borrow Record
                </option>

                {borrows.map((borrow) => {

                  const book =
                    books.find(
                      (item) =>
                        item.isbn ===
                        borrow.bookISBN
                    );

                  return (
                    <option
                      key={borrow.id}
                      value={borrow.id}
                    >
                      {borrow.id} -{" "}
                      {book
                        ? book.title
                        : "Unknown Book"}
                    </option>
                  );
                })}
              </select>

              <label>Return Date</label>

              <input
                type="date"
                value={returnDate}
                onChange={(e) =>
                  setReturnDate(e.target.value)
                }
              />

              <button type="submit">
                Return Book
              </button>

            </form>

            <table>
              <thead>
                <tr>
                  <th>Return ID</th>
                  <th>Borrow ID</th>
                  <th>User</th>
                  <th>Book</th>
                  <th>Return Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {returns.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      No return records.
                    </td>
                  </tr>
                ) : (
                  returns.map((item, index) => {

                    const member =
                      members.find(
                        (member) =>
                          member.id ===
                          item.memberID
                      );

                    const book =
                      books.find(
                        (book) =>
                          book.isbn ===
                          item.bookISBN
                      );

                    return (
                      <tr key={item.id}>
                        <td>{item.id}</td>

                        <td>{item.borrowID}</td>

                        <td>
                          {member
                            ? member.name
                            : "Unknown User"}
                        </td>

                        <td>
                          {book
                            ? book.title
                            : "Unknown Book"}
                        </td>

                        <td>{item.returnDate}</td>

                        <td>
                          <button
                            onClick={() =>
                              deleteReturn(index)
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

          </section>
        )}

        {/* ================= TRANSACTIONS ================= */}

        {page === "transactions" &&
          (role === "Admin" || role === "Librarian") && (
          <section className="librarySection">

            <h2>Transactions</h2>

            <form
              className="libraryForm"
              onSubmit={addTransaction}
            >

              <input
                type="text"
                placeholder="Transaction ID"
                value={transactionID}
                onChange={(e) =>
                  setTransactionID(e.target.value)
                }
              />

              <select
                value={transactionBook}
                onChange={(e) =>
                  setTransactionBook(e.target.value)
                }
              >
                <option value="">
                  Select Book
                </option>

                {books.map((book) => (
                  <option
                    key={book.isbn}
                    value={book.isbn}
                  >
                    {book.title}
                  </option>
                ))}
              </select>

              <select
                value={transactionType}
                onChange={(e) =>
                  setTransactionType(e.target.value)
                }
              >
                <option value="">
                  Select Transaction Type
                </option>

                <option value="add">
                  Add Stock
                </option>

                <option value="deduct">
                  Deduct Stock
                </option>
              </select>

              <input
                type="number"
                placeholder="Quantity"
                value={transactionQuantity}
                onChange={(e) =>
                  setTransactionQuantity(
                    e.target.value
                  )
                }
              />

              <label>Transaction Date</label>

              <input
                type="date"
                value={transactionDate}
                onChange={(e) =>
                  setTransactionDate(
                    e.target.value
                  )
                }
              />

              <button type="submit">
                Record Transaction
              </button>

            </form>

            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Book</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      No transactions recorded.
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => {

                    const book =
                      books.find(
                        (item) =>
                          item.isbn ===
                          transaction.bookISBN
                      );

                    return (
                      <tr key={transaction.id}>
                        <td>{transaction.id}</td>

                        <td>
                          {book
                            ? book.title
                            : "Unknown Book"}
                        </td>

                        <td>
                          {transaction.type === "add"
                            ? "Add Stock"
                            : "Deduct Stock"}
                        </td>

                        <td>
                          {transaction.quantity}
                        </td>

                        <td>
                          {transaction.date}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

          </section>
        )}

      </div>
    </div>
  );
}

export default App;