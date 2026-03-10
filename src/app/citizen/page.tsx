"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { generateCitizenJourney } from "./actions";
import type { CitizenMultiModalJourneyOutput } from "@/ai/flows/citizen-multi-modal-journey";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bus,
  Bike,
  Walk,
  Car,
  Sparkles,
  Zap,
  Leaf,
  Clock,
  CircleDollarSign,
  HeartPulse,
  Route,
  Accessibility,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const accessibilityItems = [
  { id: "wheelchair_friendly", label: "Wheelchair Friendly" },
  { id: "minimal_walking", label: "Minimal Walking" },
  { id: "stroller_friendly", label: "Stroller Friendly" },
  { id: "audio_navigation", label: "Audio Navigation" },
] as const;

const formSchema = z.object({
  startLocation: z.string().min(3, "Start location is required."),
  endLocation: z.string().min(3, "End location is required."),
  accessibilityNeeds: z.array(z.string()).optional(),
});

const modeIcons: { [key: string]: React.ElementType } = {
  walk: Walk,
  bus: Bus,
  cycle: Bike,
  shared_auto: Car,
  metro: Bus,
  taxi: Car,
  ride_share: Car,
  default: Route,
};

export default function CitizenJourneyPlannerPage() {
  const { toast } = useToast();
  const [result, setResult] = useState<CitizenMultiModalJourneyOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startLocation: "Indira Nagar, Bengaluru",
      endLocation: "Koramangala, Bengaluru",
      accessibilityNeeds: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      // @ts-ignore
      const response = await generateCitizenJourney(values);
      setResult(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Journey Planning Failed",
        description:
          "The AI model failed to generate a journey. Please try again.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">
            Smart Journey Composer
          </CardTitle>
          <CardDescription>
            Find the best multi-modal route for your journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Home'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Work'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="accessibilityNeeds"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Accessibility Needs
                      </FormLabel>
                      <FormDescription>
                        Select any requirements for your journey.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {accessibilityItems.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="accessibilityNeeds"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...(field.value || []),
                                            item.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                {isLoading ? "Composing Journeys..." : "Compose Journeys"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="max-w-4xl mx-auto mt-8">
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        )}
        {result && (
          <div className="space-y-6">
             <h2 className="text-xl font-bold font-headline text-center">Your Journey Options</h2>
            {result.journeyOptions.map((option, index) => (
              <Card key={option.id} className={index === 0 ? "border-primary border-2" : ""}>
                 {index === 0 && <Badge className="ml-6 -mb-3 relative z-10">Recommended</Badge>}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Option {index + 1}</span>
                     {option.isAccessible && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <Accessibility className="mr-2 h-4 w-4" /> Accessible
                        </Badge>
                      )}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground pt-2">
                      <div className="flex items-center gap-1.5"><Clock className="size-4" /> {option.totalDurationMinutes} min</div>
                      <div className="flex items-center gap-1.5"><CircleDollarSign className="size-4" /> ₹{option.totalCostINR?.toFixed(2)}</div>
                      <div className="flex items-center gap-1.5"><Leaf className="size-4" /> {option.totalCarbonFootprintKgCO2?.toFixed(2)} kg CO₂</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    {option.steps.map((step, i) => {
                      const Icon = modeIcons[step.mode] || modeIcons.default;
                      return (
                        <div key={i} className="flex items-center">
                          <div className="flex flex-col items-center">
                            <div className="rounded-full bg-primary/10 p-2 text-primary">
                              <Icon className="h-5 w-5" />
                            </div>
                            <p className="text-xs mt-1 capitalize">{step.mode}</p>
                          </div>
                          {i < option.steps.length - 1 && (
                            <div className="w-8 mx-2 border-t-2 border-dashed"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    {option.steps.map((step, i) => (
                      <div key={i} className="text-sm">
                        <p className="font-semibold capitalize">{step.mode} ({step.durationMinutes} min)</p>
                        <p className="text-muted-foreground">{step.instructions}</p>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                   <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="size-4 text-primary" />
                        <div>
                          <p className="font-semibold">Efficiency</p>
                          <p className="text-muted-foreground">Score: {option.efficiencyScore}/5</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <HeartPulse className="size-4 text-primary" />
                        <div>
                          <p className="font-semibold">Comfort</p>
                          <p className="text-muted-foreground">Score: {option.comfortScore}/5</p>
                        </div>
                      </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
