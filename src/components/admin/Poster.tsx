import React, { useState } from 'react';

interface PosterFormProps {
  poster?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const PosterForm: React.FC<PosterFormProps> = ({ poster, onClose, onSuccess }) => {
  const [images, setImages] = useState<string[]>(poster?.images || []);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const formData = new FormData();
        formData.append('key', '1b89022d172c644078ba8ecd91ad335b');
        formData.append('image', base64.split(',')[1]);

        const res = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        setImages([...images, data.data.url]);
      } catch (err) {
        alert('Image upload failed!');
        console.error(err);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-3 right-4 text-2xl text-gray-600 hover:text-red-600">&times;</button>

        <h2 className="text-xl font-semibold mb-4">{poster ? 'Edit Poster' : 'Add New Poster'}</h2>

        {/* 👇 Image Upload Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
        </div>

        {/* 👇 Preview Uploaded Images */}
        <div className="flex flex-wrap gap-4 mb-4">
          {images.map((url, index) => (
            <div key={index} className="relative w-24 h-24">
              <img src={url} alt="Uploaded" className="w-full h-full object-cover rounded" />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* 🔽 Add other form fields here if needed */}

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => {
            console.log(images); // Final image array
            onSuccess();
          }}
        >
          {poster ? 'Update Poster' : 'Add Poster'}
        </button>
      </div>
    </div>
  );
};

export default PosterForm;
