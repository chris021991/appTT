import firebase from 'firebase';
import { User } from '../models/interfaces';

export const returnDocuments = (snapshot: firebase.firestore.QuerySnapshot) => {

    const documents: User[] = [];

    snapshot.forEach( snapHijo => {
    documents.push({
        ...snapHijo.data()
    });
    });
    console.log('Snap Users -> ', documents);
    return documents;

};
