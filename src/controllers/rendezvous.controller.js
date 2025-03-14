import { getRendezVousPrisParClient, 
         getDemandesEnAttenteParClient, 
         getDetailRendezVous, createRendezVous } from "../services/rendezvous.service.js";
import { createDemandeRendezVous } from "../services/demandeRendezVous.service.js";
import { createSuiviRendezVous, updateSuiviRendezVous } from "../services/suiviRendezVous.service.js";

export const getRendezVousClient = async (req, res) => {
    try {
      if (req.role !== 'client') {
        return res.status(403).json({ message: "Accès interdit. Seuls les clients peuvent accéder à cette ressource." });
      }
  
      const clientId = req.user._id;
  
      const rendezVousPris = await getRendezVousPrisParClient(clientId);
      const demandesEnAttente = await getDemandesEnAttenteParClient(clientId);
  
      res.status(200).json({ rendezVousPris, demandesEnAttente });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

export const getDetailRendezVousController = async (req, res) => {
    try {
      const { id } = req.params;
  
      const rendezVousDetails = await getDetailRendezVous(id);
      res.status(200).json(rendezVousDetails);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

export const CreerSuiviController = async (req, res) => {
    try {
      const { rendezVousId, etat, progression, descriptionTravaux, estimationSortie } = req.body;
  
      const suivi = await createSuiviRendezVous({ rendezVousId, etat, progression, descriptionTravaux, estimationSortie });
  
      res.status(200).json(suivi);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

export const CreateDemandeRendezVous = async (req, res) => {
    const { client, date, service, modeleVehicule, demandeSpecifique, rendezVous } = req.body;

    if (!client || !date || !service || !modeleVehicule) {
      return res.status(400).json({ message: 'Les champs client, date, service, et modeleVehicule sont requis.' });
    }

    try {
        const data = {client, date, service, modeleVehicule, demandeSpecifique, rendezVous };
        const nouvelleDemande = await createDemandeRendezVous(data);
        return res.status(201).json({ message: 'Service créé avec succès', demande: nouvelleDemande });
    } catch (error) {
      console.error('Erreur lors de la demande de rendez-vous :', error);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

export const CreateRendezVous = async (req, res) => {
    const { demandeRendezVous, date, dureeJour, mecanicien, factureModelName} = req.body;
    if (!demandeRendezVous || !date || !dureeJour || !mecanicien) {
      return res.status(400).json({ message: 'Veuillez remplir les champs requis.' });
    }
    try {
      const data = {demandeRendezVous, date, dureeJour, mecanicien, factureModelName };
      const rdv = await createRendezVous(data);
      return res.status(201).json({ message: 'Rendez-Vous créé avec succès', rendezVous: rdv });
    } catch (error) {
      console.error('Erreur lors de la creation de rendez-vous :', error);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

export const UpdateSuiviRendezVousController = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
      const updatedSuiviRendezVous = await updateSuiviRendezVous(id, updateData);
      res.status(200).json(updatedSuiviRendezVous);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};
