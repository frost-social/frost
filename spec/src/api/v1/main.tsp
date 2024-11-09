import "./models.tsp";

using TypeSpec.OpenAPI;
using TypeSpec.Http;
using TypeSpec.Rest;

@route("/api/v1")
namespace Frost.Api.v1;

@route("/")
interface RootApi {
  @route("/echo")
  @get GetEcho(@query message: string): { message: string };

  @route("/echo")
  @post PostEcho(@body body: { message: string }): { message: string };
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

  @route("/getFollowings")
  @get GetFollowings(...GetFollowingsQueryString): User[];

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
