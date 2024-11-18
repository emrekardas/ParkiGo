// Firebase Authentication hata mesajlarını kullanıcı dostu mesajlara çevirir
export const getFirebaseErrorMessage = (code: string): string => {
  switch (code) {
    // Authentication Errors
    case 'auth/user-not-found':
      return 'No user found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/email-already-in-use':
      return 'Email address is already in use.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'Operation not allowed.';
    case 'auth/popup-closed-by-user':
      return 'Google sign in was cancelled.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/requires-recent-login':
      return 'Please log in again to continue.';
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please try again.';
    case 'auth/invalid-verification-code':
      return 'Invalid verification code.';
    case 'auth/invalid-verification-id':
      return 'Invalid verification ID.';
    case 'auth/missing-verification-code':
      return 'Please enter verification code.';
    case 'auth/missing-verification-id':
      return 'Missing verification ID.';
    case 'auth/google-account':
      return 'This email is registered with Google. Please use the "Continue with Google" button to sign in.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email. Please sign in using the correct method.';
    case 'auth/cancelled-popup-request':
      return 'The sign-in process was cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/timeout':
      return 'The operation has timed out. Please try again.';
    case 'auth/internal-error':
      return 'An internal error occurred. Please try again later.';

    // Firestore Errors
    case 'permission-denied':
      return 'You do not have permission to perform this action.';
    case 'not-found':
      return 'The requested resource was not found.';
    case 'already-exists':
      return 'The document already exists.';
    case 'failed-precondition':
      return 'Operation was rejected. Please try again.';
    case 'aborted':
      return 'The operation was aborted. Please try again.';
    case 'out-of-range':
      return 'Operation was attempted past the valid range.';
    case 'unimplemented':
      return 'Operation is not implemented or supported.';
    case 'resource-exhausted':
      return 'Quota exceeded or system limits reached. Please try again later.';
    case 'cancelled':
      return 'Operation was cancelled.';
    case 'data-loss':
      return 'Unrecoverable data loss or corruption.';
    case 'unknown':
      return 'An unknown error occurred. Please try again.';
    case 'invalid-argument':
      return 'Invalid argument provided.';
    case 'deadline-exceeded':
      return 'Operation timed out. Please try again.';
    case 'unauthenticated':
      return 'User is not authenticated. Please sign in.';

    // Default Error
    default:
      return 'An error occurred. Please try again.';
  }
};
