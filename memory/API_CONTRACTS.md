# Data & API Contracts
Owner: tech-lead. Backend (Firestore rules/indexes/converters) implements, frontend consumes. The contract wins.

Conventions:
- Storage: Cloud Firestore collections & subcollections (`collection/{docId}`), accessed via typed `FirestoreDataConverter<T>` in `src/api/`
- Auth: Firebase Authentication (`FacebookAuthProvider`); rules enforce `request.auth != null` and `request.auth.uid` ownership or custom claims
- Timestamps: Firestore `Timestamp` (server `serverTimestamp()` on writes, converted at repository boundary)
- Errors: Firebase `FirebaseError` codes (`permission-denied`, `not-found`, `unauthenticated`, `auth/account-exists-with-different-credential`, `auth/popup-closed-by-user`) → frontend maps to user-friendly text

---
<!--
## TS-001 User Profile (`users/{uid}`)
Access: Authenticated owner only (`request.auth.uid == uid`)
Indexes: none (direct document lookup)

Document Type:
```ts
export type UserProfile = {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  provider: 'facebook.com';
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
```
Security Rule:
- `read`: `request.auth != null && request.auth.uid == uid`
- `create`: `request.auth != null && request.auth.uid == uid && request.resource.data.uid == uid`
- `update`: `request.auth != null && request.auth.uid == uid && request.resource.data.uid == resource.data.uid`
- `delete`: `false`

Errors: `permission-denied` · `unauthenticated` · `not-found`
-->
