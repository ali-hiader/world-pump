'use client'

import {
   CartesianGrid,
   Line,
   LineChart,
   ResponsiveContainer,
   Tooltip,
   XAxis,
   YAxis,
} from 'recharts'

type ChartPoint = {
   date: string
   signups: number
}

interface Props {
   data: ChartPoint[]
}

export default function SignupChart({ data }: Props) {
   return (
      <div className="h-[350px]">
         <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  interval="preserveStartEnd"
               />
               <YAxis
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  allowDecimals={false}
                  domain={[0, 'auto']}
               />
               <Tooltip
                  contentStyle={{
                     backgroundColor: 'hsl(var(--background))',
                     border: '1px solid hsl(var(--border))',
                     borderRadius: '6px',
                  }}
                  labelStyle={{
                     color: 'hsl(var(--foreground))',
                  }}
               />
               <Line
                  type="monotone"
                  dataKey="signups"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
               />
            </LineChart>
         </ResponsiveContainer>
      </div>
   )
}
