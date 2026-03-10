'use server';
/**
 * @fileOverview A Genkit flow for simulating the predicted impact of urban policy changes on city-wide mobility.
 *
 * - urbanPolicySimulator - A function that handles the urban policy impact simulation process.
 * - UrbanPolicySimulatorInput - The input type for the urbanPolicySimulator function.
 * - UrbanPolicySimulatorOutput - The return type for the urbanPolicySimulator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const UrbanPolicySimulatorInputSchema = z.object({
  policyDescription: z
    .string()
    .describe(
      'A detailed description of the urban policy change to be simulated, e.g., "implement a new bus-only corridor on Main Street from 8 AM to 6 PM", "designate the central market area as a car-free zone every Saturday", "simulate the impact of a large music festival near the stadium on traffic and public transport for a weekend."'
    ),
  currentCityState: z
    .string()
    .describe(
      'A summary of the current city conditions relevant to the simulation, including traffic levels, ongoing events, public transport status, or any other pertinent context.'
    ),
  durationHours: z
    .number()
    .optional()
    .describe(
      'The duration in hours for which the policy change should be simulated. Defaults to 24 hours if not provided.'
    ),
  affectedAreaDescription: z
    .string()
    .optional()
    .describe(
      'A description of the specific geographical area primarily affected by the policy change. E.g., "downtown core", "Main Street between Oak and Elm", "stadium district".'
    ),
});
export type UrbanPolicySimulatorInput = z.infer<
  typeof UrbanPolicySimulatorInputSchema
>;

// Output Schema
const UrbanPolicySimulatorOutputSchema = z.object({
  overallImpactSummary: z
    .string()
    .describe(
      'A concise summary of the overall predicted impact of the policy change on city-wide mobility.'
    ),
  impactDetails: z
    .array(
      z.object({
        metric: z
          .string()
          .describe(
            'The mobility metric affected (e.g., "Average Travel Time", "Public Transport Ridership", "Traffic Congestion Index", "Pedestrian Flow", "Carbon Emissions").'
          ),
        changeDirection: z
          .enum(['increase', 'decrease', 'no significant change'])
          .describe(
            'Whether the metric is expected to increase, decrease, or remain largely unchanged.'
          ),
        magnitude: z
          .string()
          .optional()
          .describe(
            'A qualitative or quantitative description of the magnitude of the change (e.g., "moderate", "significant", "+15%", "-10 minutes").'
          ),
        reason: z
          .string()
          .describe('Explanation for the predicted change in this metric.'),
      })
    )
    .describe('Detailed breakdown of predicted impacts on various key mobility metrics.').min(1),
  potentialChallenges: z
    .array(z.string())
    .describe(
      'List of potential challenges or negative externalities that might arise from implementing this policy.'
    ).min(1),
  mitigationStrategies: z
    .array(z.string())
    .describe(
      'Suggested strategies to mitigate potential challenges or optimize policy effectiveness.'
    ).min(1)
});
export type UrbanPolicySimulatorOutput = z.infer<
  typeof UrbanPolicySimulatorOutputSchema
>;

export async function urbanPolicySimulator(
  input: UrbanPolicySimulatorInput
): Promise<UrbanPolicySimulatorOutput> {
  return urbanPolicySimulatorFlow(input);
}

const urbanPolicySimulatorPrompt = ai.definePrompt({
  name: 'urbanPolicySimulatorPrompt',
  input: {schema: UrbanPolicySimulatorInputSchema},
  output: {schema: UrbanPolicySimulatorOutputSchema},
  prompt: `You are CityPulse AI, an advanced urban mobility intelligence platform. Your task is to act as a digital twin simulation engine for city planners.

Based on the provided urban policy change and current city conditions, simulate the predicted impact on city-wide mobility, traffic flow, public transport usage, pedestrian movement, and environmental factors. Provide a detailed analysis, including quantitative or qualitative estimations where possible.

Use the following information for your simulation:

Urban Policy Description: {{{policyDescription}}}
Current City State: {{{currentCityState}}}
{{#if durationHours}}Simulation Duration: {{durationHours}} hours{{/if}}
{{#if affectedAreaDescription}}Affected Area: {{{affectedAreaDescription}}}{{/if}}

Please output your findings in a structured JSON format, detailing the overall impact, specific metric changes, potential challenges, and mitigation strategies.`
});

const urbanPolicySimulatorFlow = ai.defineFlow(
  {
    name: 'urbanPolicySimulatorFlow',
    inputSchema: UrbanPolicySimulatorInputSchema,
    outputSchema: UrbanPolicySimulatorOutputSchema,
  },
  async input => {
    const {output} = await urbanPolicySimulatorPrompt(input);
    return output!;
  }
);
