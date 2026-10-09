import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from './firebase';

export async function getBlogs() {
  try {
    const snapshot = await getDocs(collection(db, 'blogs'));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const q = query(collection(db, 'blogs'), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export async function createBlog(data: any) {
  return await addDoc(collection(db, 'blogs'), data);
}

export async function updateBlog(id: string, data: any) {
  return await updateDoc(doc(db, 'blogs', id), data);
}

export async function deleteBlog(id: string) {
  return await deleteDoc(doc(db, 'blogs', id));
}

export async function getMembers() {
  try {
    const snapshot = await getDocs(collection(db, 'members'));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
}

export async function createMember(data: any) {
  return await addDoc(collection(db, 'members'), data);
}

export async function deleteMember(id: string) {
  return await deleteDoc(doc(db, 'members', id));
}
