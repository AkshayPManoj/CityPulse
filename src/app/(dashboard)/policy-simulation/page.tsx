"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  urbanPolicySimulator,
  type UrbanPolicySimulatorOutput,
} from "@/ai/flows/urban-policy-simulator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  TestTube2,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  ShieldCheck,
  Check,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  policyDescription: z.string().min(20, {
    message: "Policy description must be at least 20 characters.",
  }),
  currentCityState: z
    .string()
    .min(10, { message: "Please describe the current city state." }),
  durationHours: z.coerce.number().optional(),
  affectedAreaDescription: z.string().optional(),
});

async function simulatePolicyAction(
  values: z.infer<typeof formSchema>
): Promise<UrbanPolicySimulatorOutput> {
  "use server";
  return await urbanPolicySimulator(values);
}

export default function PolicySimulationPage() {
  const { toast } = useToast();
  const [result, setResult] = useState<UrbanPolicySimulatorOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      policyDescription:
        "Implement a new bus-only corridor on Main Street from 8 AM to 6 PM on weekdays.",
      currentCityState:
        "Main Street is a major arterial road with high commercial activity and frequent traffic congestion during peak hours. Public transport usage is moderate.",
      durationHours: 10,
      affectedAreaDescription: "Main Street, from Central Square to the University Campus.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await simulatePolicyAction(values);
      setResult(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Simulation Failed",
        description:
          "The AI model failed to generate a simulation. Please try again.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const getIconForChange = (direction: string) => {
    switch (direction) {
      case "increase":
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      case "decrease":
        return <TrendingDown className="h-4 w-4 text-green-600" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  return (
    <>
      <PageHeader
        title="Urban Policy Simulator"
        description="Test urban policies in a digital twin before implementation."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Simulation Scenario</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="policyDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy to Simulate</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Designate the central market area as a car-free zone..."
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentCityState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current City State</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe relevant traffic, events, etc."
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="affectedAreaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Affected Area (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Downtown core'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Simulating..." : "Run Simulation"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="sticky top-20">
          <Card>
            <CardHeader>
              <CardTitle>AI Simulation Report</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                 <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-6 w-full" />
                  <div className="space-y-2 pt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              )}
              {!isLoading && !result && (
                <div className="text-center text-muted-foreground py-8">
                  <TestTube2 className="mx-auto h-12 w-12" />
                  <p className="mt-4">
                    Simulation results will appear here.
                  </p>
                </div>
              )}
              {result && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Overall Impact</h4>
                    <p className="text-sm text-muted-foreground">{result.overallImpactSummary}</p>
                  </div>
                   <div>
                    <h4 className="font-semibold mb-2">Impact on Metrics</h4>
                    <div className="space-y-3">
                    {result.impactDetails.map((detail, i) => (
                      <div key={i} className="p-3 rounded-md border bg-secondary/30">
                          <div className="flex justify-between items-start">
                              <div className="font-medium">{detail.metric}</div>
                              <Badge variant={detail.changeDirection === 'increase' ? 'destructive' : detail.changeDirection === 'decrease' ? 'default' : 'secondary'} className="capitalize flex items-center gap-1">
                                {getIconForChange(detail.changeDirection)}
                                {detail.changeDirection.replace(/_/g, ' ')}
                              </Badge>
                          </div>
                          {detail.magnitude && <p className="text-sm font-semibold text-foreground mt-1">{detail.magnitude}</p>}
                          <p className="text-xs text-muted-foreground mt-1">{detail.reason}</p>
                      </div>
                    ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <AlertTriangle className="size-4 text-destructive" /> Potential Challenges
                    </h4>
                    <ul className="list-none space-y-2">
                      {result.potentialChallenges.map((challenge, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                           <X className="size-4 mt-0.5 text-destructive flex-shrink-0" /> 
                           <span>{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <ShieldCheck className="size-4 text-green-600" /> Mitigation Strategies
                    </h4>
                     <ul className="list-none space-y-2">
                      {result.mitigationStrategies.map((strategy, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="size-4 mt-0.5 text-green-600 flex-shrink-0" />
                          <span>{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
