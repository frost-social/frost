import "@typespec/http";

using Http;

@service(#{ title: "Frost" })
@server("http://localhost:3000", "local server")
@route("/api/v1")
namespace FrostApi.Version1;

// Common

@error
model Error {
  @statusCode statusCode: 400 | 401 | 403 | 404 | 500;

  error: {
    code: string;
    message: string;
  };
}

model OffsetControl {
  @query offset?: string;
  @query limit?: string;
}

model CursorControl {
  @query nextCursor?: string;
  @query prevCursor?: string;
  @query limit?: string;
}

// Testing

model EchoGetParams {
  @query message: string;
}

model EchoPostParams {
  message: string;
}

model EchoResult {
  message: string;
}

@tag("Testing")
interface TestingApi {
  /** Echo a text with GET method */
  @route("/echo")
  @get echoGet(...EchoGetParams): EchoResult | Error;

  /** Echo a text with POST method */
  @route("/echo")
  @post echoPost(@body body: EchoPostParams): EchoResult | Error;
}

// Auth

model Token {
  token: string;
  scopes: string[];
}

model AuthInfo {
  accessToken: Token;
  refreshToken: Token;
  user: User;
}

model SignupBody {
  userName: string;
  password?: string;
  displayName: string;
}

model SigninBody {
  userName: string;
  password?: string;
}


// User

model User {
  userId: string;
  userName: string;
  displayName: string;
  passwordAuthEnabled: boolean;
}

model GetUserQueryString {
  @query userId?: string;
  @query userName?: string;
}

model SearchUsersQueryString is OffsetControl {
}

model DeleteUserBody {
  userId: string;
}


// Timeline and user relations

model Leaf {
  leafId: string;
  chatRoomId?: string;
  userId: string;
  content: string;
  createdAt: string;
}

model CreateLeafBody {
  content: string;
}

model GetLeafQueryString {
  @query leafId: string;
}

model SearchLeafsQueryString is OffsetControl {
}

model DeleteLeafBody {
  leafId: string;
}

model ListFollowingQueryString is OffsetControl {
  @query userId: string;
}

model ListFollowedByQueryString is OffsetControl {
  @query userId: string;
}

model FollowUserBody {
  userId: string;
}

model UnfollowUserBody {
  userId: string;
}

model GetUserTimelineQueryString is CursorControl {
}
model GetHomeTimelineQueryString is CursorControl {
}

model GetTimelineResult {
  leafs: Leaf[];
  nextCursor?: string;
  prevCursor?: string;
}

interface UserApi {
  @route("/user/getUser")
  @tag("User")
  @get GetUser(...GetUserQueryString): User | Error;

  @route("/user/searchUsers")
  @tag("User")
  @get SearchUsers(...SearchUsersQueryString): User[] | Error;

  @route("/user/deleteUser")
  @tag("User")
  @post DeleteUser(@body body: DeleteUserBody): void | Error;
}

@tag("User")
@tag("Auth")
interface UserAuthApi {
  @route("/auth/signup")
  @post Signup(@body body: SignupBody): AuthInfo | Error;

  @route("/auth/signin")
  @post Signin(@body body: SigninBody): AuthInfo | Error;
}

@tag("User")
@tag("UserRelation")
interface UserRelationApi {
  @route("/user/followUser")
  @post FollowUser(@body body: FollowUserBody): void | Error;

  @route("/user/unfollowUser")
  @post UnfollowUser(@body body: UnfollowUserBody): void | Error;

  @route("/user/listFollowing")
  @get ListFollowing(...ListFollowingQueryString): User[] | Error;

  @route("/user/listFollowedBy")
  @get ListFollowedBy(...ListFollowedByQueryString): User[] | Error;
}

@tag("Leaf")
interface LeafApi {
  @route("/leaf/getLeaf")
  @get GetLeaf(...GetLeafQueryString): Leaf | Error;

  @route("/leaf/searchLeafs")
  @get SearchLeafs(...SearchLeafsQueryString): Leaf[] | Error;
}

@tag("User")
@tag("Leaf")
interface UserLeafApi {
  @route("/user/leaf/createLeaf")
  @post CreateLeaf(@body body: CreateLeafBody): Leaf | Error;

  @route("/user/leaf/deleteLeaf")
  @post DeleteLeaf(@body body: DeleteLeafBody): void | Error;

  @route("/user/leaf/getUserTimeline")
  @tag("Timeline")
  @get GetUserTimeline(...GetHomeTimelineQueryString): GetTimelineResult | Error;

  @route("/user/leaf/getHomeTimeline")
  @tag("Timeline")
  @get GetHomeTimeline(...GetHomeTimelineQueryString): GetTimelineResult | Error;
}

// ChatRoom

model ChatRoom {
  chatRoomId: string;
  title: string;
  description: string;
}

model CreateChatRoomBody {
  title: string;
  description: string;
}

model GetChatRoomQueryString {
  @query chatRoomId: string;
}

model SearchChatRoomsQueryString is OffsetControl {
}

model DeleteChatRoomBody {
  chatRoomId: string;
}

model CreateChatRoomLeafBody {
  chatRoomId: string;
  content: string;
}

model GetChatRoomTimelineQueryString is CursorControl {
}

@tag("ChatRoom")
interface ChatRoomApi {
  @route("/chatRoom/createChatRoom")
  @post CreateChatRoom(@body body: CreateChatRoomBody): ChatRoom | Error;

  @route("/chatRoom/getChatRoom")
  @get GetChatRoom(...GetChatRoomQueryString): ChatRoom | Error;

  @route("/chatRoom/searchChatRooms")
  @get SearchChatRooms(...SearchChatRoomsQueryString): ChatRoom[] | Error;

  @route("/chatRoom/deleteChatRoom")
  @post DeleteChatRoom(@body body: DeleteChatRoomBody): void | Error;
}

@tag("ChatRoom")
@tag("Leaf")
interface ChatRoomLeafApi {
  @route("/chatRoom/leaf/createLeaf")
  @post CreateLeaf(@body body: CreateChatRoomLeafBody): Leaf | Error;

  @route("/chatRoom/leaf/deleteLeaf")
  @post DeleteLeaf(@body body: DeleteLeafBody): void | Error;

  @route("/chatRoom/leaf/getTimeline")
  @tag("Timeline")
  @get GetTimeline(...GetChatRoomTimelineQueryString): GetTimelineResult | Error;
}
