using TypeSpec.OpenAPI;
using TypeSpec.Http;
using TypeSpec.Rest;

namespace Frost.Api.v1;

// models

model AuthInfo {
  accessToken: Token;
  refreshToken: Token;
  user: User;
}

model User {
  userId: string;
  userName: string;
  displayName: string;
  passwordAuthEnabled: boolean;
}

model Token {
  token: string;
  scopes: string[];
}

model Leaf {
  leafId: string;
  chatRoomId?: string;
  userId: string;
  content: string;
  createdAt: string;
}

model GetTimelineResult {
  leafs: Leaf[];
  nextCursor?: string;
  prevCursor?: string;
}

model ChatRoom {
  chatRoomId: string;
  title: string;
  description: string;
}

// utility

model OffsetControl {
  @query offset?: string;
  @query limit?: string;
}

model CursorControl {
  @query nextCursor?: string;
  @query prevCursor?: string;
  @query limit?: string;
}

// Auth parameters

model SignupBody {
  userName: string;
  password?: string;
  displayName: string;
}

model SigninBody {
  userName: string;
  password?: string;
}

// User parameters

model GetUserQueryString {
  @query userId?: string;
  @query userName?: string;
}

model SearchUsersQueryString is OffsetControl {
}

model DeleteUserBody {
  userId: string;
}

model GetFollowingsQueryString is OffsetControl {
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

// Leaf parameters

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

// ChatRoom parameters

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
