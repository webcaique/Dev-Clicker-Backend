const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const {
    createPlayer,
    getAll,
    patchPoints,
    getPlayer,
    deletePlayer
} = require("./query.js");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "API ONLINE 🚀" });
});

app.get("/get-all-players/", async (req, res) => {
    const data = await getAll();

    if(data?.error) return res.status(500).json(data.error);
    
    const dataWithoutId = data.map(({id, ...resto}) => resto);

    return res.status(200).json(dataWithoutId);
});

app.post("/init-player/", async (req, res) => {
    const response = await createPlayer(req.body.name);
    if(response?.error) return res.status(401).json(response.error);
    
    return res.status(200).json({...response});
});


app.patch("/patch-points/", async (req, res) => {
    const response = await patchPoints(req.body.id, req.body.points);
    if(response?.error) return res.status(500).json(response.error);

    return res.status(200).json({resposta: response});
});

app.get("/player/:id", async (req, res) => {
    const response = await getPlayer(req.params.id);
    if(response.rowCount == 0)
        return res.status(404).json({error:"Player não encontrado"});

    return res.status(200).json({resposta: response});
});

app.delete("/player-delete/", async (req, res) => {
    const response = await deletePlayer(req.body.id);

    if(response?.error) return res.status(500).json(response.error);

    return res.status(200).json({resposta: response});
});

app.get("/get-leaderboard", async (req,res) => {
    const players = await getAll();

    const sortPlayers = players.sort((a, b) => b.points - a.points).slice(0,10).map(({id, ...resto}) => resto);

    return res.status(200).json(sortPlayers);
})

app.listen(process.env.PORT || 3000);