import os
from dotenv import load_dotenv
from flask import *
from flask_apscheduler import APScheduler
import requests
from datetime import datetime, timedelta
import time

load_dotenv()
dc_bot = os.getenv("DC_API")
dc_inv = os.getenv("INVITE")
gov_url = os.getenv("GOV_URL")

app = Flask(__name__, static_folder="static", static_url_path="/")
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["JSON_SORT_KEYS"] = False

scheduler = APScheduler()
scheduler.init_app(app)
# scheduler 添加至 flask

@scheduler.task("cron",id="api_daily",hour="*/8")
def aqi_daily():
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    pre_time = (datetime.now() - timedelta(hours=1)).strftime("%Y-%m-%d %H:%M:%S")
    response = requests.get(
        url=f"{gov_url}&filters=status,EQ,對敏感族群不健康,對所有族群不健康,非常不健康,危害"
        f"|datacreationdate,GT,{pre_time}|datacreationdate,LE,{current_time}"
    )
    response = response.json()
    response = response.get("records")
    dc_post(response)


def dc_post(data):
    info_list = []
    for i in data:
        info = {
            "sitename": i.get("sitename"),
            "county": i.get("county"),
            "status": i.get("status"),
            "aqi": i.get("aqi"),
            "pm2.5": i.get("pm2.5"),
            "pm10": i.get("pm10"),
            "datacrateiondate": i.get("datacrateiondate"),
        }
        info_list.append(info)

    for i in info_list:
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        match i.get("status"):
            case "對敏感族群不健康":
                color_number = 16744192
            case "對所有族群不健康":
                color_number = 16720896
            case "非常不健康":
                color_number = 8388736
            case "危害":
                color_number = 9849600
        body = {
            "username": "空氣品質發佈機器人",
            "avatar_url": "https://leo145x.github.io/icon/robot.png",
            "embeds": [
                {
                    "author":{
                        "name" : "Push Robot",
                        "url" : "https://leo145x.github.io/icon/robot.png",
                        "icon_url" : "https://leo145x.github.io/icon/robot.png",
                    },
                    "title": f"{i.get('county')}{i.get('sitename')}地區的空氣品質報告",
                    "url" :"http://13.54.167.9:3000/index.html",
                    "description": f"偵測時間: {current_time}",
                    "color": color_number,
                    "fields": [
                        {
                            "name": "空氣品質狀態",
                            "value": f"{i.get('status')}"
                        },
                        {
                            "name" : "空氣品質指標 (AQI)",
                            "value" : f"{i.get('aqi')}",
                            "inline" : True
                        },
                        {
                            "name": "細懸浮微粒 PM 2.5",
                            "value": f"{i.get('pm2.5')}",
                            "inline": True
                        },
                        {
                            "name": "懸浮微粒PM 10", 
                            "value": f"{i.get('pm10')}",
                            "inline": True
                        },
                        {
                            "name" : "提醒",
                            "value" : "此區域民眾出門建議配戴口罩 "
                        }
                    ],
                    "image":{
                        "url" : "https://leo145x.github.io/icon/cityAir.jpg"
                    },
                    "footer": {"text": "感謝你的注意"}
                }
            ]
        }
        requests.post(url=dc_bot, json=body)
        time.sleep(5)



@app.route("/api", method=["POST"])
def api():
    data = request.get_json()
    data = data.get("data")
    county = data.get("county")
    sitename = data.get("sitename")
    datacreationdate = data.get("time")

    # SiteName = "中壢"
    # county = "桃園市"
    # datacreationdate = "2023-10-10 13:00:00"

    ori_date = datetime.strptime(datacreationdate, "%Y-%m-%d %H:%M:%S")
    new_date = ori_date - timedelta(hours=1)
    pre_datacreationdate = new_date.strftime("%Y-%m-%d %H:%M:%S")

    data = requests.get(
        url=f"{gov_url}&filters=SiteName,EQ,{sitename}|county,EQ,{county}|"
        f"datacreationdate,GT,{pre_datacreationdate}|datacreationdate,LE,{datacreationdate}"
    )
    result = data.json()
    response = make_response({"data": result.get("records")})

    return response



@app.route("/", method=["POST"])
def index():
    north = [i for i in range(1, 28)] + [64, 65, 66, 67, 68, 70, 84, 311]
    central = [i for i in range(28, 39)] + [41, 69, 72, 83, 85, 201, 310]
    south = [i for i in range(42, 62) if i != 55] + [71, 202, 203, 204, 313]
    east = [62, 63, 80]
    out = [75, 77, 78]
    # siteid 對應的縣市分類
    data = request.get_json()
    data = data.get("area")

    match data:
        case "北部":
            north_str = ",".join(map(str, north))
            response = requests.get(url=f"{gov_url}&filters=siteid,EQ,{north_str}")
        case "中部":
            central_str = ",".join(map(str, central))
            response = requests.get(url=f"{gov_url}&filters=siteid,EQ,{central_str}")
        case "南部":
            south_str = ",".join(map(str, south))
            response = requests.get(url=f"{gov_url}&filters=siteid,EQ,{south_str}")
        case "東部":
            east_str = ",".join(map(str, east))
            response = requests.get(url=f"{gov_url}&filters=siteid,EQ,{east_str}")
        case "外島":
            out_str = ",".join(map(str, out))
            response = requests.get(url=f"{gov_url}&filters=siteid,EQ,{out_str}")
        case _:
            return make_response({"error":"wrong request"},404)
        
    # north_str = ",".join(map(str, north))
    # response = requests.get(url=f"{gov_url}&filters=siteid,EQ,{north_str}")

    response = response.json()
    response = response.get("records")
    dic = {}
    for i in response:
        county = i.get("county")
        sitename = i.get("sitename")
        if county not in dic:
            dic[county] = [sitename]
        else:
            if sitename not in dic[county]:
                dic[county].append(sitename)
    result = []
    for i in result.items():
        result.append({"county":i[0],"sitename":i[1]})
    # 資料處理，應該可以優化

    return make_response({"data":result})


@app.route("/comingsoon")
def coming_soon():
    return make_response("coming...soon...", 404)

scheduler.start()
app.run(host="0.0.0.0", port=3000)
