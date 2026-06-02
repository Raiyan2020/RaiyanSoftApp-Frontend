"use client";

export const guestStore = {
  get isGuest() { 
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('rs_is_guest') === 'true'; 
  },
  
  setGuest(val: boolean) { 
    if (typeof window === 'undefined') return;
    if(val) localStorage.setItem('rs_is_guest', 'true'); 
    else localStorage.removeItem('rs_is_guest');
  },
  
  get intendedPath() { 
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('rs_intended_path'); 
  },
  
  setIntendedPath(val: string | null) {
    if (typeof window === 'undefined') return;
    if(val) localStorage.setItem('rs_intended_path', val);
    else localStorage.removeItem('rs_intended_path');
  }
};
