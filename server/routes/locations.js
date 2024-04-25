var express = require("express");
var router = express.Router();
var db = require("../db/dboperations");

// GET /api/locations - Az összes elérhető koordináta lekérdezése
router.get("/locations", (req, res) => {
  db.selectLocation()
    .then((data) => {
      if (!data || data.length === 0) {
        res.status(404).json({ error: "Nem találhatók helyadatok" });
      } else {
        res.json(data);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Szerver hiba történt", error);
    });
});

// GET /api/locations/:id - Koordináta lekérdezése azonosító alapján
router.get("/locations/:id", (req, res) => {
  db.selectLocationById(req.params.id)
    .then((data) => {
      if (!data || data.length === 0) {
        res.status(404).json({ error: "Nem található helyadat" });
      } else {
        res.json(data[0]);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Szerver hiba történt", error);
    });
});

// POST /api/locations - Új rekord hozzáadása a helyek tablához
router.post("/locations", (req, res) => {
  db.insertLocation(req.body)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.log(req.body);
      console.log(error);
      res.status(500).send({ message: "Szerver hiba történt", error: error });
    });
});

// PUT /api/locations/:id - Rekord módosítása a táblában
router.put("/locations/:id", (req, res) => {
  db.updateLocation(req.params.id, req.body)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.error(error);
      res.json({ message: "Szerver hiba történt", error: error });
    });
});

// DELETE /api/locations/:id - Rekord törlése a táblából
router.delete("/locations/:id", (req, res) => {
  db.deleteLocation(req.params.id)
    .then((result) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Nincs ilyen rekord!");
      } else {
        res.json({
          success: true,
          message: "Helyadatok sikeresen töröölve",
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Szerver hiba történt", error: error });
    });
});

//GET /api/search/locations - Szűrés helyszín neve alapján
router.get("/search/locations", (req, res) => {
  let szur = "%" + req.query.keyword + "%";
  db.selectFilteredLocation(szur)
    .then((result) => {
      if (result.length === 0) {
        res.status(404).send("Nincs ilyen adat");
      } else {
        res.json(result);
      }
    })
    .catch((error) => {
      res.status(500).send("Hiba történt a szűrés során: " + error);
    });
});

//GET /api/compound/search/locations - Szűrés több feltétel alapján
router.get("/compound/search/locations", (req, res) => {
  const { latitude, longitude } = req.query;
  db.selectFilteredCompoundLocation({ latitude, longitude })
    .then((result) => {
      if (result.length === 0) {
        res.status(404).send("Nincs ilyen adat");
      } else {
        res.json(result);
      }
    })
    .catch((error) => {
      res.status(500).send("Hiba történt a szűrés során: " + error);
    });
});

//GET /api/geolocation/locations - Szűrés bizonyos kör alapján
router.get("/geolocation/locations", (req, res) => {
  const { name, latitude, longitude } = req.body;
  db.selectLocationByGeolocation(name, latitude, longitude)
    .then((result) => {
      if (result.length === 0) {
        res.status(404).send("Nincs ilyen adat");
      } else {
        const lon1 = (parseFloat(longitude) * Math.PI) / 180;
        const lat1 = (parseFloat(latitude) * Math.PI) / 180;
        const lon2 = (result[0].longitude * Math.PI) / 180;
        const lat2 = (result[0].latitude * Math.PI) / 180;
        const r = 6371; // Föld

        const havTheta =
          Math.pow(Math.sin((lat2 - lat1) / 2), 2) +
          Math.cos(lat1) *
            Math.cos(lat2) *
            Math.pow(Math.sin((lon2 - lon1) / 2), 2);
        const theta = 2 * Math.asin(Math.sqrt(havTheta));
        const d = theta * r;

        res.send(parseInt(Math.round(d)) + " km");
      }
    })
    .catch((error) => {
      res.status(500).send("Hiba történt a szűrés során: " + error);
    });
});

module.exports = router;
