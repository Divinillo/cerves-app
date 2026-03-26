import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Modal from '../shared/Modal';

interface ListsViewProps {
  lists?: Array<{
    id: string;
    name: string;
    description: string;
    beerCount: number;
    coverImage?: string;
  }>;
}

export default function ListsView({ lists }: ListsViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [listName, setListName] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const mockLists = [
    {
      id: 'list1',
      name: 'Mis IPAs Favoritas',
      description: 'Las mejores IPAs que he probado',
      beerCount: 12,
      coverImage: 'https://via.placeholder.com/300x200',
    },
    {
      id: 'list2',
      name: 'Cervezas de Otoño',
      description: 'Cervezas perfectas para esta estación',
      beerCount: 8,
      coverImage: 'https://via.placeholder.com/300x200',
    },
    {
      id: 'list3',
      name: 'Artesanales Locales',
      description: 'Apoyando a los cerveceros españoles',
      beerCount: 15,
      coverImage: 'https://via.placeholder.com/300x200',
    },
  ];

  const displayLists = lists || mockLists;

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName.trim()) {
      alert('El nombre de la lista no puede estar vacío');
      return;
    }
    // TODO: Call API to create list
    setListName('');
    setListDescription('');
    setShowCreateModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Mis Listas</h1>
          <p className="text-slate-600 mt-1">
            Organiza tus cervezas favoritas en listas temáticas
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
        >
          <Plus size={20} />
          Nueva lista
        </button>
      </div>

      {/* Lists Grid */}
      {displayLists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayLists.map((list) => (
            <Link
              key={list.id}
              to={`/lista/${list.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Cover Image */}
              <div className="relative aspect-video bg-gradient-to-br from-amber-100 to-amber-200">
                {list.coverImage && (
                  <img
                    src={list.coverImage}
                    alt={list.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* List Info */}
              <div className="p-4">
                <h3 className="font-bold text-slate-800 text-lg">
                  {list.name}
                </h3>
                <p className="text-slate-600 text-sm mt-1">
                  {list.description}
                </p>
                <p className="text-xs text-amber-600 font-semibold mt-3">
                  {list.beerCount} cervezas
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-slate-500 text-lg">
            No hay listas creadas aún
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Crea tu primera lista para empezar a organizar tus cervezas
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-6 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Crear primera lista
          </button>
        </div>
      )}

      {/* Create List Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nueva lista"
      >
        <form onSubmit={handleCreateList} className="space-y-4">
          {/* List Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre de la lista *
            </label>
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Ej: Mis IPAs Favoritas"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              value={listDescription}
              onChange={(e) => setListDescription(e.target.value)}
              placeholder="¿Sobre qué trata esta lista?"
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Privacy */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="isPublic" className="text-sm font-medium text-slate-700">
              Lista pública
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-semibold transition"
          >
            Crear lista
          </button>
        </form>
      </Modal>
    </div>
  );
}
