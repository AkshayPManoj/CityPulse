"use client";

import { useState } from "react";
import { type DynamicRouteOptimizationOutput } from "@/ai/flows/dynamic-route-optimization";
import { optimizeRoutesAction } from "./actions";
import { Button } from "@/components/ui/button";
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
import { Route, Wrench, Lightbulb, Map, Zap } from "lucide-react";

// The default values are now used directly as the mock input data
const mockInputData = {
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

  async function handleOptimize() {
    setIsLoading(true);
    setResult(null);
    try {
      // @ts-ignore
      const response = await optimizeRoutesAction(mockInputData);
      setResult(response);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Optimization Failed",
        description:
          error.message ||
          "The AI model failed to generate recommendations. Please try again.",
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
            <CardTitle>Optimization Trigger</CardTitle>
            <CardDescription>
              Run the AI to generate new route recommendations based on simulated real-time city data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-center">
                <h3 className="text-lg font-semibold mb-2">Simulate Real-time Optimization</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    The AI will use a pre-defined set of live data inputs (demand, events, traffic) to generate recommendations.
                </p>
                 <Button onClick={handleOptimize} disabled={isLoading} className="w-full max-w-xs">
                    {isLoading ? (
                    "Optimizing..."
                    ) : (
                    <>
                        <Zap className="mr-2 h-4 w-4" />
                        Optimize Routes Now
                    </>
                    )}
                </Button>
            </div>
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
