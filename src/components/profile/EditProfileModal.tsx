import React, { useState } from 'react';
import { Save } from 'lucide-react';
import Modal from '../shared/Modal';
import ImageUpload from '../shared/ImageUpload';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProfileData) => void;
  currentData?: {
    username: string;
    bio: string;
    isPublic: boolean;
    avatarUrl?: string;
  };
}

interface ProfileData {
  username: string;
  bio: string;
  isPublic: boolean;
  avatar?: File;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  onSave,
  currentData,
}: EditProfileModalProps) {
  const [username, setUsername] = useState(currentData?.username || '');
  const [bio, setBio] = useState(currentData?.bio || '');
  const [isPublic, setIsPublic] = useState(currentData?.isPublic ?? true);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      alert('El nombre de usuario no puede estar vacío');
      return;
    }

    setIsLoading(true);
    try {
      await onSave({
        username,
        bio,
        isPublic,
        avatar: avatar || undefined,
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar perfil">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Avatar
          </label>
          <ImageUpload
            onFileSelected={setAvatar}
            currentUrl={currentData?.avatarUrl}
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nombre de usuario *
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="tu_usuario"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Biografía
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Cuéntanos sobre ti..."
            rows={3}
            maxLength={150}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            {bio.length}/150 caracteres
          </p>
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
            Perfil público
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-400 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {isLoading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </Modal>
  );
}
