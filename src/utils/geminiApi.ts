// src/utils/geminiApi.ts
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const GEMINI_API_KEY = 'AIzaSyAAsmTUT8dJeXytz0JEH4jjodSfZoCixIw'; // replace with your real key

export const sendToGemini = async (userMessage: string): Promise<string> => {
  try {
    // Fetch properties
    const propSnap = await getDocs(collection(db, 'plots'));
    const properties: any[] = [];
    propSnap.forEach(doc => properties.push(doc.data()));

    // Fetch contact info
    const contactSnap = await getDocs(collection(db, 'contactInfo'));
    const contactData = contactSnap.docs[0]?.data();

    // Fetch footer info
    const footerSnap = await getDocs(collection(db, 'footerInfo'));
    const footerData = footerSnap.docs[0]?.data();

    // Format properties for prompt
    const propertyDetails = properties
      .map((p, i) => `${i + 1}. ${p.title} - ₹${p.price}, ${p.location}`)
      .join('\n');

    const context = `
You are AskGohit, a helpful assistant for Gohit Properties.

Here is the current data:

🏘️ Available Properties:
${propertyDetails || 'No property data found.'}

📞 Contact Info:
Phone: ${contactData?.phone || 'N/A'}
Email: ${contactData?.email || 'N/A'}

👤 Team Info:
Owner: ${footerData?.ownerName || 'N/A'}
Engineer: ${footerData?.engineerName || 'N/A'}

Only answer questions related to the above data.
Question: ${userMessage}
    `.trim();

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: context }] }],
        }),
      }
    );

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || "Sorry, I couldn't find an answer.";
  } catch (err) {
    console.error('Gemini error:', err);
    return 'Something went wrong while contacting Gohit AI.';
  }
};
