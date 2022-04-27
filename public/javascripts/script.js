// console.log("Hi");
// const x = document.querySelector(".msg-1");

// window.onload = function () {
//   x.innerHTML = "HEllo World";
// };

const attendanceForm = document.querySelector(".mark-attendance");
const attendanceInput = document.querySelector(".attendance-input");

// attendanceForm.oninput = function () {
//   //   if (this.value.length === parseInt(this.attributes["maxlength"].value)) {
//   // }
//   attendanceForm.submit();
// };

const attendance = function () {
  const attendanceInput = document.querySelector(".attendance-input");
  if (
    attendanceInput.value.length ===
    parseInt(attendanceInput.attributes["maxlength"].value)
  ) {
    document.querySelector("form").submit();
  }
};
