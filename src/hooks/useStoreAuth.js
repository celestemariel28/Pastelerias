import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useStoreAuth(storeId) {
  const [user, setUser] = useState(null);
  const [isStoreAdmin, setIsStoreAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function verifyAccess(currentUser) {
      if (!currentUser || !storeId) {
        setIsStoreAdmin(false);
        setCheckingAuth(false);
        return;
      }

      setCheckingAuth(true);
      try {
        const { data, error } = await supabase
          .from('store_users')
          .select('role')
          .eq('user_id', currentUser.id)
          .eq('store_id', storeId)
          .maybeSingle();

        setIsStoreAdmin(!error && Boolean(data));
      } catch (err) {
        console.error('Error al verificar store_users:', err);
        setIsStoreAdmin(false);
      } finally {
        setCheckingAuth(false);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      verifyAccess(currentUser);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      verifyAccess(currentUser);
    });

    return () => subscription.unsubscribe();
  }, [storeId]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, isStoreAdmin, checkingAuth, signOut };
}