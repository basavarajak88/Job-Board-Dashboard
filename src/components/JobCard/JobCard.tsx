import React, { memo, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LocationOn,
  Business,
  BookmarkBorder,
  Bookmark,
  OpenInNew,
} from '@mui/icons-material';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatch';
import { toggleBookmark } from '../../store/slices/bookmarksSlice';
import type { Job } from '../../store/slices/jobsSlice';

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  viewMode?: 'grid' | 'list';
}

const JobCard: React.FC<JobCardProps> = memo(({ job, onClick, viewMode = 'grid' }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const bookmarkedJobs = useAppSelector(state => state.bookmarks.bookmarkedJobs);
  
  const isBookmarked = bookmarkedJobs.some(bookmarkedJob => bookmarkedJob.slug === job.slug);

  const handleBookmarkClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleBookmark(job));
  }, [dispatch, job]);

  const handleApplyClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(job.url, '_blank', 'noopener,noreferrer');
  }, [job.url]);

  const formatDate = useCallback((timestamp: number) => {
    try {
      const date = format(new Date(timestamp * 1000), 'MMM dd, yyyy');
      return isMobile ? format(new Date(timestamp * 1000), 'MMM dd') : date;
    } catch {
      return 'Date unavailable';
    }
  }, [isMobile]);

  const truncateDescription = useCallback((html: string, maxLength: number = 200) => {
    const cleanText = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
    return cleanText.length > maxLength 
      ? cleanText.substring(0, maxLength) + '...'
      : cleanText;
  }, []);

  // List view layout
  if (viewMode === 'list') {
    return (
      <Card 
        sx={{ 
          width: '100%',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': onClick ? {
            transform: isMobile ? 'none' : 'translateY(-1px)',
          } : {},
        }}
        onClick={onClick}
      >
        <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'flex-start', 
            gap: isMobile ? 1.5 : 2 
          }}>
            {/* Main content */}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'space-between', 
                mb: 1,
                gap: 1
              }}>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography 
                    variant={isMobile ? "subtitle1" : "h6"} 
                    component="h3" 
                    sx={{ 
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: isMobile ? 'normal' : 'nowrap',
                      lineHeight: 1.3,
                      fontSize: isMobile ? '1rem' : '1.25rem'
                    }}
                  >
                    {job.title}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center', 
                    gap: isMobile ? 0.5 : 2, 
                    mb: 1,
                    flexWrap: 'wrap'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                      <Business sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary', flexShrink: 0 }} />
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {job.company_name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                      <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary', flexShrink: 0 }} />
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {job.location || 'Location not specified'}
                      </Typography>
                    </Box>
                    {job.remote && (
                      <Chip 
                        label="Remote" 
                        size="small" 
                        color="success" 
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>
                </Box>
                <IconButton 
                  onClick={handleBookmarkClick}
                  color={isBookmarked ? 'primary' : 'default'}
                  size="small"
                  sx={{ flexShrink: 0 }}
                >
                  {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
              </Box>

              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 2,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: isMobile ? 3 : 2,
                  WebkitBoxOrient: 'vertical',
                  fontSize: isMobile ? '0.875rem' : '0.875rem',
                  lineHeight: 1.4
                }}
              >
                {truncateDescription(job.description, isMobile ? 120 : 150)}
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center', 
                gap: isMobile ? 1 : 2, 
                flexWrap: 'wrap',
                mb: isMobile ? 1.5 : 0
              }}>
                {/* Tags */}
                {job.tags && job.tags.length > 0 && (
                  <Stack 
                    direction="row" 
                    spacing={0.5} 
                    flexWrap="wrap" 
                    useFlexGap
                    sx={{ maxWidth: '100%' }}
                  >
                    {job.tags.slice(0, isMobile ? 2 : 3).map((tag, index) => (
                      <Chip 
                        key={index} 
                        label={tag} 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          fontSize: '0.7rem',
                          height: '24px',
                          '& .MuiChip-label': {
                            px: 1
                          }
                        }}
                      />
                    ))}
                    {job.tags.length > (isMobile ? 2 : 3) && (
                      <Chip 
                        label={`+${job.tags.length - (isMobile ? 2 : 3)}`} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                        sx={{ 
                          fontSize: '0.7rem',
                          height: '24px',
                          '& .MuiChip-label': {
                            px: 1
                          }
                        }}
                      />
                    )}
                  </Stack>
                )}

                {/* Job Types */}
                {job.job_types && job.job_types.length > 0 && (
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {job.job_types.slice(0, isMobile ? 1 : 2).map((type, index) => (
                      <Chip 
                        key={index} 
                        label={type} 
                        size="small" 
                        color="primary"
                        variant="filled"
                        sx={{ 
                          fontSize: '0.7rem',
                          height: '24px',
                          '& .MuiChip-label': {
                            px: 1
                          }
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            </Box>

            {/* Date and Apply button */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'row' : 'column',
              alignItems: isMobile ? 'center' : 'flex-end',
              justifyContent: isMobile ? 'space-between' : 'flex-start',
              gap: 1, 
              minWidth: isMobile ? 'auto' : 120,
              width: isMobile ? '100%' : 'auto'
            }}>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontSize: isMobile ? '0.75rem' : '0.75rem',
                  flexShrink: 0
                }}
              >
                {formatDate(job.created_at)}
              </Typography>
              <Button
                variant="contained"
                size={isMobile ? "medium" : "small"}
                startIcon={<OpenInNew />}
                onClick={handleApplyClick}
                sx={{
                  minHeight: isMobile ? '40px' : '32px',
                  fontSize: isMobile ? '0.875rem' : '0.8125rem',
                  px: isMobile ? 2 : 1.5
                }}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Grid view layout
  return (
    <Card 
      sx={{ 
        height: '100%', 
        minHeight: isMobile ? 280 : 320,
        display: 'flex', 
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: isMobile ? 'none' : 'translateY(-2px)',
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        p: isMobile ? 1.5 : 2
      }}>
        {/* Header with bookmark */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 1 }}>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              component="h3" 
              sx={{ 
                mb: 1,
                fontSize: isMobile ? '1rem' : '1.1rem',
                fontWeight: 600,
                lineHeight: 1.3,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                minHeight: isMobile ? '2.4rem' : '2.6rem'
              }}
            >
              {job.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Business sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary', flexShrink: 0 }} />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}
              >
                {job.company_name}
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={handleBookmarkClick}
            color={isBookmarked ? 'primary' : 'default'}
            size="small"
            sx={{ flexShrink: 0 }}
          >
            {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
          </IconButton>
        </Box>

        {/* Location and Remote status */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, minHeight: '24px', gap: 1 }}>
          <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary', flexShrink: 0 }} />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              fontSize: isMobile ? '0.8rem' : '0.875rem'
            }}
          >
            {job.location || 'Location not specified'}
          </Typography>
          {job.remote && (
            <Chip 
              label="Remote" 
              size="small" 
              color="success" 
              variant="outlined"
              sx={{ 
                fontSize: '0.7rem',
                height: '24px',
                flexShrink: 0
              }}
            />
          )}
        </Box>

        {/* Description */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 1.5, 
            flexGrow: 1,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: isMobile ? 2 : 3,
            WebkitBoxOrient: 'vertical',
            minHeight: isMobile ? '2.4rem' : '3.6rem',
            fontSize: isMobile ? '0.8rem' : '0.875rem',
            lineHeight: 1.4
          }}
        >
          {truncateDescription(job.description, isMobile ? 100 : 120)}
        </Typography>

        {/* Tags */}
        <Box sx={{ mb: 1.5, minHeight: '32px', display: 'flex', alignItems: 'flex-start' }}>
          {job.tags && job.tags.length > 0 && (
            <Stack 
              direction="row" 
              spacing={0.5} 
              flexWrap="wrap" 
              useFlexGap
              sx={{ maxWidth: '100%' }}
            >
              {job.tags.slice(0, isMobile ? 2 : 3).map((tag, index) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  size="small" 
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.7rem',
                    height: '24px',
                    '& .MuiChip-label': {
                      px: 0.75
                    }
                  }}
                />
              ))}
              {job.tags.length > (isMobile ? 2 : 3) && (
                <Chip 
                  label={`+${job.tags.length - (isMobile ? 2 : 3)}`} 
                  size="small" 
                  variant="outlined"
                  color="primary"
                  sx={{ 
                    fontSize: '0.7rem',
                    height: '24px',
                    '& .MuiChip-label': {
                      px: 0.75
                    }
                  }}
                />
              )}
            </Stack>
          )}
        </Box>

        {/* Job Types */}
        <Box sx={{ mb: 1.5, minHeight: '32px', display: 'flex', alignItems: 'flex-start' }}>
          {job.job_types && job.job_types.length > 0 && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {job.job_types.slice(0, isMobile ? 1 : 2).map((type, index) => (
                <Chip 
                  key={index} 
                  label={type} 
                  size="small" 
                  color="primary"
                  variant="filled"
                  sx={{ 
                    fontSize: '0.7rem',
                    height: '24px',
                    '& .MuiChip-label': {
                      px: 0.75
                    }
                  }}
                />
              ))}
              {job.job_types.length > (isMobile ? 1 : 2) && (
                <Chip 
                  label={`+${job.job_types.length - (isMobile ? 1 : 2)}`} 
                  size="small" 
                  color="primary"
                  variant="filled"
                  sx={{ 
                    fontSize: '0.7rem',
                    height: '24px',
                    '& .MuiChip-label': {
                      px: 0.75
                    }
                  }}
                />
              )}
            </Stack>
          )}
        </Box>

        {/* Footer with date and apply button */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'stretch' : 'center', 
          mt: 'auto',
          pt: 1,
          gap: isMobile ? 1 : 0
        }}>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              fontSize: isMobile ? '0.75rem' : '0.75rem',
              alignSelf: isMobile ? 'flex-start' : 'center'
            }}
          >
            Posted: {formatDate(job.created_at)}
          </Typography>
          <Button
            variant="contained"
            size={isMobile ? "medium" : "small"}
            startIcon={<OpenInNew />}
            onClick={handleApplyClick}
            sx={{
              minHeight: isMobile ? '40px' : '32px',
              fontSize: isMobile ? '0.875rem' : '0.8125rem'
            }}
          >
            Apply
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
});

JobCard.displayName = 'JobCard';

export default JobCard;
