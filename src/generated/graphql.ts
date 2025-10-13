import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Cursor: { input: any; output: any; }
  DateTime: { input: string; output: string; }
  JSON: { input: Record<string, any>; output: Record<string, any>; }
  Upload: { input: any; output: any; }
};

export type Activity = {
  __typename?: 'Activity';
  canonicalUri?: Maybe<Scalars['String']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  /** Media attached to this activity (TODO) */
  media?: Maybe<Media>;
  object?: Maybe<AnyContext>;
  objectId?: Maybe<Scalars['String']['output']>;
  objectPostContent?: Maybe<PostContent>;
  /** Information about the thread, and replies to this activity (if any) */
  replied?: Maybe<Replied>;
  subject?: Maybe<AnyCharacter>;
  subjectId?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  verb?: Maybe<Verb>;
};

export type ActivityConnection = {
  __typename?: 'ActivityConnection';
  edges?: Maybe<Array<Maybe<ActivityEdge>>>;
  pageInfo: PageInfo;
};

export type ActivityEdge = {
  __typename?: 'ActivityEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<Activity>;
};

export type ActivityFilter = {
  /** The ID of the activity */
  activityId?: InputMaybe<Scalars['ID']['input']>;
  /** The ID of the object */
  objectId?: InputMaybe<Scalars['ID']['input']>;
};

/** Any type of character (eg. Category, Thread, Geolocation, etc), actor (eg. User/Person), or agent (eg. Organisation) */
export type AnyCharacter = Category | User;

/** Any type of known object */
export type AnyContext = Activity | Category | Post | Tag | User;

export type AnyContextConnection = {
  __typename?: 'AnyContextConnection';
  edges?: Maybe<Array<Maybe<AnyContextEdge>>>;
  pageInfo: PageInfo;
};

export type AnyContextEdge = {
  __typename?: 'AnyContextEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<AnyContext>;
};

export type CategoriesPage = {
  __typename?: 'CategoriesPage';
  edges: Array<Category>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** A category (eg. tag in a taxonomy) */
export type Category = {
  __typename?: 'Category';
  /** A JSON document containing more info beyond the default fields */
  extraInfo?: Maybe<Scalars['JSON']['output']>;
  /** The numeric primary key of the category */
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  /** The parent category (in a tree-based taxonomy) */
  parentCategory?: Maybe<Category>;
  /** List of child categories (in a tree-based taxonomy) */
  subCategories?: Maybe<Array<Maybe<CategoriesPage>>>;
  summary?: Maybe<Scalars['String']['output']>;
};

export type CategoryInput = {
  alsoKnownAs?: InputMaybe<Scalars['ID']['input']>;
  /** A JSON document containing more info beyond the default fields */
  extraInfo?: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
  parentCategory?: InputMaybe<Scalars['ID']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
};

export type Character = {
  __typename?: 'Character';
  canonicalUri?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type CharacterFilters = {
  autocomplete?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type CharacterInput = {
  username?: InputMaybe<Scalars['String']['input']>;
};

export type FeedFilters = {
  /** Filter by activity type (eg. create, boost, follow) (TODO) */
  activityTypes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Optionally filter by object creators (TODO) */
  creators?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Optionally specify feed IDs (overrides feedName) (TODO) */
  feedIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  /** Specify which feed to query. For example: explore, my, local, remote */
  feedName?: InputMaybe<Scalars['String']['input']>;
  /** Filter by media type (eg. image, video, link) (TODO) */
  mediaTypes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by object type (eg. post, poll) (TODO) */
  objectTypes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Optionally filter by the username of the object (TODO) */
  objects?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Sort by date, likes, boosts, replies, etc... */
  sortBy?: InputMaybe<SortBy>;
  /** Sort in ascending or descending order */
  sortOrder?: InputMaybe<SortOrder>;
  /** Optionally filter by activity subject (TODO) */
  subjects?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Optionally filter by hashtags or @ mentions (TODO) */
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Include only recent activities (time limit in days) (TODO) */
  timeLimit?: InputMaybe<Scalars['Int']['input']>;
};

export type ImagesUpload = {
  icon?: InputMaybe<Scalars['Upload']['input']>;
  image?: InputMaybe<Scalars['Upload']['input']>;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  currentAccountId?: Maybe<Scalars['String']['output']>;
  currentUser?: Maybe<User>;
  currentUsername?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
};

export type Me = {
  __typename?: 'Me';
  accountId?: Maybe<Scalars['ID']['output']>;
  flags?: Maybe<ActivityConnection>;
  followed?: Maybe<Array<Maybe<Activity>>>;
  followers?: Maybe<Array<Maybe<Activity>>>;
  likeActivities?: Maybe<Array<Maybe<Activity>>>;
  myFeed?: Maybe<ActivityConnection>;
  notifications?: Maybe<ActivityConnection>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type MeFlagsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type MeFollowedArgs = {
  paginate?: InputMaybe<Paginate>;
};


export type MeFollowersArgs = {
  paginate?: InputMaybe<Paginate>;
};


export type MeLikeActivitiesArgs = {
  paginate?: InputMaybe<Paginate>;
};


export type MeMyFeedArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type MeNotificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type Media = {
  __typename?: 'Media';
  /** All activities associated with this media (TODO) */
  activities?: Maybe<Array<Maybe<Activity>>>;
  /** An activity associated with this media */
  activity?: Maybe<Activity>;
  creator?: Maybe<AnyCharacter>;
  id: Scalars['ID']['output'];
  mediaType?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  /** All objects associated with this media (TODO) */
  objects?: Maybe<Array<Maybe<AnyContext>>>;
  path?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
};

export type MediaConnection = {
  __typename?: 'MediaConnection';
  edges?: Maybe<Array<Maybe<MediaEdge>>>;
  pageInfo: PageInfo;
};

export type MediaEdge = {
  __typename?: 'MediaEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<Media>;
};

export type ObjectFilter = {
  /** The ID of the object */
  objectId?: InputMaybe<Scalars['ID']['input']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Paginate = {
  after?: InputMaybe<Array<Scalars['Cursor']['input']>>;
  before?: InputMaybe<Array<Scalars['Cursor']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type Post = {
  __typename?: 'Post';
  /** All activities associated with this post (TODO) */
  activities?: Maybe<Array<Maybe<Activity>>>;
  /** An activity associated with this post (usually the post creation) */
  activity?: Maybe<Activity>;
  id?: Maybe<Scalars['ID']['output']>;
  postContent?: Maybe<PostContent>;
};

export type PostConnection = {
  __typename?: 'PostConnection';
  edges?: Maybe<Array<Maybe<PostEdge>>>;
  pageInfo: PageInfo;
};

export type PostContent = {
  __typename?: 'PostContent';
  htmlBody?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  summary?: Maybe<Scalars['String']['output']>;
};

export type PostContentInput = {
  htmlBody?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
};

export type PostEdge = {
  __typename?: 'PostEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<Post>;
};

export type PostFilters = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type Profile = {
  __typename?: 'Profile';
  icon?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  summary?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type ProfileInput = {
  location?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type Replied = {
  __typename?: 'Replied';
  activity?: Maybe<Activity>;
  directRepliesCount?: Maybe<Scalars['Int']['output']>;
  nestedRepliesCount?: Maybe<Scalars['Int']['output']>;
  post?: Maybe<Post>;
  postContent?: Maybe<PostContent>;
  replyToId?: Maybe<Scalars['ID']['output']>;
  threadId?: Maybe<Scalars['ID']['output']>;
  totalRepliesCount?: Maybe<Scalars['Int']['output']>;
};

export type RootMutationType = {
  __typename?: 'RootMutationType';
  /** Share the current user identity with a team member. This will give them full access to the currently authenticated user identity. Warning: anyone you add will have full access over this user identity, meaning they can post as this user, read private messages, etc. */
  addTeamMember?: Maybe<Scalars['String']['output']>;
  boost?: Maybe<Activity>;
  /** Change account password */
  changePassword?: Maybe<Me>;
  /** Confirm email address using a token generated upon `signup` or with `request_confirm_email` and emailed to the user. */
  confirmEmail?: Maybe<Me>;
  /** Create a new Category */
  createCategory?: Maybe<Category>;
  createPost?: Maybe<Post>;
  /** Request a new user identity for the authenticated account */
  createUser?: Maybe<Me>;
  /** Delete more or less anything */
  delete?: Maybe<AnyContext>;
  flag?: Maybe<Activity>;
  follow?: Maybe<Activity>;
  like?: Maybe<Activity>;
  /** Authenticate an account and/or user */
  login?: Maybe<LoginResponse>;
  /** Request a new confirmation email */
  requestConfirmEmail?: Maybe<Scalars['String']['output']>;
  /** Request an email to be sent to reset a forgotten password */
  requestResetPassword?: Maybe<Scalars['String']['output']>;
  /** Switch to a user (among those from the authenticated account) */
  selectUser?: Maybe<LoginResponse>;
  /** Register a new account. Returns the created `account_id` */
  signup?: Maybe<Scalars['String']['output']>;
  /** Tag a thing (using a Pointer) with one or more Tags (or Categories, or even Needle to anything that can become tag) */
  tag?: Maybe<Scalars['Boolean']['output']>;
  /** Update a category */
  updateCategory?: Maybe<Category>;
  /** Edit user profile */
  updateUser?: Maybe<Me>;
};


export type RootMutationTypeAddTeamMemberArgs = {
  label: Scalars['String']['input'];
  usernameOrEmail: Scalars['String']['input'];
};


export type RootMutationTypeBoostArgs = {
  id: Scalars['String']['input'];
};


export type RootMutationTypeChangePasswordArgs = {
  oldPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
};


export type RootMutationTypeConfirmEmailArgs = {
  token: Scalars['String']['input'];
};


export type RootMutationTypeCreateCategoryArgs = {
  category?: InputMaybe<CategoryInput>;
};


export type RootMutationTypeCreatePostArgs = {
  postContent: PostContentInput;
  replyTo?: InputMaybe<Scalars['ID']['input']>;
  toCircles?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type RootMutationTypeCreateUserArgs = {
  character: CharacterInput;
  images?: InputMaybe<ImagesUpload>;
  profile: ProfileInput;
};


export type RootMutationTypeDeleteArgs = {
  contextId: Scalars['String']['input'];
};


export type RootMutationTypeFlagArgs = {
  id: Scalars['String']['input'];
};


export type RootMutationTypeFollowArgs = {
  id: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type RootMutationTypeLikeArgs = {
  id: Scalars['String']['input'];
};


export type RootMutationTypeLoginArgs = {
  emailOrUsername: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type RootMutationTypeRequestConfirmEmailArgs = {
  email: Scalars['String']['input'];
};


export type RootMutationTypeRequestResetPasswordArgs = {
  email: Scalars['String']['input'];
};


export type RootMutationTypeSelectUserArgs = {
  username: Scalars['String']['input'];
};


export type RootMutationTypeSignupArgs = {
  email: Scalars['String']['input'];
  inviteCode?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};


export type RootMutationTypeTagArgs = {
  tags: Array<InputMaybe<Scalars['String']['input']>>;
  thing: Scalars['String']['input'];
};


export type RootMutationTypeUpdateCategoryArgs = {
  category?: InputMaybe<CategoryInput>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
};


export type RootMutationTypeUpdateUserArgs = {
  images?: InputMaybe<ImagesUpload>;
  profile?: InputMaybe<ProfileInput>;
};

export type RootQueryType = {
  __typename?: 'RootQueryType';
  /** Get an activity */
  activity?: Maybe<Activity>;
  /** Get list of categories we know about */
  categories: CategoriesPage;
  /** Get a category by ID */
  category?: Maybe<Category>;
  /** Get activities in a feed */
  feedActivities?: Maybe<ActivityConnection>;
  /** Get media in a feed (TODO) */
  feedMedia?: Maybe<MediaConnection>;
  /** Get objects in a feed (TODO) */
  feedObjects?: Maybe<AnyContextConnection>;
  /** Get information about and for the current account and/or user */
  me?: Maybe<Me>;
  /** Get an object */
  object?: Maybe<AnyContext>;
  /** Get a post */
  post?: Maybe<Post>;
  /** Get all posts */
  posts?: Maybe<PostConnection>;
  /** Get a tag by ID */
  tag?: Maybe<Tag>;
  /** Get or lookup a user */
  user?: Maybe<User>;
  /** List or lookup users */
  users?: Maybe<Array<Maybe<User>>>;
};


export type RootQueryTypeActivityArgs = {
  filter?: InputMaybe<ActivityFilter>;
};


export type RootQueryTypeCategoriesArgs = {
  after?: InputMaybe<Array<Scalars['Cursor']['input']>>;
  before?: InputMaybe<Array<Scalars['Cursor']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type RootQueryTypeCategoryArgs = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
};


export type RootQueryTypeFeedActivitiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FeedFilters>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type RootQueryTypeFeedMediaArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FeedFilters>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type RootQueryTypeFeedObjectsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FeedFilters>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type RootQueryTypeObjectArgs = {
  filter?: InputMaybe<ObjectFilter>;
};


export type RootQueryTypePostArgs = {
  filter?: InputMaybe<PostFilters>;
};


export type RootQueryTypePostsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type RootQueryTypeTagArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type RootQueryTypeUserArgs = {
  filter?: InputMaybe<CharacterFilters>;
};

export enum SortBy {
  /** Sort by date */
  Date = 'DATE',
  /** Sort by number of associated activities, only when querying by object or media (TODO) */
  NumActivities = 'NUM_ACTIVITIES',
  /** Sort by number of boosts */
  NumBoosts = 'NUM_BOOSTS',
  /** Sort by flags (for moderators) (TODO) */
  NumFlags = 'NUM_FLAGS',
  /** Sort by number of likes */
  NumLikes = 'NUM_LIKES',
  /** Sort by number of replies */
  NumReplies = 'NUM_REPLIES'
}

export enum SortOrder {
  /** Ascending order */
  Asc = 'ASC',
  /** Descending order */
  Desc = 'DESC'
}

/** A tag could be a category or hashtag or user or community or etc */
export type Tag = {
  __typename?: 'Tag';
  /** Unique URL (on original instance) */
  canonicalUrl?: Maybe<Scalars['String']['output']>;
  /** The object used as a tag (eg. Category, Geolocation, Hashtag, User...) */
  context?: Maybe<AnyContext>;
  /** Unique URL (on original instance) */
  displayUsername?: Maybe<Scalars['String']['output']>;
  /** The primary key of the tag */
  id?: Maybe<Scalars['ID']['output']>;
  /** Name of the tag (derived from its context) */
  name?: Maybe<Scalars['String']['output']>;
  /** Description of the tag (derived from its context) */
  summary?: Maybe<Scalars['String']['output']>;
  /** Objects that were tagged with this tag */
  tagged?: Maybe<Array<Maybe<AnyContext>>>;
};

export type User = {
  __typename?: 'User';
  boostActivities?: Maybe<Array<Maybe<Activity>>>;
  character?: Maybe<Character>;
  dateCreated?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  posts?: Maybe<Array<Maybe<Post>>>;
  profile?: Maybe<Profile>;
  userActivities?: Maybe<Array<Maybe<Activity>>>;
};


export type UserBoostActivitiesArgs = {
  paginate?: InputMaybe<Paginate>;
};


export type UserPostsArgs = {
  paginate?: InputMaybe<Paginate>;
};


export type UserUserActivitiesArgs = {
  paginate?: InputMaybe<Paginate>;
};

export type Verb = {
  __typename?: 'Verb';
  verb?: Maybe<Scalars['String']['output']>;
  verbDisplay?: Maybe<Scalars['String']['output']>;
};

export type LoginMutationVariables = Exact<{
  emailOrUsername: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'RootMutationType', login?: { __typename?: 'LoginResponse', token?: string | null | undefined } | null | undefined };

export type GetPostsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPostsQuery = { __typename?: 'RootQueryType', posts?: { __typename?: 'PostConnection', edges?: Array<{ __typename?: 'PostEdge', cursor?: string | null | undefined, node?: { __typename?: 'Post', id?: string | null | undefined, postContent?: { __typename?: 'PostContent', name?: string | null | undefined, summary?: string | null | undefined, htmlBody?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined> | null | undefined, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null | undefined } } | null | undefined };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emailOrUsername"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"emailOrUsername"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emailOrUsername"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const GetPostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPosts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"postContent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"htmlBody"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetPostsQuery, GetPostsQueryVariables>;