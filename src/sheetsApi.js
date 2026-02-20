/**
 * Firestore — Save team registration data
 */

import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const COLLECTION_NAME = 'team_registrations';

/**
 * Submit team registration data to Firestore.
 * @param {string} teamId
 * @param {Array<{nickname: string, serial: string, email: string}>} operatives
 * @returns {Promise<{success: boolean, docId?: string, error?: string}>}
 */
export async function submitToFirestore(teamId, operatives) {
    try {
        const doc = {
            teamId: teamId.trim(),
            operatives: operatives.map((op) => ({
                nickname: op.nickname?.trim() || '',
                serial: op.serial?.trim() || '',
                email: op.email?.trim() || '',
            })),
            createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, COLLECTION_NAME), doc);
        console.log('[Firestore] Saved with ID:', docRef.id);
        return { success: true, docId: docRef.id };
    } catch (err) {
        console.error('[Firestore] Save failed:', err);
        return { success: false, error: err.message };
    }
}
