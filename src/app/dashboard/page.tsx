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
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { PageHeader } from "@/components/page-header";

const heatmapImage = PlaceHolderImages.find((img) => img.id === "heatmap");

const chartData = [
  { time: "00:00", demand: 210 },
  { time: "02:00", demand: 250 },
  { time: "04:00", demand: 220 },
  { time: "06:00", demand: 480 },
  { time: "08:00", demand: 650 },
  { time: "10:00", demand: 580 },
  { time: "12:00", demand: 720 },
  { time: "14:00", demand: 680 },
  { time: "16:00", demand: 810 },
  { time: "18:00", demand: 950 },
  { time: "20:00", demand: 700 },
  { time: "22:00", demand: 450 },
];

const chartConfig = {
  demand: {
    label: "Passenger Demand",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

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
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value}
                />
                 <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="demand"
                  type="natural"
                  fill="var(--color-demand)"
                  fillOpacity={0.4}
                  stroke="var(--color-demand)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
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
