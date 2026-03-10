'use server';
/**
 * @fileOverview An AI agent that dynamically recommends and generates optimal temporary public transport routes or service adjustments.
 *
 * - dynamicRouteOptimization - A function that handles the dynamic route optimization process.
 * - DynamicRouteOptimizationInput - The input type for the dynamicRouteOptimization function.
 * - DynamicRouteOptimizationOutput - The return type for the dynamicRouteOptimization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DynamicRouteOptimizationInputSchema = z.object({
  demandPredictions: z.array(
    z.object({
      location: z.string().describe('Geographic location or area, e.g., "College area", "Market district"'),
      time: z.string().describe('Specific time or time range, e.g., "4 PM", "Peak hours 7-9 AM"'),
      predictedPassengers: z.number().int().describe('Predicted number of additional passengers'),
      reason: z.string().optional().describe('Reason for the predicted demand, e.g., "start of college", "festival crowd"'),
    })
  ).describe('Forecasts of passenger demand at specific locations and times.'),
  cityEvents: z.array(
    z.object({
      name: z.string().describe('Name of the event, e.g., "Annual City Festival"'),
      type: z.enum(['festival', 'road_closure', 'sporting_event', 'other']).describe('Type of city event'),
      location: z.string().describe('Area affected by the event'),
      startTime: z.string().describe('Start time of the event'),
      endTime: z.string().describe('End time of the event'),
      impact: z.string().describe('Description of the event impact on mobility, e.g., "high pedestrian traffic", "road blocked"'),
    })
  ).describe('Details about ongoing or upcoming city events affecting mobility.'),
  currentTrafficConditions: z.array(
    z.object({
      segment: z.string().describe('Road segment or area affected, e.g., "Main Street between Oak and Elm"'),
      congestionLevel: z.enum(['low', 'medium', 'high', 'severe']).describe('Current congestion level of the road segment'),
    })
  ).describe('Real-time traffic data across various city segments.'),
  existingRoutes: z.array(
    z.object({
      routeId: z.string().describe('Unique identifier for the existing public transport route'),
      name: z.string().describe('Name or number of the route'),
      stops: z.array(z.string()).describe('List of key stops on the route'),
      scheduleSummary: z.string().describe('Summary of the route schedule, e.g., "every 15 mins from 6 AM to 10 PM"'),
      capacityEstimate: z.number().int().describe('Estimated capacity of vehicles on this route or average vehicle capacity'),
      coverageArea: z.string().optional().describe('Geographic area covered by the route'),
    })
  ).describe('Information about current public transport routes.'),
});
export type DynamicRouteOptimizationInput = z.infer<typeof DynamicRouteOptimizationInputSchema>;

const DynamicRouteOptimizationOutputSchema = z.object({
  recommendedRoutes: z.array(
    z.object({
      routeId: z.string().optional().describe('Unique ID for the new temporary route, if applicable (e.g., "T-001")'),
      purpose: z.string().describe('Reason for the temporary route, e.g., "Shuttle for XYZ Festival", "Peak hour relief for college area"'),
      startLocation: z.string().describe('Starting point of the temporary route'),
      endLocation: z.string().describe('Ending point of the temporary route'),
      keyStops: z.array(z.string()).describe('List of major stops along the temporary route'),
      estimatedDurationMinutes: z.number().int().describe('Estimated travel time for the temporary route in minutes'),
      justification: z.string().describe('Explanation of why this specific temporary route is recommended'),
    })
  ).describe('Suggested new temporary public transport routes.'),
  serviceAdjustments: z.array(
    z.object({
      routeId: z.string().describe('ID of the existing route to adjust'),
      type: z.enum(['increase_frequency', 'decrease_frequency', 'add_vehicles', 'divert_route', 'extend_service_hours', 'reduce_service_hours', 'add_new_stop', 'remove_stop']).describe('Type of adjustment to make'),
      details: z.string().describe('Specific details of the adjustment, e.g., "increase frequency by 50% between 4-6 PM", "add 2 additional buses"'),
      justification: z.string().describe('Explanation of why this service adjustment is recommended'),
    })
  ).describe('Suggested adjustments to existing public transport services.'),
  overallRecommendationSummary: z.string().describe('A comprehensive summary explaining the overall strategy, expected impact, and rationale behind all recommended changes.'),
});
export type DynamicRouteOptimizationOutput = z.infer<typeof DynamicRouteOptimizationOutputSchema>;

export async function dynamicRouteOptimization(
  input: DynamicRouteOptimizationInput
): Promise<DynamicRouteOptimizationOutput> {
  return dynamicRouteOptimizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dynamicRouteOptimizationPrompt',
  input: {schema: DynamicRouteOptimizationInputSchema},
  output: {schema: DynamicRouteOptimizationOutputSchema},
  prompt: `You are an expert city transport planner and an AI mobility intelligence engine.
Your task is to analyze real-time city conditions and demand predictions to recommend optimal temporary public transport routes or service adjustments.

Consider the following information:

### Demand Predictions:
{{{json demandPredictions}}}

### City Events:
{{{json cityEvents}}}

### Current Traffic Conditions:
{{{json currentTrafficConditions}}}

### Existing Public Transport Routes:
{{{json existingRoutes}}}

Based on the data provided, recommend temporary public transport routes and/or service adjustments to existing routes. The goal is to efficiently re-route vehicles, manage demand, prevent congestion, and ensure continuous service coverage.

Focus on practicality and impact. Provide a clear justification for each recommendation.`,
});

const dynamicRouteOptimizationFlow = ai.defineFlow(
  {
    name: 'dynamicRouteOptimizationFlow',
    inputSchema: DynamicRouteOptimizationInputSchema,
    outputSchema: DynamicRouteOptimizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the AI for route optimization.');
    }
    return output;
  }
);
