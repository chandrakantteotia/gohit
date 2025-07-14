import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface Poster {
  id?: string;
  title: string;
  image: string;
}

interface Props {
  poster?: Poster;
  onClose: () => void;
  onSuccess: () => void;
}

const PosterForm: React.FC<Props> = ({ poster, onClose, onSuccess }) => {
  const [title, setTitle] = useState(poster?.title || '');
  const [image, setImage] = useState(poster?.image || '');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (base64Image: string): Promise<string | null> => {
    const formData = new FormData();
    formData.append('image', base64Image.split(',')[1]);

    try {
      const res = await fetch(
        'https://api.imgbb.com/1/upload?key=1b89022d172c644078ba8ecd91ad335b', // ✅ API key in URL
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Upload failed:', errorText);
        return null;
      }

      const data = await res.json();
      console.log('Uploaded Image URL:', data?.data?.url);
      return data?.data?.url;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImage = image;

      // Only upload if it's a new base64 image
      if (image.startsWith('data:')) {
        const uploaded = await handleImageUpload(image);
        if (!uploaded) {
          alert('Image upload failed!');
          setLoading(false);
          return;
        }
        finalImage = uploaded;
      }

      if (poster?.id) {
        // Update existing poster
        await updateDoc(doc(db, 'posters', poster.id), {
          title,
          image: finalImage,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Add new poster
        await addDoc(collection(db, 'posters'), {
          title,
          image: finalImage,
          createdAt: serverTimestamp(),
        });
      }

      alert('Poster saved successfully!');
      onSuccess();
    } catch (err) {
      console.error('Error saving poster:', err);
      alert('Failed to save poster.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-xl">×</button>
        <h2 className="text-xl font-bold mb-4">{poster ? 'Edit Poster' : 'Add Poster'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Poster Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          {/* Image Upload + Preview */}
          {!image ? (
            <label className="border-dashed border-2 border-gray-300 p-4 text-center cursor-pointer block rounded">
              <span>Select Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          ) : (
            <div className="relative">
              <img src={image} alt="Poster" className="w-full h-48 object-cover rounded" />
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full text-sm"
                onClick={() => setImage('')}
              >
                ×
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Saving...' : poster ? 'Update Poster' : 'Add Poster'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PosterForm;
