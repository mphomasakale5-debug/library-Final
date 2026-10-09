
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // LOGIN
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  // DATA
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

  // PAGE
  const [page, setPage] = useState("dashboard");

  // BOOK FORM
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookGenre, setBookGenre] = useState("");
  const [bookISBN, setBookISBN] = useState("");
  const [bookQuantity, setBookQuantity] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [bookSearch, setBookSearch] = useState("");

  // MEMBER FORM
  const [memberID, setMemberID] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [editingMember, setEditingMember] = useState(null);
  const [memberSearch, setMemberSearch] = useState("");

  // ADMIN AND LIBRARIAN BORROW FORM
  const [borrowID, setBorrowID] = useState("");
  const [borrowMember, setBorrowMember] = useState("");
  const [borrowBook, setBorrowBook] = useState("");
  const [borrowDate, setBorrowDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  // USER BORROW FORM
  const [userBookISBN, setUserBookISBN] = useState("");
  const [userBorrowDate, setUserBorrowDate] = useState("");
  const [userDueDate, setUserDueDate] = useState("");

  // RETURN FORM
  const [returnID, setReturnID] = useState("");
  const [returnBorrow, setReturnBorrow] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // USER RETURN FORM
  const [userReturnBorrow, setUserReturnBorrow] = useState("");
  const [userReturnDate, setUserReturnDate] = useState("");

  // TRANSACTION FORM
  const [transactionID, setTransactionID] = useState("");
  const [transactionBook, setTransactionBook] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [transactionQuantity, setTransactionQuantity] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  // SAVE DATA
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

  // LOGIN
  function login(e) {
    e.preventDefault();

    if (!username.trim() || !password.trim() || !role) {
      alert("Please enter your username, password and select a role.");
      return;
    }

    setLoggedIn(true);
    setPage(role === "User" ? "books" : "dashboard");
  }

  function logout() {
    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setRole("");
    setPage("dashboard");
  }

  // DASHBOARD
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

  // BOOKS
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
      !bookTitle.trim() ||
      !bookAuthor.trim() ||
      !bookGenre.trim() ||
      !bookISBN.trim() ||
      bookQuantity === "" ||
      Number(bookQuantity) < 0
    ) {
      alert("Please enter all book information correctly.");
      return;
    }

    if (
      books.some(
        (book) =>
          book.isbn.toLowerCase() === bookISBN.trim().toLowerCase()
      )
    ) {
      alert("A book with this ISBN already exists.");
      return;
    }

    setBooks([
      ...books,
      {
        title: bookTitle.trim(),
        author: bookAuthor.trim(),
        genre: bookGenre.trim(),
        isbn: bookISBN.trim(),
        stock: Number(bookQuantity),
      },
    ]);

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

    if (
      !bookTitle.trim() ||
      !bookAuthor.trim() ||
      !bookGenre.trim() ||
      !bookISBN.trim() ||
      bookQuantity === "" ||
      Number(bookQuantity) < 0
    ) {
      alert("Please enter all book information correctly.");
      return;
    }

    if (
      books.some(
        (book, index) =>
          index !== editingBook &&
          book.isbn.toLowerCase() === bookISBN.trim().toLowerCase()
      )
    ) {
      alert("Another book already uses this ISBN.");
      return;
    }

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
    const book = books[index];

    if (
      borrows.some((borrow) => borrow.bookISBN === book.isbn)
    ) {
      alert("This book has an active borrowing record and cannot be deleted.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter((_, i) => i !== index));
    }
  }

  // MEMBERS
  function clearMemberForm() {
    setMemberID("");
    setMemberName("");
    setMemberRole("");
    setEditingMember(null);
  }

  function addMember(e) {
    e.preventDefault();

    if (!memberID.trim() || !memberName.trim() || !memberRole) {
      alert("Please fill in all user information.");
      return;
    }

    if (members.some((member) => member.id === memberID.trim())) {
      alert("This Membership ID already exists.");
      return;
    }

    setMembers([
      ...members,
      {
        id: memberID.trim(),
        name: memberName.trim(),
        role: memberRole,
      },
    ]);

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

    if (!memberID.trim() || !memberName.trim() || !memberRole) {
      alert("Please fill in all user information.");
      return;
    }

    if (
      members.some(
        (member, index) =>
          index !== editingMember && member.id === memberID.trim()
      )
    ) {
      alert("This Membership ID already exists.");
      return;
    }

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
    const member = members[index];

    if (borrows.some((borrow) => borrow.memberID === member.id)) {
      alert("This user has borrowing records and cannot be deleted.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this user?")) {
      setMembers(members.filter((_, i) => i !== index));
    }
  }

  // BORROW FOR ADMIN AND LIBRARIAN
  function addBorrow(e) {
    e.preventDefault();

    if (
      !borrowID.trim() ||
      !borrowMember ||
      !borrowBook ||
      !borrowDate ||
      !dueDate
    ) {
      alert("Please fill in all borrow information.");
      return;
    }

    if (dueDate < borrowDate) {
      alert("The due date cannot be before the borrow date.");
      return;
    }

    if (borrows.some((borrow) => borrow.id === borrowID.trim())) {
      alert("This Borrow ID already exists.");
      return;
    }

    const book = books.find((item) => item.isbn === borrowBook);

    if (!book) {
      alert("Book not found.");
      return;
    }

    if (Number(book.stock) <= 0) {
      alert("This book is out of stock.");
      return;
    }

    setBooks(
      books.map((item) =>
        item.isbn === borrowBook
          ? { ...item, stock: Number(item.stock) - 1 }
          : item
      )
    );

    setBorrows([
      ...borrows,
      {
        id: borrowID.trim(),
        memberID: borrowMember,
        bookISBN: borrowBook,
        borrowDate,
        dueDate,
      },
    ]);

    setBorrowID("");
    setBorrowMember("");
    setBorrowBook("");
    setBorrowDate("");
    setDueDate("");

    alert("Book borrowed successfully!");
  }

  // BORROW FOR USER
  function borrowBookAsUser(e) {
    e.preventDefault();

    if (!userBookISBN || !userBorrowDate || !userDueDate) {
      alert("Please select a book, borrow date and due date.");
      return;
    }

    if (userDueDate < userBorrowDate) {
      alert("The due date cannot be before the borrow date.");
      return;
    }

    const book = books.find((item) => item.isbn === userBookISBN);

    if (!book || Number(book.stock) <= 0) {
      alert("This book is not currently available.");
      return;
    }

    const newBorrow = {
      id: `BOR-${Date.now()}`,
      memberID: username.trim(),
      username: username.trim().toLowerCase(),
      bookISBN: userBookISBN,
      borrowDate: userBorrowDate,
      dueDate: userDueDate,
    };

    setBooks(
      books.map((item) =>
        item.isbn === userBookISBN
          ? { ...item, stock: Number(item.stock) - 1 }
          : item
      )
    );

    setBorrows([...borrows, newBorrow]);

    setUserBookISBN("");
    setUserBorrowDate("");
    setUserDueDate("");

    alert("Book borrowed successfully! Check My Borrowing for your due date.");
    setPage("myBorrowing");
  }

  // BORROW STATUS
  function getBorrowStatus(date) {
    if (!date) return "Unknown";

    const today = new Date();
    const due = new Date(date);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    if (due < today) return "Overdue";
    if (due.getTime() === today.getTime()) return "Due Today";

    return "On Time";
  }

  // RETURN A BOOK
  function recordReturn(borrow, chosenReturnDate, returnRecordID) {
    const book = books.find((item) => item.isbn === borrow.bookISBN);

    if (!book) {
      alert("The book for this borrowing record could not be found.");
      return false;
    }

    if (chosenReturnDate < borrow.borrowDate) {
      alert("The return date cannot be before the borrow date.");
      return false;
    }

    const newReturn = {
      id: returnRecordID,
      borrowID: borrow.id,
      memberID: borrow.memberID,
      username: borrow.username || "",
      bookISBN: borrow.bookISBN,
      returnDate: chosenReturnDate,
    };

    setBooks(
      books.map((item) =>
        item.isbn === borrow.bookISBN
          ? { ...item, stock: Number(item.stock) + 1 }
          : item
      )
    );

    setReturns([...returns, newReturn]);
    setBorrows(borrows.filter((item) => item.id !== borrow.id));

    return true;
  }

  // RETURN FOR USER
  function returnMyBook(e) {
    e.preventDefault();

    if (!userReturnBorrow || !userReturnDate) {
      alert("Please select a book to return and its return date.");
      return;
    }

    const borrow = borrows.find(
      (item) =>
        item.id === userReturnBorrow &&
        item.username === username.trim().toLowerCase()
    );

    if (!borrow) {
      alert("Your borrowing record could not be found.");
      return;
    }

    const success = recordReturn(
      borrow,
      userReturnDate,
      `RET-${Date.now()}`
    );

    if (success) {
      setUserReturnBorrow("");
      setUserReturnDate("");
      alert("Book returned successfully!");
      setPage("myReturns");
    }
  }

  // RETURN FOR ADMIN AND LIBRARIAN
  function addReturn(e) {
    e.preventDefault();

    if (!returnID.trim() || !returnBorrow || !returnDate) {
      alert("Please fill in all return information.");
      return;
    }

    if (returns.some((item) => item.id === returnID.trim())) {
      alert("This Return ID already exists.");
      return;
    }

    const borrow = borrows.find((item) => item.id === returnBorrow);

    if (!borrow) {
      alert("Borrow record not found.");
      return;
    }

    const success = recordReturn(borrow, returnDate, returnID.trim());

    if (success) {
      setReturnID("");
      setReturnBorrow("");
      setReturnDate("");
      alert("Book returned successfully!");
    }
  }

  // STOCK TRANSACTIONS
  function addTransaction(e) {
    e.preventDefault();

    if (
      !transactionID.trim() ||
      !transactionBook ||
      !transactionType ||
      transactionQuantity === "" ||
      !transactionDate
    ) {
      alert("Please fill in all transaction information.");
      return;
    }

    if (
      transactions.some(
        (transaction) => transaction.id === transactionID.trim()
      )
    ) {
      alert("This Transaction ID already exists.");
      return;
    }

    const quantity = Number(transactionQuantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      alert("Quantity must be a positive whole number.");
      return;
    }

    const book = books.find((item) => item.isbn === transactionBook);

    if (!book) {
      alert("Book not found.");
      return;
    }

    if (
      transactionType === "deduct" &&
      Number(book.stock) < quantity
    ) {
      alert("Not enough stock available.");
      return;
    }

    setBooks(
      books.map((item) => {
        if (item.isbn !== transactionBook) return item;

        return {
          ...item,
          stock:
            transactionType === "deduct"
              ? Number(item.stock) - quantity
              : Number(item.stock) + quantity,
        };
      })
    );

    setTransactions([
      ...transactions,
      {
        id: transactionID.trim(),
        bookISBN: transactionBook,
        type: transactionType,
        quantity,
        date: transactionDate,
      },
    ]);

    setTransactionID("");
    setTransactionBook("");
    setTransactionType("");
    setTransactionQuantity("");
    setTransactionDate("");

    alert("Stock transaction recorded successfully!");
  }

  // FILTERS
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

  // CURRENT USER'S RECORDS
  const myBorrows = borrows.filter(
    (borrow) =>
      borrow.username === username.trim().toLowerCase()
  );

  const myReturns = returns.filter(
    (item) =>
      item.username === username.trim().toLowerCase()
  );

  // LOGIN PAGE
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

  // MAIN SYSTEM
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

          <button onClick={() => setPage("books")}>Books</button>

          {role === "User" && (
            <>
              <button onClick={() => setPage("borrow")}>
                Borrow a Book
              </button>
              <button onClick={() => setPage("myBorrowing")}>
                My Borrowing
              </button>
              <button onClick={() => setPage("returns")}>
                Return a Book
              </button>
              <button onClick={() => setPage("myReturns")}>
                My Returns
              </button>
            </>
          )}

          {role === "Admin" && (
            <button onClick={() => setPage("members")}>Users</button>
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

          <button onClick={logout}>Logout</button>
        </div>

        {/* DASHBOARD */}
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
                    <td colSpan="4">No books available yet.</td>
                  </tr>
                ) : (
                  books.map((book) => (
                    <tr
                      key={book.isbn}
                      className={Number(book.stock) <= 1 ? "lowStock" : ""}
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

        {/* BOOKS */}
        {page === "books" && (
          <section className="librarySection">
            <h2>{role === "User" ? "Available Books" : "Book Management"}</h2>

            {role !== "User" && (
              <form
                className="libraryForm"
                onSubmit={editingBook === null ? addBook : updateBook}
              >
                <input
                  type="text"
                  placeholder="Book Title"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Genre"
                  value={bookGenre}
                  onChange={(e) => setBookGenre(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="ISBN"
                  value={bookISBN}
                  onChange={(e) => setBookISBN(e.target.value)}
                  required
                />
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Initial Quantity"
                  value={bookQuantity}
                  onChange={(e) => setBookQuantity(e.target.value)}
                  required
                />

                <button type="submit">
                  {editingBook === null ? "Add Book" : "Update Book"}
                </button>

                {editingBook !== null && (
                  <button type="button" onClick={clearBookForm}>
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
              onChange={(e) => setBookSearch(e.target.value)}
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
                    <td colSpan={role === "User" ? "5" : "6"}>
                      No books found.
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book) => {
                    const realIndex = books.findIndex(
                      (item) => item.isbn === book.isbn
                    );

                    return (
                      <tr
                        key={book.isbn}
                        className={Number(book.stock) <= 1 ? "lowStock" : ""}
                      >
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.genre}</td>
                        <td>{book.isbn}</td>
                        <td>{book.stock}</td>

                        {role !== "User" && (
                          <td>
                            <button onClick={() => startEditBook(realIndex)}>
                              Edit
                            </button>
                            <button onClick={() => deleteBook(realIndex)}>
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

            {role === "User" && (
              <p>Select “Borrow a Book” above to borrow an available copy.</p>
            )}
          </section>
        )}

        {/* USER MANAGEMENT */}
        {page === "members" && role === "Admin" && (
          <section className="librarySection">
            <h2>User Management</h2>

            <form
              className="libraryForm"
              onSubmit={editingMember === null ? addMember : updateMember}
            >
              <input
                type="text"
                placeholder="Membership ID"
                value={memberID}
                onChange={(e) => setMemberID(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Name"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                required
              />

              <select
                value={memberRole}
                onChange={(e) => setMemberRole(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                <option value="Student">Student</option>
                <option value="Librarian">Librarian</option>
                <option value="Admin">Admin</option>
              </select>

              <button type="submit">
                {editingMember === null ? "Add User" : "Update User"}
              </button>

              {editingMember !== null && (
                <button type="button" onClick={clearMemberForm}>
                  Cancel
                </button>
              )}
            </form>

            <input
              className="searchBox"
              type="text"
              placeholder="Search users..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
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
                    <td colSpan="4">No users found.</td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => {
                    const realIndex = members.findIndex(
                      (item) => item.id === member.id
                    );

                    return (
                      <tr key={member.id}>
                        <td>{member.id}</td>
                        <td>{member.name}</td>
                        <td>{member.role}</td>
                        <td>
                          <button onClick={() => startEditMember(realIndex)}>
                            Edit
                          </button>
                          <button onClick={() => deleteMember(realIndex)}>
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

        {/* BORROW PAGE */}
        {page === "borrow" && role === "User" && (
          <section className="librarySection">
            <h2>Borrow a Book</h2>
            <p>Choose an available book and enter your borrowing dates.</p>

            <form className="libraryForm" onSubmit={borrowBookAsUser}>
              <label>Select Book</label>
              <select
                value={userBookISBN}
                onChange={(e) => setUserBookISBN(e.target.value)}
                required
              >
                <option value="">Choose an available book</option>
                {books
                  .filter((book) => Number(book.stock) > 0)
                  .map((book) => (
                    <option key={book.isbn} value={book.isbn}>
                      {book.title} — {book.stock} available
                    </option>
                  ))}
              </select>

              <label>Borrow Date</label>
              <input
                type="date"
                value={userBorrowDate}
                onChange={(e) => setUserBorrowDate(e.target.value)}
                required
              />

              <label>Due Date</label>
              <input
                type="date"
                value={userDueDate}
                min={userBorrowDate || undefined}
                onChange={(e) => setUserDueDate(e.target.value)}
                required
              />

              <button type="submit">Borrow Book</button>
            </form>
          </section>
        )}

        {/* ADMIN AND LIBRARIAN BORROW RECORDS */}
        {page === "borrow" &&
          (role === "Admin" || role === "Librarian") && (
            <section className="librarySection">
              <h2>Borrow Books</h2>

              <form className="libraryForm" onSubmit={addBorrow}>
                <input
                  type="text"
                  placeholder="Borrow ID"
                  value={borrowID}
                  onChange={(e) => setBorrowID(e.target.value)}
                  required
                />

                <label>Select User</label>
                <select
                  value={borrowMember}
                  onChange={(e) => setBorrowMember(e.target.value)}
                  required
                >
                  <option value="">Select User</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} - {member.id}
                    </option>
                  ))}
                </select>

                <label>Select Book</label>
                <select
                  value={borrowBook}
                  onChange={(e) => setBorrowBook(e.target.value)}
                  required
                >
                  <option value="">Select Book</option>
                  {books
                    .filter((book) => Number(book.stock) > 0)
                    .map((book) => (
                      <option key={book.isbn} value={book.isbn}>
                        {book.title} - Available: {book.stock}
                      </option>
                    ))}
                </select>

                <label>Borrow Date</label>
                <input
                  type="date"
                  value={borrowDate}
                  onChange={(e) => setBorrowDate(e.target.value)}
                  required
                />

                <label>Due Date</label>
                <input
                  type="date"
                  min={borrowDate || undefined}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />

                <button type="submit">Borrow Book</button>
              </form>

              <h2>Borrowing Records</h2>
              <table>
                <thead>
                  <tr>
                    <th>Borrow ID</th>
                    <th>User</th>
                    <th>Book</th>
                    <th>Borrow Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {borrows.length === 0 ? (
                    <tr>
                      <td colSpan="6">No borrow records.</td>
                    </tr>
                  ) : (
                    borrows.map((borrow) => {
                      const member = members.find(
                        (item) => item.id === borrow.memberID
                      );
                      const book = books.find(
                        (item) => item.isbn === borrow.bookISBN
                      );

                      return (
                        <tr key={borrow.id}>
                          <td>{borrow.id}</td>
                          <td>
                            {member ? member.name : borrow.username || borrow.memberID}
                          </td>
                          <td>{book ? book.title : "Unknown Book"}</td>
                          <td>{borrow.borrowDate}</td>
                          <td>{borrow.dueDate}</td>
                          <td>{getBorrowStatus(borrow.dueDate)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </section>
          )}

        {/* USER'S ACTIVE BORROWING */}
        {page === "myBorrowing" && role === "User" && (
          <section className="librarySection">
            <h2>My Borrowed Books</h2>
            <p>View your borrowing dates, due dates and book status here.</p>

            <table>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myBorrows.length === 0 ? (
                  <tr>
                    <td colSpan="4">You have no active borrowed books.</td>
                  </tr>
                ) : (
                  myBorrows.map((borrow) => {
                    const book = books.find(
                      (item) => item.isbn === borrow.bookISBN
                    );

                    return (
                      <tr key={borrow.id}>
                        <td>{book ? book.title : "Unknown Book"}</td>
                        <td>{borrow.borrowDate}</td>
                        <td>{borrow.dueDate}</td>
                        <td>{getBorrowStatus(borrow.dueDate)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </section>
        )}

        {/* RETURNS */}
        {page === "returns" && role === "User" && (
          <section className="librarySection">
            <h2>Return a Book</h2>
            <p>Select one of your active borrowing records and record the return date.</p>

            <form className="libraryForm" onSubmit={returnMyBook}>
              <label>Book to Return</label>
              <select
                value={userReturnBorrow}
                onChange={(e) => setUserReturnBorrow(e.target.value)}
                required
              >
                <option value="">Select your borrowed book</option>
                {myBorrows.map((borrow) => {
                  const book = books.find(
                    (item) => item.isbn === borrow.bookISBN
                  );

                  return (
                    <option key={borrow.id} value={borrow.id}>
                      {book ? book.title : "Unknown Book"} — Due {borrow.dueDate}
                    </option>
                  );
                })}
              </select>

              <label>Return Date</label>
              <input
                type="date"
                value={userReturnDate}
                onChange={(e) => setUserReturnDate(e.target.value)}
                required
              />

              <button type="submit">Record Return</button>
            </form>
          </section>
        )}

        {/* ADMIN AND LIBRARIAN RETURNS */}
        {page === "returns" &&
          (role === "Admin" || role === "Librarian") && (
            <section className="librarySection">
              <h2>Returns</h2>

              <form className="libraryForm" onSubmit={addReturn}>
                <input
                  type="text"
                  placeholder="Return ID"
                  value={returnID}
                  onChange={(e) => setReturnID(e.target.value)}
                  required
                />

                <label>Borrow Record</label>
                <select
                  value={returnBorrow}
                  onChange={(e) => setReturnBorrow(e.target.value)}
                  required
                >
                  <option value="">Select Borrow Record</option>
                  {borrows.map((borrow) => {
                    const book = books.find(
                      (item) => item.isbn === borrow.bookISBN
                    );

                    return (
                      <option key={borrow.id} value={borrow.id}>
                        {borrow.id} - {book ? book.title : "Unknown Book"}
                      </option>
                    );
                  })}
                </select>

                <label>Return Date</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                />

                <button type="submit">Return Book</button>
              </form>

              <h2>Return Records</h2>
              <table>
                <thead>
                  <tr>
                    <th>Return ID</th>
                    <th>Borrow ID</th>
                    <th>User</th>
                    <th>Book</th>
                    <th>Return Date</th>
                  </tr>
                </thead>
                <tbody>
                  {returns.length === 0 ? (
                    <tr>
                      <td colSpan="5">No return records.</td>
                    </tr>
                  ) : (
                    returns.map((item) => {
                      const member = members.find(
                        (person) => person.id === item.memberID
                      );
                      const book = books.find(
                        (entry) => entry.isbn === item.bookISBN
                      );

                      return (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.borrowID}</td>
                          <td>
                            {member ? member.name : item.username || item.memberID}
                          </td>
                          <td>{book ? book.title : "Unknown Book"}</td>
                          <td>{item.returnDate}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </section>
          )}

        {/* USER'S RETURN HISTORY */}
        {page === "myReturns" && role === "User" && (
          <section className="librarySection">
            <h2>My Return History</h2>

            <table>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Borrow ID</th>
                  <th>Return Date</th>
                </tr>
              </thead>
              <tbody>
                {myReturns.length === 0 ? (
                  <tr>
                    <td colSpan="3">You have no return records yet.</td>
                  </tr>
                ) : (
                  myReturns.map((item) => {
                    const book = books.find(
                      (entry) => entry.isbn === item.bookISBN
                    );

                    return (
                      <tr key={item.id}>
                        <td>{book ? book.title : "Unknown Book"}</td>
                        <td>{item.borrowID}</td>
                        <td>{item.returnDate}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </section>
        )}

        {/* TRANSACTIONS */}
        {page === "transactions" &&
          (role === "Admin" || role === "Librarian") && (
            <section className="librarySection">
              <h2>Transactions</h2>

              <form className="libraryForm" onSubmit={addTransaction}>
                <input
                  type="text"
                  placeholder="Transaction ID"
                  value={transactionID}
                  onChange={(e) => setTransactionID(e.target.value)}
                  required
                />

                <label>Select Book</label>
                <select
                  value={transactionBook}
                  onChange={(e) => setTransactionBook(e.target.value)}
                  required
                >
                  <option value="">Select Book</option>
                  {books.map((book) => (
                    <option key={book.isbn} value={book.isbn}>
                      {book.title}
                    </option>
                  ))}
                </select>

                <label>Transaction Type</label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  required
                >
                  <option value="">Select Transaction Type</option>
                  <option value="add">Add Stock</option>
                  <option value="deduct">Deduct Stock</option>
                </select>

                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Quantity"
                  value={transactionQuantity}
                  onChange={(e) => setTransactionQuantity(e.target.value)}
                  required
                />

                <label>Transaction Date</label>
                <input
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  required
                />

                <button type="submit">Record Transaction</button>
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
                      <td colSpan="5">No transactions recorded.</td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => {
                      const book = books.find(
                        (item) => item.isbn === transaction.bookISBN
                      );

                      return (
                        <tr key={transaction.id}>
                          <td>{transaction.id}</td>
                          <td>{book ? book.title : "Unknown Book"}</td>
                          <td>
                            {transaction.type === "add"
                              ? "Add Stock"
                              : "Deduct Stock"}
                          </td>
                          <td>{transaction.quantity}</td>
                          <td>{transaction.date}</td>
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
