"use client"

import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock data for products
const mockProducts = [
  { name: 'Product 1', count: 300 },
  { name: 'Product 2', count: 150 },
  { name: 'Product 3', count: 200 },

]

// Define an array of 10 different colors
const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
  'hsl(var(--chart-7))',
  'hsl(var(--chart-8))',
  'hsl(var(--chart-9))',
  'hsl(var(--chart-10))'
]

export default function Component({top_products,label}) {
  // Ensure we only use up to 10 products
  const displayProducts = top_products.slice(0, 10)

  return (
    <div className="w-full h-[600px] bg-background rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold  mb-6">{label}</h2>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={displayProducts}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="90%"
            innerRadius="30%"
            paddingAngle={2}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {displayProducts.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [`${value} units`, props.payload.name]}
            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconSize={16}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}