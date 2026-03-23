import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App | null = null;
  private readonly logger = new Logger(FirebaseService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
    let privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');

    if (privateKey) {
      // Handle literal \n strings, remove extra quotes if they exist
      privateKey = privateKey.replace(/\\n/g, '\n').replace(/^"|"$/g, '');
    }

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn('Firebase credentials not fully configured. Google login will be unavailable.');
      return;
    }

    try {
      if (!admin.apps.length) {
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      } else {
        this.firebaseApp = admin.app();
      }
      this.logger.log('Firebase initialized successfully.');
    } catch (error) {
      this.logger.error('Firebase initialization failed. Google login will be unavailable.', error.message);
      this.firebaseApp = null;
    }
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    if (!this.firebaseApp) {
      throw new Error('Firebase is not initialized. Google login is unavailable.');
    }
    try {
      return await this.firebaseApp.auth().verifyIdToken(idToken);
    } catch (error) {
      throw error;
    }
  }
}
