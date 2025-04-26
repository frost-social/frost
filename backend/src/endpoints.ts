import type { paths } from "../openapi/generated/schema";

export type Endpoints = {
  "/api/v1/auth/signin": {
    body: paths["/api/v1/auth/signin"]["post"]["requestBody"]["content"]["application/json"];
    result: paths["/api/v1/auth/signin"]["post"]["responses"]["200"]["content"]["application/json"];
  };
  "/api/v1/auth/signup": {
    body: paths["/api/v1/auth/signup"]["post"]["requestBody"]["content"]["application/json"];
    result: paths["/api/v1/auth/signup"]["post"]["responses"]["200"]["content"]["application/json"];
  };
  "/api/v1/chatRoom/createChatRoom": {
    body: paths["/api/v1/chatRoom/createChatRoom"]["post"]["requestBody"]["content"]["application/json"];
    result: paths["/api/v1/chatRoom/createChatRoom"]["post"]["responses"]["200"]["content"]["application/json"];
  };
  "/api/v1/chatRoom/createLeaf": {
    body: paths["/api/v1/chatRoom/createLeaf"]["post"]["requestBody"]["content"]["application/json"];
    result: paths["/api/v1/chatRoom/createLeaf"]["post"]["responses"]["200"]["content"]["application/json"];
  };
  "/api/v1/chatRoom/deleteChatRoom": {
    body: paths["/api/v1/chatRoom/deleteChatRoom"]["post"]["requestBody"]["content"]["application/json"];
    result: paths["/api/v1/chatRoom/deleteChatRoom"]["post"]["responses"]["204"]["content"];
  };
  "/api/v1/chatRoom/getChatRoom": {
    query: paths["/api/v1/chatRoom/getChatRoom"]["get"]["parameters"]["query"];
    result: paths["/api/v1/chatRoom/getChatRoom"]["get"]["responses"]["200"]["content"]["application/json"];
  };
  "/api/v1/chatRoom/getTimeline": {
    query: paths["/api/v1/chatRoom/getTimeline"]["get"]["parameters"]["query"];
    result: paths["/api/v1/chatRoom/getTimeline"]["get"]["responses"]["200"]["content"]["application/json"];
  };
  "/api/v1/chatRoom/searchChatRooms": {
    query: paths["/api/v1/chatRoom/searchChatRooms"]["get"]["parameters"]["query"];
    result: paths["/api/v1/chatRoom/searchChatRooms"]["get"]["responses"]["200"]["content"]["application/json"];
  };
  "/api/v1/echo": {
    get: {
      query: paths["/api/v1/echo"]["get"]["parameters"]["query"];
      result: paths["/api/v1/echo"]["get"]["responses"]["200"]["content"]["application/json"];
    };
    post: {
      body: paths["/api/v1/echo"]["post"]["requestBody"]["content"]["application/json"];
      result: paths["/api/v1/echo"]["post"]["responses"]["200"]["content"]["application/json"];
    };
  };
  "/api/v1/leaf/createLeaf": {
    body: paths["/api/v1/leaf/createLeaf"]["post"]["requestBody"]["content"]["application/json"];
    result: paths["/api/v1/leaf/createLeaf"]["post"]["responses"]["200"]["content"]["application/json"];
  };
  "/api/v1/leaf/deleteLeaf": {
    body: paths["/api/v1/leaf/deleteLeaf"]["post"]["requestBody"]["content"]["application/json"];
    result: paths["/api/v1/leaf/deleteLeaf"]["post"]["responses"]["204"]["content"];
  };
  "/api/v1/leaf/getLeaf": {
    query: paths["/api/v1/leaf/getLeaf"]["get"]["parameters"]["query"];
    result: paths["/api/v1/leaf/getLeaf"]["get"]["responses"]["200"]["content"]["application/json"];
  };
  "/api/v1/leaf/searchLeafs": {
    query: paths["/api/v1/leaf/searchLeafs"]["get"]["parameters"]["query"];
    result: paths["/api/v1/leaf/searchLeafs"]["get"]["responses"]["200"]["content"]["application/json"];
  };
  "/api/v1/user/deleteUser": {
    body: paths["/api/v1/user/deleteUser"]["post"]["requestBody"]["content"]["application/json"];
    result: paths["/api/v1/user/deleteUser"]["post"]["responses"]["204"]["content"];
  };
  "/api/v1/user/followUser": {
    body: paths["/api/v1/user/followUser"]["post"]["requestBody"]["content"]["application/json"];
    result: paths["/api/v1/user/followUser"]["post"]["responses"]["204"]["content"];
  };
  "/api/v1/user/listFollowing": {
    query: paths["/api/v1/user/listFollowing"]["get"]["parameters"]["query"];
    result: paths["/api/v1/user/listFollowing"]["get"]["responses"]["200"]["content"]["application/json"];
  };
  "/api/v1/user/listFollowedBy": {
    query: paths["/api/v1/user/listFollowedBy"]["get"]["parameters"]["query"];
    result: paths["/api/v1/user/listFollowedBy"]["get"]["responses"]["200"]["content"]["application/json"];
  };
  "/api/v1/user/getHomeTimeline": {
    query: paths["/api/v1/user/getHomeTimeline"]["get"]["parameters"]["query"];
    result: paths["/api/v1/user/getHomeTimeline"]["get"]["responses"]["200"]["content"]["application/json"];
  };
  "/api/v1/user/getUser": {
    query: paths["/api/v1/user/getUser"]["get"]["parameters"]["query"];
    result: paths["/api/v1/user/getUser"]["get"]["responses"]["200"]["content"]["application/json"];
  };
  "/api/v1/user/searchUsers": {
    query: paths["/api/v1/user/searchUsers"]["get"]["parameters"]["query"];
    result: paths["/api/v1/user/searchUsers"]["get"]["responses"]["200"]["content"]["application/json"];
  };
  "/api/v1/user/unfollowUser": {
    body: paths["/api/v1/user/unfollowUser"]["post"]["requestBody"]["content"]["application/json"];
    result: paths["/api/v1/user/unfollowUser"]["post"]["responses"]["204"]["content"];
  };
};
