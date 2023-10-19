window.addEventListener("load", function () {
  fetch("/", {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const jsonData = JSON.stringify(data);
      setData(jsonData);
    })
    .catch((error) => {
      console.error(error);
    });
});
//搜尋
const searchBtn = document.querySelector(".searchBtn");
searchBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const area = document.querySelector(".area").value;
  const country = document.querySelector(".country").value;
  const siteName = document.querySelector(".siteName").value;
  const time = document.querySelector(".time").value;
  const info = {
    area: area,
    county: country,
    siteName: siteName,
    time: time,
  };
  fetch(`/`, {
    method: "POST",
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
      setData(jsonData);
    })
    .catch((error) => {
      console.error(error);
    });
});

//下拉選單
function fetchDropdownData() {
  fetch("/api")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      putListData(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

// 在頁面加載時調用
window.addEventListener("load", function () {
  fetchDropdownData();
});
