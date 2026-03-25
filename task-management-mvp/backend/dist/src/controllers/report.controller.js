"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportController = void 0;
const report_service_1 = require("../services/report.service");
exports.reportController = {
    statusSummary: async (req, res, next) => {
        try {
            const result = await report_service_1.reportService.statusSummary(req.user);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    overdue: async (req, res, next) => {
        try {
            const result = await report_service_1.reportService.overdue(req.query, req.user);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    productivity: async (req, res, next) => {
        try {
            const result = await report_service_1.reportService.productivity(req.query, req.user);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    trend: async (req, res, next) => {
        try {
            const result = await report_service_1.reportService.trend(req.query, req.user);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
};
