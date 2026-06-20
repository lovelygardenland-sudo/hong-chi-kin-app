import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import type { Booking } from '@shared/data/seed';
import { db, firebaseEnabled } from './firebase';

const LOCAL_KEY = 'hck_customer_bookings';

export type CustomerBookingInput = Omit<
  Booking,
  'id' | 'memberId' | 'status' | 'createdAt'
>;

export async function createCustomerBooking(input: CustomerBookingInput) {
  const booking = {
    ...input,
    memberId: `web-${Date.now()}`,
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
    source: 'customer-web',
  };

  if (firebaseEnabled && db) {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...booking,
      createdAt: serverTimestamp(),
    });
    return { ...booking, id: docRef.id };
  }

  const localBooking = { ...booking, id: `local-${Date.now()}` };
  const current = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]');
  localStorage.setItem(LOCAL_KEY, JSON.stringify([localBooking, ...current]));
  return localBooking;
}
