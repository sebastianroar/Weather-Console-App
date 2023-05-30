const fs = require("fs");
const axios = require("axios");

class Search {
  history = [];
  dbPath = "./db/database.json";

  constructor() {
    this.readDB();
  }

  get paramMapBox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      language: "en",
      limit: 5,
    };
  }

  get paramsWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
    };
  }

  get capitalizedHistory() {
    return this.history.map((loc) => {
      let words = loc.split(" ");
      words = words.map((word) => word[0].toUpperCase() + word.substring(1));
      return words.join(" ");
    });
  }

  async city(location = "") {
    try {
      // HTTP Request
      const instance = await axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json`,
        params: this.paramMapBox,
      });

      const resp = await instance.get();
      return resp.data.features.map((location) => ({
        id: location.id,
        name: location.place_name,
        lon: location.center[0],
        lat: location.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async locationWeather(lat, lon) {
    try {
      const instance = await axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
        params: { ...this.paramsWeather, lat, lon },
      });

      const resp = await instance.get();

      const { weather, main } = resp.data;

      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      console.log(error);
    }
  }

  addHistory(location = "") {
    if (this.history.includes(location.toLowerCase())) return;
    this.history.unshift(location.toLowerCase());
    this.saveDB();
  }

  saveDB() {
    const payload = {
      history: this.history,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readDB() {
    if (!fs.existsSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);
    console.log(data);
    this.history = data.history;
  }
}

module.exports = Search;
