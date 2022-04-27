// const issueBookForm = document.querySelector(".issue-book--form");

// attendanceForm.oninput = function () {
//   //   if (this.value.length === parseInt(this.attributes["maxlength"].value)) {
//   // }
//   attendanceForm.submit();
// };

const issueBook = function () {
  const bookId = document.querySelector("#book_id");
  //   console.log(this.value);
  //   console.log(bookId.value);
  if (bookId.value.length === parseInt(bookId.attributes["maxlength"].value)) {
    document.querySelector(".issue-book--form").submit();
  }
};

const login = function () {
  const userId = document.querySelector("#userid");
  if (userId.value.length === parseInt(userId.attributes["maxlength"].value)) {
    document.querySelector(".library-login--form").submit();
  }
};
