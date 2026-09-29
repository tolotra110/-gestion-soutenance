
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
    getUtilisateurByEmail,
    createUtilisateur
} = require("../models/utilisateurModel");


const login = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        if (!email || !mot_de_passe) {
            return res.status(400).json({
                message: "Email et mot de passe obligatoires"
            });
        }

        const utilisateur = await getUtilisateurByEmail(email);

        if (!utilisateur) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect"
            });
        }

        const passwordCorrect = await bcrypt.compare(
            mot_de_passe,
            utilisateur.mot_de_passe
        );

        if (!passwordCorrect) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect"
            });
        }

  
        const token = jwt.sign(
            {
                id_utilisateur: utilisateur.id_utilisateur,
                role: utilisateur.role,
                parcours: utilisateur.parcours
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Connexion réussie",
            token,
            utilisateur: {
                id_utilisateur: utilisateur.id_utilisateur,
                nom: utilisateur.nom,
                email: utilisateur.email,
                role: utilisateur.role,
                parcours: utilisateur.parcours
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Erreur serveur"
        });
    }
};


const register = async (req, res) => {
    try {
        const {
            nom,
            email,
            mot_de_passe,
            parcours
        } = req.body;


        if (!nom || !email || !mot_de_passe || !parcours) {
            return res.status(400).json({
                message: "Tous les champs sont obligatoires"
            });
        }

        const motDePasseHash = await bcrypt.hash(
            mot_de_passe,
            10
        );

        const utilisateur = await createUtilisateur(
            nom,
            email,
            motDePasseHash,
            parcours
        );

        res.status(201).json({
            message: "Utilisateur créé avec succès",
            utilisateur
        });

    } catch (error) {
        console.error(error);

        if (error.code === "23505") {
            return res.status(400).json({
                message: "Cet email existe déjà"
            });
        }

        res.status(500).json({
            message: "Erreur serveur"
        });
    }
};


module.exports = {
    login,
    register
};

