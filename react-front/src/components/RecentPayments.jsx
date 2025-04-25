// src/components/RecentPayments.jsx

import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { tokens } from '../theme';

const RecentPayments = ({ payments }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Recent Payments
      </Typography>
      <List sx={{ width: '100%' }}>
        {payments.map((payment, index) => (
          <React.Fragment key={payment.id}>
            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ color: colors.greenAccent[400] }}>
                    {payment.sno}
                  </Typography>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {payment.name}
                    </Typography>
                  </React.Fragment>
                }
              />
              <Typography variant="caption" color="text.secondary" sx={{ pt: 1 }}>
                {payment.date}
              </Typography>
            </ListItem>
            {index < payments.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default RecentPayments;