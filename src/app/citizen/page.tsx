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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
  Award,
  Wheelchair,
  Footprints,
  Baby,
  Volume2,
  Eye,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const accessibilityItems = [
  { id: "wheelchair_friendly", label: "Wheelchair", icon: Wheelchair },
  { id: "minimal_walking", label: "Min. Walking", icon: Footprints },
  { id: "stroller_friendly", label: "Stroller", icon: Baby },
  { id: "audio_navigation", label: "Audio Nav", icon: Volume2 },
  { id: 'low_vision_support', label: 'Low Vision', icon: Eye },
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
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Accessibility Needs</FormLabel>
                      <FormDescription>Select any requirements for your journey.</FormDescription>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {accessibilityItems.map((item) => (
                        <Label
                          key={item.id}
                          htmlFor={item.id}
                          className={cn(
                            "flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-colors hover:bg-accent/50",
                            field.value?.includes(item.id) ? "border-primary bg-primary/10" : "border-muted"
                          )}
                        >
                          <Checkbox
                            id={item.id}
                            className="sr-only"
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                          <div className={cn("mb-2 rounded-full p-2 transition-colors", field.value?.includes(item.id) ? 'bg-primary/20 text-primary' : 'bg-muted/70 text-muted-foreground')}>
                            <item.icon className="h-6 w-6" />
                          </div>
                          <span className="text-sm font-medium text-center">{item.label}</span>
                        </Label>
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
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground pt-2">
                      <div className="flex items-center gap-1.5"><Clock className="size-4" /> {option.totalDurationMinutes} min</div>
                      <div className="flex items-center gap-1.5"><CircleDollarSign className="size-4" /> ₹{option.totalCostINR?.toFixed(2)}</div>
                      <div className="flex items-center gap-1.5"><Leaf className="size-4" /> {option.totalCarbonFootprintKgCO2?.toFixed(2)} kg CO₂</div>
                      {option.mobilityCredits && (
                        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium"><Award className="size-4" /> {option.mobilityCredits} Credits</div>
                      )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-6 overflow-x-auto pb-4">
                    {option.steps.map((step, i) => {
                      const Icon = modeIcons[step.mode] || modeIcons.default;
                      return (
                        <div key={i} className="flex items-center">
                          <div className="flex flex-col items-center text-center w-20">
                            <div className="rounded-full bg-primary/10 p-3 mb-1 text-primary ring-4 ring-primary/10">
                              <Icon className="h-6 w-6" />
                            </div>
                            <p className="text-xs font-semibold capitalize">{step.mode}</p>
                            <p className="text-xs text-muted-foreground">{step.durationMinutes} min</p>
                          </div>
                          {i < option.steps.length - 1 && (
                            <div className="w-12 shrink-0 mx-2 border-t-2 border-dashed border-primary/30"></div>
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

    