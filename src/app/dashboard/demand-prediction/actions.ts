"use server";

import {
  predictMobilityDemand,
  type DemandPredictionInput,
  type DemandPredictionOutput,
} from "@/ai/flows/demand-prediction-insights";

export async function predictDemandAction(
  values: DemandPredictionInput
): Promise<DemandPredictionOutput> {
  return await predictMobilityDemand(values);
}
