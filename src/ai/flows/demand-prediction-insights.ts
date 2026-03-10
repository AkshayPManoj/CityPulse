'use server';
/**
 * @fileOverview This file implements a Genkit flow for predicting future mobility demand in urban areas.
 * It takes historical and real-time context to forecast demand, identify peak hours and potential congestion.
 *
 * - predictMobilityDemand - A function that handles the mobility demand prediction process.
 * - DemandPredictionInput - The input type for the predictMobilityDemand function.
 * - DemandPredictionOutput - The return type for the predictMobilityDemand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DemandPredictionInputSchema = z.object({
  contextDescription: z.string().describe('A summary of current real-time urban conditions, including events, weather, or recent observations relevant to mobility.'),
  historicalTrendsSummary: z.string().describe('A summary of historical mobility patterns, common commute times, and past event impacts for the target area and time.'),
  targetArea: z.string().describe('The specific urban area or zone (e.g., "College area", "Downtown Market") for which mobility demand prediction is requested.'),
  targetDateTime: z.string().describe('The specific date and time (ISO 8601 format) for which the mobility demand prediction is needed.'),
});
export type DemandPredictionInput = z.infer<typeof DemandPredictionInputSchema>;

const DemandPredictionOutputSchema = z.object({
  predictedDemandLevel: z.string().describe('A descriptive level of predicted mobility demand for the target area and time (e.g., "High", "Moderate", "Very High").'),
  predictedDemandImpact: z.string().describe('A quantitative or qualitative statement of the expected impact of the demand (e.g., "400 extra passengers expected", "significant increase in vehicle traffic").'),
  peakHours: z.array(z.string()).describe('An array of predicted peak hours or time windows (e.g., ["16:00-17:00", "18:30-19:30"]).'),
  congestionAreas: z.array(z.string()).describe('An array of specific locations or routes within the target area that are likely to experience congestion.'),
  reasoning: z.string().describe('A brief explanation of the factors contributing to the predicted demand and potential congestion.'),
  proactiveSuggestions: z.array(z.string()).describe('Actionable suggestions for city authorities to manage the predicted demand and mitigate congestion (e.g., "Deploy temporary shuttle buses", "Adjust traffic light timings").'),
});
export type DemandPredictionOutput = z.infer<typeof DemandPredictionOutputSchema>;

export async function predictMobilityDemand(input: DemandPredictionInput): Promise<DemandPredictionOutput> {
  return demandPredictionFlow(input);
}

const demandPredictionPrompt = ai.definePrompt({
  name: 'predictMobilityDemandPrompt',
  input: { schema: DemandPredictionInputSchema },
  output: { schema: DemandPredictionOutputSchema },
  prompt: `You are the "AI Mobility Intelligence Engine" for CityPulse AI, specializing in predicting urban mobility demand for city authorities. Your goal is to provide accurate, actionable insights to prevent urban gridlock and optimize resource allocation.\n\nGiven the following information, predict the mobility demand for the specified target area and time. Identify potential peak hours, congestion areas, and provide concrete, proactive suggestions.\n\nCurrent urban context: {{{contextDescription}}}\nHistorical mobility trends for the area: {{{historicalTrendsSummary}}}\n\nTarget Area: {{{targetArea}}}\nTarget Date and Time: {{{targetDateTime}}}\n\nBased on this data, provide a detailed prediction in the specified JSON format. The predictedDemandImpact should give a concrete example like "400 extra passengers expected" or "significant increase in vehicle traffic".`,
});

const demandPredictionFlow = ai.defineFlow(
  {
    name: 'demandPredictionFlow',
    inputSchema: DemandPredictionInputSchema,
    outputSchema: DemandPredictionOutputSchema,
  },
  async (input) => {
    const { output } = await demandPredictionPrompt(input);
    if (!output) {
      throw new Error('Failed to get a prediction from the AI model.');
    }
    return output;
  }
);
