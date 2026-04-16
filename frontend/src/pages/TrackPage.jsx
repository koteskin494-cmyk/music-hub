import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTracks } from '../hooks/useTracks';
import Loader from '../components/Loader';

const TrackPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchTracks, loading: fetching } = useTracks();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrack = async () => {
      const tracks = await fetchTracks();
      const found = tracks.find(t => t._id === id);
      setTrack(found);
      setLoading(false);
    };
    loadTrack();
  }, [id, fetchTracks]);

  if (loading || fetching) return <Loader />;
  
  if (!track) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Трек не найден</h2>
          <button onClick={() => navigate('/')}>На главную</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <button onClick={() => navigate('/')} style={{ marginBottom: 20 }}>← На главную</button>
        
        <h1 style={{ marginBottom: 20 }}>{track.title}</h1>
        
        {track.genre && <span className="badge">{track.genre}</span>}
        
        <div style={{ marginBottom: 20 }}>
          <h3> Заметки</h3>
          <p style={{ color: '#555', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {track.notes || 'Нет заметок.'}
          </p>
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <h3> Создан</h3>
          <p style={{ color: '#777' }}>
            {new Date(track.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <button onClick={() => navigate('/')}>Редактировать</button>
      </div>
    </div>
  );
};

export default TrackPage;