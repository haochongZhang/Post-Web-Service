import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Post } from './post.model';

// Provide this class to the root level
@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postUdapted = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postUdapted.next([...this.posts]);
      });
  }

  getPostUpdatedListener() {
    return this.postUdapted.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{message: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
        this.posts.push(post);
        this.postUdapted.next([...this.posts]);
      });
  }
}
