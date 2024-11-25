const fromId = sessionStorage.getItem("fromId");
const toId = sessionStorage.getItem("toId");
const dateAsText = sessionStorage.getItem("dateAsText");
const timeAsText = sessionStorage.getItem("timeAsText");
const pax = sessionStorage.getItem("pax");
const appDate = sessionStorage.getItem("appDate");
const timeStamp = sessionStorage.getItem("timeStamp");

const data = {
  "from airport id": fromId,
  "to airport id": toId,
  date_as_text: dateAsText,
  time_as_text: timeAsText,
  App_Out_Date_As_Text: appDate,
  pax: pax,
  date: timeStamp,
};

const wrapper = document.querySelector(".searchbody_wrapper");
const paginationWrapper = document.querySelector(".pagination");
const filterWrapper = document.querySelector(".left");
const searchInput = document.querySelector(".search input");

fetch("https://jettly.com/api/1.1/wf/webflow_one_way_flight", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
})
  .then((response) => response.json())
  .then((apiData) => {
    const aircraftSets = [];
    if (apiData.response) {
      for (const key in apiData.response) {
        if (key.startsWith("aircraft_set_")) {
          aircraftSets.push(...apiData.response[key]);
        }
      }
    }

    const itemsPerPage = 5;
    let currentPage = 1;
    let selectedFilters = [];
    let searchText = "";
    let filteredItems = [...aircraftSets];
    const totalPages = () => Math.ceil(filteredItems.length / itemsPerPage);

    const renderPage = (page) => {
      wrapper.innerHTML = "";
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const itemsToDisplay = filteredItems.slice(startIndex, endIndex);
      itemsToDisplay.forEach((item) => {
        wrapper.innerHTML += `
          <div class="item_wrapper">
            <div class="item_left">
              <img src="${item.exterior_image1_image}" alt="" />
            </div>
            <div class="item_right">
              <h2>${item.description_text}</h2>
            </div>
          </div>
        `;
      });
      renderPagination();
    };

    const renderPagination = () => {
      paginationWrapper.innerHTML = "";
      const pages = totalPages();
      for (let i = 1; i <= pages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = i === currentPage ? "active" : "";
        button.addEventListener("click", () => {
          currentPage = i;
          renderPage(currentPage);
        });
        paginationWrapper.appendChild(button);
      }
    };

    const applyFilters = () => {
      filteredItems = aircraftSets.filter((item) => {
        const matchesSearch = item.description_text
          .toLowerCase()
          .includes(searchText);
        const matchesFilter =
          selectedFilters.length === 0 ||
          selectedFilters.includes(item.class_text);
        return matchesSearch && matchesFilter;
      });
      currentPage = 1;
      renderPage(currentPage);
    };

    const renderFilters = () => {
      const classCounts = aircraftSets.reduce((acc, item) => {
        acc[item.class_text] = (acc[item.class_text] || 0) + 1;
        return acc;
      }, {});

      filterWrapper.innerHTML = "";
      Object.entries(classCounts).forEach(([classText, count]) => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = classText;
        checkbox.id = `filter-${classText}`;

        const label = document.createElement("label");
        label.htmlFor = `filter-${classText}`;
        label.textContent = `${classText} (${count})`;

        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            selectedFilters.push(classText);
          } else {
            selectedFilters = selectedFilters.filter(
              (filter) => filter !== classText
            );
          }
          applyFilters();
        });

        const div = document.createElement("div");
        div.appendChild(checkbox);
        div.appendChild(label);
        filterWrapper.appendChild(div);
      });
    };

    searchInput.addEventListener("input", (e) => {
      searchText = e.target.value.toLowerCase();
      applyFilters();
    });

    renderFilters();
    applyFilters();
  })
  .catch((error) => console.error("Error:", error));
