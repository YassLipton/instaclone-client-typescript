export interface User {
  _id: string,
  username: string,
  password: string,
  fullName: string,
  email: string,
  phone: string,
  bio: string,
  link: string,
  isPrivate: boolean,
  isVerified: boolean,
  profilePicUrl: string,
  followers: string[],
  following: Array<string>,
}

export interface Post {
  _id: string,
  images: [{
    index: number,
    link: string
  }],
  user: User,
  comments: Comment[],
  caption: string,
  location: string,
  usersWhoLiked: string[],
  createdAt: Date
}

export interface Comment {
  _id: string,
  text: string,
  user: User,
  post: Post,
  usersWhoLiked: string[],
  createdAt: Date
}