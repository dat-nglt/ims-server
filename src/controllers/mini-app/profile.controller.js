import { getProfileInfoService, getListOfWorkAssignmentsService } from "../../services/mini-app/profile.service.js";
import logger from "../../utils/logger.js";

export const getProfileInfoController = async (req, res) => {
  try {
    const UID = req.params.UID;
    const result = await getProfileInfoService(UID);
    res.json(result);
  } catch (error) {
    logger.error(`[${req.id}] Error in getProfileInfoController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getListOfWorkAssignmentsController = async (req, res) => {
  try {
    const UID = req.params.UID;
    const result = await getListOfWorkAssignmentsService(UID);
    res.json(result);
  } catch (error) {
    logger.error(`[${req.id}] Error in getListOfWorkAssignmentsController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getListOfWorkAssignmentsInCurrentDayController = async (req, res) => {
  try {
    const UID = req.params.UID;
    const result = await getListOfWorkAssignmentsService(UID, true);
    res.json(result);
  } catch (error) {
    logger.error(`[${req.id}] Error in getListOfWorkAssignmentsController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};
