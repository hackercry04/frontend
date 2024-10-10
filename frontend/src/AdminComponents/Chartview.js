"use client"

import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const generateDummyData = () => {
  const data = []
  const currentDate = new Date()
  for (let i = 0; i < 365; i++) {
    const date = new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000)
    data.push({
      date: date.toISOString().split('T')[0],
      sales: Math.floor(Math.random() * 100) + 1
    })
  }
  return data.reverse()
}

export default function Component({salescount}) {
  
  
  const [data, setData] = useState(salescount)
  // console.log('data is',data,salescount)
  useEffect(()=>{
    setData(salescount)
    // console.log('it changed')
  },[salescount])
  const [filteredData, setFilteredData] = useState(data)
  const [timeFrame, setTimeFrame] = useState('month')

  const filterData = (frame) => {
    const currentDate = new Date()
    let filteredData = []

    switch (frame) {
      case 'day':
        filteredData = data.filter(item => {
          const itemDate = new Date(item.date)
          return itemDate.toDateString() === currentDate.toDateString()
        })
        break
      case 'week':
        filteredData = data.filter(item => {
          const itemDate = new Date(item.date)
          const diffTime = Math.abs(currentDate - itemDate)
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          return diffDays <= 7
        })
        break
      case 'month':
        filteredData = data.filter(item => {
          const itemDate = new Date(item.date)
          return itemDate.getMonth() === currentDate.getMonth() &&
                 itemDate.getFullYear() === currentDate.getFullYear()
        })
        break
      case 'year':
        filteredData = data.filter(item => {
          const itemDate = new Date(item.date)
          return itemDate.getFullYear() === currentDate.getFullYear()
        })
        break
      default:
        filteredData = data
    }

    setFilteredData(filteredData)
  }
  useEffect(() => {
    filterData(timeFrame)
  }, [timeFrame, data])

  return (
    <div className="w-full p-4 bg-white">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Product Sales Chart</h2>
      <div className="mb-4">
        <label htmlFor="time-frame" className="block text-sm font-medium text-gray-700 mb-2">Select Time Frame:</label>
        <select
          id="time-frame"
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
          className="block w-[180px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>
      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}