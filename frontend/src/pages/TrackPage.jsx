import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrackById, clearCurrentTrack } from '../store/tracksSlice';
import Loader from '../components/Loader';

const TrackPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTrack: track, loading } = useSelector(state => state.tracks);

  useEffect(() => {
    dispatch(fetchTrackById(id));
    return () => {
      dispatch(clearCurrentTrack());
    };
  }, [dispatch, id]);

  if (loading) return <Loader />;
  
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
          <h3>📝 Заметки</h3>
          <p style={{ color: '#555', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {track.notes || 'Нет заметок.'}
          </p>
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <h3>📅 Создан</h3>
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