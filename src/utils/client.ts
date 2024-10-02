export interface User {
  firstName: string
  lastName: string
}

export const checkUser = async (): Promise<User | null> => {
  const response = await fetch("/api/check", {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  if (!response.ok) {
    localStorage.removeItem("token");
    return null;
  }

  return response.json();
}

export const getProfilePicture = () => localStorage.getItem("profilePicture");
export const setProfilePicture = (profilePicture: string) => localStorage.setItem("profilePicture", profilePicture);
