import React, { useState, useEffect } from 'react';
import { PhoneCall, Mail as MailIcon } from 'lucide-react';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { Building2, Home, Users, Mail, Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import PropertyForm from '../components/admin/PropertyForm';

interface Property {
  id: string;
  title: string;
  price: string;
  area: string;
  location: string;
  images: string[];
  status: string;
  description: string;
  type: string;
  amenities?: string[];
  createdAt?: any;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: any;
}

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [showPosterForm, setShowPosterForm] = useState(false);
const [editingPoster, setEditingPoster] = useState<Property | undefined>();


  const [footerInfo, setFooterInfo] = useState({ ownerName: '', engineerName: '' });

  const [subscribers, setSubscribers] = useState<any[]>([]);

  const [about, setAbout] = useState({ story: '', imageUrl: '' });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (currentUser) fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const propertiesQuery = query(collection(db, 'plots'), orderBy('createdAt', 'desc'));
      const propertiesSnapshot = await getDocs(propertiesQuery);
      const propertiesData: Property[] = [];
      propertiesSnapshot.forEach((doc) =>
        propertiesData.push({ id: doc.id, ...doc.data() } as Property)


      );
      setProperties(propertiesData);

      const contactsQuery = query(collection(db, 'contacts'), orderBy('timestamp', 'desc'));
      const contactsSnapshot = await getDocs(contactsQuery);
      const contactsData: Contact[] = [];
      contactsSnapshot.forEach((doc) =>
        contactsData.push({ id: doc.id, ...doc.data() } as Contact)
      );
      setContacts(contactsData);

      const subscribersSnapshot = await getDocs(collection(db, 'subscribers'));
      const subscribersData: any[] = [];
      subscribersSnapshot.forEach((doc) => subscribersData.push({ id: doc.id, ...doc.data() }));
      setSubscribers(subscribersData);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleImageUpload = async (base64Image: string): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('key', '1b89022d172c644078ba8ecd91ad335b'); // api key of the imgbb.com
      formData.append('image', base64Image.split(',')[1]); // Remove base64 prefix

      const res = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      return data.data.url; // ✅ Yeh imgbb se aaya image URL hai
    } catch (error) {
      console.error('imgbb upload error:', error);
      return null;
    }
  };
  
  const handleEditPoster = (poster: Property) => {
  setEditingPoster(poster);
  setShowPosterForm(true);
};

const handleAddPoster = () => {
  setEditingPoster(undefined);
  setShowPosterForm(true);
};

  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const snapshot = await getDocs(collection(db, 'footerInfo'));
      snapshot.forEach((docu) => deleteDoc(doc(db, 'footerInfo', docu.id)));

      await addDoc(collection(db, 'footerInfo'), {
        ...footerInfo,
        createdAt: serverTimestamp(),
      });

      alert('Footer Info saved!');
      setFooterInfo({ ownerName: '', engineerName: '' });
    } catch (err) {
      console.error('Failed to save footer info:', err);
      alert('Error saving footer info.');
    }
  };

  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = about.imageUrl;

      // agar user ne new image upload ki ho (base64 format me), to imgbb pe upload karo
      if (imageUrl.startsWith('data:')) {
        const uploadedUrl = await handleImageUpload(imageUrl);
        if (!uploadedUrl) {
          alert('Image upload failed!');
          return;
        }
        imageUrl = uploadedUrl;
      }

      // purani document hata do
      const snapshot = await getDocs(collection(db, 'about'));
      snapshot.forEach((docu) => deleteDoc(doc(db, 'about', docu.id)));

      // Firestore me story + image url save karo
      await addDoc(collection(db, 'about'), {
        story: about.story,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      alert('About content saved!');
      setAbout({ story: '', imageUrl: '' }); // reset form
    } catch (err) {
      console.error('Error saving about:', err);
      alert('Failed to save About content.');
    }
  };

  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    address: '',
    businessHours: [
      { day: 'Monday', open: '09:00', close: '18:00' },
    ]
  });


  const handleContactInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const snapshot = await getDocs(collection(db, 'contactInfo'));
      snapshot.forEach((docu) => deleteDoc(doc(db, 'contactInfo', docu.id)));

      await addDoc(collection(db, 'contactInfo'), {
        ...contactInfo,
        createdAt: serverTimestamp(),
      });

      alert('Contact info saved!');
    } catch (err) {
      console.error('Failed to save contact info:', err);
      alert('Failed to save.');
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await deleteDoc(doc(db, 'plots', id));
        setProperties(properties.filter((p) => p.id !== id));
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Error deleting property. Please try again.');
      }
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteDoc(doc(db, 'contacts', id));
        setContacts(contacts.filter((c) => c.id !== id));
        setSelectedContact(null);
      } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Error deleting contact. Please try again.');
      }
    }
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowPropertyForm(true);
  };

  const handleAddProperty = () => {
    setEditingProperty(undefined);
    setShowPropertyForm(true);
  };

  const handleFormSuccess = () => {
    fetchData();
    setShowPropertyForm(false);
  };

  // if (!isAdmin) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold">Access Denied</h2>
  //         <p className="text-gray-600">You don’t have permission to access this page.</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const available = properties.filter((p) => p.status === 'available').length;
  const sold = properties.filter((p) => p.status === 'sold').length;
  const revenue = properties
    .filter((p) => p.status === 'sold')
    .reduce((acc, p) => acc + parseFloat(p.price.replace(/[^\d.]/g, '') || '0'), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {currentUser?.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<Building2 />} title="Total Properties" value={properties.length} color="blue" />
          <StatCard icon={<Home />} title="Available" value={available} color="green" />
          <StatCard icon={<TrendingUp />} title="Sold" value={sold} color="red" />
          <StatCard icon={<Mail />} title="Messages" value={contacts.length} color="purple" />
          <StatCard icon={<Users />} title="Total Subscribers" value={subscribers.length} color="purple" />


          
           <button
                onClick={handleAddProperty}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Poster</span>
              </button>
        </div>


        {/* 👇 Engineer & Owner Info Form */}
        <div className="bg-white p-6 rounded shadow mt-10">
          <h3 className="text-lg font-semibold mb-4">Update Footer Info</h3>
          <form onSubmit={handleFooterSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Owner Name"
              value={footerInfo.ownerName}
              onChange={(e) => setFooterInfo({ ...footerInfo, ownerName: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Engineer Name"
              value={footerInfo.engineerName}
              onChange={(e) => setFooterInfo({ ...footerInfo, engineerName: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="sm:col-span-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              Save Footer Info
            </button>
          </form>
        </div>


        {/* Tabs */}
        <div className="border-b mb-6">
          {['overview', 'properties', 'messages', 'contact', 'about', 'project'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 border-b-2 font-medium mr-4 ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <OverviewList title="Recent Properties" items={properties.slice(0, 5)} type="property" />
            <OverviewList title="Recent Inquiries" items={contacts.slice(0, 5)} type="contact" />
          </div>
        )}

        {/* Properties */}
        {activeTab === 'properties' && (
          <div className="bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">Properties Management</h3>
              <button
                onClick={handleAddProperty}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Property</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {properties.map((property) => (
                    <tr key={property.id}>
                      <td className="px-6 py-4 flex items-center space-x-3">
                        {property.images[0] && (
                          <img src={property.images[0]} alt={property.title} className="w-10 h-10 object-cover rounded" />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{property.title}</div>
                          <div className="text-sm text-gray-500">{property.type}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{property.location}</td>
                      <td className="px-6 py-4 text-sm">{property.price}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${property.status === 'available' ? 'bg-green-100 text-green-800' :
                            property.status === 'sold' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                          }`}>{property.status}</span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button onClick={() => handleEditProperty(property)} className="text-blue-600 hover:text-blue-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteProperty(property.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* message */}
        {activeTab === 'messages' && (
          <div className="bg-white shadow-md rounded-lg">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Contact Inquiries</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedContact(contact)}>
                      <td className="px-6 py-4">{contact.name}</td>
                      <td className="px-6 py-4">{contact.email}<br />{contact.phone}</td>
                      <td className="px-6 py-4 truncate max-w-sm">{contact.message}</td>
                      <td className="px-6 py-4">{contact.timestamp?.toDate?.()?.toLocaleDateString() || 'Recent'}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteContact(contact.id); }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'contact' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Contact Information</h2>
            <form onSubmit={handleContactInfoSubmit} className="space-y-4">

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              {/* Business Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
                <div className="space-y-3">
                  {contactInfo.businessHours.map((entry, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 items-center">
                      <select
                        value={entry.day}
                        onChange={(e) => {
                          const updated = [...contactInfo.businessHours];
                          updated[index].day = e.target.value;
                          setContactInfo({ ...contactInfo, businessHours: updated });
                        }}
                        className="border border-gray-300 rounded-md p-2"
                      >
                        <option value="">Select Day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>

                      <input
                        type="time"
                        value={entry.open}
                        onChange={(e) => {
                          const updated = [...contactInfo.businessHours];
                          updated[index].open = e.target.value;
                          setContactInfo({ ...contactInfo, businessHours: updated });
                        }}
                        className="border border-gray-300 rounded-md p-2"
                      />

                      <input
                        type="time"
                        value={entry.close}
                        onChange={(e) => {
                          const updated = [...contactInfo.businessHours];
                          updated[index].close = e.target.value;
                          setContactInfo({ ...contactInfo, businessHours: updated });
                        }}
                        className="border border-gray-300 rounded-md p-2"
                      />
                    </div>
                  ))}

                  {/* Add More Day Button */}
                  <button
                    type="button"
                    className="mt-2 text-blue-600 hover:underline text-sm"
                    onClick={() =>
                      setContactInfo({
                        ...contactInfo,
                        businessHours: [...contactInfo.businessHours, { day: '', open: '', close: '' }]
                      })
                    }
                  >
                    + Add Another Day
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                Save Contact Info
              </button>
            </form>
          </div>
        )}


        {activeTab === 'project' && (
          <div className="col-span-full text-center py-16">
            <div className="inline-flex flex-col items-center">
              <svg
                className="w-20 h-20 text-yellow-400 animate-bounce mb-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m-7.5 4h9a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5h-3.586a1.5 1.5 0 01-1.06-.44l-1.878-1.878a1.5 1.5 0 00-1.06-.44H6.75A1.5 1.5 0 005.25 3.75v16.5A1.5 1.5 0 006.75 21z"
                />
              </svg>
              <h2 className="text-3xl font-semibold text-black mb-2">Projects Coming Soon</h2>
              <p className="text-gray-400 max-w-md text-center">
                Our team is currently working on some exciting new developments. This section will be updated soon. Stay tuned!
              </p>
            </div>
          </div>
        )}


        {/* about section  */}

        {activeTab === 'about' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Manage About Content</h2>

            <form onSubmit={handleAboutSubmit} className="space-y-4">
              {/* Story */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Story</label>
                <textarea
                  rows={6}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={about.story}
                  onChange={(e) => setAbout({ ...about, story: e.target.value })}
                  required
                />
              </div>

              {/* Image Upload with Preview and Delete */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>

                {!about.imageUrl ? (
                  <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer h-40 text-gray-400 hover:border-blue-500 hover:text-blue-600 transition">
                    <span>Select Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setAbout({ ...about, imageUrl: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                ) : (
                  <div className="relative inline-block w-full max-w-sm">
                    <img
                      src={about.imageUrl}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-md shadow-md border"
                    />
                    <button
                      type="button"
                      onClick={() => setAbout({ ...about, imageUrl: '' })}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      title="Remove Image"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                Save About Info
              </button>
            </form>
          </div>
        )}


        {/* Contact Modal */}
        {selectedContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative max-h-[90vh] overflow-hidden flex flex-col">

              {/* Close Button */}
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
                onClick={() => setSelectedContact(null)}
              >
                &times;
              </button>

              {/* Header */}
              <div className="px-6 pt-6">
                <h2 className="text-xl font-semibold text-gray-800">Contact Details</h2>
              </div>

              {/* Scrollable Body */}
              <div className="overflow-y-auto px-6 py-4 text-sm sm:text-base text-gray-700 space-y-2 max-h-[65vh]">
                <p>
                  <strong className="text-gray-900">Name:</strong> {selectedContact.name}
                </p>
                <p>
                  <strong className="text-gray-900">Email:</strong> {selectedContact.email}
                </p>
                <p>
                  <strong className="text-gray-900">Phone:</strong> {selectedContact.phone}
                </p>
                <div>
                  <strong className="text-gray-900">Message:</strong>
                  <p className="mt-1 text-gray-700 break-words whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
                <p>
                  <strong className="text-gray-900">Date:</strong>{' '}
                  {selectedContact.timestamp?.toDate?.()?.toLocaleString()}
                </p>
              </div>

              {/* Footer with buttons */}
              <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
                <a
                  href={`tel:${selectedContact.phone}`}
                  className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  Call
                </a>
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm gap-2"
                >
                  <MailIcon className="w-4 h-4" />
                  Gmail
                </a>
              </div>
            </div>
          </div>
        )}


        {/* Property Form */}
        {showPropertyForm && (
          <PropertyForm property={editingProperty} onClose={() => setShowPropertyForm(false)} onSuccess={handleFormSuccess} />
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }: any) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const OverviewList = ({ title, items, type }: any) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="space-y-3">
      {items.map((item: any) => (
        <div key={item.id} className="bg-gray-50 p-3 rounded flex justify-between items-center">
          <div>
            <p className="font-medium">{type === 'property' ? item.title : item.name}</p>
            <p className="text-sm text-gray-600">{type === 'property' ? item.location : item.email}</p>
          </div>
          {type === 'property' && (
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${item.status === 'available' ? 'bg-green-100 text-green-800' :
                item.status === 'sold' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
              }`}>{item.status}</span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default AdminDashboard;
