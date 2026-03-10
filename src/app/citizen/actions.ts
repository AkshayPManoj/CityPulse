"use server";

import {
  citizenMultiModalJourney,
  type CitizenMultiModalJourneyInput,
  type CitizenMultiModalJourneyOutput,
} from "@/ai/flows/citizen-multi-modal-journey";

export async function generateCitizenJourney(
  input: CitizenMultiModalJourneyInput
): Promise<CitizenMultiModalJourneyOutput> {
  // Add mock real-time data for demonstration
  const fullInput: CitizenMultiModalJourneyInput = {
    ...input,
    realTimeData: {
      trafficCongestion: "medium",
      busOccupancy: "moderate",
      eventCrowdDensity: "low",
      weatherConditions: "clear",
    },
  };
  return await citizenMultiModalJourney(fullInput);
}
