document.querySelector("#form").addEventListener("submit", function (e) {
  e.preventDefault();

  const fromId = document.querySelector("#formId").value;
  const toId = document.querySelector("#toId").value;
  const dateAsText = document.querySelector("#date").value;
  const timeAsText = document.querySelector("#time").value;
  const pax = document.querySelector("#pax").value;
  const appDate = dateAsText;
  const timeStamp = Math.floor(new Date(dateAsText).getTime() / 1000);

  sessionStorage.setItem("fromId", fromId);
  sessionStorage.setItem("toId", toId);
  sessionStorage.setItem("dateAsText", dateAsText);
  sessionStorage.setItem("timeAsText", timeAsText);
  sessionStorage.setItem("pax", pax);
  sessionStorage.setItem("appDate", appDate);
  sessionStorage.setItem("timeStamp", timeStamp);

  window.location.href = `/search-result.html`;
});
