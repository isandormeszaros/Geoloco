var config = require("./dbconfig");
const mysql = require("mysql");
let pool = mysql.createPool(config);

// GET /api/locations - Az összes elérhető koordináta lekérdezése
async function selectLocation() {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM helyek.locations", (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
}

// GET /api/locations/:id - Koordináta lekérdezése azonosító alapján
async function selectLocationById(id) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM helyek.locations WHERE id = ?",
      [id],
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
}

// POST /api/locations - Új rekord hozzáadása a helyek tablához
async function insertLocation(data) {
  const { name, latitude, longitude, description} = data;

  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO helyek.locations (name, latitude, longitude, description, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [name, latitude, longitude, description],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
}

// DELETE /api/locations/:id - Rekord törlése a táblából
async function deleteLocation(id) {
    return new Promise((resolve, reject) => {
      pool.query(
        "DELETE FROM helyek.locations WHERE id = ?",
        [id],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });
  }

// PUT /api/locations/:id - Rekord módosítása a táblában
async function updateLocation(id, data) {
  const { name, latitude, longitude, description } = data;
  
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE helyek.locations SET name = ?, latitude = ?, longitude = ?, description = ?, updated_at = NOW() WHERE id = ?",
      [name, latitude, longitude, description, id],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
}

//GET /api/search/locations - Szűrés helyszín neve alapján
async function selectFilteredLocation(szur) {
  return new Promise((resolve, reject) => {
    pool.query(
    "SELECT * FROM helyek.locations WHERE name LIKE ?",
      [szur],
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
}

//GET /api/compound/search/locations - Szűrés több feltétel alapján
async function selectFilteredCompoundLocation({ latitude, longitude }) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM helyek.locations WHERE latitude = ? AND longitude = ?",
        [latitude, longitude],
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(elements);
        }
      );
    });
  }

  //GET /api/geolocation/locations - Szűrés bizonyos kör alapján
async function selectLocationByGeolocation(name, latitude, longitude) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM helyek.locations WHERE name = ?",
      [name],
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
}

module.exports = {
  selectLocation: selectLocation,
  selectLocationById: selectLocationById,
  insertLocation: insertLocation,
  deleteLocation: deleteLocation,
  updateLocation: updateLocation,
  selectFilteredLocation: selectFilteredLocation,
  selectFilteredCompoundLocation : selectFilteredCompoundLocation,
  selectLocationByGeolocation : selectLocationByGeolocation,
};
