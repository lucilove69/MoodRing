export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profileUrl: string;
  createdAt: string;
  lastLogin: string;
  profileViews: number;
  status: string;
  mood: string;
  customCSS: string;
  customHTML: string;
  profileSong: string;
  about: string;
  interests: string;
  photos: Photo[];
  friends: string[];
  topFriends: string[];
  pendingFriends: string[];
  comments: Comment[];
  bulletins: Bulletin[];
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  createdAt: string;
  userId: string;
}

export interface Comment {
  id: string;
  userId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Bulletin {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface Theme {
  id: string;
  name: string;
  css: string;
  thumbnail: string;
}