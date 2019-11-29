import FirebaseContext, { withFirebase } from './Context';
import Firebase from './Firebase';
import GetDocument from './GetDocument';
import GetDocuments from './GetDocuments';
import ListenToDocuments from './ListenToDocuments';
import ListenToDocument from './ListenToDocument';
import BatchWrite from './BatchWrite';
import UpdateDocument from './UpdateDocument';
import AddDocument from './AddDocument';
import DeleteDocument from './DeleteDocument';

export default Firebase;

export {
  FirebaseContext,
  withFirebase,
  GetDocument,
  GetDocuments,
  ListenToDocuments,
  ListenToDocument,
  BatchWrite,
  UpdateDocument,
  AddDocument,
  DeleteDocument
};
