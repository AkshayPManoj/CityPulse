"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Activity,
  Bus,
  Users,
  Leaf,
  TrendingUp,
  Timer,
  Award,
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { PageHeader } from "@/components/page-header";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const heatmapImage = PlaceHolderImages.find((img) => img.id === "heatmap");

const DemandChart = dynamic(
  () => import("@/components/demand-chart").then((mod) => mod.DemandChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[250px] w-full" />,
  }
);

export default function DashboardPage() {
  const [stats, setStats] = useState({
    trafficDensity: 68,
    trafficChange: 5.2,
    passengerDemand: 12234,
    activeBuses: 482,
    greenTrips: 28931,
    onTimePerformance: 98.2,
    onTimeChange: 1.5,
    mobilityCredits: 1.2,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) => ({
        trafficDensity: Math.min(
          100,
          Math.max(20, prevStats.trafficDensity + (Math.random() - 0.5) * 5)
        ),
        trafficChange: Math.max(
          0.1,
          prevStats.trafficChange + (Math.random() - 0.5) * 0.5
        ),
        passengerDemand:
          prevStats.passengerDemand + Math.floor(Math.random() * 50 - 20),
        activeBuses: Math.min(
          500,
          Math.max(450, prevStats.activeBuses + Math.floor(Math.random() * 4 - 2))
        ),
        greenTrips: prevStats.greenTrips + Math.floor(Math.random() * 30),
        onTimePerformance: Math.min(
          100,
          Math.max(90, prevStats.onTimePerformance + (Math.random() - 0.5) * 0.2)
        ),
        onTimeChange: Math.max(
          0.1,
          prevStats.onTimeChange + (Math.random() - 0.5) * 0.1
        ),
        mobilityCredits: prevStats.mobilityCredits + Math.random() * 0.01,
      }));
    }, 2500); // update every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <PageHeader
        title="City Mobility Dashboard"
        description="Real-time overview of your city's pulse."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Live Traffic Density
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.trafficDensity.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats.trafficChange.toFixed(1)}% from last hour
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Passenger Demand
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{stats.passengerDemand.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Peak at 6:00 PM</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Buses</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBuses} / 500</div>
            <p className="text-xs text-muted-foreground">
              {((stats.activeBuses / 500) * 100).toFixed(1)}% operational
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Green Trips Today
            </CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.greenTrips.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">-12.4% CO2 emissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              On-Time Performance
            </CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.onTimePerformance.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats.onTimeChange.toFixed(1)}% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mobility Credits Awarded
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.mobilityCredits.toFixed(2)}M
            </div>
            <p className="text-xs text-muted-foreground">
              Total credits issued this month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 mt-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              24-Hour Demand Forecast
            </CardTitle>
            <CardDescription>
              Predicted passenger demand over the next 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DemandChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Real-Time Mobility Heatmap</CardTitle>
            <CardDescription>
              Live visualization of traffic and passenger density.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {heatmapImage && (
              <div className="aspect-video overflow-hidden rounded-lg border">
                <Image
                  src={heatmapImage.imageUrl}
                  alt={heatmapImage.description}
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover"
                  data-ai-hint={heatmapImage.imageHint}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
