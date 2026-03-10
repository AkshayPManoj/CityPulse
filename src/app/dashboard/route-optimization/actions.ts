"use server";

import {
  dynamicRouteOptimization,
  type DynamicRouteOptimizationOutput,
  type DynamicRouteOptimizationInput,
} from "@/ai/flows/dynamic-route-optimization";

type FormValues = {
  demandPredictions: string;
  cityEvents: string;
  currentTrafficConditions: string;
  existingRoutes: string;
};

export async function optimizeRoutesAction(
  values: FormValues
): Promise<DynamicRouteOptimizationOutput> {
  try {
    const parsedInput: DynamicRouteOptimizationInput = {
      demandPredictions: JSON.parse(values.demandPredictions),
      cityEvents: JSON.parse(values.cityEvents),
      currentTrafficConditions: JSON.parse(values.currentTrafficConditions),
      existingRoutes: JSON.parse(values.existingRoutes),
    };
    return await dynamicRouteOptimization(parsedInput);
  } catch (e) {
    console.error("JSON parsing error:", e);
    throw new Error("Invalid JSON format in one of the input fields.");
  }
}
