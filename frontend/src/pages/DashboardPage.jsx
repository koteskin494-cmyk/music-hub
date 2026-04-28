import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTracks, createTrack, updateTrack, deleteTrack } from '../store/tracksSlice';
import Loader from '../components/Loader';
import Input from '../components/Input';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector(state => state.tracks);
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    loadTracks();
  }, [search, sortBy, sortOrder]);

  const loadTracks = () => {
    dispatch(fetchTracks({ search, sortBy, order: sortOrder }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      await dispatch(updateTrack({ id: editingId, trackData: { title, genre, notes } }));
      setEditingId(null);
    } else {
      await dispatch(createTrack({ title, genre, notes }));
    }
    setTitle('');
    setGenre('');
    setNotes('');
  };

  const handleEdit = (track) => {
    setTitle(track.title);
    setGenre(track.genre || '');
    setNotes(track.notes || '');
    setEditingId(track._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить этот трек?')) {
      await dispatch(deleteTrack(id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading && list.length === 0) return <Loader />;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>🎵 Music Hub</h1>
        <button onClick={handleLogout}>Выйти ({user?.name})</button>
      </div>

  
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Поиск по трекам..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 2 }}
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">По дате</option>
            <option value="title">По названию</option>
            <option value="genre">По жанру</option>
          </select>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="desc">↓ Сначала новые</option>
            <option value="asc">↑ Сначала старые</option>
          </select>
        </div>
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

     
      <h2 style={{ marginBottom: 15 }}>Мои треки ({list.length})</h2>
      
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

      {list.length === 0 && !loading && (
        <div className="card" style={{ textAlign: 'center' }}>
          🎸 Пока нет треков. Создайте свой первый трек!
        </div>
      )}
    </div>
  );
};

export default DashboardPage;