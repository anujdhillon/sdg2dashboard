import json

f = open('dists.json')
data = json.load(f)

states = open("states.txt")
states = states.read().split("\n")
# states = "\n".join(states)
# with open("states.txt", 'w') as f:
#     f.write(states)
state_id = {}
for i in range(len(states)):
    state_id[states[i]] = i+1

count = 1
for item in data["features"]:
    del item["properties"]["dt_cen_cd"]
    del item["properties"]["censuscode"]
    del item["properties"]["st_cen_cd"]
    item["properties"]["id"] = count
    count += 1
    item["properties"]["state_id"] = state_id[item["properties"]["st_nm"]]
    item["properties"]["name"] = item["properties"]["district"]
    del item["properties"]["district"]

with open("geo.json", "w") as outfile:
    json.dump(data, outfile)
