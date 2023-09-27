import { FileInput } from '@mantine/core';
import { AiOutlineUpload } from 'react-icons/ai';

import PropTypes from 'prop-types';
import { useState } from 'react';

export default function MusicPicker({ onAdd, songs }) {
  const [error, setError] = useState(false);

  const handleFileSelect = (files) => {
    const fileNames = files.map((file) => file.name);

    const duplicatedSongs = songs.filter((song) =>
      fileNames.includes(song.file.name)
    );

    if (duplicatedSongs.length > 0) {
      setError(true);
    } else {
      onAdd(files);
    }
  };

  return (
    <FileInput
      placeholder='Pick file'
      label='Pick your songs'
      variant='filled'
      multiple
      error={error ? "don't choose duplicated songs" : ''}
      onChange={handleFileSelect}
      icon={<AiOutlineUpload />}
    />
  );
}

MusicPicker.propTypes = {
  onAdd: PropTypes.func,
  songs: PropTypes.array,
};
