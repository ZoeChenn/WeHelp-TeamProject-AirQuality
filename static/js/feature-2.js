// html元素
const doms={
    data:{
        site: document.querySelector("#site"),
        pollutant: document.querySelector("#POLLUTANT"),
        aqicondition: document.querySelector(".AQIcondition"),
        aqi: document.querySelector("#AQI"), 
        avpm25: document.querySelector("#AVPM25"),
        avpm10: document.querySelector("#AVPM10"),
        avo3: document.querySelector("#AVO3"),
        avco: document.querySelector("#AVCO"),
        so2: document.querySelector("#SO2"),
        no2: document.querySelector("#NO2"),
        pm25: document.querySelector("#PM25"),
        pm10: document.querySelector("#PM10"),
        o3: document.querySelector("#O3"),
        co: document.querySelector("#CO"),
        nmhc: document.querySelector("#NMHC"),
        ws: document.querySelector("#WS_HR"),
        wd: document.querySelector("#WD_HR"),
        rh: document.querySelector("#RH"),
    },
    aqibox: document.querySelector(".AQIbox"),
    aqbox: document.querySelectorAll(".AQBox"),
    area: document.querySelector("#ddl_Area"),
    country: document.querySelector("#ddl_County"),
    site: document.querySelector("#ddl_Site"),
    time: document.querySelector("#ddl_Time"),
};
// 空氣品質分級數據
const level={
    aqi: {
        purple: 300,
        red: 200, 
        orange: 150,
        yellow: 100,
        green: 50,
    },
    avpm25: {
        purple: 250.4,
        red: 150.4, 
        orange: 54.4,
        yellow: 35.4,
        green: 15.4,
    },
    avpm10: {
        purple: 424,
        red: 354, 
        orange: 254,
        yellow: 100,
        green: 50,
    },
    avo3: {
        purple: 200,
        red: 105, 
        orange: 85,
        yellow: 70,
        green: 54,
    },
    avco: {
        purple: 30.4,
        red: 15.4, 
        orange: 12.4,
        yellow: 9.4,
        green: 4.4,
    },
    so2: {
        purple: 604,
        red: 304, 
        orange: 185,
        yellow: 75,
        green: 20,
    },
    no2:{
        purple: 1249,
        red: 649, 
        orange: 360,
        yellow: 100,
        green: 30,
    },
}
// 卡片的資料
let data={};
// 下拉選單的資料
let list={
    "area":["北部", "中部", "南部", "東部", "外島"],
    "country":[],
    "site":[],
    "time":[],
};
// 測試用
/*let jsondata1={
    "data": [
        {
        "county": "台中", "sitename": ["1", "2", "3"]
        },
        {
        "county": "台南", "sitename": ["4", "5", "6"]
        },
    ]
};
let jsondata2={
    "sitename": "桃園",
    "county": "桃園市",
    "aqi": "93",
    "pollutant": "臭氧八小時",
    "status": "普通",
    "so2": "0.7",
    "co": "0.45",
    "o3": "64.6",
    "o3_8hr": "69.0",
    "pm10": "32",
    "pm2.5": "18",
    "no2": "13.5",
    "nox": "14",
    "no": "0.4",
    "windspeed": "3.1",
    "winddirec": "61",
    "datacreationdate": "2023-10-16 19:00",
    "unit": "",
    "co_8hr": "0.3",
    "pm2.5_avg": "18.9",
    "pm10_avg": "34",
    "so2_avg": "0",
    "longitude": "121.30500531",
    "latitude": "24.9947107",
    "siteid": "17",
};*/

/** 
 * 設定list中的資料
 * @param {Object} jsonData 後端傳送的json物件
 */
function setListData( jsondata){
    let now = new Date().getTime();
    let time = new Date();

    for(let i=0; i < jsondata["data"].length; i++){
        list["country"][i] = jsondata["data"][i]["county"];
        let temp=[];
        for(let j=0; j < jsondata["data"][i]["sitename"].length; j++){
            temp[j] = jsondata["data"][i]["sitename"][j];
        }
        list["site"][i] = temp;
    }
    for(let i=0; i < 24; i++){
        time.setTime(now-3600000*i);
        if(time.getMonth()+1<10){
            list["time"][i] = time.getFullYear().toString() + "-" + "0" + (time.getMonth()+1).toString() + "-" + time.getDate().toString() + " " + time.getHours().toString() + ":00";
        }
        else{
            list["time"][i] = time.getFullYear().toString() + "-" + (time.getMonth()+1).toString() + "-" + time.getDate().toString() + " " + time.getHours().toString() + ":00";
        }
    }
}
/** 
 * 將list中的內容更新至畫面
 * @param {Object} list 下拉選單的資料
 * @param {Number} index 目前選中縣市在list中的index
 */
function putListData(list, index){
    // console.log(list);
    doms.area.innerHTML="";
    for(let i=0; i<list["area"].length; i++){
        let option = document.createElement("option");
        option.textContent = list["area"][i];
        doms.area.appendChild(option);
    }
    doms.country.innerHTML="";
    for(let i=0; i<list["country"].length; i++){
        let option = document.createElement("option");
        option.textContent = list["country"][i];
        option.dataset.index = i;
        if(i==index){
            option.selected = true;
        }
        doms.country.appendChild(option);
    }
    doms.site.innerHTML="";
    for(let i=0; i<list["site"][index].length; i++){
        let option = document.createElement("option");
        option.textContent = list["site"][index][i];
        doms.site.appendChild(option);
    }
    doms.time.innerHTML="";
    for(let i=0; i<list["time"].length; i++){
        let option = document.createElement("option");
        option.textContent = list["time"][i];
        doms.time.appendChild(option);
    }
}
/**
 * 設定.AQIbox或.AQBox的顏色
 * @param {String} type 資料的名稱
 * @param {Object} element 要設定的html元素
 * @param {String} box_class "AQIbox" or "AQBox"
 */
function setCardColor( type, element, box_class){
    if(parseFloat(data[type]) > level[type].purple){
        element.className = box_class +" bor-left-brown";
    }else if(parseFloat(data[type]) > level[type].red){
        element.className = box_class +" bor-left-purple";
    }else if(parseFloat(data[type]) > level[type].orange){
        element.className = box_class +" bor-left-red";
    }else if(parseFloat(data[type]) > level[type].yellow){
        element.className = box_class +" bor-left-orange";
    }else if(parseFloat(data[type]) > level[type].green){
        element.className = box_class +" bor-left-yellow";
    }else if(parseFloat(data[type]) > 0){
        element.className = box_class +" bor-left-green";
    }else{
        element.className = box_class;
    }
}
/**
 * 設定data中的資料
 * @param {Object} jsondata 後端傳送的json物件
 */
function setCardData(jsondata) {
    data={
        site: jsondata["sitename"],
        pollutant: "指標污染物 : " + jsondata["pollutant"],
        aqicondition: jsondata["status"],
        aqi: jsondata["aqi"], 
        avpm25: jsondata["pm2.5_avg"],
        avpm10: jsondata["pm10_avg"],
        avo3: jsondata["o3_8hr"],
        avco: jsondata["co_8hr"],
        so2: jsondata["so2"],
        no2: jsondata["no2"],
        pm25: jsondata["pm2.5"],
        pm10: jsondata["pm10"],
        o3: jsondata["o3"],
        co: jsondata["co"],
        nmhc: null,
        ws: jsondata["windspeed"],
        wd: jsondata["winddirec"],
        rh: null,
    };
    //console.log(data);
    setCardColor( "aqi", doms.aqibox, "AQIbox");
    setCardColor( "avpm25", doms.aqbox[0], "AQBox");
    setCardColor( "avpm10", doms.aqbox[1], "AQBox");
    setCardColor( "avo3", doms.aqbox[2], "AQBox");
    setCardColor( "avco", doms.aqbox[3], "AQBox");
    setCardColor( "so2", doms.aqbox[4], "AQBox");
    setCardColor( "no2", doms.aqbox[5], "AQBox");
}
/**
 * 將data中的資料更新至畫面
 * @param {Object} data 
 */
function putCardData(data){
    for(let key in data){
        doms.data[key].textContent = data[key];
    }
}
// 測試用
// setListData(jsondata1);
// putListData(list, 0);
// setCardData(jsondata2);
// putCardData(data);