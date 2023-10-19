settimeData();
putListData(list);
putCountryData(list, 0);
putSiteData(list, 0, 0)
const searchBtn = document.querySelector(".seachField");
searchBtn.addEventListener("click", (event) => {
  event.preventDefault();
  fetchCardData();
});

function fetchCardData(){
  const area = doms.area.options[doms.area.selectedIndex].value;
  const country = doms.country.options[doms.country.selectedIndex].value;
  const site = doms.site.options[doms.site.selectedIndex].value;
  const time = doms.time.options[doms.time.selectedIndex].value+":00";
  console.log(area,country,site,time)
  /*country="桃園市"
  site="中壢"
  time="2023-10-19 22:00:00";*/
  const request = {
    data:{
      county: country,
      sitename: site,
      time: time,
    }
  };
  fetch("/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })
  .then((response) => {
    console.log(response);
    return response.json();
  })
  .then((jsonData) => {
    console.log(jsonData);
    setCardData(jsonData.data[0]);
    putCardData(data);
    })
  .catch((error) => {
    console.error(error);
  });
}

// 在頁面加載時調用
window.addEventListener("load", function () {
  fetchCardData();
});
doms.area.addEventListener("change", (e)=>{
  let index = e.target.selectedIndex;
  putCountryData(list, index);
})

doms.country.addEventListener("change", (e) => {
  let index2 = e.target.selectedIndex;
  let index1 = doms.area.selectedIndex;
  putSiteData(list, index1,index2);
});