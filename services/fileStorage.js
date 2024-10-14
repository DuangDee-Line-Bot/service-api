const storageFile = "localStorage.json";

export const getStorage = () => {
    if (!fs.existsSync(storageFile)) return {}; // Return empty object if file doesn't exist
    try {
        const data = fs.readFileSync(storageFile, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading storage:", error.message);
        return {}; // Return empty object on error
    }
};

export const postStorage = (data) => {
    try {
        fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), "utf8");
    } catch (error) {
        console.error("Error writing to storage:", error.message);
    }
};
