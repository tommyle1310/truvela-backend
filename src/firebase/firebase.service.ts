import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Firestore } from '@google-cloud/firestore';

@Injectable()
export class FirebaseService {
    private firestore: Firestore;

    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)),
        });
        this.firestore = admin.firestore();
    }

    // Method to get the count of documents in a collection
    async getCollectionCount(
        collectionName: string,
        field?: string,  // Optional parameter to filter by field
        value?: string   // Optional parameter to filter by field value
    ): Promise<number> {
        try {
            // Start with the collection reference
            let query: FirebaseFirestore.Query = this.firestore.collection(collectionName);

            // If field and value are provided, apply the query filter
            if (field && value) {
                console.log(`Querying collection '${collectionName}' where ${field} == ${value}`);
                query = query.where(field, '==', value);  // Apply the 'where' filter
            }

            // Get the snapshot from Firestore
            const snapshot = await query.get();

            // Return the size of the snapshot (number of documents)
            return snapshot.size;
        } catch (error) {
            console.error('Error fetching collection count:', error);
            throw new Error('Failed to fetch collection count');
        }
    }


    // Method to fetch a paginated list of documents from a collection
    async getCollectionWithPagination(
        collectionName: string,
        orderByField: string,
        orderDirection: 'asc' | 'desc' = 'desc', // Default to descending order
        limitCount: number,
        offsetCount: number
    ): Promise<FirebaseFirestore.DocumentData[]> {
        try {
            let query: FirebaseFirestore.Query = this.firestore.collection(collectionName);

            // Order by the given field and direction
            query = query.orderBy(orderByField, orderDirection);

            // Apply pagination (limit and offset)
            query = query.limit(limitCount).offset(offsetCount);

            // Get the snapshot from Firestore
            const snapshot = await query.get();

            // Map the snapshot to return documents with their IDs and data
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return { id: doc.id, ...data };
            });
        } catch (error) {
            console.error('Error fetching paginated collection:', error);
            throw new Error('Failed to fetch paginated collection');
        }
    }

    async getCollection(
        collectionName: string,
        orderByField?: string,
        orderDirection: 'asc' | 'desc' = 'desc', // Default order direction is descending
        limitCount?: number
    ): Promise<FirebaseFirestore.DocumentData[]> {
        let query: FirebaseFirestore.Query = this.firestore.collection(collectionName);

        // Apply ordering if orderByField is provided
        if (orderByField) {
            query = query.orderBy(orderByField, orderDirection);
        }

        // Apply limit if limitCount is provided
        if (limitCount) {
            query = query.limit(limitCount);
        }

        // Now fetch the data from the query and get the snapshot
        const snapshot = await query.get(); // This fetches the result of the query

        // Map the snapshot to an array of document data
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return { id: doc.id, ...data };  // Attach the document ID to the data
        });
    }



    // Add a method to query Firestore collections
    async queryCollection(
        collectionName: string,
        field?: string,
        value?: string | number,
        limitCount?: number // Add limitCount as an optional parameter
    ): Promise<FirebaseFirestore.DocumentData[]> {
        // Start with the collection reference
        let query: FirebaseFirestore.Query = this.firestore.collection(collectionName);

        // If field and value are provided, apply the query filter
        if (field && value) {
            console.log(`Querying collection '${collectionName}' where ${field} == ${value}`);
            query = query.where(field, '==', value); // Apply the 'where' filter
        }

        // Apply the limit if limitCount is provided
        if (limitCount) {
            query = query.limit(limitCount); // Limit the number of documents returned
        }

        // Execute the query and get the snapshot of matching documents
        const snapshot = await query.get();

        // If no documents are found, log it
        if (snapshot.empty) {
            console.log(`No documents found for query ${field} == ${value}`);
            return [];
        }

        // Log the retrieved documents for debugging
        console.log(`Found ${snapshot.size} document(s)`);

        // Return the documents' data as an array of objects
        return snapshot.docs.map(doc => {
            console.log('Document data:', doc.data());
            return doc.data();
        });
    }





    /**
     * General function to perform Firestore operations (Create/Read/Update/Delete)
     * @param collectionName The collection name in Firestore
     * @param docId The document ID
     * @param data The data to set/update (optional for read/delete)
     * @param operation The operation to perform ('create', 'update', 'get', 'delete')
     */
    async performFirestoreOperation(collection: string, docId: string, data: any, operation: string) {
        try {
            switch (operation) {
                case 'create':
                    return await this.firestore.collection(collection).doc(docId).set(data);  // This might be where the error is happening
                case 'update':
                    return await this.firestore.collection(collection).doc(docId).update(data);
                case 'get':
                    return await this.firestore.collection(collection).doc(docId).get();
                case 'delete':
                    return await this.firestore.collection(collection).doc(docId).delete();
                default:
                    throw new Error('Invalid operation');
            }
        } catch (error) {
            throw new Error(`Firestore operation failed: ${error.message}`);
        }
    }



    // Wrapper function for create operation
    async createDocument(collection: string, docId: string, data: any) {
        await this.firestore.collection(collection).doc(docId).set(data);
    }

    // Wrapper function for update operation
    async updateDocument(collectionName: string, docId: string, data: any) {
        await this.performFirestoreOperation(collectionName, docId, data, 'update');
    }

    // Wrapper function for get operation
    async getDocument(collectionName: string, documentId: string) {
        const doc = await this.firestore.collection(collectionName).doc(documentId).get();

        // If the document doesn't exist, return null
        if (!doc.exists) {
            return null;
        }

        // Return only the document data
        return doc.data();
    }


    // Wrapper function for delete operation
    async deleteDocument(collectionName: string, docId: string) {
        await this.performFirestoreOperation(collectionName, docId, undefined, 'delete');
    }

    /**
     * Increment a specific counter in Firestore
     * @param counterName The counter document name (e.g., 'userIdCounter')
     */
    // Increment the counter value or create it if not exists
    async incrementCounter(counterName: string) {
        const counterRef = this.firestore.collection('counters').doc(counterName);

        // Check if the counter document exists
        const counterDoc = await counterRef.get();

        if (!counterDoc.exists) {
            // If the counter document doesn't exist, create it with an initial value of 1
            await counterRef.set({ counter: 1 });
            return 1;
        }

        // If the counter exists, increment it atomically
        await counterRef.update({
            counter: admin.firestore.FieldValue.increment(1),
        });

        // Fetch the updated counter value
        const updatedCounterDoc = await counterRef.get();
        return updatedCounterDoc.data()?.counter;
    }
}
