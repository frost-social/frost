import "@typespec/http";
import "./models.tsp";

using Http;

@service(#{ title: "Frost" })
@server("http://localhost:3000", "local server")
@route("/api/v1")
namespace FrostService;

@error
model Error {
  error: {
    code: string;
    message: string;
  };
}

model EchoResult {
  message: string;
}

@route("/echo")
@tag("others")
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
  @post Signup(@body body: SignupBody): AuthInfo;

  @route("/signin")
  @post Signin(@body body: SigninBody): AuthInfo;
}

@route("/user")
@tag("User")
interface UserApi {
  @route("/getUser")
  @get GetUser(...GetUserQueryString): User;

  @route("/searchUsers")
  @get SearchUsers(...SearchUsersQueryString): User[];

  @route("/deleteUser")
  @post DeleteUser(@body body: DeleteUserBody): void;

  @route("/listFollowing")
  @get ListFollowing(...ListFollowingQueryString): User[];

  @route("/listFollowedBy")
  @get ListFollowedBy(...ListFollowedByQueryString): User[];

  @route("/followUser")
  @post FollowUser(@body body: FollowUserBody): void;

  @route("/unfollowUser")
  @post UnfollowUser(@body body: UnfollowUserBody): void;

  @route("/getHomeTimeline")
  @tag("Leaf")
  @get GetHomeTimeline(...GetHomeTimelineQueryString): GetTimelineResult;
}

@route("/leaf")
@tag("Leaf")
interface LeafApi {
  @route("/createLeaf")
  @post CreateLeaf(@body body: CreateLeafBody): Leaf;

  @route("/getLeaf")
  @get GetLeaf(...GetLeafQueryString): Leaf;

  @route("/searchLeafs")
  @get SearchLeafs(...SearchLeafsQueryString): Leaf[];

  @route("/deleteLeaf")
  @post DeleteLeaf(@body body: DeleteLeafBody): void;
}

@route("/chatRoom")
@tag("ChatRoom")
interface ChatRoomApi {
  @route("/createChatRoom")
  @post CreateChatRoom(@body body: CreateChatRoomBody): ChatRoom;

  @route("/getChatRoom")
  @get GetChatRoom(...GetChatRoomQueryString): ChatRoom;

  @route("/searchChatRooms")
  @get SearchChatRooms(...SearchChatRoomsQueryString): ChatRoom[];

  @route("/deleteChatRoom")
  @post DeleteChatRoom(@body body: DeleteChatRoomBody): void;

  @route("/createLeaf")
  @tag("Leaf")
  @post CreateLeaf(@body body: CreateChatRoomLeafBody): Leaf;

  @route("/getTimeline")
  @tag("Leaf")
  @get GetTimeline(...GetChatRoomTimelineQueryString): GetTimelineResult;
}
