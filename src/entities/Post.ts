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

  protected url: string;
  @AfterLoad()
  createFields() {
    this.url = `r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
