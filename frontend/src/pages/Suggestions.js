import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import SuggestionForm from '../components/Suggestions/SuggestionForm';


const SuggestionsPage = () => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get('/api/suggestions');
      setSuggestions(res.data);
    };
    fetch();
  }, []);

  const fetchSuggestions = async () => {
    const res = await axios.get('/api/suggestions');
    setSuggestions(res.data);
  };

  const handleFormSubmit = async ({ category, title, description, files }) => {
    const formData = new FormData();
    formData.append('category', category);
    formData.append('title', title);
    formData.append('description', description);
    files.forEach((file) => formData.append('attachments', file));
    await axios.post('/api/suggestions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    fetchSuggestions();
  };

  return (
    <Box p={3} pb={10}>
      <Typography variant="h5" gutterBottom>Submit Suggestion</Typography>
      <SuggestionForm onSubmit={handleFormSubmit} />
      <Typography variant="h6" gutterBottom>My Suggestions</Typography>
      <Grid container spacing={2}>
        {suggestions.map((s) => (
          <Grid item xs={12} md={6} key={s.id}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">{s.title}</Typography>
                <Typography variant="body2">Category: {s.category}</Typography>
                <Typography variant="body2">Status: {s.status}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SuggestionsPage;