
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/": {
        "get": {
          "operationId": "AppController_getHello",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Hello World!!22!"
            },
            "500": {
              "description": "crash - server"
            }
          },
          "tags": [
            "test-server"
          ]
        }
      },
      "/auth/registration": {
        "post": {
          "operationId": "AuthController_registration",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "login": "string Length(3, 10)",
                    "password": "string Length(6, 20)",
                    "email": "string ^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
                  }
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Input data is accepted. Email with confirmation code will be send to passed email address"
            },
            "400": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "registration"
          ]
        }
      },
      "/auth/registration-confirmation": {
        "post": {
          "operationId": "AuthController_registrationConformation",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "code": "string"
                  }
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Email was verified. Account was activated"
            },
            "400": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "registration"
          ]
        }
      },
      "/auth/registration-email-resending": {
        "post": {
          "operationId": "AuthController_registrationEmailResending",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "email": "string"
                  }
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Input data is accepted. Email with confirmation code will be send to passed email address."
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "registration"
          ]
        }
      },
      "/auth/login": {
        "post": {
          "operationId": "AuthController_login",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "loginOrEmail": "string",
                    "password": "string"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Returns JWT accessToken + cookie refreshToken (http-only, secure)",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "accessToken": "string"
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "If the password or login is wrong"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "registration"
          ]
        }
      },
      "/auth/refresh-token": {
        "post": {
          "operationId": "AuthController_refreshToken",
          "parameters": [],
          "responses": {
            "401": {
              "description": "If the JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "registration"
          ]
        }
      },
      "/auth/logout": {
        "post": {
          "operationId": "AuthController_logout",
          "parameters": [],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "If the JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "registration"
          ]
        }
      },
      "/auth/password-recovery": {
        "post": {
          "operationId": "AuthController_passwordRecovery",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EmailValidation"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Even if current email is not registered (for prevent user's email detection)"
            },
            "400": {
              "description": "If the inputModel has invalid email (for example 222^gmail.com)"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "registration"
          ]
        }
      },
      "/auth/new-password": {
        "post": {
          "operationId": "AuthController_newPassword",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NewPasswordRecoveryInput"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Even if current email is not registered (for prevent user's email detection)"
            },
            "400": {
              "description": "If the inputModel has invalid email (for example 222^gmail.com)"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "registration"
          ]
        }
      },
      "/auth/me": {
        "get": {
          "operationId": "AuthController_me",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "email": "string",
                      "login": "string",
                      "userId": "string"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "registration"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogs": {
        "get": {
          "operationId": "BlogsController_getBlogs",
          "parameters": [
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "searchNameTerm",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "type": "params Object"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "type": "asc || desc"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "return all Bloggers",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/DTO_Blogger"
                  }
                }
              }
            }
          },
          "tags": [
            "blogs"
          ]
        }
      },
      "/blogs/{blogId}": {
        "get": {
          "operationId": "BlogsController_getBlogId",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/DTO_b"
                  }
                }
              }
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "blogs"
          ]
        }
      },
      "/blogs/{blogId}/posts": {
        "get": {
          "operationId": "BlogsController_getBlogIdPosts",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "type": "asc || desc"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "type": "params Object"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "pagesCount": 0,
                      "page": 0,
                      "pageSize": 0,
                      "totalCount": 0,
                      "items": [
                        {
                          "id": "string",
                          "title": "string",
                          "shortDescription": "string",
                          "content": "string",
                          "blogId": "string",
                          "blogName": "string",
                          "createdAt": "2022-11-09T07:07:44.351Z",
                          "extendedLikesInfo": {
                            "likesCount": 0,
                            "dislikesCount": 0,
                            "myStatus": "None || Like || Dislike",
                            "newestLikes": [
                              {
                                "addedAt": "2022-11-28T16:34:10.328Z",
                                "userId": "string",
                                "login": "string"
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                }
              }
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "blogs"
          ]
        }
      },
      "/posts": {
        "get": {
          "operationId": "PostsController_getPosts",
          "parameters": [
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "type": "params Object"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "type": "asc || desc"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "pagesCount": 0,
                      "page": 0,
                      "pageSize": 0,
                      "totalCount": 0,
                      "items": [
                        {
                          "id": "string",
                          "title": "string",
                          "shortDescription": "string",
                          "content": "string",
                          "blogId": "string",
                          "blogName": "string",
                          "createdAt": "2022-11-21T10:11:46.633Z",
                          "extendedLikesInfo": {
                            "likesCount": 0,
                            "dislikesCount": 0,
                            "myStatus": "None || Like || Dislike",
                            "newestLikes": [
                              {
                                "addedAt": "string",
                                "userId": "string",
                                "login": "string"
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "posts"
          ]
        }
      },
      "/posts/{id}": {
        "get": {
          "operationId": "PostsController_getPostId",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "id": "string",
                      "title": "string",
                      "shortDescription": "string",
                      "content": "string",
                      "blogId": "string",
                      "blogName": "string",
                      "createdAt": "2022-11-28T16:41:06.489Z",
                      "extendedLikesInfo": {
                        "likesCount": 0,
                        "dislikesCount": 0,
                        "myStatus": "None",
                        "newestLikes": [
                          {
                            "addedAt": "2022-11-28T16:41:06.489Z",
                            "userId": "string",
                            "login": "string"
                          }
                        ]
                      }
                    }
                  }
                }
              }
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "posts"
          ]
        }
      },
      "/posts/{postId}/comments": {
        "get": {
          "operationId": "PostsController_getCommentsPostId",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "type": "params Object"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "type": "asc || desc"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "pagesCount": 0,
                      "page": 0,
                      "pageSize": 0,
                      "totalCount": 0,
                      "items": [
                        {
                          "id": "string",
                          "content": "string",
                          "userId": "string",
                          "userLogin": "string",
                          "createdAt": "2022-11-21T10:14:21.053Z",
                          "likesInfo": {
                            "likesCount": 0,
                            "dislikesCount": 0,
                            "myStatus": "None || Like || Dislike"
                          }
                        }
                      ]
                    }
                  }
                }
              }
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "posts"
          ]
        },
        "post": {
          "operationId": "PostsController_createPostIdComment",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "content": "string length 20-300"
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created post",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "id": "string",
                      "content": "string",
                      "userId": "string",
                      "userLogin": "string",
                      "createdAt": "2022-11-21T10:15:36.069Z",
                      "likesInfo": {
                        "likesCount": 0,
                        "dislikesCount": 0,
                        "myStatus": "None"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "If post with specified postId doesn't exists"
            }
          },
          "tags": [
            "posts"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/posts/{postId}/like-status": {
        "put": {
          "operationId": "PostsController_likeStatusPost",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "likeStatus": "Like || None || Dislike"
                  }
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "ok"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "not found postId"
            }
          },
          "tags": [
            "posts"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/comments/{id}": {
        "get": {
          "operationId": "CommentsController_getComments",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "id": "string",
                      "content": "string",
                      "userId": "string",
                      "userLogin": "string",
                      "createdAt": "2022-11-21T10:22:31.318Z",
                      "likesInfo": {
                        "likesCount": 0,
                        "dislikesCount": 0,
                        "myStatus": "None || Like || Dislike"
                      }
                    }
                  }
                }
              }
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "comments"
          ]
        },
        "delete": {
          "operationId": "CommentsController_deleteCommentId",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If try delete the comment that is not your own"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "comments"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/comments/{commentId}": {
        "put": {
          "operationId": "CommentsController_updateCommentId",
          "parameters": [
            {
              "name": "commentId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "content": "string length 20-300"
                  }
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If try edit the comment that is not your own"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "comments"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/comments/{commentId}/like-status": {
        "put": {
          "operationId": "CommentsController_likeStatus",
          "parameters": [
            {
              "name": "commentId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "likeStatus": "None || Like || Dislike"
                  }
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "ok"
            },
            "400": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "comments"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/security/devices": {
        "get": {
          "operationId": "DevicesAuthController_getDeviseActive",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "example": [
                      {
                        "ip": "string",
                        "title": "string",
                        "lastActiveDate": "string",
                        "deviceId": "string"
                      }
                    ]
                  }
                }
              }
            },
            "401": {
              "description": "If the JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "Devices auth"
          ]
        },
        "delete": {
          "operationId": "DevicesAuthController_getDevises",
          "parameters": [],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "If the JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "Devices auth"
          ]
        }
      },
      "/security/devices/{deviceId}": {
        "delete": {
          "operationId": "DevicesAuthController_getDeviseId",
          "parameters": [
            {
              "name": "deviceId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "If the JWT refreshToken inside cookie is missing, expired or incorrect"
            },
            "403": {
              "description": "If try to delete the deviceId of other user"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Devices auth"
          ]
        }
      },
      "/blogger/blogs": {
        "get": {
          "operationId": "BloggerController_getBlogs",
          "parameters": [
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "searchNameTerm",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "type": "params Object"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "type": "asc || desc"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Returns the newly created blog",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "pagesCount": 0,
                      "page": 0,
                      "pageSize": 0,
                      "totalCount": 0,
                      "items": [
                        {
                          "id": "string",
                          "name": "string",
                          "description": "string",
                          "websiteUrl": "string",
                          "createdAt": "2022-12-12T15:27:28.350Z"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "For Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "post": {
          "operationId": "BloggerController_createBlogs",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "name": "string Length(0, 15)",
                    "description": "string Length(0, 500)",
                    "websiteUrl": "string Length(0, 100) pattern ^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$\n"
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created blog",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "id": "string",
                      "name": "string",
                      "description": "string",
                      "websiteUrl": "string",
                      "createdAt": "2022-11-08T08:53:15.121Z"
                    }
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "For Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogger/blogs/comments": {
        "get": {
          "operationId": "BloggerController_getComments",
          "parameters": [
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "type": "params Object"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "type": "asc || desc"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Returns the newly created blog",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "pagesCount": 0,
                      "page": 0,
                      "pageSize": 0,
                      "totalCount": 0,
                      "items": [
                        {
                          "id": "string",
                          "content": "string",
                          "createdAt": "2022-12-12T15:35:17.563Z",
                          "likesInfo": {
                            "likesCount": 0,
                            "dislikesCount": 0,
                            "myStatus": "None"
                          },
                          "commentatorInfo": {
                            "userId": "string",
                            "userLogin": "string"
                          },
                          "postInfo": {
                            "id": "string",
                            "title": "string",
                            "blogId": "string",
                            "blogName": "string"
                          }
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "For Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogger/blogs/{blogId}": {
        "put": {
          "operationId": "BloggerController_updateBlogger",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "name": "string maxLength: 15",
                    "description": "string maxLength: 500",
                    "websiteUrl": "string Length(0, 100) pattern ^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$\n"
                  }
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            }
          },
          "tags": [
            "For Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "BloggerController_deleteBlogger",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "For Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogger/blogs/{blogId}/posts": {
        "post": {
          "operationId": "BloggerController_createBloggerPost",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "title": "string maxLength: 30",
                    "shortDescription": "string maxLength: 100",
                    "content": "string maxLength: 1000"
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "id": "string",
                      "title": "string",
                      "shortDescription": "string",
                      "content": "string",
                      "blogId": "string",
                      "blogName": "string",
                      "createdAt": "2022-12-12T15:39:12.106Z",
                      "extendedLikesInfo": {
                        "likesCount": 0,
                        "dislikesCount": 0,
                        "myStatus": "None",
                        "newestLikes": [
                          {
                            "addedAt": "2022-12-12T15:39:12.106Z",
                            "userId": "string",
                            "login": "string"
                          }
                        ]
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not found"
            }
          },
          "tags": [
            "For Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogger/blogs/{blogId}/posts/{postId}": {
        "put": {
          "operationId": "BloggerController_updateBloggerPost",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/blogUpdateValue"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No content"
            },
            "400": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not found"
            }
          },
          "tags": [
            "For Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "BloggerController_deleteBloggerPost",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not found"
            }
          },
          "tags": [
            "For Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogger/users/blog/{id}": {
        "get": {
          "operationId": "BloggerController_getUserBan",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "searchLoginTerm",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "type": "params Object"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "type": "asc || desc"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Return all ban Users",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "pagesCount": 0,
                      "page": 0,
                      "pageSize": 0,
                      "totalCount": 0,
                      "items": [
                        {
                          "id": "string",
                          "login": "string",
                          "banInfo": {
                            "isBanned": true,
                            "banDate": "2022-12-12T16:12:26.872Z",
                            "banReason": "string"
                          }
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "For Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogger/users/{id}/ban": {
        "put": {
          "operationId": "BloggerController_banUser",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "isBanned": "true - for ban user, false - for unban user",
                    "banReason": "string minLength: 20",
                    "blogId": "string"
                  }
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "User ID that should be banned / unbanned"
            },
            "400": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "For Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/sa/users": {
        "get": {
          "operationId": "SuperAdminController_getUsers",
          "parameters": [
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "type": "params Object"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "type": "asc || desc"
              }
            },
            {
              "name": "searchLoginTerm",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "searchEmailTerm",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "banStatus",
              "required": false,
              "in": "query",
              "schema": {
                "type": "all || banned || notBanned"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "pagesCount": 0,
                      "page": 0,
                      "pageSize": 0,
                      "totalCount": 0,
                      "items": [
                        {
                          "id": "string",
                          "login": "string",
                          "email": "string",
                          "createdAt": "2022-12-12T17:49:24.472Z",
                          "banInfo": {
                            "isBanned": true,
                            "banDate": "2022-12-12T17:49:24.472Z",
                            "banReason": "string"
                          }
                        }
                      ]
                    }
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Super Admin"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        },
        "post": {
          "operationId": "SuperAdminController_createUser",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "login": "string",
                    "password": "string",
                    "email": "string"
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "id": "string",
                      "login": "string",
                      "email": "string",
                      "createdAt": "2022-12-12T17:54:37.400Z",
                      "banInfo": {
                        "isBanned": true,
                        "banDate": "2022-12-12T17:54:37.400Z",
                        "banReason": "string"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Super Admin"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/sa/users/{id}/ban": {
        "put": {
          "operationId": "SuperAdminController_banUser",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "isBanned": "true || false",
                    "banReason": "string minLength: 20"
                  }
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Super Admin"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/sa/users/{id}": {
        "delete": {
          "operationId": "SuperAdminController_deleteUser",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "not found postId"
            }
          },
          "tags": [
            "Super Admin"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/sa/blogs": {
        "get": {
          "operationId": "SuperAdminController_getBlogs",
          "parameters": [
            {
              "name": "searchNameTerm",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "type": "params Object"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "type": "asc || desc"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "No Content",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "pagesCount": 0,
                      "page": 0,
                      "pageSize": 0,
                      "totalCount": 0,
                      "items": [
                        {
                          "id": "string",
                          "name": "string",
                          "description": "string",
                          "websiteUrl": "string",
                          "createdAt": "2022-12-12T17:58:21.002Z",
                          "blogOwnerInfo": {
                            "userId": "string",
                            "userLogin": "string"
                          },
                          "banInfo": {
                            "isBanned": true,
                            "banDate": "2022-12-12T17:58:21.002Z"
                          }
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Super Admin"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/sa/blogs/{id}/ban": {
        "put": {
          "operationId": "SuperAdminController_updateIdBanBlog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "example": {
                    "isBanned": "true || false -boolean"
                  }
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Super Admin"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/sa/blogs/{id}/bind-with-user/{userId}": {
        "put": {
          "operationId": "SuperAdminController_bindBlogs",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Super Admin"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      }
    },
    "info": {
      "title": "\"Study, study and study again.\" @ Lenin",
      "description": "educational API description",
      "version": "1.0",
      "contact": {}
    },
    "tags": [
      {
        "name": "blogs",
        "description": ""
      }
    ],
    "servers": [],
    "components": {
      "securitySchemes": {
        "basic": {
          "type": "http",
          "scheme": "basic"
        },
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        }
      },
      "schemas": {
        "EmailValidation": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            }
          },
          "required": [
            "email"
          ]
        },
        "NewPasswordRecoveryInput": {
          "type": "object",
          "properties": {
            "newPassword": {
              "type": "string"
            },
            "recoveryCode": {
              "type": "string"
            }
          },
          "required": [
            "newPassword",
            "recoveryCode"
          ]
        },
        "DTO_b": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "websiteUrl": {
              "type": "string"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string"
            }
          },
          "required": [
            "id",
            "name",
            "description",
            "websiteUrl",
            "createdAt"
          ]
        },
        "DTO_Blogger": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "number"
            },
            "page": {
              "type": "number"
            },
            "pageSize": {
              "type": "number"
            },
            "totalCount": {
              "type": "number"
            },
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/DTO_b"
              }
            }
          },
          "required": [
            "totalCount",
            "items"
          ]
        },
        "blogUpdateValue": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "shortDescription": {
              "type": "string"
            },
            "content": {
              "type": "string"
            }
          },
          "required": [
            "title",
            "shortDescription",
            "content"
          ]
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
