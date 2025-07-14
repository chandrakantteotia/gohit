// import { useEffect, useState } from "react";
// import { db, storage } from "../firebase/config";
// import { ref as dbRef, get } from "firebase/database";
// import { ref as storageRef, getDownloadURL } from "firebase/storage";

// const ImageGallery = () => {
//   const [images, setImages] = useState<string[]>([]);

//   useEffect(() => {
//     const loadAll = async () => {
//       const snapshot = await get(dbRef(db, "uploadedImages"));
//       const list: string[] = [];

//       const promises: Promise<void>[] = [];

//       snapshot.forEach(child => {
//         const { path } = child.val();
//         const p = getDownloadURL(storageRef(storage, path)).then((url) => {
//           list.unshift(url);
//         });
//         promises.push(p);
//       });

//       await Promise.all(promises);
//       setImages(list);
//     };

//     loadAll();
//   }, []);

//   return (
//     <div>
//       <h2>🖼️ All Posters</h2>
//       <div style={{ display: "flex", flexWrap: "wrap" }}>
//         {images.map((url, idx) => (
//           <img key={idx} src={url} alt="" style={{ width: 200, margin: 10 }} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ImageGallery;
