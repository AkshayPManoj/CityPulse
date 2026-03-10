"use client";

import { useState, useEffect } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const initialChartData = [
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

export function DemandChart() {
  const [chartData, setChartData] = useState(initialChartData);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prevData) =>
        prevData.map((item) => ({
          ...item,
          demand: Math.max(
            150,
            Math.floor(item.demand + (Math.random() - 0.45) * 25)
          ),
        }))
      );
    }, 2500); // update every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
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
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
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
  );
}
