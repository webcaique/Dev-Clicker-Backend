const { pool } = require("./connectbd");

async function testConnection(){
    try {
        const result = await pool.query("SELECT NOW()");
        console.log("CONECTADO: ", result.rows[0]);
    } catch(error) {
        console.error("ERROR CONNECTION: ", error);
    } finally {
        await pool.end();
    }
}

const createPlayer = async (name) => {
    const query = `
    INSERT INTO players (name, points)
    VALUES ($1, $2)
    RETURNING *
    `;
    const values = [name, "0"];

    const res = await pool.query(query, values)
    .then(res => res.rows[0])
    .catch(error => {
        console.log("ERROR CREATE PLAYER", error);
        return {error: "Erro ao postar o player"};
    });

    return res;
}

const getAll = async () => {
    const res = await pool.query("SELECT * FROM players;")
    .then(res => res.rows)
    .catch(err => {
        console.error("ERRO GET ALL PLAYERS:\n", err);
        return {error: "Erro ao coletar todos os players"};
    });

    return res;
}

const patchPoints = async (id, points) => {
    const query = `
        UPDATE players
        SET points = $1
        WHERE id = $2
        RETURNING *;`;
    
    const values = [points.toString(), id];

    const res = await pool
        .query(query, values)
        .then(res => res.rows[0])
        .catch( err =>{
            console.error("ERROR PATCH POINTS QUERY: ", err);
            return {error: "Erro ao atualizar o player"}
        });

    return res;
    
}

const getPlayer = async (id) => {
    const query = `
        SELECT * FROM players WHERE id=$1;
    `;

    const res = await pool.query(query, [id])
    .then(res => res.rows[0])
    .catch(err => {
        console.error("ERROR GET PLAYER:\n",err);
        return {error: "Erro ao coletar o player"};
    });
    return res;
}

const deletePlayer = async (id) => {
    const query = `
        DELETE FROM players
        WHERE id = $1;
    `

    const res = await pool.query(query, [id])
    .then(res => { return {message: "Deletado com sucesso!"}})
    .catch(err => {
        console.error("ERROR DELETE PLAYER:\n",err);
        return {error: "Erro ao deletar o player"}
    });

    return res;
}
module.exports = {createPlayer, getAll, patchPoints, getPlayer, testConnection, deletePlayer};