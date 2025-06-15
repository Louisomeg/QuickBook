import React, { useState, useRef } from 'react';
import { Box, Button, Typography, TextField, Paper, IconButton, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';

const DropZone = styled(Paper)(({ theme, isdragactive }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  border: `2px dashed ${isdragactive ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: isdragactive ? 'rgba(255,255,255,0.3)' : 'transparent',
  cursor: 'pointer',
}));

const SuggestionForm = ({ onSubmit }) => {
  const [category, setCategory] = useState('Maintenance');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef();

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList);
    setFiles((prev) => [...prev, ...arr]);
    arr.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((p) => [...p, { name: file.name, src: e.target.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemove = (name) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
    setPreviews((prev) => prev.filter((p) => p.name !== name));
  };

  const handleSubmit = () => {
    onSubmit({ category, title, description, files });
    setTitle(''); setDescription(''); setFiles([]); setPreviews([]);
  };

  return (
    <Box>
      <TextField
        label="Category"
        select
        fullWidth
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        sx={{ mb: 2 }}
      >
        {['Maintenance', 'Facility', 'Other'].map((c) => (
          <MenuItem key={c} value={c}>{c}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Title"
        fullWidth
        sx={{ mb: 2 }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Description"
        fullWidth
        multiline
        rows={4}
        sx={{ mb: 2 }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <DropZone
        isdragactive={files.length}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current.click()}
      >
        <Typography>Drag & drop files here, or click to select</Typography>
        <input
          type="file"
          multiple
          hidden
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </DropZone>
      {previews.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
          {previews.map((p) => (
            <Paper key={p.name} sx={{ position: 'relative', width: 100, height: 100, m: 1, backgroundSize: 'cover', backgroundImage: `url(${p.src})` }}>
              <IconButton
                size="small"
                sx={{ position: 'absolute', top: 0, right: 0 }}
                onClick={() => handleRemove(p.name)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>Submit Suggestion</Button>
    </Box>
  );
};

export default SuggestionForm;