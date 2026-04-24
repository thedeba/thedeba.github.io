import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  limit,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import admin from 'firebase-admin';

// Blog types
export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  read_time: string;
  image?: string;
}

// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  live_url: string;
  github_url: string;
  featured: boolean;
  category: string;
  created_at?: Date;
  updated_at?: Date;
}

// Speaking engagement types
export interface SpeakingEngagement {
  id: string;
  title: string;
  event: string;
  date: string;
  location: string;
  type: string;
}

// Publication types
export interface Publication {
  id: string;
  title: string;
  journal: string;
  date: string;
  authors: string;
  link: string;
}

// Contact message types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Experience types
export interface Experience {
  id: string;
  type: 'work' | 'education';
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Helper function to convert Firestore document to typed object
function convertDoc<T>(doc: DocumentData): T {
  return { id: doc.id, ...doc.data() } as T;
}

// Blog operations
export const blogOperations = {
  async getAll(): Promise<Blog[]> {
    const q = query(collection(db, 'blogs'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDoc<Blog>);
  },

  async getById(id: string): Promise<Blog | null> {
    const docRef = doc(db, 'blogs', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? convertDoc<Blog>(docSnap) : null;
  },

  async create(blog: Omit<Blog, 'id'>): Promise<Blog> {
    const docRef = await addDoc(collection(db, 'blogs'), blog);
    const newDoc = await getDoc(docRef);
    return convertDoc<Blog>(newDoc);
  },

  async update(id: string, updates: Partial<Blog>): Promise<Blog> {
    const docRef = doc(db, 'blogs', id);
    await updateDoc(docRef, updates);
    const updatedDoc = await getDoc(docRef);
    return convertDoc<Blog>(updatedDoc);
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'blogs', id);
    await deleteDoc(docRef);
  }
};

// Project operations
export const projectOperations = {
  async getAll(): Promise<Project[]> {
    const q = query(collection(db, 'projects'));
    const querySnapshot = await getDocs(q);
    const projects = querySnapshot.docs.map(convertDoc<Project>);
    
    // Sort manually: featured projects first, then by created_at (newest first)
    return projects.sort((a, b) => {
      // First sort by featured (true comes first)
      if (a.featured !== b.featured) {
        return b.featured ? 1 : -1;
      }
      
      // Then sort by created_at (newest first)
      const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bDate - aDate;
    });
  },

  async getById(id: string): Promise<Project | null> {
    const docRef = doc(db, 'projects', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? convertDoc<Project>(docSnap) : null;
  },

  async create(project: Omit<Project, 'id'>): Promise<Project> {
    console.log('Creating project with data:', project);
    console.log('Admin Firestore DB initialized:', !!admin.firestore());
    try {
      // Use admin database for writes (bypasses security rules)
      const adminDb = admin.firestore();
      const docRef = await adminDb.collection('projects').add(project);
      console.log('Project created with ID:', docRef.id);
      const newDoc = await adminDb.collection('projects').doc(docRef.id).get();
      return convertDoc<Project>(newDoc);
    } catch (adminError) {
      console.error('Admin DB write failed, trying client DB:', adminError);
      // Fallback to client database
      const docRef = await addDoc(collection(db, 'projects'), project);
      console.log('Project created with ID (client):', docRef.id);
      const newDoc = await getDoc(docRef);
      return convertDoc<Project>(newDoc);
    }
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    const docRef = doc(db, 'projects', id);
    await updateDoc(docRef, updates);
    const updatedDoc = await getDoc(docRef);
    return convertDoc<Project>(updatedDoc);
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'projects', id);
    await deleteDoc(docRef);
  }
};

// Speaking engagement operations
export const speakingEngagementOperations = {
  async getAll(): Promise<SpeakingEngagement[]> {
    const q = query(collection(db, 'speaking_engagements'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDoc<SpeakingEngagement>);
  },

  async getById(id: string): Promise<SpeakingEngagement | null> {
    const docRef = doc(db, 'speaking_engagements', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? convertDoc<SpeakingEngagement>(docSnap) : null;
  },

  async create(engagement: Omit<SpeakingEngagement, 'id'>): Promise<SpeakingEngagement> {
    const docRef = await addDoc(collection(db, 'speaking_engagements'), engagement);
    const newDoc = await getDoc(docRef);
    return convertDoc<SpeakingEngagement>(newDoc);
  },

  async update(id: string, updates: Partial<SpeakingEngagement>): Promise<SpeakingEngagement> {
    const docRef = doc(db, 'speaking_engagements', id);
    await updateDoc(docRef, updates);
    const updatedDoc = await getDoc(docRef);
    return convertDoc<SpeakingEngagement>(updatedDoc);
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'speaking_engagements', id);
    await deleteDoc(docRef);
  }
};

// Publication operations
export const publicationOperations = {
  async getAll(): Promise<Publication[]> {
    const q = query(collection(db, 'publications'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDoc<Publication>);
  },

  async getById(id: string): Promise<Publication | null> {
    const docRef = doc(db, 'publications', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? convertDoc<Publication>(docSnap) : null;
  },

  async create(publication: Omit<Publication, 'id'>): Promise<Publication> {
    const docRef = await addDoc(collection(db, 'publications'), publication);
    const newDoc = await getDoc(docRef);
    return convertDoc<Publication>(newDoc);
  },

  async update(id: string, updates: Partial<Publication>): Promise<Publication> {
    const docRef = doc(db, 'publications', id);
    await updateDoc(docRef, updates);
    const updatedDoc = await getDoc(docRef);
    return convertDoc<Publication>(updatedDoc);
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'publications', id);
    await deleteDoc(docRef);
  }
};

// Combined operations for speaking publications
export const speakingPublicationsOperations = {
  async getAll() {
    const [speakingEngagements, publications] = await Promise.all([
      speakingEngagementOperations.getAll(),
      publicationOperations.getAll()
    ]);
    
    return {
      speakingEngagements,
      publications
    };
  },

  async updateAll(data: { speakingEngagements: SpeakingEngagement[], publications: Publication[] }) {
    // For Firestore, we'll update each document individually
    const speakingPromises = data.speakingEngagements.map(engagement => 
      speakingEngagementOperations.update(engagement.id, engagement)
    );
    
    const publicationPromises = data.publications.map(publication => 
      publicationOperations.update(publication.id, publication)
    );
    
    await Promise.all([...speakingPromises, ...publicationPromises]);
    
    return {
      speakingEngagements: data.speakingEngagements,
      publications: data.publications
    };
  }
};

// Contact message operations
export const contactMessageOperations = {
  async getAll(): Promise<ContactMessage[]> {
    const q = query(collection(db, 'contact_messages'), orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDoc<ContactMessage>);
  },

  async getById(id: string): Promise<ContactMessage | null> {
    const docRef = doc(db, 'contact_messages', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? convertDoc<ContactMessage>(docSnap) : null;
  },

  async create(message: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at'>): Promise<ContactMessage> {
    const newMessage = {
      ...message,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, 'contact_messages'), newMessage);
    const newDoc = await getDoc(docRef);
    return convertDoc<ContactMessage>(newDoc);
  },

  async update(id: string, updates: Partial<ContactMessage>): Promise<ContactMessage> {
    const docRef = doc(db, 'contact_messages', id);
    const updateData = {
      ...updates,
      updated_at: Timestamp.now()
    };
    await updateDoc(docRef, updateData);
    const updatedDoc = await getDoc(docRef);
    return convertDoc<ContactMessage>(updatedDoc);
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'contact_messages', id);
    await deleteDoc(docRef);
  },

  async getUnreadCount(): Promise<number> {
    const q = query(
      collection(db, 'contact_messages'), 
      where('status', '==', 'unread')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  }
};

// Experience operations
export const experienceOperations = {
  async getAll(): Promise<Experience[]> {
    const q = query(collection(db, 'experiences'), orderBy('period', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDoc<Experience>);
  },

  async getById(id: string): Promise<Experience | null> {
    const docRef = doc(db, 'experiences', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? convertDoc<Experience>(docSnap) : null;
  },

  async create(experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>): Promise<Experience> {
    const newExperience = {
      ...experience,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, 'experiences'), newExperience);
    const newDoc = await getDoc(docRef);
    return convertDoc<Experience>(newDoc);
  },

  async update(id: string, updates: Partial<Experience>): Promise<Experience> {
    const docRef = doc(db, 'experiences', id);
    const updateData = {
      ...updates,
      updated_at: Timestamp.now()
    };
    await updateDoc(docRef, updateData);
    const updatedDoc = await getDoc(docRef);
    return convertDoc<Experience>(updatedDoc);
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'experiences', id);
    await deleteDoc(docRef);
  }
};
