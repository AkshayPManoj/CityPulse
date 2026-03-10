"use client";

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
  return (
    <>
      <PageHeader
        title="City Mobility Dashboard"
        description="Real-time overview of your city's pulse."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Live Traffic Density
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+5.2% from last hour</p>
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
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              Peak at 6:00 PM
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Buses</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">482 / 500</div>
            <p className="text-xs text-muted-foreground">96.4% operational</p>
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
            <div className="text-2xl font-bold">28,931</div>
            <p className="text-xs text-muted-foreground">
              -12.4% CO2 emissions
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
