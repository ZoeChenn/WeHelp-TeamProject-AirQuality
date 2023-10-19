window.addEventListener("load", function () {
  const area = "北部";
  const requestData = {
    area: area,
  };
  const county = "新北市";
  const time = "2023-10-10 17:00:00";
  const sitename = "新北(樹林)";
  const request = {
    area: area,
    county: county,
    sitename: sitename,
    datacreationdate: time,
  };

  fetch("/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((listData) => {
      setListData(listData, 0);
      putListData(list);

      return fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
    })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((jsonData) => {
      console.log(jsonData);
      setCardData(jsonData);
      putCardData(data);
    })
    .catch((error) => {
      console.error(error);
    });
});

//搜尋
const searchBtn = document.querySelector(".seachField");
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
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify(info),
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
  const area = document.querySelector("#ddl_Area");
  const requestData = {
    area: area,
  };
  fetch("/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => {
      return response.json();
    })
    .then((jsondata) => {
      setListData(jsondata, 0);
    })
    .catch((error) => {
      console.error(error);
    });
}

// 在頁面加載時調用
window.addEventListener("load", function () {
  fetchDropdownData();
});
