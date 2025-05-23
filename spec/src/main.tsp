import "@typespec/http";
import "./models.tsp";

using Http;

@service(#{ title: "Frost" })
@server("http://localhost:3000", "local server")
@route("/api/v1")
namespace FrostService;

@error
model Error {
  @statusCode statusCode: 400 | 401 | 403 | 404 | 500;

  error: {
    code: string;
    message: string;
  };
}

@route("/echo")
interface EchoApi {
  /** Echo a text with GET */
  @get echoGet(@query message: string): EchoResult | Error;
  /** Echo a text with POST */
  @post echoPost(@body body: { message: string }): EchoResult | Error;
}

@route("/auth")
@tag("Auth") @tag("User")
interface AuthApi {
  @route("/signup")
  @post Signup(@body body: SignupBody): AuthInfo | Error;

  @route("/signin")
  @post Signin(@body body: SigninBody): AuthInfo | Error;
}

@route("/user")
@tag("User")
interface UserApi {
  @route("/getUser")
  @get GetUser(...GetUserQueryString): User | Error;

  @route("/searchUsers")
  @get SearchUsers(...SearchUsersQueryString): User[] | Error;

  @route("/deleteUser")
  @post DeleteUser(@body body: DeleteUserBody): void | Error;

  @route("/listFollowing")
  @get ListFollowing(...ListFollowingQueryString): User[] | Error;

  @route("/listFollowedBy")
  @get ListFollowedBy(...ListFollowedByQueryString): User[] | Error;

  @route("/followUser")
  @post FollowUser(@body body: FollowUserBody): void | Error;

  @route("/unfollowUser")
  @post UnfollowUser(@body body: UnfollowUserBody): void | Error;

  @route("/getHomeTimeline")
  @tag("Leaf")
  @get GetHomeTimeline(...GetHomeTimelineQueryString): GetTimelineResult | Error;
}

@route("/leaf")
@tag("Leaf")
interface LeafApi {
  @route("/createLeaf")
  @post CreateLeaf(@body body: CreateLeafBody): Leaf | Error;

  @route("/getLeaf")
  @get GetLeaf(...GetLeafQueryString): Leaf | Error;

  @route("/searchLeafs")
  @get SearchLeafs(...SearchLeafsQueryString): Leaf[] | Error;

  @route("/deleteLeaf")
  @post DeleteLeaf(@body body: DeleteLeafBody): void | Error;
}

@route("/chatRoom")
@tag("ChatRoom")
interface ChatRoomApi {
  @route("/createChatRoom")
  @post CreateChatRoom(@body body: CreateChatRoomBody): ChatRoom | Error;

  @route("/getChatRoom")
  @get GetChatRoom(...GetChatRoomQueryString): ChatRoom | Error;

  @route("/searchChatRooms")
  @get SearchChatRooms(...SearchChatRoomsQueryString): ChatRoom[] | Error;

  @route("/deleteChatRoom")
  @post DeleteChatRoom(@body body: DeleteChatRoomBody): void | Error;

  @route("/createLeaf")
  @tag("Leaf")
  @post CreateLeaf(@body body: CreateChatRoomLeafBody): Leaf | Error;

  @route("/getTimeline")
  @tag("Leaf")
  @get GetTimeline(...GetChatRoomTimelineQueryString): GetTimelineResult | Error;
}
