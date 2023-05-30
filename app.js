require("dotenv").config();
require("colors");
const {
  inquirerMenu,
  pause,
  readInput,
  listLocations,
} = require("./helpers/inquirer");
const Search = require("./models/search");

const main = async () => {
  const search = new Search();
  let opt = 0;

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        const searchTerm = await readInput("City: ");
        const locations = await search.city(searchTerm);
        const id = await listLocations(locations);

        if (id === "0") continue;

        const selectedLocation = locations.find(
          (location) => location.id === id
        );

        search.addHistory(selectedLocation.name);

        const weather = await search.locationWeather(
          selectedLocation.lat,
          selectedLocation.lon
        );
        console.clear();
        console.log("\nCity information\n".green);
        console.log("City:", selectedLocation.name.green);
        console.log("Lat:", selectedLocation.lat);
        console.log("Lon:", selectedLocation.lon);
        console.log("Temp:", weather.temp);
        console.log("Min:", weather.min);
        console.log("Max:", weather.max);
        console.log("How is the weather:", weather.desc.green);
        break;

      case 2:
        search.capitalizedHistory.forEach((loc, i) => {
          const index = `${i + 1}.`.green;
          console.log(`${index} ${loc}`);
        });
        break;
    }

    if (opt !== 0) await pause();
  } while (opt !== 0);
};

main();
