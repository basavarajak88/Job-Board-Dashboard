import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatch';
import { setSearchTerm } from '../../store/slices/filtersSlice';
import useDebounce from '../../hooks/useDebounce';

const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector(state => state.filters.searchTerm);
  
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

  // Update Redux store when debounced value changes
  useEffect(() => {
    dispatch(setSearchTerm(debouncedSearchTerm));
  }, [debouncedSearchTerm, dispatch]);

  // Sync local state with Redux state (for external updates)
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(event.target.value);
  };

  const handleClear = () => {
    setLocalSearchTerm('');
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search jobs by title, company, or description..."
      value={localSearchTerm}
      onChange={handleSearchChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search color="action" />
          </InputAdornment>
        ),
        endAdornment: localSearchTerm && (
          <InputAdornment position="end">
            <IconButton
              aria-label="clear search"
              onClick={handleClear}
              edge="end"
              size="small"
            >
              <Clear />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'background.paper',
        },
      }}
    />
  );
};

export default SearchBar;
