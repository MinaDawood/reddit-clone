import { Exclude, Expose } from 'class-transformer';
import {
  Entity as TOEntity,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  Index,
  OneToMany,
  AfterLoad,
} from 'typeorm';
import { makeId, slugify } from '../util/helpers';
import Comment from './Comment';

import Entity from './Entity';
import Sub from './Sub';
import User from './User';
import Vote from './Vote';

@TOEntity('posts')
export default class POST extends Entity {
  constructor(post: Partial<POST>) {
    super();
    Object.assign(this, post);
  }

  @Index()
  @Column()
  identifier: string; // 7 char Id

  @Column()
  title: string;

  @Index()
  @Column()
  slug: string;

  @Column({ nullable: true, type: 'text' })
  body: string;

  @Column()
  subName: string;

  @Column()
  username: string;

  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @ManyToOne(() => Sub, sub => sub.posts)
  @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
  sub: Sub;

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

  @Exclude()
  @OneToMany(() => Vote, vote => vote.post)
  votes: Vote[];

  protected url: string;
  @AfterLoad()
  createFields() {
    this.url = `r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  @Expose() get commentCount(): number {
    return this.comments?.length;
  }

  @Expose() get voteScore(): number {
    return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0);
  }

  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes?.findIndex(v => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
