import React from 'react';
import { Box, Typography, Stack, useTheme } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DownloadIcon from '@mui/icons-material/Download';
import { tokens } from '../theme';

const ClassChart = ({ value, chartData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{ height: '100%' }}>
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={2}
      >
        <Box>
          <Typography variant="h6">
            Current class count
          </Typography>
          <Typography variant="h4" sx={{ color: colors.greenAccent[400], fontWeight: 'bold' }}>
            {value}
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            color: colors.greenAccent[400], 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <DownloadIcon />
        </Box>
      </Stack>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grey[200]}  />
          <XAxis 
            dataKey="name" 
            tick={{ fill: colors.grey[200] }} 
            axisLine={{ stroke: colors.grey[200] }}
            tickLine={{ stroke: colors.grey[200] }}
          />
          <YAxis 
            tick={{ fill: colors.grey[200] }}
            axisLine={{ stroke: colors.grey[200] }}
            tickLine={{ stroke: colors.grey[200] }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1b2439', borderColor: colors.grey[200] }} 
            labelStyle={{ color: colors.grey[200] }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="maths" 
            stroke={colors.redAccent[400]}  
            activeDot={{ r: 8 }} 
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="english" 
            stroke={colors.blueAccent[400]} 
            activeDot={{ r: 8 }}
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="scholarship" 
            stroke={colors.greenAccent[400]}  
            activeDot={{ r: 8 }}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ClassChart;