import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTracks, addTrack, updateTrack, removeTrack, setLoading } from '../store/tracksSlice';
import { useTracks } from '../hooks/useTracks';
import Input from '../components/Input';
import Loader from '../components/Loader';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector(state => state.tracks);
  const { fetchTracks, createTrack, updateTrack: updateTrackAPI, deleteTrack } = useTracks();
  
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const loadTracks = async () => {
      dispatch(setLoading(true));
      const tracks = await fetchTracks();
      dispatch(setTracks(tracks));
    };
    loadTracks();
  }, [dispatch, fetchTracks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

    if (editingId) {
      const updated = await updateTrackAPI(editingId, { title, genre, notes });
      dispatch(updateTrack(updated));
      setEditingId(null);
    } else {
      const newTrack = await createTrack({ title, genre, notes });
      dispatch(addTrack(newTrack));
    }
    setTitle('');
    setGenre('');
    setNotes('');
  };

  const handleEdit = (track) => {
    setTitle(track.title);
    setGenre(track.genre);
    setNotes(track.notes);
    setEditingId(track._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить этот трек?')) {
      await deleteTrack(id);
      dispatch(removeTrack(id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <Loader />;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>🎵 Music Hub</h1>
        <button onClick={handleLogout}>Выйти ({user?.name})</button>
      </div>

      <div className="card">
        <h2>{editingId ? '✏️ Редактировать трек' : '➕ Добавить новый трек'}</h2>
        <form onSubmit={handleSubmit}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название трека"
            required
          />
          <Input
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="Жанр"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Заметки"
            rows="3"
          />
          <button type="submit">{editingId ? 'Обновить' : 'Создать'}</button>
          {editingId && (
            <button type="button" onClick={() => {
              setEditingId(null);
              setTitle('');
              setGenre('');
              setNotes('');
            }}>
              Отмена
            </button>
          )}
        </form>
      </div>

      {list.map(track => (
        <div key={track._id} className="card">
          <h3 style={{ cursor: 'pointer' }} onClick={() => navigate(`/track/${track._id}`)}>
            {track.title}
          </h3>
          {track.genre && <span className="badge">{track.genre}</span>}
          {track.notes && <p>{track.notes.substring(0, 100)}</p>}
          <button onClick={() => handleEdit(track)}>Редактировать</button>
          <button className="danger" onClick={() => handleDelete(track._id)}>Удалить</button>
        </div>
      ))}
    </div>
  );
};

export default DashboardPage;