import { applyActionCode } from 'firebase/auth';
import { auth } from '../config/firebase';

export async function verifyEmail(oobCode: string): Promise<void> {
  await applyActionCode(auth, oobCode);
}