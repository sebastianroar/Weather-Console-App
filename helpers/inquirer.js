const inquirer = require("inquirer");
require("colors");

const menuOpts = [
  {
    type: "list",
    name: "option",
    message: "What would you like to do?",
    choices: [
      {
        value: 1,
        name: `${"1.".green} Search city`,
      },
      {
        value: 2,
        name: `${"2.".green} History`,
      },
      {
        value: 0,
        name: `${"0.".green} Exit`,
      },
    ],
  },
];

const inquirerMenu = async () => {
  console.clear();
  console.log("=============================".blue);
  console.log("      Select an option".white);
  console.log("=============================\n".blue);

  const { option } = await inquirer.prompt(menuOpts);
  return option;
};

const pause = async () => {
  const question = [
    {
      type: "input",
      name: "pause",
      message: `Press ${"ENTER".green} to continue`,
    },
  ];

  console.log(`\n`);
  await inquirer.prompt(question);
};

const readInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        return value.length === 0 ? "Please enter a value" : true;
      },
    },
  ];

  const { desc } = await inquirer.prompt(question);
  return desc;
};

const listLocations = async (locations = []) => {
  const choices = locations.map((location, idx) => {
    const index = `${idx + 1}.`.green;
    return {
      value: location.id,
      name: `${index} ${location.name}`,
    };
  });

  choices.unshift({
    value: "0",
    name: "0.".green + " Cancel",
  });

  const questions = [
    {
      type: "list",
      name: "id",
      message: "Select location:",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(questions);
  return id;
};

const confirm = async (message) => {
  const question = [
    {
      type: "confirm",
      name: "ok",
      message,
    },
  ];
  const { ok } = await inquirer.prompt(question);
  return ok;
};

const showListCheckList = async (tasks = []) => {
  const choices = tasks.map((task, i) => {
    const index = `${i + 1}.`.green;
    return {
      value: task.id,
      name: `${index} ${task.desc}`,
      checked: task.completionDate ? true : false,
    };
  });

  const questions = [
    {
      type: "checkbox",
      name: "ids",
      message: "Selection",
      choices,
    },
  ];

  const { ids } = await inquirer.prompt(questions);
  return ids;
};

module.exports = {
  inquirerMenu,
  pause,
  readInput,
  listLocations,
  confirm,
  showListCheckList,
};
