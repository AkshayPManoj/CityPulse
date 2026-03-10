"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  dynamicRouteOptimization,
  type DynamicRouteOptimizationOutput,
} from "@/ai/flows/dynamic-route-optimization";
import { Button } from "@/components/ui/button";
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
import { Route, Wrench, Lightbulb, Map } from "lucide-react";

// Simplified form for demonstration purposes
type FormValues = {
  demandPredictions: string;
  cityEvents: string;
  currentTrafficConditions: string;
  existingRoutes: string;
};

async function optimizeRoutesAction(
  values: FormValues
): Promise<DynamicRouteOptimizationOutput> {
  "use server";
  try {
    const parsedInput = {
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

const defaultValues = {
  demandPredictions: JSON.stringify(
    [
      {
        location: "College area",
        time: "Peak hours 4-6 PM",
        predictedPassengers: 400,
        reason: "end of classes",
      },
    ],
    null,
    2
  ),
  cityEvents: JSON.stringify(
    [
      {
        name: "Annual City Festival",
        type: "festival",
        location: "City Center Park",
        startTime: "12:00 PM",
        endTime: "10:00 PM",
        impact: "high pedestrian traffic",
      },
    ],
    null,
    2
  ),
  currentTrafficConditions: JSON.stringify(
    [
      {
        segment: "Main Street between Oak and Elm",
        congestionLevel: "high",
      },
    ],
    null,
    2
  ),
  existingRoutes: JSON.stringify(
    [
      {
        routeId: "R-12",
        name: "Route 12",
        stops: ["Central Station", "City Hall", "Market District", "College"],
        scheduleSummary: "every 15 mins",
        capacityEstimate: 60,
      },
    ],
    null,
    2
  ),
};

export default function RouteOptimizationPage() {
  const { toast } = useToast();
  const [result, setResult] = useState<DynamicRouteOptimizationOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<FormValues>({ defaultValues });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await optimizeRoutesAction(values);
      setResult(response);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Optimization Failed",
        description:
          error.message ||
          "The AI model failed to generate recommendations. Please check your inputs and try again.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="AI Dynamic Route Optimization"
        description="Generate adaptive routes and service adjustments in real-time."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Real-time Inputs</CardTitle>
            <CardDescription>
              Provide data in JSON format for the AI to analyze.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="text-sm font-medium">Demand Predictions</label>
                <Textarea {...register("demandPredictions")} rows={5} className="mt-1 font-mono text-xs" />
              </div>
              <div>
                <label className="text-sm font-medium">City Events</label>
                <Textarea {...register("cityEvents")} rows={5} className="mt-1 font-mono text-xs" />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Current Traffic Conditions
                </label>
                <Textarea {...register("currentTrafficConditions")} rows={5} className="mt-1 font-mono text-xs"/>
              </div>
              <div>
                <label className="text-sm font-medium">Existing Routes</label>
                <Textarea {...register("existingRoutes")} rows={5} className="mt-1 font-mono text-xs"/>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Optimizing..." : "Optimize Routes"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="sticky top-20">
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                 <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              )}
              {!isLoading && !result && (
                 <div className="text-center text-muted-foreground py-8">
                  <Route className="mx-auto h-12 w-12" />
                  <p className="mt-4">
                    Optimization results will appear here.
                  </p>
                </div>
              )}
              {result && (
                <div className="space-y-6">
                  {result.recommendedRoutes.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                        <Map className="size-5" /> Recommended New Routes
                      </h3>
                      <div className="space-y-4">
                        {result.recommendedRoutes.map((route, i) => (
                          <Card key={i} className="bg-secondary/50">
                            <CardHeader>
                              <CardTitle className="text-base">{route.purpose}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                               <p><strong>Path:</strong> {route.startLocation} ➔ {route.endLocation}</p>
                               <p><strong>Stops:</strong> {route.keyStops.join(", ")}</p>
                               <p><strong>Justification:</strong> {route.justification}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.serviceAdjustments.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                        <Wrench className="size-5" /> Service Adjustments
                      </h3>
                       <div className="space-y-4">
                        {result.serviceAdjustments.map((adj, i) => (
                           <Card key={i} className="bg-secondary/50">
                             <CardHeader>
                               <CardTitle className="text-base capitalize">
                                {adj.type.replace(/_/g, " ")} on Route {adj.routeId}
                               </CardTitle>
                             </CardHeader>
                             <CardContent className="text-sm space-y-2">
                                <p><strong>Details:</strong> {adj.details}</p>
                                <p><strong>Justification:</strong> {adj.justification}</p>
                             </CardContent>
                           </Card>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                        <Lightbulb className="size-5" /> Overall Strategy
                      </h3>
                      <p className="text-sm text-muted-foreground">{result.overallRecommendationSummary}</p>
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
