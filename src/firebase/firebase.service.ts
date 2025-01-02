// firebase.service.ts
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Firestore } from '@google-cloud/firestore';

@Injectable()
export class FirebaseService {
    private firestore: Firestore;

    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(require("E:/bad self-made projects/Truvela/backend/db-firebase.json")),
        });
        this.firestore = admin.firestore();
    }

    async createDocument(collection: string, docId: string, data: any) {
        await this.firestore.collection(collection).doc(docId).set(data);
    }

    // Get all documents from a collection
    async getCollection(collectionName: string) {
        const snapshot = await this.firestore.collection(collectionName).get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return { id: doc.id, ...data };  // Spread the document data into the object
        });
    }


    // Get a document by ID from a collection
    async getDocument(collectionName: string, documentId: string) {
        const doc = await this.firestore.collection(collectionName).doc(documentId).get();
        if (!doc.exists) {
            return null;
        }
        return { id: doc.id, ...doc.data() };
    }

    // Add a document to a collection
    async addDocument(collectionName: string, documentId: string, data: any) {
        await this.firestore.collection(collectionName).doc(documentId).set(data);
    }

    // Update a document in a collection
    async updateDocument(collectionName: string, documentId: string, data: any) {
        await this.firestore.collection(collectionName).doc(documentId).update(data);
    }

    // Delete a document from a collection
    async deleteDocument(collectionName: string, documentId: string) {
        await this.firestore.collection(collectionName).doc(documentId).delete();
    }

    // Get the current user ID counter
    async getUserIdCounter() {
        const counterDoc = await this.firestore.collection('counters').doc('userIdCounter').get();
        if (!counterDoc.exists) {
            // If the counter document doesn't exist, create it with an initial value of 0
            await this.firestore.collection('counters').doc('userIdCounter').set({ counter: 0 });
            return 0;
        }
        return counterDoc.data().counter;
    }

    // Increment the user ID counter
    async incrementUserIdCounter() {
        const counterRef = this.firestore.collection('counters').doc('userIdCounter');
        await counterRef.update({
            counter: admin.firestore.FieldValue.increment(1),
        });

        const updatedCounterDoc = await counterRef.get();
        return updatedCounterDoc.data().counter;
    }
}
