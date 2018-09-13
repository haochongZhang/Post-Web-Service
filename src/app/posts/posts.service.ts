import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Post } from './post.model';

// Provide this class to the root level
@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postUdapted = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe(transfromedPosts => {
        this.posts = transfromedPosts;
        this.postUdapted.next([...this.posts]);
      });
  }

  getPostUpdatedListener() {
    return this.postUdapted.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{message: string, id: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
        post.id = responseData.id;
        this.posts.push(post);
        this.postUdapted.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postUdapted.next([...this.posts]);
      });
  }
}
