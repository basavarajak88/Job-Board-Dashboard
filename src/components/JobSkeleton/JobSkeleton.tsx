import React from 'react';
import { Card, CardContent, Skeleton, Box, Stack } from '@mui/material';

const JobSkeleton: React.FC = () => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header with title and bookmark */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flexGrow: 1, mr: 1 }}>
            <Skeleton variant="text" width="80%" height={32} />
            <Skeleton variant="text" width="60%" height={20} />
          </Box>
          <Skeleton variant="circular" width={40} height={40} />
        </Box>

        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="text" width="50%" height={20} />
        </Box>

        {/* Description */}
        <Box sx={{ mb: 2, flexGrow: 1 }}>
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="70%" />
        </Box>

        {/* Tags */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={70} height={24} />
        </Stack>

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="rounded" width={80} height={32} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobSkeleton;
