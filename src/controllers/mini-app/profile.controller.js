import {
  getProfileInfoService,
  getListOfWorkAssignmentsService,
  decodeLocationByTokenService,
  getAttendanceLocationService,
  getAttendanceTypeService,
} from "../../services/mini-app/profile.service.js";
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

export const getLocationByUserTokenController = async (req, res) => {
  try {
    const { locationToken } = req.body;
    const { accessToken } = req.body;
    // Call service to decode location by token
    const result = await decodeLocationByTokenService(locationToken, accessToken);
    res.json(result);
  } catch (error) {
    logger.error(`[${req.id}] Error in getLocationByUserTokenController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getAttendanceLocationController = async (req, res) => {
  try {
    const result = await getAttendanceLocationService();
    res.json(result);
  } catch (error) {
    logger.error(`[${req.id}] Error in getAttendanceLocationController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getAttendanceTypeController = async (req, res) => {
  try {
    const result = await getAttendanceTypeService();
    res.json(result);
  } catch (error) {
    logger.error(`[${req.id}] Error in getAttendanceTypeController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};
