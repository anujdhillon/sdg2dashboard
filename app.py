# To add a new cell, type '# %%'
# To add a new markdown cell, type '# %% [markdown]'
# %%
import pandas as pd
import json
from flask import Flask, send_from_directory


# %%
app = Flask(__name__, static_url_path='', static_folder='build')
#cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.secret_key = 'aqswdefrgt'
TEMPLATES_AUTO_RELOAD = True

area = "Rajasthan"


@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')


@app.route("/readData", methods=["POST", "GET"])
@cross_origin()
def readData():
    data = {}
    targets = pd.read_excel("Data.xlsx", sheet_name="targetInfo")
    indicators = pd.read_excel("Data.xlsx", sheet_name="indicatorInfo")
    district_data = pd.read_excel("Data.xlsx", sheet_name="districtData")
    state_data = pd.read_excel("Data.xlsx", sheet_name="stateData")
    data["targets"] = []
    data["target_indices"] = {}
    data["district_indices"] = {}
    data["district_names"] = []
    data["state_indices"] = {}
    data["state_names"] = []
    data["infocus"] = {}
    data["state_map"] = json.load(open('IndiaMap.json'))
    data["district_map"] = json.load(open(area+"Map.json"))

    for i in range(len(district_data["District"])):
        data["district_indices"][district_data["District"][i]] = i
        data["district_names"].append(district_data["District"][i])

    for i in range(len(state_data["State"])):
        data["state_indices"][state_data["State"][i]] = i
        data["state_names"].append(state_data["State"][i])

    for i in range(len(targets["Targets"])):
        target_info = {}
        target_info["statement"] = targets["Target_Description"][i]
        target_info["number"] = targets["Targets"][i]
        target_info["motto"] = targets["Motto"][i]
        target_info["indicators"] = []
        data["targets"].append(target_info)
        data["target_indices"][targets["Targets"][i]] = i

    for i in range(len(indicators["Targets"])):
        k = data["target_indices"][indicators["Targets"][i]]
        indicator_info = {}
        indicator_info["number"] = indicators["Indicators"][i]
        indicator_info["values"] = {}
        indicator_info["values"]["state"] = []
        indicator_info["values"]["district"] = []
        for j in range(len(district_data[indicators["Indicators"][i]])):
            indicator_info["values"]["district"].append(
                [district_data[indicators["Indicators"][i]][j], j])
        for j in range(len(state_data[indicators["Indicators"][i]])):
            indicator_info["values"]["state"].append(
                [state_data[indicators["Indicators"][i]][j], j])
            if(state_data["State"][j] == area):
                data["infocus"][indicator_info["number"]
                                ] = state_data[indicators["Indicators"][i]][j]
        data["targets"][k]["indicators"].append(indicator_info)

    return json.dumps(data, indent=2)


# npm install
# npm start

if __name__ == '__main__':
    app.run(host="0.0.0.0")
