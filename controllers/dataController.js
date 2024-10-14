import data from "../db/data.json" assert { type: "json" };

const getData = (req, res) => {
  try {
    res.json(data);
  } catch (err) {
    res.status(500).send("Error reading data");
  }
};

const getHome = (req, res) => {
  res.send("Hello, World!");
};

export { getData, getHome };
