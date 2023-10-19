window.addEventListener("load", function () {
  fetch("/api", {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const jsonData = JSON.stringify(data);
      setCardData(jsonData);
    })
    .catch((error) => {
      console.error(error);
    });
});
//搜尋
const searchBtn = document.querySelector(".searchBtn");
searchBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const area = document.querySelector("#ddl_Area");
  const country = document.querySelector("#ddl_County");
  const site = document.querySelector("#ddl_Site");
  const time = document.querySelector("#ddl_Time");
  const info = {
    //area: area,
    county: country,
    siteName: site,
    datacreationdate: time,
  };
  fetch(`/api`, {
    method: "PUT",
    body: JSON.stringify(info),
    headers: new Headers({
      "content-type": "application/json",
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const jsonData = JSON.stringify(data);
      setCardData(jsonData);
    })
    .catch((error) => {
      console.error(error);
    });
});

//下拉選單
function fetchDropdownData() {
  fetch("/")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setListData(jsonData, 0);
    })
    .catch((error) => {
      console.error(error);
    });
}

// 在頁面加載時調用
window.addEventListener("load", function () {
  fetchDropdownData();
});
