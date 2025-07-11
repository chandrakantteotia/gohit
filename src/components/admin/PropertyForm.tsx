import React, { useState } from 'react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { X, Upload, Trash2 } from 'lucide-react';

interface Property {
  id?: string;
  title: string;
  price: string;
  area: string;
  location: string;
  images: string[];
  status: string;
  description: string;
  type: string;
  amenities: string[];
  naksha?: string;
}

interface PropertyFormProps {
  property?: Property;
  onClose: () => void;
  onSuccess: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ property, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<Property>({
    title: property?.title || '',
    price: property?.price || '',
    area: property?.area || '',
    location: property?.location || '',
    images: property?.images || [],
    status: property?.status || 'available',
    description: property?.description || '',
    type: property?.type || 'plot',
    amenities: property?.amenities || [],
    naksha: property?.naksha || ''
  });
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [layoutFile, setLayoutFile] = useState<File | null>(null);
  const [newAmenity, setNewAmenity] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
    }
  };

  const handleLayoutUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLayoutFile(e.target.files[0]);
    }
  };

  const removeImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else {
      const adjustedIndex = index - formData.images.length;
      setImageFiles(prev => prev.filter((_, i) => i !== adjustedIndex));
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const uploadToImgbb = async (file: File): Promise<string> => {
    const apiKey = '1b89022d172c644078ba8ecd91ad335b';//imgbb api key
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    return data.data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        imageUrls = await Promise.all(imageFiles.map(uploadToImgbb));
      }

      let layoutUrl = formData.naksha;
      if (layoutFile) {
        layoutUrl = await uploadToImgbb(layoutFile);
      }

      const finalData: any = {
        ...formData,
        images: [...formData.images, ...imageUrls],
        naksha: layoutUrl,
        updatedAt: serverTimestamp()
      };

      if (!property?.id) {
        finalData.createdAt = serverTimestamp();
      }

      if (property?.id) {
        await updateDoc(doc(db, 'plots', property.id), finalData);
      } else {
        await addDoc(collection(db, 'plots'), finalData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Error saving property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">
            {property ? 'Edit Property' : 'Add New Property'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" className="border p-2 rounded" required />
            <input name="price" value={formData.price} onChange={handleInputChange} placeholder="Price" className="border p-2 rounded" required />
            <input name="area" value={formData.area} onChange={handleInputChange} placeholder="Area" className="border p-2 rounded" required />
            <input name="location" value={formData.location} onChange={handleInputChange} placeholder="Location" className="border p-2 rounded" required />
            <select name="status" value={formData.status} onChange={handleInputChange} className="border p-2 rounded">
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
            <select name="type" value={formData.type} onChange={handleInputChange} className="border p-2 rounded">
              <option value="plot">Plot</option>
              <option value="house">House</option>
              <option value="flat">Flat</option>
            </select>
          </div>
          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="border p-2 rounded w-full" rows={3} />

          {/* Plot Layout Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plot Layout (optional)</label>
            <input type="file" accept="image/*" onChange={handleLayoutUpload} className="border p-2 rounded w-full" />
            {layoutFile && <p className="text-sm text-gray-600 mt-1">Selected: {layoutFile.name}</p>}
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
            <div className="flex space-x-2 mb-2">
              <input type="text" value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)} className="border p-2 rounded w-full" placeholder="Enter amenity" />
              <button type="button" onClick={addAmenity} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, index) => (
                <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {amenity}
                  <button type="button" onClick={() => removeAmenity(index)} className="text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center">
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <span className="text-gray-600">Click to upload images</span>
              </label>
            </div>
            {(formData.images.length > 0 || imageFiles.length > 0) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image} alt={`Property ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    <button type="button" onClick={() => removeImage(index, true)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {imageFiles.map((file, index) => (
                  <div key={`new-${index}`} className="relative">
                    <img src={URL.createObjectURL(file)} alt={`New ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    <button type="button" onClick={() => removeImage(formData.images.length + index, false)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Saving...' : property ? 'Update Property' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;
