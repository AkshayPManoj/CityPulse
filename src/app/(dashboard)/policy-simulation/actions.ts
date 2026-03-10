"use server";

import {
  urbanPolicySimulator,
  type UrbanPolicySimulatorInput,
  type UrbanPolicySimulatorOutput,
} from "@/ai/flows/urban-policy-simulator";

export async function simulatePolicyAction(
  values: UrbanPolicySimulatorInput
): Promise<UrbanPolicySimulatorOutput> {
  return await urbanPolicySimulator(values);
}
