export interface User {
  firstName: string
  lastName: string
  /**
   * Optional for old authenticated users.
   * TODO: remove `?` after a week
   */
  isStudentBUT?: boolean
}

export const checkUser = async (): Promise<User | null> => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const response = await fetch("/api/check", {
    headers: {
      authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    localStorage.removeItem("token");
    return null;
  }

  return response.json();
}

export const safeStorage = typeof localStorage !== "undefined" ? localStorage : null;

export const getProfilePicture = () => {
  const value = safeStorage?.getItem("profilePicture");
  if (value === "null" || !value) return null; // loosy check for "null", null and undefined.

  return value;
}

export const setProfilePicture = (profilePicture: string) => safeStorage?.setItem("profilePicture", profilePicture);

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("profilePicture");
};

export const checkDiscount = async (): Promise<boolean> => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  const response = await fetch("/api/discount", {
    headers: {
      authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) return false;

  const json = await response.json();
  return json.discount;
}