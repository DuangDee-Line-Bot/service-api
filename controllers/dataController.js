import data from '../db/data.json' assert { type: "json" };

export const getData = (req, res) => {
    try {
        // Directly send the JSON data as a response
        res.json(data);
    } catch (err) {
        res.status(500).send("Error reading data");
    }
};

export const getHome = (req, res) => {
    res.send("Hello, World!");
};
