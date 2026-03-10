'use server';
/**
 * @fileOverview This file defines a Genkit flow for the Citizen Multi-Modal Journey Planner.
 * It provides personalized, optimized multi-modal journey suggestions based on real-time conditions and user accessibility needs.
 *
 * - citizenMultiModalJourney - The main function to calculate multi-modal journey options.
 * - CitizenMultiModalJourneyInput - The input type for the journey planning function.
 * - CitizenMultiModalJourneyOutput - The output type representing suggested journey options.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CitizenMultiModalJourneyInputSchema = z.object({
  startLocation: z.string().describe('The starting point for the journey (e.g., address, coordinates, landmark).'),
  endLocation: z.string().describe('The destination for the journey (e.g., address, coordinates, landmark).'),
  accessibilityNeeds: z.array(z.enum(['wheelchair_friendly', 'audio_navigation', 'minimal_walking', 'stroller_friendly', 'low_vision_support']))
    .optional()
    .describe('Specific accessibility requirements for the user, such as "wheelchair_friendly", "audio_navigation", or "minimal_walking".'),
  preferredModes: z.array(z.enum(['bus', 'shared_auto', 'cycle', 'walk', 'metro', 'taxi', 'ride_share']))
    .optional()
    .describe('Preferred modes of transport for the user, e.g., "bus", "shared_auto", "cycle".'),
  realTimeData: z.object({
    trafficCongestion: z.enum(['low', 'medium', 'high', 'severe']).describe('Current traffic congestion level.'),
    busOccupancy: z.enum(['empty', 'moderate', 'crowded', 'full']).describe('Current bus occupancy levels for public transport.'),
    eventCrowdDensity: z.enum(['none', 'low', 'medium', 'high', 'peak']).describe('Crowd density in event areas or major public gathering spots.'),
    roadClosures: z.array(z.string()).optional().describe('List of currently closed roads or routes that should be avoided.'),
    weatherConditions: z.string().describe('Current weather conditions (e.g., "clear", "rainy", "foggy", "hot").'),
  }).optional().describe('Real-time urban mobility data affecting journey planning.')
});
export type CitizenMultiModalJourneyInput = z.infer<typeof CitizenMultiModalJourneyInputSchema>;

const CitizenMultiModalJourneyOutputSchema = z.object({
  journeyOptions: z.array(z.object({
    id: z.string().describe('A unique identifier for this journey option.'),
    routeDescription: z.string().describe('A high-level description of the multi-modal journey chain (e.g., "Home -> shared auto -> bus -> cycle -> destination").'),
    steps: z.array(z.object({
      mode: z.string().describe('The mode of transport for this step (e.g., "walk", "bus", "shared_auto", "cycle", "metro", "taxi", "ride_share").'),
      instructions: z.string().describe('Detailed instructions for this specific step.'),
      durationMinutes: z.number().describe('Estimated duration of this step in minutes.'),
      costINR: z.number().optional().describe('Estimated cost for this step in Indian Rupees (INR), if applicable.'),
      carbonFootprintKgCO2: z.number().optional().describe('Estimated carbon footprint for this step in Kg CO2.'),
      accessibilityInfo: z.string().optional().describe('Specific accessibility notes or features for this step.'),
    })).describe('Detailed breakdown of each leg of the journey.'),
    totalDurationMinutes: z.number().describe('Total estimated duration of the entire journey in minutes.'),
    totalCostINR: z.number().optional().describe('Total estimated cost of the entire journey in Indian Rupees (INR).'),
    totalCarbonFootprintKgCO2: z.number().optional().describe('Total estimated carbon footprint of the entire journey in Kg CO2.'),
    comfortScore: z.number().min(1).max(5).describe('A comfort score for the journey (1-5, 5 being most comfortable).'),
    efficiencyScore: z.number().min(1).max(5).describe('An efficiency score for the journey (1-5, 5 being most efficient).'),
    isAccessible: z.boolean().describe('True if this journey option meets all specified accessibility needs, false otherwise.'),
    mobilityCredits: z.number().optional().describe('Estimated mobility credits awarded for this sustainable journey, based on the modes of transport used.'),
  })).describe('A list of optimized multi-modal journey options, ranked by various factors.')
});
export type CitizenMultiModalJourneyOutput = z.infer<typeof CitizenMultiModalJourneyOutputSchema>;

const journeyPlannerPrompt = ai.definePrompt({
  name: 'citizenMultiModalJourneyPrompt',
  input: { schema: CitizenMultiModalJourneyInputSchema },
  output: { schema: CitizenMultiModalJourneyOutputSchema },
  prompt: `You are CityPulse AI, an advanced multi-modal journey planner for urban environments, with a focus on Indian Tier-2 cities. Your goal is to provide citizens with personalized, optimized, and adaptive journey suggestions.

Generate 2-3 distinct multi-modal journey options from '{{{startLocation}}}' to '{{{endLocation}}}'. For each option, prioritize a balance of time, cost, carbon footprint, and comfort.

Consider the following user preferences and real-time conditions:

Start Location: {{{startLocation}}}
End Location: {{{endLocation}}}

{{#if accessibilityNeeds}}
Accessibility Needs: {{{accessibilityNeeds}}} - Ensure all suggested routes strictly adhere to these needs.
{{else}}
Accessibility Needs: None specified.
{{/if}}

{{#if preferredModes}}
Preferred Modes of Transport: {{{preferredModes}}} - Prioritize these modes where feasible, but also suggest efficient alternatives.
{{else}}
Preferred Modes of Transport: No specific preferences. Use the most efficient and sustainable modes available.
{{/if}}}

{{#if realTimeData}}
Real-time City Data:
  Traffic Congestion: {{{realTimeData.trafficCongestion}}}
  Bus Occupancy: {{{realTimeData.busOccupancy}}}
  Event Crowd Density: {{{realTimeData.eventCrowdDensity}}}
  {{#if realTimeData.roadClosures}}
  Road Closures: {{{realTimeData.roadClosures}}}
  {{else}}
  Road Closures: None.
  {{/if}}
  Weather Conditions: {{{realTimeData.weatherConditions}}}

Integrate this real-time data to dynamically adjust routes, avoid congested areas, and suggest comfortable options. For example, if bus occupancy is 'crowded', suggest alternatives or routes with less crowded buses.
{{else}}
No real-time data provided. Assume normal conditions.
{{/if}}

For each journey option, provide a clear 'routeDescription', a detailed list of 'steps' (including 'mode', 'instructions', 'durationMinutes', 'costINR', 'carbonFootprintKgCO2', and 'accessibilityInfo' if applicable), and summarize with 'totalDurationMinutes', 'totalCostINR', 'totalCarbonFootprintKgCO2', 'comfortScore' (1-5), 'efficiencyScore' (1-5), and 'isAccessible' (true/false).

Additionally, calculate and include 'mobilityCredits' for each journey option. This is a software-based incentive to encourage eco-friendly travel. The credits are based on the modes of transport used in the journey's steps. The total credits for a journey is the sum of credits from each step. Use the following point system for calculation:
- Walk ('walk'): 10 credits
- Cycle ('cycle'): 10 credits
- Bus ('bus'): 7 credits
- Metro ('metro'): 7 credits
- Shared Auto ('shared_auto'): 5 credits
- Ride Share ('ride_share'): 5 credits
- Taxi ('taxi'): 1 credit

Ensure that 'costINR', 'carbonFootprintKgCO2', and 'mobilityCredits' are numeric values; estimate them if precise data is unavailable. If an accessibility need is specified, 'isAccessible' must be true for qualifying routes, and 'accessibilityInfo' for relevant steps should highlight how it meets the need.
`,
});

const citizenMultiModalJourneyFlow = ai.defineFlow(
  {
    name: 'citizenMultiModalJourneyFlow',
    inputSchema: CitizenMultiModalJourneyInputSchema,
    outputSchema: CitizenMultiModalJourneyOutputSchema,
  },
  async (input) => {
    const {output} = await journeyPlannerPrompt(input);
    if (!output) {
      throw new Error('Failed to generate journey options.');
    }
    return output;
  }
);

export async function citizenMultiModalJourney(input: CitizenMultiModalJourneyInput): Promise<CitizenMultiModalJourneyOutput> {
  return citizenMultiModalJourneyFlow(input);
}
