import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

import { Post } from './post.model';

// Provide this class to the root level
@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postUdapted = new Subject<Post[]>();

  getPosts() {
    // An array in Javascript/Typescript is referrence type
    return this.posts;
  }

  getPostUpdatedListener() {
    return this.postUdapted.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {title: title, content: content};
    this.posts.push(post);
    this.postUdapted.next([...this.posts]);
  }
}
