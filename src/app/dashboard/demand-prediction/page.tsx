"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  predictMobilityDemand,
  type DemandPredictionOutput,
} from "@/ai/flows/demand-prediction-insights";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Clock, MapPin, AlertTriangle, BrainCircuit } from "lucide-react";

const formSchema = z.object({
  contextDescription: z
    .string()
    .min(10, { message: "Please provide a more detailed context." }),
  historicalTrendsSummary: z
    .string()
    .min(10, { message: "Please provide more details on historical trends." }),
  targetArea: z.string().min(3, { message: "Target area is required." }),
  targetDateTime: z.string().min(10, { message: "A valid date and time is required." }),
});

async function predictDemandAction(
  values: z.infer<typeof formSchema>
): Promise<DemandPredictionOutput> {
  "use server";
  return await predictMobilityDemand(values);
}

export default function DemandPredictionPage() {
  const { toast } = useToast();
  const [result, setResult] = useState<DemandPredictionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contextDescription:
        "Annual City Festival is ongoing near the main stadium. Weather is clear and sunny.",
      historicalTrendsSummary:
        "Fridays usually see a 20% increase in evening traffic. Last year's festival caused severe congestion on the main bridge.",
      targetArea: "Stadium district and surrounding bridges",
      targetDateTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await predictDemandAction(values);
      setResult(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description:
          "The AI model failed to generate a prediction. Please try again.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="AI Demand Prediction"
        description="Forecast mobility demand to proactively manage city transit."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Prediction Inputs</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="targetArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Area</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Downtown Core'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetDateTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Date & Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contextDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Context</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe current events, weather, etc."
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
                  name="historicalTrendsSummary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Historical Trends</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Summarize past mobility patterns."
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Predicting..." : "Predict Demand"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="sticky top-20">
          <Card>
            <CardHeader>
              <CardTitle>AI Prediction Results</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <div className="space-y-2 pt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              )}
              {!isLoading && !result && (
                <div className="text-center text-muted-foreground py-8">
                  <BrainCircuit className="mx-auto h-12 w-12" />
                  <p className="mt-4">
                    Your prediction results will appear here.
                  </p>
                </div>
              )}
              {result && (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Predicted Demand
                    </p>
                    <Badge variant="destructive" className="text-lg mt-1">
                      {result.predictedDemandLevel}
                    </Badge>
                    <p className="text-lg font-semibold mt-1">
                      {result.predictedDemandImpact}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <Clock className="size-4" /> Peak Hours
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.peakHours.map((hour) => (
                        <Badge key={hour} variant="secondary">
                          {hour}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <MapPin className="size-4" /> Congestion Hotspots
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {result.congestionAreas.map((area) => (
                        <li key={area}>{area}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <Lightbulb className="size-4" /> Proactive Suggestions
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {result.proactiveSuggestions.map((suggestion) => (
                        <li key={suggestion}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <AlertTriangle className="size-4" /> Reasoning
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {result.reasoning}
                    </p>
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
