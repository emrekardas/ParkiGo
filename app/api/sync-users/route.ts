import { NextResponse } from 'next/server';
import { admin } from '../../firebase/admin';

export async function POST() {
  try {
    // Firebase Authentication'dan tüm kullanıcıları al
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users;

    // Firestore'da batch işlemi başlat
    const batch = admin.firestore().batch();

    // Her kullanıcı için Firestore'da bir döküman oluştur/güncelle
    users.forEach((userRecord) => {
      const userRef = admin.firestore().collection('users').doc(userRecord.uid);
      batch.set(userRef, {
        email: userRecord.email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        role: 'user', // Varsayılan rol
      }, { merge: true }); // merge: true ile mevcut verileri koruyoruz
    });

    // Batch işlemini commit et
    await batch.commit();

    return NextResponse.json({ 
      success: true, 
      message: 'Kullanıcılar başarıyla senkronize edildi',
      userCount: users.length 
    });

  } catch (error: any) {
    console.error('Error syncing users:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
