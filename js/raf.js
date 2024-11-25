const limit = 50;
let currentPage = 1;
let allData = []; // Store all data for later filtering

async function fetchData(page) {
  const offset = (page - 1) * limit;

  const data = {
    "from airport id": sessionStorage.getItem("fromId"),
    "to airport id": sessionStorage.getItem("toId"),
    date_as_text: sessionStorage.getItem("dateAsText"),
    time_as_text: sessionStorage.getItem("timeAsText"),
    App_Out_Date_As_Text: sessionStorage.getItem("appDate"),
    pax: sessionStorage.getItem("pax"),
    date: sessionStorage.getItem("timeStamp"),
    limit: limit,
    offset: offset,
  };

  try {
    const response = await fetch(
      "https://jettly.com/api/1.1/wf/webflow_one_way_flight",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const apiData = await response.json();
    const receivedData = apiData.response.aircraft;

    // Store the fetched data globally for later filtering
    allData = receivedData;

    // Initial render of all data
    renderData(receivedData);

    console.log(allData);

    // Count the occurrences of each class_text value
    const classCounts = {};
    receivedData.forEach((element) => {
      classCounts[element.class_text] =
        (classCounts[element.class_text] || 0) + 1;
    });

    // Create checkboxes dynamically for each class_text value
    const checkContainer = document.querySelector(".check");
    checkContainer.innerHTML = "";
    for (const [classText, count] of Object.entries(classCounts)) {
      checkContainer.innerHTML += `<li><input type="checkbox" class="filter-checkbox" data-class-text="${classText}" /> ${classText} (${count})</li>`;
    }

    // Add event listener for checkbox change to filter the data
    const allCheckboxes = document.querySelectorAll(".filter-checkbox");
    allCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        filterData(); // Re-render data when a checkbox is clicked
      });
    });

    const totalItems = apiData.response.totalItems || receivedData.length;
    if (totalItems > limit) {
      updatePagination(totalItems, page);
    } else {
      document.querySelector(".pagination").innerHTML = "";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to filter data based on selected checkboxes
function filterData() {
  const checkedClassTexts = [];
  const checkboxes = document.querySelectorAll(".filter-checkbox:checked");
  checkboxes.forEach((checkbox) => {
    checkedClassTexts.push(checkbox.dataset.classText);
  });

  // Filter the data based on the checked class_text values
  let filteredData = allData;

  if (checkedClassTexts.length > 0) {
    filteredData = allData.filter((item) =>
      checkedClassTexts.includes(item.class_text)
    );
  }

  // Render the filtered data
  renderData(filteredData);
}

// Function to render the data to the DOM
function renderData(data) {
  const searchBodyWrapper = document.querySelector(".searchbody_wrapper");
  searchBodyWrapper.innerHTML = "";

  data.forEach((element) => {
    searchBodyWrapper.innerHTML += `
       <div class="item_wrapper">
          <div class="item_left">
             <img src="${element.exterior_image1_image}" alt="" />
          </div>
          <div class="item_right">
             <h2>${element.description_text}</h2>
             <p>class name : ${element.class_text}</p>
          </div>
       </div>
    `;
  });
}

// Function to update pagination
function updatePagination(totalItems, currentPage) {
  const totalPages = Math.ceil(totalItems / limit);
  const paginationContainer = document.querySelector(".pagination");

  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.className = i === currentPage ? "active" : "";
    button.onclick = () => {
      fetchData(i);
      currentPage = i;
    };
    paginationContainer.appendChild(button);
  }
}

// Fetch the data initially
fetchData(currentPage);
