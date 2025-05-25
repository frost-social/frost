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

// Echo

model EchoResult {
  message: string;
}

interface EchoApi {
  /** Echo a text with GET */
  @route("/echo")
  @get echoGet(@query message: string): EchoResult | Error;

  /** Echo a text with POST */
  @route("/echo")
  @post echoPost(@body body: { message: string }): EchoResult | Error;
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

@tag("Auth")
interface AuthApi {
  @route("/auth/signup")
  @tag("User")
  @post Signup(@body body: SignupBody): AuthInfo | Error;

  @route("/auth/signin")
  @tag("User")
  @post Signin(@body body: SigninBody): AuthInfo | Error;
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

model GetTimelineResult {
  leafs: Leaf[];
  nextCursor?: string;
  prevCursor?: string;
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

model GetHomeTimelineQueryString is CursorControl {
}

@tag("User")
interface UserApi {
  @route("/user/getUser")
  @get GetUser(...GetUserQueryString): User | Error;

  @route("/user/searchUsers")
  @get SearchUsers(...SearchUsersQueryString): User[] | Error;

  @route("/user/deleteUser")
  @post DeleteUser(@body body: DeleteUserBody): void | Error;

  @route("/user/listFollowing")
  @get ListFollowing(...ListFollowingQueryString): User[] | Error;

  @route("/user/listFollowedBy")
  @get ListFollowedBy(...ListFollowedByQueryString): User[] | Error;

  @route("/user/followUser")
  @post FollowUser(@body body: FollowUserBody): void | Error;

  @route("/user/unfollowUser")
  @post UnfollowUser(@body body: UnfollowUserBody): void | Error;

  @route("/user/getHomeTimeline")
  @tag("Leaf")
  @get GetHomeTimeline(...GetHomeTimelineQueryString): GetTimelineResult | Error;
}

// Leaf

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

@tag("Leaf")
interface LeafApi {
  @route("/leaf/createLeaf")
  @post CreateLeaf(@body body: CreateLeafBody): Leaf | Error;

  @route("/leaf/getLeaf")
  @get GetLeaf(...GetLeafQueryString): Leaf | Error;

  @route("/leaf/searchLeafs")
  @get SearchLeafs(...SearchLeafsQueryString): Leaf[] | Error;

  @route("/leaf/deleteLeaf")
  @post DeleteLeaf(@body body: DeleteLeafBody): void | Error;
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

  @route("/chatRoom/createLeaf")
  @tag("Leaf")
  @post CreateLeaf(@body body: CreateChatRoomLeafBody): Leaf | Error;

  @route("/chatRoom/getTimeline")
  @tag("Leaf")
  @get GetTimeline(...GetChatRoomTimelineQueryString): GetTimelineResult | Error;
}
