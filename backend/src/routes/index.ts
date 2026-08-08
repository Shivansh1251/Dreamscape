import { Router } from "express";

import itineraryRoute from "./itinerary.route";
import weatherTripRoute from "./weatherTrip.route";
import crowdPredictionRoute from "./crowdPrediction.route";
import packingChecklistRoute from "./packingChecklist.route";
import visaSummaryRoute from "./visaSummary.route";
import expenseSplitterRoute from "./expenseSplitter.route";
import foodRecommendationsRoute from "./foodRecommendations.route";
import photoSpotsRoute from "./photoSpots.route";
import tripSummarizerRoute from "./tripSummarizer.route";
import routeOptimizationRoute from "./routeOptimization.route";
import safetyAlertsRoute from "./safetyAlerts.route";
import hotelComparisonRoute from "./hotelComparison.route";
import reviewAnalysisRoute from "./reviewAnalysis.route";

const routes = Router();

// Register all AI feature routes
routes.use("/itinerary", itineraryRoute);
routes.use("/weather-trip", weatherTripRoute);
routes.use("/crowd-prediction", crowdPredictionRoute);
routes.use("/packing-checklist", packingChecklistRoute);
routes.use("/visa-summary", visaSummaryRoute);
routes.use("/expense-splitter", expenseSplitterRoute);
routes.use("/food-recommendations", foodRecommendationsRoute);
routes.use("/photo-spots", photoSpotsRoute);
routes.use("/trip-summarizer", tripSummarizerRoute);
routes.use("/route-optimization", routeOptimizationRoute);
routes.use("/safety-alerts", safetyAlertsRoute);
routes.use("/hotel-compare", hotelComparisonRoute);
routes.use("/review-analysis", reviewAnalysisRoute);

export default routes;
