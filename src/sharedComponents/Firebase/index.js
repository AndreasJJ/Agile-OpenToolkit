import FirebaseContext, { withFirebase } from './Context';
import Firebase from './Firebase';
import GetDocument from './GetDocument';
import GetDocuments from './GetDocuments';
import ListenToDocuments from './ListenToDocuments';
import ListenToDocument from './ListenToDocument';
import BatchWrite from './BatchWrite';
import BatchUpdate from './BatchUpdate';
import UpdateDocument from './UpdateDocument';
import AddDocument from './AddDocument';
import DeleteDocument from './DeleteDocument';

// Export the firebase object
export default Firebase;

// Export the firestore functions
export {
  FirebaseContext,
  withFirebase,
  GetDocument,
  GetDocuments,
  ListenToDocuments,
  ListenToDocument,
  BatchWrite,
  BatchUpdate,
  UpdateDocument,
  AddDocument,
  DeleteDocument
};
