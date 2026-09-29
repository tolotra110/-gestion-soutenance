
const pool = require("../Config/database");

const getAllUtilisateurs = async () => {
    const result = await pool.query(
        "SELECT * FROM utilisateurs ORDER BY id_utilisateur"
    );

    return result.rows;
};


const getUtilisateurById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM utilisateurs WHERE id_utilisateur = $1",
        [id]
    );

    return result.rows[0];
};


const getUtilisateurByEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM utilisateurs WHERE email = $1",
        [email]
    );

    return result.rows[0];
};


const createUtilisateur = async (
    nom,
    email,
    mot_de_passe,
    parcours
) => {
    const result = await pool.query(
        `INSERT INTO utilisateurs
        (nom, email, mot_de_passe, parcours)
        VALUES ($1, $2, $3, $4)
        RETURNING id_utilisateur, nom, email, role, parcours`,
        [nom, email, mot_de_passe, parcours]
    );

    return result.rows[0];
};

const updateUtilisateur = async (
    id,
    nom,
    email,
    parcours
) => {
    const result = await pool.query(
        `UPDATE utilisateurs
         SET nom = $1,
             email = $2,
             parcours = $3
         WHERE id_utilisateur = $4
         RETURNING id_utilisateur, nom, email, role, parcours`,
        [nom, email, parcours, id]
    );

    return result.rows[0];
};


const deleteUtilisateur = async (id) => {
    const result = await pool.query(
        "DELETE FROM utilisateurs WHERE id_utilisateur = $1 RETURNING *",
        [id]
    );

    return result.rows[0];
};

module.exports = {
    getAllUtilisateurs,
    getUtilisateurById,
    getUtilisateurByEmail,
    createUtilisateur,
    updateUtilisateur,
    deleteUtilisateur
};

